import assert from 'node:assert/strict';
import {test} from 'node:test';
import {register} from 'node:module';
import fs from 'node:fs';
register('data:text/javascript,' + encodeURIComponent(`export async function load(url, ctx, next) {
  return next(url, url.endsWith('.json') ? {...ctx, importAttributes: {...ctx.importAttributes, type: 'json'}} : ctx);
}`));
const {verificationEmail, codeEmail, certificateEmail, languageLink, emailLanguage} = await import('../worker/email.js');
const {note, welcomeNote} = await import('../worker/outreach.js');
const {awardTitle} = await import('../worker/award-names.js');
const {appealEmail} = await import('../worker/grading/appeal-email.js');
const {gradedEmail} = await import('../worker/grading/queue.js');
const worker = (await import('../worker/index.js')).default;
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json'));
const site = 'https://example.test';

test('Portuguese messages keep language, query and fragment across devices', () => {
  assert.equal(emailLanguage('pt'), 'pt');
  assert.equal(emailLanguage('unknown'), 'en');
  assert.equal(languageLink(site, 'fr/index.html?keep=1#catalog', 'pt'), site + '/pt/index.html?keep=1&cts_lang=pt#catalog');
  assert.equal(languageLink('x', 'index.html#catalog', 'pt'), 'x/pt/index.html?cts_lang=pt#catalog');
  assert.doesNotThrow(() => appealEmail({name: 'Synthetic', upheld: true, site: 'x', lang: 'es'}));
  const messages = [verificationEmail('123456', site + '/pt/cts-confirm-email.html#test', 'pt'),
    codeEmail({students: [{name: 'Synthetic', id: 'SYNTHETIC'}], origin: site, lang: 'pt'}),
    certificateEmail({name: 'Synthetic', award: 'Panorama do Antigo Testamento', code: '0123456789', page: 'CTSOTSCertificate.html', origin: site, lang: 'pt'}),
    welcomeNote({name: 'Synthetic', lang: 'pt'}, {site, stopUrl: site + '/stop-notes/SYNTHETIC'}),
    note('quiet', {name: 'Synthetic', lang: 'pt', last_unit: 'ots 1'}, {site, stopUrl: site + '/stop-notes/SYNTHETIC'}),
    note('not_started', {name: 'Synthetic', lang: 'pt'}, {site, stopUrl: site + '/stop-notes/SYNTHETIC'}),
    appealEmail({name: 'Synthetic', lang: 'pt', site, upheld: false, passed: true, courseDone: true, feedback: 'Comentário de teste'})];
  for (const message of messages) {
    assert.ok(message.subject && message.text);
    assert.match(message.text, /Seminário|Unidade/);
    assert.doesNotMatch(message.text, /undefined|Dear |Bonjour|Estimado|Your student|Your certificate/);
  }
  assert.match(messages[1].text, /\/pt\/cts-backup.html\?cts_lang=pt/);
  assert.match(messages[2].text, /\/pt\/verify\/0123456789/);
  assert.match(messages[3].text, /\/pt\/CTSUnit1.html\?cts_lang=pt/);
  assert.match(messages[4].text, /Panorama do Antigo Testamento, Unidade 1/);
  assert.match(messages[6].text, /Agora você concluiu o curso/);
  assert.match(messages[6].text, /Comentário de teste/);
  assert.match(appealEmail({name: 'Synthetic', lang: 'pt', site, upheld: true}).text, /resultado inicial foi mantido/);
  assert.match(gradedEmail('Synthetic', 'passed', 'pt', site).text, /Você passou/);
  assert.match(gradedEmail('Synthetic', 'failed', 'pt', site).text, /após o período de espera/);
  assert.match(gradedEmail('Synthetic', 'failed', 'pt', site).text, /\/pt\/index.html\?cts_lang=pt/);
});

test('every course gets a PT display award without changing the stored title', () => {
  for (const [slug, course] of Object.entries(catalog.courses)) {
    assert.ok(course.title.pt, slug);
    const award = {level: 'course', course: slug, title: course.title.en + ' — Certificate of Ministry'};
    assert.equal(awardTitle(award, 'pt'), course.title.pt + ' — Certificado de Ministério');
    assert.equal(awardTitle(award, 'en'), award.title);
  }
  assert.equal(awardTitle({level: 'mdiv', title: 'Master of Divinity'}, 'pt'), 'Mestrado em Divindade (M.Div.)');
});

test('Portuguese verification lookup, redirect, found, absent, revoked and escaped output', async () => {
  let certificate = null;
  let assetRequests = 0;
  const env = {ASSETS: {async fetch() {assetRequests++; return new Response('Static fallback', {status: 404});}}, DB: {prepare(sql) {return {bind() {return this;}, async first() {
    if (sql.includes('lookup_failures')) return {n: 0};
    if (sql.includes('FROM certificates')) return certificate;
    throw new Error('Unexpected SQL');
  }};}, async batch() {return [];}}};
  const request = path => worker.fetch(new Request('https://chapalaseminary.org' + path), env, {});
  let response = await request('/pt/verify');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  let html = await response.text();
  assert.match(html, /<html lang="pt"/);
  assert.match(html, /action="\/pt\/verify"/);
  response = await request('/pt/verify?code=0123456789');
  assert.equal(response.headers.get('location'), '/pt/verify/0123456789');
  response = await request('/pt/verify/0123456789');
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Certificado não encontrado/);
  certificate = {student_name: '<script>bad</script>', level: 'course', course: 'ots', title: 'Old Testament Survey — Certificate of Ministry', issued_at: '2026-11-27T06:00:00Z', verify_code: '0123456789'};
  response = await request('/pt/verify/0123456789');
  assert.equal(response.status, 200);
  html = await response.text();
  assert.match(html, /27 de novembro de 2026/);
  assert.match(html, /Panorama do Antigo Testamento — Certificado de Ministério/);
  assert.ok(!html.includes('<script>bad</script>'));
  certificate.revoked_at = '2026-11-27';
  html = await (await request('/pt/verify/0123456789')).text();
  assert.match(html, /Certificado revogado/);
  assert.ok(!html.includes('&lt;script&gt;bad'));
  assert.equal((await request('/api/verify/0123456789')).status, 200);
  assert.equal(assetRequests, 0, 'verification must reach the Worker, not static assets');
});
