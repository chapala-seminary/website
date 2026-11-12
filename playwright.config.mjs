/* The journey suite (e2e/): whole student and staff journeys, across devices,
 * on the built site, the real Worker and a fresh local D1 -- no stubs.
 *
 *   npm run build && npm run test:e2e
 *   npm run test:e2e -- e2e/two-devices.spec.mjs     one file
 *   npx playwright show-report e2e-report             the last run, with traces
 *
 * test/run-tests.sh checks each feature on its own; these chain them the way
 * a student meets them, where the bugs that reached students were found
 * (docs/e2e-journeys.md).
 */
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT || 8808);
const CI = !!process.env.CI;

// Specs that set up a record by writing to the local D1 from outside the
// Worker (e2e/lib/site.mjs db(), priorUnits, priorCourses). That write runs in
// a second process on the same SQLite file; a Worker request that lands while
// it holds the lock fails with HTTP 500 (SQLITE_BUSY), which another spec then
// reports as the site failing (beta run 43257510965: the Spanish degree page's
// /api/sync, while two-devices seeded a finished course). The production D1
// has no second writer, so these run on their own, after everything else.
// A new spec that calls db() belongs in this list.
const SEEDS_D1 = /two-devices\.spec\.mjs$/;

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'e2e-results',
  // A journey takes a student through several exams, each graded by the Worker.
  timeout: 4 * 60_000,
  expect: { timeout: 20_000 },
  // Files run side by side; the steps of one journey run in order.
  fullyParallel: false,
  workers: CI ? 3 : undefined,
  // No retries: a journey that passes only the second time is a bug to find,
  // not a result (brain RISKS: tests that pass on nothing).
  retries: 0,
  forbidOnly: CI,
  // Traces and screenshots hold what the journeys type -- the answer keys from
  // the private assessment-keys repo -- and the explanations a passed exam
  // shows. This repository is public, and so are its Actions artifacts, so CI
  // records neither and uploads no report. Reproduce a CI failure locally,
  // where both are kept (e2e-results/, e2e-report/; gitignored).
  reporter: CI ? [['list'], ['github']] : [['list'], ['html', { outputFolder: 'e2e-report', open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: CI ? 'off' : 'retain-on-failure',
    screenshot: CI ? 'off' : 'only-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    ...(process.env.CHROME_PATH ? { launchOptions: { executablePath: process.env.CHROME_PATH } } : {}),
  },
  projects: [
    { name: 'journeys', testIgnore: SEEDS_D1 },
    // Runs once 'journeys' has finished (and is skipped if it failed), so no
    // other spec is talking to the Worker while it writes to D1.
    { name: 'seeded', testMatch: SEEDS_D1, dependencies: ['journeys'] },
  ],
  webServer: {
    command: 'node e2e/serve.mjs',
    url: `http://127.0.0.1:${PORT}/api/health`,
    timeout: 5 * 60_000,
    // A server already on this port would be tested instead of this build
    // (test/run-tests.sh explains the two runs lost to exactly that).
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { E2E_PORT: String(PORT) },
  },
});
