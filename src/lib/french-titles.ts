/* French names for the page frame: course titles from src/content/courses
 * (one canonical French name per course), and the French titles of textbooks
 * and required readings, derived from their English ones. The <title> of
 * every French page is built from them; the lesson's own French masthead
 * names a translated unit. */
import fs from 'node:fs';
import type { HTMLElement } from 'node-html-parser';

const json = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dir = (d: string) => fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => json(`${d}/${f}`));
type Bi = { en: string; es: string; fr?: string };
let cache: { byCode: Map<string, Bi>; byPrefix: Map<string, Bi>; books: Map<string, any>; readings: Map<string, any>; rooms: Record<string, any> } | null = null;
function data() {
  if (cache) return cache;
  const courses = dir('src/content/courses');
  const byCode = new Map(courses.map((c: any) => [c.code, c.title]));
  // A unit page's prefix is its course's entry less "Unit1.html"; single-page courses use their file name.
  const byPrefix = new Map(courses.map((c: any) => [c.entry.replace(/(?:Unit\d+)?\.html$/, ''), c.title]));
  const books = new Map(dir('src/content/textbooks').map((b: any) => [b.page, b]));
  const readings = new Map(dir('src/content/readings').map((r: any) => [r.page, r]));
  const rooms = json('src/data/rooms.json').rooms;
  return (cache = { byCode, byPrefix, books, readings, rooms });
}
export const SITE_FR = 'Séminaire théologique de Chapala';

export function frCourse(code: string): string {
  const t = data().byCode.get(code);
  if (!t?.fr) throw new Error(`src/content/courses/${code}.json has no French title`);
  return t.fr;
}
/* A book keeps its own (English) title; only our description of the
   assignment is French. */
export function frBookTitle(title: string): string {
  return title.replace(/\(assigned excerpts\)/, '(extraits choisis)').replace(/\(assigned chapters\)/, '(chapitres choisis)')
    .replace(/\(assigned selections\)/, '(sélections choisies)').replace(/\(Howell, adapted\)/, '(Howell, adaptation)');
}
export const frReadingsTitle = (course: string) => `${frCourse(course)} : lectures obligatoires`;
export const frReadingsRoom = (course: string, page: string) => page === 'CTSWRRequired'
  ? 'les cinq lectures assignées sur la page des lectures obligatoires'
  : `les cinq lectures de la salle de lecture du cours ${frCourse(course)}`;

function unitTitle(root: HTMLElement, file: string, translated: boolean) {
  const m = /^(.*)Unit(\d+)\.html$/.exec(file) || /^(ethics)_unit0*(\d+)\.html$/.exec(file);
  if (!m) return null;
  if (translated) {
    const h1 = root.querySelector('.cts-masthead h1 .cts-reading[lang="fr"]') || root.querySelector('h1 .cts-reading[lang="fr"]');
    if (h1) return h1.text.replace(/^\P{L}+/u, '').trim();
  }
  const course = data().byPrefix.get(m[1] === 'ethics' ? 'ethics_unit01' : m[1]);
  return course?.fr ? `${course.fr} — Unité ${m[2]}` : null;
}
/** The <title> of a French page, or null where it must stay as it is. */
export function frenchPageTitle(root: HTMLElement, file: string, translated: boolean): string | null {
  // Certificate pages name the award and the completed course from
  // document.title (cts-certify.js, cts-completion.js); those stay English.
  if (root.querySelector('script[src*="cts-certify"], script[src*="cts-completion"]')) return null;
  const d = data();
  const unit = unitTitle(root, file, translated);
  if (unit) return unit;
  const page = file.replace(/\.html$/, '');
  const single = d.byPrefix.get(page);
  if (single?.fr) return single.fr;
  const test = /^(.*)Test$/.exec(page);
  if (test && d.books.has(test[1])) return `Examen du manuel — ${frBookTitle(d.books.get(test[1]).title.en)}`;
  if (test && d.readings.has(test[1])) return `Examen des lectures obligatoires — ${frCourse(d.readings.get(test[1]).course)}`;
  if (d.books.has(page)) return `Manuel de master — ${frBookTitle(d.books.get(page).title.en)}`;
  const room = d.rooms[page];
  if (room) {
    if (room.kind === 'honors') return `Lecture avec mention — ${SITE_FR}`;
    if (room.kind === 'required') return `${frCourse(room.course)} — Lectures obligatoires pour l’examen de master`;
    return `${frCourse(room.course)} — ${/Honors/.test(room.heading.en) ? 'Salle de lecture pour la mention' : 'Salle de lecture complémentaire'}`;
  }
  return null;
}
export function frenchTitle(root: HTMLElement, file: string, _lesson: unknown, translated: boolean) {
  const title = frenchPageTitle(root, file, translated);
  if (!title) return;
  const node = root.querySelector('title');
  if (node) node.set_content(title.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
}

/* The course pages a French reader can study in French (draft translations):
   a unit course whose first lesson has French, and WiseSpeak, whose French
   is built onto its own page (tools/french-wisespeak.mjs). */
export function frenchCourseEntries(): Set<string> {
  const out = new Set<string>(['CTS_WiseSpeak_Preaching.html']);
  for (const c of dir('src/content/courses') as any[]) {
    const m = /^(.*)Unit(\d+)\.html$/.exec(c.entry);
    const p = m && `src/content/lessons/${m[1]}/${m[2]}.json`;
    if (p && fs.existsSync(p) && json(p).blocks.some((b: any) => b.text?.fr)) out.add(c.entry);
  }
  return out;
}
