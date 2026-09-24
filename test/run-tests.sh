#!/usr/bin/env bash
# Student-records tests: a real Worker, a real D1, a real browser.
#
# Nothing here is mocked. The API tests drive the same Pages Function the site
# will deploy, and the browser tests drive cts-sync.js in Chromium against it,
# because the question being asked -- does a student's progress survive moving
# to another device -- cannot be answered by a stub.
#
#   npm run build && test/run-tests.sh
#
# The two fixture pages are copied into dist/ for the run rather than shipped
# in public/, so a test harness can never reach the live site.
set -euo pipefail
cd "$(dirname "$0")/.."

PORT=${PORT:-8798}
STATE=.wrangler-local
CONFIG=test/wrangler.local.jsonc

# A fresh database every run. The suite used to keep whatever the last run
# left behind, which is fine until something in the schema counts -- the
# moment failed lookups were being throttled, run two inherited run one's
# failures and the API tests failed in a way that had nothing to do with the
# change being tested.
rm -rf "$STATE"
mkdir -p "$STATE"
[ -d dist ] || { echo "run 'npm run build' first"; exit 2; }
# Copied in for the run and removed again on the way out: a fixture page left
# behind in dist/ would be uploaded with the next deploy. The reference index
# is the hand-written front page as it stood before the catalog was generated,
# taken straight from git so the check works in a fresh clone.
cp test/fixtures/synctest.html test/fixtures/syncdown.html dist/
# The gating check compares against the hand-written front page as it stood
# before the catalog was generated. It lives in git rather than in the tree, so
# a tarball export or a shallow clone without that commit has no reference --
# in which case that one check is skipped, loudly, instead of aborting the run.
# verify-gating.mjs loads it over HTTP, so it has to be in dist/;
# verify-catalog.mjs reads it from the working directory. Both, or neither.
# Written to a temporary file first. `git show ... > file` creates the file
# BEFORE git runs, so a checkout that cannot reach that commit used to leave a
# zero-byte reference behind -- and if a run was interrupted before its trap
# fired, the next one found that empty file, used it, and both gates reported
# themselves already broken. Size is checked, not just existence.
HAVE_REFERENCE=
if git show c257ea2:public/index.html > "$STATE/ref.html" 2>/dev/null \
   && [ -s "$STATE/ref.html" ]; then
  cp "$STATE/ref.html" dist/_reference-index.html
  cp "$STATE/ref.html" ./_reference-index.html
  HAVE_REFERENCE=1
fi
rm -f "$STATE/ref.html"
[ -n "$HAVE_REFERENCE" ] || rm -f dist/_reference-index.html ./_reference-index.html
trap 'rm -f dist/synctest.html dist/syncdown.html dist/_reference-index.html ./_reference-index.html' EXIT

# The local database is keyed by the database_id in $CONFIG, which is also the
# config `wrangler dev` runs from -- that is the only way the schema applied
# here and the schema the Worker sees are the same one.
# Every migration, in order -- not just the first one. Naming 0001 explicitly
# meant that the day a second migration was added, the suite ran against a
# schema the deployed database would not have, and the tests for whatever that
# migration added would fail in a way that looked like the feature was broken.
for m in migrations/*.sql; do
  npx wrangler d1 execute chapala-students --local --persist-to "$STATE" \
    --config "$CONFIG" --file "$m" >/dev/null
done

# Nothing else may be on this port. A dev server left behind by an earlier run
# answers /api/health perfectly well while pointing at a database directory
# this run has just deleted -- so the suite comes up green on the parts that do
# not touch it and fails the rest for reasons that have nothing to do with the
# code. Two full runs were spent on exactly that. Fail here instead, and say
# what to do about it.
if curl -sf -m 3 "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then
  echo "Something is already serving port $PORT -- almost certainly a dev server"
  echo "left behind by an earlier run. This suite would test that instead of its"
  echo "own build. Stop it first:"
  echo
  echo "  ps -eo pid,cmd | grep -E 'workerd|wrangler' | grep -v grep"
  echo
  exit 2
fi

# `wrangler dev`, not `pages dev`. The site is deployed as a Worker with
# static assets rather than as a Pages project, because Pages answers
# /CTSActsUnit3.html with a 308 to /CTSActsUnit3 and cannot be told not to --
# and all 801 pages here end in .html. tools/verify-worker-routing.mjs is the
# check that keeps it that way; worker/index.js says why at length.
npx wrangler dev --config "$CONFIG" --port "$PORT" --persist-to "$STATE" \
  > "$STATE/dev.log" 2>&1 &
DEV=$!
trap 'kill $DEV 2>/dev/null || true; rm -f dist/synctest.html dist/syncdown.html dist/_reference-index.html ./_reference-index.html' EXIT

for i in $(seq 1 60); do
  sleep 1
  curl -sf "http://127.0.0.1:$PORT/api/health" >/dev/null && break
  [ "$i" = 60 ] && { echo "the dev server never came up:"; tail -20 "$STATE/dev.log"; exit 1; }
done

# How every URL is answered. This is what the decision not to use Cloudflare
# Pages rests on: .html served rather than redirected, and "/" resolved to
# index.html by the Worker, since html_handling "none" stops doing it.
node tools/verify-worker-routing.mjs "http://127.0.0.1:$PORT"

# And that the config the suite just tested still matches the one that gets
# deployed, on every field that changes how a request is answered.
node tools/verify-worker-config.mjs
node tools/gen-worker-catalog.mjs --check

# A staging host must not be indexable, and must not change the real site.
node tools/verify-staging.mjs "http://127.0.0.1:$PORT"

node tools/verify-sitemap.mjs dist

# The question bank: 451 units, 34,778 comparisons of stems, options and answer
# keys, in a form that does not care what file format the content lives in.
# The migration plan calls this "the gate for every step" -- and until now the
# suite did not run it, so "every step" meant "every step someone remembered".
node tools/content-baseline.mjs --check

# Source check, no browser needed: every control resolver in cts-engine.js
# takes exactly one id. Alias lists grow back one convenient addition at a
# time, and each addition looks reasonable on its own.
node tools/verify-one-name.mjs

# The other half of the same idea, for the stylesheet: one class per concept,
# checked in the built markup and in cts.css. An alias in either is a rule
# waiting to disagree with the pages it styles.
node tools/verify-one-class.mjs dist

# The lesson prose. content-baseline.mjs checks the questions -- 34,778
# comparisons -- and says nothing about the teaching itself, which is most of
# what the seminary actually wrote. This compares every recorded text block
# against the built page, so a change to the layout or the shell transform
# cannot drop a paragraph without naming it.
node tools/prose-baseline.mjs check dist

# The converted courses. Their lessons are data now, so two things need saying
# that the prose baseline cannot say on its own: that the data still renders
# the page it replaced, element for element, and that automatic translation
# will not overwrite work a person did.
node tools/verify-lesson-render.mjs
node test/lesson-translation.mjs

# The editing interface. Sveltia writes back only the fields its config
# declares, so a field in the content and not in the config is deleted the next
# time a teacher saves that entry. This is the check that a generated config and
# the content it edits have not drifted apart.
node tools/verify-cms-config.mjs

# Can a teacher reach every word? Text left in a page template renders
# perfectly and cannot be edited, so nothing else would notice it.
node tools/verify-editable.mjs

# The partials -- markup that is the same on every page and now lives in one
# place. A template naming a partial that does not exist stops the build; this
# also catches the other two ways it rots quietly: a partial nothing names, and
# a course using the honours box with no reading room recorded for it.
node tools/verify-partials.mjs

API_BASE="http://127.0.0.1:$PORT" node test/api.test.mjs

# Some environments (the sandboxed Linux VM the desktop app runs commands in,
# for one) have node and wrangler but not the shared libraries Chromium needs.
# A skip is reported loudly and names what went unverified: a quiet skip is how
# a suite ends up proving nothing.
if node -e "const p=require('playwright');const o=process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{};p.chromium.launch(o).then(b=>b.close()).catch(()=>process.exit(1))" 2>/dev/null; then
  SYNC_BASE="http://127.0.0.1:$PORT" node test/sync.test.mjs
  if [ -n "$HAVE_REFERENCE" ]; then
    node tools/verify-gating.mjs "http://127.0.0.1:$PORT" _reference-index.html
  else
    echo "  SKIPPED: tools/verify-gating.mjs — commit c257ea2 is not in this"
    echo "           checkout, so there is no reference front page to compare"
    echo "           the course locking against."
  fi
  node tools/verify-mobile.mjs "http://127.0.0.1:$PORT" dist 390
  node tools/verify-language.mjs "http://127.0.0.1:$PORT" dist
  node tools/audit-controls-built.mjs "http://127.0.0.1:$PORT"
  node tools/verify-devmode.mjs "http://127.0.0.1:$PORT"
  node tools/verify-certificates.mjs "http://127.0.0.1:$PORT"
  node tools/verify-cms-loads.mjs "http://127.0.0.1:$PORT"
  # 948 assertions that the built site implements the agreed assessment policy
  # -- pass mark, lockouts, track rules. Also never run by this suite before.
  node tools/engine-test-built.mjs "http://127.0.0.1:$PORT"
  if [ -n "$HAVE_REFERENCE" ]; then
    node tools/verify-catalog.mjs ./_reference-index.html
  else
    echo "  SKIPPED: tools/verify-catalog.mjs — no reference front page in this"
    echo "           checkout to compare the generated catalog against."
  fi
  SYNC_BASE="http://127.0.0.1:$PORT" node test/code-ui.test.mjs

  # The page that shows a student what is held about them and deletes it.
  # Driven in a browser against the real Worker, because a privacy page whose
  # delete button does not work is worse than no page at all.
  node tools/verify-privacy.mjs "http://127.0.0.1:$PORT"
else
  echo
  echo "  #######################################################################"
  echo "  # SKIPPED: the browser checks - Chromium will not start here.         #"
  echo "  #                                                                     #"
  echo "  # NOT VERIFIED by this run: that the Spanish control works on every   #"
  echo "  # page, that a student can see their code and restore from it, that   #"
  echo "  # no page scrolls sideways on a phone, that the catalog still locks   #"
  echo "  # the courses it used to, that course-tester mode still opens every   #"
  echo "  # course and still leaves a registered student's progress alone,      #"
  echo "  # that the certificate pages will sync a completion when the database  #"
  echo "  # is live,                                                             #"
  echo "  # that every page has a working submit control, that cts-sync.js      #"
  echo "  # carries a student's progress to another browser, that restoring     #"
  echo "  # never removes what a device already had, and that the script stays  #"
  echo "  # dormant with no API deployed, and that the editing interface at     #"
  echo "  # /admin still loads and reads its config. Run this suite where        #"
  echo "  # Chromium works                                                       #"
  echo "  # before trusting any of those.                                       #"
  echo "  #                                                                     #"
  echo "  # Usually: npx playwright install --with-deps chromium                #"
  echo "  #######################################################################"
  echo
fi

# LAST, and it has to be. The throttle counts failed lookups per address, and
# every test here reaches the Worker from 127.0.0.1 -- one address, one budget.
# Run these earlier and everything after them starts getting 429s and failing
# for reasons that have nothing to do with what it is testing. test/throttle.test.mjs
# says the same thing at greater length.
API_BASE="http://127.0.0.1:$PORT" node test/throttle.test.mjs
