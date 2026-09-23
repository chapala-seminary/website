# Templating: what is shared, what is per-unit, and why

Someone reading the lesson data will notice that 451 templates repeat a lot of
the same markup and reasonably ask why it is not a set of components. This is
the answer, with the measurements it was decided on.

## What was actually duplicated

Before this work: **451 templates, 4.37 MB.** Of that, furniture — the parts
that are not the lesson itself — was 21%. The other 79% is the shape of each
individual lesson.

That 79% cannot be shared, and it is worth being clear why, because "one
template per course" is the obvious idea. It does not work: normalise away
every hole id and every digit, and the 451 templates still come to **411
distinct shapes**. Strip out every piece of furniture and it only drops to
**400**. Exactly one of the forty courses has all of its units sharing a single
shape. Unit 4 of a course genuinely differs from unit 5 — different headings,
different numbers of sections, a diagram in one and not the other — because the
lessons differ. Per-unit is the right granularity and there is no per-course
template hiding underneath.

The 21% split into two quite different problems, and they got two different
answers.

## Furniture the build already threw away — deleted

Registration cards, unit navigation, language toggles, page headers and
footers: `src/lib/shell.ts` removes all of it from every lesson body at build
time, because the layout renders each one once for all 451 pages. It had been
in the data and not on the site for as long as the layout has existed. Some of
it held text, which meant the CMS offered teachers fields they could edit to no
effect.

`tools/strip-chrome.mjs` took it out — 1.03 MB, reading its selector list from
`shell.ts` rather than a copy of it, so the two cannot drift apart. Every word
removed is kept in `docs/removed-chrome-text.json`. See §5 of
`docs/content-changes.md`.

## Furniture that does reach the page — one definition, named from the template

The honours-readings box was different: 434 copies, 406 KB, and every copy
*did* render. Rewording it meant editing 434 files, or re-running extraction
against source HTML that no longer matches the site. There was no single place
to change it.

### Why not an Astro component

Because the lesson body never exists as a tree the layout can compose. It is
rendered to one HTML string by `renderLesson()` and handed to `Unit.astro`,
which injects it with `set:html`. A component cannot be placed in the middle of
a string without cutting the string up, and cutting it up per-unit is a much
larger change than the problem justifies.

The template already had a mechanism for *something goes here* — the holes that
lesson text fills. A partial is the same mechanism with a different kind of
filling.

### How it works

A template contains a named partial:

```html
<!--cts-part:honours-->
```

`renderLesson()` resolves it from `PARTIALS` in `src/lib/partials.ts`. The
spelling is deliberately not `<!--cts:…-->`: a partial is not a block, it has
no language and no translation state, and the two should not need squinting at
to tell apart.

An unknown name **throws and stops the build**, for the same reason an orphan
hole does. A typo that renders a page with a gap in it is worse than a build
that refuses.

### To reword the honours box

Edit `honoursBox` in `src/lib/partials.ts`. All 434 pages change together.

### To change where a course's reading room points

Edit `READING_ROOM` in the same file. Nearly every course uses
`<course>Readings.html`, but `CTS` points at `CTSOTSReadings.html`, so the
mapping is written out rather than computed — a rule with one exception is a
rule waiting to be got wrong.

### To add a partial

1. Add a function to `PARTIALS` in `src/lib/partials.ts`. It receives
   `{ course, unit, langs }`.
2. Put `<!--cts-part:your-name-->` in the templates that want it.
3. Run `node tools/verify-partials.mjs`.

A partial that no template names is reported as a failure too. Markup that is
maintained and never rendered is the thing this was built to get rid of.

## What this is checked by

| | |
|---|---|
| `tools/verify-partials.mjs` | every name resolves, every partial is used, every course using the box has a reading room |
| `npm run build` | `renderLesson` refuses an unknown partial name |
| `tools/verify-unchanged.mjs <dir>` | a build before a refactor against the build after, element by element |
| `tools/mutation-suite.mjs --only partial-unknown-name,partial-no-reading-room,partial-unused,partial-build-stops` | all four gates have been seen to go red |
| `tools/mutation-suite.mjs` | 41 mutations, all caught, given a served `dist/` and the reference front page |

One thing this work turned up that has nothing to do with templating: the
mutation suite was **unable to run at all**. It reads every mutation's files at
startup, and one stale path — `src/body/CTSActsUnit3.html`, gone since the last
course was converted — made the whole thing crash before a single mutation. The
suite that exists to prove the gates can fail could not run. Two mutations were
retargeted at the data those pages became.

A second one: `baseline-records-nothing` runs `prose-baseline.mjs record` as its
gate, and `record` writes `test/fixtures/prose-baseline.json` — which the
mutation did not declare, so the harness never restored it. The green run before
each mutation was quietly re-recording the baseline from the working tree, so
whatever the tree had just lost became the standard it was measured against. It
had cost 781 blocks of coverage. The harness now hashes `test/fixtures`,
`tools/content-baseline.json` and the CMS config around every mutation, puts
back anything a gate wrote to, and stops the run naming the file.

A third: `catalog-title` and `gating-core` had been reporting INCONCLUSIVE, and
the message blamed the checkout for not reaching commit `c257ea2`. It was not
the checkout. `git show <commit>:<path> > file` creates the file *before* git
runs, so a failed extraction leaves a **zero-byte** reference behind; if a run
is interrupted before its cleanup fires, the next run finds that file, accepts
it because it exists, and both gates report themselves already broken. Both
the harness and `test/run-tests.sh` now check that the reference looks like the
front page rather than merely existing, and say what to run if it is missing.
With a real reference both mutations are caught, so the suite is **41 of 41**.

`verify-unchanged.mjs` is the one to reach for the next time markup is moved
around. Snapshot `dist/` first, make the change, rebuild, point it at the
snapshot. It was itself mutation-tested before it was trusted: it catches a
single changed word, a removed `<br>`, a renamed class, and two paragraphs
swapped.

## The result

| | before | after |
|---|---|---|
| template markup | 4.37 MB | 3.33 MB |
| copies of the honours box | 434 | 1 |
| text frozen in templates | 73,208 chars | 7,323 chars |
| built pages that changed | — | **none, byte for byte** |
