import { parse, type HTMLElement } from 'node-html-parser';
import copy from '../data/french-landing.json' with { type: 'json' };
import { frenchCourseEntries, catalogCards } from './french-titles.ts';

const translations: Record<string, string> = copy;
const formCopy: Record<string, string> = {
  'Full name': 'Nom complet',
  'Email (required)': 'E-mail (obligatoire)',
  'Country — select': 'Pays — sélectionnez',
  'How did you hear about CTS? (optional)': 'Comment avez-vous découvert le STC ? (facultatif)',
};
export const FRENCH_HOME_MESSAGES: Record<string, string> = {
  'Please enter your name': 'Veuillez saisir votre nom',
  'Please enter a valid email address to register': 'Veuillez saisir une adresse e-mail valide pour vous inscrire',
  'Please select your country': 'Veuillez sélectionner votre pays',
  'Could not save — enable storage': 'Enregistrement impossible — autorisez le stockage dans le navigateur',
  'Certificate of Ministry': 'Certificat de ministère',
  'Associate of Divinity': 'Diplôme associé en théologie',
  'Master of Theology': 'Master en théologie',
  'Master of Divinity': 'Master en théologie pastorale',
  'You are registered. Open any course to begin.': 'Votre inscription est enregistrée. Ouvrez un cours pour commencer.',
  'Already registered on this device.': 'Vous êtes déjà inscrit sur cet appareil.',
  'Sent. Check that inbox (and its spam folder), then enter the code below.': 'Envoyé. Consultez votre boîte de réception et le dossier des courriers indésirables, puis saisissez le code ci-dessous.',
  'Too many requests today. Try again tomorrow.': 'Trop de demandes aujourd’hui. Réessayez demain.',
  'The email could not be sent. Try again later.': 'L’e-mail n’a pas pu être envoyé. Réessayez plus tard.',
  'Enter the code from the email first.': 'Saisissez d’abord le code reçu par e-mail.',
  'No record found for that code. Check it and try again.': 'Aucun dossier ne correspond à ce code. Vérifiez-le et réessayez.',
  'Copied ✓': 'Copié ✓', 'Copy': 'Copier',
};

/** Landing copy is keyed by exact source markup: a changed source must be
 * translated again rather than silently retaining stale French. Course lessons
 * and answer keys are deliberately outside this page-specific dictionary. */
/* The catalog and textbook cards: French from the course collection, keyed
   by the card's English (title, description, "For <course>", reading title). */
function catalogFrench(node: HTMLElement): string | null {
  if (!node.closest('#catalog a.course, #textbooks a.textbook')) return null;
  return catalogCards()[node.text.trim()] ?? null;
}
export function frenchLanding(root: HTMLElement) {
  const used = new Set<string>();
  for (const node of root.querySelectorAll('.en')) {
    if (node.closest('[data-cts-legacy-control]') || node.parentNode?.closest('.en')) continue;
    // Course names and descriptions take their French from src/content/courses.
    const card = node.innerHTML in translations || node.text in translations ? null : catalogFrench(node);
    const key = node.innerHTML in translations ? node.innerHTML : node.text;
    const text = card ?? translations[key];
    if (text == null) throw new Error(`Missing French landing translation: ${node.innerHTML}`);
    if (card == null) used.add(key);
    node.insertAdjacentHTML('afterend', `<${node.rawTagName} class="fr">${text}</${node.rawTagName}>`);
  }
  const unused = Object.keys(translations).filter(k => !used.has(k));
  if (unused.length) throw new Error(`Unused French landing translations (the English changed?):\n` + unused.slice(0, 20).map(k => '  ' + JSON.stringify(k)).join('\n'));
  // Every course a French reader can study in French (draft translations), from the content.
  const french = frenchCourseEntries();
  for (const card of root.querySelectorAll('#catalog a.course')) {
    if (french.has((card.getAttribute('href') || '').split('/').pop()!)) card.querySelector('.c-title')?.insertAdjacentHTML('afterend', '<span class="c-fr">Français</span>');
  }
  root.querySelector('head')?.insertAdjacentHTML('beforeend', '<style>#catalog .c-fr{display:inline-block;margin:.35rem 0 .1rem;padding:.1rem .5rem;border:1px solid #6b2330;border-radius:1rem;font-size:.75rem;color:#6b2330}</style>');
  for (const input of root.querySelectorAll('input[data-en], option[data-en]')) {
    const text = formCopy[input.getAttribute('data-en') || ''];
    if (!text) throw new Error(`Missing French landing field: ${input.getAttribute('data-en')}`);
    input.setAttribute('data-fr', text);
    if (input.tagName === 'OPTION') input.set_content(text); else input.setAttribute('placeholder', text);
  }
  // Country names in French and in French alphabetical order. "OT" is the
  // form's own "Other / Prefer not to say", not a region, and stays last.
  const countries = new Intl.DisplayNames(['fr'], { type: 'region' });
  const NAMES: Record<string, string> = { OT: 'Autre / Je préfère ne pas répondre', CD: 'République démocratique du Congo (RDC)', CG: 'République du Congo (Congo-Brazzaville)' };
  const options = root.querySelectorAll('#reg-country option[value]').filter(o => o.getAttribute('value'));
  for (const option of options) {
    const code = option.getAttribute('value')!;
    const text = NAMES[code] ?? countries.of(code)!;
    option.setAttribute('data-en', option.text);
    option.setAttribute('data-es', option.text);
    option.setAttribute('data-fr', text);
    option.set_content(text);
  }
  if (options.length) {
    const parent = options[0].parentNode!;
    const sorted = [...options].sort((a, b) => (a.getAttribute('value') === 'OT' ? 1 : 0) - (b.getAttribute('value') === 'OT' ? 1 : 0)
      || a.text.localeCompare(b.text, 'fr'));
    for (const o of options) o.remove();
    for (const o of sorted) parent.appendChild(o);
  }
  for (const [selector, labels] of Object.entries({
    '#reg-track': {cert:'Certificat de ministère',assoc:'Diplôme associé en théologie',thm:'Master en théologie (Th.M.)',mdiv:'Master en théologie pastorale (M.Div.)'},
    '#reg-heard': {ai:'Assistant IA (ChatGPT, Gemini, etc.)',search:'Google ou autre moteur de recherche',referral:'Pasteur ou ami',church:'Église ou groupe d’étude',social:'Réseaux sociaux',other:'Autre'},
  })) for (const option of root.querySelectorAll(`${selector} option`)) {
    const text = (labels as Record<string,string>)[option.getAttribute('value') || ''];
    if (!text) continue;
    option.setAttribute('data-en', option.text); option.setAttribute('data-es', option.text);
    option.setAttribute('data-fr', text); option.set_content(text);
  }
  const labels: Record<string,string> = {'reg-name':'Nom complet','reg-email':'Adresse e-mail','reg-country':'Pays','reg-heard':'Comment avez-vous découvert le STC ?','reg-track':'Parcours d’études','reg-existing-code':'Code étudiant'};
  for (const [id,label] of Object.entries(labels)) root.querySelector('#'+id)?.setAttribute('aria-label',label);
  root.querySelector('img[alt="Chapala Theological Seminary seal"]')?.setAttribute('alt','Sceau du Séminaire théologique de Chapala');
  const title = 'Séminaire en ligne gratuit | Séminaire théologique de Chapala';
  const description = 'Formation théologique gratuite à votre rythme : Bible, théologie, prédication et ministère pastoral. Cours en français, en anglais et en espagnol.';
  root.querySelector('title')!.set_content(title);
  root.querySelector('.topbar .mark')?.set_content('Séminaire théologique de Chapala');
  for (const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]']) root.querySelector(selector)?.setAttribute('content',description);
  for (const selector of ['meta[property="og:title"]','meta[name="twitter:title"]']) root.querySelector(selector)?.setAttribute('content',title);
  root.querySelector('meta[property="og:site_name"]')?.setAttribute('content','Séminaire théologique de Chapala');
  root.querySelector('meta[property="og:image:alt"]')?.setAttribute('content','Séminaire théologique de Chapala — formation théologique gratuite');
  root.querySelector('meta[property="og:url"]')?.setAttribute('content','https://chapalaseminary.org/fr/index.html');
  root.querySelector('meta[property="og:locale"]')?.setAttribute('content','fr_FR');
  const questions = root.querySelectorAll('#faq h3 .en');
  const answers = root.querySelectorAll('#faq p .en');
  for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
    const data = JSON.parse(script.innerHTML);
    if (data['@type'] === 'EducationalOrganization') {
      data.alternateName = 'Séminaire théologique de Chapala'; data.description = description;
      data.url = 'https://chapalaseminary.org/fr/index.html';
    } else if (data['@type'] === 'FAQPage') {
      data.inLanguage = 'fr';
      data.mainEntity = questions.map((question,i)=>({ '@type':'Question', name:parse(translations[question.innerHTML]).text, acceptedAnswer:{'@type':'Answer',text:parse(translations[answers[i].innerHTML]).text} }));
    }
    script.set_content(JSON.stringify(data).replace(/</g,'\\u003c'));
  }
  root.querySelector('body')!.insertAdjacentHTML('afterbegin', `<script>window.CTS_HOME_FR=${JSON.stringify(FRENCH_HOME_MESSAGES).replace(/</g,'\\u003c')};</script>`);
}
