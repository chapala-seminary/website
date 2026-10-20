// Coordinator-led paper study (worker/coord.js), against a real Worker and D1.
//
//   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc \
//     node test/coord.test.mjs
//
// Staff make a group; its coordinator signs in at /coord (a second Access
// application, test audience cts-coord-test-aud), enrolls a learner with no
// email, prints an exam and types in answer sheets. A sheet is graded by the
// same code as an online attempt: a pass is credit on the learner's record,
// a failure locks the unit, and nothing the coordinator sees gives the key away.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${String(detail).slice(0, 400)}` : '')); };

function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}

/* ---- signing in: the suite's own key stands in for Cloudflare Access ------------------ */
const { key: TEST_JWK } = JSON.parse(fs.readFileSync(new URL('./fixtures/access-test-key.json', import.meta.url), 'utf8'));
const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
function token(email, aud) {
  const head = b64({ alg: 'RS256', kid: 'cts-test-1', typ: 'JWT' });
  const body = b64({ aud: [aud], iss: 'https://cts-test.cloudflareaccess.com', exp: Math.floor(Date.now() / 1000 + 600),
    iat: Math.floor(Date.now() / 1000), email, sub: 'x' });
  const key = crypto.createPrivateKey({ key: TEST_JWK, format: 'jwk' });
  return `${head}.${body}.${crypto.sign('sha256', Buffer.from(`${head}.${body}`), key).toString('base64url')}`;
}
const tag = Math.random().toString(36).slice(2, 7);
const COORD = `coord-${tag}@example.test`, COORD2 = `coord2-${tag}@example.test`;
const asStaff = { 'cf-access-jwt-assertion': token('staff@example.test', 'cts-test-aud') };
const asCoord = (email = COORD) => ({ 'cf-access-jwt-assertion': token(email, 'cts-coord-test-aud') });
const form = (o) => ({ method: 'POST', body: new URLSearchParams(o).toString(), redirect: 'manual',
  headers: { 'content-type': 'application/x-www-form-urlencoded' } });
/* A wrangler command (db() above) takes seconds and can restart the local server,
   closing the connection this process would reuse: a fresh connection per request,
   and another try when the request never reached the Worker (test/grading-api.test.mjs). */
async function go(path, init = {}, who = {}) {
  for (let tries = 0; ; tries++) {
    try { return await fetch(BASE + path, { ...init, redirect: 'manual', headers: { connection: 'close', ...(init.headers || {}), ...who } }); }
    catch (e) { if (tries >= 3) throw e; await new Promise((r) => setTimeout(r, 400 * (tries + 1))); }
  }
}

/* ---- who may open /coord ------------------------------------------------------------------ */
ok((await go('/coord')).status === 403, 'no sign-in: /coord is refused');
ok((await go('/coord', {}, asStaff)).status === 403, 'a staff sign-in does not open /coord (different Access application)');
ok((await go('/staff/students', {}, asCoord())).status === 403, 'a coordinator sign-in does not open the staff pages');
const nogroup = await go('/coord', {}, asCoord());
ok(nogroup.status === 403 && /not the coordinator/.test(await nogroup.text()), 'signed in but no group yet: refused, saying so');

/* ---- staff make the groups ---------------------------------------------------------------- */
const made = await go('/staff/groups', form({ name: `Kenya pilot ${tag}`, country: 'KE', coordinator_email: COORD.toUpperCase(), course: 'ots' }), asStaff);
ok(made.status === 303, 'staff create a group', made.status);
ok((await go('/staff/groups', form({ name: 'again', country: 'KE', coordinator_email: COORD, course: 'ots' }), asStaff)).status === 409,
  'one group per coordinator email (stored lower-case)');
ok((await go('/staff/groups', form({ name: 'bad', coordinator_email: 'not-an-email', course: 'ots' }), asStaff)).status === 400,
  'a group needs a real coordinator email');
ok((await go('/staff/groups', form({ name: `Liberia pilot ${tag}`, country: 'Liberia', coordinator_email: COORD2, course: 'ots' }), asStaff)).status === 303,
  'a second group, a second coordinator');
ok((await go('/staff/groups', form({ name: 'x', coordinator_email: 'x@example.test' }), asCoord())).status === 403,
  'a coordinator cannot make groups');

const home = await go('/coord', {}, asCoord());
const homeText = await home.text();
ok(home.status === 200 && homeText.includes(`Kenya pilot ${tag}`) && homeText.includes('Old Testament Survey'),
  'the coordinator sees their own group and its course', homeText.slice(0, 300));
ok(!homeText.includes(`Liberia pilot ${tag}`), 'and not the other group');

/* ---- enrolling a learner with no email ---------------------------------------------------- */
const NAME = `Paper Learner ${tag}`;
const enr = await go('/coord/enroll', form({ name: NAME, lang: 'en' }), asCoord());
const enrText = await enr.text();
const code = (/CTS-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}/.exec(enrText) || [])[0];
ok(enr.status === 201 && code, 'enrolling shows the new student code once', enrText.slice(0, 300));
const [stu] = db(`SELECT email, track, country, lang, heard FROM students WHERE id = '${code}'`)[0];
ok(stu && stu.email === null && stu.track === 'cert' && stu.country === 'KE' && stu.lang === 'en',
  'an ordinary student record: no email, Certificate track, the group\'s country', JSON.stringify(stu));
const memberId = Number((/\/coord\/members\/(\d+)\/sheet/.exec(enrText) || [])[1]);
ok(memberId > 0, 'the page links to the learner by member number, not code');
ok(!/\/coord\/[^"]*CTS-/.test(enrText), 'no link carries a student code');
ok((await go('/coord/enroll', form({ name: '   ', lang: 'en' }), asCoord())).status === 400, 'a name is required');

const shown = await (await go(`/coord/members/${memberId}/code`, {}, asCoord())).text();
ok(shown.includes(code), 'the coordinator can see a member\'s code again');
ok((await go(`/coord/members/${memberId}/code`, {}, asCoord(COORD2))).status === 404, 'another group\'s coordinator cannot');
ok((await go(`/coord/members/${memberId}/sheet`, form({ unit: '1', letters: 'A'.repeat(20) }), asCoord(COORD2))).status === 404,
  'nor enter a sheet for them');

/* ---- the printed exam --------------------------------------------------------------------- */
const unit1 = JSON.parse(fs.readFileSync('src/content/units/CTS/1.json', 'utf8'));
const unit2 = JSON.parse(fs.readFileSync('src/content/units/CTS/2.json', 'utf8'));
const L = 'ABCD';
const ex = await go('/coord/exam/1', {}, asCoord());
const exText = await ex.text();
const strip = (s) => String(s).replace(/<[^>]*>/g, '');
// The pages escape what they print (& < > " '); compare against the text a reader sees.
const unesc = (s) => String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
ok(ex.status === 200 && (exText.match(/<li style="margin-bottom:12px">/g) || []).length === unit1.mc.length,
  'the exam prints every multiple-choice question of the unit', exText.slice(0, 200));
ok(exText.indexOf(strip(unit1.mc[0].options.en[0]).slice(0, 30)) > -1 && exText.indexOf(strip(unit1.mc[1].stem.en).slice(0, 30)) > exText.indexOf(strip(unit1.mc[0].stem.en).slice(0, 30)),
  'in bank order, choices in stored order');
ok(!unit1.mc.some((q) => q.why && q.why.en && exText.includes(strip(q.why.en).slice(0, 40))), 'with no explanation (they name the answer)');
const exFr = unesc(await (await go('/coord/exam/1?lang=fr', {}, asCoord())).text());
ok(exFr.includes(strip(unit1.mc[0].stem.fr).slice(0, 25)), 'and in French when asked');

/* ---- answer sheets ------------------------------------------------------------------------ */
const allRight = unit1.mc.map((q) => L[q.answer]).join('');
// The exam version printed at the top of each unit's exam (worker/coord.js examVersion).
const versionOf = async (unit) => (/class="exam-version">([0-9A-Z]+)</.exec(await (await go(`/coord/exam/${unit}`, {}, asCoord())).text()) || [])[1];
const sheet = async (unit, letters, extra = {}, version) => go(`/coord/members/${memberId}/sheet`,
  { ...form({ unit: String(unit), letters, version: version ?? await versionOf(unit) }), headers: { 'content-type': 'application/x-www-form-urlencoded', ...extra } }, asCoord());
const attemptsFor = (unit) => db(`SELECT COUNT(*) AS n FROM attempts WHERE student_id = '${code}' AND scope = 'u:CTS/${unit}'`)[0][0].n;

const v1 = await versionOf(1);
ok(/^[0-9A-Z]{6}$/.test(v1 || '') && exText.includes(`exam version ${v1}`), 'the printed exam and its answer sheet carry the exam version', v1);
ok(!/name="letters"[^>]*pattern=/.test(await (await go(`/coord/members/${memberId}/sheet`, {}, asCoord())).text()),
  'the letters box has no browser pattern (one that refused X or broke in newer browsers; the server checks)');
const noVersion = unesc(await (await sheet(1, allRight, {}, '')).text());
ok(/Enter the exam version/.test(noVersion), 'a sheet without the exam version is refused');

// ChatGPT's review of #148: a paper printed before a key changed must not be graded
// against the new key. Print, change one key, enter the old paper: refused, nothing written.
const [k0] = db("SELECT data_json FROM grading_keys WHERE qid = 'u:CTS/1/mc/0'")[0];
const changed = JSON.parse(k0.data_json); changed.answer = (changed.answer + 1) % changed.options.en.length;
db(`UPDATE grading_keys SET data_json = '${JSON.stringify(changed).replace(/'/g, "''")}' WHERE qid = 'u:CTS/1/mc/0'`);
const v1b = await versionOf(1);
ok(v1b && v1b !== v1, 'changing an answer key changes the exam version', `${v1} -> ${v1b}`);
const stale = unesc(await (await sheet(1, allRight, {}, v1)).text());
ok(/printed from exam version .* is now version .* Nothing was recorded, and the unit is not locked/.test(stale),
  'a sheet from the old printout is refused, saying to print the current exam', stale.slice(0, 300));
ok(attemptsFor(1) === 0, 'and no attempt was made from it (no failure, no lock)');
db(`UPDATE grading_keys SET data_json = '${k0.data_json.replace(/'/g, "''")}' WHERE qid = 'u:CTS/1/mc/0'`);
ok((await versionOf(1)) === v1, 'the key restored, the version is the printed one again');

const shadowTry = await sheet(1, allRight, { 'x-test-grading-mode': 'shadow' });
ok(/open when the site grades exams on the server/.test(await shadowTry.text()), 'before the site grades on the server, sheets are refused');

const short = await (await sheet(1, allRight.slice(0, 19))).text();
ok(/has 19 letters; this unit has 20/.test(short), 'a sheet with the wrong number of letters is refused');
const badLetter = unesc(await (await sheet(1, 'E' + allRight.slice(1))).text());
ok(/Question 1: "E" is not one of its choices/.test(badLetter), 'a letter that is not a choice is refused');

const pass = await (await sheet(1, allRight.split('').join(' '))).text();
ok(/Passed: 20 of 20 right/.test(pass), 'a correct sheet passes (spaces ignored)', pass.slice(0, 300));
ok(!/[Rr]ight answer|correct answer|answer was/.test(pass), 'the result names no right answer');
const [up] = db(`SELECT unit, source FROM unit_progress WHERE student_id = '${code}' AND course = 'ots'`)[0];
ok(up && up.unit === 1 && up.source === 'server', 'the pass is on the learner\'s record, written by the server', JSON.stringify(up));
const [att] = db(`SELECT a.status, a.mc_right, a.mc_total, a.track, p.entered_by, p.letters FROM attempts a JOIN paper_sheets p ON p.attempt_id = a.id WHERE a.student_id = '${code}' AND a.scope = 'u:CTS/1'`)[0];
ok(att && att.status === 'passed' && att.mc_right === 20 && att.mc_total === 20 && att.track === 'cert' && att.entered_by === COORD && att.letters === allRight,
  'an ordinary attempt, with who entered it and the letters kept', JSON.stringify(att));
ok(/already passed/.test(await (await sheet(1, allRight)).text()), 'a passed unit takes no second sheet');

// 17 of 20: below the 18 needed on the Certificate track.
const wrong = (q) => L[(q.answer + 1) % q.options.en.length];
const seventeen = unit2.mc.map((q, i) => (i < 3 ? wrong(q) : L[q.answer])).join('');
const fail = await (await sheet(2, seventeen)).text();
ok(/Not passed: 17 of 20 right \(18 needed\)/.test(fail), 'a sheet below 18 of 20 does not pass', fail.slice(0, 300));
ok(!/Question \d+/.test(fail), 'and does not say which questions were wrong');
ok(db(`SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = '${code}' AND course = 'ots' AND unit = 2`)[0][0].n === 0, 'no credit for it');
const locked = await (await sheet(2, unit2.mc.map((q) => L[q.answer]).join(''))).text();
ok(/locked after a sheet that did not pass/.test(locked), 'the unit is locked after a failed sheet, as online');

const blank = unit2.mc.map(() => 'X').join('');
ok(/locked/.test(await (await sheet(2, blank)).text()), 'still locked for a blank sheet too');

// Blank answers (X) before any lock: wrong, nothing more. Two blanks and 18 right still pass.
const unit3 = JSON.parse(fs.readFileSync('src/content/units/CTS/3.json', 'utf8'));
const twoBlank = unit3.mc.map((q, i) => (i < 2 ? 'x' : L[q.answer])).join('');
const blanks = await (await sheet(3, twoBlank)).text();
ok(/Passed: 18 of 20 right/.test(blanks), 'a sheet with two blanks (x) and 18 right passes', blanks.slice(0, 300));
const [g3] = db(`SELECT SUM(verdict = 'wrong') AS wrong, SUM(answer_text = '') AS blank FROM answer_grades g JOIN paper_sheets p ON p.attempt_id = g.attempt_id WHERE p.student_id = '${code}' AND p.scope = 'u:CTS/3'`)[0];
ok(g3 && g3.wrong === 2 && g3.blank === 2, 'the blanks are recorded as blank, wrong answers', JSON.stringify(g3));

/* ---- what staff see ----------------------------------------------------------------------- */
const sg = await (await go('/staff/groups', {}, asStaff)).text();
const row = sg.split('<tr>').find((r) => r.includes(`Kenya pilot ${tag}`)) || '';
ok(/<td>1<\/td><td>3<\/td>/.test(row), 'the staff page counts the group\'s learners and sheets', row);
ok(!sg.includes(code), 'the staff page shows no student code');
const after = await (await go('/coord', {}, asCoord())).text();
ok(after.includes(NAME) && /2 of 13 passed/.test(after), 'the coordinator\'s page shows the units passed');

await fetch(`${BASE}/api/student/${code}`, { method: 'DELETE' });

if (fails.length) { console.error(`coordinator pages: ${fails.length} of ${checks} checks failed`); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); }
console.log(`coordinator pages: ${checks} checks passed`);
