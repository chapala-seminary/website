/* Chapala Theological Seminary — student records API.
 *
 * A plain fetch handler with no framework and no dependencies, so it runs
 * unchanged as a Pages Function, as a Worker with static assets, or in a test.
 *
 * Shape of the system, decided in claude/cms-and-student-records.md:
 *
 *   localStorage is primary.  It is instant, works offline, and is what every
 *   existing student already has.  This API mirrors it so that clearing a
 *   browser or picking up a different phone is no longer the end of a degree.
 *   If this API is down, the site keeps working exactly as it does today.
 *
 * Identity is a student code.  No email infrastructure, no passwords.  The
 * cost is that the code is a bearer credential: whoever holds it holds the
 * record.  That is why codes are 50 bits of entropy rather than a counter,
 * why a wrong code is never distinguished from a missing one, and why there
 * is a delete path.
 *
 * Merging is monotonic.  A unit passed on any device stays passed and keeps
 * its earliest completion time.  Nothing this API does can take progress away
 * from a student, which makes a stale or offline device harmless.
 */

import { courseShortfall, degreeShortfall, resolveCourse, DEGREES } from './awards.js';
import catalog from './catalog.json';
import { emailConfigured, sendEmail, verificationEmail } from './email.js';
import { notify, retryFailed } from './notify.js';

const MAX = { name: 120, email: 160, country: 80, track: 24, goal: 400, heard: 40, title: 200, course: 64, code: 40 };
const TRACKS = new Set(['cert', 'certificate', 'associate', 'thm', 'mdiv']);
const LEVELS = new Set(['course', 'certificate', 'associate', 'thm', 'mdiv']);

/* Crockford base32 without I, L, O and U: no character can be confused with
 * another when a student reads a code off one screen and types it into
 * another, and no four letters can accidentally spell anything. */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function newCode(len) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = '';
  for (const b of bytes) out += ALPHABET[b % 32];
  return out;
}
const studentCode = () => `CTS-${newCode(4)}-${newCode(4)}-${newCode(4)}`;   // 60 bits
const verifyCode = () => newCode(10);                                        // 50 bits

/* Students will type these with spaces, lower case, or the wrong dashes. */
function normaliseCode(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.toUpperCase().replace(/[^0-9A-Z]/g, '')
    .replace(/I/g, '1').replace(/L/g, '1').replace(/O/g, '0').replace(/U/g, 'V');
  const m = /^CTS([0-9A-Z]{12})$/.exec(s);
  return m ? `CTS-${m[1].slice(0, 4)}-${m[1].slice(4, 8)}-${m[1].slice(8)}` : null;
}
function normaliseVerify(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.toUpperCase().replace(/[^0-9A-Z]/g, '')
    .replace(/I/g, '1').replace(/L/g, '1').replace(/O/g, '0').replace(/U/g, 'V');
  return /^[0-9A-Z]{10}$/.test(s) ? s : null;
}

const now = () => new Date().toISOString();
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
const fail = (status, error) => json({ error }, status);

function str(v, max, { required = false, field = 'field' } = {}) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new HttpError(400, `${field} is required`);
    return null;
  }
  if (typeof v !== 'string') throw new HttpError(400, `${field} must be text`);
  const t = v.trim();
  if (!t && required) throw new HttpError(400, `${field} is required`);
  if (t.length > max) throw new HttpError(400, `${field} is longer than ${max} characters`);
  return t || null;
}
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function body(request) {
  if (!/^application\/json/.test(request.headers.get('content-type') || ''))
    throw new HttpError(415, 'send application/json');
  const text = await request.text();
  if (text.length > 512 * 1024) throw new HttpError(413, 'payload too large');
  try { return JSON.parse(text || '{}'); }
  catch { throw new HttpError(400, 'body is not valid JSON'); }
}

/* ---- reading and merging a student's state ------------------------------ */

async function loadState(env, id) {
  const student = await env.DB.prepare(
    'SELECT id, name, email, email_verified_at, country, track, goal, heard, created_at, updated_at FROM students WHERE id = ?')
    .bind(id).first();
  if (!student) return null;
  const [progress, completions, certs] = await Promise.all([
    env.DB.prepare('SELECT course, unit, completed_at FROM unit_progress WHERE student_id = ? ORDER BY course, unit').bind(id).all(),
    env.DB.prepare('SELECT code, track, completed_at FROM course_completions WHERE student_id = ? ORDER BY code').bind(id).all(),
    env.DB.prepare('SELECT verify_code, level, course, title, issued_at, revoked_at FROM certificates WHERE student_id = ? ORDER BY issued_at').bind(id).all(),
  ]);
  // Each completion carries the track it was earned on and the course name
  // the certificate page wrote, so a device restored from a code can rebuild
  // the lists the degree pages count (cts_mdiv_done_codes, cts_degree_courses)
  // and not only the gating list. The degrees are computed here once, by the
  // same rules that issue them, for the privacy page and the tracker.
  const done = (completions.results ?? []).map(r => ({
    code: r.code, track: r.track ?? null, name: catalog.completions[r.code]?.name ?? null, completed_at: r.completed_at,
  }));
  const degrees = {};
  for (const level of Object.keys(DEGREES)) degrees[level] = degreeShortfall(level, done, student.track) === null;
  return {
    student,
    progress: progress.results ?? [],
    doneCodes: done.map(d => d.code),
    completions: done,
    degrees,
    certificates: certs.results ?? [],
  };
}

/* A unit passed on any device stays passed, and keeps the earliest completion
 * time either side knows about. That is the whole conflict-resolution story,
 * and it is why an offline or stale device can never cost a student progress. */
function progressRows(id, raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Map();
  for (const p of raw.slice(0, 5000)) {
    if (!p || typeof p !== 'object') continue;
    const course = str(p.course, MAX.course, { field: 'course' });
    const unit = Number(p.unit);
    if (!course || !Number.isInteger(unit) || unit < 0 || unit > 200) continue;
    const at = typeof p.completedAt === 'string' && !Number.isNaN(Date.parse(p.completedAt))
      ? new Date(p.completedAt).toISOString() : now();
    const key = `${course}\u0000${unit}`;
    const prev = seen.get(key);
    if (!prev || at < prev.at) seen.set(key, { course, unit, at });
  }
  return [...seen.values()].map(v => [id, v.course, v.unit, v.at]);
}

/* doneCodes is the gating list every browser has kept; completionTracks is
 * {CODE: 'mdiv'|'thm'} from the master's lists the certificate pages keep
 * alongside it. A browser that sends the map knows its lists, so a code
 * missing from them was earned on the certificate track -- that is what the
 * lists mean. A browser that sends no map at all predates it (or the sync
 * client is older), and there the student's own track is the best answer. */
function completionRows(id, raw, tracks, studentTrack) {
  if (!Array.isArray(raw)) return [];
  const sent = tracks && typeof tracks === 'object';
  const t = sent ? tracks : {};
  const fallback = !sent && (studentTrack === 'thm' || studentTrack === 'mdiv') ? studentTrack : 'cert';
  const out = new Map();
  for (const c of raw.slice(0, 500)) {
    const code = str(c, MAX.code, { field: 'done code' });
    if (!code || !/^[A-Z0-9_]+$/i.test(code)) continue;
    const up = code.toUpperCase();
    const declared = String(t[up] ?? t[code] ?? '').toLowerCase();
    const track = declared === 'thm' || declared === 'mdiv' ? declared : fallback;
    out.set(up, [id, up, track, now()]);
  }
  return [...out.values()];
}

/* ---- routes -------------------------------------------------------------- */

async function register(request, env) {
  const b = await body(request);
  const name = str(b.name, MAX.name, { required: true, field: 'name' });
  const track = (str(b.track, MAX.track, { required: true, field: 'track' }) || '').toLowerCase();
  if (!TRACKS.has(track)) throw new HttpError(400, 'track must be one of: ' + [...TRACKS].join(', '));

  const t = now();
  // A collision at 60 bits is not going to happen, but a silent overwrite of
  // somebody's record if it did is not a risk worth carrying for three lines.
  for (let attempt = 0; attempt < 5; attempt++) {
    const id = studentCode();
    const res = await env.DB.prepare(
      `INSERT INTO students (id, name, email, country, track, goal, heard, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`)
      .bind(id, name, str(b.email, MAX.email, { field: 'email' }), str(b.country, MAX.country, { field: 'country' }),
        track, str(b.goal, MAX.goal, { field: 'goal' }), str(b.heard, MAX.heard, { field: 'heard' }), t, t).run();
    if (res.meta?.changes) return json({ code: id, student: (await loadState(env, id)).student }, 201);
  }
  throw new HttpError(503, 'could not allocate a student code, please try again');
}

async function sync(request, env) {
  const b = await body(request);
  const id = normaliseCode(b.code);
  if (!id) throw new HttpError(400, 'a student code is required');

  const exists = await env.DB.prepare(
    'SELECT id, name, email, email_verified_at, country, track, goal FROM students WHERE id = ?').bind(id).first();
  if (!exists) return fail(404, 'no record for that student code');

  const statements = [];
  const s = b.student;
  if (s && typeof s === 'object') {
    // Identity is last-writer-wins; progress is never overwritten. Renaming
    // yourself is something a student does on purpose, losing a passed unit
    // is not. The one exception is a VERIFIED email: only /api/email/confirm
    // changes it, so a stale device cannot swap it for an address nobody
    // confirmed.
    const name = str(s.name, MAX.name, { field: 'name' });
    const track = (str(s.track, MAX.track, { field: 'track' }) || '').toLowerCase() || null;
    if (track && !TRACKS.has(track)) throw new HttpError(400, 'unknown track: ' + track);
    statements.push(env.DB.prepare(
      `UPDATE students SET name = COALESCE(?, name),
         email = CASE WHEN email_verified_at IS NULL THEN COALESCE(?, email) ELSE email END,
         country = COALESCE(?, country), track = COALESCE(?, track),
         goal = COALESCE(?, goal), heard = COALESCE(?, heard), updated_at = ? WHERE id = ?`)
      .bind(name, str(s.email, MAX.email, { field: 'email' }), str(s.country, MAX.country, { field: 'country' }),
        track, str(s.goal, MAX.goal, { field: 'goal' }), str(s.heard, MAX.heard, { field: 'heard' }), now(), id));
  }

  for (const row of progressRows(id, b.progress))
    statements.push(env.DB.prepare(
      `INSERT INTO unit_progress (student_id, course, unit, completed_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, course, unit) DO UPDATE SET completed_at = MIN(completed_at, excluded.completed_at)`)
      .bind(...row));

  // The track of a completion is filled in once and never downgraded: a row
  // that arrived without one (before 0003_tracker, or from a browser with no
  // master's list) takes the first track any device reports for it.
  const trackNow = (s && typeof s === 'object' && String(s.track || '').toLowerCase()) || exists.track;
  const completions = completionRows(id, b.doneCodes, b.completionTracks, trackNow);
  // Which of these the record did not hold before this request: those are the
  // completions the seminary has not heard about, and the ones it is told of
  // below. Read before the batch, so a course re-reported from a second device
  // is not announced twice.
  const held = new Set(completions.length
    ? ((await env.DB.prepare('SELECT code FROM course_completions WHERE student_id = ?').bind(id).all()).results ?? []).map((r) => r.code)
    : []);
  for (const row of completions)
    statements.push(env.DB.prepare(
      `INSERT INTO course_completions (student_id, code, track, completed_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, code) DO UPDATE SET track = COALESCE(course_completions.track, excluded.track)`).bind(...row));

  if (statements.length) await env.DB.batch(statements);

  // The notice to the seminary, from the request that recorded the completion
  // (Wayne's audit item 5). One per course, kept in `notifications`; a failed
  // send is retried here on the student's next sync. Never fails the sync.
  const student = { ...exists, ...(s && typeof s === 'object' ? { name: str(s.name, MAX.name, { field: 'name' }) || exists.name } : {}) };
  const notices = [];
  for (const [, code, track] of completions)
    if (!held.has(code)) { const n = await notify(env, student, { kind: 'course', code, track }); if (n) notices.push(n); }
  notices.push(...await retryFailed(env, student));

  const state = await loadState(env, id);
  // The test configuration sends nothing; it is told what would have gone
  // out so the suite can check it. Never present in a deployed Worker.
  return json(env.EMAIL_MODE === 'log' && !env.RESEND_API_KEY ? { ...state, notifications: notices } : state);
}

async function hydrate(env, rawCode) {
  const id = normaliseCode(rawCode);
  // A malformed code and an unknown code get the same answer on purpose:
  // the difference would tell someone guessing that they were close.
  const state = id ? await loadState(env, id) : null;
  return state ? json(state) : fail(404, 'no record for that student code');
}

async function issueCertificate(request, env) {
  const b = await body(request);
  const id = normaliseCode(b.code);
  if (!id) throw new HttpError(400, 'a student code is required');
  const student = await env.DB.prepare(
    'SELECT id, name, email, email_verified_at, country, track, goal FROM students WHERE id = ?').bind(id).first();
  if (!student) return fail(404, 'no record for that student code');
  // Students start with only a code; a certificate needs a confirmed email,
  // so the seminary can reach the person it certified and send them a copy.
  if (!student.email_verified_at)
    return json({ error: 'a verified email is required for a certificate', needs: 'email' }, 403);

  const level = (str(b.level, 24, { required: true, field: 'level' }) || '').toLowerCase();
  if (!LEVELS.has(level)) throw new HttpError(400, 'level must be one of: ' + [...LEVELS].join(', '));
  let course = str(b.course, MAX.course, { required: level === 'course', field: 'course' });
  const title = str(b.title, MAX.title, { required: true, field: 'title' });

  // Grading is still client-side, so this cannot prove the work was done. It
  // can refuse an award the record does not support: every unit of the course
  // for a course certificate, the course counts and required courses for a
  // degree (worker/awards.js). A fabricated certificate therefore needs a
  // fabricated complete record first.
  if (level === 'course') {
    const c = resolveCourse(course);
    if (!c) throw new HttpError(400, 'unknown course: ' + course);
    // One stored name per course, so "ots" and "CTSOTS" are the same award.
    course = c.slug || c.code;
    if (c.units) {
      const rows = await env.DB.prepare(
        'SELECT unit FROM unit_progress WHERE student_id = ? AND course = ?').bind(id, c.slug).all();
      const why = courseShortfall(c.slug, (rows.results ?? []).map((r) => r.unit));
      if (why) return fail(409, why);
    } else {
      // A single-page course keeps no units; its completion code is the record.
      const row = await env.DB.prepare(
        'SELECT 1 FROM course_completions WHERE student_id = ? AND code = ?').bind(id, c.code).first();
      if (!row) return fail(409, 'course completion not recorded: ' + c.code);
    }
  } else {
    const rows = await env.DB.prepare(
      'SELECT code, track FROM course_completions WHERE student_id = ?').bind(id).all();
    const why = degreeShortfall(level, rows.results ?? [], student.track);
    if (why) return fail(409, why);
  }

  // Re-issuing the same award returns the same code rather than a second one,
  // so a student who prints their certificate twice does not end up with two
  // verification codes for one achievement.
  const existing = await env.DB.prepare(
    `SELECT verify_code FROM certificates
     WHERE student_id = ? AND level = ? AND COALESCE(course, '') = COALESCE(?, '') AND revoked_at IS NULL`)
    .bind(id, level, course).first();
  if (existing) return json({ verifyCode: existing.verify_code, reissued: true });

  for (let attempt = 0; attempt < 5; attempt++) {
    const vc = verifyCode();
    const res = await env.DB.prepare(
      `INSERT INTO certificates (verify_code, student_id, student_name, level, course, title, issued_at)
       VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(verify_code) DO NOTHING`)
      .bind(vc, id, student.name, level, course, title, now()).run();
    if (res.meta?.changes) {
      // The seminary hears of every award it issues, once (worker/notify.js).
      const n = await notify(env, student, { kind: 'certificate', code: vc, level, course, title });
      return json({ verifyCode: vc, reissued: false, ...(env.EMAIL_MODE === 'log' && !env.RESEND_API_KEY && n ? { notification: n } : {}) }, 201);
    }
  }
  throw new HttpError(503, 'could not allocate a verification code, please try again');
}

/* ---- email verification (needed to claim a certificate) ------------------
 *
 * POST /api/email/start   {code, email}         -> a 6-digit code is emailed
 * POST /api/email/confirm {code, verification}  -> the email is stored, verified
 *
 * Limits: one send a minute and five a day per student; five wrong guesses
 * per code, after which a new one must be asked for. The code is stored only
 * as a hash and expires in 15 minutes. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CHALLENGE = { ttlMin: 15, resendSec: 60, perDay: 5, attempts: 5 };

async function hashCode(id, code) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id + ':' + code));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function sixDigits() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, '0');
}

async function emailStart(request, env) {
  const b = await body(request);
  const id = normaliseCode(b.code);
  if (!id) return fail(404, 'no record for that student code');
  const email = (str(b.email, MAX.email, { required: true, field: 'email' }) || '').toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'that does not look like an email address');
  const student = await env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(id).first();
  if (!student) return fail(404, 'no record for that student code');
  if (!emailConfigured(env)) throw new HttpError(503, 'email is not set up yet');

  const t = new Date(), today = t.toISOString().slice(0, 10);
  const prev = await env.DB.prepare('SELECT sent_at, sends_today, sends_day FROM email_challenges WHERE student_id = ?').bind(id).first();
  if (prev) {
    const wait = CHALLENGE.resendSec - Math.floor((t - new Date(prev.sent_at)) / 1000);
    if (wait > 0) return json({ error: `wait ${wait} seconds before asking for another code` }, 429, { 'retry-after': String(wait) });
    if (prev.sends_day === today && prev.sends_today >= CHALLENGE.perDay)
      return json({ error: 'too many codes today. Try again tomorrow.' }, 429);
  }
  const sendsToday = prev && prev.sends_day === today ? prev.sends_today + 1 : 1;

  const code = sixDigits();
  const expires = new Date(t.getTime() + CHALLENGE.ttlMin * 60000).toISOString();
  await env.DB.prepare(
    `INSERT INTO email_challenges (student_id, email, code_hash, expires_at, attempts, sent_at, sends_today, sends_day)
     VALUES (?, ?, ?, ?, 0, ?, ?, ?)
     ON CONFLICT(student_id) DO UPDATE SET email = excluded.email, code_hash = excluded.code_hash,
       expires_at = excluded.expires_at, attempts = 0, sent_at = excluded.sent_at,
       sends_today = excluded.sends_today, sends_day = excluded.sends_day`)
    .bind(id, email, await hashCode(id, code), expires, t.toISOString(), sendsToday, today).run();

  try {
    const r = await sendEmail(env, { to: email, ...verificationEmail(code) });
    // The test configuration sends nothing; it gets the code back instead so
    // the suite can finish a verification. Never true in a deployed Worker.
    return json({ sent: true, ...(r.logged ? { devCode: code } : {}) });
  } catch (e) {
    await env.DB.prepare('DELETE FROM email_challenges WHERE student_id = ? AND code_hash = ?')
      .bind(id, await hashCode(id, code)).run();
    throw new HttpError(e.status || 502, e.message || 'the email could not be sent');
  }
}

async function emailConfirm(request, env) {
  const b = await body(request);
  const id = normaliseCode(b.code);
  if (!id) return fail(404, 'no record for that student code');
  const typed = String(b.verification ?? '').replace(/\D/g, '');
  if (typed.length !== 6) throw new HttpError(400, 'the verification code is 6 digits');
  const ch = await env.DB.prepare('SELECT * FROM email_challenges WHERE student_id = ?').bind(id).first();
  if (!ch) return fail(404, 'no verification is waiting for that student code');
  if (new Date(ch.expires_at) < new Date() || ch.attempts >= CHALLENGE.attempts) {
    await env.DB.prepare('UPDATE email_challenges SET expires_at = ? WHERE student_id = ?').bind(now(), id).run();
    return fail(410, 'that code has expired. Ask for a new one.');
  }
  if (await hashCode(id, typed) !== ch.code_hash) {
    await env.DB.prepare('UPDATE email_challenges SET attempts = attempts + 1 WHERE student_id = ?').bind(id).run();
    return fail(400, 'that code is not right');
  }
  const t = now();
  await env.DB.batch([
    env.DB.prepare('UPDATE students SET email = ?, email_verified_at = ?, updated_at = ? WHERE id = ?').bind(ch.email, t, t, id),
    env.DB.prepare('DELETE FROM email_challenges WHERE student_id = ?').bind(id),
    env.DB.prepare('DELETE FROM notifications WHERE student_id = ?').bind(id),
  ]);
  return json({ verified: true, email: ch.email });
}

async function lookupCertificate(env, raw) {
  const vc = normaliseVerify(raw);
  const row = vc ? await env.DB.prepare(
    `SELECT verify_code, student_name, level, course, title, issued_at, revoked_at
     FROM certificates WHERE verify_code = ?`).bind(vc).first() : null;
  return row || null;
}

async function deleteStudent(env, rawCode) {
  const id = normaliseCode(rawCode);
  if (!id) return fail(404, 'no record for that student code');
  const res = await env.DB.prepare('DELETE FROM students WHERE id = ?').bind(id).run();
  if (!res.meta?.changes) return fail(404, 'no record for that student code');
  // The foreign keys cascade, but D1 does not enable them by default, so the
  // dependent rows are removed explicitly rather than on trust.
  await env.DB.batch([
    env.DB.prepare('DELETE FROM unit_progress WHERE student_id = ?').bind(id),
    env.DB.prepare('DELETE FROM course_completions WHERE student_id = ?').bind(id),
    env.DB.prepare('DELETE FROM certificates WHERE student_id = ?').bind(id),
    env.DB.prepare('DELETE FROM email_challenges WHERE student_id = ?').bind(id),
    env.DB.prepare('DELETE FROM notifications WHERE student_id = ?').bind(id),
  ]);
  return json({ deleted: true });
}

/* ---- the public verification page ---------------------------------------- */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function verifyPage(cert, typed) {
  const ok = cert && !cert.revoked_at;
  const title = ok ? 'Certificate verified · Certificado verificado'
    : cert ? 'Certificate withdrawn · Certificado retirado'
      : 'No such certificate · Certificado no encontrado';
  const rows = ok ? `
      <dl>
        <dt>Awarded to · Otorgado a</dt><dd>${esc(cert.student_name)}</dd>
        <dt>Award · Reconocimiento</dt><dd>${esc(cert.title)}</dd>
        <dt>Issued · Emitido</dt><dd>${esc(cert.issued_at.slice(0, 10))}</dd>
        <dt>Code · Código</dt><dd class="code">${esc(cert.verify_code)}</dd>
      </dl>` : `
      <p class="muted">No certificate has been issued with the code
        <span class="code">${esc(typed || '')}</span>.
        <br><span lang="es">No se ha emitido ningún certificado con ese código.</span></p>`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} · Chapala Theological Seminary</title>
<style>
  :root{--ink:#2b2320;--muted:#6b615c;--line:#e2d8c8;--gold:#9c7c38;--oxblood:#6b2333;--ok:#1f6b3b}
  body{margin:0;background:#fbf6ea;color:var(--ink);font:16px/1.55 Georgia,"Times New Roman",serif}
  main{max-width:620px;margin:0 auto;padding:40px 20px}
  .card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:28px}
  h1{font-size:1.5rem;margin:0 0 4px;color:var(--oxblood)}
  .status{font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:18px}
  .ok{color:var(--ok)} .no{color:var(--oxblood)}
  dl{display:grid;grid-template-columns:auto 1fr;gap:8px 18px;margin:0}
  dt{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);align-self:center}
  dd{margin:0}
  .code{font-family:ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em}
  .muted{color:var(--muted)}
  footer{margin-top:22px;font-size:.82rem;color:var(--muted)}
  a{color:var(--gold)}
</style></head>
<body><main><div class="card">
  <div class="status ${ok ? 'ok' : 'no'}">${ok ? '✓ Verified · Verificado' : '· Not verified · No verificado'}</div>
  <h1>Chapala Theological Seminary</h1>
  ${rows}
  <footer>
    This page confirms that the seminary issued this certificate. Chapala
    Theological Seminary is not an accredited institution.
    <br><span lang="es">Esta página confirma que el seminario emitió este
    certificado. El Seminario Teológico de Chapala no es una institución
    acreditada.</span>
    <br><a href="/">chapalaseminary.org</a>
  </footer>
</div></main></body></html>`;
}

/* ---- dispatch ------------------------------------------------------------- */


/* ---- making a guessed code cost something -------------------------------- *
 *
 * A student code is a bearer credential: whoever holds it holds the record.
 * Sixty bits makes guessing one infeasible, but "infeasible" is an argument
 * about arithmetic, and arithmetic is not a defence on its own -- it says
 * nothing about somebody working through a list of codes leaked from a shared
 * computer, and it leaves the seminary with no way to notice.
 *
 * Cloudflare's own rate limiting is the first line, but on the free plan that
 * is one rule, matched on path, counted by address, over a ten-second window.
 * It stops a flood and nothing slower. And the rate-limiting BINDING, which
 * would be the natural thing to reach for, is not available to Pages
 * Functions. So the real guard is here.
 *
 * Only FAILURES are counted. Limiting every request would slow the students
 * this exists to protect -- a class finishing a unit together shares one
 * address -- while doing nothing extra to someone guessing, whose requests are
 * failures almost by definition.
 *
 * Registration is deliberately NOT throttled here. It is the one endpoint
 * where a burst from one address is the normal case: a room full of students
 * signing up together. The zone rule covers a flood of them, and a row per
 * registration is cheap; throttling it would lock out a classroom to make an
 * abuser's life slightly harder.
 */
const THROTTLE = { window: 600, limit: 20 };   // failed lookups per address per 10 minutes
const unix = () => Math.floor(Date.now() / 1000);

/* The address is never stored in the clear. This table would otherwise be a
   log of who used the site and when, which the seminary has no reason to keep
   and an attacker would very much like to read. */
async function bucketOf(request, kind) {
  const ip = request.headers.get('CF-Connecting-IP')
    || (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
    || 'unknown';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(kind + '\u0000' + ip));
  return [...new Uint8Array(digest).slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* Run something that can answer "no such record", and count it when it does.
   The check happens BEFORE the lookup, so a blocked address costs a row read
   and nothing else. */
async function guarded(request, env, kind, run) {
  let bucket;
  try { bucket = await bucketOf(request, kind); } catch { return await run(); }

  const since = unix() - THROTTLE.window;
  const seen = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM lookup_failures WHERE bucket = ? AND at >= ?').bind(bucket, since).first();
  if ((seen?.n || 0) >= THROTTLE.limit)
    return json({ error: 'too many attempts. Wait a few minutes and try again.' }, 429,
      { 'retry-after': String(THROTTLE.window) });

  const res = await run();
  if (res.status === 404) {
    const t = unix();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO lookup_failures (bucket, at) VALUES (?, ?)').bind(bucket, t),
      /* Pruned here rather than on a schedule. The rows are worthless once the
         window has passed, and a cron job is one more thing to deploy and then
         forget about until the table is enormous. */
      env.DB.prepare('DELETE FROM lookup_failures WHERE at < ?').bind(t - THROTTLE.window),
    ]);
  }
  return res;
}

export async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();

  try {
    if (!env?.DB) throw new HttpError(503, 'student records are not configured');

    if (path === '/api/register' && method === 'POST') return await register(request, env);
    if (path === '/api/sync' && method === 'POST')
      return await guarded(request, env, 'student', () => sync(request, env));

    let m;
    if ((m = /^\/api\/student\/([^/]+)$/.exec(path))) {
      if (method === 'GET')
        return await guarded(request, env, 'student', () => hydrate(env, decodeURIComponent(m[1])));
      /* Throttled too, and for a sharper reason than the others: a guessed
         code here does not read somebody's record, it destroys it. */
      if (method === 'DELETE')
        return await guarded(request, env, 'student', () => deleteStudent(env, decodeURIComponent(m[1])));
      return fail(405, 'method not allowed');
    }
    if (path === '/api/certificate' && method === 'POST') return await issueCertificate(request, env);
    if (path === '/api/email/start' && method === 'POST')
      return await guarded(request, env, 'student', () => emailStart(request, env));
    if (path === '/api/email/confirm' && method === 'POST')
      return await guarded(request, env, 'student', () => emailConfirm(request, env));
    // Public, static: the courses and the completion codes with their names,
    // for anyone reading the records (the student tracker turns codes into
    // course names with it). Nothing about any student is in it.
    if (path === '/api/catalog' && method === 'GET')
      return json(catalog, 200, { 'cache-control': 'public, max-age=3600' });

    if ((m = /^\/api\/verify\/([^/]+)$/.exec(path)) && method === 'GET') {
      return await guarded(request, env, 'verify', async () => {
        const cert = await lookupCertificate(env, decodeURIComponent(m[1]));
        return cert && !cert.revoked_at
          ? json({ valid: true, name: cert.student_name, title: cert.title, level: cert.level, course: cert.course, issued: cert.issued_at })
          : json({ valid: false }, cert ? 200 : 404);
      });
    }
    if ((m = /^\/verify\/([^/]+)$/.exec(path)) && method === 'GET') {
      return await guarded(request, env, 'verify', async () => {
      const typed = decodeURIComponent(m[1]);
      const cert = await lookupCertificate(env, typed);
      return new Response(verifyPage(cert, typed), {
        status: cert ? 200 : 404,
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
      });
      });
    }
    if (path === '/api/health') return json({ ok: true });

    return fail(404, 'no such endpoint');
  } catch (e) {
    if (e instanceof HttpError) return fail(e.status, e.message);
    // Never hand a database error back to a browser; it is the one place a
    // schema or a student's details could leak.
    console.error('student-records error', e && e.stack || e);
    return fail(500, 'something went wrong');
  }
}

export default { fetch: handle };
