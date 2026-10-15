/* Titles, descriptions and JSON-LD for search and assistants.
 *
 * Facts come from the catalog, docs/curriculum.md and the About page.
 * Nothing here invents an accreditation, a student count or a street address.
 */
import fs from 'node:fs';
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));

/* Same lists as worker/awards.js and docs/curriculum.md. A drift here is a
   landing-page label, not an award rule — do not edit one without the other. */
export const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
export const MDIV_CORE = [
  ...FOUNDATION,
  'CTSHERMENEUTICS', 'CTSLA', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS', 'CTSACTS',
  'CTSAPOL', 'COUNSELING', 'CTSAL', 'CTSWORSHIP', 'CTSCE', 'CTSMISSIONS',
];
const DEGREE_COUNTS = { certificate: 12, associate: 25, thm: 15, mdiv: 30 } as const;

export const SITE = 'https://chapalaseminary.org';
export const SITE_NAME = {
  en: 'Chapala Theological Seminary',
  es: 'Seminario Teológico de Chapala',
  fr: 'Séminaire théologique de Chapala',
} as const;
export const SITE_SHORT = { en: 'CTS', es: 'STC', fr: 'STC' } as const;
export const LANGUAGES = ['en', 'es', 'fr'] as const;
export type Lang = (typeof LANGUAGES)[number];

export const PARENT_ORG = {
  '@type': 'Organization',
  name: 'Common Ground Fellowship at Little Chapel',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ajijic',
    addressRegion: 'Jalisco',
    addressCountry: 'MX',
  },
};

/* Course authors named on the About page. Everyone else is Dr. Cook. */
export const AUTHORS: Record<string, { en: string; es: string; fr: string }> = {
  CTSPENT: {
    en: 'Dr. Ted Rogers',
    es: 'Dr. Ted Rogers',
    fr: 'M. Ted Rogers',
  },
  CTSCE: {
    en: 'Andi Cook',
    es: 'Andi Cook',
    fr: 'Andi Cook',
  },
  CTSRE: {
    en: 'Glenda Rogers',
    es: 'Glenda Rogers',
    fr: 'Glenda Rogers',
  },
};
export const DEFAULT_AUTHOR = {
  en: 'Dr. Wayne Cook',
  es: 'Dr. Wayne Cook',
  fr: 'M. Wayne Cook',
};

export const OPEN_BEFORE_FOUNDATION = ['CTSBIBLE', 'CTSDEACONFAMILYMINISTRY'];

const SINGLE_CODES: Record<string, string> = {
  CTS_WiseSpeak_Preaching: 'WISESPEAK',
  CTSCounseling: 'COUNSELING',
  CTS_Narrative_Preaching: 'STORYTEL',
  ethics_unit01: 'ETHICS',
};

export function clip(s: string, max: number) {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const at = cut.lastIndexOf(' ');
  return (at > 40 ? cut.slice(0, at) : cut).trimEnd() + '…';
}

export function landingFile(entry: string) {
  return entry.replace(/Unit\d+\.html$/, '.html').replace(/\.html$/i, '') + 'Course.html';
}

export function pagePrefix(entry: string) {
  return entry.replace(/Unit\d+\.html$/, '').replace(/\.html$/i, '');
}

export function completionCode(course: { code: string; entry: string }) {
  const prefix = pagePrefix(course.entry);
  for (const c of Object.values(catalog.courses) as { pages: string; code: string }[])
    if (c.pages === prefix) return c.code;
  if (SINGLE_CODES[course.code]) return SINGLE_CODES[course.code];
  const up = course.code.toUpperCase();
  if ((catalog.completions as Record<string, unknown>)[up]) return up;
  return up;
}

export function courseStatus(code: string): 'foundation' | 'mdiv-core' | 'elective' {
  if (FOUNDATION.includes(code)) return 'foundation';
  if (MDIV_CORE.includes(code)) return 'mdiv-core';
  return 'elective';
}

export function tracksFor(code: string) {
  const out: { id: string; en: string; es: string; fr: string }[] = [
    { id: 'certificate', en: 'Certificate of Ministry', es: 'Certificado de Ministerio', fr: 'Certificat de ministère' },
    { id: 'associate', en: 'Associate of Divinity', es: 'Asociado en Divinidad', fr: 'Diplôme associé en théologie' },
    { id: 'thm', en: 'Master of Theology (Th.M.)', es: 'Maestría en Teología (Th.M.)', fr: 'Master en théologie (Th.M.)' },
  ];
  if (MDIV_CORE.includes(code) || courseStatus(code) === 'elective' || FOUNDATION.includes(code))
    out.push({ id: 'mdiv', en: 'Master of Divinity (M.Div.)', es: 'Maestría en Divinidad (M.Div.)', fr: 'Master en théologie pastorale (M.Div.)' });
  return out;
}

export function authorOf(code: string) {
  return AUTHORS[code] || DEFAULT_AUTHOR;
}

export function localePath(file: string, lang: Lang) {
  const name = file === 'index.html' || file === '' ? (lang === 'en' ? '' : 'index.html') : file;
  return `${lang === 'en' ? '/' : `/${lang}/`}${name}`;
}

export function localeUrl(file: string, lang: Lang) {
  const path = localePath(file, lang);
  return path === '/' ? `${SITE}/` : `${SITE}${path}`;
}

type Copy = { title: string; description: string };

export const PAGE_META: Record<string, Record<Lang, Copy>> = {
  'index.html': {
    en: {
      title: 'Free Online Seminary | CTS',
      description: 'Free self-study Bible and theology courses in English and Spanish. Study on your phone; earn a class certificate. A ministry in Ajijic, Mexico.',
    },
    es: {
      title: 'Seminario teológico gratis | STC',
      description: 'Cursos bíblicos y teológicos gratis en español e inglés. Estudie en su teléfono y obtenga un certificado de clase. Ministerio en Ajijic, México.',
    },
    fr: {
      title: 'Séminaire en ligne gratuit | STC',
      description: 'Cours de Bible et de théologie gratuits, à votre rythme. Anglais et espagnol ; français en brouillon. Ministère à Ajijic, Mexique.',
    },
  },
  'CTSAbout.html': {
    en: {
      title: 'About this free seminary | CTS',
      description: 'Chapala Theological Seminary is a free online seminary, a ministry of Common Ground Fellowship at Little Chapel, Ajijic. Faculty and how to reach us.',
    },
    es: {
      title: 'Acerca del seminario gratis | STC',
      description: 'El Seminario Teológico de Chapala es un seminario en línea gratuito, ministerio de Common Ground Fellowship en Little Chapel, Ajijic.',
    },
    fr: {
      title: 'À propos du séminaire | STC',
      description: 'Le Séminaire théologique de Chapala est un séminaire en ligne gratuit, ministère de Common Ground Fellowship à Little Chapel, Ajijic.',
    },
  },
  'CTSCatalog.html': {
    en: {
      title: '45 free Bible courses | CTS',
      description: 'Browse 45 free online Bible and theology courses in English and Spanish. Foundation courses, M.Div. core, and electives.',
    },
    es: {
      title: '45 cursos bíblicos gratis | STC',
      description: '45 cursos bíblicos y teológicos gratis en español e inglés. Fundamento, núcleo del M.Div. y electivos.',
    },
    fr: {
      title: '45 cours de Bible gratuits | STC',
      description: '45 cours de Bible et de théologie gratuits en anglais et en espagnol. Fondements, tronc du M.Div. et cours à option.',
    },
  },
  'CTSBeforeYouBegin.html': {
    en: {
      title: 'Programs and how to start | CTS',
      description: 'Four ministry tracks: Certificate (12), Associate (25), Th.M. (15), M.Div. (30). Seven foundation courses come first. Not an accredited degree.',
    },
    es: {
      title: 'Programas y cómo empezar | STC',
      description: 'Cuatro trayectos: Certificado (12), Asociado (25), Th.M. (15), M.Div. (30). Empiece por siete cursos de fundamento. No es un grado oficial.',
    },
    fr: {
      title: 'Parcours et comment commencer | STC',
      description: 'Quatre parcours : certificat (12), associé (25), Th.M. (15), M.Div. (30). Sept cours de fondement d’abord. Pas un diplôme officiel.',
    },
  },
  'CTSPrivacy.html': {
    en: {
      title: 'Your information | CTS',
      description: 'What the seminary keeps, how a private student code works, and how to see or delete your record. Codes never belong in a URL.',
    },
    es: {
      title: 'Su información | STC',
      description: 'Qué guarda el seminario, cómo funciona el código de estudiante y cómo ver o borrar su registro. El código no va en la dirección.',
    },
    fr: {
      title: 'Vos informations | STC',
      description: 'Ce que le séminaire conserve, comment fonctionne le code étudiant, et comment voir ou effacer votre dossier.',
    },
  },
  'CTSResources.html': {
    en: {
      title: 'Study resources | CTS',
      description: 'Reading rooms, honors readings, and study helps for Chapala Theological Seminary courses.',
    },
    es: {
      title: 'Recursos de estudio | STC',
      description: 'Salas de lectura, lecturas para honores y ayudas de estudio de los cursos del seminario.',
    },
    fr: {
      title: 'Ressources d’étude | STC',
      description: 'Salles de lecture, lectures pour la mention et aides pour les cours du séminaire.',
    },
  },
};

export function courseLandingMeta(title: { en: string; es: string; fr?: string }, description: { en: string; es: string; fr?: string }, lang: Lang): Copy {
  const t = title[lang] || title.en;
  const d = description[lang] || description.en;
  const suffix = lang === 'es' ? ' — Curso gratis' : lang === 'fr' ? ' — Cours gratuit' : ' — Free course';
  const extra = lang === 'es'
    ? ' Curso de autoestudio gratis del Seminario Teológico de Chapala.'
    : lang === 'fr'
      ? ' Cours gratuit en autoformation du Séminaire théologique de Chapala.'
      : ' Free self-study course at Chapala Theological Seminary.';
  return { title: clip(t + suffix, 60), description: clip(d.replace(/\.$/, '') + '.' + extra, 155) };
}

export function unitMeta(courseTitle: string, unit: number, unitTitle: string, lang: Lang): Copy {
  const unitWord = lang === 'es' ? 'Unidad' : lang === 'fr' ? 'Unité' : 'Unit';
  const title = clip(`${courseTitle} · ${unitWord} ${unit}`, 60);
  const desc = lang === 'es'
    ? `${courseTitle}, ${unitWord.toLowerCase()} ${unit}: ${unitTitle}. Lección de autoestudio gratis en el Seminario Teológico de Chapala.`
    : lang === 'fr'
      ? `${courseTitle}, ${unitWord.toLowerCase()} ${unit} : ${unitTitle}. Leçon gratuite en autoformation au Séminaire théologique de Chapala.`
      : `${courseTitle}, ${unitWord.toLowerCase()} ${unit}: ${unitTitle}. Free self-study lesson at Chapala Theological Seminary.`;
  return { title, description: clip(desc, 155) };
}

export function organizationJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME[lang],
    alternateName: lang === 'en' ? SITE_NAME.es : SITE_NAME.en,
    url: localeUrl('index.html', lang),
    logo: `${SITE}/cts-share.png`,
    image: `${SITE}/cts-share.png`,
    email: 'info@chapalaseminary.org',
    description: PAGE_META['index.html'][lang].description,
    areaServed: 'Worldwide',
    inLanguage: lang === 'fr' ? ['fr', 'en', 'es'] : ['en', 'es'],
    isAccessibleForFree: true,
    parentOrganization: PARENT_ORG,
    founder: { '@type': 'Person', name: 'Wayne Cook', honorificPrefix: 'Dr.', honorificSuffix: 'Th.D.' },
    member: [
      { '@type': 'Person', name: 'Ted Rogers', honorificPrefix: 'Dr.', honorificSuffix: 'Ph.D.', jobTitle: 'Director' },
      { '@type': 'Person', name: 'Wayne Cook', honorificPrefix: 'Dr.', honorificSuffix: 'Th.D.', jobTitle: 'Faculty and course author' },
    ],
  };
}

export function websiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME[lang],
    alternateName: SITE_SHORT[lang],
    url: localeUrl('index.html', lang),
    inLanguage: lang,
    publisher: { '@type': 'EducationalOrganization', name: SITE_NAME[lang], url: SITE + '/' },
  };
}

export function courseJsonLd(opts: {
  lang: Lang;
  name: string;
  description: string;
  url: string;
  startUrl: string;
  languages: string[];
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.languages,
    isAccessibleForFree: true,
    provider: { '@type': 'EducationalOrganization', name: SITE_NAME[opts.lang], url: SITE + '/', parentOrganization: PARENT_ORG },
    author: { '@type': 'Person', name: opts.author },
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: opts.url },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      url: opts.startUrl,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function programsJsonLd(lang: Lang) {
  const names = {
    certificate: { en: 'Certificate of Ministry', es: 'Certificado de Ministerio', fr: 'Certificat de ministère' },
    associate: { en: 'Associate of Divinity', es: 'Asociado en Divinidad', fr: 'Diplôme associé en théologie' },
    thm: { en: 'Master of Theology', es: 'Maestría en Teología', fr: 'Master en théologie' },
    mdiv: { en: 'Master of Divinity', es: 'Maestría en Divinidad', fr: 'Master en théologie pastorale' },
  } as const;
  const note = {
    en: 'Internal ministry recognition of Chapala Theological Seminary. Not an official academic degree. The seminary is not accredited.',
    es: 'Reconocimiento interno de ministerio del Seminario Teológico de Chapala. No es un grado académico oficial. El seminario no está acreditado.',
    fr: 'Reconnaissance interne de ministère du Séminaire théologique de Chapala. Ce n’est pas un diplôme officiel. Le séminaire n’est pas accrédité.',
  }[lang];
  return Object.entries(DEGREE_COUNTS).map(([id, courses]) => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: names[id as keyof typeof names][lang],
    description: note,
    url: localeUrl('CTSBeforeYouBegin.html', lang),
    provider: { '@type': 'EducationalOrganization', name: SITE_NAME[lang], url: SITE + '/', parentOrganization: PARENT_ORG },
    educationalProgramMode: 'online',
    timeToComplete: `P${courses}C`,
    numberOfCredits: courses,
    occupationalCategory: '21-2011',
    isAccessibleForFree: true,
  }));
}

export function facultyJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Wayne Cook',
      honorificPrefix: 'Dr.',
      honorificSuffix: 'Th.D.',
      jobTitle: 'Faculty and course author',
      worksFor: { '@type': 'EducationalOrganization', name: SITE_NAME.en, url: SITE + '/' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'New Orleans Baptist Theological Seminary' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Ted Rogers',
      honorificPrefix: 'Dr.',
      honorificSuffix: 'Ph.D.',
      jobTitle: 'Director',
      worksFor: { '@type': 'EducationalOrganization', name: SITE_NAME.en, url: SITE + '/' },
    },
  ];
}

export function isCertificatePage(file: string) {
  return /Certificate\.html$/i.test(file);
}

export function isPrivatePage(file: string) {
  return /^(cts-backup|cts-confirm-email|CTS_ARCHIVE_INDEX|START_HERE)\.html$/i.test(file)
    || isCertificatePage(file);
}

export function statusLabel(status: ReturnType<typeof courseStatus>, lang: Lang) {
  if (status === 'foundation') return { en: 'Foundation course', es: 'Curso de fundamento', fr: 'Cours de fondement' }[lang];
  if (status === 'mdiv-core') return { en: 'M.Div. core course', es: 'Curso del núcleo del M.Div.', fr: 'Cours du tronc du M.Div.' }[lang];
  return { en: 'Elective course', es: 'Curso electivo', fr: 'Cours à option' }[lang];
}
