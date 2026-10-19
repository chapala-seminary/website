/* Keep evidence quotes in the grading record, not in place of teaching
 * feedback. This changes no verdict and needs no second model call. */
import { normalise, fold, ownWords } from './text.js';

const textOf = (s) => normalise(fold(s)).trim();

export function echoesAnswer(feedback, answer) {
  const f = textOf(feedback), a = textOf(answer);
  if (!f || !a) return false;
  if (f === a) return true;
  const words = f.split(' ').length;
  const added = ownWords(answer, feedback).length;
  // Catch a copied passage with a token prefix such as "You wrote: ...".
  // A brief quotation with a substantive explanation remains useful feedback.
  return words - added >= 4 && added < 6 && added / words < 0.4;
}

const FALLBACK = {
  met: {
    en: 'Your answer meets the required points and demonstrates understanding of the question.',
    es: 'Su respuesta cumple los puntos requeridos y demuestra comprensión de la pregunta.',
    fr: 'Votre réponse satisfait aux points requis et montre votre compréhension de la question.',
  },
  metSupport: {
    en: 'Your answer meets the required points. To develop your explanation further, you may add support from the assigned passage or course material.',
    es: 'Su respuesta cumple los puntos requeridos. Para desarrollar más su explicación, puede añadir apoyo del pasaje asignado o del material del curso.',
    fr: 'Votre réponse satisfait aux points requis. Pour développer votre explication, vous pouvez vous appuyer sur le passage indiqué ou le contenu du cours.',
  },
  partly: {
    en: 'Your answer addresses part of the question, but some required points are missing. Review the assigned material and explain how it supports your response.',
    es: 'Su respuesta aborda parte de la pregunta, pero faltan algunos puntos requeridos. Revise el material asignado y explique cómo respalda su respuesta.',
    fr: 'Votre réponse traite une partie de la question, mais certains points requis manquent. Relisez le contenu indiqué et expliquez comment il appuie votre réponse.',
  },
  not_met: {
    en: 'Your answer does not yet meet the required points. Review the question and assigned material, then explain the relevant teaching in your own words.',
    es: 'Su respuesta aún no cumple los puntos requeridos. Revise la pregunta y el material asignado; luego explique la enseñanza pertinente con sus propias palabras.',
    fr: 'Votre réponse ne satisfait pas encore aux points requis. Relisez la question et le contenu indiqué, puis expliquez l’enseignement pertinent avec vos propres mots.',
  },
};

export function shortAnswerFeedback(result, answer, lang) {
  // A met verdict already satisfies every essential point. Offer optional
  // development advice only when the validated result omits another point.
  const offerSupport = result.verdict === 'met' && result.points?.some((p) => !p.made);
  const fallback = offerSupport ? FALLBACK.metSupport : FALLBACK[result.verdict];
  if (!fallback) return result.feedback;
  if (result.feedback && !echoesAnswer(result.feedback, answer)) return result.feedback;
  return fallback[lang] || fallback.en;
}
