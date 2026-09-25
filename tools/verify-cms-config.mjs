/* The CMS config against the content it edits.
 *
 * THE DEFECT THIS EXISTS TO CATCH
 *
 * Sveltia -- like Decap -- writes back only the fields its config declares.
 * A field the config does not mention is not preserved: it is DROPPED from the
 * file the moment a teacher presses save on that entry. Nothing warns anyone.
 * The lesson still builds, because the build reads what is left.
 *
 * So the dangerous change is not a broken config, which fails loudly. It is a
 * field added to the data and not to the config -- after which the first person
 * to fix a typo in a unit quietly deletes something from it.
 *
 * This walks every content file, collects every key path that actually exists
 * in the data, and requires the config to declare each one. It is checked
 * against the data rather than against the Zod schema on purpose: the schema
 * says what is allowed, and this needs to know what is THERE.
 *
 *   node tools/verify-cms-config.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const CONFIG = 'public/admin/config.yml';
if (!fs.existsSync(CONFIG)) {
  console.error(`no ${CONFIG} — run: node tools/build-cms-config.mjs`);
  process.exit(2);
}
/* Parsed with a real YAML parser, so a config the CMS could not load fails
   here rather than in front of a teacher. */
let config;
try {
  config = parseYaml(fs.readFileSync(CONFIG, 'utf8'));
} catch (e) {
  console.log(`FAIL: ${CONFIG} is not valid YAML — the CMS would not load at all`);
  console.log('  ' + String(e.message).split('\n')[0]);
  process.exit(1);
}

/* Walk the data GUIDED BY THE CONFIG, and report any key in the data that no
   declared field accounts for. Guided rather than two independent lists,
   because the shared field names are where the real damage hides: `text` is
   declared on seven block types, so a union of paths still looks complete
   after `text` is removed from the paragraph type alone -- and 301 paragraphs
   lose their words. Walking by type asks the question per shape. */
function check(value, fields, where, lost) {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return;
  const byName = new Map((fields ?? []).filter((f) => f.name).map((f) => [f.name, f]));

  for (const [k, v] of Object.entries(value)) {
    const f = byName.get(k);
    const at = `${where}.${k}`;
    if (!f) { lost.add(at); continue; }
    /* hidden carries a value through whole, whatever is inside it */
    if (f.widget === 'hidden') continue;

    if (Array.isArray(v)) {
      if (f.types) {
        /* a variable-type list: each item is checked against its own shape */
        for (const item of v) {
          const key = f.typeKey ?? 'type';
          const t = (f.types ?? []).find((t) => t.name === item?.[key]);
          if (!t) { lost.add(`${at}[${item?.[key] ?? '?'}]`); continue; }
          const { [key]: _t, ...rest } = item;       // the type key is the list's own
          check(rest, t.fields, `${at}[${t.name}]`, lost);
        }
      } else if (f.fields) {
        for (const item of v) check(item, f.fields, at + '[]', lost);
      }
      continue;                       // a list of plain values declares no keys
    }
    if (v && typeof v === 'object') check(v, f.fields, at, lost);
  }
}

const files = (dir) => {
  const out = [];
  const go = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) go(p);
      else if (e.name.endsWith('.json')) out.push(p);
    }
  };
  if (fs.existsSync(dir)) go(dir);
  return out;
};

let missing = 0, checked = 0, entries = 0;

for (const c of config.collections) {
  if (!c.folder) continue;

  const lost = new Set();
  let seen = 0;
  for (const f of files(c.folder)) {
    /* Files beginning with _ are not entries a teacher opens -- the shared page
       parts, for one. They are course-level markup, not content. */
    if (path.basename(f).startsWith('_')) continue;
    seen++;
    check(JSON.parse(fs.readFileSync(f, 'utf8')), c.fields, c.name, lost);
  }
  if (!seen) continue;
  checked++; entries += seen;

  if (lost.size) {
    console.log(`${c.name}: ${lost.size} field(s) are in the content and not in the config —`);
    console.log('  a teacher saving one of these entries would delete them:');
    [...lost].sort().slice(0, 12).forEach((p) => console.log(`    ${p}`));
    if (lost.size > 12) console.log(`    … and ${lost.size - 12} more`);
    missing += lost.size;
  }
}

/* Fields the schema allows and the content may not have yet. The walk above
   only sees what is THERE, so a field used in one course would be checked
   only once that course was drafted. A sample unit carrying every optional
   question field is walked against the config too. */
{
  const units = config.collections.find((c) => c.name === 'units');
  const sample = {
    fill: [{ prompt: { en: 'a ____', es: 'un ____' }, answer: { en: 'a', es: 'b' },
             accept: { en: ['c'], es: ['d'] } }],
  };
  const lost = new Set();
  check(sample, units?.fields, 'units(sample)', lost);
  if (!units || lost.size) {
    console.log('units: the config does not declare every fill-in field —');
    [...lost].sort().forEach((p) => console.log(`    ${p}`));
    missing += lost.size || 1;
  }
}

/* Every converted course must have a collection, or its lessons are not
   editable at all and nobody finds out until they look. */
const LESSONS = 'src/content/lessons';
if (fs.existsSync(LESSONS)) {
  for (const course of fs.readdirSync(LESSONS)) {
    if (!config.collections.some((c) => c.folder === `${LESSONS}/${course}`)) {
      console.log(`${course} is converted but has no collection — its lessons are not editable`);
      missing++;
    }
  }
}

console.log(`cms config: ${checked} collection(s), ${entries} entries, against ${CONFIG}`);
if (missing) {
  console.log(`FAIL: ${missing} problem(s). Regenerate with: node tools/build-cms-config.mjs`);
  process.exitCode = 1;
} else {
  console.log('OK: every field in the content is declared, so nothing is dropped on save.');
}
