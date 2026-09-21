/* Fill in the translations a lesson is missing, and refresh the ones the
 * author has outrun.
 *
 * The rules it will not break, which are the reason this is a tool and not a
 * loop over an API:
 *
 *   1. It translates only what is MISSING or STALE. A translation that is
 *      current is left alone, whoever made it.
 *   2. It never overwrites a person's work silently. A block marked `human`
 *      or `machine-edited` is only re-translated when the source has actually
 *      changed under it, and then it says so, by name, before doing it.
 *   3. Everything it writes is marked `machine` and stamped with the hash of
 *      the exact source text it was made from -- so the next edit to that
 *      paragraph makes it stale, and a person's later correction (`human`)
 *      survives every run after that.
 *
 * That third rule is what makes the fine-tune option work. An editor fixes a
 * machine translation, the CMS sets it to `machine-edited`, and this tool
 * will not touch it again until the author changes the English underneath it.
 *
 * THE PROVIDER
 *
 * Translation itself is one function -- text in, text out -- chosen by
 * --provider. `tag` is a stand-in that marks text instead of translating it,
 * so the machinery can be tested without a vendor or a key. A real one is
 * added below: an async function taking (texts, from, to) and returning the
 * translated array in the same order. Batched per block, so a vendor that
 * charges per request is not called once per sentence.
 *
 *   node tools/translate-lesson.mjs CTSHermeneutics --lang fr --dry-run
 *   node tools/translate-lesson.mjs CTSHermeneutics --lang fr --provider tag
 */
import fs from 'node:fs';
import path from 'node:path';
import { hash, isStale } from '../src/lib/lesson.ts';

const args = process.argv.slice(2);
const COURSE = args.find((a) => !a.startsWith('-'));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? fallback : args[i + 1];
};
const DRY = args.includes('--dry-run');
const LANG = opt('lang');
const UNIT = opt('unit');
if (!COURSE || !LANG) {
  console.error('usage: node tools/translate-lesson.mjs <Course> --lang <code> [--unit N] [--provider tag] [--dry-run]');
  process.exit(2);
}

/* Stand-in providers. A real vendor goes here as one more entry. */
const PROVIDERS = {
  /* Marks the text rather than translating it: proves the plumbing moves the
     right strings to the right blocks without paying anyone to find out. */
  tag: async (texts, from, to) => texts.map((t) => `[${from}->${to}] ${t}`),
};

const provider = PROVIDERS[opt('provider', 'tag')];
if (!provider) { console.error(`no such provider: ${opt('provider')}`); process.exit(2); }

const dir = path.join('src', 'content', 'lessons', COURSE);
if (!fs.existsSync(dir)) { console.error(`${COURSE} has not been converted`); process.exit(1); }

const parts = (b) => (b.type === 'figure' ? b.caption : b);   // where a block's words live

let translated = 0, overwritten = [], files = 0;
for (const f of fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f))
                 .sort((a, b) => parseInt(a) - parseInt(b))) {
  const file = path.join(dir, f);
  const l = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (UNIT && String(l.unit) !== String(UNIT)) continue;
  if (LANG === l.sourceLang) { console.error(`${LANG} is the source language`); process.exit(2); }

  const todo = [];
  for (const b of l.blocks) {
    const p = parts(b);
    const src = p?.text?.[l.sourceLang];
    if (src == null) continue;
    const has = p.text[LANG] != null;
    if (has && !isStale(b, LANG, l.sourceLang)) continue;
    const was = p.tr?.[LANG]?.status;
    if (was === 'human' || was === 'machine-edited')
      overwritten.push(`${COURSE} unit ${l.unit} ${b.id}: a ${was} translation is stale and will be replaced`);
    todo.push({ b, p, src });
  }
  if (!todo.length) continue;

  console.log(`unit ${String(l.unit).padStart(2)}: ${todo.length} block(s) ${DRY ? 'would be' : ''} translated ${l.sourceLang} -> ${LANG}`);
  if (DRY) { translated += todo.length; continue; }

  const out = await provider(todo.map((t) => t.src), l.sourceLang, LANG);
  if (out.length !== todo.length) { console.error('the provider returned a different number of texts than it was given'); process.exit(1); }

  todo.forEach(({ p, src }, i) => {
    p.text[LANG] = out[i];
    p.tr = { ...(p.tr ?? {}), [LANG]: { status: 'machine', from: hash(src) } };
  });
  if (!l.langs.includes(LANG)) l.langs.push(LANG);
  fs.writeFileSync(file, JSON.stringify(l, null, 1) + '\n');
  translated += todo.length;
  files++;
}

overwritten.forEach((w) => console.log('  ! ' + w));
console.log(DRY
  ? `\n${translated} block(s) would be translated. Nothing was written.`
  : `\n${translated} block(s) translated into ${LANG} across ${files} unit(s), marked machine.`);
