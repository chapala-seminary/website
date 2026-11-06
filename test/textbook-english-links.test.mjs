import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// #284: companion English texts already contain the complete text and can
// link to the existing CTS reading room. Do not link to absent .txt/digest
// exports or create placeholder books that mislead students.
for (const { book, reader, room } of [
  { book: 'Galatians', reader: 'CTSGalatians_Findlay_English.html', room: 'CTSGalatiansReadings' },
  { book: 'Romans', reader: 'CTSRomans_Moule_English.html', room: 'CTSRomansReadings' },
]) {
  test(book + ' English companion links to existing content (#284)', () => {
    const html = fs.readFileSync(path.join('public/textbooks', reader), 'utf8');
    assert.match(html, /<nav id="contents">/);
    assert.match(html, /<a href="#contents">Complete text below \/ Texto completo a continuación<\/a>/);
    assert.match(html, new RegExp('<a href="../' + room + '\\.html">Supplemental reading room'));
    assert.ok(fs.existsSync(path.join('src/body/rooms', room + '.html')), 'reading-room source exists for build');
    assert.doesNotMatch(html, new RegExp('href="' + book + '_English\\.txt"'));
    assert.doesNotMatch(html, new RegExp('href="' + book + '_CTS_Digests\\.html"'));
    assert.ok(html.includes('id="chapter-I"'), 'complete English reader has numbered chapters');
  });
}
