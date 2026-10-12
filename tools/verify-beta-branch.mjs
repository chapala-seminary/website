import { execFileSync } from 'node:child_process';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const branch = process.env.GITHUB_ACTIONS === 'true' ? process.env.GITHUB_REF_NAME : git('branch', '--show-current');
if (branch !== 'beta') throw new Error('Beta deploys must come from the beta branch.');
git('fetch', 'origin', 'beta');
if (git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/beta'))
  throw new Error('Beta deployment must match the published origin/beta commit.');
if (git('status', '--porcelain'))
  throw new Error('Commit beta changes and rerun the checks before deploying.');
console.log('Beta deploy matches origin/beta.');
