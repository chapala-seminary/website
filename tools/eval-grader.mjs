#!/usr/bin/env node
// Runs the grader eval: every item in test/eval/*.json goes through the same
// grading path the server uses (worker/grading/*, via tools/eval-adapter.mjs)
// and the verdicts are scored against the bar in plan section 6.2.
//
//   # no network, no quota: tests the harness (used by test/eval-grader.test.mjs).
//   # The "model" is worker/grading/fake-ai.js: the bar result means nothing.
//   node tools/eval-grader.mjs --dry-run --limit 100
//
//   # see the exact prompt for one question, no network at all
//   node tools/eval-grader.mjs --print-prompt "u:CTSJohn/1/sa/9" [--lang es] [--answer "text"]
//
//   # the real thing: spends Workers AI quota on the Chapala account
//   node tools/eval-grader.mjs --i-understand-this-uses-quota --token-file ~/.config/cts/workers-ai-token \
//       --model @cf/meta/llama-3.3-70b-instruct-fp8-fast --max-cost 2.40 [--concurrency 4] [--repeat 2]
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
//   --dry-run             no network. The model call is worker/grading/fake-ai.js. Verdicts
//                         are fake, the bar result is meaningless, exit status is 0.
//   --print-prompt QID    print the messages, JSON schema and call settings model.js would
//                         send for one sample answer to QID (an eval item for that question;
//                         --lang picks the language, --answer replaces the answer). No network.
//   --allow-missing-rubric   run even if short-answer questions have no rubric yet
//   --no-exit-code        report the bar but always exit 0
//   --i-understand-this-uses-quota   REQUIRED for any run that calls Cloudflare
//   --token-file PATH     read the Cloudflare API token from this file instead of CLOUDFLARE_API_TOKEN
//                         (the file wins if both are given). Refused if missing, empty, or readable by
//                         group/others (chmod 600). The token and its length are never printed.
//   --max-cost USD        HARD spending cap, REQUIRED on a real run. Before every model call the tool adds
//                         the real cost so far (token counts the API returned) and the worst case of the
//                         call (max_tokens as output + input estimate); if that would pass the cap the call
//                         is not sent. Items not reached are "not run (budget)"; the run is PARTIAL and
//                         exits 3. The bar is not evaluated on a partial run unless every category still
//                         has at least 30 graded items. Refuses to start (exit 2) if the estimated ceiling
//                         for the selected items is over 3x the cap (use --limit).
//   --fake-usage-scale N  dry run only: multiply the fake model's token counts by N (tests the cap)
//
// Exit status: 0 bar passed (or dry run); 1 bar failed; 2 refused / bad usage; 3 stopped by the --max-cost cap
// (partial run) or a harness error (stderr says which).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, EVAL_DIR, readItemFiles, validateItem, keyFor, applyHoldout, loadHumanGrades, listHumanGraders, rng, shuffle } from './eval-lib.mjs';
import { makeEnv, makeUsageTally, gradeOne, cheapCheck, capturePrompt, hasRubric, DEFAULTS } from './eval-adapter.mjs';
import { checkQuotaGate, makeRestAI, readAccountId } from './eval-ai-shim.mjs';
import { budgetAI, inputEstimate, usd, BUDGET_TAG } from './eval-budget.mjs';
import { fakeAIRun } from '../worker/grading/fake-ai.js';
import { summarise, formatReport, estimateCost, estimateRun, OUT_TOKENS_CEILING } from './eval-summary.mjs';

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


/** --print-prompt: what would be sent for one sample answer. No network, no quota. */
function printPrompt(qid) {
  const all = readItemFiles(opt('items', EVAL_DIR)).filter(i => i.qid === qid);
  if (!all.length) { console.error(`no eval item for ${qid}. Use a unit question id such as u:CTSJohn/1/sa/9.`); process.exit(2); }
  const wantLang = opt('lang', null);
  const rank = i => (['fixture', 'half', 'fill_synonym', 'fill_near_miss', 'fill_misspelling'].indexOf(i.category) + 1 || 9);
  const ordered = [...all].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
  const base = (wantLang && ordered.find(i => i.lang === wantLang)) || ordered[0];
  const item = { ...base, lang: wantLang || base.lang, ...(opt('answer', null) !== null ? { answer: opt('answer') } : {}) };
  const key = applyHoldout(keyFor(qid), item.holdout);
  const env = makeEnv({ dryRun: false, model: opt('model', DEFAULTS.GRADER_MODEL), fallbackModel: opt('fallback-model'), DB: makeUsageTally().DB });
  const rule = cheapCheck({ kind: item.kind, key, answer: item.answer, lang: item.lang });
  return capturePrompt({ item, key, env }).then(({ model, params }) => {
    const out = [];
    out.push(`question:     ${qid}   (${item.kind === 'sa' ? 'short answer' : 'fill-in'}, student language: ${item.lang})`);
    out.push(`sample item:  ${base.id} (category ${base.category}, expected ${base.expected})${item.lang !== base.lang ? `; language set to ${item.lang} by --lang, the answer text is unchanged` : ''}`);
    out.push(`answer text:  ${JSON.stringify(item.answer)}`);
    out.push(rule ? `NOTE:        the server would settle this answer WITHOUT the model (${rule.via} -> ${rule.verdict}). The prompt below is what it would be if it did reach the model.` : 'cheap checks: none settles it, so the server sends it to the model');
    out.push(`rubric:       ${hasRubric(key) ? `${key.rubric.points.length} points, version ${key.rubric.v ?? 'none'}` : (item.kind === 'sa' ? 'NONE (model.js uses its one-point fallback rubric)' : 'n/a for fill-ins')}`);
    const sent = JSON.parse(params.messages.find(m => m.role === 'user').content).items[0];
    if (sent.model_answer && /a strong answer|una respuesta s[oó]lida/i.test(sent.model_answer))
      out.push(`WARNING:     the model answer sent (${sent.model_answer_language}) is a generic placeholder, not a real model answer. Only the rubric carries the content for this question.`);
    out.push('');
    out.push(`call:         env.AI.run("${model}", { messages, response_format, max_tokens: ${params.max_tokens}, temperature: ${params.temperature} })`);
    out.push(`fallback:     retry once on ${model}, then ${env.GRADER_MODEL_FALLBACK}; prompt_version ${env.GRADER_PROMPT_VERSION}`);
    for (const m of params.messages) {
      out.push('', `----- message: ${m.role} -----`);
      if (m.role === 'user') { try { out.push(JSON.stringify(JSON.parse(m.content), null, 2)); } catch { out.push(m.content); } } else out.push(m.content);
    }
    out.push('', '----- response_format.json_schema -----', JSON.stringify(params.response_format.json_schema, null, 2));
    console.log(out.join('\n'));
  });
}

async function main() {
  if (flag('print-prompt')) { await printPrompt(opt('print-prompt', '')); process.exit(0); }
  const dryRun = flag('dry-run');
  const model = opt('model', DEFAULTS.GRADER_MODEL);
  const seed = opt('seed', 'cts-eval-run-1');
  const concurrency = Math.max(1, parseInt(opt('concurrency', '4'), 10));
  const truth = opt('truth', 'agent');

  // ---- gate: nothing below this line may touch the network without the flag
  let ai = null, accountId = null, token = null;
  if (!dryRun) {
    const gate = checkQuotaGate({ argv, env: process.env });
    if (!gate.ok) { console.error(gate.reason); process.exit(2); }
    accountId = gate.accountId; token = gate.token;
  }
  // the spending cap: a real run must carry one, and it is checked before any network call
  const capRaw = opt('max-cost', null);
  const capUsd = capRaw === null ? null : Number(capRaw);
  if (capRaw !== null && !(Number.isFinite(capUsd) && capUsd > 0)) { console.error('--max-cost needs a positive number of US dollars, e.g. --max-cost 2.40'); process.exit(2); }
  if (!dryRun && capUsd === null) { console.error('refusing to start: a real run must carry a hard spending cap. Add --max-cost <usd> (see docs/ai-grading.md section 13).'); process.exit(2); }
  if (flag('fake-usage-scale') && !dryRun) { console.error('--fake-usage-scale is for --dry-run only.'); process.exit(2); }
  const fakeScale = Number(opt('fake-usage-scale', '1')) || 1;

  if (!dryRun) ai = makeRestAI({ accountId, token });
  const { DB, tally } = makeUsageTally();
  const env = makeEnv({ ai, dryRun, model, fallbackModel: opt('fallback-model'), DB });
  // every model call goes through the cap's gate: the REST shim in a real run, the fake model in a dry run
  let gated = null;
  if (capUsd !== null) {
    gated = budgetAI({ capUsd, inner: dryRun ? { run: async (m, params) => fakeAIRun(env, m, params) } : ai, scaleUsage: dryRun ? fakeScale : 1 });
    env.AI = gated; delete env.AI_FAKE;
  }

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

  // ---- estimate and refuse, before anything is sent
  if (capUsd !== null) {
    let inTok = 0, sa = 0, fill = 0;
    for (const it of items) {
      if (cheapCheck({ kind: it.kind, key: keys.get(it.id), answer: it.answer, lang: it.lang })) continue;
      const { params } = await capturePrompt({ item: it, key: keys.get(it.id), env });
      inTok += inputEstimate(params); if (it.kind === 'sa') sa++; else fill++;
    }
    const routed = sa + fill, times = parseInt(opt('repeat', '1'), 10);
    const extra = times > 1 ? Math.min(parseInt(opt('repeat-sample', '100'), 10), routed) * (times - 1) : 0;
    const f = routed ? 1 + extra / routed : 1;
    const calls = Math.round(routed * f), outTyp = Math.round((sa * 200 + fill * 50) * f), inAll = Math.round(inTok * f);
    const typical = usd(model, inAll, outTyp), ceiling = usd(model, inAll, calls * OUT_TOKENS_CEILING);
    console.log(`Estimate for the ${items.length} selected items (${calls} model calls, list prices): typical $${typical.toFixed(2)}, ceiling $${ceiling.toFixed(2)}. Cap: $${capUsd.toFixed(2)}.`);
    if (ceiling > 3 * capUsd) {
      console.error(`refusing to start: the estimated ceiling $${ceiling.toFixed(2)} is more than 3x the cap $${capUsd.toFixed(2)}. Run fewer items (--limit N, --category) or raise --max-cost.`);
      process.exit(2);
    }
  }

  // ---- run
  const results = new Array(items.length);
  const t0 = Date.now(); let done = 0, errors = 0;
  const gradeItem = async it => {
    const started = Date.now();
    try {
      const r = await gradeOne({ item: it, key: keys.get(it.id), env });
      if (r.error && String(r.error).includes(BUDGET_TAG)) return { verdict: 'not_run', via: 'budget', error: 'not run (budget)', ms: 0 };
      return { verdict: r.verdict, via: r.via, graded_by: r.graded_by, feedback: r.feedback, points: r.points, model: r.model, prompt_version: r.prompt_version, error: r.error, held: r.held, ms: Date.now() - started };
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
        if (again.verdict === 'not_run') return;
        repeat.push({ id: r.id, a: r.verdict, b: again.verdict });
      });
    }
  }

  // ---- score
  const ran = results.filter(r => r.verdict !== 'not_run');
  const notRun = results.length - ran.length;
  const partial = notRun > 0;
  let { summary, bar } = summarise(ran, { repeat, humans: humanMaps });
  let budgetMeta = null;
  if (gated) {
    const b = gated.budget;
    const gradedBy = {};
    for (const r of results) gradedBy[r.category] = (gradedBy[r.category] || 0) + (r.verdict !== 'error' && r.verdict !== 'not_run' ? 1 : 0);
    const thin = Object.entries(gradedBy).filter(([, n]) => n < 30).map(([c]) => c).sort();
    const barEvaluated = !partial || thin.length === 0;
    budgetMeta = { cap_usd: capUsd, spent_usd: Math.round(b.spentUsd * 1e6) / 1e6, calls_sent: b.sent, calls_refused: b.refused, calls_without_usage_charged_at_ceiling: b.usageMissing, items_total: results.length, items_run: ran.length, items_not_run: notRun, partial, bar_evaluated: barEvaluated, categories_under_30_graded: partial ? thin : [] };
    if (!barEvaluated) bar = { checks: [], failed: [], notEvaluated: ['partial run'], passed: false, complete: false, evaluated: false };
  }
  // Usage is what model.js wrote to ai_usage (the stub DB): the real API's token counts in a real run,
  // the fake model's made-up counts in a dry run.
  const usage = { input_tokens: tally.input_tokens, output_tokens: tally.output_tokens, calls: tally.calls, errors: tally.errors, byModel: tally.byModel, ...(ai ? { retries: ai.stats.retries, http_errors: ai.stats.errors } : { synthetic: true }) };
  const cost = estimateCost(tally.byModel);
  // What a real run of these same items costs: the prompts are exact; reply sizes are typical.
  const viaAi = results.filter(r => r.via === 'ai' && r.verdict !== 'error');
  const saCalls = viaAi.filter(r => r.kind === 'sa').length, fillCalls = viaAi.filter(r => r.kind === 'fill').length;
  const avgIn = tally.calls ? tally.input_tokens / tally.calls : 0;
  const extraRepeat = repeat.length;                        // each repeat re-asks one item
  const estimate = estimateRun({ saCalls: saCalls + repeat.filter(p => items.find(i => i.id === p.id)?.kind === 'sa').length, fillCalls: fillCalls + repeat.filter(p => items.find(i => i.id === p.id)?.kind === 'fill').length, inputTokens: avgIn * (saCalls + fillCalls + extraRepeat) });
  let sha = null; try { sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { /* not a checkout */ }
  const date = new Date().toISOString().slice(0, 10);
  const meta = {
    date, model, fallback_model: env.GRADER_MODEL_FALLBACK, prompt_version: env.GRADER_PROMPT_VERSION, git: sha, dryRun, truth,
    grading_path: 'worker/grading', fake_model: dryRun, account_id: accountId ? `${accountId.slice(0, 4)}…` : null,
    missing_rubrics: noRubric.size, flags: { limit: opt('limit', null), category: cats, lang: langs, concurrency, repeat: times, seed },
    seconds: Math.round((Date.now() - t0) / 1000), harness_errors: errors, usage, cost, estimate, ...(budgetMeta ? { budget: budgetMeta } : {}),
  };
  const slug = model.replace(/^@/, '').replace(/[^A-Za-z0-9.]+/g, '-');
  const out = opt('out', dryRun ? path.join(os.tmpdir(), `cts-eval-${date}-dry-run.json`) : path.join(ROOT, 'test', 'eval-results', `${date}-${slug}.json`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ meta, summary, bar, items: results }, null, 1) + '\n');

  console.log(formatReport({ summary, bar, meta }));
  console.log(`\nResults: ${out}`);
  if (budgetMeta) {
    console.log(`Spent $${budgetMeta.spent_usd.toFixed(4)} of the $${capUsd.toFixed(2)} cap${dryRun ? ' (SYNTHETIC: fake token counts)' : ''}; ${budgetMeta.items_run} of ${budgetMeta.items_total} items ran.`);
    if (partial) {
      console.log(`PARTIAL RUN: stopped by the spending cap. ${notRun} items are "not run (budget)". ${budgetMeta.bar_evaluated ? 'Every category still has 30 or more graded items, so the bar was evaluated, but it is a PARTIAL result.' : `The bar is NOT evaluated on a partial run (categories under 30 graded items: ${budgetMeta.categories_under_30_graded.join(', ')}).`}`);
      process.exit(3);
    }
  }
  if (dryRun) { console.log('\nDRY RUN: exit 0 whatever the bar says.'); process.exit(0); }
  if (flag('no-exit-code')) process.exit(0);
  if (errors) { console.error(`${errors} items hit a harness error (see "error" in the results file).`); }
  process.exit(bar.passed && errors === 0 ? 0 : 1);
}

import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e); process.exit(3); });
