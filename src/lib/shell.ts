/* Applying one design to 451 pages that were written as 451 separate sites.
 *
 * The obvious approach -- rewrite every body to a common structure -- is the
 * one tools/to-astro.mjs refused, and it was right to: 255 of the pages mark
 * no boundary between lesson and furniture, so any rule for splitting them is
 * a guess, and a wrong guess drops lesson prose that nothing would catch.
 *
 * This does the opposite. The bodies in src/body/ are never edited; they stay
 * byte-for-byte what the seminary wrote. At build time two things happen to
 * them, both of which are reversible and both of which are checked:
 *
 *   1. The title block is lifted out to become the masthead. That block is
 *      unambiguous -- it is the element holding the first <h1>, and it sits at
 *      the top of the page, before any lesson.
 *   2. Navigation, language toggles, registration cards and footer links are
 *      removed, because the layout now renders those once, correctly, for
 *      every page. These are the only removals, they are listed by name below,
 *      and every one of them is furniture: no lesson text lives in them.
 *
 * Everything else is passed through untouched and restyled by one stylesheet.
 *
 * The guard is tools/prose-baseline.mjs: 22,181 recorded text blocks that must
 * still be present in the built page. Anything this file drops by accident
 * fails the build check by name and by text.
 */
import { parse, type HTMLElement } from 'node-html-parser';

/* Furniture the layout now owns. Matched on the element's own id or class --
 * never on position -- so a page that happens to order things differently is
 * still handled. Each entry was read before it was added; see the inventory in
 * the commit that introduced this file. */
const CHROME = [
  // unit navigation, in its five spellings
  '.nav-bar', 'nav.unitnav', '#unitnav', 'nav.cts-unitnav', '.cts-unitnav',
  '#unitNav', '.unit-nav', '.nav-links', '.navrow', '.nav-next', '.foot-nav',
  '.toolbar', '.topbar', '.controls-bar',
  /* The row of unit circles the engine used to paint into the page. The
     sticky nav now shows the same eleven numbers with the same completed
     state, six inches higher up, so keeping this puts two identical unit
     navigators on every page. .progress-section is not this: it carries a
     percentage bar and a count, which the nav does not show. */
  '.progress-grid', '#progress-grid', '#progressGrid', '#progress-units',
  /* Empty greeting placeholders. The layout renders one #greeting on every
     page; these are the slots the old per-page engines wrote into, and they
     are empty <div>s and <span>s. Left in place they win over the layout's --
     the engine tried them first -- so 29 pages put the greeting in their own
     element while the layout's sat blank. */
  '#studentGreeting', '#student-greeting', '#greet', '#t-greet',
  // language controls
  '.langbar', '.lang-toggle-group', '.lang-toggle', '.lang-buttons',
  '#langToggleBtn', '.langbtn', 'button.lang-btn',
  // links and buttons the nav now provides
  '#catalogLink', '#clearDataBtn', '#clearExamDataBtn',
  // registration, now rendered once by the layout
  '#regCard', '#registrationCard', '#regPanel', '#registrationBar',
  '#registrationSection', '#registration-card', '#reg-card',
  '.registration-panel', '.registration-bar', '.registration-section',
  '#regWarn', '#reg-warn', '#regWarning', '.reg-warn', '.reg-warning',
  '#regModal', '#reg-modal', '.reg-modal', '#reg.modal', '.modal-back',
  // page-level header and footer chrome
  'header.site', 'header.masthead', 'header.unit', '.seminary-header',
  'footer.unit-nav', 'body > footer', 'body > header',
];

/* Elements that look like chrome by name but carry lesson content. Checked by
 * reading them, not by guessing: .steps-list is Drakeford's ten steps,
 * .word-header is the Hebrew word under study, .progress-* is the student's
 * own progress and stays on the page. */
const KEEP = new Set(['steps-list', 'word-header',
  'progress-section', 'progress-bar', 'exam-header', 'quiz-header']);

/* One name per control.
 *
 * The 451 courses were built independently and named their exam controls
 * however they liked, so cts-engine.js carried alias lists: five spellings of
 * the submit button, five of reset, twenty-four of the result area. Aliasing
 * let every page keep its own markup, which was the right trade while the
 * pages were being consolidated. It stopped being right once one layout
 * rendered all of them: a new page can pick any of the five names, or a sixth
 * that silently resolves to nothing, and the engine's fallback -- matching the
 * button by its English or Spanish label -- meant a translator could move a
 * control by rewording it.
 *
 * The rename happens here rather than in src/body/, for the same reason the
 * masthead is lifted here: those files stay byte-for-byte what the seminary
 * wrote. Only the built page is uniform.
 *
 * The inline onclick goes with it. Every one of them calls an engine global
 * (grade(), gradeSA(), submitUnit(n)) which is the same submit() the engine
 * binds, so it was never a fallback -- without the engine it is a
 * ReferenceError, not a working button -- and having both is what made 43
 * pages run submit() twice and replace a student's score with "Locked".
 */
const CONTROL_IDS: Record<string, (string | RegExp)[]> = {
  submitExamBtn: ['submitBtn', 'completeBtn', 'submit-btn', 'btnSubmit'],
  resetExamBtn: ['resetBtn', 'btnReset', 'reset-btn'],
  /* The result area. Aliases are listed in the order cts-engine.js used to try
     them, so the element that wins here is the one the engine was already
     writing into -- the rename changes the name, never which element.
     lockout-timer is included deliberately: on CTSHermeneutics it is an empty
     <div class="timer"> and the only result-ish element on the page, and the
     engine has always used it as the result area. result_<n> is CTSCS, which
     suffixes its ids per unit; folding them in stops that course being the one
     place a per-unit id lookup is still needed. */
  examResult: ['examStatus', 'exam-result', 'statusMsg', 'exam-status', 'mcResult',
               'resultBox', 'score', /^result_\d+$/, 'result', 'lockoutTimer', 'lockout-timer'],
  /* The question containers. Same rule and same order as the result area.
     The short names -- mc, mcq, sa -- were checked before being treated as
     aliases: on every page that has one it is a <div> holding that section's
     questions, nothing else uses those ids, and no body contains a duplicate
     id. mcq_<n> / essay_<n> are CTSCS again. */
  questionsContainer: ['mcContainer', 'mcWrap', 'mcBlock', 'mcqArea', 'mcQuestions',
                       'mcArea', 'mc-questions', 'mc-container', 'mcq',
                       /^mcq_\d+$/, /^mc_\d+$/, 'mc'],
  kwContainer: ['saWrap', 'saBlock', 'saQuestions', 'saArea', 'kw-questions',
                'saContainer', 'sa-container', /^essay_\d+$/, /^sa_\d+$/, 'sa'],
};

/* One class per concept.
 *
 * cts.css was written to accept whatever the 451 courses already called
 * things, so its selectors read as alias lists: `.card,.box,.sec,
 * .lesson-section,.teaching,.teaching-block` is one surface under six names.
 * That was the right trade when the stylesheet had to land on pages nobody was
 * editing. It has the same cost the id aliases had: a new page can pick any of
 * the six, or a seventh that is styled by nothing, and the page looks almost
 * right.
 *
 * Renamed here, at build time, for the same reason as the ids -- src/body/
 * stays what the seminary wrote.
 *
 * What is NOT in here matters as much as what is:
 *
 *   lang-en, lang-es, lang-both, en-only, es-only, block-en/es, en-lbl/es-lbl,
 *   pane.en/es, teach-en/es   -- the bilingual convention. cts-engine.js,
 *                                cts-lang.js and cts-genesis-engine.js all
 *                                read these. Renaming one breaks the site in
 *                                Spanish.
 *   option, active, done       -- written by the engine onto elements it
 *                                renders; they never appear in a body.
 *   cts-locked, course         -- the catalog's, read by cts-curriculum.js.
 *   cert-seal, seal, cts-emblem-- certificates, read by cts-emblem.js.
 *   menu, tg, cur              -- the track widget builds its own.
 *   hidden, hide               -- behaviour, not appearance.
 *
 * Every one of those was checked against the scripts that read it, because the
 * last time I assumed the coupling rather than measuring it I was wrong.
 */
const CLASS_ALIASES: Record<string, string[]> = {
  card: ['box', 'sec', 'lesson-section', 'teaching', 'teaching-block'],
  btn: ['nav-btn', 'toggle-btn', 'submit-exam', 'clear-btn', 'reset-btn', 'btn-reset'],
  actions: ['action-buttons', 'exam-controls', 'controls-bar'],
  scripture: ['pull-quote', 'epigraph', 'verse', 'passage'],
  note: ['translation-note', 'nl', 'sa-note'],
  illustration: ['cts-figure'],
  exam: ['exam-section', 'mc-section', 'sa-section'],
  'exam-status': ['status', 'lockout-timer'],
  /* .ref and .passage-label are NOT the same thing and are not merged: a ref
     is the citation under a quotation, a passage-label the small uppercase
     heading above a passage. Merging them would have put 14 citations in
     uppercase. */
};

/* alias -> canonical, flattened once. */
const CLASS_CANON = new Map<string, string>();
for (const [canonical, aliases] of Object.entries(CLASS_ALIASES))
  for (const a of aliases) CLASS_CANON.set(a, canonical);

function normaliseClasses(root: HTMLElement): void {
  for (const el of root.querySelectorAll('[class]')) {
    const had = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
    if (!had.some((c) => CLASS_CANON.has(c))) continue;
    const out: string[] = [];
    for (const c of had) {
      const to = CLASS_CANON.get(c) || c;
      if (!out.includes(to)) out.push(to);      // `class="card sec"` is one card
    }
    el.setAttribute('class', out.join(' '));
  }
}

/* Controls the engine binds a listener to. An inline onclick on one of these
   calls the same engine function the listener does, so keeping both runs it
   twice; see the note above. Containers are not in this set -- nothing is
   bound to them and an onclick there would be the page's own business. */
const ENGINE_BOUND = new Set(['submitExamBtn', 'resetExamBtn']);

function normaliseControls(root: HTMLElement, removed: string[]): void {
  for (const [canonical, aliases] of Object.entries(CONTROL_IDS)) {
    // A page already using the canonical name is left alone. None uses both:
    // checked across all 451, and no body contains a duplicate id at all.
    if (!root.querySelector('#' + canonical)) {
      for (const alias of aliases) {
        const el = typeof alias === 'string'
          ? root.querySelector('#' + alias)
          : root.querySelectorAll('[id]').find((n) => alias.test(n.getAttribute('id') || ''));
        if (!el) continue;
        removed.push(`#${el.getAttribute('id')} -> #${canonical}`);
        el.setAttribute('id', canonical);
        break;                      // first match wins, in the engine's order
      }
    }
    if (!ENGINE_BOUND.has(canonical)) continue;
    const el = root.querySelector('#' + canonical);
    if (el && el.getAttribute('onclick')) {
      removed.push(`#${canonical}[onclick] (the engine binds this control)`);
      el.removeAttribute('onclick');
    }
  }
}

export interface Shell {
  masthead: string;   // html for the coloured header band
  content: string;    // everything else, restyled but not rewritten
  removed: string[];  // what was taken out, for the build log and the checks
}

function selectorOf(el: HTMLElement): string {
  const id = el.getAttribute('id');
  const cls = (el.getAttribute('class') || '').trim();
  return el.rawTagName + (id ? '#' + id : '') + (cls ? '.' + cls.split(/\s+/).join('.') : '');
}

/* The title block. On 291 pages it is an unnamed .card, on the rest a named
 * header; in both cases it is the element that directly holds the first <h1>.
 * Two courses open with no <h1> at all, and there the layout falls back to the
 * unit's recorded title rather than inventing a heading. */
function titleBlock(root: HTMLElement): HTMLElement | null {
  const h1 = root.querySelector('h1');
  if (!h1) return null;
  let el = h1.parentNode as HTMLElement | null;
  if (!el || !el.rawTagName) return null;
  // A two-column bilingual header puts each language in its own pane; the
  // block is the header holding both, not one language's half.
  const cls = el.getAttribute('class') || '';
  if (/\b(pane|block-en|block-es|col)\b/.test(cls) && el.parentNode?.rawTagName) {
    el = el.parentNode as HTMLElement;
  }
  // Only lift it if nothing substantial comes before it. A page whose first
  // <h1> arrives after a page of prose is using it as a section heading, and
  // lifting that into the masthead would move lesson text into the chrome.
  const before = root.text.slice(0, root.text.indexOf(h1.text));
  if (before.replace(/\s+/g, ' ').trim().length > 400) return null;
  return el;
}

export function shell(bodyHtml: string): Shell {
  const root = parse(bodyHtml, { blockTextElements: { script: false, style: false } });
  const removed: string[] = [];

  /* Two links the layout now provides for every page: the skip link, and the
     "Catalog / Catálogo" link back to the front page. The catalog link was
     written inline, with its own colours, on most of the 451 pages -- which is
     why it survived a removal list keyed on classes and ids, and why it landed
     in the middle of the lesson once the chrome around it was gone. */
  for (const a of root.querySelectorAll('a')) {
    const href = (a.getAttribute('href') || '').trim();
    const t = a.text.trim().toLowerCase();
    const skip = href.startsWith('#') && /skip|saltar|ir al contenido/.test(t);
    const catalog = /^(\.\/)?index\.html(#.*)?$/.test(href) && t.length < 40 &&
                    /catalog|catálogo|catalogo|courses|cursos|inicio|home/.test(t);
    if (skip || catalog) {
      removed.push(selectorOf(a));
      a.remove();
    }
  }

  /* Furniture goes first, so that "is anything before the title" is asked of
     the lesson and not of a registration card that happened to sit above it.
     On 38 pages the title lives inside header.site, which is otherwise
     furniture: an element holding the page's only <h1> is spared here and
     lifted into the masthead below. */
  const h1 = root.querySelector('h1');
  for (const sel of CHROME) {
    for (const el of root.querySelectorAll(sel)) {
      const cls = (el.getAttribute('class') || '').split(/\s+/);
      if (cls.some((c) => KEEP.has(c))) continue;
      if (h1 && (el === h1 || el.querySelector('h1') === h1)) continue;
      removed.push(selectorOf(el));
      el.remove();
    }
  }

  /* 31 bodies carry their own <link rel=stylesheet> inline. A link in the
     body still applies, and it lands after cts.css, so those pages quietly
     kept their old design while every other page changed -- the kind of
     difference nobody notices until a student mentions it months later. */
  for (const link of root.querySelectorAll('link')) {
    if (/stylesheet/i.test(link.getAttribute('rel') || '')) {
      removed.push(selectorOf(link) + '[' + link.getAttribute('href') + ']');
      link.remove();
    }
  }

  normaliseControls(root, removed);
  normaliseClasses(root);

  /* A language toggle the CHROME list missed, because it is identified by
     neither id nor a class anyone else uses: <button class="toggle"
     onclick="toggleLang()">. Eleven pages carry one inside their title block,
     so it rode into the masthead and sat there as a second language control
     under the h1, duplicating the nav's English/Español/Both. Matched on what
     it does rather than what it is called. */
  for (const b of root.querySelectorAll('button')) {
    if (/\b(toggleLang|setLang)\s*\(/.test(b.getAttribute('onclick') || '')) {
      removed.push(selectorOf(b) + ' (duplicate language control)');
      b.remove();
    }
  }

  const title = titleBlock(root);
  let masthead = '';
  if (title) {
    /* The title block keeps its markup but loses its inline colours. Several
       courses set a colour on the epigraph that matched their old cream page
       -- 1 Peter's is #2f4f2f, dark green -- and on the masthead's dark ground
       that text is still there, still read by a screen reader, and invisible.
       Inline styles beat any stylesheet, so this is removed at the source
       rather than fought with !important. */
    for (const el of title.querySelectorAll('[style]')) {
      const kept = (el.getAttribute('style') || '')
        .split(';')
        .filter((d) => d.trim() && !/^\s*(color|background(-color)?|border-[a-z-]*color)\s*:/i.test(d))
        .join(';');
      if (kept.trim()) el.setAttribute('style', kept);
      else el.removeAttribute('style');
    }
    masthead = title.innerHTML;
    title.remove();
  }

  // Empty wrappers left behind once their contents were furniture.
  for (const el of root.querySelectorAll('div,section,header,footer,nav')) {
    if (el.childNodes.length === 0 && !el.getAttribute('id')) el.remove();
  }

  // The remaining container is now redundant: the layout supplies the column.
  for (const el of root.querySelectorAll('.container')) {
    el.setAttribute('class',
      (el.getAttribute('class') || '').split(/\s+/).filter((c) => c !== 'container').join(' '));
  }

  return { masthead, content: root.toString(), removed };
}
