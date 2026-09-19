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
CONFIG=test/wrangler.local.toml

mkdir -p "$STATE"
[ -d dist ] || { echo "run 'npm run build' first"; exit 2; }
# Copied in for the run and removed again on the way out: a fixture page left
# behind in dist/ would be uploaded with the next deploy.
cp test/fixtures/synctest.html test/fixtures/syncdown.html dist/
trap 'rm -f dist/synctest.html dist/syncdown.html' EXIT

# The local database is keyed by the database_id in $CONFIG, which is also what
# `pages dev --d1 DB=local-dev` binds -- that is the only way the schema applied
# here and the schema the Worker sees are the same one.
npx wrangler d1 execute chapala-students --local --persist-to "$STATE" \
  --config "$CONFIG" --file migrations/0001_init.sql >/dev/null

npx wrangler pages dev dist --port "$PORT" --persist-to "$STATE" \
  --d1 DB=local-dev --compatibility-date 2026-09-01 > "$STATE/dev.log" 2>&1 &
DEV=$!
trap 'kill $DEV 2>/dev/null || true; rm -f dist/synctest.html dist/syncdown.html' EXIT

for i in $(seq 1 60); do
  sleep 1
  curl -sf "http://127.0.0.1:$PORT/api/health" >/dev/null && break
  [ "$i" = 60 ] && { echo "the dev server never came up:"; tail -20 "$STATE/dev.log"; exit 1; }
done

API_BASE="http://127.0.0.1:$PORT" node test/api.test.mjs

# Some environments (the sandboxed Linux VM the desktop app runs commands in,
# for one) have node and wrangler but not the shared libraries Chromium needs.
# A skip is reported loudly and names what went unverified: a quiet skip is how
# a suite ends up proving nothing.
if node -e "require('playwright').chromium.launch().then(b=>b.close()).catch(()=>process.exit(1))" 2>/dev/null; then
  SYNC_BASE="http://127.0.0.1:$PORT" node test/sync.test.mjs
else
  echo
  echo "  ####################################################################"
  echo "  #  SKIPPED: test/sync.test.mjs - Chromium will not start here.     #"
  echo "  #                                                                  #"
  echo "  #  NOT VERIFIED by this run: that cts-sync.js carries a student's  #"
  echo "  #  progress to another browser, that restoring never removes what  #"
  echo "  #  a device already had, and that the script stays dormant with    #"
  echo "  #  no API deployed. Run this suite where Chromium works before     #"
  echo "  #  trusting any of those.                                          #"
  echo "  #                                                                  #"
  echo "  #  Usually: npx playwright install --with-deps chromium            #"
  echo "  ####################################################################"
  echo
fi
