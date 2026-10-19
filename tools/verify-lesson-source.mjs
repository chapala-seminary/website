/* CTS-01 candidate replacement for the brittle whole-page lesson-render hash
 * comparator.  The lesson's JSON template, not shared page chrome, is the
 * independent expected input; the Astro-built lesson is the actual output.
 *
 * Usage: node tools/verify-lesson-source.mjs [built-dir]
 * Default .astro/language-base (the same directory used by the old test).
 * Only that directory works: in dist/ and dist-shadow/ the language transform
 * has already run, so every masthead would differ.
 * Also: node tools/verify-lesson-source.mjs --self-test
 *
 * Written by ChatGPT (CTS-01), revised after Claude's review (18 Oct 2026):
 * the shared chrome allowed before a lesson is an exact list, and a failure
 * names the first differing element and its text. This check cannot see a
 * change made in the lesson JSON itself (the build reproduces it), so
 * tools/prose-baseline.mjs remains the required gate for lesson wording.
 * The historical fixture test/fixtures/lesson-render.json is kept, untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { renderLesson } from '../src/lib/lesson.ts';
import { shell } from '../src/lib/shell.ts';

const normal = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const meaningfulChildren = (root) => root.childNodes.filter((n) => n.tagName || normal(n.text || n.rawText));
const signature = (node) => {
  if (!node.tagName) return `text:${normal(node.text || node.rawText)}`;
  const attrs = Object.entries(node.attributes || {})
    .map(([k, v]) => [k, (k === 'src' || k === 'href') ? v.replace(/\?v=[0-9a-f]+$/, '') : v])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`).join(' ');
  return `${node.tagName.toLowerCase()}[${attrs}]`;
};
const digestTree = (node) => {
  if (!node.tagName) return normal(node.text || node.rawText);
  const parts = [signature(node)];
  for (const child of node.childNodes) {
    if (!child.tagName && !normal(child.text || child.rawText)) continue;
    parts.push(digestTree(child));
  }
  return parts;
};
const equal = (a, b) => JSON.stringify(digestTree(a)) === JSON.stringify(digestTree(b));
// What src/layouts/Unit.astro puts before the lesson, in this order, each at
// most once. Anything else in front of the lesson fails -- a data-cts-chrome
// attribute alone does not make an element chrome.
const CHROME_ORDER = ['section#cts-register', 'p#greeting', 'aside#cts-textbook', 'aside#cts-required-readings'];
const chromeKey = (node) => node.tagName ? `${node.tagName.toLowerCase()}#${node.getAttribute('id') || ''}` : '';
function prefixProblem(prefix) {
  let at = 0;
  for (const node of prefix) {
    const i = CHROME_ORDER.indexOf(chromeKey(node), at);
    if (i < 0) return `unexpected element before lesson: ${chromeKey(node) || 'text'} "${normal(node.text || node.rawText).slice(0, 100)}"`;
    at = i + 1;
  }
  return null;
}
// The first place two trees part, as tag + up to 100 characters of text.
function firstDifference(a, b, where = '') {
  const label = (n) => n ? (n.tagName ? `${signature(n)} "${normal(n.text).slice(0, 100)}"` : `text "${normal(n.text || n.rawText).slice(0, 100)}"`) : '(nothing)';
  if (!a || !b || signature(a) !== signature(b)) return `${where || 'root'}: expected ${label(a)}; built ${label(b)}`;
  if (!a.tagName) return `${where || 'root'}: expected ${label(a)}; built ${label(b)}`;
  const ka = meaningfulChildren(a), kb = meaningfulChildren(b);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    if (ka[i] && kb[i] && equal(ka[i], kb[i])) continue;
    return firstDifference(ka[i], kb[i], `${where}${where ? ' > ' : ''}${a.tagName.toLowerCase()}[${i + 1}]`);
  }
  return `${where || 'root'}: differs`;
}

function verifyMain(main, content, name) {
  const expected = meaningfulChildren(parse(content));
  const actual = meaningfulChildren(main);
  if (!expected.length) return [`${name}: empty expected lesson content; refuse to pass`];
  const split = actual.length - expected.length;
  if (split < 0) return [`${name}: ${actual.length} main children; expected ${expected.length} lesson children`];
  const prefix = actual.slice(0, split);
  const bad = prefixProblem(prefix);
  if (bad) return [`${name}: ${bad}`];
  const mismatches = [];
  for (let i = 0; i < expected.length; i++) {
    if (equal(expected[i], actual[split + i])) continue;
    mismatches.push(`${name}: lesson root ${i + 1} differs at ${firstDifference(expected[i], actual[split + i])}`);
    if (mismatches.length >= 3) break;
  }
  return mismatches;
}

function selfTest() {
  const lesson = '<article class="lesson"><h2>Heading</h2><p>A paragraph with teaching.</p></article>';
  const built = (chrome, body) => parse(`<main id="lesson"><section id="cts-register" data-cts-chrome>${chrome}</section><p id="greeting"></p>${body}</main>`).querySelector('main');
  const check = (chrome, body, source = lesson) => verifyMain(built(chrome, body), source, 'synthetic');
  if (check('old chrome', lesson).length) throw new Error('unaltered lesson must pass');
  if (check('new, longer chrome', lesson).length) throw new Error('shared chrome must not fail lesson');
  if (!check('new chrome', lesson.replace('A paragraph', 'Changed paragraph')).length) throw new Error('mutated lesson prose must fail');
  if (!check('new chrome', lesson.replace('<h2>', '<h3>').replace('</h2>', '</h3>')).length) throw new Error('mutated lesson structure must fail');
  if (!check('new chrome', '<div>unapproved node</div>' + lesson).length) throw new Error('extra lesson element must fail');
  if (!check('new chrome', lesson + '<div>extra trailing node</div>').length) throw new Error('trailing node must fail');
  const hidden = parse(`<main id="lesson"><section id="cts-register" data-cts-chrome>x</section><div data-cts-chrome><p>Injected teaching.</p></div><p id="greeting"></p>${lesson}</main>`).querySelector('main');
  if (!verifyMain(hidden, lesson, 'synthetic').length) throw new Error('an element marked chrome but not on the list must fail');
  const msg = check('c', lesson.replace('A paragraph', 'Changed paragraph')).join(' ');
  if (!/Changed paragraph/.test(msg)) throw new Error('failure message must show the differing text');
  console.log('CTS-01 self-test: eight cases passed.');
}

if (process.argv.includes('--self-test')) {
  selfTest();
} else {
  const builtDir = process.argv[2] || '.astro/language-base';
  const lessonsDir = 'src/content/lessons';
  if (!fs.existsSync(lessonsDir)) throw new Error(`Missing ${lessonsDir}; refusing empty success`);
  let checked = 0, failed = 0;
  for (const course of fs.readdirSync(lessonsDir)) {
    const dir = path.join(lessonsDir, course);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).filter((name) => /^\d+\.json$/.test(name))) {
      const page = `${course}Unit${f.replace('.json', '')}.html`;
      const json = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const expected = shell(renderLesson(json));
      const builtFile = path.join(builtDir, page);
      if (!fs.existsSync(builtFile)) { console.error(`${page}: built page missing`); failed++; continue; }
      const doc = parse(fs.readFileSync(builtFile, 'utf8'));
      const main = doc.querySelector('main#lesson');
      if (!main) { console.error(`${page}: main#lesson missing`); failed++; continue; }
      const problems = verifyMain(main, expected.content, page);
      const masthead = doc.querySelector('header.cts-masthead .wrap');
      if (!masthead) problems.push(`${page}: masthead missing`);
      else if (expected.masthead) {
        const want = meaningfulChildren(parse(expected.masthead));
        const got = meaningfulChildren(masthead);
        if (want.length !== got.length || want.some((n, i) => !equal(n, got[i])))
          problems.push(`${page}: lesson masthead differs from its source`);
      }
      checked++;
      if (problems.length) { failed++; problems.slice(0, 4).forEach((p) => console.error(p)); }
    }
  }
  console.log(`lesson source fidelity: ${checked} built page(s) checked, ${failed} failure(s)`);
  if (!checked || failed) process.exitCode = 1;
}
