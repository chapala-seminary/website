# Pages by language

English keeps the existing `.html` addresses. Spanish uses `/es/<same file>`;
French uses `/fr/<same file>`. `tools/language-pages.mjs` runs last in the Astro
build and builds each version from the same page and lesson data. Course lesson and
question files are not duplicated or edited by this change.

`English · Español · Français` chooses a URL. The separate source checkbox is
named from `sourceLang`; it is absent on a page in that source language. Source
text is beside each translated block on desktop, below it on phones, and below
exam wording at every width. Exam options keep their original positions.

Static reading pages pair matching paragraphs and repeated paragraph runs.
Some existing Spanish digests condense several English paragraphs; those
corresponding runs stay together rather than guessing which source paragraph
was omitted. A parity review remains a content task. Malformed shelf-title
spans and a stray nested quotation are repaired so later reading content
remains outside the language label or quotation.

`cts_lang` remembers the reader's choice. An explicit `?cts_lang=es` (or `en`,
`fr`) overrides memory and is then removed from the URL if the preference was saved.
If storage rejects the write, the explicit URL choice is retained for reloads. Other parameters and
the fragment survive. Language links use that override even without script.
A remembered language redirects old English links to the matching language
page. `cts_show_source` stores the independent source visibility preference.
A stored `cts_lang=both` migrates to Spanish with source on. Old controls that
never stored their Both mode left no preference that can be recovered.

Course progress and answers retain their existing keys. Reading-room scripts
that used `location.pathname` as a checkbox key use the original English path
in every language. Legacy inline language controls remain hidden hooks only
where a page's old script still needs them. The generated page's language stays
authoritative when those scripts initialize.

French routes currently show English with an explicit translation-pending
notice, use English language tags on fallback text, and are `noindex,follow`.
They are not French translations. French is selectable, but does not become an
automatic browser-language default yet. The French interface, confirmed Old
Testament Survey pilot and human review are separate work. No course content
is translated by the page builder.

Each page has canonical and en/es/fr `hreflang` links. Spanish sitemap entries
follow the same inclusion/exclusion policy as English. Untranslated French
routes are excluded. Shared assets stay at their original root paths.

## Checks

The pre-language build is saved to `.astro/language-base` (not published).
The existing prose and element-for-element lesson baselines check that build.
The final language pages are checked independently against original lesson
slots after the established layout removes its old navigation. Both checks
are required: the snapshot alone cannot prove the final transformation.

- `tools/verify-language-pages.mjs`: final metadata, links/assets and each
  retained lesson block's reader/source wording in all three languages.
- `tools/verify-language-browser.mjs`: every page in all three languages at
  desktop and phone widths, source visibility, errors, stored Both migration,
  explicit language override, storage denial and saved MC choices.
- `tools/verify-room-language.mjs`: every reading room and the honors page,
  language/source choices, unmarked passages, remembered choices and sticky bar.
- Existing exam, gating, progress, certificates and Worker checks remain in
  `npm test`; language-control checks now navigate between the real pages.
