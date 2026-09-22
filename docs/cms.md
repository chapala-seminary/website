# The editing interface

Sveltia CMS at `/admin`. It edits the content in this repository and commits to
it; there is no database and no vendor.

---

## Try it today, with no setup at all

You do not need GitHub, an OAuth app, or a deployment to see whether the
editing surface is any good.

```
npm run build
npx http-server dist -p 8123     # or any static server
```

Open <http://127.0.0.1:8123/admin/> in **Chrome or Edge**, press **Work with
Local Repository**, and pick this repository's folder — the one holding
`package.json` and `src/`. Sveltia reads and writes the files directly. Edits
land in your working tree as ordinary file changes: `git diff` shows them,
`git checkout .` throws them away.

You are looking at the last build, so rebuild to see an edit on the site.

`npm run dev` works too, but the address is
<http://localhost:4321/admin/index.html> — the dev server does not serve
`/admin/` as a directory, because `build.format: 'file'` turns off directory
indexes.

**It must be `localhost` or `127.0.0.1`.** A LAN address (`192.168.…`) or a
`.local` name is not a secure context, and the browser API this depends on does
not exist there at all.

**Chrome or Edge only.** Safari and Firefox have no File System Access API.
Brave ships it but disables it by default, so it looks supported and then
fails.

### When "Work with Local Repository" does not work

Open **`/admin/check.html`**. It calls the same browser API Sveltia calls and
prints what actually came back, which the CMS itself does not.

The reason it exists: Sveltia shows one sentence for several unrelated causes
and puts the real error only in the console. Reading its bundle, the two
messages mean precise and different things:

| What it says | What actually happened |
|---|---|
| *"A repository root directory could not be **selected**"* | `showDirectoryPicker()` threw `AbortError`. **No folder was ever returned** — the dialog was cancelled or dismissed, or Chrome refused the location. The folder you picked is not the problem. |
| *"The selected folder **is not** a repository root directory"* | A folder came back, but it has no `.git` in it. Wrong folder — pick the one with `package.json` in it. |

So for the first message, in order of likelihood:

1. **The dialog was dismissed.** Escape, Cancel, or clicking away. On macOS it
   can also open *behind* the browser window — check there before pressing the
   button again.
2. **Chrome refused the folder.** It blocks its own profile directory and a
   short list of system locations: your home folder itself, `/Applications`,
   `/Library`, `/System`, `/Volumes`. Pick the repository folder, not a parent
   of it.
3. **A remembered folder went stale.** Sveltia keeps the handle in IndexedDB;
   if the folder moved or permission was revoked it silently sends you back to
   the picker. `/admin/check.html` has a **Forget the remembered folder**
   button for this.

---

## What is editable

| Collection | Files | Who it is for |
|---|---|---|
| **Hermeneutics** (one per converted course) | `src/content/lessons/<Course>/<n>.json` | the lesson itself — headings, paragraphs, Scripture quotations, in every language |
| **Exam questions** | `src/content/units/<Course>/<n>.json` | multiple-choice and short-answer questions |
| **Course catalog** | `src/content/courses/*.json` | the 44 cards on the front page |

Only converted courses appear as lesson collections. The other 39 are still
HTML files and are not editable here — see `claude/lesson-content-model.md`.

Creating and deleting lessons is **off**. A unit comes into existence when a
course is converted, and a teacher who can delete one from a web form will
eventually delete one.

### Translations

Each block shows its text in every language the course has, one field per
language, side by side in the same form.

**Editing the English marks every translation of that block out of date, by
itself.** Nothing needs to be ticked. Each translation stores a hash of the
source it was made from; change the source and the hashes no longer agree.
`node tools/lesson-status.mjs <Course>` lists what that leaves stale, and
`node tools/translate-lesson.mjs` refreshes only those blocks.

There is one thing worth doing by hand. When you *fix* an automatic
translation, set **Written by → "Automatic, then corrected"** on that block.
That is what stops the next automatic pass from treating your correction as
disposable.

---

## The configuration is generated

`public/admin/config.yml` is built by `tools/build-cms-config.mjs`. **Do not
edit it by hand.**

The reason is worth knowing, because it is a quiet way to lose content:
**Sveltia writes back only the fields its config declares.** A field the config
does not mention is dropped from the file the moment someone presses save on
that entry. Nothing warns anyone, and the site still builds, because the build
reads what is left.

So the config is generated from the content, and `tools/verify-cms-config.mjs`
runs in the test suite and fails if any field exists in the data and not in the
config. It compares per block type, not by field name: removing the text field
from *paragraphs* alone still fails, even though six other block types declare
a field with that name.

After converting a course, or adding a language:

```
node tools/build-cms-config.mjs
node tools/verify-cms-config.mjs
```

---

## Deploying it for other people

Two things are needed, neither done yet.

### 1. A GitHub OAuth app

<https://github.com/settings/developers> → **New OAuth App**

* Homepage URL: `https://chapalaseminary.org`
* Authorization callback URL: `https://auth.chapalaseminary.org/callback`

Keep the **Client ID** and **Client Secret**.

### 2. The auth Worker

`sveltia-cms-auth` is a small open-source Cloudflare Worker. It exists so that
no third party ever holds a token for this repository.

```
git clone https://github.com/sveltia/sveltia-cms-auth
cd sveltia-cms-auth
npx wrangler deploy
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put ALLOWED_DOMAINS      # chapalaseminary.org
```

Then point it at `auth.chapalaseminary.org` in the Cloudflare dashboard. That
hostname is already what `config.yml` expects; change `REPO`/`base_url` in
`tools/build-cms-config.mjs` and regenerate if it ends up somewhere else.

It runs only at sign-in, so it stays comfortably inside the Workers free tier.

### Who can edit

Anyone with write access to the repository, and nobody else. Adding a teacher
is adding a GitHub collaborator.

### Drafts go through review

`publish_mode: editorial_workflow` is on, so a teacher's save becomes a pull
request rather than a commit to `main`. Someone approves it before it reaches a
student. For a seminary with faculty authors this is the right default; turning
it off is a one-line change in the generator.

---

## What `/admin` loads from the internet

The page pins Sveltia to an exact version (`@sveltia/cms@0.217.0`) because it is
pre-1.0 and ships breaking changes, and a CMS that rewrites itself under a
teacher mid-edit is a support call nobody can answer. Raising the pin is a
commit, so it is a decision someone made and the suite ran against.

At load it fetches the bundle and its fonts from unpkg and jsDelivr, and asks
`githubstatus.com` whether GitHub is up. Nothing on the student-facing site
depends on any of them — `/admin` is the only page that talks to them at all,
and it is `noindex` and disallowed in `robots.txt`.

---

## Checks

| Check | What it holds |
|---|---|
| `tools/verify-cms-config.mjs` | every field in the content is declared, so nothing is dropped on save; the YAML parses; every converted course has a collection |
| `tools/verify-cms-loads.mjs` | `/admin` returns 200, the pinned bundle loads, the config is fetched and accepted, local-repository editing is offered, no console errors, and `/admin/check.html` still reports what it is for |

Both run in `npm test`. Four mutations cover them: an undeclared field, a
converted course with no collection, malformed YAML, and an admin page that
stops being published.
