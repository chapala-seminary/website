/* One course's hand-written HTML -> lesson data a person can edit.
 *
 * The model is documented in src/lib/lesson.ts: a template with holes, plus
 * the blocks that fill them. This is the one-way trip into it, and the proof
 * that the trip lost nothing -- the data is rendered back and compared with
 * the file it came from, element by element. A course is only converted when
 * that comparison is clean.
 *
 * HOW A BLOCK IS FOUND
 *
 * Not by deciding where the lesson starts and ends. Twenty-six page shapes
 * across forty courses make that rule impossible to get right, and a wrong
 * guess drops lesson text with nothing to notice. Instead: find each place the
 * page says "this fragment is English", find its Spanish partner, and walk the
 * two together. Whatever is not translated text stays in the template exactly
 * as it was.
 *
 * The site marks language six ways -- .lang-en, .en-only, .block-en,
 * .teach-en, .en-lbl and a bare .en, plus a few pages that use ids. All six
 * are read and ALL SIX ARE LEFT EXACTLY AS THEY ARE. Each language's text is
 * lifted out of where it sat and a hole left behind, so the markup a reader
 * gets is unchanged down to the attribute -- which is what lets the checks
 * that compare the built pages against the pages before still mean what they
 * say.
 *
 *   node tools/extract-lesson.mjs CTSActs --check     # compare only
 *   node tools/extract-lesson.mjs CTSActs             # and write
 *   node tools/extract-lesson.mjs --all --check       # every unconverted course
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { hash, HOLE, renderLesson } from '../src/lib/lesson.ts';

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const ALL = args.includes('--all');
const ONE = args.find((a) => !a.startsWith('-'));
if (!ONE && !ALL) { console.error('usage: node tools/extract-lesson.mjs <Course>|--all [--check]'); process.exit(2); }

const LANGS = ['en', 'es'];              // the first is the source language
const SOURCE = LANGS[0];
const OUT_ROOT = path.join('src', 'content', 'lessons');

/* The six spellings, as pairs. Order matters only in that the first match
   wins, and .en / .es are last because they are the loosest. */
const MARKERS = [
  ['lang-en', 'lang-es'], ['en-only', 'es-only'], ['block-en', 'block-es'],
  ['teach-en', 'teach-es'], ['en-lbl', 'es-lbl'], ['en', 'es'],
];
const classes = (el) => (el.getAttribute?.('class') || '').trim().split(/\s+/).filter(Boolean);
const markerOf = (el) => {
  const cs = classes(el);
  for (const [en, es] of MARKERS) { if (cs.includes(en)) return { side: 'en', pair: [en, es] };
                                    if (cs.includes(es)) return { side: 'es', pair: [en, es] }; }
  const id = el.getAttribute?.('id') || '';
  if (/-en$/.test(id)) return { side: 'en', pair: [id, id.replace(/-en$/, '-es')], byId: true };
  if (/-es$/.test(id)) return { side: 'es', pair: [id.replace(/-es$/, '-en'), id], byId: true };
  return null;
};

const BLOCKY = /^(p|div|h[1-6]|ul|ol|li|section|article|blockquote|table|tr|figure|dl|dt|dd|main|header|footer|aside|nav)$/i;
const hasBlockChildren = (el) => el.childNodes.some((n) => n.tagName && BLOCKY.test(n.tagName));

/* What a block is for, from the element that holds it. Metadata for the
   editor; nothing renders from it. */
function typeOf(el, depth) {
  const tag = (el.tagName || '').toLowerCase();
  const cs = classes(el).join(' ');
  if (/scripture|passage|verse|epigraph/.test(cs)) return 'scripture';
  if (/unit-title|courseLine/i.test(cs) || (tag === 'h1' && depth === 'title')) return 'title';
  if (/unit-sub|subtitle/.test(cs)) return 'subtitle';
  if (tag === 'figcaption') return 'caption';
  if (tag === 'label' || /\blbl\b|\blabel\b/.test(cs)) return 'label';
  if (tag === 'li') return 'list-item';
  if (/^h[1-6]$/.test(tag)) return 'heading';
  if (tag === 'p' || tag === 'div' || tag === 'span') return 'prose';
  return 'other';
}

const shapeOf = (el) => el.childNodes.filter((n) => n.tagName)
  .map((n) => n.tagName.toLowerCase()).join(',');

const plain = (h) => parse('<x>' + h + '</x>').text.replace(/\s+/g, ' ').trim();

function extractUnit(course, unit, html, problems, notes, suspect) {
  /* comment: true, or the parser discards the holes as it goes -- they are
     comments, and it drops those by default. */
  const root = parse(html, { comment: true });
  const blocks = [];
  let n = 0;
  const nextId = () => 'b' + String(++n).padStart(3, '0');

  /* Walk an English fragment and its Spanish partner together. Where the two
     have the same shape, recurse, so an editor gets a paragraph rather than a
     page. Where they do not, take the pair whole: coarse but correct, and
     reported so it can be looked at. */
  /* Align two lists of children by their tags, so a container that has one
     extra paragraph on one side still pairs the rest. Longest common
     subsequence: the matched pairs recurse, and whatever is left over on
     either side is taken as it stands. Requiring the two shapes to be
     identical was the alternative, and it collapsed ten courses into one
     enormous block per unit -- a clean round trip and a useless CMS. */
  function align(a, b) {
    const n = a.length, m = b.length;
    /* The key ignores the language markers themselves. Keying on the first
       class made <div class="lang-en block"> and <div class="lang-es block">
       look like different elements, so eight pairs that already had a human
       translation were split into sixteen half-blocks and reported as missing
       translations -- the worst kind of wrong, because the fix looks like
       "translate these" rather than "pair these". */
    const MARKER_CLASS = new Set(MARKERS.flat());
    /* Heading levels are treated as one kind. Four headings in CTSCG are an
       <h3> in English and an <h2> in Spanish -- the same heading, typed at a
       different level -- and matching on the exact tag left them as two
       half-blocks reported as untranslated. The template keeps each element's
       real tag, so nothing about the rendered page changes. */
    const kind = (x) => { const t = x.tagName.toLowerCase(); return /^h[1-6]$/.test(t) ? 'h' : t; };
    const key = (x) => kind(x) + '.'
      + (classes(x).filter((c) => !MARKER_CLASS.has(c))[0] ?? '');
    /* Two elements are a pair when they are the same kind AND roughly the
       same amount of text. Matching on kind alone pairs any <p> with any <p>,
       so one paragraph missing its translation shifts every pair after it by
       one -- CTSRadical unit 4 had an English paragraph with no Spanish, and
       the slip put the Spanish of the NEXT paragraph beside it. Both halves
       were real, careful text; they were simply not each other's.

       The ratio is generous (Spanish runs perhaps a fifth longer than English
       as a rule), and only applied once both sides are long enough for length
       to mean anything. */
    const len = (x) => x.text.replace(/\s+/g, ' ').trim().length;
    const fits = (x, y) => {
      if (key(x) !== key(y)) return false;
      const p = len(x), q = len(y);
      if (p < 120 || q < 120) return true;
      return p / q < 2.5 && q / p < 2.5;
    };

    const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        L[i][j] = fits(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const out = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (fits(a[i], b[j])) { out.push([a[i++], b[j++]]); }
      else if (L[i + 1][j] >= L[i][j + 1]) out.push([a[i++], null]);
      else out.push([null, b[j++]]);
    }
    while (i < n) out.push([a[i++], null]);
    while (j < m) out.push([null, b[j++]]);
    return out;
  }

  /* The whitespace an element's content starts and ends with stays in the
     template, around the hole. Trimming it into oblivion cost a space between
     a heading and the paragraph after it -- "DiscernmentScripture" -- which
     the round trip caught. The editor still gets clean text; the page still
     gets its separator. */
  const inner = (el) => {
    const raw = el.innerHTML;
    const text = raw.trim();
    const lead = raw.slice(0, raw.length - raw.trimStart().length);
    const trail = raw.slice(raw.trimEnd().length);
    return { text, lead, trail };
  };
  function emit(el, lang, id, lead = '', trail = '') {
    el.set_content(lead + HOLE(id, lang) + trail);
  }

  /* One side sometimes wraps part of its content in a div the other side does
     not have -- CTSST unit 12 keeps its English in a lang-en div plus a
     lesson-section div, while all its Spanish sits flat in one container. The
     two child lists then share almost nothing and the whole pair is taken as
     one block, which is how ten thousand characters of real Spanish ended up
     frozen in a template. Flattening a wrapper that carries no language
     marker of its own, when doing so matches more, fixes that without any
     rule about which courses are shaped which way. */
  const WRAPPER = /^(div|section|article)$/i;
  /* A marker on a child is not a reason to keep it whole here. By the time
     two sides are being paired, which language each one is has already been
     settled; a lang-en div INSIDE the English side is just a wrapper. Leaving
     it intact is what kept CTSST unit 12's first section as one 5,800
     character block while its Spanish counterpart was five paragraphs, so the
     two lists misaligned and paragraphs were paired with the wrong ones. */
  const flattenable = (el) => WRAPPER.test(el.tagName || '')
    && hasBlockChildren(el) && el.childNodes.filter((x) => x.tagName).length > 1;

  const flatten = (kids) => kids.flatMap((k) =>
    flattenable(k) ? k.childNodes.filter((x) => x.tagName) : [k]);

  const matches = (a, b) => align(a, b).filter(([x, y]) => x && y).length;

  function pairUp(en, es, isMasthead) {
    if (en && es && hasBlockChildren(en) && hasBlockChildren(es)) {
      let a = en.childNodes.filter((x) => x.tagName);
      let b = es.childNodes.filter((x) => x.tagName);
      const best = matches(a, b);
      const fa = flatten(a), fb = flatten(b);
      if ((fa !== a || fb !== b) && matches(fa, fb) > best) { a = fa; b = fb; }
      const pairs = align(a, b);
      let lopsided = 0;
      for (const [a, b] of pairs) {
        if (a && b) { pairUp(a, b, false); continue; }
        lopsided++;
        /* One side has an element the other does not. Its text is still
           content and still has to be editable, so it becomes a block in the
           one language it exists in. */
        const only = a ?? b;
        const lang = a ? SOURCE : 'es';
        const id = nextId();
        const w = inner(only);
        blocks.push({ id, type: typeOf(only), text: { [lang]: w.text } });
        emit(only, lang, id, w.lead, w.trail);
      }
      if (lopsided) notes.push(`${course} unit ${unit}: ${lopsided} element(s) appear in one language and not the other`);
      return;
    }

    const we = en ? inner(en) : null, ws = es ? inner(es) : null;
    /* An empty pair is not content. Every course has a few -- <span
       class="lang-en"></span> slots the engine writes into at run time, a unit
       title among them. Left exactly as they are: no block, no hole, and one
       less meaningless row in the CMS. */
    if (!we?.text && !ws?.text) return;

    const id = nextId();
    const text = {};
    if (we) text[SOURCE] = we.text;
    if (ws) text.es = ws.text;
    const block = { id, type: isMasthead ? 'masthead' : typeOf(en ?? es), text };
    /* Everything already on the site was written by a person, in step with
       the English beside it. */
    if (en && es) block.tr = { es: { status: 'human', from: hash(text[SOURCE]) } };
    blocks.push(block);

    /* A pair whose two halves are wildly different lengths is usually not a
       pair at all -- it is two unrelated paragraphs that happened to land at
       the same index when the alignment slipped. It renders correctly either
       way, because each language keeps its own hole, so nothing else would
       notice; this is the only thing that would. */
    if (we?.text && ws?.text) {
      const a = plain(we.text).length, b = plain(ws.text).length;
      if (a > 120 && b > 120 && (a / b > 2.5 || b / a > 2.5))
        suspect.push(`${course} unit ${unit} ${id}: ${a} chars of ${SOURCE} paired with ${b} of es`);
    }

    /* Each element keeps its place, its tag, its classes and its id. Only its
       text moves out, and a hole marks where it goes back. */
    if (en) emit(en, SOURCE, id, we.lead, we.trail);
    if (es) emit(es, 'es', id, ws.lead, ws.trail);
  }

  /* Work through each parent's element children in order. Three ways a page
     pairs its languages, and all three appear:

       one to one   <p class=lang-en>…</p><p class=lang-es>…</p>
       in runs      ten English paragraphs, then their ten Spanish ones
       wrapped      the English inside a card, the Spanish outside it

     A run is not a special case bolted on: taking the children in order and
     matching an English run against the Spanish run that follows handles the
     one-to-one case as a run of length one. */
  /* A marker is a class on most pages and an id on a few (#teach-en). Both
     are asked about here: matching only classes silently left every
     id-marked Spanish half unpaired, frozen in the template and reported as
     a missing translation. */
  const marks = (el, name) => classes(el).includes(name) || el.getAttribute?.('id') === name;
  const isEn = (el, en, es) => marks(el, en) && !marks(el, es);
  const done = new Set();

  const scan = (parent) => {
    const kids = parent.childNodes.filter((n) => n.tagName);
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i];
      if (done.has(el)) continue;
      const m = markerOf(el);
      if (!m || m.side !== 'en') { scan(el); continue; }
      const [en, es] = m.pair;

      let a = i; while (a + 1 < kids.length && isEn(kids[a + 1], en, es)) a++;
      const enRun = kids.slice(i, a + 1);

      let j = a + 1;
      while (j < kids.length && !marks(kids[j], es)) {
        if (kids[j].text.replace(/\s+/g, '').length) break;   // real content between the runs
        j++;
      }
      let b = j - 1; while (b + 1 < kids.length && marks(kids[b + 1], es)) b++;
      let esRun = kids.slice(j, b + 1);

      /* Some courses wrap one language and leave the other outside the
         wrapper. If nothing matched among the siblings and this fragment is
         the last thing in its parent, look at the parent's next sibling. */
      if (!esRun.length && enRun.length === 1) {
        let up = parent.nextElementSibling;
        while (up && !up.text.replace(/\s+/g, '').length) up = up.nextElementSibling;
        if (up && marks(up, es)) {
          if (kids[kids.length - 1] === el) {
            esRun = [up];
          } else if (kids[0] === el) {
            /* The English is the first thing in the wrapper and more follows
               it that carries no marker of its own -- CTSST unit 12 keeps
               section one in a lang-en div and the rest in a lesson-section
               div beside it, while all the Spanish sits in one container
               outside. Pairing the WRAPPER against that container lets the
               flattening above line the two up; pairing only the marked div
               left ten thousand characters of Spanish frozen. */
            pairUp(parent, up, false);
            parent.querySelectorAll('*').forEach((d) => done.add(d));
            up.querySelectorAll('*').forEach((d) => done.add(d));
            done.add(parent); done.add(up);
            notes.push(`${course} unit ${unit}: the English is split across a wrapper and the Spanish is outside it — the wrapper was paired as a whole`);
            return;
          }
          if (esRun.length)
            notes.push(`${course} unit ${unit}: the Spanish half sits outside the wrapper its English half is in (${el.tagName.toLowerCase()}.${en}) — paired anyway`);
        }
      }

      if (esRun.length !== enRun.length) {
        /* A genuine gap: English on the page with no Spanish beside it. Kept
           as a block with no Spanish rather than invented or dropped -- the
           page has always shown nothing there to a Spanish reader, and now
           lesson-status.mjs can say so. */
        if (!esRun.length) {
          for (const e of enRun) {
            const id = nextId();
            const w = inner(e);
            blocks.push({ id, type: typeOf(e), text: { [SOURCE]: w.text } });
            emit(e, SOURCE, id, w.lead, w.trail);
            done.add(e);
            notes.push(`${course} unit ${unit}: a paragraph has no Spanish translation at all — recorded as missing`);
          }
          i = a; continue;
        }
        problems.push(`${course} unit ${unit}: ${enRun.length} English fragment(s) but ${esRun.length} Spanish (${el.tagName.toLowerCase()}.${en})`);
        i = a; continue;
      }

      for (let k = 0; k < enRun.length; k++) {
        pairUp(enRun[k], esRun[k], !!enRun[k].closest('header'));
        enRun[k].querySelectorAll('*').forEach((d) => done.add(d));
        esRun[k].querySelectorAll('*').forEach((d) => done.add(d));
        done.add(enRun[k]); done.add(esRun[k]);
      }
      i = a;
    }
  };
  scan(root);

  /* A second pass, for text the page never marked with a language.
   *
   * Diagram labels inside an <svg>, a figure caption written with inline
   * styles instead of language classes, a stray heading -- none of it carries
   * a marker, so the pairing above cannot see it, and it stayed in the
   * template where no teacher could reach it. It is still the lesson.
   *
   * Everything left that holds text becomes a block, EXCEPT the page
   * furniture named below. The list is the whole rule, so it can be read and
   * argued with: a registration form's dropdown, the navigation buttons, the
   * catalogue link, the honours-readings box the layout repeats on every
   * page. Adding one of those to a CMS would bury the lesson in 1,047 copies
   * of "Catalog / Catálogo". */
  const FURNITURE = [
    '#cts-register', '#greeting', '#regCard', '#registration-card', '#track-card',
    '#lockout-block', '#exam-section', '#results-block', '#questionsContainer',
    '#kwContainer', '#examResult', '#storageWarning', '#testBanner',
    '.reg-form', '.nav-bar', '.toolbar', '.topbar', '.langbar', '.progress-grid',
    '.storage-error', '.test-banner', '.crest', '.credits', '.unitnav', '.cts-unitnav',
    'nav', 'footer', 'select', 'option', 'button', 'label', 'input', 'script', 'style',
    '[data-cts-rrbox]',            // the honours-readings box, repeated on every page
  ].join(',');

  const furniture = new Set();
  for (const el of root.querySelectorAll(FURNITURE))
    { furniture.add(el); el.querySelectorAll('*').forEach((d) => furniture.add(d)); }

  /* Ordered so a block's id still follows the document. */
  for (const el of root.querySelectorAll('*')) {
    if (furniture.has(el)) continue;
    if (el.innerHTML.includes('<!--cts:')) continue;
    if (el.childNodes.some((n) => n.tagName && n.text.trim())) continue;   // not a leaf
    const w = inner(el);
    if (!w.text) continue;
    if (!plain(w.text)) continue;                    // markup with no words
    const id = nextId();
    /* `unmarked` says the page never gave this text a language at all -- a
       diagram label, a caption written with inline styles. It is not an
       untranslated paragraph, and counting it as one buried the four real
       gaps under fifteen hundred diagram labels. */
    blocks.push({ id, type: typeOf(el), unmarked: true, text: { [SOURCE]: w.text } });
    emit(el, SOURCE, id, w.lead, w.trail);
  }

  return { course, unit, sourceLang: SOURCE, langs: LANGS, template: root.toString(), blocks };
}

/* THE PROOF. Compared as parsed elements rather than as strings, so
   indentation is not mistaken for loss, and element by element, because a
   count that matches while two paragraphs swapped places is still a failure. */
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/* The page's own words, with the furniture taken out: what a teacher would
   expect to be able to edit. */
const FURNITURE = '#cts-register,#greeting,#regCard,#registration-card,#track-card,#lockout-block,'
  + '#exam-section,#results-block,.storage-error,.test-banner,.nav-bar,.reg-form,.toolbar,'
  + '#questionsContainer,#kwContainer,#examResult,nav,footer,script,style';
/* The other languages come out too, or the measure compares one language's
   blocks against every language's page and reports half of the truth. */
const OTHER = '.lang-es,.es-only,.block-es,.teach-es,.es-lbl,.pane.es,span.es,div.es,section.es,'
  + '#teach-es,#sa-note-es,#sa-badge-es,#titleEs,#t-title-es';
const textOf = (html) => {
  const r = parse(html, { comment: true });
  r.querySelectorAll(FURNITURE).forEach((e) => e.remove());
  r.querySelectorAll(OTHER).forEach((e) => e.remove());
  return norm(r.text).length;
};
const sig = (el) => {
  const attrs = Object.entries(el.attributes || {})
    .filter(([k]) => k !== 'class' && k !== 'id')
    .map(([k, v]) => `${k}=${v}`).sort().join(' ');
  return `${el.tagName.toLowerCase()}[${attrs}]`;
};
const walk = (html) => {
  const out = [];
  const go = (node) => {
    for (const el of node.childNodes) {
      if (!el.tagName) continue;
      out.push(sig(el) + '|' + norm(el.text));
      go(el);
    }
  };
  go(parse(html, { comment: true }));
  return out;
};

function convert(course) {
  /* The unit number comes from the Unit(n) group, never from the first run of
     digits in the name. Two courses have a digit in their own prefix --
     CTS1Peter and CTSBibleCharacters2 -- and taking the first number made
     every unit of those courses claim to be unit 1 and unit 2, so eleven
     lessons overwrote each other and the page served the wrong one. The prose
     baseline caught it; this is why it reads the group. */
  const unitOf = (f) => +f.match(/Unit(\d+)\.html$/)[1];
  const files = fs.readdirSync('src/body')
    .filter((f) => new RegExp(`^${course}Unit\\d+\\.html$`).test(f))
    .sort((a, b) => unitOf(a) - unitOf(b));
  if (!files.length) return { course, skipped: 'no unit bodies' };

  const problems = [], notes = [], suspect = [], lessons = [];
  for (const f of files) {
    const html = fs.readFileSync(path.join('src/body', f), 'utf8');
    const unit = unitOf(f);
    let lesson;
    try { lesson = extractUnit(course, unit, html, problems, notes, suspect); }
    catch (e) { problems.push(`${f}: ${e.message}`); continue; }

    let back;
    try { back = renderLesson(lesson); }
    catch (e) { problems.push(e.message); continue; }

    const a = walk(html), b = walk(back);
    if (a.length !== b.length) {
      const gone = a.filter((x) => !b.includes(x)).slice(0, 2);
      problems.push(`${f}: ${a.length} elements in, ${b.length} out` + (gone.length ? `\n      first missing: ${gone[0].slice(0, 110)}` : ''));
      continue;
    }
    for (let i = 0; i < a.length; i++)
      if (a[i] !== b[i]) {
        /* Print where they actually diverge. A difference at character 900 is
           invisible if the report always shows the first hundred. */
        let k = 0; while (k < a[i].length && a[i][k] === b[i][k]) k++;
        const at = Math.max(0, k - 40);
        problems.push(`${f}: element ${i + 1} differs at character ${k} of ${a[i].length}`
          + `\n      was: …${a[i].slice(at, k + 60)}\n      now: …${b[i].slice(at, k + 60)}`);
        break;
      }

    /* Coverage: how much of the page's prose a teacher can actually reach.
       A conversion that loses nothing but leaves the lesson locked inside the
       template is a clean round trip and a useless CMS, so this is measured
       rather than assumed. Page furniture is not prose and is not counted. */
    const pageText = textOf(html);
    const blockText = lesson.blocks
      .reduce((t, b) => t + norm(parse('<x>' + (b.text[SOURCE] ?? '') + '</x>').text).length, 0);
    lessons.push({ file: f, lesson, pageText, blockText });
  }
  /* One lesson per body, with distinct unit numbers. A course that produces
     fewer files than it had pages has silently lost units to a collision. */
  const units = new Set(lessons.map((l) => l.lesson.unit));
  if (lessons.length && units.size !== lessons.length)
    problems.push(`${course}: ${lessons.length} bodies produced only ${units.size} distinct unit numbers — they would overwrite each other`);
  return { course, problems, notes, suspect, lessons, units: files.length };
}

const done = new Set(fs.existsSync(OUT_ROOT) ? fs.readdirSync(OUT_ROOT) : []);
const targets = ALL
  ? [...new Set(fs.readdirSync('src/body').map((f) => f.match(/^(.+?)Unit\d+\.html$/)?.[1]).filter(Boolean))].sort()
  : [ONE];

let ok = 0, failed = 0, totalBlocks = 0;
for (const course of targets) {
  const r = convert(course);
  if (r.skipped) { console.log(`${course.padEnd(26)} — ${r.skipped}`); continue; }
  const nb = r.lessons.reduce((t, l) => t + l.lesson.blocks.length, 0);
  if (r.problems.length) {
    failed++;
    console.log(`${course.padEnd(26)} FAIL  ${r.units} units — ${r.problems.length} problem(s)`);
    r.problems.slice(0, 3).forEach((p) => console.log('    ' + p));
    if (r.problems.length > 3) console.log(`    … and ${r.problems.length - 3} more`);
    continue;
  }
  const pt = r.lessons.reduce((t, l) => t + l.pageText, 0);
  const bt = r.lessons.reduce((t, l) => t + l.blockText, 0);
  const cover = pt ? Math.round((bt / pt) * 100) : 0;
  /* Coverage says the words are reachable; it does not say they are reachable
     one paragraph at a time. A course whose text all sits in two blocks per
     unit round-trips perfectly and gives a teacher one enormous textarea, so
     the biggest block is reported too -- that is what a missed pairing looks
     like from the outside. */
  const biggest = Math.max(0, ...r.lessons.flatMap((l) => l.lesson.blocks
    .map((b) => norm(parse('<x>' + (b.text[SOURCE] ?? '') + '</x>').text).length)));
  const coarse = biggest > 2000;
  ok++; totalBlocks += nb;
  console.log(`${course.padEnd(26)} ok    ${String(r.units).padStart(2)}u ${String(nb).padStart(5)} blocks   ${String(cover).padStart(3)}% of the prose is editable`
    + `  biggest block ${String(biggest).padStart(5)} chars${coarse ? '  <-- one long section in a single field' : ''}`
    + (r.notes.length ? `   (${r.notes.length} note${r.notes.length > 1 ? 's' : ''})` : ''));
  if (r.notes.length && !ALL) [...new Set(r.notes)].slice(0, 4).forEach((n) => console.log('    note: ' + n));
  if (r.suspect.length) {
    console.log(`    ${r.suspect.length} pair(s) look mismatched — the two languages are very different lengths:`);
    r.suspect.slice(0, 3).forEach((n) => console.log('      ' + n));
  }
  if (CHECK) continue;
  const dir = path.join(OUT_ROOT, course);
  fs.mkdirSync(dir, { recursive: true });
  for (const { lesson } of r.lessons)
    fs.writeFileSync(path.join(dir, `${lesson.unit}.json`), JSON.stringify(lesson, null, 1) + '\n');
}
console.log(`\n${ok} course(s) round-trip cleanly${totalBlocks ? `, ${totalBlocks} blocks` : ''}; ${failed} did not.`);
if (CHECK) console.log('nothing was written (--check)');
process.exitCode = failed && !ALL ? 1 : 0;
