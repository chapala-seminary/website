# Cutting the live site over to this build

The live site is served from a ZIP and has been since before this repository
existed. Nothing here has reached a student. This is the list of steps that
changes that, in order, with what to check after each one and how to get back.

**Do this while you are watching.** Not at the end of a day, and not on a phone.

---

## Before you start

Run the whole suite and read the last line of each check:

```
npm run build && test/run-tests.sh
```

Then the one check that is specifically about this day:

```
node tools/verify-cutover.mjs
```

It compares every file the live ZIP serves — commit `24dbaa8`, the verbatim
import — against `dist/`, and fails if any page a reader can reach today would
stop resolving. It also fails if anything in the build points at a file that is
going away. It currently reports 13 files disappearing, all of them Genesis
question data and its old renderer, which the one engine replaced.

A student who has bookmarked a unit page, or a search engine that has indexed
one, is the thing this protects. Do not skip it.

---

## 1. The database

```
npx wrangler d1 create chapala-students
npx wrangler d1 migrations apply chapala-students --remote
```

Then bind it: **Pages project → Settings → Bindings → D1 → `DB` = `chapala-students`.**
The binding name must be `DB`; the Worker looks for `env.DB` and answers 503 to
everything without it.

**Check:** nothing yet. The Functions deploy with the site, so this is inert
until step 3.

---

## 2. The rate limiting rule

**Security → WAF → Rate limiting rules → Create rule.**

| | |
|---|---|
| Expression | `http.request.uri.path starts with "/api/"` |
| Counting | by IP address |
| Requests | 30 |
| Period | 10 seconds |
| Action | Block |
| Duration | 10 seconds |

On the Free plan this is the only rate limiting rule you get, it can match on
path only, count by IP only, and both periods are fixed at 10 seconds. It stops
a flood and nothing slower — which is why the real guard is in the Worker:
`worker/api.js` counts *failed* lookups per address and cuts them off at 20 in
ten minutes. That one survives in the repository, is tested, and does not
depend on anybody remembering a dashboard setting.

The Workers rate-limiting binding would be the natural thing to reach for and
**is not available to Pages Functions**, which is why it is not used here.

**Check:** `curl -s -o /dev/null -w '%{http_code}\n' https://chapalaseminary.org/api/health`
in a loop of 50. You should see some `429`s.

---

## 3. Point Pages at the build

**Pages project → Settings → Builds & deployments:**

| | |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(repository root)* |

Deploy. **This is the step that makes everything real.**

**Check, in this order, on the live domain:**

1. `/` — the catalog, 44 courses.
2. `/assets/css/cts.css` — returns CSS, not 404. This is the single clearest
   sign that the new build is being served; it does not exist on the old site.
3. `/CTSActsUnit3.html` — a lesson, in English, and the **Español** control
   actually switches it.
4. `/api/health` — `{"ok":true}`. If it answers 503, the D1 binding from step 1
   is missing or misnamed.
5. `/CTSPrivacy.html` — loads, and in a browser where you have registered, shows
   your student code and offers to delete the record.
6. `/sitemap.xml` — 585 URLs, not the old ~514.

---

## 4. Straight after

* Register as a student, pass a unit, open `/CTSPrivacy.html`, press **Show what
  the seminary has**, and confirm it is you. Then delete it and confirm the page
  says so. **Do this once on the live site**, because it is the first time the
  database will have held anybody's name.
* Watch the Pages Functions logs for a few minutes for `student-records error`.

---

## Getting back

Cloudflare Pages keeps every deployment. **Deployments → the previous one →
Rollback.** That returns the ZIP-built site within seconds, and it is the whole
rollback: the database is additive and nothing in the old site reads it.

If instead the site is up but something is wrong with one page, fix forward —
rolling back to the ZIP loses the unified engine, the one design, and every
Spanish fix along with it.

---

## What is deliberately not in this list

* **The auth Worker and the GitHub OAuth app** for `/admin`. Only needed when
  someone other than Robert edits; local editing needs neither. `docs/cms.md`.
* **A translation provider.** `tools/translate-lesson.mjs` has the interface and
  a stand-in, no vendor.
* **Prerequisite gating from the collection.** Three hand-maintained lists in
  `public/cts-curriculum.js` still have to stay in step. It touches
  student-facing access control, so it wants its own change and its own
  before/after comparison — `tools/verify-gating.mjs` already provides one.
