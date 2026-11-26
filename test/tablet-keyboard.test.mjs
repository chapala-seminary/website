// Issue #398 (Redmi Pad 2): with the on-screen keyboard open, a tablet keeps
// about half its screen. The pinned language bar and the floating email box
// then covered the answer fields, so taps meant for a field landed on the box.
// This opens a French M.Div. exam on an Android-tablet profile, shrinks the
// screen as the keyboard does, and types into every written-answer field.
// Usage: node test/tablet-keyboard.test.mjs http://127.0.0.1:8798
import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:8798';
const browser = await chromium.launch();
try {
  for (const [w, h] of [[1280, 420], [800, 700]]) {
    const ctx = await browser.newContext({ ...devices['Galaxy Tab S4'], viewport: { width: w, height: 800 }, locale: 'fr-FR' });
    const page = await ctx.newPage();
    await page.goto(`${base}/fr/CTSSTUnit1.html`, { waitUntil: 'networkidle' });
    await page.fill('#regName', 'Tablet Keyboard Test');
    await page.selectOption('#regCountry', 'CM');
    await page.selectOption('#regTrack', 'mdiv');
    await page.tap('#regSave');
    await page.waitForSelector('#cts-email-optional', { timeout: 8000 });
    await page.tap('#cts-pledge-check');
    await page.getByRole('button', { name: /passer l.examen/i }).tap();
    await page.setViewportSize({ width: w, height: h });            // the keyboard opens
    const fields = await page.$$('#questionsContainer input[type=text]:visible, #questionsContainer textarea:visible');
    assert.ok(fields.length >= 10, `written-answer fields are shown (${fields.length})`);
    const failed = [];
    for (const [i, f] of fields.entries()) {
      await f.scrollIntoViewIfNeeded();
      await f.tap();
      await page.keyboard.type('abc');
      const ok = await f.evaluate(el => document.activeElement === el) && (await f.inputValue()).endsWith('abc');
      if (!ok) failed.push(i + 1);
    }
    assert.deepEqual(failed, [], `${w}x${h}: fields that could not be typed into`);
    assert.equal(await page.isVisible('#cts-email-optional'), false, 'the email box steps aside while typing');
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(300);
    assert.equal(await page.isVisible('#cts-email-optional'), true, 'the email box comes back after typing');
    await ctx.close();
  }
  console.log('PASS: tablet with keyboard open can type into every written-answer field (#398)');
} finally { await browser.close(); }
