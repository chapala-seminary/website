/* Private reading banks (docs/reading-rooms.md, "Private reading tests"): a
 * reading test whose answers live only in the assessment-keys checkout, the
 * way the textbooks' do. With a throwaway bank in temporary folders (removed
 * on the way out), never in the tree or the real checkout:
 *
 *   - tools/import-readings.mjs writes the public file with prompts, reading
 *     numbers and titles and keys: "private", and no answer, accept or tr;
 *   - and the private file with them, in the shape overlayQuestions reads;
 *   - French added later is kept on a second import, split the same way;
 *   - the content schema takes the public file, and refuses it with a key in it;
 *   - the leak check (privateReadingLeaks, used by tools/verify-no-keys.mjs)
 *     passes the public file and fails one with answer, accept or tr;
 *   - the overlay gives graded questions: the grading rows carry the answers,
 *     the server's own fill-in rule marks them right, and without the
 *     checkout the rows are refused rather than built answerless;
 *   - a live reading-test page carries no keys: the bank a live page is given
 *     (src/lib/grading-mode.ts liveBank) holds none, and the page ships no bank.
 *
 *   node test/private-readings.test.mjs [dist]
 *
 * Given a built dist/, every private bank installed in src/content/readings
 * is also checked on its built test pages (English, Spanish, French): the
 * live page's data says grading "live", ships no questions, and none of the
 * bank's answers is in it.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { z } from 'astro/zod';
import { buildTest, writeTest, splitPrivate } from '../tools/import-readings.mjs';
import { readingQuestions, readingKeyRows, privateReadingLeaks, isPrivateReading } from '../tools/grading-keys-lib.mjs';
import { exactFill } from '../worker/grading/text.js';
import { liveBank } from '../src/lib/grading-mode.ts';

let checks = 0;
const ok = (c, m) => { assert.ok(c, m); checks++; };
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const DIST = process.argv[2] || null;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-private-readings-'));
try {
  const keys = path.join(tmp, 'assessment-keys'), site = path.join(tmp, 'site');
  const out = path.join(site, 'src/content/readings');
  fs.mkdirSync(path.join(keys, 'readings-src'), { recursive: true });
  fs.mkdirSync(path.join(keys, 'readings'), { recursive: true });

  /* ---- a throwaway bank: forty questions, eight on each of five readings ---- */
  const SLUG = 'elecfixturereadings';
  const answerEn = (i) => `Zorvex${i}`, answerEs = (i) => `Zorvexo${i}`, altEn = (i) => `Qelmar${i}`;
  const bank = { course: 'Fixture elective', format: { type: 'fill-in-the-blank', questions_per_attempt: 20, passing_score: 18, questions_drawn_per_reading: 4 },
    questions: Array.from({ length: 40 }, (_, k) => ({ id: k + 1, reading: Math.floor(k / 8) + 1,
      en: `Fixture question ${k + 1} says the word is ____.`, es: `La pregunta ${k + 1} dice que la palabra es ____.`,
      answer_en: answerEn(k + 1), answer_es: answerEs(k + 1) })) };
  const accept = Object.fromEntries(bank.questions.map((q) => [String(q.id), { en: [altEn(q.id)], es: [`Qelmaro${q.id}`] }]));
  fs.writeFileSync(path.join(keys, 'readings-src', `${SLUG}.bank.json`), JSON.stringify(bank));
  fs.writeFileSync(path.join(keys, 'readings-src', `${SLUG}.accept.json`), JSON.stringify(accept));
  const row = { slug: SLUG, page: 'CTSElecFixtureReadings', course: 'CTSElecBap1', kind: 'reading', requiredFrom: null, private: true, alternates: 'optional',
    title: { en: 'Fixture: Required Readings', es: 'Prueba: Lecturas Requeridas' },
    room: { en: 'the five fixture readings', es: 'las cinco lecturas de prueba' } };
  const secrets = bank.questions.flatMap((q) => [answerEn(q.id), answerEs(q.id), altEn(q.id), `Qelmaro${q.id}`]);

  /* ---- import ---- */
  const full = buildTest(row, SLUG, { keysRoot: keys });
  writeTest(row, full, { outDir: out, keysRoot: keys, say: () => {} });
  const pubFile = path.join(out, `${SLUG}.json`), keyFile = path.join(keys, 'readings', `${SLUG}.json`);
  const pub = json(pubFile), priv = json(keyFile), pubText = fs.readFileSync(pubFile, 'utf8');
  ok(isPrivateReading(pub), 'the public file says keys: "private"');
  ok(pub.test.questions.length === 40 && pub.test.questions.every((q) => q.prompt.en && q.prompt.es && Number.isInteger(q.reading)), 'the public file has every prompt and reading number');
  ok(pub.title.en === row.title.en && pub.room.es === row.room.es && pub.test.draw === 20 && pub.test.pass === 18 && pub.test.perReading === 4, 'and the titles, draw, pass and per-reading draw');
  ok(pub.test.questions.every((q) => !('answer' in q) && !('accept' in q) && !('tr' in q)), 'the public file has no answer, accept or tr');
  ok(!secrets.some((s) => pubText.includes(s)), 'no answer or accepted answer appears anywhere in the public file');
  ok(!pubText.includes(keys) && pub.source.file === `assessment-keys/readings-src/${SLUG}.bank.json`, 'the public file names the private source without the machine path');
  ok(priv.slug === SLUG && priv.test.questions.length === 40, 'the private file holds the forty questions');
  ok(priv.test.questions.every((q, i) => q.prompt.en === pub.test.questions[i].prompt.en && q.answer.en === answerEn(i + 1) && q.answer.es === answerEs(i + 1)
    && q.accept.en[0] === altEn(i + 1) && q.reading === pub.test.questions[i].reading), 'the private file holds prompt, answer, accept and reading, in the public order');

  /* ---- a second import keeps French added since, and keeps it split ---- */
  priv.test.questions[0].prompt.fr = 'La question un dit ____.';
  priv.test.questions[0].answer.fr = 'Zorvexfr1';
  priv.test.questions[0].accept.fr = [];
  priv.test.questions[0].tr = { fr: { status: 'machine', from: 'abcdef123456' } };
  pub.test.questions[0].prompt.fr = 'La question un dit ____.';
  fs.writeFileSync(keyFile, JSON.stringify(priv)); fs.writeFileSync(pubFile, JSON.stringify(pub));
  writeTest(row, buildTest(row, SLUG, { keysRoot: keys }), { outDir: out, keysRoot: keys, say: () => {} });
  const pub2 = json(pubFile), priv2 = json(keyFile);
  ok(pub2.test.questions[0].prompt.fr === 'La question un dit ____.' && !('tr' in pub2.test.questions[0]) && !fs.readFileSync(pubFile, 'utf8').includes('Zorvexfr1'), 'French prompts stay public; the French answer and its stamp do not');
  ok(priv2.test.questions[0].answer.fr === 'Zorvexfr1' && priv2.test.questions[0].tr?.fr?.from === 'abcdef123456', 'the French answer and its stamp are kept in the private file');

  /* ---- the content schema (src/content.config.ts, outside Astro) ---- */
  const source = fs.readFileSync('src/content.config.ts', 'utf8').replace(/^import .*;\n/gm, '');
  const collections = new Function('defineCollection', 'glob', 'z', stripTypeScriptTypes(source).replace('export const collections =', 'return'))((v) => v, (v) => v, z);
  const schema = collections.readings.schema;
  ok(schema.safeParse(pub2).success, 'the schema takes a private public file without answers');
  const leaky = structuredClone(pub2); leaky.test.questions[3].answer = { en: 'x', es: 'y' };
  ok(!schema.safeParse(leaky).success, 'and refuses one with an answer');
  const unflagged = structuredClone(pub2); delete unflagged.keys;
  ok(!schema.safeParse(unflagged).success, 'a bank without answers that does not say keys: "private" is refused');
  ok(schema.safeParse(json('src/content/readings/genesisreadings.json')).success, 'an existing public bank still passes');

  /* ---- the leak check ---- */
  ok(privateReadingLeaks(pub2).length === 0, 'the leak check passes the public file');
  for (const f of ['answer', 'accept', 'tr']) {
    const bad = structuredClone(pub2); bad.test.questions[5][f] = f === 'tr' ? { fr: { status: 'machine', from: 'x' } } : { en: f === 'accept' ? ['x'] : 'x', es: f === 'accept' ? ['y'] : 'y' };
    ok(privateReadingLeaks(bad).some((m) => m.includes(`"${f}"`)), `the leak check fails a public file carrying ${f}`);
  }
  ok(privateReadingLeaks(unflagged).length > 0, 'and one that does not say keys: "private"');
  const { pub: split } = splitPrivate(full);
  ok(privateReadingLeaks(split).length === 0 && split.test.questions.length === full.test.questions.length, 'splitPrivate gives a clean public file of the same length');

  /* ---- the overlay gives graded questions ---- */
  const merged = readingQuestions('.', pub2, () => {}, keys);
  ok(merged.fromPrivate && merged.questions.every((q, i) => q.answer.en === answerEn(i + 1) && q.prompt.en === pub2.test.questions[i].prompt.en), 'readingQuestions joins the keys, question by question');
  ok(merged.questions[0].tr?.fr?.from === 'abcdef123456', 'and the French stamps');
  assert.throws(() => readingQuestions('.', pub2, () => {}, null), /only in the private assessment-keys checkout/); checks++;
  const short = path.join(tmp, 'short-keys');
  fs.mkdirSync(path.join(short, 'readings'), { recursive: true });
  fs.writeFileSync(path.join(short, 'readings', `${SLUG}.json`), JSON.stringify({ slug: SLUG, test: { questions: priv2.test.questions.slice(0, 5) } }));
  assert.throws(() => readingQuestions('.', pub2, () => {}, short), /only in the private assessment-keys checkout/); checks++;
  const catalog = { textbooks: { [SLUG]: { code: 'CTSELECBAP1', kind: 'reading', page: row.page, requiredFrom: null } } };
  const rows = readingKeyRows({ root: site, catalog, keysRoot: keys });
  ok(rows.size === 41 && JSON.parse(rows.get(`rd:${SLUG}/meta/0`).data).n === 40, 'the grading rows: a meta row and forty questions');
  const r7 = JSON.parse(rows.get(`rd:${SLUG}/fill/6`).data);
  ok(exactFill(r7, answerEn(7), 'en') && exactFill(r7, altEn(7), 'en') && exactFill(r7, answerEs(7), 'es'), 'the server marks the answer and an accepted answer right');
  ok(!exactFill(r7, answerEn(8), 'en') && r7.group === 1, 'a wrong answer wrong, and the reading is the group');
  assert.throws(() => readingKeyRows({ root: site, catalog, keysRoot: null }), /reading answers are only in the private assessment-keys checkout/); checks++;

  /* ---- a live page carries no keys ---- */
  const shown = liveBank({ slug: SLUG, kind: 'reading', questions: merged.questions });
  ok(shown.scope === `rd:${SLUG}`, 'a live page grades under the rd scope');
  ok(shown.questions.every((q) => Object.keys(q).every((k) => ['qid', 'prompt', 'reading', 'group', 'chapter', 'stem', 'text', 'options'].includes(k))), 'the live bank holds only what a student reads');
  const liveText = JSON.stringify(shown);
  ok(!secrets.some((s) => liveText.includes(s)) && !liveText.includes('Zorvexfr1') && !liveText.includes('abcdef123456'), 'no answer, accepted answer or stamp is in it');
  const page = fs.readFileSync('src/pages/[readingtest].astro', 'utf8');
  ok(/questions: shown \? \[\] : shadowBank/.test(page) && /readingQuestions\('\.', reading/.test(page), 'the live page ships no bank; only a shadow page has the joined keys');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
ok(!fs.existsSync(tmp), 'the temporary folders are removed');

/* ---- built pages of the private banks installed, when given dist/ ---- */
let built = 0;
if (DIST) {
  for (const f of fs.readdirSync('src/content/readings').filter((x) => x.endsWith('.json'))) {
    const pub = json(path.join('src/content/readings', f));
    if (!isPrivateReading(pub)) continue;
    // an answer as a value in the data (a whole JSON string), not a word inside a title
    const answers = readingQuestions('.', pub).questions.flatMap((q) => [...Object.values(q.answer), ...Object.values(q.accept || {}).flat()]);
    for (const lang of ['', 'es/', 'fr/']) {
      const file = path.join(DIST, `${lang}${pub.page}Test.html`);
      if (!fs.existsSync(file)) { ok(lang === 'fr/', `${file} was not built`); continue; }
      const html = fs.readFileSync(file, 'utf8');
      const m = /window\.CTS_TEXTBOOK_TEST = (.*?);?\s*(?:\n|<\/script>)/.exec(html);
      ok(!!m, `${file}: no test data`);
      const data = JSON.parse(m[1]);
      ok(data.grading === 'live' && Array.isArray(data.questions) && data.questions.length === 0, `${file}: a live page ships no bank`);
      // an answer as a value in the question data; the page's own labels (slug, title,
      // grading: "live", the completion record) are left out, since a one-word answer
      // such as "live" or "completion" can be one of them
      const { slug: _s, page: _p, kind: _k, title: _t, completion: _c, grading: _g, scope: _sc, ...rest } = data;
      const values = new Set(); const walk = (v) => { if (typeof v === 'string') values.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); }; walk(rest);
      const hit = answers.find((a) => values.has(a));
      ok(!/"(answer|accept)"\s*:/.test(m[1]), `${file}: the page data has an answer or accept field`);
      ok(!hit, `${file}: an answer (${hit}) is in the page data`);
      built++;
    }
  }
}
console.log(`PASS — ${checks} private reading checks: the public file has prompts only, the keys are private, the overlay grades, a live page carries no key${DIST ? `; ${built} built page(s) of installed private banks checked` : ''}.`);
