/* CTS Correspondence Console (issue #163). Read-only toward mail.
 *
 *   GET  /console                 the exception dashboard (phone-sized)
 *   GET  /console/digest.txt      today's digest as text
 *   GET  /console/data.json       the dashboard's data
 *   GET  /console/cases/<id>      one case: summary, messages, every decision
 *   POST /console/cases/<id>      change status / assignee / due / evidence (reviewer, owner)
 *   POST /console/pause           stop every automatic step now (any signed-in reviewer or owner)
 *   POST /console/resume          start again (owner)
 *   POST /console/sync            run the mailbox sync now (reviewer, owner)
 *   GET  /console/auto            automatic replies: mode, templates, what was sent
 *   POST /console/auto            mode off (reviewer, owner); shadow / live, approve,
 *                                 withdraw a template (owner only)
 *
 *   cron, every 10 minutes: sync every enabled mailbox; 13:00 UTC daily: retention.
 *
 * The only sending is the automatic routine reply (src/autoreply.js,
 * src/send.js): from one account, approved templates only, behind
 * settings.auto_send, which starts 'off'. No route sends a message.
 */
import { consoleUser } from './access.js';
import { dashboardData, digestText } from './digest.js';
import { staffUpdate } from './ingest.js';
import { syncAll, retention } from './sync.js';
import { autoReport } from './autoreply.js';
import { TEMPLATES, LANGS, render, templateVersion } from './templates.js';
import { FACTS, POLICY_VERSION } from './policy.js';

const NOSTORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'" };
const html = (b, s = 200) => new Response(b, { status: s, headers: { 'content-type': 'text/html; charset=utf-8', ...NOSTORE } });
const json = (v, s = 200) => new Response(JSON.stringify(v, null, 1), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', ...NOSTORE } });
const txt = (v, s = 200) => new Response(v, { status: s, headers: { 'content-type': 'text/plain; charset=utf-8', ...NOSTORE } });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const back = (to = '/console') => new Response(null, { status: 303, headers: { location: to, ...NOSTORE } });

const STYLE = `<style>
:root{--bg:#faf8f5;--card:#fff;--ink:#1f1d1a;--muted:#6b655d;--line:#e6e1d9;--accent:#7a1f2b;--gold:#a8842c;--red:#b42318;--amber:#a15c07;--ok:#2e6b3a}
@media (prefers-color-scheme:dark){:root{--bg:#161412;--card:#201d1a;--ink:#ece7df;--muted:#a39b90;--line:#35302a;--accent:#d9808b;--gold:#d8b25a;--red:#f97066;--amber:#f5b54a;--ok:#7bc58a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:760px;margin:0 auto;padding:16px}h1{font:600 1.35rem Georgia,serif;margin:4px 0 2px;color:var(--accent)}
h2{font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:22px 0 8px}
.sub{color:var(--muted);font-size:.9rem}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:8px 0}
.card a{color:inherit;text-decoration:none}.who{font-weight:600}.meta{color:var(--muted);font-size:.82rem;margin-top:2px}
.next{margin-top:6px;font-size:.92rem}.pill{display:inline-block;font-size:.72rem;padding:1px 7px;border-radius:99px;border:1px solid var(--line);margin-right:4px}
.urgent{color:var(--red);border-color:var(--red)}.high{color:var(--amber);border-color:var(--amber)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}.stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}
.stat b{display:block;font-size:1.3rem}.stat span{color:var(--muted);font-size:.8rem}
.bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0}button,select,input,textarea{font:inherit}
button{background:var(--accent);color:#fff;border:0;border-radius:8px;padding:8px 14px}button.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent)}
.banner{background:var(--red);color:#fff;border-radius:8px;padding:8px 12px;margin:10px 0}.empty{color:var(--ok)}
pre{white-space:pre-wrap;font:13px/1.4 ui-monospace,Menlo,monospace;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;overflow:auto}
label{display:block;font-size:.85rem;color:var(--muted);margin-top:8px}input,select,textarea{width:100%;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}
</style>`;

const page = (title, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>${STYLE}</head><body><main>${body}</main></body></html>`;

function card(r) {
  const pr = r.priority === 'urgent' || r.priority === 'high' ? ` ${r.priority}` : '';
  return `<div class="card"><a href="/console/cases/${r.id}"><div class="who">${esc(r.who)}</div>
<div class="meta"><span class="pill${pr}">${esc(r.priority)}</span><span class="pill">${esc(r.category.replace(/_/g, ' '))}</span>${esc(r.track === 'relations' ? 'faculty / partner' : 'student')} · ${r.age_hours}h · ${esc(r.mailbox || '')}</div>
<div class="next">${esc(r.owner_reason ? 'Decide: ' + r.owner_reason : r.next_action)}</div></a>
${r.link ? `<div class="meta"><a href="${esc(r.link)}" rel="noopener">Open in Gmail →</a></div>` : ''}</div>`;
}

function dashboard(d, user) {
  const s = d.sections;
  const SHOW = 50;
  const sec = (title, rows, note) => rows.length ? `<h2>${title} · ${rows.length}</h2>${note ? `<div class="sub">${note}</div>` : ''}${rows.slice(0, SHOW).map(card).join('')}${rows.length > SHOW ? `<div class="sub">…and ${rows.length - SHOW} more (oldest-first ordering by priority).</div>` : ''}` : '';
  const need = s.owner.length + s.escalated.length + s.overdue.length + s.review_links.length;
  const c = d.counts;
  return page('CTS Correspondence', `<h1>CTS Correspondence</h1><div class="sub">${esc(d.now.slice(0, 16).replace('T', ' '))} UTC · signed in as ${esc(user.email)} (${esc(user.role)})</div>
${d.settings.paused === '1' ? '<div class="banner">Paused: no mailbox is being read and nothing automatic runs.</div>' : ''}
<div class="bar"><form method="post" action="/console/${d.settings.paused === '1' ? 'resume' : 'pause'}"><button ${d.settings.paused === '1' ? '' : 'class="ghost"'}>${d.settings.paused === '1' ? 'Resume' : 'Pause everything'}</button></form>
<form method="post" action="/console/sync"><button class="ghost">Check mail now</button></form><a class="sub" href="/console/digest.txt">Digest as text</a> · <a class="sub" href="/console/auto">Automatic replies: ${esc(d.settings.auto_send || 'off')}</a></div>
${need ? '' : '<p class="empty">Nothing needs you right now.</p>'}
${sec('For Dr. Cook to decide', s.owner)}
${sec('Technical problems', s.escalated, 'Stay open until the fix is checked.')}
${sec('Replies overdue', s.overdue)}
${sec('Conversation links to confirm', s.review_links, 'Same subject from two mailboxes, not proven to be one conversation.')}
<h2>Routine</h2><div class="stats">
<div class="stat"><b>${s.pending.length}</b><span>pending replies</span></div><div class="stat"><b>${s.waiting.length}</b><span>waiting on others</span></div>
<div class="stat"><b>${c.received_24h}</b><span>received, 24h</span></div><div class="stat"><b>${c.automated_24h}</b><span>automated, hidden</span></div>
<div class="stat"><b>${c.bounces_hard + c.opt_outs}</b><span>do-not-contact</span></div><div class="stat"><b>${c.retrying + c.dead_letters}</b><span>unread (retrying)</span></div></div>
${sec('Pending replies', s.pending)}
<h2>Mailboxes</h2>${d.mailboxes.map((m) => `<div class="card"><div class="who">${esc(m.address)}</div><div class="meta">${m.enabled ? 'reading' : 'not enabled'} · last check ${esc(m.last_sync_at || 'never')}${m.last_error ? ` · <span class="pill urgent">${esc(m.last_error)}</span>` : ''}</div></div>`).join('') || '<div class="sub">No mailbox approved yet.</div>'}`);
}

const MODE_TEXT = {
  off: 'Off: no automatic replies are planned or sent.',
  shadow: 'Shadow: each routine reply is written and recorded here, but NOT sent. Use this to check the texts.',
  live: 'Live: approved routine replies are sent from chapalatheological@gmail.com.',
};
const STATUS_TEXT = { pending: 'waiting', shadow: 'would have sent', sending: 'sending', sent: 'sent', blocked: 'held for a person',
  superseded: 'not needed', failed: 'failed', unknown: 'unconfirmed: check Sent', cancelled: 'cancelled' };

async function autoView(env, user) {
  const a = await autoReport(env);
  const owner = user.role === 'owner';
  const mode = a.settings.mode;
  const modeForm = (m, label) => `<form method="post" action="/console/auto"><input type="hidden" name="mode" value="${m}"><button ${m === mode ? '' : 'class="ghost"'}>${label}</button></form>`;
  const c = a.counts;
  const tpl = a.templates.map((t) => {
    const T = TEMPLATES[t.id];
    const facts = T.facts.map((f) => `<div class="meta">• ${esc(FACTS[f].text)} <span class="pill">${esc(FACTS[f].status)}</span> <span class="sub">${esc(FACTS[f].source)}</span></div>`).join('');
    const texts = LANGS.map((l) => `<details><summary class="sub">${l.toUpperCase()} text</summary><pre>${esc(render([t.id], l, 'Maria'))}</pre></details>`).join('');
    const btn = owner ? (t.standing.ok
      ? `<form method="post" action="/console/auto"><input type="hidden" name="withdraw" value="${t.id}"><button class="ghost">Withdraw approval</button></form>`
      : `<form method="post" action="/console/auto"><input type="hidden" name="approve" value="${t.id}"><input type="hidden" name="version" value="${t.version}"><button>Approve this text</button></form>`) : '';
    return `<div class="card"><div class="who">${esc(t.title)}</div><div class="meta">${t.standing.ok ? '<span class="pill">approved</span>' : `<span class="pill high">not sendable</span> ${esc(t.standing.reason)}`} · version ${t.version}</div>${facts}${texts}<div class="bar">${btn}</div></div>`;
  }).join('');
  const recent = a.recent.map((r) => `<div class="card"><div class="meta"><span class="pill${r.status === 'blocked' || r.status === 'unknown' || r.status === 'failed' ? ' high' : ''}">${esc(STATUS_TEXT[r.status] || r.status)}</span>
${esc(r.display_name || r.to_addr)} · ${esc(r.intents.replace(/,/g, ', '))} · ${esc(r.language)} · ${esc(r.updated_at.slice(0, 16).replace('T', ' '))} · <a href="/console/cases/${r.case_id}">case ${r.case_id}</a></div>
${r.reason ? `<div class="meta">${esc(r.reason)}</div>` : ''}${r.body ? `<details><summary class="sub">Text</summary><pre>${esc(r.subject || '')}

${esc(r.body)}</pre></details>` : ''}</div>`).join('');
  return html(page('Automatic replies', `<p><a class="sub" href="/console">← Console</a></p><h1>Automatic replies</h1>
<div class="sub">Policy ${esc(POLICY_VERSION)} · up to ${a.settings.cap} a day · sent ${a.settings.delay} minutes after the student's message, unless someone answers first from any mailbox.</div>
<div class="card">${esc(MODE_TEXT[mode])}</div>
<div class="bar">${modeForm('off', 'Off')}${owner ? modeForm('shadow', 'Shadow (record only)') + modeForm('live', 'Live (send)') : ''}</div>
${a.settings.paused ? '<div class="banner">Paused: nothing automatic runs, including these replies.</div>' : ''}
<h2>Last 24 hours</h2><div class="stats">${['sent', 'shadow', 'blocked', 'superseded', 'unknown', 'failed', 'pending'].map((k) => `<div class="stat"><b>${c[k] || 0}</b><span>${esc(STATUS_TEXT[k])}</span></div>`).join('')}</div>
<h2>Templates · a template is sent only when approved and all its facts are confirmed</h2>${tpl}
<h2>Recent</h2>${recent || '<div class="sub">None yet.</div>'}`));
}

async function caseView(env, id, user) {
  const c = await env.DB.prepare('SELECT c.*, k.address_norm, k.display_name FROM cases c JOIN contacts k ON k.id = c.contact_id WHERE c.id = ?').bind(id).first();
  if (!c) return html(page('Not found', '<p>No such case.</p>'), 404);
  const msgs = (await env.DB.prepare(`SELECT m.*, t.link_state FROM messages m JOIN threads t ON t.id = m.thread_id WHERE t.case_id = ? ORDER BY m.internal_ms`).bind(id).all()).results || [];
  const evs = (await env.DB.prepare('SELECT * FROM case_events WHERE case_id = ? ORDER BY id').bind(id).all()).results || [];
  const can = user.role !== 'viewer';
  const opts = ['new', 'draft', 'waiting_on_us', 'waiting_on_them', 'scheduled_follow_up', 'escalated', 'resolved'].map((s) => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('');
  return html(page(`Case ${id}`, `<p><a class="sub" href="/console">← Console</a></p><h1>${esc(c.display_name || c.address_norm)}</h1>
<div class="sub">${esc(c.address_norm)} · ${esc(c.track)} · ${esc(c.category.replace(/_/g, ' '))} · ${esc(c.priority)} · ${esc(c.status)}${c.assignee ? ' · ' + esc(c.assignee) : ''}</div>
${c.needs_owner ? `<div class="card"><b>For Dr. Cook:</b> ${esc(c.owner_reason)}</div>` : ''}
<h2>Summary</h2><div class="card">${esc(c.summary || '')}<div class="next"><b>Next:</b> ${esc(c.next_action || '')}</div></div>
${JSON.parse(c.commitments_json).length ? `<h2>CTS has promised</h2><div class="card">${JSON.parse(c.commitments_json).map((p) => `<div>• ${esc(p)}</div>`).join('')}</div>` : ''}
${JSON.parse(c.facts_json).length ? `<h2>Facts</h2><div class="card">${JSON.parse(c.facts_json).map((p) => `<div>• ${esc(p)}</div>`).join('')}</div>` : ''}
<h2>Messages · ${msgs.length}</h2>${msgs.map((m) => `<div class="card"><div class="meta">${m.direction === 'in' ? 'From ' + esc(m.from_norm) : 'CTS (' + esc(m.mailbox_id) + ') to ' + esc(m.to_norm)} · ${new Date(m.internal_ms).toISOString().slice(0, 16).replace('T', ' ')}${m.flags ? ' · ' + esc(m.flags) : ''}${m.link_state === 'needs_review' ? ' · <span class="pill high">link unconfirmed</span>' : ''}</div>
<div><b>${esc(m.subject || '')}</b></div>${m.excerpt ? `<pre>${esc(m.excerpt)}</pre>` : ''}${m.view_url ? `<a class="sub" href="${esc(m.view_url)}" rel="noopener">Open in Gmail →</a>` : ''}</div>`).join('')}
${can ? `<h2>Change</h2><form class="card" method="post" action="/console/cases/${id}"><label>Status<select name="status">${opts}</select></label>
<label>Assigned to<input name="assignee" value="${esc(c.assignee || '')}"></label><label>Due (YYYY-MM-DD)<input name="due_at" value="${esc(c.due_at || '')}"></label>
<label>Evidence (required to close a technical problem)<textarea name="evidence" rows="2">${esc(c.resolution_evidence || '')}</textarea></label>
${user.role === 'owner' ? `<label><input type="checkbox" name="owner_done" value="1" style="width:auto"> I have decided this; take it off my list</label>` : ''}
<div class="bar"><button>Save</button></div></form>` : ''}
<h2>Every decision · ${evs.length}</h2><pre>${evs.map((e) => `${e.at.slice(0, 16)} ${e.actor} ${e.kind}${e.detail ? ' ' + e.detail : ''}`).map(esc).join('\n')}</pre>`));
}

const sameOrigin = (req) => {
  const o = req.headers.get('origin');
  return !o || o === new URL(req.url).origin;
};

async function setSetting(env, key, value, by) {
  await env.DB.prepare('INSERT INTO settings (key, value, updated_by, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
    .bind(key, value, by, new Date().toISOString()).run();
  await env.DB.prepare('INSERT INTO case_events (actor, kind, detail, at) VALUES (?, ?, ?, ?)').bind(by, 'setting', JSON.stringify({ [key]: value }), new Date().toISOString()).run();
}

export async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/health') return txt('ok');
  if (!url.pathname.startsWith('/console')) return txt('Not found', 404);
  const user = await consoleUser(request, env);
  if (!user) return txt('Sign-in required.', 403);
  const p = url.pathname.replace(/\/+$/, '') || '/console';
  if (request.method === 'GET') {
    if (p === '/console') return html(dashboard(await dashboardData(env), user));
    if (p === '/console/data.json') return json(await dashboardData(env));
    if (p === '/console/digest.txt') return txt(digestText(await dashboardData(env)));
    if (p === '/console/auto') return autoView(env, user);
    const m = p.match(/^\/console\/cases\/(\d+)$/);
    if (m) return caseView(env, Number(m[1]), user);
    return txt('Not found', 404);
  }
  if (request.method !== 'POST') return txt('Method not allowed', 405);
  if (!sameOrigin(request)) return txt('Cross-site request refused.', 403);
  if (p === '/console/pause') { if (user.role === 'viewer') return txt('Not allowed', 403); await setSetting(env, 'paused', '1', user.email); return back(); }
  if (p === '/console/resume') { if (user.role !== 'owner') return txt('Only the owner can resume.', 403); await setSetting(env, 'paused', '0', user.email); return back(); }
  if (user.role === 'viewer') return txt('Not allowed', 403);
  if (p === '/console/sync') { await syncAll(env); return back(); }
  if (p === '/console/auto') {
    const f = await request.formData();
    const mode = f.get('mode');
    if (mode) {
      if (!['off', 'shadow', 'live'].includes(mode)) return txt('Unknown mode', 400);
      if (mode !== 'off' && user.role !== 'owner') return txt('Only the owner can turn automatic replies on.', 403);
      await setSetting(env, 'auto_send', mode, user.email);
      return back('/console/auto');
    }
    if (user.role !== 'owner') return txt('Only the owner approves templates.', 403);
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'approved_templates'").first();
    let approved = {};
    try { approved = JSON.parse(row?.value || '{}'); } catch { approved = {}; }
    const id = f.get('approve') || f.get('withdraw');
    if (!TEMPLATES[id]) return txt('No such template', 400);
    if (f.get('approve')) {
      // the version shown on the page is the one approved; if the text changed meanwhile, nothing is approved
      if (f.get('version') !== templateVersion(id)) return txt('The text changed since the page was opened; reload and read it again.', 409);
      approved[id] = templateVersion(id);
    } else delete approved[id];
    await setSetting(env, 'approved_templates', JSON.stringify(approved), user.email);
    return back('/console/auto');
  }
  const m = p.match(/^\/console\/cases\/(\d+)$/);
  if (m) {
    const f = await request.formData();
    const change = { status: f.get('status') || undefined, assignee: f.get('assignee') ?? undefined, due_at: f.get('due_at') || null, evidence: f.get('evidence') || undefined };
    if (f.get('owner_done') && user.role === 'owner') change.needs_owner = 0;
    const r = await staffUpdate(env, Number(m[1]), user.email, change);
    if (r.error) return txt(r.error, 400);
    return back(`/console/cases/${m[1]}`);
  }
  return txt('Not found', 404);
}

export default {
  fetch: handle,
  async scheduled(controller, env, ctx) {
    if (controller.cron === '0 13 * * *') ctx.waitUntil(retention(env));
    else ctx.waitUntil(syncAll(env).then((r) => console.log(JSON.stringify(r))));
  },
};
