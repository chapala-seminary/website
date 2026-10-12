#!/usr/bin/env node
/* One standard pair of notices in each reading room whose course has a
 * Master's test being introduced (requiredFrom present: null or a date):
 *
 *   #cts-textbook  the textbook test -- multiple choice for the new books
 *                  (Dr. Cook, 11 Oct 2026) -- at the top of the room
 *   #cts-required  the five-reading test (fill-in), before the honors card,
 *                  where the room has none yet
 *
 * Their wording does not depend on whether the requirement is in force yet:
 * the test pages say that, so activating (tools/activate-required.mjs) needs
 * no change here. Replaces the ad-hoc notices the October installs left
 * (CTS-COMPLETE-*, cts-textbook-test-pilot) and the "not activated" line of
 * the full-book cards. Rooms of tests in force since their install
 * (Genesis, World Religions) and the nine original textbooks are untouched.
 *
 *   node tools/room-test-notices.mjs           # report
 *   node tools/room-test-notices.mjs --write
 */
import fs from 'node:fs';

const WRITE = process.argv.includes('--write');
const load = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8')));
const books = load('src/content/textbooks');
const readings = load('src/content/readings');

const tbNotice = (b, reading = true) => {
  const mc = b.test.questions.every((q) => q.options);
  const kind = mc
    ? { en: 'twenty multiple-choice questions', es: 'veinte preguntas de opción múltiple' }
    : { en: 'twenty fill-in-the-blank questions', es: 'veinte preguntas para completar' };
  reading = reading
    ? { en: ' It is separate from the reading test on the five digests below: passing one does not pass the other. On the M.Div. and Th.M. tracks both tests are being introduced; each test\'s page says whether it is in force yet. Until then any student may take them, and a pass is kept in your record.', es: ' Es distinto del examen de lecturas sobre los cinco resúmenes que siguen: aprobar uno no aprueba el otro. En los trayectos M.Div. y Th.M. ambos exámenes se están introduciendo; la página de cada examen indica si ya está en vigor. Mientras tanto cualquier estudiante puede presentarlos, y su aprobación queda en su expediente.' }
    : { en: " On the M.Div. and Th.M. tracks this test is being introduced; its page says whether it is in force yet. Until then any student may take it, and a pass is kept in your record.", es: ' En los trayectos M.Div. y Th.M. este examen se está introduciendo; su página indica si ya está en vigor. Mientras tanto cualquier estudiante puede presentarlo, y su aprobación queda en su expediente.' };
  return `<!-- CTS-TEXTBOOK-TEST (tools/room-test-notices.mjs) -->
<div class="notice" id="cts-textbook"><span class="lang-en block"><strong>The Master's textbook test:</strong> read <a href="/${b.page}.html">${b.title.en}</a>, then take <a href="/${b.page}Test.html">its test</a>: ${kind.en}, drawn from forty; eighteen right passes. Each answer is marked at once, and when it is wrong the right answer is shown.${reading.en ?? ''}</span><span class="lang-es block"><strong>El examen del libro de texto de maestría:</strong> lea <a href="/${b.page}.html">${b.title.es}</a> y luego presente <a href="/${b.page}Test.html">su examen</a>: ${kind.es}, tomadas de cuarenta; se aprueba con dieciocho. Cada respuesta se califica en seguida y, si es incorrecta, se muestra la correcta.${reading.es ?? ''}</span></div>
<!-- /CTS-TEXTBOOK-TEST -->
`;
};
const rdNotice = (r) => `<div class="notice" id="cts-required"><span class="lang-en block"><strong>The Master's reading test:</strong> separate from the honors invitation below. Honors asks you to read any three of these digests; the Master's test covers all five. It has twenty fill-in-the-blank questions, four from each reading, drawn from forty; eighteen right passes, each answer is marked at once, and you may try again after a short wait. The test is being introduced: <a href="${r.page}Test.html">its page</a> says whether it is in force yet. Until then any student may take it, and a pass is kept in your record.</span><span class="lang-es block"><strong>El examen de lecturas de maestría:</strong> es distinto de la invitación a los honores que sigue. Los honores le piden leer tres de estos resúmenes; el examen de maestría abarca los cinco. Tiene veinte preguntas para completar, cuatro de cada lectura, tomadas de cuarenta; se aprueba con dieciocho, cada respuesta se califica en seguida, y puede intentarlo de nuevo tras una breve espera. El examen se está introduciendo: <a href="${r.page}Test.html">su página</a> indica si ya está en vigor. Mientras tanto cualquier estudiante puede presentarlo, y su aprobación queda en su expediente.</span></div>`;

let changed = 0, problems = 0;
for (const r of readings.filter((x) => 'requiredFrom' in x)) {
  const file = `src/body/rooms/${r.page}.html`;
  if (!fs.existsSync(file)) { console.error(`${r.slug}: no room ${file}`); problems++; continue; }
  const before = fs.readFileSync(file, 'utf8');
  let s = before;
  // the ad-hoc notices of the October installs
  s = s.replace(/^<!-- CTS-COMPLETE-[A-Z]+-2026-10-11 -->.*\n/m, '');
  s = s.replace(/^<!-- [^\n]*textbook exam[^\n]*-->\n<div class="notice cts-textbook-test-pilot">\n[\s\S]*?\n<\/div>\n/m, '');
  s = s.replace(/ A separate required textbook exam has not been activated\./, '').replace(/ Todavía no se ha activado un examen obligatorio de este libro\./, '');
  s = s.replace(/<!-- CTS-TEXTBOOK-TEST [^\n]*-->\n[\s\S]*?<!-- \/CTS-TEXTBOOK-TEST -->\n/, '');
  const b = books.find((x) => x.course === r.course && 'requiredFrom' in x);
  if (b) s = tbNotice(b) + s;
  // an existing reading-test notice is left as it is (Pentecostalism's pilot wording)
  if (/<div class="notice" id="cts-required">/.test(s)) { /* keep */ }
  else if (/<!-- =+ HONORS =+ -->/.test(s)) s = s.replace(/^(\s*)(<!-- =+ HONORS =+ -->)/m, `$1<!-- ============ MASTER'S READING TEST ============ -->\n${rdNotice(r)}\n$1$2`);
  else if (b) s = s.replace('<!-- /CTS-TEXTBOOK-TEST -->\n', `<!-- /CTS-TEXTBOOK-TEST -->\n${rdNotice(r)}\n`);
  else s = rdNotice(r) + '\n' + s;   // no honors card and no textbook notice: at the top of the room
  if (/cts-textbook-test-pilot|CTS-COMPLETE-|has not been activated/.test(s)) { console.error(`${r.page}: an old notice is left`); problems++; }
  if (s !== before) { changed++; console.log(`${r.page}: ${b ? 'textbook + reading' : 'reading'} notices`); if (WRITE) fs.writeFileSync(file, s); }
}
/* A course with a new textbook test but no reading test yet: the textbook
   notice goes at the top of the course's reading room, <course>Readings. */
for (const b of books.filter((x) => 'requiredFrom' in x && !readings.some((r) => r.course === x.course && 'requiredFrom' in r))) {
  const file = `src/body/rooms/${b.course}Readings.html`;
  if (!fs.existsSync(file)) { console.log(`${b.slug}: no room ${file}; the units and the book page carry the test`); continue; }
  const before = fs.readFileSync(file, 'utf8');
  const s = tbNotice(b, false) + before.replace(/<!-- CTS-TEXTBOOK-TEST [^\n]*-->\n[\s\S]*?<!-- \/CTS-TEXTBOOK-TEST -->\n/, '');
  if (s !== before) { changed++; console.log(`${b.course}Readings: textbook notice`); if (WRITE) fs.writeFileSync(file, s); }
}
console.log(`${changed} room(s) ${WRITE ? 'written' : 'to change (add --write)'}`);
process.exit(problems ? 1 : 0);
