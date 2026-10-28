/* The site's languages, in one place (docs/language-engine.md).
 *
 * English is the source of every course. Spanish and French were added one
 * by one, and many older files still name them directly; those keep working
 * unchanged. A language added after French (Swahili, 27 Oct 2026) is data:
 * its code here, its interface words in src/data/interface/<code>.json, and
 * its course text in the lesson and question files. The page builder
 * (tools/language-pages.mjs), the engines and the Worker read this list.
 *
 * Plain JavaScript, so the Worker, the build tools and the TypeScript pages
 * can all import it.
 */
export const SITE_LANGUAGES = ['en', 'es', 'fr', 'sw'];

/* The languages whose words are written into the layouts beside the English
   (lang-en / lang-es / lang-fr spans). A later language gets its interface
   words from its dictionary instead (src/data/interface/<code>.json). */
export const LAYOUT_LANGUAGES = ['en', 'es', 'fr'];
export const DICTIONARY_LANGUAGES = SITE_LANGUAGES.filter((l) => !LAYOUT_LANGUAGES.includes(l));

/* Each language's own name, as the language toggle shows it. */
export const LANGUAGE_NAMES = { en: 'English', es: 'Español', fr: 'Français', sw: 'Kiswahili' };

/* The name of the source language (English) in each reader's language, for
   the "Show English" control and the fallback notice. */
export const ENGLISH_IN = { es: 'inglés', fr: 'anglais', sw: 'Kiingereza' };

/* Locale tags for dates and country names. */
export const LOCALE = { en: 'en-US', es: 'es-MX', fr: 'fr-FR', sw: 'sw-KE' };

export const isSiteLanguage = (code) => SITE_LANGUAGES.includes(code);
