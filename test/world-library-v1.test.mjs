import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('src/pages/CTSWorldLibrary.astro', 'utf8');
const csv = readFileSync('research/world-library/catalog-v1.csv', 'utf8');
const resourceCsv = readFileSync('research/world-library/external-libraries-v1.csv', 'utf8');

// CSV parser handles the commas and escaped quotations within title/rights fields.
function parseRow(line) {
  const fields = [];
  let field = '', quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      fields.push(field); field = '';
    } else field += ch;
  }
  assert.equal(quoted, false, 'unterminated quoted field');
  fields.push(field);
  return fields;
}
const rows = csv.trim().split(/\r?\n/).map(parseRow);
const [header, ...books] = rows;
const worlds = resourceCsv.trim().split(/\r?\n/).map(parseRow).slice(1);
const cards = [...html.matchAll(/<article class="book-card"[\s\S]*?<\/article>/g)].map(m => m[0]);

test('catalog and page agree on item counts', () => {
  assert.deepEqual(header, ['title', 'author_or_editor', 'subject', 'tradition_or_context', 'language', 'reading_level', 'provider', 'source_url', 'rights_and_use_note', 'checked_date']);
  assert.equal(books.length, 38);
  assert.equal(worlds.length, 10);
  assert.equal(cards.length, books.length);
  assert.equal((html.match(/class="source-card"/g) || []).length, worlds.length);
  assert.match(html, /Showing 38 of 38 books/);
  assert.match(html, /38<\/strong> actual book records/);
});

test('source URLs are unique HTTPS links and actually appear on the catalog page', () => {
  const bookLinks = books.map(r => {
    assert.equal(r.length, header.length);
    assert.ok(r[0] && r[1] && r[4] && r[8], 'required catalog metadata missing');
    const uri = new URL(r[7]);
    assert.equal(uri.protocol, 'https:');
    assert.ok(html.includes(r[7].replaceAll('&', '&amp;')), 'book URL absent in HTML: ' + r[7]);
    return r[7];
  });
  assert.equal(new Set(bookLinks).size, bookLinks.length);
  for (const row of worlds) {
    assert.equal(row.length, 7);
    assert.equal(new URL(row[1]).protocol, 'https:');
    assert.ok(html.includes(row[1]));
  }
});

test('critical student languages and subject filters exist', () => {
  const languages = new Set(books.flatMap(r => r[4].split('/').map(v => v.trim())));
  for (const language of ['English', 'French', 'Spanish', 'Swahili', 'Latin', 'Greek']) {
    assert.ok(languages.has(language), 'catalog lacks language ' + language);
    assert.ok(html.includes('<option value="' + language + '">'), 'page cannot filter ' + language);
  }
  assert.match(html, /<option value="Evangelism">Evangelism<\/option>/);
  assert.match(html, /const normal=s=>/);
  assert.match(html, /languages\.includes\(lang\.value\)/);
});

test('first-screen books put introductory before demanding texts', () => {
  const priority = { Introductory: 0, Intermediate: 1, Advanced: 2 };
  const score = cards.map(c => {
    const level = c.match(/data-level="([^"]+)"/)?.[1];
    assert.ok(Object.hasOwn(priority, level), 'unexpected book reading level');
    return priority[level];
  });
  for (let i = 1; i < score.length; i++) {
    assert.ok(score[i] >= score[i - 1], 'card sorting puts difficult work before introductory material');
  }
});

test('catalog does not copy protected modern books or grant academic credit', () => {
  assert.match(html, /not required coursework or faculty endorsements/i);
  assert.match(html, /does not store external book files/i);
  assert.ok(cards.every(c => c.includes('target="_blank" rel="noopener noreferrer"')));
  assert.doesNotMatch(html, /type="password"|action="\/api\//);
});
