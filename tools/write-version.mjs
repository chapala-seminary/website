/* One release label, written by the build (Dr. Cook's audit, 30 Sept 2026:
 * pages showed "2026-09-15-testerbar1" and "2026-06-28-a7f3" -- both typed by
 * hand, neither the release actually deployed). dist/version.txt is the build
 * date and the commit, e.g. "2026-10-01 4f3a9c2"; the stamp on beta pages
 * shows exactly that, read from /version.txt. A tree with uncommitted changes
 * is marked "+local", so a deploy from one is visible as such.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export function releaseLabel() {
  const day = new Date().toISOString().slice(0, 10);
  try {
    const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
    const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim();
    return `${day} ${sha}${dirty ? '+local' : ''}`;
  } catch { return `${day} (no git)`; }
}

export default function versionIntegration() {
  return {
    name: 'cts-version',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = path.join(dir instanceof URL ? dir.pathname : String(dir), 'version.txt');
        const label = releaseLabel();
        fs.writeFileSync(out, label + '\n');
        logger.info(`release ${label}`);
      },
    },
  };
}
