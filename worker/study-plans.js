import { FOUNDATION, validThmSubstitutions } from './awards.js';
import catalog from './catalog.json';

export async function loadThmStudyPlan(env, id) {
  const row = await env.DB.prepare(
    'SELECT substitutions, approved_at FROM thm_study_plans WHERE student_id = ? ORDER BY id DESC LIMIT 1'
  ).bind(id).first();
  if (!row?.substitutions) return null;
  try {
    const substitutions = JSON.parse(row.substitutions);
    return validThmSubstitutions(substitutions) ? { substitutions, approvedAt: row.approved_at } : null;
  } catch { return null; }
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const respond = (text, status = 200) => new Response(text, { status, headers: {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer',
}});

// Called only behind handleStaff's verified Cloudflare Access identity.
export async function handleThmStudyPlan(request, env, n, staff) {
  const student = await env.DB.prepare('SELECT id, name, track, merged_into FROM students WHERE rowid = ?').bind(n).first();
  if (!student || student.merged_into) return respond('<p>No active student at this address.</p>', 404);
  const latest = await env.DB.prepare('SELECT id, substitutions, approved_at FROM thm_study_plans WHERE student_id = ? ORDER BY id DESC LIMIT 1').bind(student.id).first();
  const replaceable = FOUNDATION.filter(c => c !== 'CTSST' && c !== 'WISESPEAK');
  if (request.method === 'POST') {
    if (request.headers.get('origin') !== new URL(request.url).origin) return respond('<p>Request must come from this site.</p>', 403);
    const form = await request.formData().catch(() => null);
    if (!form || form.get('facultyApproved') !== 'yes') return respond('<p>Confirm faculty approval before saving or withdrawing a plan.</p>', 400);
    const action = form.get('action');
    const substitutions = Object.fromEntries(replaceable.map(c => [c, form.get(c)]));
    if (action !== 'withdraw' && (action !== 'approve' || student.track !== 'thm' || !validThmSubstitutions(substitutions)))
      return respond('<p>A Th.M. student needs five distinct CTS replacements outside the foundation. Systematic Theology and Preaching cannot be replaced. <a href="">Return to plan</a></p>', 400);
    const revision = String(form.get('revision') || '');
    if (!/^\d+$/.test(revision)) return respond('<p>Reload the plan before saving.</p>', 409);
    const result = await env.DB.prepare(`INSERT INTO thm_study_plans (student_id, substitutions, approved_at, approved_by)
      SELECT ?, ?, ?, ? WHERE COALESCE((SELECT MAX(id) FROM thm_study_plans WHERE student_id = ?), 0) = ?`)
      .bind(student.id, action === 'withdraw' ? null : JSON.stringify(substitutions), new Date().toISOString(), staff, student.id, Number(revision)).run();
    if (!result.meta?.changes) return respond('<p>The plan changed in another session. Reload it before saving.</p>', 409);
    return new Response(null, {status:303, headers:{location:new URL(request.url).pathname, 'cache-control':'no-store'}});
  }
  const plan = await loadThmStudyPlan(env, student.id);
  const options = Object.entries(catalog.completions).filter(([c]) => !FOUNDATION.includes(c)).sort((a,b) => a[1].name.localeCompare(b[1].name));
  return respond(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Th.M. course plan</title>
  <style>body{font:17px/1.5 system-ui;max-width:760px;margin:24px auto;padding:0 16px;color:#30222b}label{display:block;margin:18px 0}select{display:block;font:inherit;max-width:100%;width:100%;padding:8px}button{font:inherit;padding:10px;margin:6px 8px 6px 0}input[type=checkbox]{width:20px;height:20px}</style></head><body>
  <a href="/staff/students">← Students</a><h1>Th.M. course plan</h1><p>${esc(student.name)}</p>
  <p>${plan ? 'An approved plan is active.' : 'The standard seven foundation courses apply.'} ${plan ? 'Approved '+esc(plan.approvedAt) : ''}</p>
  <p>Record an individual faculty-approved arrangement here. Replace five foundation courses with five distinct other CTS courses. <strong>Systematic Theology, Preaching and 15 actual completed CTS courses at master’s level remain required, with their textbook and required-reading exams.</strong> No completions or exam exemptions are created.</p>
  <form method="post"><input type="hidden" name="revision" value="${latest?.id || 0}">
  ${replaceable.map(c => `<label>Instead of ${esc(catalog.completions[c].name)}<select name="${c}" required><option value="">Choose an approved CTS replacement</option>${options.map(([code, course]) => `<option value="${code}"${plan?.substitutions[c] === code ? ' selected' : ''}>${esc(course.name)}</option>`).join('')}</select></label>`).join('')}
  <p>Systematic Theology and Preaching remain in the plan. Other degree programs keep their standard requirements.</p>
  <label><input type="checkbox" name="facultyApproved" value="yes" required> Faculty have approved this individual plan or its withdrawal.</label>
  <button name="action" value="approve"${student.track === 'thm' ? '' : ' disabled'}>Save approved plan</button>
  <button name="action" value="withdraw" formnovalidate>Withdraw plan</button></form>
  <p>After a change, the student should sync or recover their record. Withdrawal changes future eligibility; earned completions and issued certificates remain in the record.</p></body></html>`);
}
