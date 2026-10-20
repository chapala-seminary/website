import { isLive } from './grading/mode.js';

export function blocksReviewAsset(request, env) {
  let path = new URL(request.url).pathname;
  try { path = decodeURIComponent(path); } catch { /* keep malformed escapes as written */ }
  path = path.replace(/\/{2,}/g, '/');
  if (!/\/exam-review\//i.test(path)) return false;
  // Shadow builds intentionally publish their review JavaScript beside their
  // browser-side answer keys. Live builds serve passages only through the
  // passed-attempt API. The Worker's JSON banks are private in either mode.
  return isLive(env, request) || !/^\/assets\/exam-review\/[a-z0-9._-]+\.js$/i.test(path);
}
