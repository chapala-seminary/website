/* Routine questions and their approved answers (issue #163; Wayne, 23 Oct 2026:
 * "automatically respond to students for routine responses").
 *
 * An automatic reply is never written by a model. It is one or two of the
 * texts below, chosen by the deterministic patterns below, in the student's
 * language. A template may be SENT only when
 *   - every fact it rests on is confirmed by Dr. Cook or published on the site
 *     (src/policy.js), and
 *   - Dr. Cook has approved this exact text in the console (its version is a
 *     hash of the texts, so any edit here needs a fresh approval).
 * Shadow mode uses templates before approval, to show what would be sent.
 *
 * Questions outside this list, or mixed with anything that needs judgment,
 * are left for a person.
 */
import { FACTS, sendable } from './policy.js';

const SITE = 'https://chapalaseminary.org/';
const BYB = 'https://chapalaseminary.org/CTSBeforeYouBegin.html';
const RESTORE = 'https://chapalaseminary.org/cts-backup.html';

export const TEMPLATES = {
  how_to_start: {
    title: 'How do I start / register?',
    facts: ['free', 'open_enrollment', 'foundation_first'],
    patterns: [
      /\bhow\s+(do|can|may|should)\s+i\s+(start|begin|register|enrol+|sign\s*up|join|apply|study)\b/i,
      /\b(i\s+(would\s+like|want|wish)\s+to|i'?d\s+like\s+to)\s+(study|enrol+|register|join|start|begin|apply)\b/i,
      /\b(interested\s+in\s+(studying|your\s+(courses?|program+e?s?|seminary))|how\s+to\s+(enrol+|register|apply|join|start))\b/i,
      /\bc[óo]mo\s+(me\s+)?(inscribo|registro|empiezo|comienzo|puedo\s+(estudiar|inscribirme|registrarme|empezar|comenzar)|hago\s+para\s+(inscribirme|estudiar))/i,
      /\b(quiero|quisiera|deseo|me\s+gustar[íi]a)\s+(estudiar|inscribirme|registrarme|empezar|comenzar|ser\s+estudiante)\b/i,
      /\bcomment\s+(puis-je\s+)?(m'inscrire|commencer|s'inscrire|[ée]tudier)|\bje\s+(veux|voudrais|souhaite|d[ée]sire)\s+(m'inscrire|[ée]tudier|commencer)\b/i,
    ],
    text: {
      en: `Thank you for writing to Chapala Theological Seminary. You are welcome to begin right away: study is free, and there is no application or waiting period.

1. Register on the home page: ${SITE} (please include your email address, so that you can recover your student code and receive your certificates).
2. Read "Before You Begin": ${BYB}
3. Start with the seven foundation courses: Old Testament Survey, New Testament Survey, Systematic Theology, Evangelism, Pastoral Ministries, Church History and Preaching (WiseSpeak). You may take them in any order; when all seven are complete, the rest of the catalog opens.

May the Lord bless your studies.`,
      es: `Gracias por escribir al Seminario Teológico de Chapala. Puede comenzar de inmediato: el estudio es gratuito y no hay solicitud ni tiempo de espera.

1. Regístrese en la página principal: ${SITE} (por favor incluya su correo electrónico, para poder recuperar su código de estudiante y recibir sus certificados).
2. Lea "Antes de Comenzar": ${BYB}
3. Comience con los siete cursos de fundamento: Panorama del Antiguo Testamento, Panorama del Nuevo Testamento, Teología Sistemática, Evangelismo, Ministerios Pastorales, Historia de la Iglesia y Predicación (WiseSpeak). Puede tomarlos en el orden que prefiera; cuando los siete estén completos, se abre el resto del catálogo.

Que el Señor bendiga sus estudios.`,
      fr: `Merci d'avoir écrit au Séminaire Théologique de Chapala. Vous pouvez commencer tout de suite : les études sont gratuites, sans dossier de candidature ni délai d'attente.

1. Inscrivez-vous sur la page d'accueil : ${SITE} (indiquez votre adresse e-mail, afin de pouvoir récupérer votre code d'étudiant et recevoir vos certificats).
2. Lisez « Avant de commencer » : ${BYB}
3. Commencez par les sept cours de fondement : Panorama de l'Ancien Testament, Panorama du Nouveau Testament, Théologie systématique, Évangélisation, Ministères pastoraux, Histoire de l'Église et Prédication (WiseSpeak). Vous pouvez les suivre dans l'ordre de votre choix ; lorsque les sept sont terminés, le reste du catalogue s'ouvre.

Que le Seigneur bénisse vos études.`,
    },
  },

  group_enrollment: {
    title: 'A group (church, pastors, students) wants to study',
    facts: ['free', 'open_enrollment', 'enrollment_separate', 'individual_records', 'foundation_first'],
    patterns: [
      /\b(\d{2,}|many|several|some|a\s+group\s+of|our|my)\s+(pastors|ministers|leaders|students|members|church\s+leaders|evangelists|elders|deacons|people)\b[^.?!]{0,80}\b(study|studying|enrol+|register|join|start|take|interested)/i,
      /\b(\d{2,}|muchos|varios|algunos|un\s+grupo\s+de|nuestros|mis)\s+(pastores|ministros|l[íi]deres|estudiantes|hermanos|miembros|di[áa]conos|ancianos|evangelistas)\b[^.?!]{0,80}\b(estudiar|inscribir|registrar|comenzar|empezar|tomar|interesad)/i,
      /\b(\d{2,}|plusieurs|beaucoup\s+de|un\s+groupe\s+de|nos|mes)\s+(pasteurs|ministres|responsables|[ée]tudiants|leaders|membres|diacres|anciens|[ée]vang[ée]listes)\b[^.?!]{0,80}\b([ée]tudier|inscrire|commencer|suivre|int[ée]ress)/i,
    ],
    text: {
      en: `Thank you for writing, and for the people you serve. Every one of them is welcome to register now. There is no limit on numbers and nothing to wait for, and study is free.

Each person registers individually on the home page, ${SITE} (preferably with his or her own email address), because each student keeps an individual record and takes the exams personally. Please ask everyone to read "Before You Begin" first: ${BYB}. Everyone starts with the seven foundation courses, in any order.

If you would also like to discuss a formal relationship between your church or institution and the seminary, that is a separate conversation with Dr. Cook, and no one needs to wait for it before beginning.`,
      es: `Gracias por escribir, y por las personas a quienes usted sirve. Todas son bienvenidas a registrarse ahora mismo. No hay límite de personas ni nada que esperar, y el estudio es gratuito.

Cada persona se registra individualmente en la página principal, ${SITE} (de preferencia con su propio correo electrónico), porque cada estudiante tiene su propio registro académico y presenta sus exámenes personalmente. Por favor pida a todos que lean primero "Antes de Comenzar": ${BYB}. Todos comienzan con los siete cursos de fundamento, en el orden que prefieran.

Si además desea conversar sobre una relación formal entre su iglesia o institución y el seminario, esa es una conversación aparte con el Dr. Cook, y nadie necesita esperarla para comenzar.`,
      fr: `Merci de votre message, et merci pour les personnes que vous servez. Chacune d'elles est la bienvenue pour s'inscrire dès maintenant. Il n'y a aucune limite de nombre ni rien à attendre, et les études sont gratuites.

Chaque personne s'inscrit individuellement sur la page d'accueil, ${SITE} (de préférence avec sa propre adresse e-mail), car chaque étudiant a son propre dossier et passe ses examens personnellement. Demandez à chacun de lire d'abord « Avant de commencer » : ${BYB}. Tout le monde commence par les sept cours de fondement, dans l'ordre de son choix.

Si vous souhaitez aussi parler d'une relation officielle entre votre Église ou institution et le séminaire, c'est une conversation distincte avec le Dr Cook, et personne n'a besoin de l'attendre pour commencer.`,
    },
  },

  lost_code: {
    title: 'I lost / forgot my student code',
    facts: ['lost_code'],
    patterns: [
      /\b(lost|forgot(ten)?|don'?t\s+(have|remember|know))\s+(my\s+)?(student\s+)?code\b|\bwhere\s+is\s+my\s+(student\s+)?code\b/i,
      /\b(perd[íi]|olvid[ée]|no\s+(tengo|recuerdo|s[ée]))\s+(mi\s+)?c[óo]digo\b|\bd[óo]nde\s+(est[áa]|encuentro)\s+mi\s+c[óo]digo\b/i,
      /\b(perdu|oubli[ée])\s+(mon\s+)?code\b|\bcode\s+(d'[ée]tudiant\s+)?(perdu|oubli[ée])\b/i,
    ],
    text: {
      en: `You can recover your student code yourself:

1. Open the "Save / Restore My Progress" page: ${RESTORE}
2. Under "Lost your code?", enter the email address you registered with and press "Email me my code".
3. If that address has a student record, the code is sent to it (and only to it). Please look in your spam folder too.

If you registered without an email address, or the code does not arrive, reply to this message with the name you registered under and roughly when, and a person will look into it.`,
      es: `Usted mismo puede recuperar su código de estudiante:

1. Abra la página "Guardar / Restaurar Mi Progreso": ${RESTORE}
2. En "¿Perdió su código?", escriba el correo con el que se registró y pulse "Enviarme mi código".
3. Si ese correo tiene un registro de estudiante, el código se envía a esa dirección (y solo a ella). Revise también su carpeta de correo no deseado.

Si se registró sin correo electrónico, o el código no llega, responda a este mensaje con el nombre con que se registró y aproximadamente cuándo, y una persona lo revisará.`,
      fr: `Vous pouvez récupérer vous-même votre code d'étudiant :

1. Ouvrez la page « Sauvegarder / Restaurer ma progression » : ${RESTORE}
2. Sous « Code perdu ? », saisissez l'adresse e-mail utilisée lors de votre inscription et appuyez sur « M'envoyer mon code par e-mail ».
3. Si cette adresse correspond à un dossier d'étudiant, le code y est envoyé (et uniquement à elle). Vérifiez aussi vos courriers indésirables.

Si vous vous êtes inscrit sans adresse e-mail, ou si le code n'arrive pas, répondez à ce message en indiquant le nom utilisé et la date approximative, et une personne s'en occupera.`,
    },
  },

  retakes: {
    title: 'I did not pass / can I retake an exam?',
    facts: ['retakes'],
    patterns: [
      /\b(retake|re-take|take\s+(it|the\s+(exam|test))\s+again|try\s+again|another\s+attempt|how\s+many\s+(attempts|times)|(did\s+not|didn'?t|failed\s+to)\s+pass|i\s+failed\s+(the|my)\s+(exam|test))\b/i,
      /\b(volver\s+a\s+(presentar|tomar|hacer)|repetir\s+el\s+examen|otro\s+intento|cu[áa]ntos\s+intentos|cu[áa]ntas\s+veces|no\s+(aprob[ée]|pas[ée])|reprob[ée])\b/i,
      /\b(repasser|refaire)\s+l'(examen|[ée]preuve)|\bcombien\s+de\s+(tentatives|fois)|\b(pas\s+r[ée]ussi|[ée]chou[ée])\b/i,
    ],
    text: {
      en: `Our exams are designed to help you learn, not to trick you; the goal is mastery of the material. If you do not reach the required score, review the lesson and try again: after a short wait you may retake an exam as many times as you need. We care more about what you learn than about how many attempts it takes.

More about how the program works: ${BYB}`,
      es: `Nuestros exámenes están diseñados para ayudarle a aprender, no para engañarle; la meta es el dominio del material. Si no alcanza la calificación requerida, repase la lección e inténtelo de nuevo: tras una breve espera puede volver a presentar un examen cuantas veces lo necesite. Nos importa más lo que usted aprende que cuántos intentos le toma.

Más sobre cómo funciona el programa: ${BYB}`,
      fr: `Nos examens sont conçus pour vous aider à apprendre, non pour vous piéger ; le but est la maîtrise de la matière. Si vous n'atteignez pas la note requise, révisez la leçon et réessayez : après une courte attente, vous pouvez repasser un examen autant de fois que nécessaire. Ce qui compte pour nous, c'est ce que vous apprenez, pas le nombre de tentatives.

Pour en savoir plus sur le fonctionnement du programme : ${BYB}`,
    },
  },

  requirements: {
    title: 'How many courses for each certificate or degree?',
    facts: ['recognitions', 'foundation_first', 'masters_exams'],
    patterns: [
      /\bhow\s+many\s+(courses|classes)\b|\b(requirements?|what\s+do\s+i\s+need)\s+(for|to\s+(get|earn|complete))\s+(the\s+|a\s+|an\s+)?(m\.?\s?div|th\.?\s?m|master|associate|certificate|degree)/i,
      /\bcu[áa]ntos\s+(cursos|clases)\b|\b(requisitos?|qu[ée]\s+necesito)\s+(para|del?)\s+(la\s+|el\s+)?(maestr[íi]a|m\.?\s?div|th\.?\s?m|asociado|certificado|t[íi]tulo)/i,
      /\bcombien\s+de\s+cours\b|\b(conditions|exigences|que\s+faut-il)\s+(pour|du|de\s+la)\s+(la\s+|le\s+)?(ma[îi]trise|master|m\.?\s?div|th\.?\s?m|associ[ée]|certificat|dipl[ôo]me)/i,
    ],
    text: {
      en: `These are the minimum requirements, as set out on the "Before You Begin" page (${BYB}):

- Certificate of Ministry: 12 courses (the 7 foundation courses and 5 electives).
- Master of Theology (Th.M.): 15 courses (the 7 foundation courses and 8 electives), with the written work in each.
- Associate of Divinity: 25 courses, including the 7 foundation courses, with the fill-in-the-blank questions in each unit.
- Master of Divinity (M.Div.): 30 courses at the master's level (a 20-course required core and 10 electives).

At the master's level, a course that has a textbook or required-reading test includes it. Every student begins with the seven foundation courses, in any order; when they are complete, the whole catalog opens. These numbers are minimums, and you are welcome to take every course.`,
      es: `Estos son los requisitos mínimos, según la página "Antes de Comenzar" (${BYB}):

- Certificado de Ministerio: 12 cursos (los 7 cursos de fundamento y 5 electivas).
- Maestría en Teología (Th.M.): 15 cursos (los 7 cursos de fundamento y 8 electivas), con el trabajo escrito en cada uno.
- Asociado en Divinidad: 25 cursos, incluidos los 7 cursos de fundamento, con las preguntas de completar el espacio en blanco en cada unidad.
- Maestría en Divinidad (M.Div.): 30 cursos al nivel de maestría (un núcleo obligatorio de 20 cursos y 10 electivas).

Al nivel de maestría, un curso que tiene examen del libro de texto o de las lecturas requeridas lo incluye. Todo estudiante comienza con los siete cursos de fundamento, en el orden que prefiera; cuando estén completos, se abre todo el catálogo. Estos números son mínimos, y usted puede tomar todos los cursos.`,
      fr: `Voici les exigences minimales, telles qu'indiquées sur la page « Avant de commencer » (${BYB}) :

- Certificat de ministère : 12 cours (les 7 cours de fondement et 5 cours au choix).
- Maîtrise en théologie (Th.M.) : 15 cours (les 7 cours de fondement et 8 cours au choix), avec le travail écrit dans chacun.
- Associé en divinité : 25 cours, dont les 7 cours de fondement, avec les questions à compléter dans chaque unité.
- Maîtrise en divinité (M.Div.) : 30 cours au niveau de la maîtrise (un tronc commun obligatoire de 20 cours et 10 cours au choix).

Au niveau de la maîtrise, un cours qui comporte un examen sur le manuel ou sur les lectures obligatoires l'inclut. Tout étudiant commence par les sept cours de fondement, dans l'ordre de son choix ; lorsqu'ils sont terminés, tout le catalogue s'ouvre. Ce sont des minimums, et vous pouvez suivre tous les cours.`,
    },
  },

  is_free: {
    title: 'Does it cost anything?',
    facts: ['free', 'open_enrollment'],
    patterns: [
      /\b(is\s+(it|this|the\s+(program|seminary|course))\s+(really\s+)?free|how\s+much\s+(does\s+it|do\s+(the\s+)?courses?)\s+cost|is\s+there\s+(a\s+|any\s+)?(cost|charge|tuition))\b/i,
      /\b(es\s+(realmente\s+)?gratis|es\s+gratuito|cu[áa]nto\s+cuesta|tiene\s+(alg[úu]n\s+)?costo|hay\s+que\s+pagar)\b/i,
      /\b(est-ce\s+(vraiment\s+)?gratuit|c'est\s+gratuit|combien\s+(ça\s+)?co[ûu]te|y\s+a-t-il\s+des\s+frais)\b/i,
    ],
    text: {
      en: `Yes: all study at Chapala Theological Seminary is free. There is no tuition, and nothing to pay of any kind.

You may register on the home page, ${SITE}, and begin with the seven foundation courses. Please read "Before You Begin" first: ${BYB}`,
      es: `Sí: todo el estudio en el Seminario Teológico de Chapala es gratuito. No hay colegiatura ni cobro de ningún tipo.

Puede registrarse en la página principal, ${SITE}, y comenzar con los siete cursos de fundamento. Por favor lea primero "Antes de Comenzar": ${BYB}`,
      fr: `Oui : toutes les études au Séminaire Théologique de Chapala sont gratuites. Il n'y a ni droits de scolarité ni frais d'aucune sorte.

Vous pouvez vous inscrire sur la page d'accueil, ${SITE}, et commencer par les sept cours de fondement. Lisez d'abord « Avant de commencer » : ${BYB}`,
    },
  },

  certificate_how: {
    title: 'How do I get a certificate?',
    facts: ['certificate_email'],
    patterns: [
      /\bhow\s+(do|can)\s+i\s+(get|receive|obtain|download|print|claim)\s+(my\s+|a\s+|the\s+)?(certificate|diploma)/i,
      /\bc[óo]mo\s+(obtengo|recibo|descargo|imprimo|consigo|puedo\s+(obtener|recibir|descargar|imprimir))\s+(mi\s+|el\s+|un\s+)?(certificado|diploma)/i,
      /\bcomment\s+(obtenir|recevoir|t[ée]l[ée]charger|imprimer)\s+(mon\s+|le\s+|un\s+)?(certificat|dipl[ôo]me)/i,
    ],
    // a specific certificate that is missing is a record check for a person, not this answer
    exclude: /\b(completed|finished|i\s+(have\s+)?(done|passed)|did\s+not\s+(receive|arrive|get)|didn'?t\s+(receive|arrive|get)|never\s+(received|arrived)|send\s+me|resend|complet[ée]|termin[ée]|aprob[ée]|no\s+(he\s+)?recib|no\s+(me\s+)?(lleg[óo]|ha\s+llegado)|env[íi](e|eme|en)|reenv|termin[ée]|re[çc]u|pas\s+re[çc]u|envoyez|renvoy)/i,
    text: {
      en: `When you complete a course, you can claim its certificate. A confirmed email address on your student record is needed to claim a certificate, and the certificate is sent to that address, so please make sure your email address is confirmed on the site.

If you have completed a course and the certificate did not arrive, reply to this message with your name, the course and the level (Certificate, Associate, Th.M. or M.Div.), and a person will check your record.`,
      es: `Cuando complete un curso, puede reclamar su certificado. Para reclamar un certificado se necesita un correo electrónico confirmado en su registro de estudiante, y el certificado se envía a esa dirección; por eso, asegúrese de que su correo esté confirmado en el sitio.

Si ya completó un curso y el certificado no llegó, responda a este mensaje con su nombre, el curso y el nivel (Certificado, Asociado, Th.M. o M.Div.), y una persona revisará su registro.`,
      fr: `Lorsque vous terminez un cours, vous pouvez demander son certificat. Une adresse e-mail confirmée dans votre dossier d'étudiant est nécessaire pour cela, et le certificat est envoyé à cette adresse ; assurez-vous donc que votre adresse est confirmée sur le site.

Si vous avez terminé un cours et que le certificat n'est pas arrivé, répondez à ce message en indiquant votre nom, le cours et le niveau (Certificat, Associé, Th.M. ou M.Div.), et une personne vérifiera votre dossier.`,
    },
  },

  languages: {
    title: 'Which languages are the courses in?',
    facts: ['languages'],
    patterns: [
      /\b(in|available\s+in)\s+(spanish|french|portuguese|swahili|english)\b[^.?!]{0,40}\?|\bwhat\s+languages?\b|\bwhich\s+languages?\b/i,
      /\b(en|disponibles?\s+en)\s+(espa[ñn]ol|franc[ée]s|portugu[ée]s|suajili|ingl[ée]s)\b[^.?!]{0,40}\?|\bqu[ée]\s+idiomas?\b|\ben\s+qu[ée]\s+idioma\b/i,
      /\b(en|disponibles?\s+en)\s+(fran[çc]ais|anglais|espagnol|portugais|swahili)\b[^.?!]{0,40}\?|\bquelles?\s+langues?\b/i,
    ],
    text: {
      en: `The courses are in English and in Spanish, and also in French; you can switch language on each page. Other languages are not available on the site yet. You may register on the home page: ${SITE}`,
      es: `Los cursos están en inglés y en español, y también en francés; puede cambiar de idioma en cada página. Otros idiomas todavía no están disponibles en el sitio. Puede registrarse en la página principal: ${SITE}`,
      fr: `Les cours sont en anglais et en espagnol, ainsi qu'en français ; vous pouvez changer de langue sur chaque page. Les autres langues ne sont pas encore disponibles sur le site. Vous pouvez vous inscrire sur la page d'accueil : ${SITE}`,
    },
  },
};

export const LANGS = ['en', 'es', 'fr'];

const GREETING = { en: (n) => `Hello${n ? ' ' + n : ''},`, es: (n) => `Hola${n ? ' ' + n : ''}:`, fr: (n) => `Bonjour${n ? ' ' + n : ''},` };
const JOIN = { en: '\n\n', es: '\n\n', fr: '\n\n' };
export const FOOTER = {
  en: `This is an automatic reply to a common question. If it does not answer what you asked, simply reply to this message and a person will read it.

Chapala Theological Seminary
${SITE}`,
  es: `Esta es una respuesta automática a una pregunta frecuente. Si no responde lo que usted preguntó, simplemente responda a este mensaje y una persona lo leerá.

Seminario Teológico de Chapala
${SITE}`,
  fr: `Ceci est une réponse automatique à une question fréquente. Si elle ne répond pas à votre demande, répondez simplement à ce message et une personne le lira.

Séminaire Théologique de Chapala
${SITE}`,
};

/* ---- language and intent ------------------------------------------------- */

const WORDS = {
  es: /\b(el|la|los|las|que|de|del|para|por|con|una?|mi|es|est[áa]|c[óo]mo|quiero|gracias|hola|curso|estudiar|puedo|tengo|seminario)\b/gi,
  fr: /\b(le|la|les|des|du|une?|je|vous|est|pour|avec|mon|ma|mes|comment|merci|bonjour|cours|[ée]tudier|s[ée]minaire|c'est|n'est)\b/gi,
  en: /\b(the|and|is|are|to|of|my|i|you|how|can|want|thank|thanks|hello|course|study|seminary|please|do|have)\b/gi,
  pt: /\b(n[ãa]o|voc[êe]|obrigad[oa]|ol[áa]|estudar|gostaria|curso|minha|meu|como\s+fa[çc]o|est[áa]\s+dispon[íi]vel)\b/gi,
  sw: /\b(na|ya|wa|kwa|ni|habari|asante|kozi|kusoma|ningependa|tafadhali|mchungaji)\b/gi,
};

/** 'en' | 'es' | 'fr' | 'pt' | 'sw' | '' (unsure). Only the first three have
 *  templates; anything else is left for a person. */
export function detectLanguage(text) {
  const t = String(text || '');
  const score = Object.fromEntries(Object.entries(WORDS).map(([k, re]) => [k, (t.match(re) || []).length]));
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [top, n] = ranked[0];
  if (n < 2 || n < ranked[1][1] * 1.5) return '';
  return top;
}

export const THANKS_ONLY = /^\s*(thank\s+you|thanks|many\s+thanks|god\s+bless|blessings|amen|gracias|muchas\s+gracias|bendiciones|dios\s+le\s+bendiga|merci|merci\s+beaucoup|que\s+dieu\s+vous\s+b[ée]nisse|obrigad[oa]|asante)\b[^?]{0,180}$/i;

/** The routine questions a message asks, by template id. */
export function detectIntents(text, subject = '') {
  const t = `${subject}\n${text}`;
  const out = [];
  for (const [id, tpl] of Object.entries(TEMPLATES)) {
    if (!tpl.patterns.some((re) => re.test(t))) continue;
    if (tpl.exclude && tpl.exclude.test(t)) continue;
    out.push(id);
  }
  // a group asking to start: one answer covers both
  if (out.includes('group_enrollment')) return out.filter((i) => i !== 'how_to_start');
  return out;
}

/* ---- versions, approval and rendering ------------------------------------ */

function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

/** The exact texts of a template (all languages, with footer and its facts)
 *  hashed: an approval is for these words and no others. */
export function templateVersion(id) {
  const t = TEMPLATES[id];
  return fnv(JSON.stringify([id, t.facts, LANGS.map((l) => t.text[l]), LANGS.map((l) => FOOTER[l])]));
}

/** Can this template be sent for real, given the owner's approvals? */
export function templateStanding(id, approved = {}) {
  const t = TEMPLATES[id];
  if (!t) return { ok: false, reason: 'no such template' };
  const unsendable = t.facts.filter((f) => !sendable(f));
  if (unsendable.length) return { ok: false, reason: `rests on facts not yet confirmed: ${unsendable.map((f) => `${f} (${FACTS[f]?.status || 'missing'})`).join(', ')}` };
  if (approved[id] !== templateVersion(id)) return { ok: false, reason: approved[id] ? 'text changed since Dr. Cook approved it' : 'not yet approved by Dr. Cook' };
  return { ok: true };
}

const SAFE_NAME = /^[\p{L}][\p{L}'’-]{1,29}$/u;
export function firstName(display) {
  const first = String(display || '').trim().split(/\s+/)[0] || '';
  return SAFE_NAME.test(first) ? first : '';
}

export function render(intents, lang, name) {
  const parts = [GREETING[lang](firstName(name)), ...intents.map((id) => TEMPLATES[id].text[lang]), FOOTER[lang]];
  return parts.join(JOIN[lang]);
}

export function replySubject(subject, lang) {
  const s = String(subject || '').trim();
  if (/^(re|aw|rv|r[ée]f)\s*:/i.test(s)) return s.slice(0, 200);
  if (s) return `Re: ${s}`.slice(0, 200);
  return { en: 'Your question to Chapala Theological Seminary', es: 'Su pregunta al Seminario Teológico de Chapala', fr: 'Votre question au Séminaire Théologique de Chapala' }[lang];
}
