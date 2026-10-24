/* Missed-question teaching review. Explanations quote the assigned material,
 * rather than inventing a theological attribution or repeating a bare key.
 * Every passage has a stable link back to its context. Only the submitted
 * draw is shown by the browser; the asset itself is public, like the banks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { overlayQuestions, resolveKeysRoot } from './grading-keys-lib.mjs';

export const languages = ['en', 'es', 'fr'];
const fold = s => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const stop = new Set(('the a an of in on to and or for with is are was were be that this these those it its as by from not at which what who how his her their he she they we you our your according reading chapter excerpt author describes calls says called question blank la el los las un una uno unos unas de del al en y o que es son fue se su sus por para con como esta este estas estos dans le les des du de un une et au aux est sont sur pour par qui que ce cette ces il elle ses son sa').split(' '));
const tokens = s => [...new Set(fold(s).split(' ').filter(w => w.length > 2 && !stop.has(w)))];
const text = n => n.text.replace(/\s+/g, ' ').trim();
/* Textbook answers live in assessment-keys; readings still hold them publicly. */
const records = () => {
  const keysRoot = resolveKeysRoot('.');
  return ['textbooks', 'readings'].flatMap((kind) => fs.readdirSync(`src/content/${kind}`).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const rec = { kind, ...JSON.parse(fs.readFileSync(`src/content/${kind}/${f}`, 'utf8')) };
    if (kind === 'textbooks' && rec.test?.questions) {
      const overlay = overlayQuestions(keysRoot, 'src/content/textbooks', f, rec.slug, rec.test.questions);
      if (!overlay) throw new Error(`exam-review: textbook ${rec.slug} needs assessment-keys (public files have no answer/accept)`);
      rec.test = { ...rec.test, questions: overlay };
    }
    return rec;
  }));
};
const prefix = lang => lang === 'en' ? '/' : `/${lang}/`;

// The mode the pages are built in (src/lib/grading-mode.ts): live unless told otherwise.
const LIVE = (process.env.CTS_GRADING_MODE ?? 'live').trim().toLowerCase() !== 'shadow';
const fingerprint = value => createHash('sha256').update(value).digest('hex').slice(0,16);
const REFERENCE_FILE = 'src/data/exam-review-references.json';
// Keep a long source paragraph readable on a phone. Choose a contiguous
// sentence passage, never rewrite the author or cut a sentence in half.
function focusedPassage(paragraph, prompt, answers, lang) {
  if (paragraph.split(/\s+/).length <= 300) return paragraph;
  const sentences = [...new Intl.Segmenter(lang, {granularity:'sentence'}).segment(paragraph)];
  const terms = tokens(prompt);
  const frequency = new Map();
  for(const sentence of sentences) for(const term of tokens(sentence.segment)) frequency.set(term,(frequency.get(term)||0)+1);
  let best = null;
  for(let start=0;start<sentences.length;start++) for(let end=start;end<sentences.length;end++) {
    const passage = paragraph.slice(sentences[start].index, sentences[end].index+sentences[end].segment.length).trim();
    const count = passage.split(/\s+/).length;
    if(count>260 && end>start) break;
    if(count<90 && end<sentences.length-1) continue;
    const normalized = fold(passage), words = new Set(tokens(passage));
    const relevance = terms.filter(term=>words.has(term)).reduce((score,term)=>score+1+Math.log((sentences.length+1)/((frequency.get(term)||0)+1)),0);
    const containsAnswer = answers.some(answer=>(` ${normalized} `).includes(` ${answer} `));
    const score = relevance + (containsAnswer ? 12 : 0) - Math.abs(count-160)*0.015;
    if(!best || score>best.score) best={passage,score};
  }
  return best?.passage || paragraph;
}
export function makeReview(dist, { write = true, refresh = false } = {}) {
  const references = refresh ? {} : JSON.parse(fs.readFileSync(REFERENCE_FILE,'utf8'));
  const cache = new Map(), candidateCache = new Map(), report = [], misses = [];
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const filename = path.join(dist, file);
    if (!fs.existsSync(filename)) return null;
    const root = parse(fs.readFileSync(filename, 'utf8'));
    // Source-language copies and interface text are never teaching passages.
    const copy = parse(root.toString());
    for (const el of copy.querySelectorAll('script, style, nav, header.cts-masthead, footer.cts-foot, #cts-register, #greeting, [data-cts-rrbox], .cts-source, [data-cts-chrome], .cts-shelf, .cts-attest, .assignment, .byline, .dg-note-line, [hidden]')) el.remove();
    const value = {root, copy, file, changed:false}; cache.set(file, value); return value;
  }
  function candidates(file, lang, group = null) {
    const cacheKey = `${file}:${lang}:${group}`;
    if(candidateCache.has(cacheKey)) return candidateCache.get(cacheKey);
    const page = load(file); if (!page) return [];
    const root = page.copy;
    const book = root.querySelector('.tb-book'), region = book || root.querySelector('main') || root.querySelector('body') || root;
    let heading = '', chapter = 0, result = [];
    const allParagraphs = page.root.querySelectorAll('p, li, blockquote, pre, .locus');
    const originals = new Map();
    for(const n of allParagraphs) {
      const clone = parse(n.outerHTML); for(const source of clone.querySelectorAll('.cts-source')) source.remove();
      if(!originals.has(text(clone))) originals.set(text(clone), n);
    }
    // In textbooks, h2 defines the assigned excerpt/chapter. In rooms, an
    // entry's data-id defines the reading; no further-study shelf is included.
    for (const node of region.querySelectorAll('h1, h2, h3, p, li, blockquote, .locus')) {
      if (node.closest('.cts-source')) continue;
      const value = text(node);
      if (/^H[123]$/.test(node.tagName)) {
        heading = value || heading;
        if (node.tagName === 'H2') chapter++;
        continue;
      }
      if (node.querySelector('p, li, blockquote')) continue;
      if (value.length < 35 || value.split(/\s+/).length < 5) continue;
      const entry = node.closest('[data-id]');
      const nodeGroup = entry ? Number(entry.getAttribute('data-id')) : book ? chapter : null;
      if (group && nodeGroup && nodeGroup !== group) continue;
      // A language not yet translated is explicitly labeled as source text.
      const marked = node.querySelector('.cts-reading[lang]') || node.closest('[lang]');
      const actual = marked?.getAttribute('lang') || lang;
      if (actual !== lang && actual !== 'en') continue;
      const original = originals.get(value);
      if (!original) continue;
      const id = original.id || `cts-review-${fingerprint(value)}`;
      result.push({text:value, heading, href:`/${file}#${id}`, lang:actual, group:nodeGroup, page, node:original, id, folded:fold(value), words:new Set(tokens(value))});
    }
    for (const pre of region.querySelectorAll('pre')) {
      const section = pre.closest('section[id]');
      const original = page.root.querySelector('#' + (section?.id || '')) || page.root.querySelector('pre');
      const originalPre = section?.id ? original?.querySelector('pre') : original;
      if(!originalPre) continue;
      const id = section?.id || 'cts-review-source';
      for(const part of pre.text.split(/\n\s*\n/)) {
        const value = part.replace(/\s+/g,' ').trim();
        if(value.length<35 || value.split(/\s+/).length<5) continue;
        result.push({text:value,heading:section?.id || heading,href:`/${file}#${id}`,lang,group:section?.id?.replace('chapter-',''),page,node:section?.id ? original : originalPre,id:section?.id || originalPre.id || 'cts-review-source',folded:fold(value),words:new Set(tokens(value))});
      }
    }
    candidateCache.set(cacheKey,result); return result;
  }
  function sources(record, lang, group) {
    const main = prefix(lang).slice(1) + `${record.page}.html`;
    let list = candidates(main, lang, group);
    const page = load(main);
    if(record.files?.html) {
      const reader = record.files.html[lang] || record.files.html.en;
      const assigned = {
        joshua: [['I','II','III'],['X','XI'],['XVIII','XIX','XX'],['XXI','XXII','XXIII','XXIV','XXV','XXVI'],['XXX','XXXI','XXXII','XXXIII']],
        galatiansfindlay: [['IV'],['X'],['XIV','XVI'],['XXII','XXV'],['XXVI','XXVII']],
        romansmoule: [['III','VIII'],['IX','XII'],['XIV','XVII'],['XX','XXIV'],['XXV','XXIX']]
      }[record.slug]?.[group-1];
      return candidates(reader, lang, null).filter(p => !assigned || assigned.includes(p.group) || !p.group);
    }
    // The legacy World Religions bank explicitly asks about course lessons
    // as well as its historical readers. Cite those lessons honestly.
    if(record.slug === 'wrreadings') {
      for(let unit=1;unit<=15;unit++) list.push(...candidates(prefix(lang).slice(1)+`CTSWRUnit${unit}.html`,lang,null));
    }
    const extra = new Set();
    // Three complete commentaries live in separate assigned readers; World
    // Religions likewise links five readers rather than embedding them.
    for (const a of page?.copy.querySelectorAll('main a[href], .tb-book a[href]') || []) {
      const href = a.getAttribute('href');
      if (!href || /^(https?:|#|mailto:)/.test(href)) continue;
      const u = new URL(href, `https://chapalaseminary.org/${main}`);
      const target = u.pathname.slice(1);
      if (/^(?:en\/|es\/|fr\/)?(?:textbooks\/|CTSWRLectura)/.test(target)) {
        const readingNumber = /CTSWRLectura(\d)/.exec(target)?.[1];
        if (group && readingNumber && Number(readingNumber) !== group) continue;
        extra.add(target);
      }
    }
    for (const file of extra) list.push(...candidates(file, lang, null));
    return [...new Map(list.map(p => [p.href,p])).values()];
  }
  for (const record of records()) for (const lang of languages) {
    const poolCache = new Map(), reviews = [];
    for (const [i,q] of record.test.questions.entries()) {
      const group = q.reading || q.group || q.chapter || null;
      if (!poolCache.has(group)) poolCache.set(group, sources(record, lang, group));
      let pool = poolCache.get(group);
      if(record.slug === 'genesisreadings' && i === 0) pool = pool.concat(candidates(prefix(lang).slice(1)+'CTSGenesisUnit1.html',lang,null));
      const terms = tokens(q.prompt[lang] || q.prompt.en);
      const answers = [q.answer[lang] || q.answer.en, ...(q.accept?.[lang] || [])].map(fold).filter(Boolean);
      const freq = new Map(); for (const p of pool) for (const w of p.words) freq.set(w,(freq.get(w)||0)+1);
      const answerFrequency = pool.filter(p => answers.some(a => (` ${p.folded} `).includes(` ${a} `))).length;
      const ranked = pool.map(p => {
        const hits = terms.filter(w => p.words.has(w));
        const answer = answers.some(a => (` ${p.folded} `).includes(` ${a} `));
        const relevance = hits.reduce((n,w) => n + 1 + Math.log((pool.length+1)/((freq.get(w)||0)+1)),0);
        return {p,hits:hits.length,answer,score:relevance + (answer ? 10 + 8*Math.log((pool.length+1)/(answerFrequency+1)) : 0) - (p.text.length < 120 ? 4 : 0)};
      }).sort((a,b) => b.score-a.score || a.p.text.length-b.p.text.length);
      let best = ranked[0];
      // This legacy item asks about respectful Christian witness, rather than
      // Rabbinic Judaism. Its exact course explanation is Acts 17 in Unit 1.
      if(record.slug === 'wrreadings' && (i === 9 || i === 3)) {
        const lesson = JSON.parse(fs.readFileSync('src/content/lessons/CTSWR/1.json','utf8'));
        const source = fold(lesson.blocks.find(b => b.id === 'b024').text[lang]);
        const chosen = ranked.find(r => fold(r.p.text).includes(source));
        if (!chosen) throw new Error(`World Religions witness explanation missing in ${lang}`);
        best = chosen;
      }
      if(record.slug === 'genesisreadings' && i === 0) {
        const lesson = JSON.parse(fs.readFileSync('src/content/lessons/CTSGenesis/1.json','utf8'));
        const block = lesson.blocks.find(b => b.text.en?.startsWith('The English title'));
        const source = fold(parse(block.text[lang]).text);
        const chosen = ranked.find(r => fold(r.p.text).includes(source));
        if(!chosen) throw new Error(`Genesis origin explanation missing in ${lang}`);
        best = chosen;
      }
      const referenceKey = `${record.slug}/${lang}/${i+1}`;
      const questionHash = fingerprint(JSON.stringify({prompt:q.prompt[lang] || q.prompt.en, answer:q.answer[lang] || q.answer.en}));
      const pinned = references[referenceKey];
      if(!refresh) {
        if(!pinned || pinned.question !== questionHash) throw new Error(`Review reference needs editorial refresh: ${referenceKey}`);
        best = ranked.find(r => r.p.page.file === pinned.file && fingerprint(r.p.text) === pinned.paragraph);
      }
      if (!best) throw new Error(`${record.slug}/${lang}/Q${i+1}: no assigned teaching passage`);
      // Keep the source author's actual explanation intact; never manufacture
      // a quotation, complete the blank, or label a key as an explanation.
      const p = best.p;
      if (write) { p.node.setAttribute('id',p.id); p.page.changed=true; }
      let extra = p.text.length < 160 ? pool.find(other => other.page === p.page && other.group === p.group && other.lang === p.lang && other.text.length > 240 && other !== p) : null;
      if(!refresh && pinned.extra) {
        extra = pool.find(other => other.page.file === pinned.file && fingerprint(other.text) === pinned.extra);
        if(!extra) throw new Error(`Review context changed: ${referenceKey}`);
      } else if(!refresh) extra = null;
      if(refresh) references[referenceKey] = {question:questionHash,file:p.page.file,paragraph:fingerprint(p.text),...(extra ? {extra:fingerprint(extra.text)} : {})};
      const paragraphs = (extra ? [p.text,extra.text] : [p.text]).map(paragraph=>focusedPassage(paragraph,q.prompt[lang] || q.prompt.en,answers,lang));
      reviews.push({ paragraphs, kind:/Unit\d+/.test(p.page.file) ? 'lesson' : 'reading', heading:p.heading || record.title[lang] || record.title.en, href:p.href, lang:p.lang });
      report.push({slug:record.slug,lang,question:i+1,answer:best.answer,hits:best.hits,score:Math.round(best.score*100)/100,href:p.href,prompt:q.prompt[lang]||q.prompt.en,passage:p.text});
      if (!best.answer || best.hits < 1) misses.push(report.at(-1));
    }
    if (write && LIVE) {
      // Live build (answer-disclosure policy, Wayne, 18 Oct 2026): a passage is
      // chosen because it holds the answer, so it is not on the test page. It is
      // written where only the Worker reads it (worker/index.js refuses
      // /assets/exam-review/ to a browser) and sent with the result of an
      // attempt that passed (worker/grading/attempts.js reviewPassagesOf).
      const file = path.join(dist,'assets','exam-review',`${record.slug}.${lang}.json`);
      fs.mkdirSync(path.dirname(file),{recursive:true});
      fs.writeFileSync(file,JSON.stringify({slug:record.slug,questions:reviews}));
      const testFile = path.join(dist,prefix(lang),`${record.page}Test.html`);
      const html = fs.readFileSync(testFile,'utf8');
      const stripped = html.replace(/<script\b[^>]*src="\/assets\/exam-review\/[^\"]*"[^>]*><\/script>/g, '');
      if (stripped !== html) fs.writeFileSync(testFile,stripped);
    } else if (write) {
      const content = `/* Teaching passages from the assigned reading, generated by tools/exam-review.mjs. */\nwindow.CTS_EXAM_REVIEW = ${JSON.stringify({slug:record.slug,questions:reviews}).replace(/</g,'\\u003c')};\n`;
      const asset = `${record.slug}.${lang}.${createHash('sha256').update(content).digest('hex').slice(0,12)}.js`;
      const file = path.join(dist,'assets','exam-review',asset);
      fs.mkdirSync(path.dirname(file),{recursive:true});
      fs.writeFileSync(file,content);
      const testFile = path.join(dist,prefix(lang),`${record.page}Test.html`);
      let html = fs.readFileSync(testFile,'utf8');
      html = html.replace(/<script\b[^>]*src="\/assets\/exam-review\/[^\"]*"[^>]*><\/script>/g, '');
      html = html.replace(/<script\b[^>]*src="[^\"]*\/assets\/js\/cts-textbook\.js[^\"]*"[^>]*><\/script>/, match => `<script src="/assets/exam-review/${asset}"></script>${match}`);
      fs.writeFileSync(testFile,html);
    }
  }
  if (write) for (const p of cache.values()) if(p.changed) fs.writeFileSync(path.join(dist,p.file),p.root.toString());
  if(refresh) fs.writeFileSync(REFERENCE_FILE,JSON.stringify(references,null,1)+'\n');
  return {report,misses};
}
export default function examReviewIntegration() {
  return {name:'cts-exam-review', hooks:{'astro:build:done':({dir,logger}) => {
    const {report,misses} = makeReview(dir instanceof URL ? dir.pathname : String(dir));
    logger.info(`${report.length} pinned, source-linked teaching explanations across all 90 exam banks`);
  }}};
}
if (process.argv[1]?.endsWith('/exam-review.mjs')) {
  const {report,misses} = makeReview(process.argv[2] || 'dist',{write:process.argv.includes('--write'),refresh:process.argv.includes('--refresh')});
  fs.writeFileSync('/private/tmp/cts-review-matches.json',JSON.stringify({report,misses},null,2));
  console.log(`${report.length} explanations; ${misses.length} weak matches. Audit: /private/tmp/cts-review-matches.json`);
}
