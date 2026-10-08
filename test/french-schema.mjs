/* Exercise the actual build schemas outside Astro's virtual content module. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { z } from 'astro/zod';
const source = fs.readFileSync('src/content.config.ts', 'utf8')
  .replace(/^import .*;\n/gm, '');
const collections = new Function('defineCollection', 'glob', 'z', stripTypeScriptTypes(source).replace('export const collections =', 'return'))
  (value => value, value => value, z);
const schema = collections.units.schema;
const raw = JSON.parse(fs.readFileSync('src/content/units/CTS/1.json'));
const fields = ['stem','prompt','options','why','answer','accept','keywords','model'];
for (const section of ['mc','fill','sa']) for (const q of raw[section])
  for (const key of fields) if (q[key]?.en != null) q[key].fr = structuredClone(q[key].en);
let checks = 0;
function check(value, expected) { assert.equal(schema.safeParse(value).success,expected); checks++; }
check(raw,true);
const parsed = schema.parse(raw);
assert.deepEqual(parsed.sa[0].keywords.fr,raw.sa[0].keywords.fr);checks++;
assert.deepEqual(parsed.fill[0].answer.fr,raw.fill[0].answer.fr);checks++;
for (const [section,key] of [['mc','options'],['fill','answer'],['sa','keywords'],['sa','model']]) {
  const bad=structuredClone(raw);delete bad[section][0][key].fr;check(bad,false);
}
const short=structuredClone(raw);short.mc[0].options.fr.pop();check(short,false);
const gap=structuredClone(raw);gap.fill[0].prompt.fr='No gap';check(gap,false);
const lesson=JSON.parse(fs.readFileSync('src/content/lessons/CTS/1.json'));
lesson.langs.push('fr');for(const b of lesson.blocks)if(b.text.en!=null)b.text.fr=b.text.en;
assert.ok(collections.lessons.schema.safeParse(lesson).success);checks++;
// Adding a new language must not excuse deleting an original language slot.
lesson.template=lesson.template.replace(/<!--cts:[\w-]+:es-->/,'');
assert.ok(!collections.lessons.schema.safeParse(lesson).success);checks++;
console.log(`${checks} French schema checks — PASS; translated fields survive and incomplete keys fail.`);
