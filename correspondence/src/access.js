/* Who may open the console: Cloudflare Access, checked here too.
 *
 * The same check as the student site's staff pages (worker/staff.js
 * accessUser), copied rather than imported so this Worker carries none of the
 * site's code. The console's Access application must be its OWN application
 * (CONSOLE_ACCESS_AUD), with a policy naming only the people who may read
 * seminary correspondence. Not configured: no page.
 *
 * Roles (CONSOLE_ROLES, a var): "email:role,email:role". 'owner' may change
 * switches and decide owner cases; 'reviewer' may change cases; 'viewer'
 * reads. Anyone Access lets in who is not listed is a viewer.
 */
const b64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const text = (b) => new TextDecoder().decode(b);
let cache = { at: 0, team: '', keys: [] };

async function keys(env) {
  if (env.ACCESS_JWKS) return JSON.parse(env.ACCESS_JWKS).keys || [];
  if (cache.team === env.ACCESS_TEAM && Date.now() - cache.at < 3600000) return cache.keys;
  const r = await fetch(`https://${env.ACCESS_TEAM}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('could not fetch the Access signing keys: ' + r.status);
  cache = { at: Date.now(), team: env.ACCESS_TEAM, keys: (await r.json()).keys || [] };
  return cache.keys;
}

export async function consoleUser(request, env) {
  const aud = env.CONSOLE_ACCESS_AUD;
  if (!env.ACCESS_TEAM || !aud) return null;
  const parts = (request.headers.get('cf-access-jwt-assertion') || '').split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(text(b64url(parts[0])));
    const claims = JSON.parse(text(b64url(parts[1])));
    if (header.alg !== 'RS256') return null;
    const jwk = (await keys(env)).find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]))) return null;
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const now = Date.now() / 1000;
    if (!auds.includes(aud) || claims.iss !== `https://${env.ACCESS_TEAM}.cloudflareaccess.com`) return null;
    if (!(claims.exp > now) || (claims.nbf && claims.nbf > now + 60)) return null;
    const email = String(claims.email || '').toLowerCase();
    if (!email) return null;
    return { email, role: roleOf(env, email) };
  } catch (e) {
    console.error('access token check failed', e && e.message);
    return null;
  }
}

export function roleOf(env, email) {
  for (const pair of String(env.CONSOLE_ROLES || '').split(',')) {
    const [e, r] = pair.split(':').map((s) => s && s.trim().toLowerCase());
    if (e === email && ['owner', 'reviewer', 'viewer'].includes(r)) return r;
  }
  return 'viewer';
}
