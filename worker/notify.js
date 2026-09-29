/* Notices to the seminary: a course completed, a certificate issued.
 *
 * Sent from the Worker, in the same request that records the event, through
 * the one sending path the site has (worker/email.js, Resend), to the
 * seminary's mailbox. Every notice is a row in `notifications` first and an
 * email second: the row is what the student tracker reads, and a send that
 * fails is a row that says so and is retried on the student's next sync,
 * rather than a message nobody knows went missing.
 *
 * What the notice can honestly say: that the student's browser reported the
 * course complete and the seminary's record now holds it. Grading still
 * happens in the browser (claude/server-side-completion-plan.md); when the
 * Worker grades units itself this is where the wording changes.
 *
 * Config: NOTIFY_TO (wrangler.jsonc vars) -- where notices go. Falls back to
 * EMAIL_REPLY_TO, the seminary's inbox. Nothing is sent when email is not set
 * up; the row still records the attempt.
 */
import { emailConfigured, sendEmail } from './email.js';
import catalog from './catalog.json';

const MAX_ATTEMPTS = 5;
const now = () => new Date().toISOString();

function trackLabel(track, goal) {
  const t = String(track || '').toLowerCase();
  if (t === 'mdiv') return 'Master of Divinity (M.Div.)';
  if (t === 'thm' || t === 'mth') return 'Master of Theology (Th.M.)';
  if (String(goal || '').toLowerCase() === 'assoc' || t === 'ad' || t === 'associate') return 'Associate of Divinity';
  return 'Certificate of Ministry';
}

const LEVEL_NAMES = {
  certificate: 'Certificate of Ministry', associate: 'Associate of Divinity',
  thm: 'Master of Theology (Th.M.)', mdiv: 'Master of Divinity (M.Div.)',
};

/* The message for one notice. `student` is the row from `students`;
 * `ev` is { kind:'course', code, track } or { kind:'certificate', code (verify), level, course, title },
 * or an array of course events, for a batch (see notifyBatch). */
function message(student, ev) {
  if (Array.isArray(ev)) return batchMessage(student, ev);
  const name = student.name || '(no name)';
  const email = student.email ? student.email + (student.email_verified_at ? ' (verified)' : ' (not verified)') : '(none given)';
  const date = now().slice(0, 10);
  let subject, lines;
  if (ev.kind === 'course') {
    const course = catalog.completions[ev.code]?.name || ev.code;
    subject = `CTS completion: ${course} — ${name}`;
    lines = [
      `Name:    ${name}`,
      `Course:  ${course}`,
      `Track:   ${trackLabel(ev.track, student.goal)}`,
      `Date:    ${date}`,
      `Email:   ${email}`,
      `Country: ${student.country || '(none given)'}`,
      '',
      'Recorded by the seminary\'s records server when the student\'s browser',
      'reported the last unit of the course passed. The student code is not',
      'included in this notice; the record is in the students database.',
    ];
  } else {
    const award = ev.level === 'course'
      ? (ev.title || catalog.completions[String(ev.course || '').toUpperCase()]?.name || ev.course)
      : (LEVEL_NAMES[ev.level] || ev.level);
    subject = `CTS certificate issued: ${award} — ${name}`;
    lines = [
      `Name:         ${name}`,
      `Award:        ${award}`,
      `Level:        ${ev.level}`,
      `Date:         ${date}`,
      `Email:        ${email}`,
      `Verification: ${ev.code}  (chapalaseminary.org/verify/${ev.code})`,
      '',
      'Issued by the seminary\'s records server after checking that the',
      'student\'s record supports the award (every unit of the course, or the',
      'course counts a degree requires).',
    ];
  }
  return { subject, text: lines.join('\n') };
}

/* Several courses arriving in one request. That is a returning student's
 * first visit to the new site: everything they finished on the old one comes
 * up at once. One email lists them all -- twenty-two separate notices for one
 * student would bury the inbox, and at the cutover could run through the
 * sending service's daily allowance before the day's real completions. */
function batchMessage(student, evs) {
  const name = student.name || '(no name)';
  const email = student.email ? student.email + (student.email_verified_at ? ' (verified)' : ' (not verified)') : '(none given)';
  const courses = evs.map((e) => `  - ${catalog.completions[e.code]?.name || e.code}  [${trackLabel(e.track, student.goal)}]`);
  return {
    subject: `CTS completions: ${evs.length} courses — ${name}`,
    text: [
      `Name:     ${name}`,
      `Program:  ${trackLabel(student.track, student.goal)}`,
      `Email:    ${email}`,
      `Country:  ${student.country || '(none given)'}`,
      `Arrived:  ${now().slice(0, 10)}`,
      '',
      `${evs.length} completed courses reached the seminary's records together:`,
      ...courses,
      '',
      'Courses arrive together like this when a student\'s browser reaches the',
      'records for the first time -- most were finished earlier, on the old',
      'site, so the date above is when they arrived, not when they were done.',
      'The student code is not included in this notice; the record is in the',
      'students database.',
    ].join('\n'),
  };
}

async function attempt(env, student, ev, row) {
  const t = now();
  let status = 'sent', error = null;
  try {
    if (!emailConfigured(env)) throw new Error('email is not configured');
    const to = env.NOTIFY_TO || env.EMAIL_REPLY_TO;
    if (!to) throw new Error('NOTIFY_TO is not set');
    await sendEmail(env, { to, ...message(student, ev) });
  } catch (e) {
    status = 'failed'; error = String(e && e.message || e).slice(0, 300);
  }
  if (row) {
    await env.DB.prepare(
      'UPDATE notifications SET status = ?, attempts = attempts + 1, error = ?, sent_at = ? WHERE id = ?')
      .bind(status, error, status === 'sent' ? t : null, row.id).run();
  } else {
    await env.DB.prepare(
      `INSERT INTO notifications (student_id, kind, code, status, attempts, error, created_at, sent_at)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?) ON CONFLICT(student_id, kind, code) DO NOTHING`)
      .bind(student.id, ev.kind, ev.code, status, error, t, status === 'sent' ? t : null).run();
  }
  return { kind: ev.kind, code: ev.code, status, ...(error ? { error } : {}) };
}

/** Course completions that arrived together. One or none new: the ordinary
 *  notice. Two or more: one email for all of them, and a row per course, so
 *  each course is still notified exactly once. Never throws. */
export async function notifyBatch(env, student, evs) {
  try {
    const fresh = [];
    for (const ev of evs) {
      const seen = await env.DB.prepare(
        'SELECT id FROM notifications WHERE student_id = ? AND kind = ? AND code = ?')
        .bind(student.id, ev.kind, ev.code).first();
      if (!seen) fresh.push(ev);
    }
    if (fresh.length < 2) return (await Promise.all(fresh.map((ev) => notify(env, student, ev)))).filter(Boolean);
    return await attemptBatch(env, student, fresh, null);
  } catch (e) {
    console.error('notification error', e);
    return evs.map((ev) => ({ kind: ev.kind, code: ev.code, status: 'failed', error: String(e && e.message || e) }));
  }
}

async function attemptBatch(env, student, evs, rows) {
  const t = now();
  let status = 'sent', error = null;
  try {
    if (!emailConfigured(env)) throw new Error('email is not configured');
    const to = env.NOTIFY_TO || env.EMAIL_REPLY_TO;
    if (!to) throw new Error('NOTIFY_TO is not set');
    await sendEmail(env, { to, ...message(student, evs) });
  } catch (e) {
    status = 'failed'; error = String(e && e.message || e).slice(0, 300);
  }
  await env.DB.batch(evs.map((ev, i) => rows
    ? env.DB.prepare('UPDATE notifications SET status = ?, attempts = attempts + 1, error = ?, sent_at = ? WHERE id = ?')
      .bind(status, error, status === 'sent' ? t : null, rows[i].id)
    : env.DB.prepare(
      `INSERT INTO notifications (student_id, kind, code, status, attempts, error, created_at, sent_at)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?) ON CONFLICT(student_id, kind, code) DO NOTHING`)
      .bind(student.id, ev.kind, ev.code, status, error, t, status === 'sent' ? t : null)));
  return evs.map((ev) => ({ kind: ev.kind, code: ev.code, status, batch: evs.length, ...(error ? { error } : {}) }));
}

/** Notify once for an event this student has not been notified for.
 *  Never throws: a notice must not fail the request that records the event. */
export async function notify(env, student, ev) {
  try {
    const seen = await env.DB.prepare(
      'SELECT id FROM notifications WHERE student_id = ? AND kind = ? AND code = ?')
      .bind(student.id, ev.kind, ev.code).first();
    if (seen) return null;
    return await attempt(env, student, ev, null);
  } catch (e) {
    console.error('notification error', e);
    return { kind: ev.kind, code: ev.code, status: 'failed', error: String(e && e.message || e) };
  }
}

/** Retry this student's failed notices, a few at a time, on their next sync.
 *  Returns what it retried. The certificate details a retry needs are looked
 *  up again from the tables, so a row is enough to rebuild the message. */
export async function retryFailed(env, student) {
  const out = [];
  try {
    const all = (await env.DB.prepare(
      `SELECT id, kind, code FROM notifications
       WHERE student_id = ? AND status = 'failed' AND attempts < ? ORDER BY created_at LIMIT 200`)
      .bind(student.id, MAX_ATTEMPTS).all()).results ?? [];
    // Failed course notices go again the way they first went: several
    // together as one email, so a batch that failed is not retried as a flood.
    const courses = all.filter((r) => r.kind === 'course');
    if (courses.length >= 2) {
      const evs = [];
      for (const r of courses) {
        const c = await env.DB.prepare('SELECT track FROM course_completions WHERE student_id = ? AND code = ?')
          .bind(student.id, r.code).first();
        evs.push({ kind: 'course', code: r.code, track: c?.track || student.track });
      }
      out.push(...await attemptBatch(env, student, evs, courses));
    }
    const rows = (courses.length >= 2 ? all.filter((r) => r.kind !== 'course') : all).slice(0, 5);
    for (const row of rows) {
      let ev = null;
      if (row.kind === 'course') {
        const c = await env.DB.prepare('SELECT track FROM course_completions WHERE student_id = ? AND code = ?')
          .bind(student.id, row.code).first();
        ev = { kind: 'course', code: row.code, track: c?.track || student.track };
      } else {
        const c = await env.DB.prepare('SELECT level, course, title FROM certificates WHERE verify_code = ?')
          .bind(row.code).first();
        if (c) ev = { kind: 'certificate', code: row.code, level: c.level, course: c.course, title: c.title };
      }
      if (ev) out.push(await attempt(env, student, ev, row));
    }
  } catch (e) {
    console.error('notification retry error', e);
  }
  return out;
}
