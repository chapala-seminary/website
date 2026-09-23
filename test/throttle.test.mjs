/* Guessing a student code costs something.
 *
 * THIS RUNS LAST, AND HAS TO.
 *
 * The throttle counts failed lookups per address. Every test in this suite
 * reaches the Worker from 127.0.0.1, so they all share one address and one
 * budget -- which means the moment these assertions have spent it, every
 * other suite starts getting 429s and failing for a reason that has nothing
 * to do with what it is testing. That is not a flaw in the throttle; it is
 * what a shared address looks like, and real students do not share one.
 *
 * So these assertions live in their own file, run after everything else, and
 * this comment exists so that whoever reorders the suite finds out here
 * rather than from thirteen unrelated failures.
 *
 *   node test/throttle.test.mjs           (API_BASE, against a live Worker)
 */
const BASE = process.env.API_BASE || 'http://127.0.0.1:8797';

let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail ? `\n        ${detail}` : ''));
}
const jpost = async (p, b) => {
  const r = await fetch(BASE + p, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};

/* Sixty bits is an argument about arithmetic. This is the part that is a
   defence: a wrong code costs the person trying it, and a right one costs a
   student nothing. Both halves matter -- a throttle that also stops the
   legitimate restore is a denial of service the seminary built itself. */

const guess = (n) => `CTS-ZZZZ-ZZZZ-Z${String(n).padStart(3, '0')}`;
let blockedAt = 0;
for (let i = 1; i <= 30 && !blockedAt; i++) {
  const r = await fetch(BASE + `/api/student/${guess(i)}`);
  if (r.status === 429) blockedAt = i;
  else if (r.status !== 404) { blockedAt = -1; break; }
}
ok(blockedAt > 1 && blockedAt <= 25,
  'guessing student codes is cut off after a couple of dozen tries',
  `blocked at attempt ${blockedAt}`);

const limited = await fetch(BASE + `/api/student/${guess(99)}`);
ok(limited.status === 429, 'and stays cut off');
ok(!!limited.headers.get('retry-after'),
  'and says how long to wait, rather than just refusing');
ok(!/CTS-/.test(await limited.clone().text()),
  'the refusal does not echo the code that was tried');

/* Deleting somebody's record by guessing their code is the sharpest version
   of this, so it is behind the same budget. */
ok((await fetch(BASE + `/api/student/${guess(98)}`, { method: 'DELETE' })).status === 429,
  'and a guessed DELETE is refused too, not just a read');

/* The bucket is per kind of lookup, so exhausting the student-code budget
   must not take the certificate checker down with it -- an employer verifying
   a certificate has done nothing wrong. */
ok((await fetch(BASE + '/api/verify/ZZZZZZZZZZ')).status !== 429,
  'certificate verification is counted separately and still answers');

/* Registering is not a lookup and is deliberately not throttled: a room full
   of students signing up together is the normal case, not the abusive one. */
const after = await jpost('/api/register', { name: 'Throttle Survivor', track: 'cert' });
ok(after.status === 201 && !!after.body?.code,
  'registering still works while lookups are throttled', `status ${after.status}`);

console.log(`${checks} assertions on the guessing throttle`);
if (!fails.length) console.log('PASS — a wrong code costs the person trying it.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
