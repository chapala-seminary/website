// Writes a local Worker config for test/masters-assessments.api.mjs: the
// suite's test/wrangler.local.jsonc with Old Testament Survey's paper dated
// in TEST_REQUIRED_FROM (2001, so every completion the Worker records is
// "after"). Its final is dated too, only to show a final is never required
// even with a date (Dr. Cook, 12 Nov 2026). The suite's own config is left as it is.
//
//   node tools/masters-assessments-config.mjs [out]   (default test/.wrangler.mastersfinal.jsonc)
import fs from 'node:fs';
import path from 'node:path';

// Only a .jsonc file inside test/: the config is scratch for the test run.
const TEST_DIR = path.resolve('test');
const out = path.resolve(process.argv[2] || 'test/.wrangler.mastersfinal.jsonc');
if (!out.startsWith(TEST_DIR + path.sep) || !out.endsWith('.jsonc')) { console.error(`write the config inside test/ as a .jsonc file, not ${out}`); process.exit(2); }
const src = fs.readFileSync('test/wrangler.local.jsonc', 'utf8');
const m = /"TEST_REQUIRED_FROM":\s*"((?:[^"\\]|\\.)*)"/.exec(src);
if (!m) { console.error('test/wrangler.local.jsonc has no TEST_REQUIRED_FROM'); process.exit(1); }
const map = JSON.parse(JSON.parse(`"${m[1]}"`));
Object.assign(map, { otsfinal: '2001-01-01T00:00:00Z', otspaper: '2001-01-01T00:00:00Z' });
fs.writeFileSync(out, src.replace(m[0], `"TEST_REQUIRED_FROM": ${JSON.stringify(JSON.stringify(map))}`));
console.log(`wrote ${out}`);
