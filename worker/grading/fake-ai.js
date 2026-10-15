/* A stand-in for env.AI in the test suite (docs/ai-grading.md, section 8).
 *
 * Used only when the Worker is given AI_FAKE, which only
 * test/wrangler.local.jsonc sets; tools/verify-worker-config.mjs refuses it in
 * any deployed configuration. It reads the same messages the real model would
 * and answers from hints written in the student's text:
 *
 *   [[met]] [[partly]] [[not_met]]   short answers
 *   [[right]] [[wrong]]              fill-ins
 *   [[pending]]                      the model is unsure
 *   (the reply also carries "contradicts": true for [[not_met]]; the server derives the final verdict from the points)
 *   [[error]]                        the call throws (any other hint in the same text is the verdict it would give)
 *   [[error:3040]]                   the call throws a capacity error (3040, 3036, 3007)
 *   [[primary-error]]                throws on GRADER_MODEL only; the fallback answers
 *   [[bad-json]]                     replies with text that is not JSON
 *   [[primary-bad-json]]             the same, on GRADER_MODEL only
 *   [[bad-quote]]                    "met", but quotes words the student never wrote (also when asked to repair them)
 *   [[bad-quote-once]]               the same, but the repair call (a third message) gets it right
 *   [[missing-item]]                 leaves the item out of the reply
 *
 * Without a hint a short answer is not_met and a fill-in is wrong, so a test
 * never passes by accident.
 */

const HINT = /\[\[([a-z0-9:_-]+)\]\]/gi;
const VERDICTS = new Set(['met', 'partly', 'not_met', 'right', 'wrong', 'pending']);
/* An answer may carry several hints: a failure ([[primary-error]] ...) and the verdict the model gives when it does answer. */
const hintsOf = (text) => [...String(text).matchAll(HINT)].map((m) => m[1].toLowerCase());

export function fakeAIRun(env, model, params) {
  const sys = params.messages.find((m) => m.role === 'system')?.content || '';
  const payload = JSON.parse(params.messages.find((m) => m.role === 'user').content);
  const fill = payload.kind === 'fill';
  const primary = model === env.GRADER_MODEL;
  const repairing = params.messages.length > 2;                                     // the repair call (model.js) adds two messages
  const all = payload.items.map((it) => hintsOf(it.student_answer));
  const hints = all.map((hs) => hs.find((h) => !VERDICTS.has(h)) || '');          // how the call goes wrong
  const said = all.map((hs) => hs.find((h) => VERDICTS.has(h)) || '');            // what it says when it works

  for (const h of hints) {
    if (h === 'error') throw new Error('fake AI error');
    if (h.startsWith('error:')) throw new Error(`AiError: ${h.slice(6)}: fake capacity error`);
    if (h === 'primary-error' && primary) throw new Error('fake primary model error');
  }
  const usage = { prompt_tokens: Math.ceil(sys.length / 4 + JSON.stringify(payload).length / 4), completion_tokens: 20 * payload.items.length };
  if (hints.includes('bad-json') || (primary && hints.includes('primary-bad-json')))
    return { response: 'Sure! Here is my grade: met', usage };

  const items = [];
  payload.items.forEach((it, i) => {
    const h = hints[i], v = said[i];
    if (h === 'missing-item') return;
    const stripped = it.student_answer.replace(/\[\[[^\]]*\]\]/g, ' ').trim() || it.student_answer;
    const quote = stripped.split(/\s+/).slice(0, 6).join(' ');
    if (fill) {
      const verdict = v === 'right' ? 'right' : v === 'pending' ? 'pending' : 'wrong';
      items.push({ qid: it.qid, reason: verdict === 'right' ? 'It names the same thing.' : 'It names something else.', verdict, points: [],
        feedback: verdict === 'right' ? 'Accepted: it names the same thing.' : verdict === 'wrong' ? 'Not quite: look again at what the blank asks for.' : '' });
      return;
    }
    const verdict = v === 'met' || (h === 'bad-quote' || h === 'bad-quote-once') ? 'met' : v === 'partly' ? 'partly' : v === 'pending' ? 'pending' : 'not_met';
    /* "partly": the first essential point is missed, every other point is made (the server
       derives the verdict from the points, so a rubric of one point cannot come out "partly"). */
    const missed = verdict === 'partly' ? it.rubric.findIndex((p) => p.essential) : -1;
    const points = it.rubric.map((p, k) => ({
      id: p.id,
      made: verdict === 'met' || (verdict === 'partly' && k !== missed),
      quote: '',
    }));
    const bq = h === 'bad-quote' || (h === 'bad-quote-once' && !repairing);
    for (const p of points) if (p.made) p.quote = bq ? 'words the student never wrote' : quote;
    items.push({ qid: it.qid, contradicts: verdict === 'not_met' && v === 'not_met', points, verdict,
      feedback: verdict === 'met' ? 'This makes the points the question asks for.'
        : verdict === 'partly' ? 'Some of it is there, but an essential idea is missing.'
          : verdict === 'pending' ? '' : 'This does not yet make the main point of the question.' });
  });
  // Half the time as an object, half as text, so both shapes of reply are exercised.
  const reply = { items };
  return { response: payload.items.length % 2 ? JSON.stringify(reply) : reply, usage };
}
