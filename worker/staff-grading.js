/* The faculty's grading pages: /staff/grading (docs/ai-grading.md, section 9).
 *
 *   GET  /staff/grading                    the Appeals tab
 *   GET  /staff/grading/appeals            open appeals: claim, then uphold or overturn
 *   GET  /staff/grading/pending            answers a person must grade
 *   GET  /staff/grading/calibration        this ISO week's blind sample, and the agreement figures
 *   GET  /staff/grading/calibration.json   the agreement figures alone (no answer text)
 *   GET  /staff/grading/rulings            fill-in answers the AI accepted: keep or reject
 *   GET  /staff/grading/synonyms.json      "Download approved synonyms" (tools/apply-accepts.mjs reads it)
 *   GET  /staff/grading/copying            identical short answers from different students
 *   GET  /staff/grading/usage              AI calls and cost, the queue, the oldest waiting answer
 *   POST /staff/grading/appeals/<id>/claim | release | decide
 *   POST /staff/grading/pending/<gradeId>/grade
 *   POST /staff/grading/calibration/mark
 *   POST /staff/grading/rulings/decide
 *
 * Called from worker/staff.js handleStaff() after it has checked the Cloudflare
 * Access token and, for a POST, that the request came from this site. `user` is
 * the signed-in person's email, recorded on every action.
 *
 * A student answer is personal data. These pages are staff only, never cached,
 * and nothing here writes an answer to a log. A student is shown as "student
 * n" (the row number the roster uses) and a name, never as a student code.
 */
import { SITE_LANGUAGES } from '../src/lib/languages.mjs';
import { loadKeys, loadAttempt, loadStudent, settle, nowIso } from './grading/attempts.js';
import { rubricOf, pickText } from './grading/prompt.js';
import { normAnswer } from './grading/text.js';
import { tellStudent } from './grading/queue.js';
import { isoWeek, lastWeeks, calibrationSample, calibrationAgreement, aiRecord, keepAiRecord, facultyHeld,
  estimateCost, possibleCopying, SAMPLE_SIZE, AGREEMENT_FLOOR } from './grading/review.js';
import { sendEmail, emailConfigured } from './email.js';
import { appealEmail } from './grading/appeal-email.js';

const DAY = 86400000;
const WRITTEN = { sa: ['met', 'partly', 'not_met'], fill: ['right', 'wrong'] };
const LABEL = { met: 'met', partly: 'partly', not_met: 'not met', right: 'right', wrong: 'wrong', pending: 'pending' };
const TABS = [['appeals', 'Appeals'], ['pending', 'Pending'], ['calibration', 'Calibration'], ['rulings', 'Fill-in rulings'], ['copying', 'Possible copying'], ['usage', 'Usage']];
const FLASH = {
  claimed: 'You have taken this appeal.', released: 'Released.', upheld: 'The first result stands.', overturned: 'Changed.',
  passed: 'The student now passes this test.', course: 'The course is now complete.', emailed: 'The student has been emailed.',
  graded: 'Graded.', marked: 'Your mark is saved.', kept: 'Kept: this answer is now always right.', rejected: 'Rejected: this answer is now always wrong.',
};

const one = async (env, sql, ...b) => await env.DB.prepare(sql).bind(...b).first();
const all = async (env, sql, ...b) => (await env.DB.prepare(sql).bind(...b).all()).results ?? [];
const age = (iso, now = Date.now()) => {
  if (!iso) return 'none';
  const m = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  return m < 90 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} hours` : `${Math.round(m / 1440)} days`;
};
const short = (iso) => String(iso || '').slice(0, 16).replace('T', ' ');

/* ---- the page frame ------------------------------------------------------------ */

const EXTRA = `.tabs{margin:10px 0 16px;display:flex;flex-wrap:wrap;gap:6px}.tabs a{padding:5px 12px;border:1px solid #c8b6c2;border-radius:14px;text-decoration:none;background:#fff}
.tabs a.on{background:#4A1E3A;color:#fff;border-color:#4A1E3A}.tabs small{opacity:.75}
.card{background:#fff;border:1px solid #e7d8e4;border-radius:8px;padding:12px 14px;margin:0 0 14px;max-width:900px}
.card h3{margin:0 0 6px;font-size:1rem;color:#4A1E3A}.meta{font-size:.8rem;color:#6b5565;margin:0 0 8px}
.ans{white-space:pre-wrap;background:#faf8f9;border:1px solid #eadfe7;border-radius:6px;padding:8px 10px;margin:6px 0}
.pts{margin:6px 0;padding-left:18px;font-size:.88rem}.pts .made{color:#1f6b3b}.pts .missed{color:#9b2b2b}
.flash{background:#e8f5ea;border:1px solid #b9dfc2;border-radius:6px;padding:8px 12px;max-width:900px;margin:0 0 12px}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}textarea{width:100%;max-width:700px;font:inherit;font-size:.9rem;padding:6px}
select,input[type=text]{font:inherit;font-size:.9rem;padding:3px}td.n,th.n{text-align:right}
table.plain td,table.plain th{white-space:normal}.good{color:#1f6b3b}.bad{color:#9b2b2b}`;

function frame(kit, tab, user, counts, body, flash) {
  const { esc, STYLE } = kit;
  const note = flash ? String(flash).split('-').map((t) => FLASH[t]).filter(Boolean).join(' ') : '';
  return kit.html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CTS grading</title><style>${STYLE}${EXTRA}</style></head><body>
<h1>Grading written answers</h1>
<p>Signed in as ${esc(user)}. <a href="/staff/students">Student roster</a></p>
<nav class="tabs">${TABS.map(([k, label]) => `<a href="/staff/grading/${k}"${k === tab ? ' class="on"' : ''}>${label}${counts[k] ? ` <small>(${counts[k]})</small>` : ''}</a>`).join('')}</nav>
${note ? `<div class="flash">${esc(note)}</div>` : ''}${body}</body></html>`);
}

async function tabCounts(env) {
  const open = (await one(env, `SELECT COUNT(*) AS n FROM appeals WHERE status = 'open'`))?.n || 0;
  const held = (await facultyHeld(env))?.n || 0;
  return { appeals: open, pending: held };
}

/* ---- showing a question and an answer --------------------------------------------- */

/* One answer, with the question, what it is graded against, and (when `ai`) what
   the AI said. The AI's verdict is left out when the grader has to mark blind. */
function answerCard(kit, g, key, { ai = true, student = true } = {}) {
  const { esc } = kit;
  const lang = g.a_lang || g.lang || 'en';
  const prompt = pickText(key?.prompt, lang).text;
  const rec = aiRecord(g);
  let q = `<h3>${esc(prompt || g.qid)}</h3>`;
  q += `<p class="meta">${esc(g.qid)} · ${esc(g.kind === 'sa' ? 'short answer' : g.kind === 'fill' ? 'fill-in' : g.kind)} · ${esc(lang)}`
    + (student && g.n ? ` · student ${g.n}${g.name ? ' (' + esc(g.name) + ')' : ''}` : '') + (g.created_at ? ` · answered ${esc(short(g.created_at))}` : '') + '</p>';
  if (g.kind === 'sa') {
    const rub = rubricOf(key);
    const made = new Map((rec.points || []).map((p) => [p.id, p]));
    q += `<div class="meta">What a good answer makes clear (rubric${rub.version ? ' v' + rub.version : ', none written yet'}):</div><ul class="pts">`
      + rub.points.map((p) => {
        const r = made.get(p.id);
        const state = !ai || !r ? '' : r.made ? ' <span class="made">AI: made</span>' : ' <span class="missed">AI: not made</span>';
        const quote = ai && r && r.quote ? ` <em>“${esc(r.quote)}”</em>` : '';
        return `<li>${esc(p.id)}${p.essential ? ' (essential)' : ''}: ${esc(p.en)}${state}${quote}</li>`;
      }).join('') + '</ul>';
    const model = pickText(key?.model, lang).text;
    if (model) q += `<div class="meta">Model answer: ${esc(model)}</div>`;
  } else if (g.kind === 'fill') {
    const ans = pickText(key?.answer, lang).text;
    const acc = Object.values(key?.accept || {}).flat().filter(Boolean);
    q += `<div class="meta">Expected: <strong>${esc(ans)}</strong>${acc.length ? ` · also accepted: ${esc(acc.join(', '))}` : ''}</div>`;
  }
  q += `<div class="ans">${esc(g.answer_text)}</div>`;
  if (ai) {
    const said = g.verdict === 'pending' ? 'with faculty' : LABEL[g.verdict] || g.verdict;
    const by = g.graded_by === 'human' ? `graded by ${esc(g.grader_email || 'faculty')}` : `graded by ${esc(g.graded_by)}`;
    q += `<div class="meta">Result: <strong>${esc(said)}</strong> (${by}).`
      + (rec.verdict && g.graded_by === 'human' ? ` The AI had said: ${esc(LABEL[rec.verdict] || rec.verdict)}.` : '')
      + (rec.held ? ` Held: ${esc(rec.held)}.` : '') + '</div>';
    if (g.feedback) q += `<div class="meta">Feedback the student saw: ${esc(g.feedback)}</div>`;
  }
  return q;
}

const verdictSelect = (kit, kind, name = 'verdict', current, blank = false) =>
  `<select name="${name}"${blank ? ' required' : ''}>${blank ? '<option value="">choose…</option>' : ''}${WRITTEN[kind].map((v) => `<option value="${v}"${v === current ? ' selected' : ''}>${LABEL[v]}</option>`).join('')}</select>`;

/* ---- Appeals ------------------------------------------------------------------------ */

const APPEAL_ROWS = `SELECT ap.id AS appeal_id, ap.grade_id, ap.note AS student_note, ap.status AS appeal_status, ap.claimed_by, ap.created_at AS appealed_at,
    ap.decided_by, ap.decided_at, ap.ruling_note,
    g.id, g.attempt_id, g.qid, g.kind, g.lang, g.answer_text, g.verdict, g.feedback, g.points_json, g.graded_by, g.grader_email, g.created_at,
    a.lang AS a_lang, a.status AS attempt_status, s.rowid AS n, s.name, s.email, s.email_verified_at
  FROM appeals ap JOIN answer_grades g ON g.id = ap.grade_id JOIN attempts a ON a.id = g.attempt_id LEFT JOIN students s ON s.id = ap.student_id`;

async function appealsTab(env, kit, user, flash) {
  const { esc } = kit;
  const rows = await all(env, `${APPEAL_ROWS} WHERE ap.status = 'open' ORDER BY ap.created_at`);
  const keys = await loadKeys(env, [...new Set(rows.map((r) => r.qid))]);
  const cards = rows.map((r) => {
    const key = keys.get(r.qid)?.key;
    const mine = r.claimed_by === user, theirs = r.claimed_by && !mine;
    const decide = theirs ? `<p class="meta">Taken by ${esc(r.claimed_by)}.</p>` : !r.claimed_by
      ? `<form method="post" action="/staff/grading/appeals/${r.appeal_id}/claim" class="row"><button>Take this appeal</button></form>`
      : `<form method="post" action="/staff/grading/appeals/${r.appeal_id}/decide">
  <div class="row"><label><input type="radio" name="ruling" value="uphold" checked> Uphold (the first result stands)</label>
  <label><input type="radio" name="ruling" value="overturn"> Overturn, and grade it as ${verdictSelect(kit, r.kind === 'fill' ? 'fill' : 'sa', 'verdict', r.kind === 'fill' ? 'right' : 'met')}</label></div>
  <div class="meta">Your note for the record (required, not shown to the student):</div><textarea name="note" rows="2" maxlength="1000" required></textarea>
  <div class="meta">What the student is told about their answer (optional; a short sentence in the student's language):</div><textarea name="feedback" rows="2" maxlength="500"></textarea>
  <div class="row"><button>Record my ruling</button></div></form>
  <form method="post" action="/staff/grading/appeals/${r.appeal_id}/release" class="row"><button>Release it for someone else</button></form>`;
    return `<div class="card">${answerCard(kit, r, key)}
${r.student_note ? `<div class="meta">What the student wrote when asking for a review: <em>${esc(r.student_note)}</em></div>` : ''}
<div class="meta">Asked ${esc(short(r.appealed_at))}${r.email && r.email_verified_at ? ' · the student will be emailed' : ' · no confirmed email: the student will not be emailed'}</div>${decide}</div>`;
  });
  const since = new Date(Date.now() - 28 * DAY).toISOString();
  const outcome = await all(env, `SELECT status, COUNT(*) AS n FROM appeals WHERE created_at >= ? GROUP BY status`, since);
  const c = Object.fromEntries(outcome.map((o) => [o.status, o.n]));
  const total = (c.open || 0) + (c.upheld || 0) + (c.overturned || 0), decided = (c.upheld || 0) + (c.overturned || 0);
  const recent = await all(env, `SELECT ap.id, ap.status, ap.decided_by, ap.decided_at, ap.claimed_by FROM appeals ap WHERE ap.status != 'open' ORDER BY ap.decided_at DESC LIMIT 15`);
  return frame(kit, 'appeals', user, await tabCounts(env), `
<p>A student asks for a person to look again at a written answer that did not meet the standard. Take one, then uphold it or overturn it. An overturn grades the answer as yours and runs the pass rules again, which can pass the unit and the course.</p>
${cards.join('\n') || '<p>No appeals are waiting.</p>'}
<h3>Appeal outcomes, last 4 weeks</h3>
<p>${total} asked; ${c.open || 0} still open; ${c.upheld || 0} upheld; ${c.overturned || 0} overturned${decided ? ` (${Math.round(((c.overturned || 0) * 100) / decided)}% of those decided)` : ''}. A rising share overturned is a warning about the AI's grading.</p>
${recent.length ? `<h3>Recently decided</h3><div class="wrap"><table class="plain"><thead><tr><th>Appeal</th><th>Outcome</th><th>By</th><th>When</th></tr></thead><tbody>${recent.map((r) => `<tr><td>${r.id}</td><td>${esc(r.status)}</td><td>${esc(r.decided_by || '')}</td><td>${esc(short(r.decided_at))}</td></tr>`).join('')}</tbody></table></div>` : ''}`, flash);
}

async function emailStudent(env, studentId, attempt, details) {
  try {
    if (!emailConfigured(env)) return false;
    const s = await loadStudent(env, studentId);
    if (!s || !s.email || !s.email_verified_at) return false;
    await sendEmail(env, { to: s.email, ...appealEmail({ name: s.name, ...details, site: (env.SITE_ORIGIN || 'https://chapalaseminary.org').replace(/\/+$/, ''), lang: s.lang || attempt.lang }) });
    return true;
  } catch (e) { console.error('appeal email failed', e && e.message); return false; }
}

/* Run the pass rules again after a person graded an answer. Only for an attempt
   that was submitted: one still open is scored when its student submits it. */
async function resettle(env, attemptId) {
  const a = await loadAttempt(env, attemptId);
  if (!a || a.shadow || !['failed', 'pending'].includes(a.status)) return null;
  return await settle(env, attemptId);
}

const refuse = (kit, status, text) => kit.html(`<p>${kit.esc(text)} Use your browser's back button to return.</p>`, status);
const back = (tab, done) => new Response(null, { status: 303, headers: { location: `/staff/grading/${tab}${done ? '?done=' + done : ''}`, 'cache-control': 'no-store' } });
const text = (form, name, max) => String(form.get(name) ?? '').trim().slice(0, max);

async function appealAction(env, kit, user, id, action, request) {
  const form = await request.formData().catch(() => null);
  if (!form) return refuse(kit, 400, 'The form could not be read.');
  const ap = await one(env, `SELECT * FROM appeals WHERE id = ?`, id);
  if (!ap) return refuse(kit, 404, 'No such appeal.');
  if (ap.status !== 'open') return refuse(kit, 409, 'This appeal has already been decided.');
  if (action === 'claim') {
    const r = await env.DB.prepare(`UPDATE appeals SET claimed_by = ? WHERE id = ? AND status = 'open' AND claimed_by IS NULL`).bind(user, id).run();
    if (!r.meta?.changes && ap.claimed_by !== user) return refuse(kit, 409, `Already taken by ${ap.claimed_by}.`);
    return back('appeals', 'claimed');
  }
  if (action === 'release') {
    if (ap.claimed_by !== user) return refuse(kit, 409, 'Only the person who took this appeal can release it.');
    await env.DB.prepare(`UPDATE appeals SET claimed_by = NULL WHERE id = ? AND status = 'open'`).bind(id).run();
    return back('appeals', 'released');
  }
  // decide
  if (ap.claimed_by && ap.claimed_by !== user) return refuse(kit, 409, `This appeal was taken by ${ap.claimed_by}.`);
  const ruling = text(form, 'ruling', 20);
  const note = text(form, 'note', 1000);
  const feedback = text(form, 'feedback', 500);
  if (!['uphold', 'overturn'].includes(ruling)) return refuse(kit, 400, 'Choose uphold or overturn.');
  if (!note) return refuse(kit, 400, 'A note for the record is required.');
  const g = await one(env, `SELECT * FROM answer_grades WHERE id = ?`, ap.grade_id);
  if (!g) return refuse(kit, 404, 'The answer is gone.');
  const attempt = await loadAttempt(env, g.attempt_id);
  let verdict = g.verdict;
  if (ruling === 'overturn') {
    verdict = text(form, 'verdict', 20);
    if (!WRITTEN[g.kind]?.includes(verdict)) return refuse(kit, 400, 'Choose the verdict the answer should have.');
    if (verdict === g.verdict) return refuse(kit, 400, 'That is the verdict it already has. Uphold the appeal instead.');
  }
  const t = nowIso();
  // The appeal first, so a second submit of the same form changes nothing.
  const done = await env.DB.prepare(
    `UPDATE appeals SET status = ?, claimed_by = COALESCE(claimed_by, ?), decided_by = ?, decided_at = ?, ruling_note = ? WHERE id = ? AND status = 'open'`)
    .bind(ruling === 'uphold' ? 'upheld' : 'overturned', user, user, t, note, id).run();
  if (!done.meta?.changes) return refuse(kit, 409, 'This appeal has already been decided.');
  const flags = [ruling === 'uphold' ? 'upheld' : 'overturned'];
  let credit = { unitDone: false, courseDone: false };
  if (ruling === 'overturn') {
    await env.DB.prepare(
      `UPDATE answer_grades SET verdict = ?, feedback = ?, points_json = ?, graded_by = 'human', grader_email = ?, graded_at = ? WHERE id = ?`)
      .bind(verdict, feedback || null, keepAiRecord(g), user, t, g.id).run();
    const r = await resettle(env, g.attempt_id);
    if (r && r.status === 'passed' && r.was !== 'passed') {
      credit = r.credit || credit;
      flags.push('passed');
      if (credit.courseDone) flags.push('course');
    }
  }
  const mailed = await emailStudent(env, g.student_id, attempt || {}, { upheld: ruling === 'uphold', passed: flags.includes('passed'), courseDone: flags.includes('course'), feedback });
  if (mailed) flags.push('emailed');
  return back('appeals', flags.join('-'));
}

/* ---- Pending -------------------------------------------------------------------------- */

const HELD = { injection: 'it looked like an instruction to the grader', model: 'the AI was not sure', escalated: 'the AI could not grade it in time' };

async function pendingTab(env, kit, user, flash) {
  const { esc } = kit;
  const rows = await all(env,
    `SELECT g.id, g.attempt_id, g.qid, g.kind, g.lang, g.answer_text, g.verdict, g.feedback, g.points_json, g.graded_by, g.grader_email, g.created_at,
       a.lang AS a_lang, s.rowid AS n, s.name
     FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id LEFT JOIN students s ON s.id = g.student_id
     WHERE g.verdict = 'pending' AND a.shadow = 0 AND g.kind IN ('sa', 'fill') AND g.id NOT IN (SELECT grade_id FROM grade_queue) ORDER BY g.created_at`);
  const keys = await loadKeys(env, [...new Set(rows.map((r) => r.qid))]);
  const cards = rows.map((r) => {
    const rec = aiRecord(r);
    return `<div class="card">${answerCard(kit, r, keys.get(r.qid)?.key, { ai: false })}
<div class="meta">Why a person has it: ${esc(HELD[rec.held] || 'it is waiting for a person')}. The student is waiting for the result.</div>
<form method="post" action="/staff/grading/pending/${r.id}/grade"><div class="row">Grade it as ${verdictSelect(kit, r.kind === 'fill' ? 'fill' : 'sa')}</div>
<div class="meta">Feedback for the student (required; one or two sentences in the student's language; say what is missing):</div>
<textarea name="feedback" rows="3" maxlength="500" required></textarea><div class="row"><button>Save the grade</button></div></form></div>`;
  });
  return frame(kit, 'pending', user, await tabCounts(env), `
<p>Answers the AI could not grade, or that were held because they look like an instruction to the grader. Grade each as you would on paper. If this settles the student's test, the pass rules run and the student is emailed (if their email is confirmed).</p>
${cards.join('\n') || '<p>Nothing is waiting for a person.</p>'}`, flash);
}

async function pendingAction(env, kit, user, gradeId, request) {
  const form = await request.formData().catch(() => null);
  if (!form) return refuse(kit, 400, 'The form could not be read.');
  const g = await one(env, `SELECT * FROM answer_grades WHERE id = ?`, gradeId);
  if (!g) return refuse(kit, 404, 'No such answer.');
  if (g.verdict !== 'pending' || await one(env, 'SELECT 1 AS x FROM grade_queue WHERE grade_id = ?', gradeId))
    return refuse(kit, 409, g.verdict === 'pending' ? 'The AI still has this answer in its queue.' : 'This answer has already been graded.');
  const verdict = text(form, 'verdict', 20);
  const feedback = text(form, 'feedback', 500);
  if (!WRITTEN[g.kind]?.includes(verdict)) return refuse(kit, 400, 'Choose a verdict.');
  if (!feedback) return refuse(kit, 400, 'Feedback for the student is required.');
  const r0 = await env.DB.prepare(
    `UPDATE answer_grades SET verdict = ?, feedback = ?, points_json = ?, graded_by = 'human', grader_email = ?, graded_at = ? WHERE id = ? AND verdict = 'pending'`)
    .bind(verdict, feedback, keepAiRecord(g), user, nowIso(), gradeId).run();
  if (!r0.meta?.changes) return refuse(kit, 409, 'This answer has already been graded.');
  const flags = ['graded'];
  const r = await resettle(env, g.attempt_id);
  if (r && r.was === 'pending' && r.status !== 'pending') {
    if (r.status === 'passed') flags.push('passed');
    const s = await loadStudent(env, g.student_id);
    await tellStudent(env, r.attempt, r.status);
    if (emailConfigured(env) && s?.email && s.email_verified_at) flags.push('emailed');
  }
  return back('pending', flags.join('-'));
}

/* ---- Calibration ------------------------------------------------------------------------ */

async function sampleRows(env, ids) {
  if (!ids.length) return [];
  return await all(env,
    `SELECT g.id, g.qid, g.kind, g.lang, g.answer_text, g.verdict, g.feedback, g.points_json, g.graded_by, g.grader_email, g.created_at, a.lang AS a_lang
     FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id WHERE g.id IN (${ids.map(() => '?').join(',')})`, ...ids);
}

const pctText = (t) => (t.n ? `${t.pct}% (${t.same} of ${t.n})` : 'no answers marked by both yet');
export function agreementHtml(esc, ag) {
  const line = (label, t) => `<tr><td>${label}</td><td class="n">${pctText(t)}</td><td class="n">${t.n ? `${t.exactPct}% (${t.exact} of ${t.n})` : ''}</td></tr>`;
  return `<div class="wrap"><table class="plain"><thead><tr><th>Compared</th><th>Same result (met, or not met)</th><th>Exactly the same (met, partly, not met)</th></tr></thead><tbody>
${line('The AI and all graders together', ag.aiVsAll)}
${ag.aiVsGrader.map((t) => line(`The AI and ${esc(t.grader)}`, t)).join('')}
${ag.graderVsGrader.map((t) => line(`${esc(t.a)} and ${esc(t.b)}`, t)).join('') || '<tr><td colspan="3">Two graders have not yet marked the same answers.</td></tr>'}
</tbody></table></div>`;
}

async function calibrationTab(env, kit, user, flash) {
  const { esc } = kit;
  const week = isoWeek();
  const ids = await calibrationSample(env, week);
  const rows = await sampleRows(env, ids);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const marks = ids.length ? await all(env, `SELECT grade_id, marked_by, human_verdict FROM calibration WHERE week = ? AND grade_id IN (${ids.map(() => '?').join(',')})`, week, ...ids) : [];
  const mine = new Map(marks.filter((m) => m.marked_by === user).map((m) => [m.grade_id, m.human_verdict]));
  const keys = await loadKeys(env, [...new Set(rows.map((r) => r.qid))]);
  const done = ids.filter((id) => mine.has(id)).length;
  const cards = ids.map((id, i) => {
    const g = byId.get(id);
    if (!g) return '';
    const key = keys.get(g.qid)?.key;
    if (!mine.has(id)) {
      // Blind: the question, the rubric and the student's words. Not the AI's verdict, feedback or quotes, and not anyone else's mark.
      return `<div class="card"><p class="meta">Answer ${i + 1} of ${ids.length}</p>${answerCard(kit, { ...g, n: null, name: null, created_at: null }, key, { ai: false, student: false })}
<form method="post" action="/staff/grading/calibration/mark"><input type="hidden" name="grade" value="${id}">
<div class="row">Your mark: ${verdictSelect(kit, 'sa', 'verdict', '', true)}<button>Save my mark</button></div>
<div class="meta">A mark cannot be changed once saved.</div></form></div>`;
    }
    // Marked by this grader: the AI's verdict and the other marks may now be shown.
    const others = marks.filter((m) => m.grade_id === id && m.marked_by !== user);
    const ai = aiRecord(g).verdict;
    return `<div class="card"><p class="meta">Answer ${i + 1} of ${ids.length} · marked</p>${answerCard(kit, { ...g, n: null, name: null, created_at: null }, key, { ai: false, student: false })}
<div class="meta">You marked: <strong>${esc(LABEL[mine.get(id)])}</strong> · the AI said: <strong>${esc(LABEL[ai] || ai || 'no verdict')}</strong>${others.map((m) => ` · ${esc(m.marked_by)}: <strong>${esc(LABEL[m.human_verdict])}</strong>`).join('')}</div></div>`;
  });
  const ag = await calibrationAgreement(env);
  const low = ag.aiVsAll.n && ag.aiVsAll.pct < AGREEMENT_FLOOR;
  return frame(kit, 'calibration', user, await tabCounts(env), `
<p>Week ${esc(week)}: ${ids.length} answers the AI graded, chosen at random and the same for everyone this week. Mark each as you would on paper, <strong>without seeing what the AI decided or what another grader marked</strong>. Once you have saved a mark, the AI's verdict and the other marks for that answer appear. You have marked ${done} of ${ids.length}.</p>
<h3>Agreement over the last 4 weeks (${esc(ag.weeks[ag.weeks.length - 1])} to ${esc(ag.weeks[0])})</h3>
<p class="${low ? 'bad' : ''}">${low ? `The AI agrees with the faculty on less than ${AGREEMENT_FLOOR}% of answers. Robert decides whether to pause AI grading.` : `The aim is ${AGREEMENT_FLOOR}% or more.`}</p>
${agreementHtml(esc, ag)}
${cards.join('\n') || '<p>No answers have been graded by the AI yet, so there is nothing to mark.</p>'}`, flash);
}

async function calibrationMark(env, kit, user, request) {
  const form = await request.formData().catch(() => null);
  if (!form) return refuse(kit, 400, 'The form could not be read.');
  const id = Number(form.get('grade'));
  const verdict = text(form, 'verdict', 20);
  if (!Number.isInteger(id) || !WRITTEN.sa.includes(verdict)) return refuse(kit, 400, 'Choose a verdict.');
  const week = isoWeek();
  if (!(await calibrationSample(env, week)).includes(id)) return refuse(kit, 400, 'That answer is not in this week’s sample.');
  const r = await env.DB.prepare('INSERT OR IGNORE INTO calibration (grade_id, marked_by, human_verdict, marked_at, week) VALUES (?, ?, ?, ?, ?)').bind(id, user, verdict, nowIso(), week).run();
  if (!r.meta?.changes) return refuse(kit, 409, 'You have already marked this answer.');
  return back('calibration', 'marked');
}

/* ---- Fill-in rulings ---------------------------------------------------------------------- */

/* The words a student typed, for each decided (qid, lang, normalised form): the
   cache keeps only the normalised form, which has lost accents and capitals. */
async function typedForms(env) {
  const rows = await all(env, `SELECT qid, lang, answer_text FROM answer_grades WHERE kind = 'fill' AND verdict = 'right' AND graded_by IN ('ai', 'cache', 'override') ORDER BY id`);
  const m = new Map();
  for (const r of rows) {
    const k = `${r.qid}|${r.lang}|${normAnswer(r.answer_text)}`;
    if (!m.has(k)) m.set(k, String(r.answer_text).trim());
  }
  return m;
}

async function rulingsTab(env, kit, user, flash) {
  const { esc } = kit;
  const rows = await all(env,
    `SELECT c.qid, c.lang, c.norm_answer, c.seen_count, c.last_seen, o.verdict AS ruled, o.decided_by, o.decided_at
     FROM grade_cache c LEFT JOIN grade_overrides o ON o.qid = c.qid AND o.lang = c.lang AND o.norm_answer = c.norm_answer
     WHERE c.verdict = 'right' ORDER BY c.qid, c.seen_count DESC LIMIT 1500`);
  const keys = await loadKeys(env, [...new Set(rows.map((r) => r.qid))]);
  const typed = await typedForms(env);
  const groups = new Map();
  for (const r of rows) { if (!groups.has(r.qid)) groups.set(r.qid, []); groups.get(r.qid).push(r); }
  const undecided = [...groups].filter(([, rs]) => rs.some((r) => !r.ruled));
  const form = (r, decision, label) => `<form method="post" action="/staff/grading/rulings/decide" style="display:inline"><input type="hidden" name="qid" value="${esc(r.qid)}">
<input type="hidden" name="lang" value="${esc(r.lang)}"><input type="hidden" name="norm" value="${esc(r.norm_answer)}"><input type="hidden" name="decision" value="${decision}"><button>${label}</button></form>`;
  const table = (list) => list.map(([qid, rs]) => {
    const key = keys.get(qid)?.key;
    return `<div class="card"><h3>${esc(pickText(key?.prompt, rs[0].lang).text || qid)}</h3><p class="meta">${esc(qid)} · expected: <strong>${esc(pickText(key?.answer, rs[0].lang).text)}</strong></p>
<div class="wrap"><table class="plain"><thead><tr><th>The AI accepted</th><th>Lang</th><th class="n">Times seen</th><th>Ruling</th><th></th></tr></thead><tbody>
${rs.map((r) => `<tr><td>${esc(typed.get(`${r.qid}|${r.lang}|${r.norm_answer}`) || r.norm_answer)}</td><td>${esc(r.lang)}</td><td class="n">${r.seen_count}</td>
<td>${r.ruled === 'right' ? `kept (${esc(r.decided_by)})` : r.ruled === 'wrong' ? `rejected (${esc(r.decided_by)})` : 'not yet ruled'}</td>
<td>${r.ruled === 'right' ? form(r, 'reject', 'Reject instead') : r.ruled === 'wrong' ? form(r, 'keep', 'Keep instead') : form(r, 'keep', 'Keep') + ' ' + form(r, 'reject', 'Reject')}</td></tr>`).join('')}
</tbody></table></div></div>`;
  }).join('');
  const decided = [...groups].filter(([, rs]) => rs.every((r) => r.ruled));
  return frame(kit, 'rulings', user, await tabCounts(env), `
<p>Fill-in answers the AI accepted that are not the expected answer. <strong>Keep</strong> makes an answer right every time from now on, without asking the AI. <strong>Reject</strong> makes it wrong every time from now on; it does not change an earlier result. Kept answers can be added to the course content: <a href="/staff/grading/synonyms.json">Download approved synonyms</a>, then run <code>node tools/apply-accepts.mjs &lt;file&gt;</code>.</p>
${table(undecided) || '<p>Nothing is waiting for a ruling.</p>'}
${decided.length ? `<h3>Already ruled on</h3>${table(decided)}` : ''}`, flash);
}

async function rulingDecide(env, kit, user, request) {
  const form = await request.formData().catch(() => null);
  if (!form) return refuse(kit, 400, 'The form could not be read.');
  const qid = text(form, 'qid', 200), lang = text(form, 'lang', 3), norm = String(form.get('norm') ?? '').slice(0, 300), decision = text(form, 'decision', 10);
  if (!['keep', 'reject'].includes(decision) || !SITE_LANGUAGES.includes(lang) || !qid || !norm) return refuse(kit, 400, 'Choose keep or reject.');
  const c = await one(env, `SELECT 1 AS x FROM grade_cache WHERE qid = ? AND lang = ? AND norm_answer = ? AND verdict = 'right'`, qid, lang, norm);
  if (!c) return refuse(kit, 404, 'The AI has not accepted that answer.');
  await env.DB.prepare(
    `INSERT INTO grade_overrides (qid, lang, norm_answer, verdict, decided_by, decided_at, note) VALUES (?, ?, ?, ?, ?, ?, NULL)
     ON CONFLICT(qid, lang, norm_answer) DO UPDATE SET verdict = excluded.verdict, decided_by = excluded.decided_by, decided_at = excluded.decided_at`)
    .bind(qid, lang, norm, decision === 'keep' ? 'right' : 'wrong', user, nowIso()).run();
  return back('rulings', decision === 'keep' ? 'kept' : 'rejected');
}

/** The approved synonyms: every answer ruled "keep". { qid, lang, text }. */
async function synonyms(env, kit, user) {
  const kept = await all(env, `SELECT qid, lang, norm_answer, decided_by, decided_at FROM grade_overrides WHERE verdict = 'right' ORDER BY qid, lang, norm_answer`);
  const typed = await typedForms(env);
  const approved = kept.map((r) => ({ qid: r.qid, lang: r.lang, text: typed.get(`${r.qid}|${r.lang}|${r.norm_answer}`) || r.norm_answer }));
  return new Response(JSON.stringify({ version: 1, exportedAt: nowIso(), exportedBy: user, approved }, null, 1) + '\n', {
    headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': `attachment; filename="cts-approved-synonyms-${nowIso().slice(0, 10)}.json"`,
      'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer' },
  });
}

/* ---- Possible copying ------------------------------------------------------------------------ */

async function copyingTab(env, kit, user, flash) {
  const { esc } = kit;
  const groups = (await possibleCopying(env)).slice(0, 100);
  const keys = await loadKeys(env, [...new Set(groups.map((g) => g[0].qid))]);
  const names = new Map((await all(env, `SELECT id, rowid AS n, name FROM students`)).map((s) => [s.id, s]));
  const cards = groups.map((g) => `<div class="card"><h3>${esc(pickText(keys.get(g[0].qid)?.key.prompt, g[0].lang).text || g[0].qid)}</h3>
<p class="meta">${esc(g[0].qid)} · ${new Set(g.map((r) => r.student_id)).size} students gave this answer word for word</p>
<div class="ans">${esc(g[0].answer_text)}</div>
<div class="wrap"><table class="plain"><thead><tr><th>Student</th><th>When</th><th>Result</th></tr></thead><tbody>
${g.map((r) => { const s = names.get(r.student_id); return `<tr><td>student ${s ? s.n : '?'}${s ? ' (' + esc(s.name) + ')' : ''}</td><td>${esc(short(r.created_at))}</td><td>${esc(LABEL[r.verdict] || r.verdict)}</td></tr>`; }).join('')}
</tbody></table></div></div>`);
  return frame(kit, 'copying', user, await tabCounts(env), `
<p>The same short answer, word for word once capitals and punctuation are ignored (12 words or more), from different students to the same question. Two students can legitimately write alike, so this is a prompt to look, nothing more. Nothing here changes any result.</p>
${cards.join('\n') || '<p>No identical answers.</p>'}`, flash);
}

/* ---- Usage -------------------------------------------------------------------------------------- */

async function usageTab(env, kit, user, flash) {
  const { esc } = kit;
  const since = new Date(Date.now() - 30 * DAY).toISOString().slice(0, 10);
  const rows = await all(env, `SELECT day, model, calls, input_tokens, output_tokens, errors FROM ai_usage WHERE day >= ? ORDER BY day DESC, model`, since);
  const money = (d) => '$' + d.toFixed(d < 1 ? 3 : 2);
  const by = new Map();
  let total = 0, assumed = false;
  for (const r of rows) {
    const c = estimateCost(r.model, r.input_tokens, r.output_tokens);
    total += c.dollars; assumed ||= c.assumed;
    const m = by.get(r.model) || { calls: 0, input: 0, output: 0, errors: 0, dollars: 0 };
    m.calls += r.calls; m.input += r.input_tokens; m.output += r.output_tokens; m.errors += r.errors; m.dollars += c.dollars;
    by.set(r.model, m);
  }
  const queue = await one(env, `SELECT COUNT(*) AS n, MIN(created_at) AS oldest FROM grade_queue`);
  const held = await facultyHeld(env);
  const oldestPending = [queue?.oldest, held?.oldest].filter(Boolean).sort()[0];
  const num = (n) => Number(n).toLocaleString('en-US');
  return frame(kit, 'usage', user, await tabCounts(env), `
<h3>Waiting</h3>
<p>${queue?.n || 0} answers are in the AI's queue (it tries again every 15 minutes) · ${held?.n || 0} are with faculty · the oldest answer still waiting has waited ${esc(age(oldestPending))}.</p>
<h3>The last 30 days</h3>
<p>${num(rows.reduce((s, r) => s + r.calls, 0))} calls · estimated cost <strong>${money(total)}</strong> · ${num(rows.reduce((s, r) => s + r.errors, 0))} errors.
<small>An estimate from Cloudflare's published prices per million tokens${assumed ? '; a model with no listed price is priced as the main model' : ''}. The bill is the truth.</small></p>
<div class="wrap"><table><thead><tr><th>Model</th><th class="n">Calls</th><th class="n">Tokens in</th><th class="n">Tokens out</th><th class="n">Errors</th><th class="n">Estimated cost</th></tr></thead><tbody>
${[...by].map(([m, v]) => `<tr><td>${esc(m)}</td><td class="n">${num(v.calls)}</td><td class="n">${num(v.input)}</td><td class="n">${num(v.output)}</td><td class="n">${num(v.errors)}</td><td class="n">${money(v.dollars)}</td></tr>`).join('') || '<tr><td colspan="6">No calls yet.</td></tr>'}
</tbody></table></div>
<h3>By day</h3>
<div class="wrap"><table><thead><tr><th>Day</th><th>Model</th><th class="n">Calls</th><th class="n">Tokens in</th><th class="n">Tokens out</th><th class="n">Errors</th><th class="n">Estimated cost</th></tr></thead><tbody>
${rows.map((r) => `<tr><td>${esc(r.day)}</td><td>${esc(r.model)}</td><td class="n">${num(r.calls)}</td><td class="n">${num(r.input_tokens)}</td><td class="n">${num(r.output_tokens)}</td><td class="n">${num(r.errors)}</td><td class="n">${money(estimateCost(r.model, r.input_tokens, r.output_tokens).dollars)}</td></tr>`).join('')}
</tbody></table></div>`, flash);
}

/* ---- the entry point ------------------------------------------------------------------------------ */

export async function handleGrading(request, env, user, url, path, kit) {
  const method = request.method.toUpperCase();
  const flash = url.searchParams.get('done');
  let m;
  if (method === 'GET') {
    if (path === '/staff/grading' || path === '/staff/grading/appeals') return await appealsTab(env, kit, user, flash);
    if (path === '/staff/grading/pending') return await pendingTab(env, kit, user, flash);
    if (path === '/staff/grading/calibration') return await calibrationTab(env, kit, user, flash);
    if (path === '/staff/grading/calibration.json') return kit.json(await calibrationAgreement(env));
    if (path === '/staff/grading/rulings') return await rulingsTab(env, kit, user, flash);
    if (path === '/staff/grading/synonyms.json') return await synonyms(env, kit, user);
    if (path === '/staff/grading/copying') return await copyingTab(env, kit, user, flash);
    if (path === '/staff/grading/usage') return await usageTab(env, kit, user, flash);
  }
  if (method === 'POST') {
    if ((m = /^\/staff\/grading\/appeals\/(\d+)\/(claim|release|decide)$/.exec(path))) return await appealAction(env, kit, user, +m[1], m[2], request);
    if ((m = /^\/staff\/grading\/pending\/(\d+)\/grade$/.exec(path))) return await pendingAction(env, kit, user, +m[1], request);
    if (path === '/staff/grading/calibration/mark') return await calibrationMark(env, kit, user, request);
    if (path === '/staff/grading/rulings/decide') return await rulingDecide(env, kit, user, request);
  }
  return kit.html('<p>No such page.</p>', 404);
}
