/* The grading mode a page is built for (docs/ai-grading.md section 1).
 *
 *   CTS_GRADING_MODE=live    (the default) the page carries no answer keys:
 *                            every click and answer is graded by the server.
 *   CTS_GRADING_MODE=shadow  the page is what it was before AI grading, plus
 *                            one small script that posts each submitted unit
 *                            to /api/shadow.
 *
 * There is no "off". An unknown value stops the build rather than quietly
 * choosing one: a typo must not ship a live site with keys in it, or the
 * reverse.
 */
const raw = (process.env.CTS_GRADING_MODE ?? 'live').trim().toLowerCase();
if (raw !== 'live' && raw !== 'shadow') {
  throw new Error(`CTS_GRADING_MODE must be "live" or "shadow", not "${process.env.CTS_GRADING_MODE}"`);
}
export const gradingMode: 'live' | 'shadow' = raw;
export const live = gradingMode === 'live';

type Q = Record<string, unknown>;

/* What a live page may carry of a question: what the student reads, and the
   fields that decide how a bank is drawn. A whitelist, so a key field added
   to the content later stays off the page until someone chooses to ship it.
   Never: answer, correct, why, accept, model, keywords, rubric, minHits. */
const SHOWN = ['stem', 'text', 'prompt', 'options', 'group', 'chapter', 'reading'];

export function strip(q: Q, qid: string): Q {
  const out: Q = { qid };
  for (const k of SHOWN) if (k in q) out[k] = q[k];
  return out;
}

/* A unit's questions with their ids (section 2): u:<Prefix>/<n>/<kind>/<i>,
   Prefix being the folder the unit file lives in (its pagePrefix). */
export function unitScope(pagePrefix: string, unit: number): string {
  return `u:${pagePrefix}/${unit}`;
}
export function liveUnit<T extends { mc?: Q[]; fill?: Q[]; sa?: Q[] }>(u: T, scope: string): T & { grading: 'live'; scope: string } {
  const out: any = { ...u, grading: 'live', scope };
  for (const kind of ['mc', 'fill', 'sa'] as const) {
    if (Array.isArray(u[kind])) out[kind] = u[kind]!.map((q, i) => strip(q, `${scope}/${kind}/${i}`));
  }
  return out;
}

/* A textbook or reading test: the whole bank of prompts goes out, because
   the server draws and the page shows the ones it names. Ids are bank
   positions: tb:<slug>/fill/<i> (rd: for a required-reading test). */
export function liveBank(bank: { slug: string; kind?: string; questions: Q[] }): { scope: string; questions: Q[] } {
  const scope = `${bank.kind === 'reading' ? 'rd' : 'tb'}:${bank.slug}`;
  return { scope, questions: bank.questions.map((q, i) => strip(q, `${scope}/fill/${i}`)) };
}
