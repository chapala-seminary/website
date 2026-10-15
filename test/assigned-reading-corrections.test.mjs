// Revised assigned-reading questions clear obsolete failures, never valid passes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:8798';
const books = [
  JSON.parse(fs.readFileSync('src/content/textbooks/pentecostal.json', 'utf8')),
  JSON.parse(fs.readFileSync('src/content/readings/wrreadings.json', 'utf8')),
];
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
try {
  for (const book of books) for (const lang of ['en', 'es', 'fr']) for (const scenario of ['unfinished', 'passed', 'current']) {
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });
    const passed = scenario === 'passed' ? '2026-10-01' : null;
    const revision = scenario === 'current' ? book.test.revision : 'old-assignment';
    await context.addInitScript(({ slug, revision, passed, lang }) => {
      localStorage.setItem('cts_lang', lang);
      localStorage.setItem(`cts_textbook_${slug}_state`, JSON.stringify({
        rev: revision, draw: Array.from({ length: 20 }, (_, i) => i + 20),
        fillAnswers: Array(20).fill('old answer'), fillChecked: Array(20).fill(true),
      }));
      localStorage.setItem(`cts_textbook_${slug}_lock`, String(Date.now() + 900000));
      if (passed) {
        localStorage.setItem(`cts_textbook_${slug}_passed`, passed);
        localStorage.setItem('cts_textbooks_passed', JSON.stringify([slug]));
      }
    }, { slug: book.slug, revision, passed, lang });
    const page = await context.newPage();
    await page.goto(`${base}/${lang === 'en' ? '' : `${lang}/`}${book.page}Test.html`);
    await page.waitForFunction(() => window.CTS_TEXTBOOK_TEST && document.querySelector('#tb-questions'));
    const state = await page.evaluate(slug => ({
      state: JSON.parse(localStorage.getItem(`cts_textbook_${slug}_state`)),
      lock: localStorage.getItem(`cts_textbook_${slug}_lock`),
      passed: localStorage.getItem(`cts_textbook_${slug}_passed`),
      all: JSON.parse(localStorage.getItem('cts_textbooks_passed') || '[]'),
      revision: window.CTS_TEXTBOOK_TEST.revision,
      resetWaitOnRevision: window.CTS_TEXTBOOK_TEST.resetWaitOnRevision,
    }), book.slug);
    assert.equal(state.revision, book.test.revision); checks++;
    assert.equal(state.resetWaitOnRevision, true); checks++;
    assert.equal(state.state.rev, book.test.revision); checks++;
    assert.equal(state.passed, passed); checks++;
    assert.deepEqual(state.all, passed ? [book.slug] : []); checks++;
    if (scenario === 'current') {
      assert.ok(Number(state.lock) > Date.now()); checks++;
      assert.deepEqual(state.state.fillAnswers, Array(20).fill('old answer')); checks++;
      assert.equal(await page.locator('#tb-revised').count(), 0); checks++;
    } else {
      assert.equal(state.lock, null); checks++;
      assert.equal(state.state.fillAnswers.length, 0); checks++;
      assert.equal(state.state.fillChecked.length, 0); checks++;
      assert.ok(await page.locator('#tb-revised').isVisible()); checks++;
      if (passed) {
        const expected = { en: 'still valid', es: 'sigue siendo válida', fr: 'reste valable' };
        assert.ok((await page.locator('#tb-revised').innerText()).includes(expected[lang])); checks++;
      }
    }
    await context.close();
  }
  console.log(`PASS — ${checks} revised-reading attempt, lock and prior-pass checks in EN/ES/FR.`);
} finally { await browser.close(); }
