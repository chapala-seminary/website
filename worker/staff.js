/* The seminary's own view of its students: /staff/...
 *
 * Wayne's CTS Student Tracker was fed from completion emails, which arrived
 * for some students and not others. The records the site keeps are complete,
 * so this is the tracker's source now: one row per student -- program,
 * country, language, courses, degree progress, last progress, the notes the
 * seminary has sent -- as a page, a CSV and JSON.
 *
 *   GET  /staff/students            the roster (?show=quiet | not_started | all)
 *   GET  /staff/students.csv        the same, for a spreadsheet or the tracker
 *   GET  /staff/students.json
 *   GET  /staff/notes               who the next daily run would write to, and
 *                                   the notes themselves, in both languages
 *   POST /staff/students/<n>/notes  stop=1 | stop=0: stop or resume notes to one student
 *   POST /staff/notes/run           run today's notes now (as the daily run would)
 *   POST /staff/digest              the weekly summary (?send=1 also emails it)
 *
 * WHO CAN SEE IT
 *
 * Only someone Cloudflare Access has let in. Access is Cloudflare's login
 * gate: an application on /staff/* with a policy naming the people allowed
 * (Robert, Wayne) by email, who sign in with a one-time code sent to that
 * address. Access puts a signed token on every request it lets through, and
 * this file checks that token itself -- signature, audience, issuer, expiry --
 * rather than trusting that Access is in front: a Worker is also reachable at
 * its workers.dev address, where no Access rule may apply. No valid token, no
 * page. Not configured (ACCESS_TEAM and ACCESS_AUD unset), no page either.
 *
 * Nothing here shows a student code. The code is the key to a student's whole
 * record; the roster identifies students by name and email, and by row number
 * for the one thing it can change (whether they receive notes).
 *
 * Config (wrangler.jsonc vars; setup in docs/student-tracker.md):
 *   ACCESS_TEAM   the Zero Trust team name: <team>.cloudflareaccess.com
 *   ACCESS_AUD    the Access application's audience tag
 *   ACCESS_JWKS   tests only: the public key to check tokens against, instead
 *                 of fetching Access's. tools/verify-worker-config.mjs refuses
 *                 a deployed config that sets it.
 */
import catalog from './catalog.json';
import { candidates, runOutreach, digest, sendDigest, note, programLevel, PROGRAM_NAMES, QUIET_DAYS, NOT_STARTED_DAYS } from './outreach.js';

const DAY = 86400000;
const b64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const text = (b) => new TextDecoder().decode(b);

let certCache = { at: 0, team: '', keys: [] };
async function accessKeys(env) {
  if (env.ACCESS_JWKS) return JSON.parse(env.ACCESS_JWKS).keys || [];
  if (certCache.team === env.ACCESS_TEAM && Date.now() - certCache.at < 3600000) return certCache.keys;
  const r = await fetch(`https://${env.ACCESS_TEAM}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('could not fetch the Access signing keys: ' + r.status);
  certCache = { at: Date.now(), team: env.ACCESS_TEAM, keys: (await r.json()).keys || [] };
  return certCache.keys;
}

/** The signed-in person's email, or null. */
export async function accessUser(request, env) {
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) return null;
  const jwt = request.headers.get('cf-access-jwt-assertion') || '';
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(text(b64url(parts[0])));
    const claims = JSON.parse(text(b64url(parts[1])));
    if (header.alg !== 'RS256') return null;
    const jwk = (await accessKeys(env)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const good = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(parts[2]),
      new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!good) return null;
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const now = Date.now() / 1000;
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (claims.iss !== `https://${env.ACCESS_TEAM}.cloudflareaccess.com`) return null;
    if (!(claims.exp > now) || (claims.nbf && claims.nbf > now + 60)) return null;
    return claims.email || claims.sub || 'staff';
  } catch (e) {
    console.error('access token check failed', e && e.message);
    return null;
  }
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NOSTORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer' };
const html = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...NOSTORE } });
const json = (v, status = 200) => new Response(JSON.stringify(v, null, 1), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...NOSTORE } });

const NEED = { certificate: 12, associate: 25, thm: 12, mdiv: 30 };

/* One row per student, everything the roster shows, computed once. */
async function roster(env, asOf = new Date()) {
  const rows = (await env.DB.prepare(
    `SELECT s.rowid AS n, a.*, d.foundation_done, d.assoc_done, d.masters_done, d.mdiv_core_done
     FROM student_activity a JOIN students s ON s.id = a.student_id JOIN degree_progress d ON d.student_id = a.student_id
     WHERE lower(COALESCE(a.email, '')) <> 'tester@chapalaseminary.org'
     ORDER BY a.last_progress_at DESC`).all()).results ?? [];
  return rows.map((r) => {
    const level = programLevel(r.track, r.goal);
    const counted = level === 'thm' || level === 'mdiv' ? r.masters_done : level === 'associate' ? r.assoc_done : r.courses_done;
    const days = Math.floor((asOf.getTime() - Date.parse(r.last_progress_at)) / DAY);
    const m = /^(\S+) (\d+)$/.exec(r.last_unit || '');
    const c = m && catalog.courses[m[1]];
    const started = r.units_passed > 0 || r.courses_done > 0;
    return {
      n: r.n, name: r.name, email: r.email || '', email_verified: !!r.email_verified_at, country: r.country || '',
      lang: r.lang || '', program: PROGRAM_NAMES[level].en, courses_done: r.courses_done,
      program_progress: `${Math.min(counted, NEED[level])}/${NEED[level]}`, foundation: `${r.foundation_done}/7`,
      units_passed: r.units_passed, notices: r.notices_sent,
      last_unit: c ? `${c.title?.en || m[1]}, unit ${m[2]}` : '',
      last_progress: String(r.last_progress_at).slice(0, 10), days_since_progress: days,
      status: !started ? (days >= NOT_STARTED_DAYS ? 'not started' : 'new') : days >= QUIET_DAYS ? 'quiet' : 'active',
      notes: r.contact_opt_out_at ? 'stopped' : 'on', last_note: String(r.last_contacted_at || '').slice(0, 10),
      registered: String(r.created_at).slice(0, 10), heard: r.heard || '',
    };
  });
}

const COLUMNS = [
  ['name', 'Name'], ['email', 'Email'], ['country', 'Country'], ['lang', 'Language'], ['program', 'Program'],
  ['program_progress', 'Toward program'], ['foundation', 'Foundation'], ['courses_done', 'Courses'],
  ['notices', 'Notices'], ['units_passed', 'Units'], ['last_unit', 'Last unit'], ['last_progress', 'Last progress'],
  ['days_since_progress', 'Days since'], ['status', 'Status'], ['last_note', 'Last note'], ['notes', 'Notes'],
  ['registered', 'Registered'], ['heard', 'Found us by'],
];

function csv(rows) {
  // A cell a spreadsheet would read as a formula gets a leading apostrophe:
  // names and emails are typed by whoever registers.
  const cell = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [COLUMNS.map(([, h]) => h).join(','), ...rows.map((r) => COLUMNS.map(([k]) => cell(r[k])).join(','))].join('\r\n') + '\r\n';
}

const STYLE = `body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#faf8f9;color:#2b1d27}
h1{font-size:1.3rem;color:#4A1E3A;margin:0 0 4px}p{margin:6px 0 12px;max-width:900px}
nav a{margin-right:14px;color:#4A1E3A}nav a.on{font-weight:bold;text-decoration:none}
.wrap{overflow-x:auto;border:1px solid #e7d8e4;border-radius:8px;background:#fff}
table{border-collapse:collapse;font-size:.85rem;min-width:100%}th,td{padding:6px 8px;border-bottom:1px solid #f0e6ee;text-align:left;white-space:nowrap}
th{background:#f6eef4;position:sticky;top:0}tr.quiet td{background:#fff7e6}tr.not-started td{background:#fdeeee}
button{font:inherit;font-size:.8rem;padding:2px 8px;border-radius:12px;border:1px solid #c8b6c2;background:#fff;cursor:pointer}
pre{white-space:pre-wrap;background:#fff;border:1px solid #e7d8e4;border-radius:8px;padding:12px;max-width:760px}`;

function rosterPage(rows, show, user) {
  const pick = { quiet: (r) => r.status === 'quiet', not_started: (r) => r.status === 'not started', all: () => true }[show] || (() => true);
  const list = rows.filter(pick);
  const count = (s) => rows.filter((r) => r.status === s).length;
  const tab = (k, label) => `<a href="?show=${k}"${show === k ? ' class="on"' : ''}>${label}</a>`;
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CTS students</title><style>${STYLE}</style></head><body>
<h1>CTS students</h1>
<p>${rows.length} students: ${count('active')} active in the last ${QUIET_DAYS} days, ${count('quiet')} quiet, ${count('not started')} not started, ${count('new')} registered this week.
Signed in as ${esc(user)}. <a href="/staff/students.csv">Download CSV</a> · <a href="/staff/notes">Notes to students</a></p>
<p><small>"Last progress" is the last unit passed or course completed. A returning student's history from the old site arrives dated the day of their first visit to the new one, so their clock starts then.</small></p>
<nav>${tab('all', 'All')}${tab('quiet', `Quiet (${count('quiet')})`)}${tab('not_started', `Not started (${count('not started')})`)}</nav>
<div class="wrap"><table><thead><tr>${COLUMNS.map(([, h]) => `<th>${h}</th>`).join('')}</tr></thead><tbody>
${list.map((r) => `<tr class="${r.status.replace(' ', '-')}">${COLUMNS.map(([k]) => k === 'notes'
    ? `<td><form method="post" action="/staff/students/${r.n}/notes" style="margin:0">${r.notes === 'on' ? 'on' : 'stopped'}
       <input type="hidden" name="stop" value="${r.notes === 'on' ? 1 : 0}"><button>${r.notes === 'on' ? 'stop' : 'resume'}</button></form></td>`
    : `<td>${esc(r[k])}</td>`).join('')}</tr>`).join('\n')}
</tbody></table></div></body></html>`);
}

async function notesPage(env, user) {
  const list = await candidates(env);
  const site = (env.SITE_ORIGIN || 'https://chapalaseminary.org').replace(/\/+$/, '');
  const sample = { name: 'María López', last_unit: Object.keys(catalog.courses).includes('acts') ? 'acts 3' : '' };
  const ex = (kind, lang) => note(kind, { ...sample, lang }, { stopUrl: `${site}/stop-notes/…`, site });
  const block = (kind, lang, title) => { const m = ex(kind, lang); return `<h3>${title}</h3><pre>Subject: ${esc(m.subject)}\n\n${esc(m.text)}</pre>`; };
  const mode = env.OUTREACH_MODE === 'send' ? 'ON: notes are sent once a day' : 'OFF: nothing is sent (OUTREACH_MODE is not "send")';
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CTS notes to students</title><style>${STYLE}</style></head><body>
<h1>Notes to students</h1>
<p>Sending is ${mode}. Signed in as ${esc(user)}. <a href="/staff/students">Back to the roster</a></p>
<p>A student is written to when they have made no progress for ${QUIET_DAYS} days (once per quiet spell), or have passed nothing a week after registering (once).
Never when they have no email, asked not to be written to, or have finished their program.</p>
<h2>The next run would write to (${list.length})</h2>
<div class="wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Language</th><th>Why</th><th>Last progress</th></tr></thead><tbody>
${list.map(({ kind, st }) => `<tr><td>${esc(st.name)}</td><td>${esc(st.email)}</td><td>${esc(st.lang || 'both')}</td><td>${kind === 'quiet' ? `quiet ${QUIET_DAYS}+ days` : 'not started'}</td><td>${esc(String(st.last_progress_at).slice(0, 10))}</td></tr>`).join('') || '<tr><td colspan="5">nobody today</td></tr>'}
</tbody></table></div>
<h2>What the notes say</h2>
${block('quiet', 'en', 'Quiet for three weeks (English)')}${block('quiet', 'es', 'Quiet for three weeks (Spanish)')}
${block('not_started', 'en', 'Not started after a week (English)')}${block('not_started', 'es', 'Not started after a week (Spanish)')}
<p><small>A student whose language is not known gets both, English first.</small></p>
</body></html>`);
}

const asOfParam = (url) => { const v = url.searchParams.get('asOf'); const d = v ? new Date(v) : new Date(); return Number.isNaN(d.getTime()) ? new Date() : d; };

export async function handleStaff(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD)
    return html('<p>The staff pages are not set up on this site yet (docs/student-tracker.md).</p>', 503);
  const user = await accessUser(request, env);
  if (!user) return html('<p>Sign in through Cloudflare Access to see this page.</p>', 403);
  if (!env.DB) return html('<p>Student records are not configured.</p>', 503);
  const method = request.method.toUpperCase();

  if (method === 'GET' && (path === '/staff' || path === '/staff/students'))
    return rosterPage(await roster(env), url.searchParams.get('show') || 'all', user);
  if (method === 'GET' && path === '/staff/students.csv')
    return new Response(csv(await roster(env)), { headers: { 'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="cts-students-${new Date().toISOString().slice(0, 10)}.csv"`, ...NOSTORE } });
  if (method === 'GET' && path === '/staff/students.json') return json(await roster(env));
  if (method === 'GET' && path === '/staff/notes') return notesPage(env, user);

  let m;
  // A change must come from these pages, not from a form on another site.
  if (method === 'POST') {
    const from = request.headers.get('origin');
    if (from && from !== url.origin) return html('<p>Refused: the request did not come from this site.</p>', 403);
  }
  if (method === 'POST' && (m = /^\/staff\/students\/(\d+)\/notes$/.exec(path))) {
    const form = await request.formData().catch(() => null);
    const stop = String(form?.get('stop') ?? url.searchParams.get('stop') ?? '1') === '1';
    await env.DB.prepare(`UPDATE students SET contact_opt_out_at = ${stop ? 'COALESCE(contact_opt_out_at, ?)' : 'NULL'} WHERE rowid = ?`)
      .bind(...(stop ? [new Date().toISOString(), +m[1]] : [+m[1]])).run();
    return new Response(null, { status: 303, headers: { location: '/staff/students', ...NOSTORE } });
  }
  if (method === 'POST' && path === '/staff/notes/run') return json(await runOutreach(env, { asOf: asOfParam(url) }));
  if (method === 'POST' && path === '/staff/digest') {
    const asOf = asOfParam(url);
    return json(url.searchParams.get('send') === '1' ? await sendDigest(env, asOf) : await digest(env, asOf));
  }
  return html('<p>No such page.</p>', 404);
}
