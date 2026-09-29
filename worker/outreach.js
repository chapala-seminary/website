/* Keeping students going (Wayne, 27 Sept 2026).
 *
 * "If a student goes about three weeks without making progress, we can
 * identify that and send a short, personal note of encouragement, also asking
 * whether they have encountered a problem with the website or courses. The
 * idea is not to pressure students, but to let them know that there are real
 * people behind the seminary who notice their progress and care whether they
 * succeed."
 *
 * Once a day (wrangler.jsonc, triggers.crons) the Worker looks for:
 *
 *   quiet        no unit passed and no course completed for 21 days, program
 *                not finished. One note per quiet spell: a student who stays
 *                quiet after it is not written to again until they have made
 *                some progress and gone quiet a second time. The weekly
 *                summary lists anyone still quiet six weeks after a note, for
 *                Wayne to write to himself if he wants to.
 *   not_started  registered 7 days ago or more, not one unit passed. Once.
 *
 * and writes to each in the language they read the site in (both languages
 * when it is not known). Every note says how to stop them; the link leads to
 * a page with a button, because mail scanners open links on their own and a
 * link that acted on its own would unsubscribe students nobody asked about.
 *
 * On Mondays it also sends the seminary a summary of the week (digest()).
 *
 * Nobody is written to who has no email, who asked not to be, whose program is
 * finished, or who is the placeholder account tester mode creates. At most
 * DAILY_CAP notes go out in a day: the sending service allows 100 emails a day
 * on its free plan, and completion notices must still get through.
 *
 * Config (wrangler.jsonc vars):
 *   OUTREACH_MODE      "send" writes to students; anything else (or unset)
 *                      writes to nobody -- the run still works out who it
 *                      would write to, for the staff page's preview.
 *   OUTREACH_FROM      sender, e.g. "Wayne Cook at Chapala Theological Seminary <...>" (no
 *                      comma: an unquoted comma splits an address in two);
 *                      falls back to EMAIL_FROM
 *   OUTREACH_REPLY_TO  where a student's reply goes; falls back to EMAIL_REPLY_TO
 *   SITE_ORIGIN        links in the notes; falls back to https://chapalaseminary.org
 */
import { emailConfigured, sendEmail } from './email.js';
import { degreeShortfall } from './awards.js';
import catalog from './catalog.json';

export const QUIET_DAYS = 21;
export const NOT_STARTED_DAYS = 7;
export const FOLLOW_UP_DAYS = 42;          // still quiet this long after a note: listed for Wayne
const DAILY_CAP = 40;
const DAY = 86400000;
const TESTER_EMAIL = 'tester@chapalaseminary.org';

const origin = (env) => (env.SITE_ORIGIN || 'https://chapalaseminary.org').replace(/\/+$/, '');

/* The program a student is working toward, as a degree level awards.js knows. */
export function programLevel(track, goal) {
  const t = String(track || '').toLowerCase();
  if (t === 'mdiv') return 'mdiv';
  if (t === 'thm' || t === 'mth') return 'thm';
  if (String(goal || '').toLowerCase() === 'assoc' || t === 'associate') return 'associate';
  return 'certificate';
}
export const PROGRAM_NAMES = {
  certificate: { en: 'Certificate of Ministry', es: 'Certificado de Ministerio' },
  associate: { en: 'Associate of Divinity', es: 'Asociado en Divinidad' },
  thm: { en: 'Master of Theology (Th.M.)', es: 'Maestría en Teología (Th.M.)' },
  mdiv: { en: 'Master of Divinity (M.Div.)', es: 'Maestría en Divinidad (M.Div.)' },
};

/* "1peter 3" (student_activity.last_unit) -> the course's name and the page to
 * go on with: the next unit, or the course's first page if that was the last. */
export function whereTheyWere(lastUnit, lang) {
  const m = /^(\S+) (\d+)$/.exec(String(lastUnit || ''));
  const c = m && catalog.courses[m[1]];
  if (!c) return null;
  const n = +m[2];
  const name = c.title?.[lang === 'es' ? 'es' : 'en'] || catalog.completions[c.code]?.name?.replace(/\s*\|\s*$/, '') || m[1];
  const next = c.units.find((u) => u > n);
  return { course: name, unit: n, page: `${c.pages}Unit${next ?? c.units[0]}.html`, finished: next === undefined };
}

const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || '';

/* The notes themselves. Plain text, short, in the student's language; both
 * languages, English first, when the language is not known. */
export function note(kind, st, { stopUrl, site }) {
  const where = whereTheyWere(st.last_unit, 'en');
  const donde = whereTheyWere(st.last_unit, 'es');
  const go = where && !where.finished ? `${site}/${where.page}` : `${site}/index.html#catalog`;
  const n = firstName(st.name);
  const en = kind === 'quiet' ? [
    `Dear ${n},`,
    '',
    where
      ? `It has been a few weeks since your last unit (${where.course}, Unit ${where.unit}), so I wanted to check in with you.`
      : 'It has been a few weeks since you last made progress in your courses, so I wanted to check in with you.',
    'There is no deadline and no pressure. Whenever you are ready, you can pick up exactly where you left off:',
    '',
    `  ${go}`,
    '',
    'If something on the website got in your way -- a page that would not open, a test that would not grade, a course that stayed locked -- please reply to this email and tell me. We read every reply, and it helps us fix the site for everyone.',
  ] : [
    `Dear ${n},`,
    '',
    'Thank you for registering with Chapala Theological Seminary. I wanted to make sure you were able to get started.',
    'Most students begin with Old Testament Survey, one of the seven foundation courses:',
    '',
    `  ${site}/CTSUnit1.html`,
    '',
    'If something got in your way -- the site would not load, a course was locked, you were not sure where to begin -- please reply to this email and tell me. We read every reply.',
  ];
  const es = kind === 'quiet' ? [
    `Estimado/a ${n}:`,
    '',
    donde
      ? `Han pasado algunas semanas desde su última unidad (${donde.course}, Unidad ${donde.unit}), y quería saber cómo está.`
      : 'Han pasado algunas semanas desde su último avance en los cursos, y quería saber cómo está.',
    'No hay fecha límite ni prisa. Cuando esté listo/a, puede continuar exactamente donde se quedó:',
    '',
    `  ${go}`,
    '',
    'Si algo en el sitio le impidió avanzar -- una página que no abría, un examen que no se calificaba, un curso que seguía bloqueado --, por favor responda a este correo y cuéntenos. Leemos cada respuesta, y nos ayuda a mejorar el sitio para todos.',
  ] : [
    `Estimado/a ${n}:`,
    '',
    'Gracias por inscribirse en el Seminario Teológico de Chapala. Quería asegurarme de que pudo comenzar.',
    'La mayoría de los estudiantes empiezan con Panorama del Antiguo Testamento, uno de los siete cursos de fundamento:',
    '',
    `  ${site}/CTSUnit1.html`,
    '',
    'Si algo le impidió comenzar -- el sitio no cargaba, un curso estaba bloqueado, no sabía por dónde empezar --, por favor responda a este correo y cuéntenos. Leemos cada respuesta.',
  ];
  const sign = { en: ['', 'With warm regards,', 'Wayne Cook', 'Chapala Theological Seminary'],
                 es: ['', 'Con un cordial saludo,', 'Wayne Cook', 'Seminario Teológico de Chapala'] };
  const stop = {
    en: ['', '--', `You are receiving this because you registered at ${site.replace(/^https?:\/\//, '')}. To stop notes about your progress: ${stopUrl}`],
    es: ['', '--', `Recibe este mensaje porque se inscribió en ${site.replace(/^https?:\/\//, '')}. Para no recibir más mensajes sobre su progreso: ${stopUrl}`],
  };
  const subject = kind === 'quiet'
    ? { en: 'How is your study going?', es: '¿Cómo van sus estudios?' }
    : { en: 'Getting started at Chapala Theological Seminary', es: 'Para comenzar en el Seminario Teológico de Chapala' };
  if (st.lang === 'es') return { subject: subject.es, text: [...es, ...sign.es, ...stop.es].join('\n') };
  if (st.lang === 'en') return { subject: subject.en, text: [...en, ...sign.en, ...stop.en].join('\n') };
  return {
    subject: `${subject.en} · ${subject.es}`,
    text: [...en, ...sign.en, '', '----', '', ...es, ...sign.es, ...stop.en, stop.es[2]].join('\n'),
  };
}

/* Who would be written to today, and why. Pure reading: nothing is sent or
 * recorded here, so the staff page can show it as a preview. */
export async function candidates(env, asOf = new Date()) {
  const t = asOf.getTime();
  const iso = (ms) => new Date(ms).toISOString();
  const rows = (await env.DB.prepare(
    `SELECT a.*, (SELECT MAX(o.sent_at) FROM outreach o WHERE o.student_id = a.student_id AND o.kind = 'quiet') AS last_quiet_note,
            (SELECT COUNT(*) FROM outreach o WHERE o.student_id = a.student_id AND o.kind = 'not_started') AS not_started_notes
     FROM student_activity a
     WHERE a.email IS NOT NULL AND a.email <> '' AND a.contact_opt_out_at IS NULL AND lower(a.email) <> ?
       AND a.last_progress_at <= ?`)
    .bind(TESTER_EMAIL, iso(t - NOT_STARTED_DAYS * DAY)).all()).results ?? [];
  const out = [];
  for (const st of rows) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(st.email)) continue;
    const started = st.units_passed > 0 || st.courses_done > 0;
    if (!started) {
      if (st.not_started_notes === 0 && st.created_at <= iso(t - NOT_STARTED_DAYS * DAY)) out.push({ kind: 'not_started', st });
      continue;
    }
    if (st.last_progress_at > iso(t - QUIET_DAYS * DAY)) continue;
    if (st.last_quiet_note && st.last_quiet_note >= st.last_progress_at) continue;      // already written to this spell
    const done = (await env.DB.prepare('SELECT code, track FROM course_completions WHERE student_id = ?')
      .bind(st.student_id).all()).results ?? [];
    if (degreeShortfall(programLevel(st.track, st.goal), done, st.track) === null) continue;   // program finished
    out.push({ kind: 'quiet', st });
  }
  return out;
}

async function contactToken(env, studentId) {
  const have = await env.DB.prepare('SELECT token FROM contact_tokens WHERE student_id = ?').bind(studentId).first();
  if (have) return have.token;
  const b = crypto.getRandomValues(new Uint8Array(18));
  const token = btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  await env.DB.prepare('INSERT INTO contact_tokens (token, student_id) VALUES (?, ?) ON CONFLICT(student_id) DO NOTHING')
    .bind(token, studentId).run();
  return (await env.DB.prepare('SELECT token FROM contact_tokens WHERE student_id = ?').bind(studentId).first()).token;
}

/* The daily run. Returns what it did (or, when not sending, would do). */
export async function runOutreach(env, { asOf = new Date(), send = env.OUTREACH_MODE === 'send' } = {}) {
  const list = await candidates(env, asOf);
  const site = origin(env);
  const results = [];
  for (const { kind, st } of list.slice(0, DAILY_CAP)) {
    const r = { kind, student: st.name, email: st.email, lang: st.lang || 'both' };
    if (!send) { results.push({ ...r, status: 'preview' }); continue; }
    const stopUrl = `${site}/stop-notes/${await contactToken(env, st.student_id)}`;
    let status = 'sent', error = null, msg = null;
    try {
      if (!emailConfigured(env)) throw new Error('email is not configured');
      msg = note(kind, st, { stopUrl, site });
      await sendEmail({ ...env, EMAIL_FROM: env.OUTREACH_FROM || env.EMAIL_FROM,
                        EMAIL_REPLY_TO: env.OUTREACH_REPLY_TO || env.EMAIL_REPLY_TO }, { to: st.email, ...msg });
    } catch (e) {
      status = 'failed'; error = String(e && e.message || e).slice(0, 300);
    }
    await env.DB.prepare('INSERT INTO outreach (student_id, kind, status, error, sent_at) VALUES (?, ?, ?, ?, ?)')
      .bind(st.student_id, kind, status, error, asOf.toISOString()).run();
    // The test configuration sends nothing; it is shown what would have gone.
    const shown = env.EMAIL_MODE === 'log' && !env.RESEND_API_KEY && msg ? { message: msg } : {};
    results.push({ ...r, status, ...(error ? { error } : {}), ...shown });
  }
  return { considered: list.length, capped: Math.max(0, list.length - DAILY_CAP), results };
}

/* The seminary's weekly summary: who was written to, who is still quiet after
 * a note, who registered, what was finished, what failed. */
export async function digest(env, asOf = new Date()) {
  const since = new Date(asOf.getTime() - 7 * DAY).toISOString();
  const q = async (sql, ...b) => (await env.DB.prepare(sql).bind(...b).all()).results ?? [];
  const notes = await q(`SELECT o.kind, o.status, o.error, o.sent_at, s.name, s.email, s.lang FROM outreach o
    JOIN students s ON s.id = o.student_id WHERE o.sent_at >= ? ORDER BY o.sent_at`, since);
  const stillQuiet = await q(`SELECT a.name, a.email, a.last_progress_at, a.last_contacted_at FROM student_activity a
    WHERE a.contact_opt_out_at IS NULL AND a.last_contacted_at IS NOT NULL AND a.last_contacted_at >= a.last_progress_at
      AND a.last_contacted_at <= ? ORDER BY a.last_progress_at`,
    new Date(asOf.getTime() - (FOLLOW_UP_DAYS - QUIET_DAYS) * DAY).toISOString());
  const joined = await q(`SELECT name, email, country, track, goal, lang FROM students WHERE created_at >= ? AND lower(COALESCE(email, '')) <> ? ORDER BY created_at`, since, TESTER_EMAIL);
  const finished = await q(`SELECT s.name, c.code FROM course_completions c JOIN students s ON s.id = c.student_id
    WHERE c.completed_at >= ? ORDER BY s.name, c.code`, since);
  const failedNotices = await q(`SELECT n.kind, n.code, n.error, s.name FROM notifications n JOIN students s ON s.id = n.student_id
    WHERE n.status = 'failed'`);
  const [{ n: total } = { n: 0 }] = await q(`SELECT COUNT(*) AS n FROM students WHERE lower(COALESCE(email, '')) <> ?`, TESTER_EMAIL);
  const [{ n: active } = { n: 0 }] = await q(`SELECT COUNT(*) AS n FROM student_activity WHERE last_progress_at >= ? AND lower(COALESCE(email, '')) <> ?`,
    new Date(asOf.getTime() - QUIET_DAYS * DAY).toISOString(), TESTER_EMAIL);

  const day = (s) => String(s || '').slice(0, 10);
  const courseName = (code) => (catalog.completions[code]?.name || code).replace(/\s*\|\s*$/, '');
  const byStudent = {};
  for (const f of finished) (byStudent[f.name] ??= []).push(courseName(f.code));
  const KIND = { quiet: 'quiet 3 weeks', not_started: 'not started after a week' };
  const lines = [
    `The week to ${day(asOf.toISOString())}`,
    `${total} students; ${active} made progress in the last ${QUIET_DAYS} days.`,
    '',
    `NOTES SENT TO STUDENTS (${notes.length})`,
    ...(notes.length ? notes.map((n) => `  ${day(n.sent_at)}  ${n.name} <${n.email}>  ${KIND[n.kind] || n.kind}, ${n.lang || 'both languages'}` +
      (n.status === 'sent' ? '' : `  -- NOT SENT: ${n.error}`)) : ['  none']),
    '',
    `STILL QUIET ${FOLLOW_UP_DAYS / 7} WEEKS AFTER A NOTE (${stillQuiet.length}) -- worth a personal word`,
    ...(stillQuiet.length ? stillQuiet.map((s) => `  ${s.name} <${s.email}>  last progress ${day(s.last_progress_at)}, note ${day(s.last_contacted_at)}`) : ['  none']),
    '',
    `NEW STUDENTS (${joined.length})`,
    ...(joined.length ? joined.map((s) => `  ${s.name} <${s.email || 'no email'}>  ${PROGRAM_NAMES[programLevel(s.track, s.goal)].en}, ${s.country || 'country not given'}`) : ['  none']),
    '',
    `COURSES COMPLETED (${finished.length})`,
    ...(finished.length ? Object.entries(byStudent).map(([n, cs]) => `  ${n}: ${cs.join(', ')}`) : ['  none']),
    ...(failedNotices.length ? ['', `NOTICES THAT FAILED TO SEND (${failedNotices.length})`,
      ...failedNotices.map((f) => `  ${f.name}: ${f.kind} ${f.code} -- ${f.error}`)] : []),
    '',
    `The full roster: ${origin(env)}/staff/students`,
  ];
  return { subject: `CTS weekly summary: ${notes.length} notes, ${joined.length} new, ${finished.length} completions`, text: lines.join('\n') };
}

export async function sendDigest(env, asOf = new Date()) {
  const to = env.NOTIFY_TO || env.EMAIL_REPLY_TO;
  if (!to || !emailConfigured(env)) return { status: 'skipped', why: 'email is not configured' };
  const msg = await digest(env, asOf);
  await sendEmail(env, { to, ...msg });
  return { status: 'sent', subject: msg.subject };
}

/* The Worker's scheduled run: notes every day, the summary on Mondays. */
export async function scheduled(event, env) {
  const asOf = new Date(event.scheduledTime || Date.now());
  try { console.log('outreach', JSON.stringify(await runOutreach(env, { asOf }))); }
  catch (e) { console.error('outreach error', e && e.stack || e); }
  if (asOf.getUTCDay() === 1) {
    try { console.log('digest', JSON.stringify(await sendDigest(env, asOf))); }
    catch (e) { console.error('digest error', e && e.stack || e); }
  }
}

/* ---- "don't write to me about my progress" --------------------------------- */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function page(title, body) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>body{font-family:Georgia,serif;background:#f6f1f4;color:#3a2233;margin:0;padding:40px 16px}
main{max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7d8e4;border-radius:10px;padding:28px}
h1{color:#4A1E3A;font-size:1.4rem;margin:0 0 12px}p{line-height:1.6}
button{background:#4A1E3A;color:#fff;border:0;border-radius:24px;padding:11px 22px;font:bold 1rem Georgia,serif;cursor:pointer}
.es{margin-top:22px;padding-top:18px;border-top:1px solid #eee}</style></head>
<body><main>${body}</main></body></html>`, {
    status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

export async function stopNotes(request, env, token) {
  const row = /^[A-Za-z0-9_-]{8,64}$/.test(token)
    ? await env.DB.prepare('SELECT s.id, s.contact_opt_out_at FROM contact_tokens t JOIN students s ON s.id = t.student_id WHERE t.token = ?')
      .bind(token).first()
    : null;
  if (!row) return page('Link not recognised', `<h1>This link is not recognised</h1>
<p>It may have been copied incompletely. To stop notes about your progress, reply to any note and say so.</p>
<div class="es"><h1>Enlace no reconocido</h1><p>Puede que se haya copiado incompleto. Para no recibir más mensajes sobre su progreso, responda a cualquiera de ellos y díganoslo.</p></div>`);
  if (request.method === 'POST' || row.contact_opt_out_at) {
    if (!row.contact_opt_out_at)
      await env.DB.prepare('UPDATE students SET contact_opt_out_at = ? WHERE id = ?').bind(new Date().toISOString(), row.id).run();
    return page('Notes stopped', `<h1>Done</h1><p>You will not receive any more notes about your progress. Your courses and your record are unchanged.</p>
<div class="es"><h1>Listo</h1><p>No recibirá más mensajes sobre su progreso. Sus cursos y su registro no cambian.</p></div>`);
  }
  return page('Stop notes about your progress', `<form method="post">
<h1>Stop notes about your progress?</h1><p>The seminary will not write to you again about how your courses are going. Your courses and your record are not affected.</p>
<p><button type="submit">Stop the notes · Detener los mensajes</button></p>
<div class="es"><h1>¿Dejar de recibir mensajes sobre su progreso?</h1><p>El seminario no volverá a escribirle sobre cómo van sus cursos. Sus cursos y su registro no se ven afectados.</p></div></form>`);
}
