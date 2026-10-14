// A stand-in for the Workers AI binding (`env.AI`) that calls Cloudflare's
// REST API instead:
//
//   POST https://api.cloudflare.com/client/v4/accounts/<account_id>/ai/run/<model>
//
// so the SAME worker/grading/model.js that runs in the Worker can be driven
// from a laptop. It uses real quota. tools/eval-grader.mjs refuses to build it
// unless --i-understand-this-uses-quota was passed.
//
// - The account id is read from wrangler.jsonc (the pinned Chapala account).
//   If CLOUDFLARE_ACCOUNT_ID is set to a different account the shim refuses:
//   this machine can reach two Cloudflare accounts (see AGENTS.md).
// - The token is CLOUDFLARE_API_TOKEN from the environment; it is never
//   printed, logged or written to a results file.
// - run(model, input) resolves to the REST `result` object, which is what the
//   binding returns. Failures throw an Error with .code (Cloudflare's numeric
//   AI error code, e.g. 3036) and .status, like the binding does.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './eval-lib.mjs';

export function readAccountId(root = ROOT) {
  const text = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
  const m = /^\s*"account_id"\s*:\s*"([0-9a-f]{32})"/m.exec(text);
  if (!m) throw new Error('no top-level "account_id" found in wrangler.jsonc');
  return m[1];
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function makeRestAI({ accountId, token, fetchImpl = globalThis.fetch, retries = 3, baseDelayMs = 1000 } = {}) {
  if (!/^[0-9a-f]{32}$/.test(accountId || '')) throw new Error('shim needs a 32-hex account id');
  if (!token) throw new Error('CLOUDFLARE_API_TOKEN is not set');
  const stats = { calls: 0, errors: 0, retries: 0, input_tokens: 0, output_tokens: 0, byModel: {} };
  async function run(model, input) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
    let last;
    for (let attempt = 0; attempt <= retries; attempt++) {
      let res;
      try {
        res = await fetchImpl(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      } catch (e) {
        last = Object.assign(new Error(`network error: ${e.message}`), { status: 0 });
        if (attempt < retries) { stats.retries++; await sleep(baseDelayMs * 2 ** attempt); continue; }
        stats.errors++; throw last;
      }
      const body = await res.json().catch(() => null);
      if (res.ok && body && body.success !== false) {
        const result = body.result;
        const u = (result && result.usage) || {};
        const inTok = u.prompt_tokens ?? u.input_tokens ?? 0, outTok = u.completion_tokens ?? u.output_tokens ?? 0;
        stats.calls++; stats.input_tokens += inTok; stats.output_tokens += outTok;
        const m = (stats.byModel[model] ||= { calls: 0, input_tokens: 0, output_tokens: 0 });
        m.calls++; m.input_tokens += inTok; m.output_tokens += outTok;
        return result;
      }
      const err = body && body.errors && body.errors[0];
      last = Object.assign(new Error(`Workers AI ${res.status}${err ? ` code ${err.code}: ${err.message}` : ''}`), { status: res.status, code: err && err.code });
      const transient = res.status === 429 || res.status >= 500;
      if (transient && attempt < retries) {
        stats.retries++;
        const ra = Number(res.headers && res.headers.get && res.headers.get('retry-after'));
        await sleep(ra > 0 ? ra * 1000 : baseDelayMs * 2 ** attempt);
        continue;
      }
      stats.errors++; throw last;
    }
    stats.errors++; throw last;
  }
  return { run, stats };
}

/** The quota gate. Returns {ok, reason}; the eval refuses to touch the network unless ok. */
export function checkQuotaGate({ argv, env, root = ROOT }) {
  if (!argv.includes('--i-understand-this-uses-quota')) return { ok: false, reason: 'refusing to call Cloudflare: this run spends Workers AI quota. Pass --i-understand-this-uses-quota to proceed (or --dry-run to test without the network).' };
  if (!env.CLOUDFLARE_API_TOKEN) return { ok: false, reason: 'CLOUDFLARE_API_TOKEN is not set in the environment.' };
  const pinned = readAccountId(root);
  if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_ACCOUNT_ID !== pinned) return { ok: false, reason: 'CLOUDFLARE_ACCOUNT_ID differs from the account pinned in wrangler.jsonc; refusing (two accounts are reachable from this machine).' };
  return { ok: true, accountId: pinned };
}
