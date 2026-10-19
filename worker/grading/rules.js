/* The pass rules (docs/ai-grading.md, section 5), as plain functions.
 * Nothing here touches the database, so test/grading-unit.test.mjs can pin
 * every rule without a Worker. */

export const PASS_RATIO = 0.9;
export const MIN_SA_WORDS = 15;
export const MAX_FILL_CHARS = 80;
export const MAX_SA_CHARS = 2000;
export const LOCK_MASTERS_MIN = 15;
export const LOCK_OTHER_MIN = 2;
export const HOURLY_CAP = 150;        // graded written items per student per hour
export const OPEN_APPEALS_MAX = 3;

export const isMasters = (track) => track === 'thm' || track === 'mdiv';
export const lockMinutes = (track) => (isMasters(track) ? LOCK_MASTERS_MIN : LOCK_OTHER_MIN);
export const need = (total) => Math.ceil(total * PASS_RATIO);

/* What each track must pass. Certificate: multiple choice. Associate: and
   fill-in. Th.M. and M.Div.: and short answer. The track is the stored
   student record's (studentLevel), never the request's. */
export function counts(track) {
  return { mc: true, fill: track === 'assoc' || isMasters(track), sa: isMasters(track) };
}

/** What a scope asks for. totals: { mc, fill, sa } item counts on offer;
 *  meta: the textbook/reading test's { pass } (a fill-in-only test, passed
 *  with the same number on every track), or null for a unit. */
export function requirements(track, totals, meta) {
  if (meta && meta.pass != null) {
    const total = totals.fill;
    return { mc: { total: 0, need: 0 }, fill: { total, need: Math.min(meta.pass, total) }, sa: { total: 0, need: 0 } };
  }
  const c = counts(track);
  const part = (on, total) => ({ total, need: on && total > 0 ? need(total) : 0 });
  return { mc: part(c.mc, totals.mc), fill: part(c.fill, totals.fill), sa: part(c.sa, totals.sa) };
}

/** state: { mcRight, mcBanked, fillRight, fillPending, saMet, saPending, mcPending }
 *  Each part passes when its `need` is met. A pending item might still
 *  turn out right, so the answer is only final when it cannot change:
 *    - passed: passes even if every pending item turns out wrong;
 *    - failed: fails even if every pending item turns out right;
 *    - pending: otherwise. */
export function evaluate(req, state) {
  const lo = (part, right, banked) => !part.need || banked || right >= part.need;
  const hi = (part, right, pending, banked) => !part.need || banked || right + pending >= part.need;
  const worst = lo(req.mc, state.mcRight, state.mcBanked) && lo(req.fill, state.fillRight, false) && lo(req.sa, state.saMet, false);
  const best = hi(req.mc, state.mcRight, state.mcPending || 0, state.mcBanked) && hi(req.fill, state.fillRight, state.fillPending || 0, false)
    && hi(req.sa, state.saMet, state.saPending || 0, false);
  const status = worst ? 'passed' : best ? 'pending' : 'failed';
  // Which parts fell short counting every pending item as wrong: names the lock.
  const mcOK = lo(req.mc, state.mcRight, state.mcBanked);
  return { status, mcOK, fillOK: lo(req.fill, state.fillRight, false), saOK: lo(req.sa, state.saMet, false) };
}

/** 'sa' locks only the written part (multiple choice is banked); 'full' locks everything. */
export const lockKind = (mcOK) => (mcOK ? 'sa' : 'full');

/* Text that talks to the grader instead of answering the question. Held for
   a person, never sent to the model. The patterns are narrower than the bare
   words "ignore" and "instructions" on purpose: "the Torah is God's
   instruction" and "do not ignore the Old Testament" are ordinary answers.
   (Contract deviation, recorded in docs/ai-grading.md section 5.) */
const INJECTION = [
  // English
  /\b(ignore|disregard|forget|override|bypass)\b[^.!?\n]{0,40}\b(instructions?|rules?|rubric|prompt|directions?|guidelines|criteria|above|previous)\b/i,
  /\b(ignore|disregard|forget)\s+(all|any|every|previous|prior|your|these|those|the above|the previous|everything above)\b/i,
  /\bmark\s+(this|it|me|my answer|that)\b[^.!?\n]{0,20}\b(as\s+)?(correct|right|met|passed?|full)\b/i,
  /\b(grade|score|rate)\s+(this|it|me)\b[^.!?\n]{0,20}\b(as\s+)?(met|correct|right|pass|full|100)/i,
  /\bsystem\s+(prompt|message|instructions?)\b/i,
  /\byou\s+are\s+(an?|the)\s+(ai|a\.i\.|grader|language model|llm|assistant|chatbot)\b/i,
  /\bas\s+an?\s+(ai|language model)\b/i,
  /\b(new|updated)\s+instructions?\b/i,
  /\boutput\s+(only\s+)?(met|json|the following)\b/i,
  // Spanish
  /\b(ignora|ignore|ignorar|olvida|omite)\b[^.!?\n]{0,40}\b(instrucciones|reglas|r[uú]brica|indicaciones|anteriores|todo lo anterior)\b/i,
  /\bmarca(r|lo|la)?\s+(esto|esta|este|mi respuesta|la respuesta)?\s*como\s+(correct[ao]|bien|aprobad[ao])\b/i,
  /\b(prompt|mensaje|instrucciones)\s+del\s+sistema\b/i,
  /\beres\s+(un|una)\s+(ia|inteligencia artificial|calificador|evaluador)\b/i,
  // French
  /\b(ignore|ignorez|oublie|oubliez|n[ée]glige)\b[^.!?\n]{0,40}\b(instructions|consignes|r[èe]gles|grille|pr[ée]c[ée]dent)/i,
  /\bmarque(z)?\s+(ceci|cela|cette r[ée]ponse|ma r[ée]ponse)?\s*comme\s+(correct|juste|r[ée]ussi)/i,
  /\b(prompt|invite|message|instructions)\s+syst[èe]me\b/i,
  /\b(tu es|vous [êe]tes)\s+(un|une)\s+(ia|intelligence artificielle|correcteur|[ée]valuateur)\b/i,
];
export function looksLikeInstruction(text) {
  const t = String(text || '');
  return INJECTION.some((re) => re.test(t));
}
