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
  const missing = root.querySelectorAll('[data-cts-chrome] .cts-reading[data-cts-fallback], .cts-reading[data-cts-chrome][data-cts-fallback]')
    .filter(node => !node.closest('[data-cts-legacy-control]'));
  if (missing.length) throw new Error(`Missing French interface text on fr/${file} (add a lang-fr version beside it):\n`
    + [...new Set(missing.map(n => '  ' + n.text.replace(/\s+/g, ' ').trim()))].slice(0, 20).join('\n'));
}
