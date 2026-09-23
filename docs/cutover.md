# Cutting the live site over to this build

The live site is served from a ZIP in a Cloudflare Pages project, and has been
since before this repository existed. Nothing here has reached a student.

This is the list of steps that changes that, in order, with what to check after
each one and how to get back. It goes through **beta.chapalaseminary.org**
first, so the new site can be read side by side with the one students are using
before anything is switched.

**Do this while you are watching.** Not at the end of a day, and not on a phone.

---

## Why a Worker and not Cloudflare Pages

Pages answers `/CTSActsUnit3.html` with a 308 redirect to `/CTSActsUnit3`, and
there is no setting to turn that off. Every one of the 801 pages here ends in
`.html`, 8,878 links between them do too, and `build.format: 'file'` is in the
Astro config for the single purpose of keeping those URLs exactly as students
and search engines already have them.

So the site deploys as a **Worker with static assets**, where
`html_handling: "none"` serves the file that was asked for. `worker/index.js`
explains the rest; `tools/verify-worker-routing.mjs` is the check that keeps it
true. Cloudflare's own Pages-to-Workers guide confirms the two consequences:
`functions/` has to become a Worker script (it has — `functions/` is gone), and
`run_worker_first: true` is what replaces `_middleware`.

---

## Before you start

```
npm run build && test/run-tests.sh
```

Read the last line of each check. Then the two that are specifically about
this day:

```
node tools/verify-cutover.mjs        # would any URL a student can reach today stop working
node tools/verify-worker-config.mjs  # does the config that gets deployed match the one just tested
```

`verify-cutover.mjs` compares every file the live ZIP serves — commit
`24dbaa8`, the verbatim import — against `dist/`. It currently reports 13 files
disappearing, all of them Genesis question data and its old renderer, which the
one engine replaced, and nothing references them. A student who bookmarked a
unit page, or a search engine that indexed one, is what that check protects.

---

## Step zero — which Cloudflare account

This repository is worked on from a machine with access to two Cloudflare
accounts. **wrangler with no `account_id` picks one for you**, and the first
`wrangler d1 create` here went to the wrong one. A database in the wrong
account is a minute's cleanup. `wrangler deploy` in the wrong account publishes
the seminary into somebody else's.

So `account_id` is pinned in `wrangler.jsonc`, and `npm run deploy` refuses to
run while it — or any database id — is still a placeholder.

1. **Find the id.** Cloudflare dashboard → switch to the **Chapala** account →
   Workers & Pages. The **Account ID** is in the right-hand column. It is a
   32-character hex string, and it is not a secret.

2. **Put it in `wrangler.jsonc`**, in *both* places: the top-level `account_id`
   and `env.beta.account_id`.

3. **Check that wrangler agrees**, from the repository root:

   ```
   npx wrangler whoami
   npx wrangler d1 list
   ```

   `whoami` lists every account the login can reach. `d1 list` shows the
   databases in the one that is actually being used — which is the question
   that matters, and the one that went wrong. If it lists the Website Machine
   databases, stop here: the login is pointed at the wrong account.

4. **Clean up anything created in the wrong account.** Easiest from the
   dashboard rather than the CLI, because it avoids doing account-switching and
   deletion in the same breath: switch to the account it landed in, Storage &
   Databases → D1, and delete `chapala-students-beta` there. It has no data in
   it — the migrations may not even have run.

Every deploy below goes through `npm run deploy` / `npm run deploy:beta`, which
run that check first. Calling `wrangler deploy` directly skips it.

---

# Stage one — beta

Nothing about the live site changes in this stage. It can be abandoned at any
point by deleting the beta Worker.

## 1. A database for beta, separate from the real one

```
npx wrangler d1 create chapala-students-beta
npx wrangler d1 list
```

Copy the `database_id` it prints into **`wrangler.jsonc`**, under
`env.beta.d1_databases[0].database_id`, replacing `PUT-THE-BETA-DATABASE-ID-HERE`.

`d1 list` afterwards is not ceremony: it shows which account the database
actually landed in. Step zero explains why that is worth ten seconds.

```
npx wrangler d1 migrations apply chapala-students-beta --remote
```

It is a separate database on purpose: registering a test student while reading
the site must not leave a row in the real students' table.

## 2. Deploy it

```
npm run deploy:beta
```

It checks the account and database ids, builds, and deploys, in that order.

**Check:** the command prints a `*.workers.dev` URL. Open it. The catalog
should load, and `<that URL>/CTSActsUnit3.html` should open the lesson **with
no redirect** — the address bar still says `.html`.

## 3. Give it the beta address

**Workers & Pages → chapala-seminary-beta → Settings → Domains & Routes → Add
→ Custom domain → `beta.chapalaseminary.org`.**

Cloudflare creates the DNS record itself, because the zone is on Cloudflare.
It takes a minute or two to issue the certificate.

**Check:**

```
node tools/verify-worker-routing.mjs https://beta.chapalaseminary.org
node tools/verify-staging.mjs        https://beta.chapalaseminary.org
```

The second one matters more than it looks. beta is 800 pages identical to the
real site on a public address; `worker/index.js` marks every response on any
host that is not `chapalaseminary.org` with `X-Robots-Tag: noindex, nofollow`
and serves a `robots.txt` that refuses everything. Without that, Google indexes
both copies, the staging one can outrank the real one, and undoing it takes
weeks.

## 4. Read it against the live site

```
node tools/compare-live.mjs https://beta.chapalaseminary.org https://chapalaseminary.org
```

It compares the words, not the markup — the markup changed on purpose — and
reports any sentence on the old page that is not on the new one, plus any URL
that answers differently. `--all` does every page in the old sitemap, slowly.

Then read some yourself. The ones worth a human:

* the catalog, and whether the same courses are locked
* a lesson in English, then pressing **Español**
* an exam: pass one, fail one, and check the score and the lockout
* a certificate page
* `/CTSPrivacy.html` — register, press **Show what the seminary has**, confirm
  it is you, then delete it and confirm it is gone
* one page on a phone

Anything wrong here is cheap. Fix, `npm run deploy:beta`, look again.

---

# Stage two — the cutover

Only after stage one looks right.

## 5. The real database

```
npx wrangler d1 create chapala-students
```

`database_id` into **`wrangler.jsonc`** at the top level, replacing
`PUT-THE-PRODUCTION-DATABASE-ID-HERE`.

```
npx wrangler d1 migrations apply chapala-students --remote
```

## 6. Deploy production

```
npm run deploy
```

This publishes the Worker but **does not yet serve the seminary** — nothing
points at it. Check its `*.workers.dev` URL loads.

## 7. Take the address — try the reversible way first

The apex is currently a custom domain on the Pages project. There are two ways
to move it, and the first is worth trying because undoing it is instant.

**First try a route.** Workers & Pages → **chapala-seminary** → Settings →
Domains & Routes → Add → **Route** → `chapalaseminary.org/*`, zone
`chapalaseminary.org`.

Then load `https://chapalaseminary.org/assets/css/cts.css`. If it returns CSS,
the route took precedence over the Pages project and **the cutover is done** —
and deleting that route puts everything back in seconds. Cloudflare does not
document precedence between a route and a Pages custom domain either way, which
is exactly why this is worth five minutes to find out: if it does not work,
nothing has changed.

**If it did not work**, delete the route and do the documented swap:

1. Pages project → Custom domains → remove `chapalaseminary.org` (and `www`).
2. Worker `chapala-seminary` → Domains & Routes → Add → Custom domain →
   `chapalaseminary.org`, then `www.chapalaseminary.org`.

There is a gap of up to a minute or two between the two, while the record is
recreated and a certificate is issued. Do it in that order and have both tabs
open.

## 8. The rate limiting rule

**Security → WAF → Rate limiting rules → Create rule.**

| | |
|---|---|
| Expression | `http.request.uri.path starts with "/api/"` |
| Counting | by IP address |
| Requests | 30 |
| Period | 10 seconds |
| Action | Block |
| Duration | 10 seconds |

On the Free plan this is the only rate limiting rule available, it can match on
path only, count by IP only, and both periods are fixed at ten seconds. It
stops a flood and nothing slower, which is why the real guard is in
`worker/api.js`: failed lookups are counted per address and cut off at 20 in
ten minutes. That one is in the repository, is tested, and does not depend on
anybody remembering a dashboard setting.

---

## 9. Check, on the real address

```
node tools/verify-worker-routing.mjs https://chapalaseminary.org
node tools/compare-live.mjs          https://chapalaseminary.org https://beta.chapalaseminary.org
```

Then by hand:

1. `/` — the catalog, 44 courses.
2. `/assets/css/cts.css` — returns CSS. It does not exist on the old site, so
   this is the clearest single sign that the new build is being served.
3. `/CTSActsUnit3.html` — opens **without redirecting**, and **Español** works.
4. `/api/health` — `{"ok":true}`. A 503 means the `DB` binding is missing or
   misnamed.
5. `/robots.txt` — says `Allow: /`, **not** the staging refusal. If it refuses,
   the hostname is not in `CANONICAL` in `worker/index.js`.
6. `/sitemap.xml` — 585 URLs.
7. `/CTSPrivacy.html` — register, look at the record, delete it. **Do this once
   on the real site**: it is the first time the database holds anybody's name.

Then watch the Worker's logs for a few minutes (Workers & Pages →
chapala-seminary → Logs) for `student-records error`.

---

## Getting back

* **If you used the route:** delete it. The Pages project still has the domain
  and serves the ZIP again immediately.
* **If you did the swap:** remove the custom domain from the Worker and add it
  back to the Pages project. Same gap as before, in reverse.
* **A bad deploy, domain unchanged:** `npx wrangler rollback` returns the
  previous Worker version.

The database is additive and nothing in the old site reads it, so a rollback
costs nothing that was stored.

If the site is up but one page is wrong, fix forward. Going back to the ZIP
loses the unified engine, one design, and every Spanish fix along with it.

---

## What is deliberately not in this list

* **The auth Worker and GitHub OAuth app** for `/admin`. Only needed when
  someone other than Robert edits; local editing needs neither. `docs/cms.md`.
* **A translation provider.** `tools/translate-lesson.mjs` has the interface
  and a stand-in, no vendor.
* **Prerequisite gating from the collection.** Three hand-maintained lists in
  `public/cts-curriculum.js` still have to stay in step. It touches
  student-facing access control, so it wants its own change and its own
  before/after comparison — `tools/verify-gating.mjs` already provides one.
* **A seminary email address** for `CTSPrivacy.html`, which currently points at
  `robert@tirith.tech`.
