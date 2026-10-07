# Language engine: first part of the French pilot

This is PR 1 of the 7 October page-per-language work. It changes grading;
per-language routes, source-text controls and French interface wording follow
in separate PRs. Nothing here translates a course or connects a provider.

## Runtime contract

- `CTS_UNIT.sourceLang` names the course's source language. It defaults to
  `en` for old pages, which do not yet emit that field.
- `CTS_UNIT.langs` lists additional supported language codes. English, Spanish
  and French are recognized now; a page can declare Ukrainian or another code.
- The reader's language comes from the page's body classes or `data-lang`,
  then the document's language. The legacy `both` mode means Spanish for
  grading, with English available as the source.
- Short answers pass against either the reader's keyword list or the source
  list. Each list is checked separately: translated copies of a concept do
  not increase its score. Synonyms still count once, stems still match, and
  the existing minimum-hit rule is unchanged.
- Fill-ins accept the reader's answers and alternatives, plus the source's.
  Existing pages without `sourceLang` retain English/Spanish acceptance in
  English and Spanish modes. This compatibility ends when PR 2 supplies the
  source field. French and future languages already use reader plus source.
- Normalization keeps Unicode letters and numbers. Short answers preserve
  accents; fill-ins fold Latin accents as before while preserving Spanish `ñ` and Cyrillic
  letters such as `й`.
  French articles include `le`, `la`, `les`, `l'`, `un`, `une`, `des`.
- Multiple-choice answers still use option position. Storage keys, pass marks
  and lockout times are unchanged.

The standalone `cts-fill.js` widget uses the same pure normalization and
fill-in functions, held equal by `verify-fill-single.mjs`. Its old pages keep
English/Spanish grading. The pure `fillRight(q, answer, languages)` helper lets
answer-key checks name the language they are checking without a browser.

## Validation

`npm run build` then `npm test` is required. `test/engine-languages.mjs` runs
49 browser assertions against the shipped engine, including French accents,
elision, keyword stems, Cyrillic, non-English source language, Spanish `ñ`,
and multiple-choice position. The existing full built-site tests still cover
English/Spanish pages, progress, lockouts and track requirements.

## Work remaining

PR 2 needs language routes, `hreflang`, remembered-language redirects with an
explicit override, source-language metadata, the two controls, and lesson,
room and honors rendering on desktop and phones. Rendering currently keeps
26 historical markup shapes; French text has no template slots in those
shapes. The renderer and its checks need to change together rather than
copying Spanish HTML to a new directory. Static catalog, certificate and
standalone-course pages also need their links and controls accounted for.

PR 3 needs interface tables and the approved pilot course. The curriculum
lists Old Testament Survey (`CTSUnit1.html`) first but permits any foundation
course first. Robert must confirm the course before translation. A real
provider requires Robert's approval of the provider and estimated cost.
The translation tool must protect even stale `human` and `machine-edited`
work; today it reports then replaces stale human work, which does not meet
the request. Lessons, questions and answer keys need one translation pass,
Louis Segond 1910 Scripture, a glossary and a fill-in/keyword review file.
Tag output is a pipeline test, not publishable French content. A trained
French reviewer and Dr. Cook's pilot approval remain pending.
