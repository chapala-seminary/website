/* The single-page courses in the built site (docs/ai-grading.md sections 1 and 12).
 *
 * Counseling, Narrative and WiseSpeak Preaching and Ethics are static pages in
 * public/, with their questions, keys and grading inline, so Astro copies them
 * as they are. This runs when the build finishes -- after the language pages
 * have been made from them -- and, for every variant of every page
 * (dist/X.html, dist/es/X.html, dist/fr/X.html):
 *
 *   CTS_GRADING_MODE=live    takes the answer keys out of the page and out of
 *                            assets/js/fill/<course>.js, and puts
 *                            cts-single-live.js in the place of the page's own
 *                            grading. The lesson, the registration, the language
 *                            buttons, the progress bar and every localStorage key
 *                            are the page's own, unchanged.
 *   CTS_GRADING_MODE=shadow  leaves the page as it is and adds the hook that
 *                            tells the seminary each unit that is submitted
 *                            (cts-shadow.js + cts-shadow-single.js).
 *
 * Nothing in public/ is edited. Both transforms fail the build loudly when a page
 * no longer has the shape they expect, rather than ship a page with a key in it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { COURSES, fillBank } from './single-pages-lib.mjs';

const LIVE_JS = '/assets/js/cts-single-live.js?v=20261014a';
const GRADING_JS = '/assets/js/cts-grading.js';

/* ---- finding things in the page script ---------------------------------------- */
function scripts(html) {
  return [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => ({ code: m[1], start: m.index + '<script>'.length, end: m.index + '<script>'.length + m[1].length }));
}
function mainScript(html, family) {
  const marker = family === 'ethics' ? 'const mcQuestions' : 'const UNITS = {}';
  const s = scripts(html).find((x) => x.code.includes(marker));
  if (!s) throw new Error(`no page script holding ${marker}`);
  return s;
}
const splice = (text, from, to, repl) => text.slice(0, from) + repl + text.slice(to);

/* Blocks written one per top-level statement: from a line starting `head` to the next line that is `tail`. */
function blocks(code, headRe, tail) {
  const lines = code.split('\n'), out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = headRe.exec(lines[i]);
    if (!m) continue;
    let j = i;
    while (j < lines.length && lines[j] !== tail) j++;
    if (j >= lines.length) throw new Error(`unterminated block at: ${lines[i].slice(0, 60)}`);
    out.push({ m, from: i, to: j });
    i = j;
  }
  return { lines, found: out };
}
function replaceBlocks(code, headRe, tail, make) {
  const { lines, found } = blocks(code, headRe, tail);
  if (!found.length) throw new Error(`no blocks like ${headRe}`);
  for (const b of found.reverse()) {
    const text = lines.slice(b.from, b.to + 1).join('\n');
    lines.splice(b.from, b.to - b.from + 1, make(b.m, text));
  }
  return lines.join('\n');
}

/* ---- the keys out of the data ---------------------------------------------------- */
const keepText = (q, keys) => Object.fromEntries(keys.filter((k) => q[k] !== undefined).map((k) => [k, q[k]]));
export function stripUnitsData(code) {
  return replaceBlocks(code, /^UNITS\[(\d+)\] = \{/, '};', (m, text) => {
    const u = new Function(`const UNITS = {};\n${text}\nreturn UNITS[${m[1]}];`)();
    const extra = Object.keys(u).filter((k) => !['mcq', 'shortAnswer', 'essays'].includes(k));
    if (extra.length) throw new Error(`unit ${m[1]} has fields the live build does not know: ${extra.join(', ')}`);
    const out = { mcq: u.mcq.map((q) => ({ ...keepText(q, ['textEn', 'textEs']), options: q.options.map((o) => ({ en: o.en, es: o.es })) })) };
    for (const k of ['shortAnswer', 'essays']) if (u[k]) out[k] = u[k].map((q) => keepText(q, ['textEn', 'textEs', 'promptEn', 'promptEs']));
    return `UNITS[${m[1]}] = ${JSON.stringify(out)};`;
  });
}
export function stripEthicsData(code) {
  let out = replaceBlocks(code, /^const mcQuestions = \[/, '];', (m, text) => {
    const list = new Function(text + '\nreturn mcQuestions;')();
    return 'const mcQuestions = ' + JSON.stringify(list.map((q) => keepText(q, ['textEn', 'textEs', 'optionsEn', 'optionsEs']))) + ';';
  });
  out = replaceBlocks(out, /^const kwQuestions = \[/, '];', (m, text) => {
    const list = new Function(text + '\nreturn kwQuestions;')();
    return 'const kwQuestions = ' + JSON.stringify(list.map((q) => keepText(q, ['textEn', 'textEs']))) + ';';
  });
  return out;
}
const SECRET = new Set(['why', 'model', 'kw', 'keywords', 'labels', 'answer', 'accept', 'blocks', 'notes', 'tr', 'explanation', 'rubric']);
function deepStrip(v) {
  if (Array.isArray(v)) return v.map(deepStrip);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([k]) => !SECRET.has(k)).map(([k, x]) => [k, deepStrip(x)]));
  return v;
}
/* The French drafts add their own copy of the keys (why, model, kw, answer, accept) in a JSON literal. */
export function stripFrench(code) {
  return code.replace(/const (FRENCH_COURSE|FRENCH_UNIT|FRENCH_WISESPEAK)=([^\n]*?);\n/g, (all, name, json) => `const ${name}=${JSON.stringify(deepStrip(JSON.parse(json)))};\n`)
    // ...and a statement that writes the French answers into the fill-in data
    .replace(/q\.answer\.fr=[^;]*;q\.accept\?\?=\{\};q\.accept\.fr=[^;]*;/g, '');
}

/* The fill-in data a live page loads: the sentences, with their question ids, and no answer. */
export function liveFillFile(root, courseKey) {
  const c = COURSES[courseKey];
  const bank = fillBank(root, c.fill), out = {};
  for (const [n, list] of Object.entries(bank)) {
    const scope = `sp:${c.page(Number(n))}`;
    out[n] = list.map((q, i) => ({ qid: `${scope}/fill/${i}`, prompt: q.prompt }));
  }
  return `/* Fill-in-the-blank sentences for ${c.folder}, live build (docs/ai-grading.md): the answers are on the server. */\n` +
    `window.CTS_FILL_DATA = window.CTS_FILL_DATA || {};\nwindow.CTS_FILL_DATA[${JSON.stringify(c.fill)}] = ${JSON.stringify(out)};\n`;
}

/* ---- the live page --------------------------------------------------------------- */
const UNITS_CFG = {
  counseling: { course: 'counseling', scopePrefix: 'sp:CTSCounseling-u', saKey: 'shortAnswer', saText: { en: 'textEn', es: 'textEs', fr: 'textFr' }, fillKey: 'counseling' },
  narrative: { course: 'storytel', scopePrefix: 'sp:CTS_Narrative_Preaching-u', saKey: 'essays', saText: { en: 'promptEn', es: 'promptEs', fr: 'promptFr' }, fillKey: 'narrative' },
  wisespeak: { course: 'wisespeak', scopePrefix: 'sp:CTS_WiseSpeak_Preaching-u', saKey: 'essays', saText: { en: 'promptEn', es: 'promptEs', fr: 'promptFr' }, fillKey: 'wisespeak' },
};
const tags = `</script>\n<script src="${GRADING_JS}"></script>\n<script src="${LIVE_JS}"></script>\n<script>\n`;

export function livePage(html, courseKey, file) {
  const c = COURSES[courseKey];
  const s = mainScript(html, c.family);
  let code = s.code;
  if (c.family === 'ethics') {
    code = stripEthicsData(code);
    const unit = c.files.indexOf(file) + 1;
    const tailRe = /document\.getElementById\('submitExamBtn'\)\.onclick = [^\n]*\ndocument\.getElementById\('resetExamBtn'\)\.onclick = resetUnit;\nrenderQuestions\(\);\ncheckLockouts\(\);\n/;
    if (!tailRe.test(code)) throw new Error(`${file}: the end of the page script is not what the live build expects`);
    code = code.replace(tailRe, () => `${tags}CTSSingleLive.ethics(${JSON.stringify({ scope: `sp:${c.page(unit)}` })});\n`);
  } else {
    code = stripUnitsData(code);
    const cfg = { ...UNITS_CFG[courseKey], units: c.units };
    const marker = '// ============= INIT =============';
    if (!code.includes(marker)) throw new Error(`${file}: no INIT marker in the page script`);
    code = code.replace(marker, () => `${tags}CTSSingleLive.units(${JSON.stringify(cfg)});\n${marker}`);
  }
  code = stripFrench(code);
  let out = splice(html, s.start, s.end, code);
  // the fill-in widget has changed: do not let a cached copy run against the live page
  out = out.replace(/(assets\/js\/cts-fill\.js)\?v=[A-Za-z0-9]+/g, '$1?v=20261014a').replace(/(assets\/js\/fill\/\w+\.js)\?v=[A-Za-z0-9]+/g, '$1?v=20261014a');
  // Ethics units 2 to 10 never loaded the sync client (only unit 1 does), so a student who opened one first
  // had no code to be graded under. The grading client needs it on every page that asks questions.
  if (!/cts-sync\.js/.test(out)) out = out.replace('</body>', () => '<script src="/assets/js/cts-sync.js" defer></script>\n</body>');
  return out;
}

/* ---- the shadow page ---------------------------------------------------------------- */
export function shadowPage(html, courseKey, file) {
  const c = COURSES[courseKey];
  const cfg = c.family === 'ethics'
    ? { family: 'ethics', scope: `sp:${c.page(c.files.indexOf(file) + 1)}` }
    : { family: 'units', scopePrefix: UNITS_CFG[courseKey].scopePrefix, saKey: UNITS_CFG[courseKey].saKey };
  const tag = `<script>window.CTS_SHADOW_SINGLE=${JSON.stringify(cfg)};</script>\n<script src="/assets/js/cts-shadow.js" defer></script>\n<script src="/assets/js/cts-shadow-single.js" defer></script>\n`;
  if (!html.includes('</body>')) throw new Error(`${file}: no </body>`);
  return html.replace('</body>', () => tag + '</body>');
}

/* ---- the build -------------------------------------------------------------------------- */
export function transformDist(dir, { live, root = '.' }) {
  let pages = 0;
  const variants = ['', 'es', 'fr'];
  for (const c of Object.values(COURSES)) {
    for (const file of c.family === 'ethics' ? c.files : [c.file]) {
      for (const v of variants) {
        const f = path.join(dir, v, file);
        if (!fs.existsSync(f)) continue;
        const html = fs.readFileSync(f, 'utf8');
        if (html.includes('cts-single-live.js') || html.includes('cts-shadow-single.js')) continue;
        fs.writeFileSync(f, live ? livePage(html, c.key, file) : shadowPage(html, c.key, file));
        pages++;
      }
    }
    if (live) fs.writeFileSync(path.join(dir, `assets/js/fill/${c.fill}.js`), liveFillFile(root, c.key));
  }
  return pages;
}

export default function singlePagesIntegration() {
  return {
    name: 'cts-single-pages',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const mode = (process.env.CTS_GRADING_MODE ?? 'live').trim().toLowerCase();
        const n = transformDist(dir instanceof URL ? dir.pathname : String(dir), { live: mode !== 'shadow' });
        logger.info(`${n} single-page course pages made ${mode}`);
      },
    },
  };
}
