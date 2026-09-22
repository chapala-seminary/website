# What the conversion changed about what a reader sees

The move from 451 hand-written HTML files to lesson data was held to one rule:
**nothing a reader sees may change.** It is checked on every build —
`tools/verify-lesson-render.mjs` compares all 451 built pages, element by
element, against 119,528 elements recorded from a build made while every page
still rendered from its original HTML.

This file is the list of deliberate exceptions. Everything here is a change
someone asked for or approved. Nothing else on the site has changed.

---

## 1. Eight translations written by a machine — **these want a human reader**

Eight blocks existed in one language only. A reader in the other language saw
nothing there. The text below was written by Claude (an AI), not by a
translator, and is marked `machine` in the data.

Find them at any time with:

```
node tools/lesson-status.mjs | grep machine
```

| Course | Unit | Block | Added | Length |
|---|---|---|---|---|
| CTSBibleCharacters | 1 | `b039` | Spanish | 850 |
| CTSJosh | 2 | `b016` | Spanish | 512 |
| CTSJosh | 2 | `b029` | Spanish | 400 |
| CTSJosh | 9 | `b027` | Spanish | 189 |
| CTSRadical | 4 | `b014` | Spanish | 172 |
| CTSWR | 10 | `b033` | English | 63 |
| CTSWR | 11 | `b028` | English | 56 |
| CTSST | 7 | `b056` | *(see §2 — merged, not translated)* | — |

**One of these was nearly wrong.** The first pass reported CTSRadical unit 4
`b015` as untranslated and it was translated. It was not untranslated: an
English paragraph *before* it had no Spanish, and the alignment had slipped by
one, so `b015` was sitting beside the Spanish of the paragraph after it. Both
halves were real, careful text — they simply were not each other's. The
alignment now weighs length as well as tag, the slip is gone, and the block
that actually lacks Spanish is `b014` ("Then came a Samaritan…"). The wrong
translation was discarded, not shipped.

**What "marked `machine`" buys you.** Each carries the hash of the source it
was translated from. When someone fluent corrects one, the CMS marks it
`machine-edited` and no automatic pass will ever overwrite it. Until then it
reads as what it is. The texts are also kept verbatim in
`tools/data/translations.json`, so they can be diffed or replaced wholesale.

**The Spanish was written to match each unit's own conventions** — CTSST unit
12 uses straight quotes and `— Referencia`, others use `« »` — rather than a
house style imposed across the site. Scripture quotations follow Reina-Valera
Gómez, which is what the surrounding Spanish uses.

## 2. CTSST unit 7 — one heading instead of two

The page had **"The Heart of Glorification"** after the Romans 8:30 quotation
and **"El Corazón de la Glorificación"** three elements earlier, before the
paragraph that defines glorification. Two headings, in two different places,
and neither language could see the other's.

Both now sit immediately before the quotation, as one bilingual block
(`b056`), so the two languages read in the same order:

> …the final and complete stage of salvation → **The Heart of Glorification**
> → *"Whom He justified, these He also glorified." — Romans 8:30* → The most
> significant element of glorification…

The old Spanish-only block `b053` is gone; its text is the `es` side of `b056`.

## 3. CTSDP unit 7 — an author's note removed

A note to a reviewer was live on the site, in Spanish, in the middle of the
lesson:

> *(Nota del autor para revisión: el **bosquejo** de las cuatro obras se armó
> de textos estándar para su aprobación en la Puerta 2; la enseñanza y las
> ilustraciones ahora reflejan su propio ministerio.)*

Block `b025` and the `<p>` that held it are removed. Nothing replaced it.

---

## Still open, and deliberately not changed

*(Nothing. CTSST unit 12, listed here previously, is fixed — see below.)*

## Resolved since: CTSST unit 12

Ten and a half thousand characters of Spanish were frozen in that unit's page
template, rendering correctly and editable by nobody. Its English sat in a
`lang-en` div plus a `lesson-section` div; its Spanish in one `lang-es` div
outside them both, so the two never aligned and the whole thing was taken
whole. The extractor now flattens a wrapper when doing so lines the two sides
up, and pairs the wrapper rather than the marked div when the English is split
across both. The unit is 42 properly paired blocks — 475/481, 489/491,
847/905 characters — and `tools/verify-editable.mjs` now fails the build if
lesson text is ever left in a template again.

---

## How to check any of this yourself

```
node tools/lesson-status.mjs             # every block's translation state
node tools/verify-lesson-render.mjs      # all 451 pages against the reference
node tools/prose-baseline.mjs check dist # 25,773 recorded text blocks
```

The reference in `test/fixtures/lesson-render.json` was re-recorded after each
change listed above, so it now encodes the site *with* these changes. The
commits are the audit trail: `git log -- src/content/lessons` shows each one,
and every change here was proved to alter only what it claims to — the page
was re-rendered with the change backed out and compared against the previous
reference, element for element.
