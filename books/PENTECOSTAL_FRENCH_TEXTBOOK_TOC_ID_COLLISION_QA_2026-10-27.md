# Pentecostal textbook French table-of-contents anchor collision — pre-release QA
Date: 2026-10-27 (Mexico City). Nonproduction source/renderer handoff. **No textbook content, exam keys, beta or production changed.**

## Verified scope
Inspected the exact staged release ref `claude/pentecostal-required` (release candidate `da97604` per tracker row 247) using the GitHub file API. The four staged textbook JSON files contain three complete HTML language bodies. A heading-ID scan over all `h2/h3` elements produced:

| Staged file | English heading IDs | Spanish heading IDs | French heading IDs | Duplicate IDs across EN+FR |
| --- | --- | --- | --- | --- |
| `src/content/textbooks/elecpcone.json` | `en-1` … `en-5` | `es-1` … `es-5` | `en-1` … `en-5` | 5 |
| `src/content/textbooks/elecpctwo.json` | `en-1` … `en-5` | `es-1` … `es-5` | `en-1` … `en-5` | 5 |
| `src/content/textbooks/elecpcthree.json` | `en-1` … `en-5` | `es-1` … `es-5` | `en-1` … `en-5` | 5 |
| `src/content/textbooks/elecpcfive.json` | `en-1` … `en-5` | `es-1` … `es-5` | `en-1` … `en-5` | 5 |

**20 French chapter headings collide with 20 English chapter headings** in the same rendered textbook pages. This is not an isolated missing-translation label.

## Verified renderer path and risk
In `src/pages/[textbook].astro`, lines 29–32 build each language's TOC directly from `h2/h3 id` values; lines 80–87 link each TOC item to `#${c.id}`; lines 90–91 render the English, Spanish and French HTML bodies together on one page. Thus a French contents link points to `#en-1` etc., an ID already present in the earlier English article. HTML IDs must be unique within a document. Browser fragment navigation commonly selects the first matching ID; this can send French readers to the English (normally hidden) section instead of the intended French chapter. **The duplicate DOM IDs and TOC targets are verified statically; the precise browser symptom is not yet independently rendered/tested.**

`tools/import-textbooks.mjs` already assigns language-specific IDs for its EN/ES imports (`finish(html, lang)`), but its import loop covers only EN/ES. The staged FR body apparently retained English IDs during translation/import; do not assume a particular translation script is responsible without tracing it.

## Requested safe repair (Claude elective/release sessions)
1. In the **source generator or translation postprocessor**, rewrite the French HTML heading IDs to `fr-1` … `fr-5` for each staged textbook, preserving their chapter order; regenerate the four JSON outputs rather than hand-editing only generated files. Do not alter the historical text, question banks, or required-from policy.
2. Add a report-only then CI-enforced check across every textbook that has multiple language bodies: parse each `h2/h3 id` and assert **no duplicates within or across languages**, **nonempty IDs**, and **every generated TOC href resolves to exactly one heading in its own language article**. Also catch any in-body `href="#en-N"` references when remapping FR IDs, if present.
3. Build the candidate branch and perform EN/ES/FR browser checks: click chapter 1 and chapter 5 in each language; verify the URL hash resolves to the *visible, correct-language* heading, and no duplicate IDs remain in rendered DOM.
4. Rerun private-key/build/exposure tests and exact-head beta CI after any release candidate update; do not reuse prior approval for a changed SHA. The private assessment-keys PR #7 remains owner-only.

## Reproduction recipe
For each `elecpc{one,two,three,five}.json`, read `body.en`, `body.es`, `body.fr`; collect heading IDs using `/<(?:h2|h3) id="([^"]+)"/g`. Compare set intersections; each EN∩FR set currently has exactly five elements. Then verify the renderer's `toc` function and three `set:html` article renderers in `src/pages/[textbook].astro`.

## Governance
This is a **French reading-navigation pre-release QA defect**, not a rights clearance, doctrinal ruling, or evidence of key leakage. The branch `beta` has not advanced past `c6110458` as of this check, so the row-242 beta-success gate for opening a release PR is still closed. Keep PR #164 draft and email sending OFF. Wayne retains all release, academic and rights decisions.


## Post-build transform trace — supersedes the runtime-defect conclusion

A second trace through the exact build integrations shows that the duplicate IDs in the canonical Astro source do **not** survive into the built French page as duplicate DOM IDs.

- `astro.config.mjs` runs `tools/language-pages.mjs` after Astro builds the canonical page.
- For each `/fr/` page, `buildLanguagePages()` calls `localizeMarkup(..., 'fr', 'en')`.
- In `src/lib/language-content.ts`, `localizeMarkup()` pairs the English source `ol`/`article` with the French target, keeps the source element and its attributes, inserts the French wording as the reader text, and removes the separate French language node.
- Consequently the built French textbook page has one TOC link namespace (`#en-1` … `#en-5`) and one corresponding heading namespace. The visible heading wording is French; the optional English source wording is nested as source text. There are no EN/FR duplicate IDs in the final DOM from this source pattern.

Therefore the 20 source-level EN/FR ID repetitions remain a verified canonical-data observation, but they are **not a verified French runtime navigation defect and should not block release or trigger a generator rewrite**. Rewriting only the French source IDs to `fr-*` would be discarded by the current pairing transform because source attributes intentionally win.

Safe follow-up: add a built-output assertion after `language-pages.mjs` that each emitted page has unique IDs and every TOC fragment resolves exactly once. An exact-head browser/build check is still useful, but the prior request to rewrite the four French source ID sets is withdrawn unless built output contradicts this transform trace.
