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

const MAX = { name: 120, email: 160, country: 80, track: 24, goal: 400, title: 200, course: 64, code: 40 };
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
    'SELECT id, name, email, country, track, goal, created_at, updated_at FROM students WHERE id = ?')
    .bind(id).first();
  if (!student) return null;
  const [progress, completions, certs] = await Promise.all([
    env.DB.prepare('SELECT course, unit, completed_at FROM unit_progress WHERE student_id = ? ORDER BY course, unit').bind(id).all(),
    env.DB.prepare('SELECT code, completed_at FROM course_completions WHERE student_id = ? ORDER BY code').bind(id).all(),
    env.DB.prepare('SELECT verify_code, level, course, title, issued_at, revoked_at FROM certificates WHERE student_id = ? ORDER BY issued_at').bind(id).all(),
  ]);
  return {
    student,
    progress: progress.results ?? [],
    doneCodes: (completions.results ?? []).map(r => r.code),
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

function completionRows(id, raw) {
  if (!Array.isArray(raw)) return [];
  const out = new Map();
  for (const c of raw.slice(0, 500)) {
    const code = str(c, MAX.code, { field: 'done code' });
    if (code && /^[A-Z0-9_]+$/i.test(code)) out.set(code.toUpperCase(), [id, code.toUpperCase(), now()]);
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
      `INSERT INTO students (id, name, email, country, track, goal, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`)
      .bind(id, name, str(b.email, MAX.email, { field: 'email' }), str(b.country, MAX.country, { field: 'country' }),
        track, str(b.goal, MAX.goal, { field: 'goal' }), t, t).run();
    if (res.meta?.changes) return json({ code: id, student: (await loadState(env, id)).student }, 201);
  }
  throw new HttpError(503, 'could not allocate a student code, please try again');
}

async function sync(request, env) {
  const b = await body(request);
  const id = normaliseCode(b.code);
  if (!id) throw new HttpError(400, 'a student code is required');

  const exists = await env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(id).first();
  if (!exists) return fail(404, 'no record for that student code');

  const statements = [];
  const s = b.student;
  if (s && typeof s === 'object') {
    // Identity is last-writer-wins; progress is never overwritten. Renaming
    // yourself is something a student does on purpose, losing a passed unit
    // is not.
    const name = str(s.name, MAX.name, { field: 'name' });
    const track = (str(s.track, MAX.track, { field: 'track' }) || '').toLowerCase() || null;
    if (track && !TRACKS.has(track)) throw new HttpError(400, 'unknown track: ' + track);
    statements.push(env.DB.prepare(
      `UPDATE students SET name = COALESCE(?, name), email = COALESCE(?, email),
         country = COALESCE(?, country), track = COALESCE(?, track),
         goal = COALESCE(?, goal), updated_at = ? WHERE id = ?`)
      .bind(name, str(s.email, MAX.email, { field: 'email' }), str(s.country, MAX.country, { field: 'country' }),
        track, str(s.goal, MAX.goal, { field: 'goal' }), now(), id));
  }

  for (const row of progressRows(id, b.progress))
    statements.push(env.DB.prepare(
      `INSERT INTO unit_progress (student_id, course, unit, completed_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, course, unit) DO UPDATE SET completed_at = MIN(completed_at, excluded.completed_at)`)
      .bind(...row));

  for (const row of completionRows(id, b.doneCodes))
    statements.push(env.DB.prepare(
      `INSERT INTO course_completions (student_id, code, completed_at) VALUES (?, ?, ?)
       ON CONFLICT(student_id, code) DO NOTHING`).bind(...row));

  if (statements.length) await env.DB.batch(statements);
  return json(await loadState(env, id));
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
  const student = await env.DB.prepare('SELECT id, name FROM students WHERE id = ?').bind(id).first();
  if (!student) return fail(404, 'no record for that student code');

  const level = (str(b.level, 24, { required: true, field: 'level' }) || '').toLowerCase();
  if (!LEVELS.has(level)) throw new HttpError(400, 'level must be one of: ' + [...LEVELS].join(', '));
  const course = str(b.course, MAX.course, { required: level === 'course', field: 'course' });
  const title = str(b.title, MAX.title, { required: true, field: 'title' });

  // Grading is still client-side, so this cannot prove the work was done. It
  // can refuse to mint a certificate for a course with no recorded progress,
  // which means a fabricated certificate needs fabricated progress first.
  if (level === 'course') {
    const seen = await env.DB.prepare(
      'SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = ? AND course = ?').bind(id, course).first();
    if (!seen?.n) return fail(409, 'no recorded progress for that course');
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
    if (res.meta?.changes) return json({ verifyCode: vc, reissued: false }, 201);
  }
  throw new HttpError(503, 'could not allocate a verification code, please try again');
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

export async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();

  try {
    if (!env?.DB) throw new HttpError(503, 'student records are not configured');

    if (path === '/api/register' && method === 'POST') return await register(request, env);
    if (path === '/api/sync' && method === 'POST') return await sync(request, env);

    let m;
    if ((m = /^\/api\/student\/([^/]+)$/.exec(path))) {
      if (method === 'GET') return await hydrate(env, decodeURIComponent(m[1]));
      if (method === 'DELETE') return await deleteStudent(env, decodeURIComponent(m[1]));
      return fail(405, 'method not allowed');
    }
    if (path === '/api/certificate' && method === 'POST') return await issueCertificate(request, env);

    if ((m = /^\/api\/verify\/([^/]+)$/.exec(path)) && method === 'GET') {
      const cert = await lookupCertificate(env, decodeURIComponent(m[1]));
      return cert && !cert.revoked_at
        ? json({ valid: true, name: cert.student_name, title: cert.title, level: cert.level, course: cert.course, issued: cert.issued_at })
        : json({ valid: false }, cert ? 200 : 404);
    }
    if ((m = /^\/verify\/([^/]+)$/.exec(path)) && method === 'GET') {
      const typed = decodeURIComponent(m[1]);
      const cert = await lookupCertificate(env, typed);
      return new Response(verifyPage(cert, typed), {
        status: cert ? 200 : 404,
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
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
