/* A script or stylesheet addressed by a fingerprint of its contents:
   /assets/js/cts-engine.js?v=3f9c1a2b7e. A browser may keep a script it has
   seen before and run it again on the next visit; when the address changes
   with the contents, a new release can never be judged against last week's
   engine (Wayne tested the fill-ins on beta and saw the code from before the
   fix, 26 Sept 2026). Used by every layout. */
import fs from 'node:fs';
import crypto from 'node:crypto';

export const version = (src: string): string => {
  const file = src.replace(/^\//, '').split('?')[0];
  try {
    return `/${file}?v=${crypto.createHash('sha1').update(fs.readFileSync(`public/${file}`)).digest('hex').slice(0, 10)}`;
  } catch {
    return `/${src.replace(/^\//, '')}`;
  }
};
