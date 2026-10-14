#!/usr/bin/env node
// Runs the grader eval: every item in test/eval/*.json goes through the same
// grading path the server uses (worker/grading/*, via tools/eval-adapter.mjs)
// and the verdicts are scored against the bar in plan section 6.2.
//
//   # no network, no quota: tests the harness (used by test/eval-grader.test.mjs)
//   node tools/eval-grader.mjs --dry-run --limit 100
//
//   # the real thing: spends Workers AI quota on the Chapala account
//   CLOUDFLARE_API_TOKEN=... node tools/eval-grader.mjs --i-understand-this-uses-quota \
//       [--model @cf/meta/llama-3.3-70b-instruct-fp8-fast] [--concurrency 4] [--repeat 2]
//
// Options
//   --model M             grader model (default: contract GRADER_MODEL)
//   --fallback-model M    GRADER_MODEL_FALLBACK passed to model.js
//   --limit N             at most N items, spread across categories (seeded)
//   --category a,b        only these categories (e.g. fixture,half,injection)
//   --lang en,es          only these languages
//   --concurrency N       parallel grading calls (default 4)
//   --repeat N            grade a seeded sample N times in all, to measure repeatability
//   --repeat-sample N     how many items to repeat (default 100, model-routed ones only)
//   --truth agent|wayne|ted   what "right" means (default agent = expected in the item
//                         files; wayne/ted = that person's imported grades, only the items
//                         they graded). Imported with tools/eval-import-human.mjs.
//   --seed S              seed for --limit and --repeat sampling
//   --out FILE            results file (default test/eval-results/<date>-<model>.json;
//                         a dry run defaults to the OS temp dir)
//   --dry-run             no network. Uses worker/grading/fake-ai.js if the server modules
//                         exist, else the adapter's stand-in. Never fails the bar.
//   --allow-missing-rubric   run even if short-answer questions have no rubric yet
//   --no-exit-code        report the bar but always exit 0
//   --i-understand-this-uses-quota   REQUIRED for any run that calls Cloudflare
//
// Exit status: 0 bar passed (or dry run); 1 bar failed; 2 refused / bad usage; 3 harness error.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, EVAL_DIR, readItemFiles, validateItem, keyFor, applyHoldout, loadHumanGrades, listHumanGraders, rng, shuffle } from './eval-lib.mjs';
import { loadGrading, makeEnv, gradeOne, hasRubric, DEFAULTS } from './eval-adapter.mjs';
import { checkQuotaGate, makeRestAI, readAccountId } from './eval-ai-shim.mjs';
import { summarise, formatReport, estimateCost } from './eval-summary.mjs';

const argv = process.argv.slice(2);
const flag = n => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const list = n => (opt(n, '') ? opt(n, '').split(',').filter(Boolean) : null);

async function pool(items, n, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) { const i = next++; await fn(items[i], i); }
  }));
}

/** At most `limit` items, in proportion to category size, seeded. */
export function selectItems(items, { limit, seed }) {
  if (!limit || limit >= items.length) return items;
  const r = rng(`${seed}:limit`);
  const byCat = {};
  for (const it of items) (byCat[it.category] ||= []).push(it);
  const cats = Object.keys(byCat).sort();
  const out = [];
  for (const c of cats) {
    const q = Math.max(1, Math.round(limit * byCat[c].length / items.length));
    out.push(...shuffle(byCat[c], r).slice(0, q));
  }
  if (out.length < limit) {                      // rounding left us short: top up from what is left
    const have = new Set(out.map(i => i.id));
    out.push(...shuffle(items.filter(i => !have.has(i.id)), r).slice(0, limit - out.length));
  }
  return shuffle(out, r).slice(0, limit).sort((a, b) => a.id.localeCompare(b.id));
}

/** A translated item is only scored against English if its original is in the run too. */
export function withPairs(selected, all) {
  const have = new Set(selected.map(i => i.id));
  const byId = new Map(all.map(i => [i.id, i]));
  const extra = selected.filter(i => i.of && !have.has(i.of) && byId.has(i.of)).map(i => byId.get(i.of));
  return [...selected, ...new Map(extra.map(i => [i.id, i])).values()];
}

async function main() {
  const dryRun = flag('dry-run');
  const model = opt('model', DEFAULTS.GRADER_MODEL);
  const seed = opt('seed', 'cts-eval-run-1');
  const concurrency = Math.max(1, parseInt(opt('concurrency', '4'), 10));
  const truth = opt('truth', 'agent');

  // ---- gate: nothing below this line may touch the network without the flag
  let ai = null, accountId = null;
  if (!dryRun) {
    const gate = checkQuotaGate({ argv, env: process.env });
    if (!gate.ok) { console.error(gate.reason); process.exit(2); }
    accountId = gate.accountId;
  }

  const grading = await loadGrading();
  if (!grading.real && !dryRun) {
    console.error(`worker/grading is not complete (missing: ${grading.missing.join(', ') || 'none'}${grading.problems.length ? '; ' + grading.problems.join('; ') : ''}).`);
    console.error('The eval grades through the server code. Merge aig/server first, or fix tools/eval-adapter.mjs if a signature differs.');
    process.exit(2);
  }
  if (!dryRun) ai = makeRestAI({ accountId, token: process.env.CLOUDFLARE_API_TOKEN });
  const env = makeEnv({ ai, dryRun, model, fallbackModel: opt('fallback-model') });

  // ---- items
  let items = readItemFiles(opt('items', EVAL_DIR));
  const bad = items.map(validateItem).map((e, i) => e.length ? `${items[i].id}: ${e.join(', ')}` : null).filter(Boolean);
  if (bad.length) { console.error(`invalid eval items:\n${bad.slice(0, 10).join('\n')}`); process.exit(3); }
  const cats = list('category'), langs = list('lang');

  // truth source
  const humans = Object.fromEntries(listHumanGraders().map(w => [w, loadHumanGrades(w)]));
  const humanMaps = Object.fromEntries(Object.entries(humans).filter(([, v]) => v).map(([k, v]) => [k, Object.fromEntries(v.map(g => [g.id, g.grade]))]));
  if (truth !== 'agent') {
    if (!humanMaps[truth]) { console.error(`no human grades for "${truth}": import them with tools/eval-import-human.mjs`); process.exit(2); }
    items = items.filter(i => humanMaps[truth][i.id] !== undefined).map(i => ({ ...i, agent_expected: i.expected, expected: humanMaps[truth][i.id], expected_by: truth }));
  }
  const everything = items;
  if (cats) items = items.filter(i => cats.includes(i.category));
  if (langs) items = items.filter(i => langs.includes(i.lang));
  items = withPairs(selectItems(items, { limit: parseInt(opt('limit', '0'), 10) || 0, seed }), everything);
  if (!items.length) { console.error('no items selected'); process.exit(2); }

  // keys, and a rubric check before spending anything
  const keys = new Map();
  for (const it of items) if (!keys.has(it.id)) keys.set(it.id, applyHoldout(keyFor(it.qid), it.holdout));
  const noRubric = new Set(items.filter(i => i.kind === 'sa' && !hasRubric(keys.get(i.id))).map(i => i.qid));
  if (noRubric.size && !dryRun && !flag('allow-missing-rubric')) {
    console.error(`${noRubric.size} short-answer questions in this run have no rubric (contract section 3). The AI grader needs one. Author rubrics first, or pass --allow-missing-rubric to run anyway.`);
    process.exit(2);
  }

  // ---- run
  const results = new Array(items.length);
  const t0 = Date.now(); let done = 0, errors = 0;
  const syntheticUsage = { input_tokens: 0, output_tokens: 0, synthetic: true };
  const gradeItem = async it => {
    const started = Date.now();
    try {
      const r = await gradeOne({ item: it, key: keys.get(it.id), env, grading });
      if (r.usage && r.usage.synthetic) { syntheticUsage.input_tokens += r.usage.input_tokens; syntheticUsage.output_tokens += r.usage.output_tokens; }
      return { verdict: r.verdict, via: r.via, graded_by: r.graded_by, feedback: r.feedback, points: r.points, model: r.model, prompt_version: r.prompt_version, error: r.error, ms: Date.now() - started };
    } catch (e) {
      errors++;
      return { verdict: 'error', via: 'ai', error: String(e.message || e).slice(0, 300), code: e.code, ms: Date.now() - started };
    }
  };
  await pool(items, concurrency, async (it, i) => {
    const r = await gradeItem(it);
    results[i] = { id: it.id, qid: it.qid, category: it.category, ...(it.base_category ? { base_category: it.base_category } : {}), ...(it.of ? { of: it.of } : {}), kind: it.kind, lang: it.lang, expected: it.expected, expected_by: it.expected_by, source: it.source, answer: it.answer, ...r };
    if (++done % 100 === 0) console.error(`  ${done}/${items.length} graded, ${errors} errors, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  });

  // ---- repeatability
  let repeat = [];
  const times = parseInt(opt('repeat', '1'), 10);
  if (times > 1) {
    const routed = results.map((r, i) => ({ r, i })).filter(x => x.r.via === 'ai' && x.r.verdict !== 'error');
    const pick = shuffle(routed, rng(`${seed}:repeat`)).slice(0, parseInt(opt('repeat-sample', '100'), 10));
    for (let k = 1; k < times; k++) {
      await pool(pick, concurrency, async ({ r, i }) => {
        const again = await gradeItem(items[i]);
        repeat.push({ id: r.id, a: r.verdict, b: again.verdict });
      });
    }
  }

  // ---- score
  const { summary, bar } = summarise(results, { repeat, humans: humanMaps });
  const usage = ai ? { input_tokens: ai.stats.input_tokens, output_tokens: ai.stats.output_tokens, calls: ai.stats.calls, retries: ai.stats.retries, errors: ai.stats.errors, byModel: ai.stats.byModel } : { ...syntheticUsage, calls: results.filter(r => r.via === 'ai').length };
  const cost = ai ? estimateCost(ai.stats.byModel) : estimateCost({ [model]: syntheticUsage });
  let sha = null; try { sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { /* not a checkout */ }
  const date = new Date().toISOString().slice(0, 10);
  const meta = {
    date, model, fallback_model: env.GRADER_MODEL_FALLBACK, prompt_version: env.GRADER_PROMPT_VERSION, git: sha, dryRun, truth,
    grading_path: grading.real ? 'worker/grading' : 'internal-fallback', account_id: accountId ? `${accountId.slice(0, 4)}…` : null,
    missing_rubrics: noRubric.size, flags: { limit: opt('limit', null), category: cats, lang: langs, concurrency, repeat: times, seed },
    seconds: Math.round((Date.now() - t0) / 1000), harness_errors: errors, usage, cost,
  };
  const slug = model.replace(/^@/, '').replace(/[^A-Za-z0-9.]+/g, '-');
  const out = opt('out', dryRun ? path.join(os.tmpdir(), `cts-eval-${date}-dry-run.json`) : path.join(ROOT, 'test', 'eval-results', `${date}-${slug}.json`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ meta, summary, bar, items: results }, null, 1) + '\n');

  console.log(formatReport({ summary, bar, meta: { ...meta, usage } }));
  console.log(`\nResults: ${out}`);
  if (dryRun || flag('no-exit-code')) process.exit(0);
  if (errors) { console.error(`${errors} items hit a harness error (see "error" in the results file).`); }
  process.exit(bar.passed && errors === 0 ? 0 : 1);
}

import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e); process.exit(3); });
