/* The pass rules (docs/ai-grading.md, section 5), as plain functions.
 * Nothing here touches the database, so test/grading-unit.test.mjs can pin
 * every rule without a Worker. */

export const PASS_RATIO = 0.9;
export const MIN_SA_WORDS = 15;
export const MAX_FILL_CHARS = 80;
export const MAX_SA_CHARS = 4000;
/* A final's essays may be longer (its meta row says how long), never beyond this. */
export const MAX_ESSAY_CHARS = 12000;
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
  // A final (fn:): fill-ins and essays, the same marks on every track (meta.pass = { fill, sa }).
  if (meta && meta.kind === 'final') {
    const p = meta.pass && typeof meta.pass === 'object' ? meta.pass : {};
    const part = (total, n) => ({ total, need: total ? Math.min(Number.isInteger(n) && n > 0 ? n : total, total) : 0 });
    return { mc: { total: 0, need: 0 }, fill: part(totals.fill, p.fill), sa: part(totals.sa, p.sa) };
  }
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
  // "ignore"/"forget" only with words aimed at the grader. Common words such as
  // "rules", "previous", "every" or "your" held honest answers ("Pharaoh chose to
  // ignore every warning", "do not forget these promises") for a faculty review
  // that was not happening (audit, 6 Nov 2026).
  /\b(ignore|disregard|forget|override|bypass)\b[^.!?\n]{0,40}\b(instructions?|rubric|prompt|grading|marking|scoring|the grader|the ai|the model|everything above)\b/i,
  /\b(ignore|disregard|forget)\s+((all|any|the|your)\s+){0,2}(previous|prior|earlier|above)\s+(instructions?|rules|directions|prompts?|messages?|guidelines|text|criteria)\b/i,
  /\b(ignore|disregard|forget)\s+the\s+above\s*(and|[.,;:]|$)/i,
  /\bmark\s+(this|it|me|my answer|that)\b[^.!?\n]{0,20}\b(as\s+)?(correct|right|met|passed?|full)\b/i,
  /\b(grade|score|rate)\s+(this|it|me)\b[^.!?\n]{0,20}\b(as\s+)?(met|correct|right|pass|full|100)/i,
  /\bsystem\s+(prompt|message|instructions?)\b/i,
  /\byou\s+are\s+(an?|the)\s+(ai|a\.i\.|grader|language model|llm|assistant|chatbot)\b/i,
  /\bas\s+an?\s+(ai|language model)\b/i,
  /\b(new|updated)\s+instructions?\b/i,
  /\boutput\s+(only\s+)?(met|json|the following)\b/i,
  // Spanish
  /\b(ignora|ignore|ignorar|olvida|omite)\b[^.!?\n]{0,40}\b(instrucciones|r[uú]brica|indicaciones anteriores|reglas anteriores|todo lo anterior|texto anterior|el evaluador|la ia|criterios de evaluaci[oó]n)\b/i,
  /\bmarca(r|lo|la)?\s+(esto|esta|este|mi respuesta|la respuesta)?\s*como\s+(correct[ao]|bien|aprobad[ao])\b/i,
  /\b(prompt|mensaje|instrucciones)\s+del\s+sistema\b/i,
  /\beres\s+(un|una)\s+(ia|inteligencia artificial|calificador|evaluador)\b/i,
  // French
  /\b(ignore|ignorez|oublie|oubliez|n[ée]glige)\b[^.!?\n]{0,40}\b(instructions|consignes|grille|le correcteur|l'ia|r[èe]gles pr[ée]c[ée]dentes|texte pr[ée]c[ée]dent)/i,
  /\bmarque(z)?\s+(ceci|cela|cette r[ée]ponse|ma r[ée]ponse)?\s*comme\s+(correct|juste|r[ée]ussi)/i,
  /\b(prompt|invite|message|instructions)\s+syst[èe]me\b/i,
  /\b(tu es|vous [êe]tes)\s+(un|une)\s+(ia|intelligence artificielle|correcteur|[ée]valuateur)\b/i,
];
/* Papers are long pastoral prose, so the short-answer list above refuses honest
   sentences ("Do not ignore your neighbor", "Israel would forget all that God had
   done"). With no faculty step behind a paper, a match is a hard refusal, so papers
   use this narrower list: only text that plainly addresses the grader, an AI, a
   rubric or a prompt. paperInstruction returns the matching passage, so the page
   can show the student exactly what to change. */
const PAPER_INJECTION = [
  /\b(ignore|disregard|forget|override|bypass)\b[^.!?\n]{0,40}\b(instructions?|rubric|prompt|grading criteria|scoring criteria|the grader|the ai)\b/i,
  /\bmark\s+(this|it|me|my paper|this paper)\b[^.!?\n]{0,20}\b(as\s+)?(correct|passed?|full marks|100)\b/i,
  /\b(grade|score|rate)\s+(this|it|me|my paper|this paper)\b[^.!?\n]{0,20}\b(as\s+)?(pass|passed|full|100|perfect)/i,
  /\bsystem\s+(prompt|message|instructions?)\b/i,
  /\byou\s+are\s+(an?|the)\s+(ai|a\.i\.|grader|language model|llm|chatbot)\b/i,
  /\bas\s+an?\s+(ai|language model)\b/i,
  /\b(new|updated)\s+instructions?\s+(for|to)\s+(you|the grader|the ai|the model)\b/i,
  /\boutput\s+(only\s+)?(json|the following)\b/i,
  /\b(ignora|ignorar|olvida|omite)\b[^.!?\n]{0,40}\b(instrucciones|r[uú]brica|criterios de evaluaci[oó]n|el evaluador|la ia)\b/i,
  /\bmarca(r|lo|la)?\s+(esto|este trabajo|mi trabajo)?\s*como\s+(aprobad[ao]|correct[ao])\b/i,
  /\b(prompt|mensaje|instrucciones)\s+del\s+sistema\b/i,
  /\beres\s+(un|una)\s+(ia|inteligencia artificial|calificador|evaluador)\b/i,
  /\b(ignore|ignorez|oublie|oubliez)\b[^.!?\n]{0,40}\b(instructions|consignes|grille d'[ée]valuation|le correcteur)\b/i,
  /\b(prompt|invite|message|instructions)\s+syst[èe]me\b/i,
  /\b(tu es|vous [êe]tes)\s+(un|une)\s+(ia|intelligence artificielle|correcteur|[ée]valuateur)\b/i,
];
export function paperInstruction(text) {
  const t = String(text || '');
  for (const re of PAPER_INJECTION) {
    const m = re.exec(t);
    if (m) return t.slice(Math.max(0, m.index - 40), Math.min(t.length, m.index + m[0].length + 40)).replace(/\s+/g, ' ').trim();
  }
  return null;
}
export function looksLikeInstruction(text) {
  const t = String(text || '');
  return INJECTION.some((re) => re.test(t));
}
