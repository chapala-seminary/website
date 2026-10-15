/* What a student is told when a faculty member has looked again at a written
   answer (docs/ai-grading.md, section 9). Plain words, in the student's
   language, never the faculty note. Pure text: no imports but the language rule. */
import { emailLanguage } from '../email.js';

export function appealEmail({ name, upheld, passed, courseDone, feedback, site, lang }) {
  lang = emailLanguage(lang);
  const fb = feedback ? { en: `\n\nThe faculty member wrote: ${feedback}`, es: `\n\nEl profesor escribió: ${feedback}`, fr: `\n\nLe membre de la faculté a écrit : ${feedback}` }[lang] : '';
  const T = {
    en: {
      subject: upheld ? 'We looked again at your answer' : 'Your answer has been changed',
      text: `Dear ${name},\n\nYou asked a faculty member at Chapala Theological Seminary to look again at a written answer. ` +
        (upheld ? 'They did, and the first result stands.' : `They did, and your answer now counts as correct.${passed ? ' You have now passed this test.' : ''}${courseDone ? ' You have now completed the course.' : ''}`) +
        `${fb}\n\nOpen ${site} and go to the page you were on to see it.\n\nChapala Theological Seminary`,
    },
    es: {
      subject: upheld ? 'Revisamos de nuevo su respuesta' : 'Su respuesta ha sido cambiada',
      text: `Estimado/a ${name}:\n\nUsted pidió a un profesor del Seminario Teológico de Chapala que revisara de nuevo una respuesta escrita. ` +
        (upheld ? 'Lo hizo, y el primer resultado se mantiene.' : `Lo hizo, y su respuesta ahora cuenta como correcta.${passed ? ' Ahora usted ha aprobado este examen.' : ''}${courseDone ? ' Ahora usted ha completado el curso.' : ''}`) +
        `${fb}\n\nAbra ${site} y vaya a la página en la que estaba para verlo.\n\nSeminario Teológico de Chapala`,
    },
    fr: {
      subject: upheld ? 'Nous avons examiné de nouveau votre réponse' : 'Votre réponse a été modifiée',
      text: `Bonjour ${name},\n\nVous avez demandé à un membre de la faculté du Séminaire théologique de Chapala d’examiner de nouveau une réponse écrite. ` +
        (upheld ? 'C’est fait, et le premier résultat est maintenu.' : `C’est fait, et votre réponse compte maintenant comme correcte.${passed ? ' Vous avez maintenant réussi cet examen.' : ''}${courseDone ? ' Vous avez maintenant terminé le cours.' : ''}`) +
        `${fb}\n\nOuvrez ${site} et allez à la page où vous étiez pour le voir.\n\nSéminaire théologique de Chapala`,
    },
  };
  return T[lang];
}
