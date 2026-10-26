#!/usr/bin/env node
/** Read-only quality screen for the 20 staged denominational elective packages.
 * Usage: node tools/audit-elective-readings.mjs [--root PATH] [--course D-C4] [--json] [--strict]
 * This is a screening tool, NOT a rights, translation, or academic approval.
 * --strict exits 2 if a reading is substantially contained in its textbook;
 * default is report-only because existing handoff packages are drafts.
 * It never opens assessment banks or writes output files.
 */
import fs from 'node:fs';
import path from 'node:path';

const CODES = ['A', 'B', 'C', 'D'].flatMap(letter =>
  Array.from({ length: 5 }, (_, index) => `${letter}-C${index + 1}`));
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const value = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const root = path.resolve(value('--root') || process.cwd());
const only = value('--course');
if (only && !CODES.includes(only)) {
  console.error(`Unknown course ${only}; expected one of ${CODES.join(', ')}`);
  process.exit(2);
}
const N = 10;
const CONTAINMENT_THRESHOLD = 0.80;
const CROSS_THRESHOLD = 0.80;
const MIN_WINDOWS = 100;

function tokens(markdown) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n').filter(line => !/^\s*(?:#{1,6}\s|Back to top\.?\s*$|(?:Source|Provenance|Status):\s)/i.test(line))
    .join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ');
  return body.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
}
function windows(words) {
  const set = new Set();
  for (let i = 0; i + N <= words.length; i++) set.add(words.slice(i, i + N).join('\u0001'));
  return set;
}
function containment(a, b) {
  if (!a.size) return null;
  let shared = 0;
  for (const window of a) if (b.has(window)) shared++;
  return { shared, total: a.size, ratio: shared / a.size };
}
function readCourse(code) {
  const dir = path.join(root, 'books', code);
  const out = { course: code, textbookWords: null, readings: [], warnings: [] };
  const textbookPath = path.join(dir, 'textbook.md');
  if (!fs.existsSync(textbookPath)) {
    out.warnings.push('MISSING_TEXTBOOK');
    return { out, shingles: [] };
  }
  const bookWords = tokens(fs.readFileSync(textbookPath, 'utf8'));
  const bookWindows = windows(bookWords);
  out.textbookWords = bookWords.length;
  const shingles = [];
  for (let i = 1; i <= 5; i++) {
    const name = `reading-${i}.md`;
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) {
      out.readings.push({ reading: i, status: 'MISSING' });
      out.warnings.push(`MISSING_READING_${i}`);
      continue;
    }
    const words = tokens(fs.readFileSync(file, 'utf8'));
    const readingWindows = windows(words);
    const match = containment(readingWindows, bookWindows);
    const highOverlap = match && match.total >= MIN_WINDOWS && match.ratio >= CONTAINMENT_THRESHOLD;
    const sizeAdvisory = words.length < 3000 ? 'BELOW_3000_WORD_TARGET' :
      words.length > 6000 ? 'ABOVE_6000_WORD_TARGET' : null;
    out.readings.push({ reading: i, words: words.length,
      unique10WordWindows: readingWindows.size,
      textbookOverlap: match && { shared: match.shared, total: match.total,
        percentage: +(100 * match.ratio).toFixed(2) },
      highOverlap: !!highOverlap, sizeAdvisory });
    if (highOverlap) out.warnings.push(`READING_${i}_DUPLICATES_TEXTBOOK`);
    if (sizeAdvisory) out.warnings.push(`READING_${i}_${sizeAdvisory}`);
    shingles.push({ course: code, reading: i, windows: readingWindows });
  }
  return { out, shingles };
}

const all = CODES.map(readCourse);
const cross = [];
const readings = all.flatMap(x => x.shingles);
for (let i = 0; i < readings.length; i++) {
  for (let j = i + 1; j < readings.length; j++) {
    const a = readings[i], b = readings[j];
    if (a.course === b.course || Math.min(a.windows.size, b.windows.size) < MIN_WINDOWS) continue;
    const small = a.windows.size <= b.windows.size ? a : b;
    const large = small === a ? b : a;
    const m = containment(small.windows, large.windows);
    if (m.ratio >= CROSS_THRESHOLD) cross.push({
      smaller: `${small.course}/reading-${small.reading}.md`,
      larger: `${large.course}/reading-${large.reading}.md`,
      shared: m.shared, smallerWindows: m.total,
      percentage: +(100 * m.ratio).toFixed(2)
    });
  }
}
const courses = all.map(x => x.out).filter(x => !only || x.course === only);
const report = { source: path.join(root, 'books'), algorithm: `${N}-word normalized window containment`,
  thresholds: { overlapPercent: 80, minWindows: MIN_WINDOWS, readingWordsAdvisory: [3000, 6000] },
  caveat: 'Flags are review leads, not copyright clearance or proof of source independence; historic quotations and translations need human review.',
  courses, crossCourse: cross.filter(x => !only || x.smaller.startsWith(only + '/') || x.larger.startsWith(only + '/')) };
if (flag('--json')) console.log(JSON.stringify(report, null, 2));
else {
  for (const course of courses) {
    console.log(`${course.course}: textbook ${course.textbookWords ?? 'MISSING'} words`);
    for (const r of course.readings) console.log(`  R${r.reading}: ${r.words ?? 'MISSING'} words; ${r.textbookOverlap?.percentage ?? 'n/a'}% textbook containment${r.highOverlap ? ' [DUPLICATION]' : ''}${r.sizeAdvisory ? ` [${r.sizeAdvisory}]` : ''}`);
  }
  console.log(`Cross-course reading pairs >=80% containment: ${report.crossCourse.length}`);
  for (const x of report.crossCourse) console.log(`  ${x.smaller} in ${x.larger}: ${x.percentage}%`);
  console.log('Screen only; original-edition, rights, translation and faculty gates remain.');
}
if (flag('--strict') && courses.some(c => c.warnings.some(w => w.includes('DUPLICATES_TEXTBOOK')))) process.exitCode = 2;
