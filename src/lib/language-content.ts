import { parse, type HTMLElement } from 'node-html-parser';
import { PARTIALS } from './partials.ts';
import type { Lesson } from './lesson.ts';

export const LANGUAGES = ['en', 'es', 'fr'];
export const NAMES: Record<string, string> = { en: 'English', es: 'Español', fr: 'Français' };
export const localeHref = (file: string, lang: string) => `/${lang === 'en' ? '' : lang + '/'}${file}`;
const MARKERS: Record<string, string[]> = {
  en: ['lang-en', 'en-only', 'block-en', 'teach-en', 'en-lbl', 'en', 'english'],
  es: ['lang-es', 'es-only', 'block-es', 'teach-es', 'es-lbl', 'es', 'spanish'],
  fr: ['lang-fr', 'fr-only', 'block-fr', 'teach-fr', 'fr-lbl', 'fr'],
};
const classes = (el: HTMLElement) => (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
export function markedLanguage(el: HTMLElement): string | null {
  if (el.tagName === 'BODY' || el.tagName === 'HTML') return null;
  for (const [lang, markers] of Object.entries(MARKERS)) {
    if (classes(el).some(c => markers.includes(c))) return lang;
    if (new RegExp(`-${lang}$`).test(el.id) || el.id === (lang === 'en' ? 'titleEn' : 'titleEs')) return lang;
  }
  return null;
}
function neutral(el: HTMLElement) {
  const cls = classes(el).filter(c => !Object.values(MARKERS).flat().includes(c) && c !== 'hide');
  if (cls.length) el.setAttribute('class', cls.join(' ')); else el.removeAttribute('class');
  const style = (el.getAttribute('style') || '').replace(/(?:^|;)\s*display\s*:[^;]*/gi, '').trim();
  if (style) el.setAttribute('style', style); else el.removeAttribute('style');
  // These legacy ids also hide the language in cts.css. Unit scripts no longer use them.
  if (/^(teach-|sa-note-|sa-badge-|titleEn$|titleEs$|t-title-)/.test(el.id)) el.removeAttribute('id');
}
// Some legacy room scripts update counters nested in language containers.
// Retain empty, hidden id hooks when removing that language's wording.
function eraseLanguage(el: HTMLElement) {
  let root = el; while (root.parentNode) root = root.parentNode;
  const hooks = el.querySelectorAll('[id]').filter(node => !root.querySelectorAll('[id]').some(other =>
    other !== node && other.id === node.id && !other.closest('[hidden]') && !el.querySelectorAll('[id]').includes(other))).map(node => {
    const copy = parse(node.toString(), {parseNoneClosedTags: true}).firstChild as HTMLElement;
    copy.set_content(''); copy.setAttribute('hidden', '');
    return copy.toString();
  });
  if (el.id || hooks.length) { el.set_content(hooks.join('')); el.setAttribute('hidden', ''); }
  else el.remove();
}
export function pairText(target: string | undefined, source: string | undefined, lang: string, sourceLang: string, id?: string) {
  if (/^\s*<(?:td|th)\b/i.test(target || source || '')) {
    const main = parse(target || source || '', {parseNoneClosedTags: true});
    const original = parse(source || '', {parseNoneClosedTags: true});
    const cells = main.childNodes.filter(node => /^(TD|TH)$/.test((node as HTMLElement).tagName || '')) as HTMLElement[];
    const originals = original.childNodes.filter(node => /^(TD|TH)$/.test((node as HTMLElement).tagName || '')) as HTMLElement[];
    if (target && source && cells.length !== originals.length) throw new Error('translated table row has a different number of cells');
    return (id ? `<!--cts-row:${id}-->` : '') + cells.map((cell, index) => {
      const copy = parse(cell.toString(), {parseNoneClosedTags: true}).firstChild as HTMLElement;
      copy.set_content(pairText(target ? cell.innerHTML : undefined, originals[index]?.innerHTML, lang, sourceLang));
      return copy.toString();
    }).join('');
  }
  const fallback = target == null || target === '';
  const main = fallback ? source || '' : target;
  const tag = /<(?:p|div|ul|ol|table|blockquote|section|article|header|footer|aside|figure|details|h[1-6])\b/i.test(main) ? 'div' : 'span';
  const key = id ? ` data-cts-block="${id}"` : '';
  const primary = `<${tag} class="cts-reading" lang="${fallback ? sourceLang : lang}"${fallback ? ' data-cts-fallback="true"' : ''}>${main}</${tag}>`;
  const secondary = lang !== sourceLang && !fallback && source != null && source !== ''
    ? `<${tag} class="cts-source" lang="${sourceLang}">${source}</${tag}>` : '';
  return `<${tag} class="cts-text-pair"${key}>${primary}${secondary}</${tag}>`;
}

// Anchor each block at its source slot (or its existing translation slot when
// it has no source). The block, not the old side-by-side page, defines pairing.
export function renderLanguageLesson(lesson: Lesson, lang: string): string {
  const blocks = new Map(lesson.blocks.map(b => [b.id, b]));
  const anchors = new Map<string, string>();
  for (const m of lesson.template.matchAll(/<!--cts:([\w-]+):([A-Za-z-]+)-->/g)) {
    if (!anchors.has(m[1]) || m[2] === lesson.sourceLang) anchors.set(m[1], m[2]);
  }
  const seen = new Set<string>();
  let html = lesson.template.replace(/<!--cts:([\w-]+):([A-Za-z-]+)-->/g, (_m, id: string, slot: string) => {
    const b = blocks.get(id);
    if (!b) throw new Error(`unknown lesson block ${lesson.course}/${lesson.unit}/${id}`);
    if (anchors.get(id) !== slot || seen.has(id)) return '';
    seen.add(id);
    return pairText(b.text[lang], b.text[lesson.sourceLang], lang, lesson.sourceLang, id);
  });
  if (seen.size !== blocks.size) throw new Error(`orphan lesson blocks in ${lesson.course}/${lesson.unit}`);
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  for (const row of root.querySelectorAll('tr')) {
    const marker = /<!--cts-row:([\w-]+)-->/g;
    const ids = [...row.innerHTML.matchAll(marker)];
    if (ids.length > 1) throw new Error('multiple lesson blocks share a table row');
    if (ids[0]) { row.setAttribute('data-cts-block', ids[0][1]); row.set_content(row.innerHTML.replace(marker, '')); }
  }
  // An empty second-language branch has no content or controls to retain.
  for (const el of root.querySelectorAll('*').reverse()) {
    if (!markedLanguage(el) || el.closest('.cts-text-pair')) continue;
    if (el.hasAttribute('data-cts-block') || el.querySelector('[data-cts-block]')) neutral(el);
    else el.remove();
  }
  html = root.toString();
  html = html.replace(/<!--cts-part:([\w-]+)-->/g, (_m, name: string) => {
    const part = PARTIALS[name];
    if (!part) throw new Error(`unknown lesson partial ${name}`);
    return part({ course: lesson.course, unit: lesson.unit, langs: [lang, lesson.sourceLang] });
  });
  return localizeMarkup(html, lang, lesson.sourceLang);
}

// The remaining page chrome and old static pages use paired language nodes.
// Recursion pairs paragraphs inside whole-language containers, so phones do
// not receive the entire source chapter after the translated chapter.
const FLOW = /^(DIV|SECTION|ARTICLE|HEADER|FOOTER|MAIN|ASIDE|NAV|FIGURE|FIGCAPTION|DETAILS|SUMMARY|P|LI|H[1-6]|UL|OL|DL|DT|DD|BLOCKQUOTE|TABLE|THEAD|TBODY|TFOOT|TR|TD|TH)$/;
function markupGroups(el: HTMLElement) {
  const groups: { kind: string; nodes: typeof el.childNodes }[] = [];
  for (const node of el.childNodes) {
    const tag = (node as HTMLElement).tagName || '';
    if (!tag && !node.rawText.trim()) { if (groups[groups.length - 1]?.kind === 'inline') groups[groups.length - 1].nodes.push(node); continue; }
    if (node.nodeType === 8) continue;
    const kind = FLOW.test(tag) ? tag : 'inline';
    const last = groups[groups.length - 1];
    if (last?.kind === kind) last.nodes.push(node);
    else groups.push({ kind, nodes: [node] });
  }
  return groups;
}
function pairedMarkup(source: HTMLElement, target: HTMLElement | null, lang: string, sourceLang: string): string {
  if (!target) return pairText(undefined, source.innerHTML, lang, sourceLang);
  const a = markupGroups(source), b = markupGroups(target);
  if (a.length && a.length === b.length && a.every((g, i) => g.kind === b[i].kind) && a.some(g => g.kind !== 'inline')) {
    return a.map((group, i) => {
      const other = b[i];
      if (group.kind === 'inline' || group.nodes.length !== other.nodes.length) {
        // Some existing Spanish digests condense several English paragraphs.
        // Keep their whole corresponding run together; never guess which
        // English paragraph was omitted or invent a translation.
        return pairText(other.nodes.map(n => n.toString()).join(''), group.nodes.map(n => n.toString()).join(''), lang, sourceLang);
      }
      return group.nodes.map((node, j) => {
        const copy = parse(node.toString(), {parseNoneClosedTags: true}).firstChild as HTMLElement;
        neutral(copy);
        copy.set_content(pairedMarkup(node as HTMLElement, other.nodes[j] as HTMLElement, lang, sourceLang));
        return copy.toString();
      }).join('\n');
    }).join('\n');
  }
  return pairText(target.innerHTML, source.innerHTML, lang, sourceLang);
}

function hasLanguageAncestor(el: HTMLElement) {
  for (let p = el.parentNode; p; p = p.parentNode) if (markedLanguage(p)) return true;
  return false;
}
export function localizeMarkup(html: string, lang: string, sourceLang = 'en'): string {
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  const nodes = root.querySelectorAll('*').filter(el => markedLanguage(el) === sourceLang
    && !el.closest('[data-cts-legacy-control]')
    && !el.parentNode?.closest('.cts-text-pair')
    && !hasLanguageAncestor(el));
  for (const source of nodes) {
    if (!source.parentNode) continue;
    const siblings = source.parentNode.childNodes.filter(n => (n as HTMLElement).tagName) as HTMLElement[];
    const at = siblings.indexOf(source);
    const following = siblings.slice(at + 1);
    const nextSource = following.findIndex(n => markedLanguage(n) === sourceLang);
    const group = nextSource < 0 ? following : following.slice(0, nextSource);
    const target = lang === sourceLang ? null : group.find(n => markedLanguage(n) === lang) || null;
    source.set_content(pairedMarkup(source, target, lang, sourceLang));
    neutral(source);
    // Remove the other language's copy, even on the source-language page.
    for (const other of group.filter(n => markedLanguage(n) && markedLanguage(n) !== sourceLang)) {
      // Legacy scripts sometimes update these ids after loading. Keep an empty hook.
      eraseLanguage(other);
    }
  }
  // Translation-only fragments have no source partner. Keep their reader text
  // rather than inventing a source. A third-language page uses source fallback.
  for (const el of root.querySelectorAll('*').reverse()) {
    const marked = markedLanguage(el);
    if (!marked || el.closest('.cts-text-pair, [data-cts-legacy-control]')) continue;
    if (marked === lang) { el.set_content(pairText(el.innerHTML, undefined, lang, sourceLang)); neutral(el); }
    else eraseLanguage(el);
  }
  let diagramIndex = 0;
  for (const svg of root.querySelectorAll('svg')) {
    diagramIndex++;
    const pairs = svg.querySelectorAll('.cts-text-pair');
    if (!pairs.length) continue;
    const hasSource = pairs.some(pair => pair.querySelector('.cts-source'));
    const sourceCopy = hasSource ? parse(svg.toString(), {parseNoneClosedTags: true}).firstChild as HTMLElement : null;
    for (const pair of pairs) {
      const reader = pair.querySelector('.cts-reading');
      pair.set_content(`<tspan class="cts-reading" lang="${reader?.getAttribute('lang') || lang}">${reader?.innerHTML || ''}</tspan>`);
      pair.rawTagName = 'tspan';
    }
    if (sourceCopy) {
      for (const pair of sourceCopy.querySelectorAll('.cts-text-pair')) {
        const wording = pair.querySelector('.cts-source') || pair.querySelector('.cts-reading');
        const id = pair.getAttribute('data-cts-block');
        pair.removeAttribute('data-cts-block');
        if (id) pair.setAttribute('data-cts-source-block', id);
        pair.set_content(wording?.innerHTML || ''); pair.rawTagName = 'tspan';
        pair.removeAttribute('class');
      }
      // Gradients/clip paths in the two diagrams must have distinct ids.
      for (const node of sourceCopy.querySelectorAll('[id]')) {
        const id = node.id; node.setAttribute('id', 'cts-source-' + diagramIndex + '-' + id);
        for (const ref of sourceCopy.querySelectorAll('*')) for (const [attr, value] of Object.entries(ref.attributes))
          if (value.includes(`url(#${id})`)) ref.setAttribute(attr, value.replaceAll(`url(#${id})`, `url(#cts-source-${diagramIndex}-${id})`));
      }
      svg.replaceWith(`<div class="cts-text-pair cts-diagram-pair"><div class="cts-reading" lang="${lang}">${svg.toString()}</div><div class="cts-source" lang="${sourceLang}">${sourceCopy.toString()}</div></div>`);
    }
  }
  return root.toString();
}
