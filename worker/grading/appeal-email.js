/* What a student is told when a written answer has been looked at again
   (docs/ai-grading.md, section 9). It says the answer was reviewed, not who
   reviewed it: Wayne may have the review prepared for him (6 Nov 2026), so the
   email does not claim a faculty member did it alone. Plain words, in the student's
   language, never the faculty note. Pure text: no imports but the language rule. */
import { emailLanguage } from '../email.js';

export function appealEmail({ name, upheld, passed, courseDone, feedback, site, lang }) {
  lang = emailLanguage(lang);
  const fb = feedback ? { en: `\n\nComment from the review: ${feedback}`, es: `\n\nComentario de la revisión: ${feedback}`, fr: `\n\nCommentaire de la révision : ${feedback}` }[lang] : '';
  const T = {
    en: {
      subject: upheld ? 'We looked again at your answer' : 'Your answer has been changed',
      text: `Dear ${name},\n\nYou asked Chapala Theological Seminary to look again at a written answer. ` +
        (upheld ? 'It has been reviewed, and the first result stands.' : `It has been reviewed, and your answer now counts as correct.${passed ? ' You have now passed this test.' : ''}${courseDone ? ' You have now completed the course.' : ''}`) +
        `${fb}\n\nOpen ${site} and go to the page you were on to see it.\n\nChapala Theological Seminary`,
    },
    es: {
      subject: upheld ? 'Revisamos de nuevo su respuesta' : 'Su respuesta ha sido cambiada',
      text: `Estimado/a ${name}:\n\nUsted pidió al Seminario Teológico de Chapala que revisara de nuevo una respuesta escrita. ` +
        (upheld ? 'Su respuesta fue revisada, y el primer resultado se mantiene.' : `Su respuesta fue revisada, y ahora cuenta como correcta.${passed ? ' Ahora usted ha aprobado este examen.' : ''}${courseDone ? ' Ahora usted ha completado el curso.' : ''}`) +
        `${fb}\n\nAbra ${site} y vaya a la página en la que estaba para verlo.\n\nSeminario Teológico de Chapala`,
    },
    fr: {
      subject: upheld ? 'Nous avons examiné de nouveau votre réponse' : 'Votre réponse a été modifiée',
      text: `Bonjour ${name},\n\nVous avez demandé au Séminaire théologique de Chapala d’examiner de nouveau une réponse écrite. ` +
        (upheld ? 'Votre réponse a été réexaminée, et le premier résultat est maintenu.' : `Votre réponse a été réexaminée, et elle compte maintenant comme correcte.${passed ? ' Vous avez maintenant réussi cet examen.' : ''}${courseDone ? ' Vous avez maintenant terminé le cours.' : ''}`) +
        `${fb}\n\nOuvrez ${site} et allez à la page où vous étiez pour le voir.\n\nSéminaire théologique de Chapala`,
    },
  };
  return T[lang];
}
