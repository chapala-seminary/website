# Code health with SonarQube

SonarQube reads the site's code and reports likely bugs, security risks and
hard-to-maintain code. It is advisory: nothing it finds blocks a build, a beta
deploy or a release.

There are two free ways to run it, and both read the same settings file,
`sonar-project.properties`.

| | SonarQube Cloud (Free plan) | SonarQube Community Build |
|---|---|---|
| Where it runs | GitHub Actions, results on sonarcloud.io | Your own machine, in Docker |
| When | Every PR into `beta` or `main`, and every push to `main` | When you run it |
| Cost | Free for public repositories (this one is public) | Free, open source |
| Comments on PRs | Yes | No (Community Build can't decorate PRs) |

**What the Free plan shows.** It shows two things: each PR's result (pass/fail
plus the new issues it adds, also posted as a PR comment) and the dashboard for
the **main branch**, `main`. Every other branch, `beta` included, is analysed
as a side branch whose results are locked on Free ("Organization is not
allowed to access data from non main branches"). So the workflow doesn't scan
pushes to `beta`. The full findings dashboard shows production code and
updates each time `beta` is promoted to `main`. Day to day, the PR results
are what matter: they flag new problems in each change before it reaches
`beta`.

## What is scanned

Only code: `src/` (Astro pages, `src/lib`), `worker/`, `tools/`,
`public/assets/` (browser scripts and CSS) and `astro.config.mjs`, with `test/`
reported separately as test code.

Left out on purpose:

- course content and data: lesson HTML, question JSON, Markdown, readings,
  review drafts, and the generated fill-in question data in
  `public/assets/js/fill/`;
- third-party or generated files: jsPDF and `public/cts-emblem.js`;
- **private answer keys**: `.assessment-keys/` and the private unit folders
  are git-ignored, so they are never in a GitHub checkout. The workflow also
  never checks out `chapala-seminary/assessment-keys`.

Two known false positives are switched off in the settings file. One is "test
file has no tests": our suite is plain Node scripts, which Sonar doesn't
recognize as tests. The other is "command found through PATH" in `tools/` and
`test/`, where developer scripts call `git`, `npx` and `wrangler`.

**Coverage is not measured.** The quality gate's "Coverage on New Code"
condition needs a coverage report, and our tests don't write one: they are
plain Node scripts and browser tests against the built Worker. Without a
report, SonarQube counted every new line as untested and failed any PR that
added more than a few lines of code (for example #210, #211 and #315 on
12 Nov 2026, each with no other finding). The settings file therefore leaves
all files out of coverage (`sonar.coverage.exclusions=**/*`), so the gate
judges bugs, security, maintainability, duplication and hotspots only. If a
coverage report is added later, remove that line and point
`sonar.javascript.lcov.reportPaths` at the report.

## One-time setup: SonarQube Cloud

Someone with admin rights on the `chapala-seminary` GitHub organization does
this once. Until then the `Code health (SonarQube Cloud)` workflow runs, prints
"SONAR_TOKEN is not set" and passes.

1. Go to <https://sonarcloud.io>, sign in with GitHub and choose
   **Import an organization**. Pick `chapala-seminary` and let it install the
   SonarQube Cloud GitHub App. Give it access to `website` (and `brain`, if
   you want that too; see below).
2. Pick the **Free** plan. Keep the organization key `chapala-seminary`, the
   value `sonar.organization` in `sonar-project.properties` expects.
3. **Analyze new project** and choose `website`. The project key must be
   `chapala-seminary_website` (the default). If SonarQube Cloud offers a
   different key, change `sonar.projectKey` to match.
4. For the analysis method choose **With GitHub Actions**, not Automatic
   Analysis. The two can't both be on, and the workflow is already written.
5. SonarQube Cloud shows a token. In GitHub, add it under
   **website → Settings → Secrets and variables → Actions** as a repository
   secret named `SONAR_TOKEN`.
6. Set **New code** to "Previous version" or "Number of days: 30". The quality
   gate then judges new changes, not the backlog from the old site.
7. The first PR into `beta` or `main` gets the first analysis. The main-branch
   dashboard fills in after the next push to `main`, that is, the next
   `beta` → `main` promotion.

Workflow file: `.github/workflows/sonar.yml`. Fork PRs don't get secrets, so the
scan skips on them.

## Running it locally (Community Build)

Needs Docker and Node. From the website checkout:

```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
```

Wait until <http://localhost:9000> shows the login page (about a minute). Log in
as `admin` / `admin`, set a new password, then go to
**My Account → Security** and generate a **Global Analysis** token.

```bash
SONAR_TOKEN=<token> npx @sonar/scan -Dsonar.host.url=http://localhost:9000
```

Results appear at <http://localhost:9000/dashboard?id=chapala-seminary_website>.
Stop the server with `docker rm -f sonarqube`. Its results go with it unless you
add a volume.

On a shallow clone you'll see "no blame information". Run
`git fetch --unshallow` first if you want SonarQube to tell new code from old.

## First scan (10 November 2026, commit `ceca4e0b`)

Community Build 26.11, the scope above: 344 files, about 29,900 lines of code.

| | Count | Notes |
|---|---|---|
| Bugs | 52 | 31 `sort()` without a compare function (most sort plain strings, which is fine); 10 "`===` is always false" in `cts-textbook.js`/`exam-review.mjs` are **false positives**: Sonar can't see that `CTSRecord.course()` returns `"new"` |
| Vulnerabilities | 45 | 39 are `vm`/`eval` in build and verification tools that run our own files, which is low risk. 2 regexes in `src/lib/french-pages.ts` that could run slowly (build-time only) |
| Code smells | 130 | Maintainability rating A; 6.4% duplicated lines. The one "blocker", undeclared `mcAnswers` in `tools/verify-fill-single.mjs:111`, is a **false positive**: that line runs inside the page (`p.evaluate`), where `mcAnswers` is the page's own variable |
| Security hotspots | 0 | |

Small real findings worth a later fix:

- `tools/verify-seo.mjs:42` checks the same Spanish URL twice, so one of the
  intended checks is missing.
- `public/assets/js/cts-email-confirm.js:43,53,63` start promises whose errors
  nothing catches.
- `worker/awards.js:188` has a regex whose `|` precedence is easy to misread.
