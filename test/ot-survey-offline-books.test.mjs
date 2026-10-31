import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const sources = [
  ['en', 'ot-survey-mcelwain-2025-en.pdf', 3183435, '846c228833bc2deb0670c8c7c60d7e0742ffacf90e3f2ff06a5d51005ce8bbfc'],
  ['es', 'ot-survey-mcelwain-2025-es.pdf', 2329168, '967095b6aa3db782805681f6243db447324f2787f998dca37f1ee29d3c0ba547'],
  ['fr', 'ot-survey-utley-2014-fr.pdf', 1883912, 'f10b4117e2feadfd1fa7ce3742212dc67b7b2bd5c62007278fad8c234be19f07'],
  ['sw', 'ot-survey-vmi-2001-sw.pdf', 1681088, 'c6e736148cc2436eb9eaa4b6cbaa5019f911651a87b222bbdc691166d1b9954e'],
];
const page = readFileSync('public/CTSOTSurveyBooks.html', 'utf8');
const library = readFileSync('src/pages/CTSStudyLibrary.astro', 'utf8');
test('four complete publisher-original OT Survey PDFs retain exact verified source bytes', () => {
  for (const [lang, filename, bytes, expected] of sources) {
    const pdf = readFileSync('public/textbooks/' + filename);
    assert.equal(pdf.length, bytes, lang + ' PDF size changed');
    assert.equal(pdf.subarray(0, 5).toString('utf8'), '%PDF-', lang + ' not a PDF');
    assert.equal(createHash('sha256').update(pdf).digest('hex'), expected, lang + ' publisher original changed');
    assert.ok(page.includes('/textbooks/' + filename), lang + ' download missing from guide');
  }
});
test('all four 13-unit reading maps exist without mutating graded textbook', () => {
  for (const lang of ['en', 'es', 'fr', 'sw']) {
    const start = page.indexOf('<section class="book" id="' + lang + '"');
    assert.ok(start !== -1, lang + ' language block missing');
    const end = page.indexOf('</section>', start);
    const section = page.slice(start, end);
    assert.equal((section.match(/<tr><th scope="row">/g) ?? []).length, 13, lang + ' must map 13 units');
  }
  assert.ok(page.includes('Swahili corrections'));
  assert.ok(page.includes('Publisher') || page.includes('publisher'));
  assert.ok(page.includes('noindex,nofollow'), 'stage as faculty preview until release approval');
  assert.ok(library.includes('CTSOTSurveyBooks.html'), 'no Study Library entry');
});


test('Claude faculty-review corrections: Unit 1 intros, five readings, Swahili library link', () => {
  assert.ok(!page.includes('the five assigned reading rooms'), 'there is one room containing five readings');
  assert.ok(page.includes('the five assigned readings'));
  const introMarkers = {
    en: ['Introduction to the Old Testament', '11–14 (introduction); 17–24 (Genesis)'],
    es: ['Introducción al Antiguo Testamento', '13–16 (introducción); 19–26 (Génesis)'],
    fr: ['Introduction à l’Ancien Testament', '15–17 (introduction); 31–33 (Genèse)'],
    sw: ['Utangulizi wa Agano la Kale', '25–26 (utangulizi); 27 (Mwanzo)'],
  };
  for (const [lang, markers] of Object.entries(introMarkers)) {
    const first = page.indexOf('<section class="book" id="' + lang + '"');
    const section = page.slice(first, page.indexOf('</section>', first));
    for (const marker of markers) assert.ok(section.includes(marker), lang + ' introduction missing: ' + marker);
  }
  const sw = JSON.parse(readFileSync('src/data/interface/static/sw/MainPages.json', 'utf8'));
  const source = 'Old Testament Survey: complete optional books in four languages (download once, study offline)';
  const matches = sw.pairs.filter((pair) => pair[0] === source);
  assert.equal(matches.length, 1, 'exactly one Study Library dictionary pair needed');
  assert.ok(matches[0][1].includes('vitabu kamili vya hiari'), 'Swahili text should describe optional books');
});
