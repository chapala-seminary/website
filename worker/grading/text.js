/* Text rules for grading: one copy, on the server.
 *
 * normalise, fold, bare and the fill-in exact match are ported unchanged from
 * public/assets/js/cts-engine.js (lines ~758-828 at the time of porting) and
 * cts-fill.js. test/grading-unit.test.mjs runs them against the browser
 * engine's own functions so a drift shows. The browser no longer grades
 * written work, so this is the only copy that counts.
 */

/** Lower-case, punctuation to spaces, one space between words, a space at each end. */
export function normalise(s) {
  return ' ' + String(s || '').toLowerCase().normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ') + ' ';
}

/* Accents do not decide a fill-in (Dr. Cook's beta pass, 30 Sept 2026):
   "geografia" is "geografía". Both sides are folded the same way, so a
   misspelling still fails. The tilde of n is kept: "año" and "ano" differ. */
export function fold(s) {
  s = String(s || '').toLowerCase();
  if (!s.normalize) return s;
  return s.normalize('NFD').replace(/ñ/g, 'ñ').replace(/(\p{Script=Latin})[̀-ͯ]+/gu, '$1').normalize('NFC');
}

/** The words compared, less one leading article: "a hypocrite" is "hypocrite". */
export function bare(s) {
  return normalise(fold(s)).trim().replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)/, '');
}

/** The languages a fill-in answer is accepted in: the reader's and the source. */
export function fillCodes(lang) {
  return lang === 'fr' ? ['fr', 'en'] : ['en', 'es'];
}

/** A fill-in is right when the student's words, normalised, are exactly the
 *  answer or one of the accepted alternatives. Exact, not "contains".
 *  key: { answer: {en,es,fr}, accept: {en:[],es:[],fr:[]} } */
export function exactFill(key, given, lang) {
  const a = bare(given);
  if (!a) return false;
  const acc = (key && key.accept) || {};
  let forms = [];
  for (const code of fillCodes(lang)) forms = forms.concat(key && key.answer && key.answer[code], acc[code] || []);
  for (const f of forms) if (f && bare(f) === a) return true;
  return false;
}

/** The form a fill-in answer is stored and cached under. */
export function normAnswer(s) { return bare(s); }

/** Words in a written answer. */
export function wordCount(s) {
  const t = String(s || '').trim();
  if (!t) return 0;
  return normalise(t).trim().split(' ').filter(Boolean).length;
}

/* The prompt's own words do not earn credit. docs/short-answer-keyword-repairs.md
   proposed this for the keyword grader: remove from the answer every run of
   four or more words that also appears in the question, then see what is left.
   An answer that is the question pasted back, or the question with a few
   words added, has nothing of its own. */
export const COPY_RUN = 4;        // words in a row that count as copied
export const COPY_REMAINDER = 6;  // fewer words than this left over: nothing of the student's own

/** The words of `answer` left after copied runs of the prompt are removed. */
export function ownWords(prompt, answer) {
  const p = normalise(fold(prompt)).trim().split(' ').filter(Boolean);
  const a = normalise(fold(answer)).trim().split(' ').filter(Boolean);
  if (p.length < COPY_RUN || a.length < COPY_RUN) return a;
  const runs = new Set();
  for (let i = 0; i + COPY_RUN <= p.length; i++) runs.add(p.slice(i, i + COPY_RUN).join(' '));
  const copied = new Array(a.length).fill(false);
  for (let i = 0; i + COPY_RUN <= a.length; i++)
    if (runs.has(a.slice(i, i + COPY_RUN).join(' ')))
      for (let j = i; j < i + COPY_RUN; j++) copied[j] = true;
  return a.filter((_, i) => !copied[i]);
}

/** True when, with the prompt's own runs taken out, too little is left to be an answer. */
export function copiedOnly(prompt, answer) {
  return ownWords(prompt, answer).length < COPY_REMAINDER;
}
