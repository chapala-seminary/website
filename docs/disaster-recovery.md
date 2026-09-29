# Student records: backups and restoring them

Dr. Cook's review (29 Sept 2026), item 10: what stores the records, whether
they are backed up, how often, and how to get them back.

## What stores the records

* **Cloudflare D1**, a database Cloudflare runs for us. Two of them, in the
  seminary's Cloudflare account (`119b0919…`, pinned in `wrangler.jsonc`):
  * `chapala-students` — the real site, chapalaseminary.org;
  * `chapala-students-beta` — the beta site, beta.chapalaseminary.org.
* What is in it: each student's name, email, country, track, student code,
  units passed, courses completed (and at which level), certificates issued,
  and the notices sent to the seminary. The tables are made by `migrations/`.
* **Each student's own browser** keeps a full copy of that student's
  progress (`localStorage`). This is the second copy: when the browser next
  opens the site it sends everything it has, and the database only ever adds
  what it is missing. So a student who returns after a restore brings back
  anything the restore lost.

## Backups

**Automatic, continuous.** D1 keeps every change for a window of days
("Time Travel"): 30 days on Cloudflare's paid Workers plan, 7 days on the free
plan. Nothing has to be switched on and there is nothing to schedule. The
database can be put back as it was at any minute inside that window.

**Not automatic: a copy kept outside Cloudflare.** Time Travel does not help
if the database itself is deleted, or if a mistake is noticed after the
window has passed. For that, take an export (below) — we recommend weekly,
and always before applying a migration. An export contains student names and
emails: keep it on the seminary's private storage, **never in git, never in
the brain, never emailed.**

## Commands

All of these use the pinned account in `wrangler.jsonc`. Run them from this
repository on the Mac. Add `--env beta` and use `chapala-students-beta` for the
beta site.

Take an export (a copy of everything, as a file):

```sh
npx wrangler d1 export chapala-students --remote --config wrangler.jsonc \
  --output ~/CTS-backups/chapala-students-$(date +%F).sql
```

See what point in time a restore would go back to:

```sh
npx wrangler d1 time-travel info chapala-students --config wrangler.jsonc \
  --timestamp "2026-09-29T15:00:00Z"
```

Put the database back as it was at that time (this replaces the current
contents — take an export first, so the restore can itself be undone):

```sh
npx wrangler d1 time-travel restore chapala-students --config wrangler.jsonc \
  --timestamp "2026-09-29T15:00:00Z"
```

The command prints a bookmark for the state it replaced; keep it, and
`--bookmark <it>` undoes the restore.

Rebuild from an export, into a new empty database (if the database was
deleted): create one with `npx wrangler d1 create chapala-students --config
wrangler.jsonc`, put its new id in `wrangler.jsonc` as that file explains, then

```sh
npx wrangler d1 execute chapala-students --remote --config wrangler.jsonc \
  --file ~/CTS-backups/chapala-students-YYYY-MM-DD.sql
npm run deploy
```

## After a restore

* Students who studied after the restore point: their browsers send that work
  again the next time they open the site. Nothing for them to do.
* The seminary may be sent a completion notice a second time for a course
  finished after the restore point, because the record of the first notice
  was rolled back too.
* Check the roster (`/staff/students`) shows what you expect.
