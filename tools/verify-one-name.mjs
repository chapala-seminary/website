/* Does every control still have exactly one name?
 *
 * cts-engine.js used to resolve each control through firstEl(), which took a
 * list of ids and returned whichever the page happened to have: five spellings
 * of the submit button, eleven of the result area, twenty-three of the
 * question container. That let 451 independently-built pages keep their own
 * markup while they were being consolidated, and it meant a new page could
 * pick any accepted name -- or a sixth nobody had taught the engine -- and
 * half-work until a student found it.
 *
 * src/lib/shell.ts renames the controls at build time and each resolver now
 * takes one id. This is a source check that it stays that way: alias lists
 * grow back one convenient addition at a time, and each addition looks
 * reasonable on its own.
 *
 *   node tools/verify-one-name.mjs
 */
import fs from 'node:fs';

const ENGINE = 'public/assets/js/cts-engine.js';
const src = fs.readFileSync(ENGINE, 'utf8');
const fails = [];

/* Each resolver, and the one id it is allowed to ask for. */
const RESOLVERS = {
  submitEl: 'submitExamBtn',
  resetEl: 'resetExamBtn',
  resultEl: 'examResult',
  mcHost: 'questionsContainer',
  saHost: 'kwContainer',
  greetEl: 'greeting',
};

for (const [fn, id] of Object.entries(RESOLVERS)) {
  // The resolvers are one-liners with no inner braces, so the body is
  // everything up to the first closing brace. An earlier version of this
  // matched to the next newline-plus-brace and swallowed the next three
  // functions, which made every resolver look like it asked for six ids.
  const m = new RegExp(`function\\s+${fn}\\s*\\([^)]*\\)\\s*\\{([^{}]*)\\}`).exec(src);
  if (!m) { fails.push(`${fn}() is gone from ${ENGINE}`); continue; }
  const body = m[1];
  const ids = [...body.matchAll(/el\(\s*"([^"]+)"\s*\)/g)].map((x) => x[1]);
  if (ids.length !== 1)
    fails.push(`${fn}() asks for ${ids.length} ids (${ids.join(', ') || 'none'}) — a control has one name`);
  else if (ids[0] !== id)
    fails.push(`${fn}() asks for #${ids[0]}, expected #${id}`);
}

/* The machinery that made alias lists possible. Its return would be the first
   step back. */
if (/function\s+firstEl\s*\(/.test(src))
  fails.push('firstEl() is back — that is the function that makes alias lists possible');
if (/var\s+U_\s*=/.test(src))
  fails.push('U_() is back — per-unit id variants were folded into the build-time rename');

console.log(`${Object.keys(RESOLVERS).length} control resolvers checked in ${ENGINE}`);
if (!fails.length) {
  console.log('PASS — every control resolves to exactly one id.');
} else {
  console.log(`FAIL — ${fails.length}:`);
  fails.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
