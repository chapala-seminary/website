// Students who registered twice, merged (Wayne, 5 Oct 2026;
// tools/merge-duplicate-students.sql, migrations/0010_merged_students.sql).
//
// Two halves. First the merge itself, on a database built from every
// migration in Node's own SQLite: who is merged and who is not, which record
// stays and with which program, that every row moves and nothing is counted
// twice, and that a second run changes nothing. Then, against the running
// Worker and its local D1, what the student sees afterwards: both codes reach
// one record, the code that was merged away still saves progress but cannot
// pull the program back down, the roster counts the student once, and a
// request to be forgotten forgets every code.
//
//   node test/merge.test.mjs                         (the SQL half only)
//   API_BASE=... MERGE_STATE=... MERGE_CONFIG=... node test/merge.test.mjs
import { DatabaseSync } from 'node:sqlite';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';

let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };
const MERGE = fs.readFileSync('tools/merge-duplicate-students.sql', 'utf8');
const PREVIEW = fs.readFileSync('tools/merge-duplicate-students-preview.sql', 'utf8');

/* ---- 1. the merge, in SQLite ------------------------------------------- */
{
  const db = new DatabaseSync(':memory:');
  for (const m of fs.readdirSync('migrations').filter((f) => f.endsWith('.sql')).sort())
    db.exec(fs.readFileSync(`migrations/${m}`, 'utf8'));

  const T = (d) => `2026-0${d}T00:00:00.000Z`;
  const student = (id, name, email, track, created, extra = {}) => db.prepare(
    `INSERT INTO students (id, name, email, track, goal, country, lang, email_verified_at, contact_opt_out_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, name, email, track, extra.goal ?? null, extra.country ?? null,
    extra.lang ?? null, extra.verified ?? null, extra.optOut ?? null, created, created);
  const unit = (id, course, n, at) => db.prepare('INSERT INTO unit_progress VALUES (?, ?, ?, ?)').run(id, course, n, at);
  const done = (id, code, track, at) => db.prepare('INSERT INTO course_completions (student_id, code, completed_at, track) VALUES (?, ?, ?, ?)').run(id, code, at, track);

  // One person, twice: Certificate first, Th.M. later, overlapping work.
  student('A1', 'Ana Ruiz', 'ana@example.org', 'cert', T('1-01'), { country: 'MX' });
  student('A2', ' ana ruiz ', 'ANA@example.org ', 'thm', T('2-01'), { lang: 'es', verified: T('2-02') });
  unit('A1', 'st', 1, T('3-05')); unit('A2', 'st', 1, T('3-01')); unit('A2', 'st', 2, T('3-02'));
  done('A1', 'CTSOTS', 'cert', T('4-01')); done('A2', 'CTSOTS', 'thm', T('4-02')); done('A2', 'CTSNT', 'thm', T('4-03'));
  db.prepare("INSERT INTO certificates (verify_code, student_id, student_name, level, course, title, issued_at) VALUES ('V1', 'A2', 'Ana Ruiz', 'course', 'CTSNT', 'NT', ?)").run(T('4-04'));
  db.prepare("INSERT INTO textbook_results VALUES ('A2', 'cults', ?)").run(T('4-05'));
  for (const id of ['A1', 'A2'])   // the same notice on both records: one survives
    db.prepare("INSERT INTO notifications (student_id, kind, code, status, attempts, created_at) VALUES (?, 'course', 'CTSOTS', 'sent', 1, ?)").run(id, T('4-01'));
  db.prepare("INSERT INTO notifications (student_id, kind, code, status, attempts, created_at) VALUES ('A2', 'course', 'CTSNT', 'sent', 1, ?)").run(T('4-03'));
  db.prepare("INSERT INTO outreach (student_id, kind, status, sent_at) VALUES ('A2', 'quiet', 'sent', ?)").run(T('4-06'));
  db.prepare("INSERT INTO contact_tokens VALUES ('tok-a2', 'A2')").run();

  // Three times, the last asking for no more notes, one an Associate.
  student('B1', 'Ben', 'ben@example.org', 'cert', T('1-01'));
  student('B2', 'Ben', 'ben@example.org', 'cert', T('1-02'), { goal: 'assoc' });
  student('B3', 'Ben', 'ben@example.org', 'cert', T('1-03'), { optOut: T('5-01') });
  // Two people, one address: never merged.
  student('C1', 'Carlos Pérez', 'family@example.org', 'mdiv', T('1-01'));
  student('C2', 'Lucía Pérez', 'family@example.org', 'cert', T('1-02'));
  // Tester-mode placeholders: never merged.
  student('T1', 'Tester', 'tester@chapalaseminary.org', 'cert', T('1-01'));
  student('T2', 'Tester', 'tester@chapalaseminary.org', 'cert', T('1-02'));
  // No email: nothing to match on.
  student('N1', 'Nadie', null, 'cert', T('1-01'));
  student('N2', 'Nadie', null, 'cert', T('1-02'));

  const preview = db.prepare(PREVIEW).all();
  const act = (row) => preview.find((p) => p.roster_row === db.prepare('SELECT rowid AS r FROM students WHERE id = ?').get(row).r)?.action;
  ok(act('A1') === 'keep' && act('A2') === 'merge', 'preview: the first registration is kept, the second merged', JSON.stringify(preview));
  ok(act('B1') === 'keep' && act('B2') === 'merge' && act('B3') === 'merge', 'preview: three registrations, two merged');
  ok(act('C1') === 'check' && act('C2') === 'check', 'preview: one address, two names -- left to be checked');
  ok(!act('T1') && !act('N1'), 'preview: tester placeholders and records with no email are not listed');
  ok(!preview.some((p) => Object.values(p).some((v) => /@|Ruiz|Ben|Pérez|^A\d$/.test(String(v)))),
    'preview shows no names, emails or codes');
  ok(db.prepare('SELECT COUNT(*) AS n FROM students WHERE merged_into IS NOT NULL').get().n === 0, 'preview changes nothing');

  db.exec(MERGE);
  const s = (id) => db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  ok(s('A2').merged_into === 'A1' && s('A2').merged_at, 'the later record points at the first');
  ok(s('A1').merged_into === null, 'the first record stays live');
  ok(s('A1').track === 'thm', 'the record that stays takes the more advanced program (Th.M. over Certificate)', s('A1').track);
  ok(s('A1').name === 'Ana Ruiz' && s('A1').country === 'MX', 'its own name and country are kept');
  ok(s('A1').lang === 'es' && s('A1').email_verified_at === T('2-02'), 'a language and a verified email it lacked are taken from the other');
  ok(s('B2').merged_into === 'B1' && s('B3').merged_into === 'B1', 'three registrations become one');
  ok(s('B1').goal === 'assoc', 'Associate over Certificate', JSON.stringify(s('B1')));
  ok(s('B1').contact_opt_out_at === T('5-01'), 'a request for no more notes on either record is honoured');
  ok(!s('C1').merged_into && !s('C2').merged_into && s('C1').track === 'mdiv' && s('C2').track === 'cert',
    'two people sharing an address are left exactly as they were');
  ok(!s('T2').merged_into && !s('N2').merged_into, 'tester placeholders and records with no email are left alone');

  const units = db.prepare("SELECT unit, completed_at FROM unit_progress WHERE student_id = 'A1' ORDER BY unit").all();
  ok(units.length === 2 && units[0].completed_at === T('3-01'), 'units: both kept once, the earlier date wins', JSON.stringify(units));
  const comps = db.prepare("SELECT code, track, completed_at FROM course_completions WHERE student_id = 'A1' ORDER BY code").all();
  ok(comps.length === 2, 'completions: two courses, not three', JSON.stringify(comps));
  ok(comps[1].code === 'CTSOTS' && comps[1].track === 'thm' && comps[1].completed_at === T('4-01'),
    'a course on both records keeps the earlier date and rises to the higher level', JSON.stringify(comps[1]));
  ok(db.prepare("SELECT student_id FROM certificates WHERE verify_code = 'V1'").get().student_id === 'A1', 'the certificate moves, its verification code unchanged');
  ok(db.prepare("SELECT COUNT(*) AS n FROM textbook_results WHERE student_id = 'A1'").get().n === 1, 'the textbook test moves');
  ok(db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE student_id = 'A1'").get().n === 2, 'notices: one per course, the duplicate dropped');
  ok(db.prepare("SELECT COUNT(*) AS n FROM outreach WHERE student_id = 'A1'").get().n === 1, 'notes sent move');
  ok(db.prepare("SELECT COUNT(*) AS n FROM contact_tokens WHERE student_id = 'A2'").get().n === 1, 'a stop-notes link stays with the code it was sent for');
  for (const t of ['unit_progress', 'course_completions', 'textbook_results', 'certificates', 'notifications', 'outreach'])
    ok(db.prepare(`SELECT COUNT(*) AS n FROM ${t} WHERE student_id IN ('A2', 'B2', 'B3')`).get().n === 0, `nothing left in ${t} on a merged record`);

  const act2 = db.prepare("SELECT student_id, units_passed, courses_done FROM student_activity WHERE student_id IN ('A1', 'A2')").all();
  ok(act2.length === 1 && act2[0].units_passed === 2 && act2[0].courses_done === 2, 'the roster view: one row, the whole record', JSON.stringify(act2));
  ok(db.prepare("SELECT COUNT(*) AS n FROM degree_progress WHERE student_id IN ('B1', 'B2', 'B3')").get().n === 1, 'the progress view: one row');

  const before = JSON.stringify(['students', 'unit_progress', 'course_completions', 'notifications'].map((t) => db.prepare(`SELECT * FROM ${t} ORDER BY 1, 2`).all()));
  db.exec(MERGE.replace(/strftime\('%Y-%m-%dT%H:%M:%fZ', 'now'\)/g, "'unchanged'"));
  const after = JSON.stringify(['students', 'unit_progress', 'course_completions', 'notifications'].map((t) => db.prepare(`SELECT * FROM ${t} ORDER BY 1, 2`).all()))
    .replace(/"unchanged"/g, 'null');
  ok(before.replace(/"updated_at":"[^"]*"/g, '') === after.replace(/"updated_at":(null|"[^"]*")/g, ''), 'a second run changes nothing');

  // A pair marked by hand, after checking the roster, is moved by the next run.
  db.prepare("UPDATE students SET merged_into = 'C1', merged_at = 'x' WHERE id = 'C2'").run();
  unit('C2', 'nt', 1, T('3-01'));
  db.exec(MERGE);
  ok(db.prepare("SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = 'C1'").get().n === 1, 'a pair merged by hand is moved by the next run');
}

/* ---- 2. what the student sees, against the Worker ----------------------- */
const BASE = process.env.API_BASE;
if (BASE && process.env.MERGE_STATE && process.env.MERGE_CONFIG) {
  const jpost = async (p, b) => { const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }); return { status: r.status, body: await r.json().catch(() => null) }; };
  const jget = async (p, init) => { const r = await fetch(BASE + p, init); return { status: r.status, body: await r.json().catch(() => null) }; };
  const tag = crypto.randomBytes(4).toString('hex');
  const email = `merge-${tag}@example.org`;
  const first = (await jpost('/api/register', { name: `Merge Test ${tag}`, email, track: 'cert' })).body.code;
  const second = (await jpost('/api/register', { name: `Merge Test ${tag}`, email, track: 'thm' })).body.code;
  ok(first && second && first !== second, 'two registrations, two codes');
  await jpost('/api/sync', { code: first, progress: [{ course: 'st', unit: 1, completedAt: '2026-03-01T00:00:00.000Z' }] });
  await jpost('/api/sync', { code: second, progress: [{ course: 'st', unit: 2, completedAt: '2026-03-02T00:00:00.000Z' }] });

  execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', process.env.MERGE_STATE,
    '--config', process.env.MERGE_CONFIG, '--file', 'tools/merge-duplicate-students.sql'], { stdio: 'ignore' });

  const viaFirst = await jget(`/api/student/${first}`);
  const viaSecond = await jget(`/api/student/${second}`);
  ok(viaSecond.status === 200, 'the code that was merged away still opens the record', `got ${viaSecond.status}`);
  ok(viaFirst.body?.progress?.length === 2 && JSON.stringify(viaFirst.body) === JSON.stringify(viaSecond.body),
    'both codes open the same record, with both units', JSON.stringify(viaSecond.body?.progress));
  ok(viaFirst.body?.student?.track === 'thm', 'with the more advanced program', viaFirst.body?.student?.track);

  // The browser that held the second code keeps saving -- into the one record --
  // but its old details do not overwrite the merged record's.
  await jpost('/api/sync', { code: second, student: { name: 'Old Browser Name', track: 'cert' },
    progress: [{ course: 'st', unit: 3, completedAt: '2026-03-03T00:00:00.000Z' }] });
  const after = await jget(`/api/student/${first}`);
  ok(after.body?.progress?.length === 3, 'progress saved through the merged code reaches the record', JSON.stringify(after.body?.progress));
  ok(after.body?.student?.track === 'thm' && after.body?.student?.name === `Merge Test ${tag}`,
    'a merged code cannot pull the program down or rename the student', JSON.stringify(after.body?.student));

  // The roster counts the student once.
  const { key: JWK } = JSON.parse(fs.readFileSync('test/fixtures/access-test-key.json', 'utf8'));
  const b64 = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
  const head = b64({ alg: 'RS256', kid: 'cts-test-1', typ: 'JWT' });
  const body = b64({ aud: ['cts-test-aud'], iss: 'https://cts-test.cloudflareaccess.com', exp: Math.floor(Date.now() / 1000) + 3600, email: 'staff@example.test' });
  const TOKEN = `${head}.${body}.${crypto.sign('sha256', Buffer.from(`${head}.${body}`), crypto.createPrivateKey({ key: JWK, format: 'jwk' })).toString('base64url')}`;
  const roster = (await jget('/staff/students.json', { headers: { 'cf-access-jwt-assertion': TOKEN } })).body || [];
  ok(roster.filter((r) => r.email === email).length === 1, 'the roster lists the student once', `${roster.filter((r) => r.email === email).length} rows`);

  // Forgotten under every code.
  const del = await jget(`/api/student/${second}`, { method: 'DELETE' });
  ok(del.status === 200, 'a request to be forgotten works through the merged code', `got ${del.status}`);
  ok((await jget(`/api/student/${first}`)).status === 404 && (await jget(`/api/student/${second}`)).status === 404,
    'and both codes are gone');
} else {
  console.log('  (the Worker half skipped: no API_BASE, MERGE_STATE and MERGE_CONFIG)');
}

console.log(`${checks} checks on merging students who registered twice`);
if (fails.length) { console.log('FAIL\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('PASS — one student, one record, and every code still works.');
