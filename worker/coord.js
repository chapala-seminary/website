/* Coordinator-led paper study: /coord (and /staff/groups for setting it up).
 *
 * Wayne Cook, 20 Oct 2026, on the design in docs/offline-coordinator.md:
 * pilot groups in Kenya and Liberia, Old Testament Survey, Certificate track
 * (multiple choice only), one coordinator per group who types in the paper
 * answer sheets. Learners with no email and no device still get their own
 * student record and code, and their passes are real credit.
 *
 *   GET  /coord                          the group: enroll, members, units passed
 *   POST /coord/enroll                   a new learner (name, language)
 *   GET  /coord/members/<id>/code        that member's student code, again
 *   GET  /coord/exam/<unit>?lang=xx      the printable exam for a unit, no answers
 *   GET  /coord/members/<id>/sheet       the form for one answer sheet
 *   POST /coord/members/<id>/sheet       grade it: unit + the letters, in order
 *
 *   GET  /staff/groups                   staff: the groups, and a form for a new one
 *   POST /staff/groups                   staff: create a group (name, country, coordinator email)
 *
 * WHO CAN SEE IT. A second Cloudflare Access application on /coord/*, whose
 * policy names the coordinators' emails. Its audience tag is COORD_ACCESS_AUD,
 * so a coordinator's sign-in opens /coord and nothing else, and the staff
 * pages never accept it (worker/staff.js accessUser). The Worker loads only the
 * group whose coordinator_email is the signed-in address. Not configured
 * (COORD_ACCESS_AUD unset), no page.
 *
 * WHAT A COORDINATOR CANNOT DO. See another group; see an email; mark a unit
 * passed; see an answer key, which item was wrong, or the right option;
 * change a sheet after it is entered; issue a certificate.
 *
 * GRADING. A sheet becomes an ordinary attempt for that student and is
 * settled by the same code as an online attempt (worker/grading/attempts.js
 * settle): the same keys, the same 18-of-20 rule on the Certificate track, the
 * same lock after a failure, the same credit. The questions are taken in bank
 * order and the options in stored order -- exactly as /coord/exam prints them,
 * which is why the sitting must use that printout. Each printout carries an
 * exam version; a sheet whose version is not the current one is refused
 * before anything is recorded. Only when the site grades
 * on the server (GRADING_MODE live): before that, sheets are refused.
 */
import catalog from './catalog.json';
import { accessUser } from './staff.js';
import { loadScope, loadKeys, loadStudent, trackOf, nowIso, settle } from './grading/attempts.js';
import { isLive } from './grading/mode.js';
import { canonicalCountry } from '../src/lib/countries.mjs';

const LETTERS = 'ABCDEFGHIJ';
const LANGS = { en: 'English', es: 'Español', fr: 'Français' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = (s) => String(s ?? '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const NOSTORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer' };
const STYLE = `body{font-family:system-ui,sans-serif;margin:0;padding:16px;max-width:900px;background:#faf8f9;color:#2b1d27;line-height:1.45}
h1{font-size:1.4rem;margin:.2rem 0 1rem}h2{font-size:1.1rem;margin:1.6rem 0 .5rem}
table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{border-bottom:1px solid #e3dbe0;padding:6px 4px;text-align:left;vertical-align:top}
input,select,button{font-size:1rem;padding:6px 8px}button{background:#6b1f3a;color:#fff;border:0;border-radius:4px;cursor:pointer}
.note{background:#fff;border-left:4px solid #6b1f3a;padding:10px 12px;margin:12px 0}.code{font:700 1.4rem ui-monospace,monospace;letter-spacing:.06em}
.ok{color:#1d6b35;font-weight:600}.no{color:#8a1f1f;font-weight:600}.u{display:inline-block;min-width:1.6em;text-align:center}
@media print{.noprint{display:none}body{background:#fff}}`;
const page = (title, body, status = 200) => new Response(
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${STYLE}</style><body>${body}</body></html>`,
  { status, headers: { 'content-type': 'text/html; charset=utf-8', ...NOSTORE } });
const back = '<p class="noprint"><a href="/coord">Back to the group</a></p>';

/* Crockford base32 without I, L, O, U -- the same alphabet as worker/api.js. */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const part = () => [...crypto.getRandomValues(new Uint8Array(4))].map((b) => ALPHABET[b % 32]).join('');
const studentCode = () => `CTS-${part()}-${part()}-${part()}`;

/* The exam version printed on a paper exam: a short code from each question's
   position, its right option and how many options it has -- what grading a sheet
   depends on. It tells nothing about the answers. When a key changes after a
   paper was printed, the version changes, and that paper's sheet is refused
   before any attempt is made (ChatGPT's review of #148, 20 Oct 2026): it is
   never graded against keys it was not printed from. */
async function examVersion(scope, keys) {
  const parts = scope.qids.mc.map((qid) => {
    const k = keys.get(qid)?.key || {};
    return `${qid}|${k.answer}|${(k.options?.en || []).length}`;
  });
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(parts.join('\n'))));
  return [...digest.slice(0, 6)].map((b) => ALPHABET[b % 32]).join('');
}
const cleanVersion = (v) => String(v || '').toUpperCase().replace(/[^0-9A-Z]/g, '');

function courseOf(group) {
  const c = catalog.courses[group.course];
  return c ? { slug: group.course, ...c } : null;
}
const title = (course, lang = 'en') => course?.title?.[lang] || course?.title?.en || course?.slug || '';

/* ---- the coordinator's pages ---------------------------------------------------- */

export async function handleCoord(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/coord';
  if (!env.ACCESS_TEAM || !env.COORD_ACCESS_AUD)
    return page('Not set up', '<p>The coordinator pages are not set up on this site yet.</p>', 503);
  const user = await accessUser(request, env, env.COORD_ACCESS_AUD);
  if (!user) return page('Sign in', '<p>Sign in through Cloudflare Access to see this page.</p>', 403);
  if (!env.DB) return page('Not set up', '<p>Student records are not configured.</p>', 503);
  const email = String(user).trim().toLowerCase();
  const group = await env.DB.prepare('SELECT * FROM study_groups WHERE coordinator_email = ? AND closed_at IS NULL').bind(email).first();
  if (!group) return page('No group', `<p>${esc(email)} is not the coordinator of a study group. Please write to the seminary.</p>`, 403);
  const course = courseOf(group);
  if (!course) return page('Not set up', '<p>This group\'s course is not on the site.</p>', 503);
  const method = request.method.toUpperCase();
  if (method === 'POST') {
    const from = request.headers.get('origin');
    if (from && from !== url.origin) return page('Refused', '<p>Refused: the request did not come from this site.</p>', 403);
  }

  let m;
  if (method === 'GET' && path === '/coord') return home(env, group, course, email);
  if (method === 'POST' && path === '/coord/enroll') return enroll(request, env, group, course, email);
  if (method === 'GET' && (m = /^\/coord\/members\/(\d+)\/code$/.exec(path))) return showCode(env, group, +m[1]);
  if (method === 'GET' && (m = /^\/coord\/exam\/(\d{1,3})$/.exec(path))) return exam(env, course, +m[1], url.searchParams.get('lang'));
  if ((m = /^\/coord\/members\/(\d+)\/sheet$/.exec(path))) {
    if (method === 'GET') return sheetForm(env, group, course, +m[1], url.searchParams.get('unit'));
    if (method === 'POST') return sheetEntry(request, env, group, course, +m[1], email);
  }
  return page('Not found', '<p>No such page.</p>' + back, 404);
}

async function memberOf(env, group, id) {
  return await env.DB.prepare(
    `SELECT m.id, m.student_id, s.name, s.lang, s.track FROM study_group_members m JOIN students s ON s.id = m.student_id
     WHERE m.id = ? AND m.group_id = ?`).bind(id, group.id).first();
}

async function home(env, group, course, email) {
  const members = (await env.DB.prepare(
    `SELECT m.id, m.student_id, s.name, s.lang FROM study_group_members m JOIN students s ON s.id = m.student_id
     WHERE m.group_id = ? ORDER BY s.name COLLATE NOCASE`).bind(group.id).all()).results ?? [];
  const passed = new Map();
  if (members.length) {
    const rows = (await env.DB.prepare(
      `SELECT u.student_id, u.unit, u.completed_at FROM unit_progress u JOIN study_group_members m ON m.student_id = u.student_id
       WHERE m.group_id = ? AND u.course = ?`).bind(group.id, course.slug).all()).results ?? [];
    for (const r of rows) {
      if (!passed.has(r.student_id)) passed.set(r.student_id, { units: new Set(), last: '' });
      const p = passed.get(r.student_id);
      p.units.add(r.unit);
      if (r.completed_at > p.last) p.last = r.completed_at;
    }
  }
  const units = course.units || [];
  const rows = members.map((mb) => {
    const p = passed.get(mb.student_id) || { units: new Set(), last: '' };
    const marks = units.map((u) => `<span class="u ${p.units.has(u) ? 'ok' : ''}" title="Unit ${u}">${p.units.has(u) ? '✓' : u}</span>`).join('');
    return `<tr><td>${esc(mb.name)}<br><small>${esc(LANGS[mb.lang] || 'English')}</small></td>
      <td>${marks}<br><small>${p.units.size} of ${units.length} passed${p.last ? ' · last ' + esc(p.last.slice(0, 10)) : ''}</small></td>
      <td><a href="/coord/members/${mb.id}/sheet">Enter a sheet</a><br><a href="/coord/members/${mb.id}/code">Student code</a></td></tr>`;
  }).join('');
  const examLinks = units.map((u) => `<a href="/coord/exam/${u}">Unit ${u}</a>`).join(' · ');
  return page(group.name, `<h1>${esc(group.name)}</h1>
<p>Course: <b>${esc(title(course))}</b> · Certificate track · Signed in as ${esc(email)}</p>
<div class="note">Each learner needs their own record. Write each new code in your book and on the learner's paper,
and keep it private. A learner who passes a unit here has passed it on the seminary's own record.</div>
<h2>Learners (${members.length})</h2>
${members.length ? `<table><tr><th>Name</th><th>Units passed</th><th></th></tr>${rows}</table>` : '<p>No learners yet.</p>'}
<h2>Enroll a learner</h2>
<form method="post" action="/coord/enroll">
<p><label>Full name<br><input name="name" required maxlength="120" autocomplete="off"></label></p>
<p><label>Language<br><select name="lang">${Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label></p>
<p><button>Enroll</button></p></form>
<h2>Exams to print</h2>
<p>Print the exam for the sitting from these links. The order of questions and of the choices A, B, C, D on these pages
is the order the answer sheet is graded in, so use these pages, not another copy. They have no answers on them.</p>
<p>${examLinks}</p>`);
}

async function enroll(request, env, group, course, email) {
  const form = await request.formData().catch(() => null);
  const name = String(form?.get('name') || '').trim().replace(/\s+/g, ' ');
  const lang = LANGS[form?.get('lang')] ? String(form.get('lang')) : 'en';
  if (!name || name.length > 120) return page('Enroll', '<p class="no">A name is required (up to 120 characters).</p>' + back, 400);
  const t = nowIso();
  for (let i = 0; i < 5; i++) {
    const id = studentCode();
    const res = await env.DB.prepare(
      `INSERT INTO students (id, name, email, country, track, goal, heard, lang, created_at, updated_at)
       VALUES (?, ?, NULL, ?, 'cert', NULL, 'church', ?, ?, ?) ON CONFLICT(id) DO NOTHING`)
      .bind(id, name, canonicalCountry(group.country || null), lang, t, t).run();
    if (!res.meta?.changes) continue;
    const mem = await env.DB.prepare(
      'INSERT INTO study_group_members (group_id, student_id, enrolled_at, enrolled_by) VALUES (?, ?, ?, ?)')
      .bind(group.id, id, t, email).run();
    const memberId = mem.meta?.last_row_id;
    return page('Enrolled', `<h1>Enrolled</h1><p><b>${esc(name)}</b> is enrolled in ${esc(group.name)}.</p>
<div class="note"><p>Student code:</p><p class="code">${esc(id)}</p>
<p>Write it now in your book and on ${esc(name)}'s paper. Keep it private, like a password: it opens this learner's whole record.</p></div>
<p><a href="/coord/members/${memberId}/sheet">Enter a sheet for ${esc(name)}</a></p>${back}`, 201);
  }
  return page('Enroll', '<p class="no">Could not make a student code. Please try again.</p>' + back, 503);
}

async function showCode(env, group, id) {
  const mb = await memberOf(env, group, id);
  if (!mb) return page('Not found', '<p>No such learner in this group.</p>' + back, 404);
  return page('Student code', `<h1>${esc(mb.name)}</h1><div class="note"><p>Student code:</p><p class="code">${esc(mb.student_id)}</p>
<p>Keep it private, like a password.</p></div>${back}`);
}

/* The printable exam: bank order, stored option order, no answers. */
async function exam(env, course, unit, langRaw) {
  if (!(course.units || []).includes(unit)) return page('Not found', '<p>No such unit.</p>' + back, 404);
  const lang = LANGS[langRaw] ? langRaw : 'en';
  const scope = await loadScope(env, `u:${course.pages}/${unit}`);
  if (!scope || !scope.qids.mc.length) return page('Not ready', '<p>This unit\'s exam is not on the server yet.</p>' + back, 409);
  const keys = await loadKeys(env, scope.qids.mc);
  const pick = (o) => (o && (o[lang] ?? o.en)) ?? '';
  const items = scope.qids.mc.map((qid, i) => {
    const k = keys.get(qid)?.key || {};
    const opts = (pick(k.options) || []).map((o, j) => `<li><b>${LETTERS[j]}.</b> ${esc(plain(o))}</li>`).join('');
    return `<li style="margin-bottom:12px"><p style="margin:0 0 4px">${esc(plain(pick(k.prompt)))}</p><ul style="list-style:none;padding-left:8px;margin:0">${opts}</ul></li>`;
  }).join('');
  const langLinks = Object.entries(LANGS).map(([k, v]) => k === lang ? `<b>${v}</b>` : `<a href="?lang=${k}">${v}</a>`).join(' · ');
  const n = scope.qids.mc.length;
  const version = await examVersion(scope, keys);
  const grid = Array.from({ length: n }, (_, i) => `<td style="border:1px solid #999;padding:6px 8px">${i + 1}. ____</td>${(i + 1) % 5 === 0 ? '</tr><tr>' : ''}`).join('');
  return page(`${title(course, lang)} — Unit ${unit}`, `<p class="noprint">${langLinks} · <a href="javascript:print()">Print</a></p>${back}
<h1>${esc(title(course, lang))} — Unit ${unit}</h1>
<p>Exam version: <b class="exam-version">${version}</b></p>
<p>Name: ______________________________ &nbsp; Student code: ______________________</p>
<p>Write the letter of the one best answer for each question on the answer sheet below.</p>
<ol>${items}</ol>
<h2>Answer sheet — Unit ${unit} — exam version ${version}</h2>
<p>Name: ______________________________ &nbsp; Student code: ______________________</p>
<table style="width:auto"><tr>${grid}</tr></table>`);
}

async function sheetForm(env, group, course, id, unitRaw, message = '') {
  const mb = await memberOf(env, group, id);
  if (!mb) return page('Not found', '<p>No such learner in this group.</p>' + back, 404);
  const done = new Set(((await env.DB.prepare('SELECT unit FROM unit_progress WHERE student_id = ? AND course = ?')
    .bind(mb.student_id, course.slug).all()).results ?? []).map((r) => r.unit));
  const open = (course.units || []).filter((u) => !done.has(u));
  const want = Number(unitRaw);
  const opts = open.map((u) => `<option value="${u}"${u === want ? ' selected' : ''}>Unit ${u}</option>`).join('');
  return page(`Sheet — ${mb.name}`, `<h1>Answer sheet: ${esc(mb.name)}</h1>${message}
${open.length ? `<form method="post">
<p><label>Unit<br><select name="unit">${opts}</select></label></p>
<p><label>Exam version (printed at the top of the exam)<br>
<input name="version" required autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12"
 style="font-family:ui-monospace,monospace;letter-spacing:.1em"></label></p>
<p><label>The letters on the sheet, in order (for example ABDCA...)<br>
<input name="letters" required autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text"
 maxlength="80" style="width:100%;font-family:ui-monospace,monospace;letter-spacing:.1em"></label></p>
<p><small>Type one letter per question, question 1 first. Spaces and commas are ignored. A question left blank on the paper
is wrong: type the letter X for it.</small></p>
<p><button>Grade this sheet</button></p></form>` : '<p class="ok">Every unit of this course is passed.</p>'}${back}`);
}

/* Grade one sheet. Exported for the tests' sake of naming; the route is the only caller. */
export async function enterSheet(env, { group, course, member, unit, letters, version, enteredBy, live }) {
  if (!live) return { error: 'Paper sheets open when the site grades exams on the server. Please try again later.', status: 409 };
  if (!(course.units || []).includes(unit)) return { error: 'No such unit.', status: 400 };
  const scope = await loadScope(env, `u:${course.pages}/${unit}`);
  if (!scope || !scope.qids.mc.length) return { error: 'This unit\'s exam is not on the server yet.', status: 409 };
  const student = await loadStudent(env, member.student_id);
  if (!student) return { error: 'No such learner.', status: 404 };
  if (await env.DB.prepare('SELECT 1 FROM unit_progress WHERE student_id = ? AND course = ? AND unit = ?').bind(student.id, course.slug, unit).first())
    return { error: `Unit ${unit} is already passed.`, status: 409 };
  const recent = (await env.DB.prepare(
    'SELECT * FROM attempts WHERE student_id = ? AND scope = ? AND shadow = 0 ORDER BY started_at DESC, rowid DESC LIMIT 5')
    .bind(student.id, scope.scope).all()).results ?? [];
  if (recent.some((a) => a.status === 'open' || a.status === 'pending'))
    return { error: 'This learner has an exam for this unit open on the website. Finish or wait for it first.', status: 409 };
  const locked = recent.find((a) => a.locked_until && Date.parse(a.locked_until) > Date.now());
  if (locked) return { error: `This unit is locked after a sheet that did not pass, until ${locked.locked_until.slice(11, 16)} UTC. Enter the new sheet after that.`, status: 423 };

  const keys = await loadKeys(env, scope.qids.mc);
  if (scope.qids.mc.some((qid) => !keys.get(qid))) return { error: 'This unit\'s answer key is incomplete on the server.', status: 409 };
  const printed = cleanVersion(version);
  if (!printed) return { error: 'Enter the exam version printed at the top of the exam.', status: 400 };
  const current = await examVersion(scope, keys);
  if (printed !== current)
    return { error: `This paper was printed from exam version ${printed}, but the exam for Unit ${unit} is now version ${current}. `
      + 'Print the current exam and have the learner sit it again. Nothing was recorded, and the unit is not locked.', status: 409 };
  const clean = String(letters || '').toUpperCase().replace(/[^A-Z]/g, '');
  const n = scope.qids.mc.length;
  if (clean.length !== n) return { error: `The sheet has ${clean.length} letters; this unit has ${n} questions.`, status: 400 };
  const lang = ['en', 'es', 'fr'].includes(student.lang) ? student.lang : 'en';
  const choices = [];
  for (let i = 0; i < n; i++) {
    const k = keys.get(scope.qids.mc[i]);
    const count = ((k.key.options && (k.key.options[lang] ?? k.key.options.en)) || []).length;
    const ch = clean[i];
    if (ch === 'X') { choices.push(-1); continue; }
    const idx = LETTERS.indexOf(ch);
    if (idx < 0 || idx >= count) return { error: `Question ${i + 1}: "${ch}" is not one of its choices (A to ${LETTERS[count - 1]}).`, status: 400 };
    choices.push(idx);
  }

  const id = crypto.randomUUID();
  const t = nowIso();
  const stmts = [env.DB.prepare(
    `INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at) VALUES (?, ?, ?, ?, ?, 0, 'open', ?)`)
    .bind(id, student.id, scope.scope, trackOf(student), lang, t)];
  scope.qids.mc.forEach((qid, i) => {
    const right = choices[i] >= 0 && choices[i] === keys.get(qid).key.answer;
    stmts.push(env.DB.prepare(
      `INSERT INTO answer_grades (attempt_id, student_id, qid, kind, lang, answer_text, verdict, graded_by, created_at, graded_at)
       VALUES (?, ?, ?, 'mc', ?, ?, ?, 'exact', ?, ?) ON CONFLICT(attempt_id, qid) DO NOTHING`)
      .bind(id, student.id, qid, lang, String(choices[i] >= 0 ? choices[i] : ''), right ? 'right' : 'wrong', t, t));
  });
  stmts.push(env.DB.prepare(
    'INSERT INTO paper_sheets (attempt_id, group_id, student_id, scope, letters, entered_by, entered_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(id, group.id, student.id, scope.scope, clean, enteredBy, t));
  await env.DB.batch(stmts);
  const r = await settle(env, id, { submitting: true });
  const a = r?.attempt || {};
  const right = choices.filter((c, i) => c >= 0 && c === keys.get(scope.qids.mc[i]).key.answer).length;
  return { status: r?.status, right, total: n, lockedUntil: a.locked_until || null, courseDone: !!r?.credit?.courseDone };
}

async function sheetEntry(request, env, group, course, id, email) {
  const mb = await memberOf(env, group, id);
  if (!mb) return page('Not found', '<p>No such learner in this group.</p>' + back, 404);
  const form = await request.formData().catch(() => null);
  const unit = Number(form?.get('unit'));
  const r = await enterSheet(env, { group, course, member: mb, unit, letters: form?.get('letters'), version: form?.get('version'), enteredBy: email, live: isLive(env, request) });
  if (r.error) return sheetForm(env, group, course, id, String(unit), `<p class="no">${esc(r.error)}</p>`);
  const verdict = r.status === 'passed'
    ? `<p class="ok">Passed: ${r.right} of ${r.total} right.</p>${r.courseDone ? `<p class="ok">${esc(mb.name)} has now completed ${esc(title(course))}.</p>` : ''}`
    : `<p class="no">Not passed: ${r.right} of ${r.total} right (${Math.ceil(r.total * 0.9)} needed).</p>
       <p>The learner may study the unit again and sit a new paper${r.lockedUntil ? ` after ${esc(r.lockedUntil.slice(11, 16))} UTC` : ''}.</p>`;
  return page('Graded', `<h1>Unit ${unit}: ${esc(mb.name)}</h1>${verdict}
<p><a href="/coord/members/${mb.id}/sheet">Enter another sheet for ${esc(mb.name)}</a></p>${back}`);
}

/* ---- staff: setting up a group ---------------------------------------------------- */

export async function handleStaffGroups(request, env, user, url, path, { esc: e, html, STYLE: S }) {
  const method = request.method.toUpperCase();
  if (method === 'POST' && path === '/staff/groups') {
    const form = await request.formData().catch(() => null);
    const name = String(form?.get('name') || '').trim();
    const email = String(form?.get('coordinator_email') || '').trim().toLowerCase();
    const country = String(form?.get('country') || '').trim();
    const course = String(form?.get('course') || 'ots').trim();
    if (!name || name.length > 120 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !catalog.courses[course])
      return html(`<style>${S}</style><p>A group needs a name, a coordinator email and a course on the site.</p><p><a href="/staff/groups">Back</a></p>`, 400);
    const res = await env.DB.prepare(
      `INSERT INTO study_groups (name, country, coordinator_email, course, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(coordinator_email) DO NOTHING`)
      .bind(name, canonicalCountry(country || null), email, course, nowIso(), String(user)).run();
    if (!res.meta?.changes)
      return html(`<style>${S}</style><p>That coordinator email already has a group.</p><p><a href="/staff/groups">Back</a></p>`, 409);
    return new Response(null, { status: 303, headers: { location: '/staff/groups', 'cache-control': 'no-store' } });
  }
  if (method !== 'GET') return null;
  const groups = (await env.DB.prepare(
    `SELECT g.*, (SELECT COUNT(*) FROM study_group_members m WHERE m.group_id = g.id) AS members,
            (SELECT COUNT(*) FROM paper_sheets p WHERE p.group_id = g.id) AS sheets
     FROM study_groups g ORDER BY g.created_at`).all()).results ?? [];
  const rows = groups.map((g) => `<tr><td>${e(g.name)}</td><td>${e(g.country || '')}</td><td>${e(g.coordinator_email)}</td>
    <td>${e(title(courseOf(g)))}</td><td>${g.members}</td><td>${g.sheets}</td><td>${g.closed_at ? 'closed' : 'open'}</td></tr>`).join('');
  const courses = Object.entries(catalog.courses).map(([slug, c]) => `<option value="${slug}"${slug === 'ots' ? ' selected' : ''}>${e(c.title?.en || slug)}</option>`).join('');
  return html(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Study groups</title><style>${S}</style>
<h1>Study groups</h1><p><a href="/staff/students">Students</a></p>
<p>Each group's coordinator signs in at <b>/coord</b>. Their email must also be added to the Cloudflare Access
application for /coord (docs/coordinator-setup.md); adding it here alone does not let them in.</p>
${groups.length ? `<table><tr><th>Group</th><th>Country</th><th>Coordinator</th><th>Course</th><th>Learners</th><th>Sheets</th><th></th></tr>${rows}</table>` : '<p>No groups yet.</p>'}
<h2>New group</h2>
<form method="post" action="/staff/groups">
<p><label>Name<br><input name="name" required maxlength="120"></label></p>
<p><label>Country (code or name)<br><input name="country" maxlength="60"></label></p>
<p><label>Coordinator email<br><input name="coordinator_email" type="email" required maxlength="200"></label></p>
<p><label>Course<br><select name="course">${courses}</select></label></p>
<p><button>Create the group</button></p></form>`);
}
