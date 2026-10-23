/* A stand-in for the grading API (docs/ai-grading.md section 7), for browser tests.
 *
 * The real routes are built on another branch; the browser is built against
 * the contract. This answers the contract's routes from the real question
 * content (src/content), in memory, so a test can drive the page the way a
 * student does and say exactly what the server said. It is the server the
 * page is tested against, not a grader: the rules here are the smallest that
 * show the browser what it must show (docs/ai-grading.md section 5), and the
 * answer's own text steers the verdict, as worker/grading/fake-ai.js will:
 *
 *   fill-in   exact match of the key      -> right
 *             [[ai-accept]] in the text   -> right, feedback, graded by "ai"
 *             [[pending]]                 -> pending (the model was unavailable)
 *             anything else               -> wrong, feedback, graded by "ai"
 *   short     [[met]] [[partly]] [[not_met]] [[pending]]; anything else not_met
 *   any       [[error]]                   -> 503
 *
 * What it discloses follows the server (worker/grading/attempts.js
 * disclosureOf, Wayne Cook, 18 Oct 2026): while an attempt is open or after it
 * failed, right or wrong only -- no right option, explanation, answer wanted,
 * model answer, or AI feedback on an answer that was not right; once it has
 * passed, all of it.
 *
 * Switches a test sets: offline (every call fails as with no network),
 * delay (ms per route), lockMs (how long a failed attempt locks), track,
 * courseDone (what a pass reports), failNext (one status for the next call).
 */
import fs from 'node:fs';
import path from 'node:path';
import { textbookQuestions } from '../../tools/grading-keys-lib.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const CODE = 'STUBCODE1';

const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/ñ/g, 'ñ').replace(/(\p{Script=Latin})[̀-ͯ]+/gu, '$1').normalize('NFC');
const bare = (s) => fold(s).normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
  .replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)/, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* The questions behind a scope: the same arrays the page was built from. */
export function bankOf(scope) {
  const m = /^(u|tb|rd):(.+)$/.exec(scope);
  if (!m) throw new Error('scope ' + scope);
  if (m[1] === 'u') {
    const [prefix, n] = m[2].split('/');
    const u = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/units', prefix, n + '.json'), 'utf8'));
    return { kind: 'u', mc: u.mc || [], fill: u.fill || [], sa: u.sa || [], title: u.title };
  }
  if (m[1] === 'tb') {
    // Public textbook JSON omits answer/accept; load keys from assessment-keys.
    const { book, questions } = textbookQuestions(ROOT, m[2]);
    if (!questions.every((q) => q?.answer?.en)) {
      throw new Error(`tb:${m[2]} needs assessment-keys (public textbook files have no answer/accept)`);
    }
    return { kind: 'tb', mc: [], fill: questions, sa: [], pass: book.test.pass, draw: book.test.draw };
  }
  const b = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/readings', m[2] + '.json'), 'utf8'));
  return { kind: 'rd', mc: [], fill: b.test.questions, sa: [], pass: b.test.pass, draw: b.test.draw };
}
const qidOf = (scope, kind, i) => `${scope}/${kind}/${i}`;
function publicPrompt(q) {
  const p = q && q.prompt;
  if (!p || typeof p !== 'object') return {};
  const out = {};
  for (const l of ['en', 'es', 'fr']) if (typeof p[l] === 'string' && p[l]) out[l] = p[l];
  return out;
}
function promptsFor(a) {
  if (!a || a.bank.kind === 'u') return undefined;
  const fillIdx = a.draw || a.bank.fill.map((_, i) => i);
  return fillIdx.map((i) => ({ qid: qidOf(a.scope, 'fill', i), prompt: publicPrompt(a.bank.fill[i]) }));
}
const parseQid = (qid) => { const m = /^(.*)\/(mc|fill|sa)\/(\d+)$/.exec(qid); return m && { scope: m[1], kind: m[2], i: +m[3] }; };
const lmap = (v) => (v && typeof v === 'object' ? v : { en: v });

export class GradingStub {
  constructor(opts = {}) {
    this.track = opts.track || 'thm';
    this.lockMs = opts.lockMs ?? 3000;
    this.offline = false;
    this.delay = {};
    this.courseDone = false;
    this.failNext = null;
    this.log = [];                      // { method, path, body } for every call that reached it
    this.attempts = new Map();          // id -> attempt
    this.locks = new Map();             // scope -> { until, kind }
    this.bankedSa = new Map();          // scope -> Set(qid), met in an earlier attempt
    this.passed = new Set();
    this.appeals = [];
    this.gradeSeq = 100;
    this.seq = 0;
    this.drawFrom = (n, draw) => Array.from({ length: Math.min(draw, n) }, (_, i) => n - 1 - i);   // the server's draw: the last twenty, backwards
  }

  async install(context) { await context.route('**/api/**', (route) => this.handle(route)); }
  calls(p) { return this.log.filter((c) => c.path === p || c.path.startsWith(p + '/')); }

  async handle(route) {
    const req = route.request(), url = new URL(req.url());
    const p = url.pathname.replace(/^\/api/, '') || '/';
    let body = null;
    try { body = req.postData() ? JSON.parse(req.postData()) : null; } catch { body = null; }
    if (p === '/health') return route.fulfill({ json: { ok: true, requiredFrom: {} } });
    if (p === '/register') return route.fulfill({ json: { code: CODE } });
    if (p === '/sync' || p.startsWith('/student/')) {
      return route.fulfill({ json: { student: { id: CODE, name: 'Stub Student', track: this.track }, doneCodes: [], completions: [], progress: [], textbooks: [], exemptions: [] } });
    }
    this.log.push({ method: req.method(), path: p, body });
    if (this.offline) return route.abort('failed');
    if (this.delay[p]) await sleep(this.delay[p]);
    if (this.failNext) { const status = this.failNext; this.failNext = null; return route.fulfill({ status, json: { error: 'stub failure' } }); }
    let r;
    try { r = this.route(req.method(), p, url, body); } catch (e) { r = { status: e.status || 500, json: { error: String(e.message) } }; }
    return route.fulfill({ status: r.status || 200, json: r.json });
  }

  route(method, p, url, body) {
    if (method === 'POST' && p === '/attempt') return this.attempt(body);
    if (method === 'POST' && p === '/mc') return this.mc(body);
    if (method === 'POST' && p === '/grade') return this.grade(body);
    if (method === 'POST' && p === '/appeal') return this.appeal(body);
    let m = /^\/attempt\/([^/]+)\/submit$/.exec(p);
    if (method === 'POST' && m) return this.submit(m[1], body);
    m = /^\/attempt\/([^/]+)$/.exec(p);
    if (method === 'GET' && m) return { json: this.report(this.need(m[1])) };
    return { status: 404, json: { error: 'no such route ' + p } };
  }
  need(id) { const a = this.attempts.get(id); if (!a) throw Object.assign(new Error('no such attempt'), { status: 404 }); return a; }

  // ---- POST /api/attempt ----
  attempt({ scope, lang }) {
    const lock = this.locks.get(scope);
    if (lock && lock.until > Date.now()) return { status: 423, json: { error: 'locked', lock: this.lockOut(lock) } };
    const pend = [...this.attempts.values()].find((a) => a.scope === scope && a.status === 'pending');
    if (pend) return { json: { attemptId: pend.id, status: 'pending', ...this.report(pend) } };
    let a = [...this.attempts.values()].find((x) => x.scope === scope && x.status === 'open');
    if (!a) {
      const bank = bankOf(scope);
      const draw = bank.kind === 'u' ? null : this.drawFrom(bank.fill.length, bank.draw);
      a = { id: 'att' + (++this.seq), scope, lang, bank, draw, status: 'open', answered: {} };
      this.attempts.set(a.id, a);
      for (const qid of this.bankedSa.get(scope) || []) a.answered[qid] = { verdict: 'met', feedback: 'Kept from your earlier attempt.', gradeId: ++this.gradeSeq, kind: 'sa', banked: true };
    }
    const bank = a.bank, S = a.scope;
    const fillIdx = a.draw || bank.fill.map((_, i) => i);
    const banked = [...(this.bankedSa.get(S) || [])];
    const prompts = promptsFor(a);
    return { json: {
      attemptId: a.id, track: this.track,
      needs: { mc: bank.mc.length > 0, fill: this.track !== 'cert', sa: /^(thm|mdiv)$/.test(this.track) && bank.sa.length > 0 },
      banked: { mc: this.mcBanked(S), fill: [], sa: banked },
      answered: this.answeredOut(a),
      lock: null,
      ...(prompts ? { prompts } : {}),
      items: { mc: bank.mc.map((_, i) => ({ qid: qidOf(S, 'mc', i) })), fill: fillIdx.map((i) => qidOf(S, 'fill', i)), sa: bank.sa.map((_, i) => qidOf(S, 'sa', i)) },
    } };
  }
  mcBanked(scope) { return this.mcPassedScopes?.has(scope) || false; }
  lockOut(l) { return { until: new Date(l.until).toISOString(), kind: l.kind }; }
  answeredOut(a) {
    const review = a.status === 'passed', out = {};
    for (const [qid, r] of Object.entries(a.answered)) {
      const o = { verdict: r.verdict, feedback: this.feedbackOut(r, review), gradeId: r.gradeId, ...(r.choice != null ? { choice: r.choice } : {}) };
      const q = parseQid(qid);
      if (review && r.kind === 'mc') { const k = a.bank.mc[q.i]; o.answer = k.answer; o.why = k.why ?? null; }
      if (review && r.kind === 'fill' && r.verdict === 'wrong') o.correctAnswer = a.bank.fill[q.i].answer?.en ?? null;
      out[qid] = o;
    }
    return out;
  }
  /* As worker/grading/attempts.js feedbackFor (#124, Wayne 18 Oct 2026): before
     a pass, only the seminary's own fixed sentences go out, whatever the grader
     or verdict. This stub never writes one, so before a pass nothing does. */
  feedbackOut(r, review) {
    return review ? (r.feedback || null) : null;
  }

  // ---- POST /api/mc ----
  mc({ attemptId, qid, choice }) {
    const a = this.need(attemptId), q = parseQid(qid);
    if (!q || q.kind !== 'mc' || q.scope !== a.scope) throw Object.assign(new Error('bad qid'), { status: 400 });
    const first = a.answered[qid];
    const item = a.bank.mc[q.i];
    if (!first) a.answered[qid] = { verdict: choice === item.answer ? 'right' : 'wrong', feedback: '', gradeId: ++this.gradeSeq, choice, kind: 'mc' };
    const r = a.answered[qid];
    // the first answer stands; the reply names it, and nothing about the right option
    return { json: { right: r.verdict === 'right', choice: r.choice } };
  }

  // ---- POST /api/grade ----
  grade({ attemptId, items }) {
    const a = this.need(attemptId);
    if (!Array.isArray(items) || items.length < 1 || items.length > 10) throw Object.assign(new Error('1 to 10 items'), { status: 400 });
    const out = [];
    for (const it of items) {
      const q = parseQid(it.qid);
      if (!q || q.kind === 'mc' || q.scope !== a.scope) throw Object.assign(new Error('bad qid ' + it.qid), { status: 400 });
      const text = String(it.answer || '');
      if (/\[\[error\]\]/.test(text)) throw Object.assign(new Error('model error'), { status: 503 });
      let g;
      if (q.kind === 'fill') {
        const k = a.bank.fill[q.i], forms = [];
        for (const lang of ['en', 'es', 'fr']) forms.push(k.answer?.[lang], ...((k.accept && k.accept[lang]) || []));
        if (forms.some((f) => f && bare(f) === bare(text))) g = { verdict: 'right', feedback: '', by: 'exact' };
        else if (/\[\[pending\]\]/.test(text)) g = { verdict: 'pending', feedback: '', by: 'ai' };
        else if (/\[\[ai-accept\]\]/.test(text)) g = { verdict: 'right', feedback: 'Accepted: that is another name for the same thing.', by: 'ai' };
        else g = { verdict: 'wrong', feedback: 'Not quite: that is not what the blank asks for.', by: 'ai' };
      } else {
        const v = /\[\[(met|partly|not_met|pending)\]\]/.exec(text);
        const verdict = v ? v[1] : 'not_met';
        g = { verdict, by: 'ai', feedback: { met: 'You made every essential point.', partly: 'You named the covenant but did not say what God promised.', not_met: 'You did not make the main point.', pending: '' }[verdict] };
      }
      a.answered[it.qid] = { ...g, gradeId: ++this.gradeSeq, kind: q.kind, text };
      out.push({ qid: it.qid, verdict: g.verdict, feedback: this.feedbackOut(g, false), gradeId: a.answered[it.qid].gradeId, gradedBy: g.by });
    }
    return { json: { items: out } };
  }

  // ---- POST /api/attempt/<id>/submit and GET /api/attempt/<id> ----
  score(a) {
    const bank = a.bank, S = a.scope, c = { mc: 0, fill: 0, sa: 0 }, pend = { fill: 0, sa: 0 };
    bank.mc.forEach((_, i) => { if (a.answered[qidOf(S, 'mc', i)]?.verdict === 'right') c.mc++; });
    const fillIdx = a.draw || bank.fill.map((_, i) => i);
    fillIdx.forEach((i) => { const v = a.answered[qidOf(S, 'fill', i)]?.verdict; if (v === 'right') c.fill++; if (v === 'pending') pend.fill++; });
    bank.sa.forEach((_, i) => { const v = a.answered[qidOf(S, 'sa', i)]?.verdict; if (v === 'met') c.sa++; if (v === 'pending') pend.sa++; });
    return { c, pend, total: { mc: bank.mc.length, fill: fillIdx.length, sa: bank.sa.length } };
  }
  evaluate(a) {
    const { c, pend, total } = this.score(a), t = this.track;
    const need = (n) => Math.ceil(n * 0.9);
    const test = a.bank.kind !== 'u';
    const mcOK = test || !total.mc || c.mc >= need(total.mc) || this.mcBanked(a.scope);
    const fillReq = test || t !== 'cert', saReq = !test && /^(thm|mdiv)$/.test(t);
    const fillOK = !fillReq || (test ? c.fill >= a.bank.pass : c.fill >= need(total.fill));
    const saOK = !saReq || !total.sa || c.sa >= need(total.sa);
    const pending = (fillReq && pend.fill > 0 && !fillOK) || (saReq && pend.sa > 0 && !saOK);
    return { c, total, mcOK, fillOK, saOK, pending, pass: mcOK && fillOK && saOK };
  }
  report(a) {
    const e = this.evaluate(a);
    const lock = this.locks.get(a.scope);
    const prompts = promptsFor(a);
    return {
      attemptId: a.id, status: a.status === 'open' ? 'open' : a.status,
      scores: { mc: { right: e.c.mc, total: e.total.mc }, fill: { right: e.c.fill, total: e.total.fill }, sa: { right: e.c.sa, total: e.total.sa } },
      lock: a.status === 'failed' && lock ? this.lockOut(lock) : null,
      unitDone: a.status === 'passed', courseDone: a.status === 'passed' && this.courseDone,
      disclosure: a.status === 'passed' ? 'review' : 'verdict',
      answered: this.answeredOut(a),
      ...(prompts ? { prompts } : {}),
      ...(a.status === 'passed' && a.bank.sa.length && !/^(thm|mdiv)$/.test(this.track)
        ? { models: Object.fromEntries(a.bank.sa.map((q, i) => [qidOf(a.scope, 'sa', i), q.model]).filter(([, m]) => m)) } : {}),
    };
  }
  submit(id) {
    const a = this.need(id);
    if (a.status === 'open') {
      const e = this.evaluate(a);
      if (e.pending) a.status = 'pending';
      else if (e.pass) { a.status = 'passed'; this.passed.add(a.scope); }
      else {
        a.status = 'failed';
        this.locks.set(a.scope, { until: Date.now() + this.lockMs, kind: e.mcOK ? 'sa' : 'full' });
        if (e.mcOK) (this.mcPassedScopes ||= new Set()).add(a.scope);
        const set = this.bankedSa.get(a.scope) || new Set();
        for (const [qid, r] of Object.entries(a.answered)) if (r.kind === 'sa' && r.verdict === 'met') set.add(qid);
        this.bankedSa.set(a.scope, set);
      }
    }
    return { json: this.report(a) };
  }
  /* The grader catches up: every pending answer becomes `to`, and the attempt
     is judged again, as the cron does. */
  settle(id, to = 'met') {
    const a = this.need(id);
    for (const r of Object.values(a.answered)) if (r.verdict === 'pending') {
      r.verdict = r.kind === 'fill' ? (to === 'met' ? 'right' : 'wrong') : to;
      r.feedback = 'Graded.';
    }
    const e = this.evaluate(a);
    a.status = e.pass ? 'passed' : 'failed';
    if (a.status === 'passed') this.passed.add(a.scope);
    else this.locks.set(a.scope, { until: Date.now() + this.lockMs, kind: e.mcOK ? 'sa' : 'full' });
  }

  appeal(body) {
    if (this.appeals.length >= 3) return { status: 429, json: { error: 'three open appeals' } };
    this.appeals.push(body);
    return { json: { ok: true } };
  }
}

export const STUB_CODE = CODE;
