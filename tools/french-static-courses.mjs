/* French drafts for the single-page/static courses that have no collection
 * files: Narrative Preaching, Biblical Counseling and Pastoral & Christian
 * Ethics (WiseSpeak has its own module, tools/french-wisespeak.mjs).
 *
 * Reviewable packets live in _review/french/<Folder>/:
 *   <Folder>-<part>-source.json  English (and Spanish reference) taken from the page
 *   <Folder>-<part>-fr.json      the French draft, marked tr.status "machine"
 *                                with the sha256 of its source packet
 * `node tools/french-static-courses.mjs --extract <course>` rewrites the source
 * packets from the canonical pages; `--check` fails when a page no longer
 * matches its packets.
 *
 * At build time frenchStaticCourse() augments only the /fr/ page: each
 * English block gains a French sibling (the language-page builder pairs them),
 * and the page script receives the French question data and interface text.
 * MC answer indexes, option order, storage keys and the English/Spanish pages
 * are unchanged; English answers stay accepted alongside French. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { parse } from 'node-html-parser';
import { markedLanguage } from '../src/lib/language-content.ts';
import { frenchRuntimeSpans, replaceLiterals, replaceOnce, BI_HELPER, pageChrome } from './french-static-runtime.mjs';
import { chromeBlocks } from './french-wisespeak.mjs';

export const COURSES = {
  narrative: { folder: 'NarrativePreaching', pages: ['CTS_Narrative_Preaching.html'], fill: 'narrative', kind: 'units', prefix: 'np' },
  counseling: { folder: 'Counseling', pages: ['CTSCounseling.html'], fill: 'counseling', kind: 'units', prefix: 'bc' },
  ethics: { folder: 'Ethics', pages: Array.from({ length: 10 }, (_, i) => `ethics_unit${String(i + 1).padStart(2, '0')}.html`), fill: 'ethics', kind: 'ethics', prefix: 'et' },
};
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const norm = s => parse(String(s).replaceAll('\\xa0', ' ')).text.replace(/\s+/g, ' ').trim();
const hasWords = s => /\p{L}{2}/u.test(norm(s));
const FLOW = /^(P|DIV|H[1-6]|BLOCKQUOTE|UL|OL|TABLE|FIGURE|SECTION|ASIDE|DL|PRE|HR)$/;
export const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

function topEnglish(root) {
  return root.querySelectorAll('*').filter(el => {
    if (markedLanguage(el) !== 'en') return false;
    for (let p = el.parentNode; p; p = p.parentNode) if (p.tagName && markedLanguage(p)) return false;
    return true;
  });
}
// A long English container (the Ethics lesson) is translated paragraph by
// paragraph: its block children become blocks and its structure is kept.
function splittable(el) {
  const kids = el.childNodes.filter(n => n.nodeType === 1);
  const text = el.childNodes.filter(n => n.nodeType === 3).map(n => n.rawText).join('').trim();
  return el.tagName === 'DIV' && kids.length >= 3 && !text && kids.every(k => FLOW.test(k.tagName));
}
function unitOf(el) {
  for (let p = el; p; p = p.parentNode) { const m = /^unit(\d+)$/.exec(p.id || ''); if (m) return m[1]; }
  return 'page';
}
/* The page's English blocks in document order: [{part, el, en, children?}] */
function pageBlocks(root, kind, pageUnit) {
  const out = [];
  for (const el of topEnglish(root)) {
    const part = kind === 'ethics' ? String(pageUnit) : unitOf(el);
    if (splittable(el)) out.push({ part, el, children: el.childNodes.filter(n => n.nodeType === 1) });
    else out.push({ part, el });
  }
  return out;
}
function siblingSpanish(el) {
  for (let n = el.nextElementSibling; n; n = n.nextElementSibling) {
    const l = markedLanguage(n); if (l === 'es') return n; if (l === 'en') return null;
  }
  return null;
}
function scriptData(root, kind) {
  const script = root.querySelectorAll('script').find(s => kind === 'ethics' ? s.innerHTML.includes('const mcQuestions') : s.innerHTML.includes('const UNITS = {}'));
  if (!script) throw new Error('no question script');
  if (kind === 'ethics') {
    const code = script.innerHTML;
    const mc = new Function(code.slice(code.indexOf('const mcQuestions'), code.indexOf('// Short-answer')) + ';return mcQuestions;')();
    const kwStart = code.indexOf('const kwQuestions');
    const kw = new Function(code.slice(kwStart, code.indexOf('\n];', kwStart) + 3) + ';return kwQuestions;')();
    const titles = new Function(code.slice(code.indexOf('const unitTitlesEn'), code.indexOf('];', code.indexOf('const unitTitlesEn')) + 2) + ';return unitTitlesEn;')();
    return { script, mc, kw, titles };
  }
  const units = new Function(script.innerHTML.split('const UNITS = {}')[1].split('// ============= STATE =============')[0].replace(/^/, 'const UNITS = {};') + 'return UNITS;')();
  return { script, units };
}
function fillData(key) {
  const window = {};
  new Function('window', fs.readFileSync(`public/assets/js/fill/${key}.js`, 'utf8'))(window);
  return window.CTS_FILL_DATA[key];
}
/* English source packets for one course, keyed by part (unit number or "page"). */
export function extractCourse(key) {
  const c = COURSES[key];
  const parts = {};
  const part = p => parts[p] ??= { course: c.folder, part: p, pages: [], blocks: [], mc: [], fill: [], sa: [] };
  const fills = fillData(c.fill);
  c.pages.forEach((file, pageIndex) => {
    const root = parse(fs.readFileSync('public/' + file, 'utf8'), { comment: true, parseNoneClosedTags: true });
    const pageUnit = pageIndex + 1;
    const counters = {};
    for (const b of pageBlocks(root, c.kind, pageUnit)) {
      const p = part(b.part); if (!p.pages.includes(file)) p.pages.push(file);
      const n = counters[b.part] = (counters[b.part] || 0) + 1;
      const id = `${c.prefix}${b.part === 'page' ? 'p' : b.part}-${String(n).padStart(3, '0')}`;
      const es = siblingSpanish(b.el);
      if (b.children) {
        b.children.forEach((k, j) => { if (hasWords(k.innerHTML)) p.blocks.push({ id: `${id}.${j + 1}`, en: k.innerHTML.trim() }); });
      } else if (hasWords(b.el.innerHTML)) p.blocks.push({ id, en: b.el.innerHTML.trim(), ...(es ? { es_reference: es.innerHTML.trim() } : {}) });
    }
    const data = scriptData(root, c.kind);
    if (c.kind === 'ethics') {
      const p = part(String(pageUnit));
      p.title = data.titles[pageIndex];
      p.mc = data.mc.map(q => ({ stem: q.textEn, options: q.optionsEn, answer: q.correct, why: q.explanationEn, es_reference: { stem: q.textEs, options: q.optionsEs, why: q.explanationEs } }));
      p.sa = data.kw.map(q => ({ prompt: q.textEn, model: q.modelEn, keywords: q.kw_en, es_reference: { prompt: q.textEs, model: q.modelEs, keywords: q.kw_es } }));
      p.fill = (fills[pageUnit] || []).map(q => ({ prompt: q.prompt.en, answer: q.answer.en, accept: q.accept?.en || [] }));
    } else {
      for (const [n, u] of Object.entries(data.units)) {
        const p = part(n);
        p.mc = u.mcq.map(q => ({ stem: q.textEn, options: q.options.map(o => o.en), answer: q.correct, why: q.explainEn, es_reference: { stem: q.textEs, options: q.options.map(o => o.es), why: q.explainEs } }));
        const sa = u.essays || u.shortAnswer || [];
        p.sa = sa.map(q => ({ prompt: q.promptEn ?? q.textEn, model: q.rubricEn ?? q.modelEn ?? '', keywords: q.kw_en || [], es_reference: { prompt: q.promptEs ?? q.textEs, model: q.rubricEs ?? q.modelEs ?? '', keywords: q.kw_es || [] } }));
        p.fill = (fills[n] || []).map(q => ({ prompt: q.prompt.en, answer: q.answer.en, accept: q.accept?.en || [] }));
      }
    }
  });
  return parts;
}
const base = (c, part) => `_review/french/${c.folder}/${c.folder}-${part === 'page' ? 'page' : 'unit' + part}`;
export function sourceText(packet) { return JSON.stringify(packet, null, 1) + '\n'; }

/* ---------- build: French for the /fr/ page ---------- */
const UI = () => json('tools/data/french-static-ui.json');
function loadFrench(key) {
  const c = COURSES[key];
  const parts = extractCourse(key);
  const fr = {};
  for (const [p, packet] of Object.entries(parts)) {
    const file = base(c, p) + '-fr.json';
    if (!fs.existsSync(file)) throw new Error(`${c.folder}: no French packet ${file}`);
    const f = json(file);
    const source = sourceText(packet);
    if (f.tr?.from !== sha(source)) throw new Error(`${file}: English source changed since the French draft (tr.from ${f.tr?.from} ≠ ${sha(source)}); update the draft, then its hash`);
    fr[p] = { packet, f };
  }
  return fr;
}
function insertBlocks(root, kind, pageUnit, fr, label) {
  const map = new Map();
  for (const { packet, f } of Object.values(fr)) {
    const byId = Object.fromEntries((f.blocks || []).map(b => [b.id, b.fr]));
    for (const b of packet.blocks) {
      if (byId[b.id] == null || byId[b.id] === '') throw new Error(`${label}: block ${b.id} has no French`);
      const k = norm(b.en); if (!map.has(k)) map.set(k, []); map.get(k).push(byId[b.id]);
    }
  }
  for (const [en, frText] of chromeBlocks()) { if (!map.has(en)) map.set(en, [frText]); }
  const take = raw => { const html = raw.trim(); if (!hasWords(html)) return raw; const list = map.get(norm(html)); if (!list?.length) throw new Error(`${label}: no French for ${norm(html).slice(0, 80)}`); const fr = list.length > 1 ? list.shift() : list[0]; return raw.slice(0, raw.length - raw.trimStart().length) + fr.trim() + raw.slice(raw.trimEnd().length); };
  for (const b of pageBlocks(root, kind, pageUnit)) {
    const tag = b.el.tagName.toLowerCase();
    if (b.children) {
      const copy = parse(b.el.toString(), { comment: true, parseNoneClosedTags: true }).firstChild;
      copy.setAttribute('class', (copy.getAttribute('class') || '').replace(/\blang-en\b/, 'lang-fr'));
      copy.childNodes.filter(n => n.nodeType === 1).forEach(k => k.set_content(take(k.innerHTML)));
      b.el.insertAdjacentHTML('afterend', copy.toString());
    } else b.el.insertAdjacentHTML('afterend', `<${tag} class="lang-fr">${take(b.el.innerHTML)}</${tag}>`);
  }
}
/* French concept groups: each English keyword becomes [French forms…, English];
 * accented French forms also accept their unaccented spelling. A concept counts once. */
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
function groups(enList, frList, label) {
  if (!Array.isArray(frList) || frList.length !== enList.length) throw new Error(`${label}: French keywords must align with the ${enList.length} English keywords`);
  return enList.map((en, i) => {
    const forms = [].concat(frList[i]).map(s => String(s).toLowerCase().trim()).filter(Boolean);
    if (!forms.length) throw new Error(`${label}: concept ${i + 1} has no French form`);
    return [...new Set([...forms, ...forms.map(fold), String(en).toLowerCase()])];
  });
}
function questionData(key, fr, label) {
  const out = {};
  for (const [p, { packet, f }] of Object.entries(fr)) {
    if (!packet.mc.length && !packet.sa.length && !packet.fill.length) continue;
    if ((f.mc || []).length !== packet.mc.length || (f.sa || []).length !== packet.sa.length || (f.fill || []).length !== packet.fill.length) throw new Error(`${label} ${p}: question counts differ from the English`);
    out[p] = {
      mc: f.mc.map((q, i) => { if (q.options.length !== packet.mc[i].options.length) throw new Error(`${label} ${p} mc ${i + 1}: option count`); return { stem: q.stem, options: q.options, why: q.why }; }),
      sa: f.sa.map((q, i) => ({ prompt: q.prompt, model: q.model, kw: groups(packet.sa[i].keywords, q.keywords, `${label} ${p} sa ${i + 1}`), labels: q.labels || [] })),
      fill: f.fill.map(q => ({ prompt: q.prompt, answer: q.answer, accept: q.accept || [] })),
    };
  }
  return out;
}
const fillPatch = key => `const qs=window.CTS_FILL_DATA?.${key}?.[n];if(qs)qs.forEach((q,i)=>{if(!f.fill[i])return;q.prompt.fr=f.fill[i].prompt;q.answer.fr=f.fill[i].answer;q.accept??={};q.accept.fr=f.fill[i].accept;});`;

function unitsPage(root, key, fr, label) {
  const ui = UI(), t = ui[key];
  const data = questionData(key, fr, label);
  insertBlocks(root, 'units', 0, fr, label);
  const script = scriptData(root, 'units').script;
  let code = script.innerHTML;
  const sa = key === 'counseling' ? 'shortAnswer' : 'essays';
  const patch = `\nconst FRENCH_COURSE=${JSON.stringify(data)};\nfor(const [n,f] of Object.entries(FRENCH_COURSE)){const u=UNITS[n];if(!u)continue;\n u.mcq.forEach((q,i)=>{q.textFr=f.mc[i].stem;q.explainFr=f.mc[i].why;q.options.forEach((o,j)=>o.fr=f.mc[i].options[j]);});\n (u.${sa}||[]).forEach((q,i)=>{const s=f.sa[i];${key === 'counseling' ? 'q.textFr=s.prompt;q.modelFr=s.model;' : 'q.promptFr=s.prompt;q.rubricFr=s.model;'}q.kw_fr=s.kw;q.kwLabelFr=s.labels;});\n ${fillPatch(COURSES[key].fill)}\n}\nfor(const [k,fr] of Object.entries(${JSON.stringify(ui.tracks)}))if(TRACK_NAMES[k])TRACK_NAMES[k].fr=fr;\n${BI_HELPER}\n`;
  code = replaceOnce(code, '// ============= STATE =============', patch + '\n// ============= STATE =============', label);
  // Question wording: French with the English source.
  const pairs = [
    ['${i+1}. ${q.textEn}', '${i+1}. ${q.textEs}', '${frBi((i+1)+". "+q.textEn,(i+1)+". "+q.textEs,(i+1)+". "+q.textFr)}'],
    ['${String.fromCharCode(65+j)}. ${opt.en}', '${String.fromCharCode(65+j)}. ${opt.es}', '${frBi(String.fromCharCode(65+j)+". "+opt.en,String.fromCharCode(65+j)+". "+opt.es,String.fromCharCode(65+j)+". "+opt.fr)}'],
    ['Scenario ${i+1}: ${e.promptEn}', 'Escenario ${i+1}: ${e.promptEs}', '${frBi("Scenario "+(i+1)+": "+e.promptEn,"Escenario "+(i+1)+": "+e.promptEs,"Scénario "+(i+1)+" : "+e.promptFr)}'],
    ['${q.explainEn}', '${q.explainEs}', '${frBi(q.explainEn,q.explainEs,q.explainFr)}'],
    ['${e.rubricEn}', '${e.rubricEs}', '${frBi(e.rubricEn,e.rubricEs,e.rubricFr)}'],
    ['${q.modelEn||\'\'}', '${q.modelEs||\'\'}', '${frBi(q.modelEn||\'\',q.modelEs||\'\',q.modelFr||\'\')}'],
  ];
  for (const [en, es, out] of pairs) code = code.replaceAll(`<span class="lang-en">${en}</span><span class="lang-es">${es}</span>`, out);
  // Grading: French concept groups, English keywords still accepted, a concept counted once.
  if (key === 'counseling') {
    code = replaceOnce(code, 'function kwHit(ans, k){\n  k = (k||\'\').toLowerCase();', 'function kwHit(ans, k){\n  if(Array.isArray(k)) return k.some(x=>kwHit(ans,x));\n  k = (k||\'\').toLowerCase();', label);
    code = replaceOnce(code, '  if(!es && q.kw_en && q.kw_en.length) return q.kw_en;', '  if(q.kw_fr && q.kw_fr.length) return q.kw_fr;\n  if(!es && q.kw_en && q.kw_en.length) return q.kw_en;', label);
    code = replaceOnce(code, "  return es ? (q.modelEs || '') : (q.modelEn || '');", "  return es ? (q.modelEs || '') : (q.modelFr || q.modelEn || '');", label);
  } else {
    code = replaceOnce(code, 'if(!answer || !kw) return false;', 'if(Array.isArray(kw)) return kw.some(k=>kwHit(answer,k));\n  if(!answer || !kw) return false;', label);
    code = code.replaceAll('const kws = (isEs ? (q.kw_es||[]) : (q.kw_en||[]));', 'const kws = q.kw_fr || (isEs ? (q.kw_es||[]) : (q.kw_en||[]));');
    code = replaceOnce(code, 'return kws.filter(k=> k && !kwHit(text, k));', 'return kws.map((k,i)=>({k,i})).filter(({k,i})=> k && !kwHit(text,k)).map(({k,i})=>({en:String((q.kw_en||[])[i]||k),fr:String((q.kwLabelFr||[])[i]||(q.kw_en||[])[i]||k)}));', label);
    if (code.split("const missEn = miss.join(', ');").length !== 3) throw new Error(label + ': expected two missing-concept lists');
    code = code.replaceAll("const missEn = miss.join(', ');", "const missEn = miss.map(m=>m.en).join(', '), missFr = miss.map(m=>m.fr).join(', ');");
  }
  code = frenchRuntimeSpans(code, { ...ui.spans, ...t.spans }, label);
  code = replaceLiterals(code, { ...t.literals }, label);
  code = replaceOnce(code, "document.getElementById('certTrack').textContent = t.en;", "document.getElementById('certTrack').textContent = t.fr || t.en;", label);
  script.set_content(code);
  registration(root, t.registration, label);
  pageChrome(root, t.title);
}
function registration(root, reg, label) {
  for (const [sel, text] of Object.entries(reg.placeholders || {})) { const el = root.querySelector(sel); if (!el) throw new Error(`${label}: ${sel}`); el.setAttribute('placeholder', text); el.setAttribute('aria-label', text); }
  for (const [sel, opts] of Object.entries(reg.options || {})) {
    const select = root.querySelector(sel); if (!select) throw new Error(`${label}: ${sel}`);
    select.setAttribute('aria-label', 'Parcours');
    for (const o of select.querySelectorAll('option')) { const fr = opts[o.getAttribute('value')]; if (!fr) throw new Error(`${label}: option ${o.getAttribute('value')}`); o.set_content(fr); }
  }
  for (const [sel, html] of Object.entries(reg.text || {})) { const el = root.querySelector(sel); if (!el) throw new Error(`${label}: ${sel}`); el.set_content(html); }
}
function ethicsPage(root, file, fr, label) {
  const ui = UI(), t = ui.ethics;
  const unit = Number(/ethics_unit(\d+)/.exec(file)[1]);
  const mine = { [String(unit)]: fr[String(unit)] };
  const data = questionData('ethics', mine, label)[String(unit)];
  insertBlocks(root, 'ethics', unit, mine, label);
  const { script } = scriptData(root, 'ethics');
  let code = script.innerHTML;
  // The French page runs the English branch of the page script, carrying French.
  code = replaceOnce(code, "currentLang = document.body.classList.contains('lang-en') ? 'en' : 'es';", "currentLang = 'en';", label);
  const titles = JSON.stringify(t.unitTitles);
  const patch = `\n${BI_HELPER}\nconst FRENCH_UNIT=${JSON.stringify(data)};\nmcQuestions.forEach((q,i)=>{const f=FRENCH_UNIT.mc[i];q.textEn=frBi(q.textEn,q.textEs,f.stem);q.optionsEn=f.options;q.explanationEn=frBi(q.explanationEn,q.explanationEs,f.why);});\nkwQuestions.forEach((q,i)=>{const f=FRENCH_UNIT.sa[i];q.textEn=frBi(q.textEn,q.textEs,f.prompt);q.modelEn=frBi(q.modelEn,q.modelEs,f.model);q.kw_en=f.kw;});\n{const n=UNIT,f=FRENCH_UNIT;${fillPatch('ethics')}}\nunitTitlesEn.splice(0,unitTitlesEn.length,...${titles});\n`;
  code = replaceOnce(code, '\nlet currentLang = ', patch + '\nlet currentLang = ', label);
  code = replaceOnce(code, 'function kwHit(ans, k) {\n    k = (k || \'\').toLowerCase();', 'function kwHit(ans, k) {\n    if (Array.isArray(k)) return k.some(x => kwHit(ans, x));\n    k = (k || \'\').toLowerCase();', label);
  let passedNote = 0;
  for (const [from, to] of t.literals) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\(\\\\d\\+\\)', '(\\d+)'), 'g');
    const optional = from.includes('Unit already passed!');
    if (!re.test(code)) { if (optional) continue; throw new Error(`${label}: literal not found ${from.slice(0, 80)}`); }
    if (optional) passedNote++;
    re.lastIndex = 0; code = code.replace(re, to);
  }
  if (passedNote !== 1) throw new Error(`${label}: expected one "unit already passed" message`);
  script.set_content(code);
  const next = root.querySelector('#nextUnitBtn'); if (next) next.set_content(next.innerHTML.replace(/^Unit (\d+)/, 'Unité $1').replace(/^Certificate/, 'Certificat'));
  const toggle = root.querySelector('#langToggleBtn'); if (toggle) toggle.setAttribute('data-cts-legacy-control', 'true');
  registration(root, t.registration, label);
  pageChrome(root, `Éthique pastorale et chrétienne — ${t.unitTitles[unit - 1]}`);
}
const cache = {};
/* Called by the language-page build for each /fr/ page. Returns true when the
 * page is one of these courses (a machine-draft French page). */
export function frenchStaticCourse(root, file) {
  const key = Object.keys(COURSES).find(k => COURSES[k].pages.includes(file));
  if (!key) return false;
  // A course with no French packets yet stays an English fallback page. While
  // drafting, CTS_FRENCH_STATIC=narrative,ethics limits the build to finished courses.
  if (process.env.CTS_FRENCH_STATIC && !process.env.CTS_FRENCH_STATIC.split(',').includes(key)) return false;
  if (!fs.existsSync(`_review/french/${COURSES[key].folder}`) || !fs.readdirSync(`_review/french/${COURSES[key].folder}`).some(f => f.endsWith('-fr.json'))) return false;
  const fr = cache[key] ??= loadFrench(key);
  const label = `${COURSES[key].folder} ${file}`;
  if (COURSES[key].kind === 'ethics') ethicsPage(root, file, fr, label); else unitsPage(root, key, fr, label);
  return true;
}

/* ---------- CLI ---------- */
if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, key] = process.argv.slice(2);
  // --finalize: French typography (no-break spaces) and machine provenance with the source hash.
  const NB = '\u00a0';
  const typo = html => String(html).split(/(<[^>]+>)/).map(t => t.startsWith('<') ? t : t.replace(/ ([:;!?»])/g, NB + '$1').replace(/« /g, '«' + NB).replace(/«(?=[^\s\u00a0])/g, '«' + NB).replace(/([^\s\u00a0])»/g, '$1' + NB + '»')).join('');
  const keys = key ? [key] : Object.keys(COURSES);
  let bad = 0;
  for (const k of keys) {
    const c = COURSES[k]; const parts = extractCourse(k);
    fs.mkdirSync(`_review/french/${c.folder}`, { recursive: true });
    for (const [p, packet] of Object.entries(parts)) {
      const file = base(c, p) + '-source.json', text = sourceText(packet);
      if (cmd === '--extract') fs.writeFileSync(file, text);
      else if (cmd === '--finalize') {
        const frFile = base(c, p) + '-fr.json';
        if (!fs.existsSync(frFile)) { console.log(`missing ${frFile}`); bad++; continue; }
        const f = json(frFile);
        f.blocks = (f.blocks || []).map(b => ({ ...b, fr: typo(b.fr) }));
        f.mc = (f.mc || []).map(q => ({ ...q, stem: typo(q.stem), options: q.options.map(typo), why: typo(q.why) }));
        f.fill = (f.fill || []).map(q => ({ ...q, prompt: typo(q.prompt) }));
        f.sa = (f.sa || []).map(q => ({ ...q, prompt: typo(q.prompt), model: typo(q.model) }));
        const { course, part: pp, tr, ...rest } = f;
        const out = { course: course || c.folder, part: pp ?? p, tr: { status: 'machine', from: sha(text), by: 'Claude Opus 5.5 machine draft, not yet reviewed', date: tr?.date || new Date().toISOString().slice(0, 10) }, ...rest };
        fs.writeFileSync(frFile, JSON.stringify(out, null, 1) + '\n');
      }
      else if (cmd === '--check') {
        if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) { console.log(`STALE ${file}`); bad++; }
        const frFile = base(c, p) + '-fr.json';
        if (fs.existsSync(frFile) && json(frFile).tr?.from !== sha(text)) { console.log(`HASH ${frFile}`); bad++; }
      }
    }
    console.log(`${c.folder}: ${Object.keys(parts).length} packets, ${Object.values(parts).reduce((a, p) => a + p.blocks.length, 0)} blocks, ${Object.values(parts).reduce((a, p) => a + p.mc.length, 0)} MC, ${Object.values(parts).reduce((a, p) => a + p.sa.length, 0)} SA, ${Object.values(parts).reduce((a, p) => a + p.fill.length, 0)} fill`);
  }
  if (bad) process.exit(1);
}
