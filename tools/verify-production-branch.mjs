import { execFileSync } from 'node:child_process';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const branch = process.env.GITHUB_ACTIONS === 'true' ? process.env.GITHUB_REF_NAME : git('branch', '--show-current');
if (branch !== 'main') throw new Error('Production deployments must come from main.');
git('fetch', 'origin', 'main');
if (git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main'))
  throw new Error('Production deployment must match the current origin/main commit.');
if (git('status', '--porcelain'))
  throw new Error('Production deployment requires a clean, committed checkout.');
console.log('Production deploy matches the current origin/main commit.');
