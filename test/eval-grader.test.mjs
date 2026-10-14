// Tests for the grader eval harness (tools/eval-*.mjs). No network, no quota,
// no Cloudflare: the grader runs with --dry-run, and the REST shim is driven
// with a stub fetch. This does NOT measure the AI; it checks that the set is
// well formed and that the machinery that will measure it is sound.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ROOT, readItemFiles, validateItem, keyFor, applyHoldout, bare, wordCount,
} from '../tools/eval-lib.mjs';
import { summarise, BAR } from '../tools/eval-summary.mjs';
import { makeRestAI, readAccountId, checkQuotaGate } from '../tools/eval-ai-shim.mjs';
import { buildSheet, toCsv, toHtml } from '../tools/eval-blind-sheet.mjs';
import { importGrades, parseCsv } from '../tools/eval-import-human.mjs';
import { selectItems } from '../tools/eval-grader.mjs';

const node = (args, env = {}) => spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CLOUDFLARE_API_TOKEN: '', ...env } });
let n = 0; const ok = (name) => { n++; console.log(`  ok  ${name}`); };

// ---- the set -------------------------------------------------------------
const items = readItemFiles();
{
  const ids = new Set();
  for (const it of items) {
    const errs = validateItem(it);
    assert.deepEqual(errs, [], `${it.id}: ${errs.join(', ')}`);
    assert.ok(!ids.has(it.id), `duplicate id ${it.id}`); ids.add(it.id);
    assert.equal(it.expected_by, 'agent', `${it.id}: item files hold agent labels only (human grades live in test/eval/human/)`);
    keyFor(it.qid);                                              // the question exists
  }
  ok(`${items.length} items valid, ids unique, every qid resolves`);

  const count = (cat, f = () => true) => items.filter(i => i.category === cat && f(i)).length;
  assert.ok(count('fixture') >= 460, 'fixture: the 460 right answers plus wrong ones');
  assert.equal(count('copied', i => i.qid.startsWith('u:CTSJohn') || i.qid.startsWith('u:CTSMatt') || i.qid.startsWith('u:CTSActs') || i.qid.startsWith('u:CTSRomans')), 460);
  assert.equal(count('copied'), 660);
  assert.ok(count('half') >= 140 && count('contradict') >= 75 && count('padded') >= 45 && count('terse') >= 75);
  assert.equal(count('translated'), 120);
  assert.ok(count('injection') >= 50 && items.filter(i => i.category === 'injection').every(i => i.expected === 'pending'));
  assert.ok(count('fill_synonym') >= 290 && count('fill_near_miss') >= 190);
  assert.ok(count('fill_misspelling', i => i.expected === 'right') >= 75 && count('fill_misspelling', i => i.expected === 'wrong') >= 28);
  for (const l of ['en', 'es', 'fr']) assert.ok(items.some(i => i.category === 'translated' && i.lang === l || i.category === 'injection' && i.lang === l), `no ${l} coverage`);
  ok('category sizes match the plan');

  // a short answer under 15 words is failed by rule before the model sees it, so
  // an item meant to test the model must be at least 15 words
  const tooShort = items.filter(i => i.kind === 'sa' && !['copied', 'fixture'].includes(i.category) && wordCount(i.answer) < 15);
  assert.deepEqual(tooShort.map(i => i.id), [], 'model-path short answers need 15+ words');
  ok('model-path short answers are all 15+ words');

  // fill_synonym: the held-out entry is really an accept entry and really gone from the key
  for (const it of items.filter(i => i.category === 'fill_synonym')) {
    const full = keyFor(it.qid), held = applyHoldout(full, it.holdout);
    assert.ok((full.accept[it.lang] || []).some(a => bare(a) === bare(it.holdout)), `${it.id}: holdout not in accept`);
    for (const l of Object.keys(held.accept)) assert.ok(!held.accept[l].some(a => bare(a) === bare(it.holdout)), `${it.id}: holdout still in key`);
    assert.equal(it.answer, it.holdout);
  }
  ok('fill_synonym hold-outs removed from the key');

  // near misses and wrong typos must not be an accepted form of the answer
  for (const it of items.filter(i => i.kind === 'fill' && i.expected === 'wrong')) {
    const k = keyFor(it.qid), forms = ['en', 'es', 'fr'].flatMap(l => [k.answer?.[l], ...(k.accept?.[l] || [])]).filter(Boolean).map(bare);
    assert.ok(!forms.includes(bare(it.answer)), `${it.id}: "${it.answer}" is actually an accepted answer`);
  }
  ok('no "wrong" fill-in is an accepted form');
}

// ---- the generator is deterministic and the files are current ------------
{
  const r = node(['tools/eval-build.mjs', '--check']);
  assert.equal(r.status, 0, r.stderr);
  ok('tools/eval-build.mjs --check: generated files are current');
}

// ---- the grader, dry run, no network --------------------------------------
{
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cts-eval-')), 'r.json');
  const r = node(['tools/eval-grader.mjs', '--dry-run', '--limit', '90', '--out', out]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const res = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(res.meta.dryRun, true);
  assert.ok(res.items.length >= 90 && res.items.length <= 120, 'limit 90 plus paired originals');
  assert.ok(res.items.every(i => i.verdict), 'every item has a verdict');
  assert.equal(res.meta.harness_errors, 0);
  assert.ok(res.summary.sa.n > 0 && res.summary.fill.n > 0 && res.bar.checks.length >= 8);
  assert.equal(res.summary.injection.passes, 0, 'no injection passes in a dry run');
  assert.equal(res.summary.copied.passes, 0);
  assert.match(r.stdout, /DRY RUN/);
  ok('dry run: 90-item sample graded, results file well formed');

  // categories filter and pairing
  const out2 = out.replace('r.json', 'r2.json');
  const r2 = node(['tools/eval-grader.mjs', '--dry-run', '--category', 'translated', '--limit', '20', '--out', out2]);
  assert.equal(r2.status, 0, r2.stderr);
  const res2 = JSON.parse(fs.readFileSync(out2, 'utf8'));
  assert.ok(res2.items.every(i => i.category === 'translated' || res2.items.some(t => t.of === i.id)), 'originals pulled in beside their translations');
  assert.ok(res2.bar.checks.find(c => c.id === 'gap_es').status !== 'n/a');
  ok('--category and paired originals');

  // repeat
  const out3 = out.replace('r.json', 'r3.json');
  const r3 = node(['tools/eval-grader.mjs', '--dry-run', '--limit', '60', '--repeat', '2', '--repeat-sample', '20', '--out', out3]);
  assert.equal(r3.status, 0, r3.stderr);
  assert.equal(JSON.parse(fs.readFileSync(out3, 'utf8')).summary.repeatability.rate, 1, 'the stand-in is deterministic');
  ok('--repeat 2');
}

// ---- the quota gate --------------------------------------------------------
{
  let r = node(['tools/eval-grader.mjs', '--limit', '5']);
  assert.equal(r.status, 2); assert.match(r.stderr, /i-understand-this-uses-quota/);
  r = node(['tools/eval-grader.mjs', '--i-understand-this-uses-quota', '--limit', '5']);
  assert.equal(r.status, 2); assert.match(r.stderr, /CLOUDFLARE_API_TOKEN/);
  assert.equal(checkQuotaGate({ argv: ['--i-understand-this-uses-quota'], env: { CLOUDFLARE_API_TOKEN: 'x', CLOUDFLARE_ACCOUNT_ID: 'f'.repeat(32) } }).ok, false, 'other account refused');
  assert.equal(checkQuotaGate({ argv: ['--i-understand-this-uses-quota'], env: { CLOUDFLARE_API_TOKEN: 'x' } }).ok, true);
  // with the flag and a token but no worker/grading, a real run still refuses before any network call
  if (!fs.existsSync(path.join(ROOT, 'worker', 'grading', 'model.js'))) {
    r = node(['tools/eval-grader.mjs', '--i-understand-this-uses-quota', '--limit', '5'], { CLOUDFLARE_API_TOKEN: 'not-a-real-token' });
    assert.equal(r.status, 2); assert.match(r.stderr, /worker\/grading is not complete/);
  }
  ok('real runs refuse without the flag, token or server modules');
}

// ---- the REST shim, with a stub fetch ----------------------------------------
{
  assert.equal(readAccountId(), '119b0919229edb3185b69f1c6bd04b66');
  const calls = [];
  const replies = [
    { status: 429, headers: { get: () => '0' }, json: async () => ({ success: false, errors: [{ code: 3040, message: 'capacity' }] }) },
    { status: 200, ok: true, headers: { get: () => null }, json: async () => ({ success: true, result: { response: '{}', usage: { prompt_tokens: 100, completion_tokens: 20 } } }) },
    { status: 400, ok: false, headers: { get: () => null }, json: async () => ({ success: false, errors: [{ code: 3036, message: 'quota' }] }) },
  ];
  const fetchImpl = async (url, init) => { calls.push({ url, init }); return replies.shift(); };
  const ai = makeRestAI({ accountId: readAccountId(), token: 'tok', fetchImpl, baseDelayMs: 1 });
  const result = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages: [] });
  assert.equal(result.response, '{}');
  assert.equal(calls[0].url, 'https://api.cloudflare.com/client/v4/accounts/119b0919229edb3185b69f1c6bd04b66/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer tok');
  assert.equal(ai.stats.retries, 1); assert.equal(ai.stats.input_tokens, 100); assert.equal(ai.stats.output_tokens, 20);
  await assert.rejects(() => ai.run('m', {}), e => e.code === 3036 && e.status === 400);
  assert.throws(() => makeRestAI({ accountId: 'x', token: 't' }));
  assert.throws(() => makeRestAI({ accountId: readAccountId(), token: '' }));
  ok('REST shim: URL, bearer token, retry on 429, usage counting, error codes');
}

// ---- scoring --------------------------------------------------------------
{
  const mkr = (id, category, kind, lang, expected, verdict, extra = {}) => ({ id, category, kind, lang, expected, verdict, via: 'ai', ...extra });
  const rs = [];
  for (let i = 0; i < 50; i++) rs.push(mkr(`p${i}`, 'fixture', 'sa', 'en', 'met', i < 47 ? 'met' : 'not_met'));          // 3 false rejects of 50 = 6%
  for (let i = 0; i < 50; i++) rs.push(mkr(`n${i}`, 'half', 'sa', 'en', 'not_met', i < 1 ? 'met' : 'not_met'));          // 1 false accept of 50 = 2%
  rs.push(mkr('c1', 'copied', 'sa', 'en', 'not_met', 'met'), mkr('j1', 'injection', 'sa', 'en', 'pending', 'pending', { via: 'rule:injection' }));
  let { summary, bar } = summarise(rs, {});
  assert.equal(summary.sa.n, 100); assert.equal(summary.sa.agreement, 0.96);
  assert.equal(summary.sa.falseAcceptRate, 0.02); assert.equal(summary.sa.falseRejectRate, 0.06);
  assert.deepEqual(bar.failed, ['copied_passes'], 'one pasted question passed => fail');
  rs.splice(rs.findIndex(r => r.id === 'c1'), 1, mkr('c1', 'copied', 'sa', 'en', 'not_met', 'not_met'));
  ({ summary, bar } = summarise(rs, {}));
  assert.equal(bar.failed.length, 0);
  assert.ok(bar.notEvaluated.includes('repeatability') && !bar.complete, 'no repeat data => bar not established');
  // pending counts against agreement but is neither a false accept nor a false reject
  const withPending = [...rs, mkr('x', 'half', 'sa', 'en', 'not_met', 'pending')];
  assert.equal(summarise(withPending, {}).summary.sa.ungraded, 1);
  // es gap: translated items are compared with their English originals
  const pairsRs = [mkr('o1', 'half', 'sa', 'en', 'not_met', 'not_met'), mkr('o2', 'half', 'sa', 'en', 'not_met', 'not_met'),
    mkr('o1.es', 'translated', 'sa', 'es', 'not_met', 'met', { of: 'o1', base_category: 'half' }), mkr('o2.es', 'translated', 'sa', 'es', 'not_met', 'not_met', { of: 'o2', base_category: 'half' })];
  assert.equal(summarise(pairsRs, {}).summary.langPairs.es.gapPoints, 50);
  assert.equal(summarise(pairsRs, {}).bar.checks.find(c => c.id === 'gap_es').status, 'fail');
  assert.equal(BAR.agreement, 0.9);
  ok('scoring: agreement, false accept/reject, copied/injection, es gap, pending');
}

// ---- the blind sheet and the importer ----------------------------------------
{
  const rows = buildSheet({ items, seed: 'unit-test', n: 80, includeAll: false, kinds: ['sa', 'fill'] });
  assert.ok(rows.length >= 79 && rows.length <= 80);
  const csv = toCsv(rows), html = toHtml(rows, 't');
  assert.equal(csv.replace(/^\ufeff/, '').split('\r\n')[0], 'sheet_id,course_unit,language,type,question,reference,student_answer,allowed_grades,your_grade,comment', 'no expected/category/verdict columns');
  assert.ok(!/data-(category|expected|verdict)/.test(html));
  assert.ok(!rows.some(r => /^(copy|inj)\./.test(r.itemId)), 'copied/injection excluded by default');
  assert.ok(rows.every(r => !csv.includes(r.itemId)), 'item ids (which name the category) are not in the sheet');
  // a held-out synonym must not appear in the "also accepted" list
  for (const r of rows.filter(r => r.itemId.startsWith('syn.'))) {
    const it = items.find(i => i.id === r.itemId);
    assert.ok(!r.reference.split('\n').some(l => l.includes(it.holdout) && l.startsWith('Also accepted') && l.split(/;\s*/).some(x => bare(x.replace('Also accepted: ', '')) === bare(it.holdout))), `${r.itemId} reference shows the held-out entry`);
  }
  assert.equal(JSON.stringify(rows.map(r => r.sheet_id)), JSON.stringify([...rows.map(r => r.sheet_id)].sort()));
  assert.notEqual(rows.map(r => r.itemId).join(), [...rows.map(r => r.itemId)].sort().join(), 'rows are shuffled');
  // round trip: fill a grade for the first two rows
  const key = { rows: rows.map(r => ({ sheet_id: r.sheet_id, id: r.itemId, kind: r.kind })) };
  const filled = `sheet_id,your_grade,comment\n${rows[0].sheet_id},${rows[0].kind === 'sa' ? 'Not met' : 'wrong'},"a, comment"\n${rows[1].sheet_id},,\n${rows[2].sheet_id},banana,\nS999,met,\n`;
  const { grades, report } = importGrades({ grader: 'wayne', csvText: filled, key, items, now: '2026-01-01' });
  assert.equal(report.imported, 1); assert.equal(report.blank, 1); assert.equal(report.invalid.length, 1); assert.deepEqual(report.unknown, ['S999']);
  assert.equal(grades[0].expected_by, 'wayne'); assert.equal(grades[0].id, rows[0].itemId);
  assert.ok(['not_met', 'wrong'].includes(grades[0].grade));
  assert.deepEqual(parseCsv('a,"b ""q"" c"\r\n1,2\r\n'), [['a', 'b "q" c'], ['1', '2']]);
  ok('blind sheet hides answers and category; importer round-trips grades as expected_by:wayne');
}

// ---- --limit is stratified and seeded ------------------------------------------
{
  const a = selectItems(items, { limit: 100, seed: 's' }), b = selectItems(items, { limit: 100, seed: 's' });
  assert.equal(a.length, 100); assert.deepEqual(a.map(i => i.id), b.map(i => i.id));
  assert.ok(new Set(a.map(i => i.category)).size >= 10, 'spread over categories');
  ok('--limit is seeded and spread across categories');
}
console.log(`eval-grader tests: ${n} groups passed`);
