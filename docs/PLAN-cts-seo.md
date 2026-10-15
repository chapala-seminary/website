# Plan: search and AI discovery for Chapala Theological Seminary

Written after reading the live tree on `beta` (Astro 7 static build, Cloudflare
Worker with `html_handling: "none"`, per-language pages already at `/es/` and
`/fr/`). The sibling `brain` repo was not reachable from this environment, so
this plan does not silently reverse a recorded decision; it records what the
code and `docs/` actually do today.

This document is the map. Phase 1 is implemented in the same pull request.
Phases 2–6 stay planned; their draft copy is in `docs/drafts/` and is **not
published**.

Goals the seminary named:

- **(A)** Rank in Google and Bing, in English and Spanish, for queries such as
  “free online seminary”, “seminario teológico gratis en línea”, “cursos
  bíblicos gratis con certificado”, “estudiar teología gratis”, “seminario en
  línea para pastores”.
- **(B)** Be named and described accurately by AI assistants (ChatGPT, Claude,
  Gemini, Perplexity, Grok, Meta AI).

Constraints that do not move: no course content, doctrine, or credential-rule
changes; no paid vendors or tracking; performance on slow phones and older
Android; existing `.html` URLs stay; 301s for any new alias; never put a
student code in a public URL; never imply accreditation.

---

## How the site is built today

| Piece | What it is |
|---|---|
| Pages | Astro 7, `build.format: 'file'`, so `/CTSActsUnit3.html` stays a file, not a directory. |
| Host | Cloudflare Worker (`worker/index.js`) plus static assets. **Not** Cloudflare Pages — Pages 308s `.html` away. |
| Languages | `tools/language-pages.mjs` writes English at the root, Spanish at `/es/<same file>`, French at `/fr/<same file>`. Each page already has `hreflang` (`en`, `es`, `fr`, `x-default` → English) and a canonical. |
| Lessons | Rendered at build time from `src/content/lessons`. The lesson text is in the HTML. It is not JS-only. |
| Catalog | 45 course cards generated from `src/content/courses`. A card’s `Begin` link is the first unit (or the one-page course). |
| Sitemap | `src/pages/sitemap.xml.ts`, then language-pages copies every English URL to `/es/` and adds only `/fr/index.html`. |
| Robots | `public/robots.txt` allows `/`, disallows `/admin/`, points at the sitemap. Staging hosts get a different robots.txt and `X-Robots-Tag: noindex`. |
| JSON-LD | Home has `EducationalOrganization` + `FAQPage`. Catalog has a `Course` `ItemList`. About has `AboutPage`. Faculty, tracks, offers, and `parentOrganization` are missing or incomplete. |
| llms.txt | Short, English-only, and **wrong on the Th.M.** (says 12 courses; the rule is 15). |
| Certificates | Indexed today (in the sitemap). They are generated in the browser and can show a student’s name. |
| 404 | Worker returns the asset service’s empty 404. There is no seminary 404 page. |
| Hosts | Both `chapalaseminary.org` and `www.chapalaseminary.org` are treated as the real site. That is two indexable hosts. |
| Home page | Still the original half-megabyte of inline CSS and inlined images, with a generated catalog in the middle. Rewriting it is not a Phase 1 job. |
| CI | `.github/workflows/beta.yml` builds, tests, and deploys **only** on push to `beta`. There is no Lighthouse job and no SEO assertion suite. |

French is a draft language: untranslated and machine-draft `/fr/` pages are
already `noindex,follow`. That stays.

---

## URL policy (do not reverse)

English stays at `/Page.html`. Moving it to `/en/` would break every indexed
URL, every bookmark, and `tools/verify-cutover.mjs`.

Spanish and French already have their own crawlable URLs. Phase 1 does **not**
invent a second Spanish tree.

Safe additions:

| From | To | Why |
|---|---|---|
| `https://www.chapalaseminary.org/…` | `https://chapalaseminary.org/…` (301) | One HTTPS host. |
| `https://chapalaseminary.org/en` and `/en/…` | the English page (301) | So `/en/` works as an alias without duplicate content. |
| New `/CTSNTCourse.html` (and the other 44) | — new pages, no move | Course landings. First units keep their URLs. |

A machine-readable map is in `docs/redirect-map.md`.

---

## What “a course landing” means here

There is no course overview page today. Search engines and assistants land on
Unit 1, which is a lesson plus a registration card. Phase 1 adds one static
HTML page per course, named from the catalog entry (`CTSNTCourse.html`,
`CTSCounselingCourse.html`, …).

Each landing says, in the page language:

- the course title and a short description (from `src/content/courses`, not new doctrine)
- the units, with links
- foundation / M.Div. core / elective / open-before-foundation
- textbook and required readings, when the catalog has them
- author (see facts to confirm)
- languages offered
- which credential tracks the course can count toward
- a Start button to the existing first-unit (or one-page) URL

The catalog and home cards keep linking to the first unit. Changing that would
move the path `tools/verify-gating.mjs` watches. The landing is extra, not a
replacement.

---

## Phase 1 — implement

### 1. Robots, private pages, sitemap

`robots.txt` (production only; staging already refuses everything):

- Allow Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot,
  ClaudeBot, Claude-SearchBot, Applebot, and `*` for the public site.
- Keep `/admin/` out.
- Keep student-record, progress, save-restore, and certificate-generation
  paths out of the index: `/verify`, `/staff`, `cts-backup.html`,
  `cts-confirm-email.html`, `*Certificate.html`, and their `/es/` and `/fr/`
  copies.
- Point at `https://chapalaseminary.org/sitemap.xml`.

Sitemap policy change: **certificate pages leave the sitemap**. They stay on
the site for students. Units, reading rooms, textbooks, standalone pages,
privacy, and the new course landings stay in. Spanish copies follow the same
rule. French stays “home page only” until a director marks French final.

`tools/verify-sitemap.mjs` is updated to match the new policy (it currently
*requires* certificates to be listed).

### 2. Language metadata

Already present: per-language files, `hreflang`, canonical, language toggle,
`lang` on `<html>`.

Missing or weak: Spanish (and many English) titles and descriptions are the
English string, often longer than 60 / 155 characters, and sometimes bilingual
in one tag. Phase 1 writes one title and one description per page **and**
language, applied after the language pages are built (`tools/inject-seo.mjs`).
Certificate page titles are left alone — `cts-certify.js` reads `document.title`.

French titles already have a dedicated pass (`src/lib/french-titles.ts`). The
SEO pass shortens them the same way and does not publish new French lesson
text.

### 3. Course landings, titles, cards, JSON-LD

- Unique `<title>` (≤60) and meta description (≤155) per page and language.
- One H1. Open Graph and Twitter cards. Alt text on images we add.
- JSON-LD, **real data only**:
  - `EducationalOrganization` with `parentOrganization` Common Ground Fellowship
    (Little Chapel, Ajijic). No accreditation property.
  - `WebSite` with the real homepage.
  - `Course` on each landing (`inLanguage`, `isAccessibleForFree`, `offers`
    price 0, `hasCourseInstance` online / self-paced).
  - `EducationalOccupationalProgram` for the four tracks on the programs page.
  - `Person` for Dr. Wayne Cook and Dr. Ted Rogers on About.
  - `FAQPage` on the home page (existing questions; accreditation answer must
    not claim a government-recognized degree).
  - `BreadcrumbList` on landings and unit pages.
- Lesson pages already ship HTML. Phase 1 does not move lesson text into JS.

### 4. `/llms.txt` and `/llms-full.txt`

English first, with Spanish sections. Facts from the curriculum and About
pages: free, languages, 45 courses, the four tracks and their counts,
accreditation status (not accredited; seeking recognition in Mexico),
audience, how to start, contact, key URLs. The full file lists every course
from the catalog. Neither file invents a number the catalog does not support.

### 5. Performance and headers

Safe in this PR:

- Security headers on every response (HSTS, `nosniff`, referrer policy,
  `sameorigin` framing, a tight Permissions-Policy). No Content-Security-Policy
  yet — hundreds of pages use inline scripts and a CSP would break them.
- Short HTML cache; long cache on fingerprinted `/assets/` files.
- One HTTPS host (www → apex).
- A real `404.html` served with status 404.
- Course landings: static HTML, existing `cts.css`, no extra webfont request,
  seal image with width, height, and `loading="lazy"`.
- Unit pages: breadcrumbs in the chrome; existing Google Fonts left as they
  are (changing them site-wide is a visual review).

Not in this PR: rewriting the home page. It is the LCP problem. See
“Lighthouse” below.

### 6. Checks

| Check | Where |
|---|---|
| `robots.txt`, sitemap policy, hreflang pairs, `llms.txt` / `llms-full.txt`, JSON-LD shape | `tools/verify-seo.mjs`, run from `test/run-tests.sh` |
| Sitemap inclusion | updated `tools/verify-sitemap.mjs` |
| Staging still noindex; production indexable except private paths | updated `tools/verify-staging.mjs` |
| www and `/en/` 301s; 404 page | `tools/verify-worker-routing.mjs` |
| Link check of landings + home + one lesson, both languages | `tools/verify-seo-links.mjs` |
| HTML well-formedness of those same pages | `tools/verify-seo-html.mjs` |
| Lighthouse (mobile) | `.github/workflows/seo.yml` on pull requests |

Lighthouse URLs: `/`, `/es/index.html`, one course landing in English and
Spanish, one lesson in English and Spanish.

Requested budgets: Performance ≥95, SEO 100, Accessibility ≥95, Best
Practices ≥95, LCP <2.5s, CLS <0.1.

Honest limit: the current home page cannot hit Performance 95 without a
rewrite it did not get. The workflow **reports** home scores and **enforces**
the budgets on the new course landing and on a lesson page. Home still has to
pass SEO 100 after the metadata pass. Scores are written to
`docs/SEO-LIGHTHOUSE.md`.

---

## Phases 2–6 — plan only (drafts for the directors)

Draft copy lives in `docs/drafts/`. Every draft file starts with `DRAFT — not
published`. Nothing in that folder is copied into `public/` or `src/pages/`
until a director approves the wording.

### Phase 2 — Trust

One identical accreditation statement, in English, Spanish, and French, on
home, programs, FAQ, and certificate pages. Titles (Certificate of Ministry,
Associate of Divinity, Th.M., M.Div.) are **internal ministry recognitions**.
Mexico requires SEP / RVOE for an official degree. CTS is not accredited and
does not grant official Mexican degrees.

Risky wording already on the site (flag, do not silently rewrite in Phase 1):

| Where | Why it is risky |
|---|---|
| Home FAQ “earn a real certificate” | “Real” can be read as government-recognized. |
| Home / About / catalog using “Master of Theology” / “Master of Divinity” with no qualifier | Readers (and models) treat those as accredited degrees. |
| Home JSON-LD `EducationalOrganization` with no `parentOrganization` and no disclaimer | Assistants invent a standalone accredited school. |
| Certificate pages in the sitemap (fixed in Phase 1) | A named student’s certificate can be indexed. |
| `llms.txt` Th.M. “12 courses” (fixed in Phase 1) | Assistants will repeat the wrong count. |

Also planned, not written into the live tree here: fuller faculty bios, a
statement of faith page, and a privacy page that explains student codes in
plain language (the privacy page exists; the code explanation can be clearer).

Draft: `docs/drafts/accreditation-statement.md`.

### Phase 3 — Content

Spanish-first pages, then an English mirror, each opening with a direct two- or
three-sentence answer plus an FAQ:

1. How this free seminary works.
2. Free Bible courses with a class certificate.
3. Pastoral training for Cuba and Latin America.
4. Track comparison (12 / 25 / 15 / 30, and what work each track asks).
5. Short practical guides (how to start on a phone, how a student code works,
   what “honors” means).

These are new URLs, so they do not move anything. They stay drafts until
faculty sign off. French copies wait for the French reviewer.

Drafts: `docs/drafts/como-funciona-el-seminario.md` and the siblings listed
there.

### Phase 4 — AI readiness

- One stable sentence in English and Spanish that every page and every
  assistant-facing file can repeat. Draft: `docs/drafts/one-line-description.md`.
- A machine-readable course catalog (JSON) generated from the same collections
  the site already uses, with a documented URL once Phase 3 pages are approved.
  Schema draft: `docs/drafts/ai-catalog-schema.md`.
- Keep `/llms.txt` and `/llms-full.txt` in the build (Phase 1) and treat them
  as a faculty-reviewed source.

### Phase 5 — Off-site (directors’ checklist)

Search Console and Bing Webmaster for `chapalaseminary.org`, language/country
filters, sitemap submit, www-vs-apex once the 301 is live. Directories,
church and mission partnerships, and testimonials only with the person’s
consent. No paid listings required.

Draft: `docs/drafts/off-site-checklist.md`.

### Phase 6 — Measurement

Monthly: Search Console by language and country; a handwritten check of the
named assistants in English and Spanish, logging whether CTS is mentioned,
whether accreditation is described correctly, and which URLs they cite.

Draft: `docs/drafts/measurement.md`.

---

## Facts the seminary must confirm

Listed again, with owners, in `docs/FACTS-TO-CONFIRM.md`. The build uses only
facts already on the About page, the curriculum doc, or the catalog. Anything
marked “confirm” is either used cautiously or left out of JSON-LD.

---

## What this PR will not do

- Change a lesson, exam, answer key, or credential rule.
- Move an existing `.html` URL.
- Publish French lesson text that is not already a draft.
- Add analytics, tag managers, or paid SEO tools.
- Put a student name, email, or code in a sitemap, `llms.txt`, or URL.
- Claim SEP, RVOE, ATS, or any other accreditation.
