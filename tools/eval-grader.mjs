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
//   --dry-run             no network. The model call is worker/grading/fake-ai.js. Verdicts
//                         are fake, the bar result is meaningless, exit status is 0.
//   --print-prompt QID    print the messages, JSON schema and call settings model.js would
//                         send for one sample answer to QID (an eval item for that question;
//                         --lang picks the language, --answer replaces the answer). No network.
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
import { makeEnv, makeUsageTally, gradeOne, cheapCheck, capturePrompt, hasRubric, DEFAULTS } from './eval-adapter.mjs';
import { checkQuotaGate, makeRestAI, readAccountId } from './eval-ai-shim.mjs';
import { summarise, formatReport, estimateCost, estimateRun } from './eval-summary.mjs';

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
  let ai = null, accountId = null;
  if (!dryRun) {
    const gate = checkQuotaGate({ argv, env: process.env });
    if (!gate.ok) { console.error(gate.reason); process.exit(2); }
    accountId = gate.accountId;
  }

  if (!dryRun) ai = makeRestAI({ accountId, token: process.env.CLOUDFLARE_API_TOKEN });
  const { DB, tally } = makeUsageTally();
  const env = makeEnv({ ai, dryRun, model, fallbackModel: opt('fallback-model'), DB });

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
  const gradeItem = async it => {
    const started = Date.now();
    try {
      const r = await gradeOne({ item: it, key: keys.get(it.id), env });
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
        repeat.push({ id: r.id, a: r.verdict, b: again.verdict });
      });
    }
  }

  // ---- score
  const { summary, bar } = summarise(results, { repeat, humans: humanMaps });
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
    seconds: Math.round((Date.now() - t0) / 1000), harness_errors: errors, usage, cost, estimate,
  };
  const slug = model.replace(/^@/, '').replace(/[^A-Za-z0-9.]+/g, '-');
  const out = opt('out', dryRun ? path.join(os.tmpdir(), `cts-eval-${date}-dry-run.json`) : path.join(ROOT, 'test', 'eval-results', `${date}-${slug}.json`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ meta, summary, bar, items: results }, null, 1) + '\n');

  console.log(formatReport({ summary, bar, meta }));
  console.log(`\nResults: ${out}`);
  if (dryRun) { console.log('\nDRY RUN: exit 0 whatever the bar says.'); process.exit(0); }
  if (flag('no-exit-code')) process.exit(0);
  if (errors) { console.error(`${errors} items hit a harness error (see "error" in the results file).`); }
  process.exit(bar.passed && errors === 0 ? 0 : 1);
}

import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e); process.exit(3); });
