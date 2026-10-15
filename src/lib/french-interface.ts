/* The French page frame. Interface text is written beside its English and
 * Spanish in the layouts (a `lang-fr` span); every element of the frame is
 * marked `data-cts-chrome`. On a French page nothing in the frame may fall
 * back to English: the build stops and names the text, as the French landing
 * does, instead of quietly showing English. Lessons and answer keys are never
 * translated here. */
import type { HTMLElement } from 'node-html-parser';

/* Interface text that older pages write themselves, outside the layouts. */
export const FRENCH_INTERFACE: Record<string, string> = {
  '📚 Catalog / Catálogo': '📚 Catalogue',
};
/* The frame's accessible names (aria-label on its navigation). */
export const FRENCH_LABELS: Record<string, string> = {
  'Textbook': 'Manuel',
  'Reading room': 'Salle de lecture',
  'Reading With Honors': 'Lecture avec mention',
  'Course units': 'Unités du cours',
  'Contents': 'Sommaire',
  'Breadcrumb': 'Fil d’Ariane',
};
/* Frame text inside the lesson body (src/lib/partials.ts), where a lang-fr
   span would change the lesson text that tools/prose-baseline.mjs records. */
export const FRENCH_FRAME: Record<string, string> = {
  'Honors Readings': 'Lectures pour la mention',
  'This class has five full readings &mdash; read any three in full to earn it <b>With Honors</b>.': 'Ce cours propose cinq lectures complètes &mdash; lisez-en trois en entier pour l’obtenir <b>avec mention</b>.',
  'Open the Reading Room &rarr;': 'Ouvrir la salle de lecture &rarr;',
  'World Religions has a separate set of five master’s assigned readings, linked above; the honors selections below are optional.': 'Le cours sur les religions du monde possède cinq lectures assignées distinctes pour le master, indiquées ci-dessus ; les textes ci-dessous pour la mention sont facultatifs.',
  'Required-reading exam': 'Examen des lectures obligatoires',
  'Master’s assigned readings (all five)': 'Lectures assignées du master (les cinq)',
  '<b>M.Div. and Th.M.:</b> all five assigned readings are part of the course. Their separate exam is required after activation; see its page for the current rule. Honors remains optional and does not replace the exam.': '<b>M.Div. et Th.M. :</b> les cinq lectures assignées font partie du cours. Leur examen distinct est obligatoire après son activation ; consultez sa page pour la règle en vigueur. La mention reste facultative et ne remplace pas l’examen.',
  'Course Readings — Required and Honors': 'Lectures du cours — obligatoires et avec mention',
  '<b>Certificate and Associate:</b> honors is optional. Read any three of the five selections for honors; no separate required-reading exam is needed.': '<b>Certificat et diplôme associé :</b> la mention est facultative. Lisez trois des cinq textes pour la mention ; aucun examen distinct des lectures obligatoires n’est exigé.',
  'Open Course Readings &rarr;': 'Ouvrir les lectures du cours &rarr;',
};

export function frenchInterface(root: HTMLElement, file = '') {
  // Older pages (certificates, single-page courses) carry a bilingual
  // "Catalog / Catálogo" link of their own; French pages say it once.
  // (Lesson text is the lesson's own and is corrected in the lesson.)
  for (const node of root.querySelectorAll('body a')) {
    const text = node.text.replace(/\s+/g, ' ').trim();
    if (FRENCH_INTERFACE[text] && !node.querySelector('*') && !node.closest('.cts-text-pair')) node.set_content(FRENCH_INTERFACE[text]);
  }
  for (const option of root.querySelectorAll('#regTrack option[data-fr]')) {
    option.setAttribute('data-en', option.text);
    option.set_content(option.getAttribute('data-fr')!);
  }
  for (const node of root.querySelectorAll('[data-cts-chrome] .cts-reading[data-cts-fallback]')) {
    const fr = FRENCH_FRAME[node.innerHTML.replace(/\s+/g, ' ').trim()];
    if (fr) { node.set_content(fr); node.setAttribute('lang', 'fr'); node.removeAttribute('data-cts-fallback'); }
  }
  // The older segmented switcher (hidden on language pages) keeps a bilingual label elsewhere.
  for (const node of root.querySelectorAll('.cts-seg[aria-label="Language / Idioma"]')) node.setAttribute('aria-label', 'Langue');
  // The certificates' seal gives the initials in English and Spanish; in French they are STC.
  for (const node of root.querySelectorAll('.seal')) if (node.innerHTML.trim() === 'CTS &middot; STC') node.set_content('STC');
  for (const node of root.querySelectorAll('.cert-seal > div')) if (node.innerHTML.trim() === 'CTS') node.set_content('STC');
  const unlabelled: string[] = [];
  for (const node of root.querySelectorAll('.cts-nav[aria-label], .tb-toc[aria-label]')) {
    const fr = FRENCH_LABELS[node.getAttribute('aria-label')!];
    if (fr) node.setAttribute('aria-label', fr); else unlabelled.push(node.getAttribute('aria-label')!);
  }
  if (unlabelled.length) throw new Error(`Missing French label on fr/${file} (add it to FRENCH_LABELS in src/lib/french-interface.ts):\n` + unlabelled.map(l => '  ' + l).join('\n'));
  const missing = root.querySelectorAll('[data-cts-chrome] .cts-reading[data-cts-fallback], .cts-reading[data-cts-chrome][data-cts-fallback]')
    .filter(node => !node.closest('[data-cts-legacy-control]'));
  if (missing.length) throw new Error(`Missing French interface text on fr/${file} (add a lang-fr version beside it):\n`
    + [...new Set(missing.map(n => '  ' + n.text.replace(/\s+/g, ' ').trim()))].slice(0, 20).join('\n'));
}
