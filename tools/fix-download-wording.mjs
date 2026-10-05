/* Reading Rooms written for the offline course download said the readings were
 * "included in your course download" (Dr. Cook's beta audit, 4 Oct 2026, item 4).
 * On the website they are on the site. Exact sentences only, so nothing else
 * on a page can change; `--check` fails if any old wording remains.
 *
 *   node tools/fix-download-wording.mjs          rewrite
 *   node tools/fix-download-wording.mjs --check  report what is left
 */
import fs from 'node:fs';
import path from 'node:path';

const R = [
  // English
  ['included in your course download — so every one opens directly on your device, with no internet connection at all.',
   'available here on the site — every one opens directly from this page, with nothing to download.'],
  ['included in your course download &mdash; so every one opens directly on your device, with no internet connection at all.',
   'available here on the site &mdash; every one opens directly from this page, with nothing to download.'],
  ['included in your course download — so all of them open directly on your device, in English or Spanish, with no internet connection at all.',
   'available here on the site — all of them open directly from this page, in English or Spanish, with nothing to download.'],
  ['included in your course download &mdash; so all of them open directly on your device, in English or Spanish, with no internet connection at all.',
   'available here on the site &mdash; all of them open directly from this page, in English or Spanish, with nothing to download.'],
  ['included in your course download — so every one opens directly on your device, in English or Spanish, with no internet connection at all.',
   'available here on the site — every one opens directly from this page, in English or Spanish, with nothing to download.'],
  ['included in your course download and opening directly on your device — no internet connection needed.',
   'available here on the site and opening directly from this page — nothing to download.'],
  ['and they are included in your course download.', 'and they are available here on the site.'],
  ['and included in your course download so it can be read entirely offline.', 'and available to read here on the site.'],
  ['in English or Spanish, entirely offline.', 'in English or Spanish.'],
  ['<strong>Fully offline:</strong>', '<strong>On this site:</strong>'],
  ['teaching digests included in this package.', 'teaching digests, available here on the site.'],
  ['Bilingual offline edition · English', 'Bilingual edition · English'],
  ['in English and Spanish, that work fully offline.', 'in English and Spanish, here on the site.'],
  ['The whole volume is in your download; the other forty-four sketches will keep.',
   'The other forty-four sketches in the volume will keep.'],
  ['The whole book is in your download; there are thirty more days after this one.',
   'There are thirty more days in the book after this one.'],
  ['>Reading offline &amp; the links<', '>Reading the digests &amp; the links<'],
  ['>Reading offline<', '>Reading the digests<'],
  ['Each one opens directly on your device from the link below, with no internet connection needed.',
   'Each one opens directly from the link below.'],
  ['· read on your device', '· read here on the site'],
  ['>Leer sin conexión y los enlaces<', '>Las lecturas y los enlaces<'],
  ['>Leer sin conexión<', '>Cómo leer los resúmenes<'],
  ['Cada una se abre directamente en su dispositivo desde el enlace de abajo, sin necesidad de conexión a internet.',
   'Cada una se abre directamente desde el enlace de abajo.'],
  // Spanish
  ['e incluido en la descarga de su curso — de modo que cada una se abre directamente en su dispositivo, sin conexión alguna.',
   'y disponible aquí en el sitio — cada una se abre directamente desde esta página, sin nada que descargar.'],
  ['e incluido en la descarga de su curso &mdash; de modo que cada una se abre directamente en su dispositivo, sin conexión alguna.',
   'y disponible aquí en el sitio &mdash; cada una se abre directamente desde esta página, sin nada que descargar.'],
  ['e incluido en la descarga de su curso — de modo que todas se abren directamente en su dispositivo, en inglés o español, sin conexión alguna.',
   'y disponible aquí en el sitio — todas se abren directamente desde esta página, en inglés o español, sin nada que descargar.'],
  ['e incluido en la descarga de su curso &mdash; de modo que todas se abren directamente en su dispositivo, en ingl&eacute;s o espa&ntilde;ol, sin conexi&oacute;n alguna.',
   'y disponible aqu&iacute; en el sitio &mdash; todas se abren directamente desde esta p&aacute;gina, en ingl&eacute;s o espa&ntilde;ol, sin nada que descargar.'],
  ['e incluido en la descarga de su curso — de modo que cada una se abre directamente en su dispositivo, en inglés o español, sin conexión alguna.',
   'y disponible aquí en el sitio — cada una se abre directamente desde esta página, en inglés o español, sin nada que descargar.'],
  ['incluido en la descarga de su curso y que se abre directamente en su dispositivo — sin necesidad de conexión.',
   'disponible aquí en el sitio y que se abre directamente desde esta página — sin nada que descargar.'],
  ['y vienen incluidas en la descarga de su curso.', 'y están disponibles aquí en el sitio.'],
  ['de dominio público e incluido en la descarga de su curso para leerse sin conexión.',
   'de dominio público y disponible para leerse aquí en el sitio.'],
  ['en inglés o español, enteramente sin conexión.', 'en inglés o español.'],
  ['en ingl&eacute;s o espa&ntilde;ol, enteramente sin conexi&oacute;n.', 'en ingl&eacute;s o espa&ntilde;ol.'],
  ['<strong>Totalmente sin conexión:</strong>', '<strong>En este sitio:</strong>'],
  ['resúmenes bilingües originales del STC incluidos en este paquete.', 'resúmenes bilingües originales del STC, disponibles aquí en el sitio.'],
  ['escritos para este curso e incluidos en su descarga para que se abran sin conexión a internet.',
   'escritos para este curso y guardados en esta página, de modo que, una vez cargada, se abren sin conexión a internet.'],
  ['El volumen entero está en su descarga; los otros cuarenta y cuatro bosquejos pueden esperar.',
   'Los otros cuarenta y cuatro bosquejos del volumen pueden esperar.'],
  ['El libro entero está en su descarga; hay treinta días más después de éste.',
   'Hay treinta días más en el libro después de éste.'],
];
const OLD = /course download|descarga de su curso|in your download|en su descarga|included in this package|incluidos en este paquete|Fully offline|Totalmente sin conexi|offline edition|entirely offline|enteramente sin conexi|work fully offline|Reading offline|Leer sin conexi|read on your device|on your device from the link/i;

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (!/admin|vendor/.test(f)) walk(p); }
    else if (/\.(html|json|astro|js)$/.test(f)) files.push(p);
  }
})('public'); files.push(...fs.readdirSync('src', { recursive: true }).map((f) => path.join('src', f)).filter((f) => /\.(html|json|astro)$/.test(f)));

const check = process.argv.includes('--check');
let changed = 0, left = 0;
for (const f of files) {
  let t = fs.readFileSync(f, 'utf8'); const t0 = t;
  if (!check) for (const [a, b] of R) t = t.split(a).join(b);
  if (t !== t0) { fs.writeFileSync(f, t); changed++; }
  // CTSResources.html describes a third-party study program that does run offline
  if (f.endsWith('CTSResources.html') || f.endsWith('reading-shelf.json')) continue;
  for (const line of t.split('\n')) if (OLD.test(line)) { left++; console.log(`${f}: ${line.trim().slice(0, 200)}`); }
}
console.log(`${changed} file(s) changed; ${left} line(s) with old download wording`);
if (check && left) process.exit(1);
