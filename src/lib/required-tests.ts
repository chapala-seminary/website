/* The tests a course requires on the M.Div. and Th.M. tracks, as the pages
   hand them to public/assets/js/cts-record.js: from worker/catalog.json, the
   same map the Worker applies (worker/awards.js testsFor), textbook first. A
   course may require two -- its textbook and its five readings (9 Oct 2026);
   a test with `requiredFrom` counts only from that moment, null meaning not
   yet in force. */
import catalog from '../../worker/catalog.json';

export type RequiredTest = { slug: string; page: string; kind: string; requiredFrom?: string | null };
type Entry = { code: string; page: string; kind: string; requiredFrom?: string | null };
const map = catalog.textbooks as Record<string, Entry>;
const courses = catalog.courses as Record<string, { code: string; units: number[]; tests?: string[] }>;

export function requiredTests(slugs: string[] = []): RequiredTest[] {
  return slugs.map((slug) => ({ slug, page: map[slug].page, kind: map[slug].kind,
    ...('requiredFrom' in map[slug] ? { requiredFrom: map[slug].requiredFrom ?? null } : {}) }));
}
/** Every test of the course a test belongs to, by the test's slug: a unit
    course from its `tests`, a single-page course from the map's code. */
export function testsOfCourseWith(slug: string): RequiredTest[] {
  const unit = Object.values(courses).find((c) => c.tests?.includes(slug));
  if (unit) return requiredTests(unit.tests);
  const code = map[slug]?.code;
  return requiredTests(Object.keys(map).filter((s) => map[s].code === code)
    .sort((a, b) => (map[a].kind === 'textbook' ? 0 : 1) - (map[b].kind === 'textbook' ? 0 : 1)));
}
/** The unit course a test belongs to, as [slug, entry], or undefined for a
    single-page course. */
export function unitCourseWith(slug: string) {
  return Object.entries(courses).find(([, c]) => c.tests?.includes(slug));
}
