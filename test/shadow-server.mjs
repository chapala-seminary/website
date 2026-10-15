/* Serves a shadow-mode build (dist-shadow/) beside the real test Worker.
 *
 *   node test/shadow-server.mjs <port> <worker-port> [dir]
 *
 * Shadow mode is the engine as it was before AI grading: the page carries its
 * keys and the browser grades. The browser tests written for that engine
 * (a typed answer is marked right, a wait follows a failure...) therefore run
 * against this build, and they keep their intent. Everything under /api goes
 * to the Worker the suite is already running, so a test that registers a
 * student or syncs progress talks to the same real database.
 *
 * Static files only otherwise: html_handling "none", as the Worker does it
 * (/X.html is served as is, "/" is index.html, nothing is redirected).
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [, , portArg, workerArg, dirArg] = process.argv;
const PORT = +portArg, WORKER = +workerArg;
const DIR = path.resolve(dirArg || 'dist-shadow');
if (!PORT || !WORKER || !fs.existsSync(DIR)) { console.error('usage: shadow-server.mjs <port> <worker-port> [dir]  (dir must exist)'); process.exit(2); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/staff')) {
    const up = http.request({ host: '127.0.0.1', port: WORKER, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${WORKER}` } }, (r) => {
      res.writeHead(r.statusCode, r.headers); r.pipe(res);
    });
    up.on('error', () => { res.writeHead(502); res.end('worker unreachable'); });
    req.pipe(up);
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/index.html';
  const file = path.join(DIR, p);
  if (!file.startsWith(DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'x-robots-tag': 'noindex' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log(`shadow build on http://127.0.0.1:${PORT} (api -> ${WORKER})`));
