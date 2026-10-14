// Shared editorial wording for the standalone readers and their generators.
import fs from 'node:fs';
const notices = JSON.parse(fs.readFileSync(new URL('../src/data/editorial-notices.json', import.meta.url), 'utf8'));
export function readerEditorialNotice(book, lang) {
  if (book !== 'joshua') return '';
  const n = notices.blaikie;
  return `<div class="note" data-cts-editorial="blaikie" lang="${lang}"><p><b>${n.title[lang]}.</b> ${n.body[lang]}</p></div>\n`;
}
