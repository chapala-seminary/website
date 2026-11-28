import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {measure, references} from '../tools/portuguese-coverage.mjs';

test('coverage separates absent, stale, machine and reported human fields', () => {
  const stamp = s => createHash('sha1').update(s).digest('hex').slice(0, 12);
  const fields = measure({blocks: [
    {text: {en: 'First', pt: ''}},
    {text: {en: 'Changed', pt: 'Anterior'}, tr: {pt: {status: 'human', from: stamp('Old')}}},
    {text: {en: 'Current', pt: 'Atual'}, tr: {pt: {status: 'machine', from: stamp('Current')}}},
    {text: {en: 'Reviewed', pt: 'Revisado'}, tr: {pt: {status: 'human', from: stamp('Reviewed')}}},
  ]});
  assert.deepEqual(fields.map(f => f.state), ['missing', 'stale', 'machine-or-unreviewed', 'human-status-unverified']);
});

test('linked readers are inventoried independently, without query credentials', () => {
  const links = references('<a href="reader.html?token=PRIVATE#x">Reader</a><a href="https://example.test/book?key=PRIVATE">Book</a><a href="#part">Part</a>', '/Room.html');
  assert.deepEqual(links.map(l => l.target), ['/reader.html', 'https://example.test/book']);
  assert.doesNotMatch(JSON.stringify(links), /PRIVATE|token|key=/);
});

test('blank MC options are gaps; no answer or rubric text is exported', () => {
  const fields = measure({options: {en: ['One', 'Two'], pt: ['Um', ' ']}, answer: {en: 'PRIVATE'}, rubric: {en: 'PRIVATE'}, prompt: {en: 'Public', pt: 'Público'}});
  assert.equal(fields.length, 2);
  assert.equal(fields[0].state, 'missing');
  assert.equal(fields[1].state, 'present-unreviewed');
  assert.ok(!JSON.stringify(fields).includes('PRIVATE'));
});

test('textbook body provenance detects stale source and unequal option arrays are gaps', () => {
  const fields = measure({body: {en: 'Revised source', pt: 'Texto anterior'}, tr: {body: {pt: {status: 'machine', from: 'old-stamp'}}}, options: {en: ['One', 'Two'], pt: ['Um']}});
  assert.equal(fields[0].state, 'stale');
  assert.equal(fields[1].state, 'missing');
});
