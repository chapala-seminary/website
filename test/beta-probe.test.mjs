import assert from 'node:assert/strict';
import { checkBeta, EXPECTED } from '../tools/check-beta-activation.mjs';
assert.equal(EXPECTED, 71, '79 staged tests less the eight awaiting faculty review');
const expected = '1234abcd';
const policy = { ok: true, requiredFrom: Object.fromEntries(Array.from({ length: EXPECTED }, (_, i) => ['test' + i, '2026-10-13T00:00:00Z'])) };
const calls = [];
const response = url => new Response(url.includes('version.txt') ? `2026-10-14 ${expected}` : JSON.stringify(policy));
await checkBeta(expected, async url => { calls.push(url); return response(url); }, async () => {});
assert.equal(calls.length, 2);
calls.length = 0;
await checkBeta(expected, async url => {
  calls.push(url);
  return url.startsWith('https://beta.chapalaseminary.org') ? new Response('', { status: 403, headers: { 'cf-mitigated': 'challenge' } }) : response(url);
}, async () => {});
assert.equal(calls.length, 3);
assert.ok(calls.slice(1).every(url => url.includes('.workers.dev')));
for (const failure of ['wrong-release', 'bad-policy', 'server-error', 'not-found']) {
  calls.length = 0;
  await assert.rejects(checkBeta(expected, async url => {
    calls.push(url);
    if (failure === 'not-found') return new Response('', { status: 404 });
    if (failure === 'server-error') return new Response('', { status: 500 });
    if (failure === 'wrong-release') return new Response('2026-10-14 oldbuild');
    if (url.includes('version.txt')) return response(url);
    return new Response(JSON.stringify({ ok: true, requiredFrom: {} }));
  }, async () => {}));
  assert.ok(calls.every(url => !url.includes('.workers.dev')), 'a real release or policy failure must not be hidden by fallback');
}
calls.length = 0;
await assert.rejects(checkBeta(expected, async url => {
  calls.push(url);
  return url.startsWith('https://beta.chapalaseminary.org')
    ? new Response('', { status: 403, headers: { 'cf-mitigated': 'challenge' } })
    : new Response('', { status: 404 });
}, async () => {}), /chapala-seminary-beta\.chapalatheological\.workers\.dev.*HTTP 404/);
assert.equal(calls.filter(url => url.includes('.workers.dev')).length, 10, 'an unavailable fallback cannot count as success');
console.log('PASS — beta probe verifies the candidate and its 71 requirements; challenge fallback succeeds and stale release, bad policy and HTTP 500 fail.');
