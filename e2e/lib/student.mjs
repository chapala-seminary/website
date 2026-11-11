/* What a student does, through the screens a student uses: the sign-up form,
 * the backup page's code box, the honesty pledge and "Take the exam", the
 * questions, Submit, the "Change track" menu.
 *
 * The older browser tests set these up behind the page's back (localStorage
 * seeds, window.CTS_SYNC.restore, sessionStorage switches past the pledge),
 * which is right for testing one feature and wrong for a journey: a journey
 * is meant to fail when the screen a student needs is broken.
 */
import { expect } from '@playwright/test';
import { unitBank } from './site.mjs';

export const langPath = (lang, file) => `/${lang === 'en' ? '' : lang + '/'}${file}?cts_lang=${lang}`;
export const ls = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);
export const lsJson = async (page, key, dflt = null) => JSON.parse((await ls(page, key)) || 'null') ?? dflt;

/** The front page's sign-up form. Returns the student code the page shows. */
export async function signUp(page, { name, email, track = 'cert', lang = 'en', country = 'MX' }) {
  await page.goto(langPath(lang, 'index.html'));
  await page.locator('#reg-name').fill(name);
  if (email) await page.locator('#reg-email').fill(email);
  await page.locator('#reg-country').selectOption(country);
  await page.locator('#reg-track').selectOption(track);
  await page.locator('#reg-save').click();
  await expect(page.locator('#reg-confirm'), 'the form confirms the registration').toBeVisible();
  // The code arrives once cts-sync.js has registered the student with the Worker.
  await expect(page.locator('#reg-code'), 'the page shows the student their code').toBeVisible({ timeout: 30_000 });
  const code = (await page.locator('#reg-code-value').textContent()).trim();
  expect(code, 'a well-formed student code').toMatch(/^CTS-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
  return code;
}

/** Another device: the backup page, the code typed as a person would type it. */
export async function restoreWithCode(page, code, { lang = 'en' } = {}) {
  await page.goto(langPath(lang, 'cts-backup.html'));
  await page.locator('#code-input').fill(code.toLowerCase().replace(/-/g, ' '));
  await page.locator('#code-restore').click();
  await expect(page.locator('#code-note'), 'the backup page reports the restore').toHaveClass(/\bok\b/, { timeout: 30_000 });
  await expect(page.locator('#code-value')).toHaveText(code);
}

/** The "Change track" menu, bottom left of every page once registered.
 *  `to` is the menu's own value: cert | assoc | mdiv | thm. Waits for the
 *  reload that follows a change the seminary has accepted. */
export async function changeTrack(page, to) {
  await page.locator('#cts-track-ctl .tg').click();
  await Promise.all([
    page.waitForEvent('load', { timeout: 30_000 }),
    page.locator(`#cts-track-ctl .menu [data-t="${to}"]`).click(),
  ]);
}

const unitFile = (pages, n) => `${pages}Unit${n}.html`;

/** Open a unit, make the honesty pledge, open the exam. A tab that already
 *  opened this exam goes straight back to it (cts-exam-view.js remembers the
 *  view for the tab), as it does for a student. */
export async function openExam(page, { pages, n, lang = 'en' }) {
  await page.goto(langPath(lang, unitFile(pages, n)));
  const pledge = page.locator('#cts-pledge-check');
  const questions = page.locator('.question').first();
  await expect.poll(async () => (await questions.isVisible()) || (await pledge.isVisible()),
    { message: 'the unit offers the pledge, or the exam already open in this tab', timeout: 20_000 }).toBe(true);
  if (!(await questions.isVisible())) {
    await expect(page.locator('#cts-exam-open'), 'the exam stays closed until the pledge is made').toBeDisabled();
    await pledge.check();
    await page.locator('#cts-exam-open').click();
  }
  await expect(questions, 'the exam shows its questions').toBeVisible();
  // The live engine asks the Worker first: a sitting to answer ('ready'), or a
  // unit already passed, shown for review ('passed').
  await page.waitForFunction(() => ['ready', 'passed'].includes(window.CTS_ENGINE?.live?.()?.status), null, { timeout: 30_000 });
}

const answered = (sel) => `${sel} .feedback-text.correct, ${sel} .feedback-text.incorrect`;

/** Every multiple-choice question, by clicking; the first `wrong` deliberately missed. */
export async function answerMultipleChoice(page, bank, { wrong = 0 } = {}) {
  for (let i = 0; i < bank.mc.length; i++) {
    const n = bank.mc[i].options.en.length;
    const pick = i < wrong ? (bank.mc[i].answer + 1) % n : bank.mc[i].answer;
    await page.locator(`button.option[data-mc="${i}"][data-opt="${pick}"]`).click();
    // Wait for the Worker's verdict, not the interim "Checking…".
    await page.locator(answered(`.question[data-mc="${i}"]`)).first().waitFor({ timeout: 30_000 });
  }
}

/** Every fill-in, typed and checked. `answer(i, q)` may override one. */
export async function answerFillIns(page, bank, { lang = 'en', answer } = {}) {
  for (let i = 0; i < (bank.fill || []).length; i++) {
    const q = bank.fill[i];
    const text = answer?.(i, q) ?? (q.answer[lang] || q.answer.en);
    // The live engine re-renders questions as replies arrive; one retry
    // covers a field cleared by a late re-render before Check ran.
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.locator(`input[data-fill="${i}"]`).fill(text);
      await page.locator(`button[data-fill-check="${i}"]`).click();
      const done = await page.locator(answered(`.question[data-fill="${i}"]`)).first()
        .waitFor({ timeout: 30_000 }).then(() => true, () => false);
      if (done) break;
      if (attempt === 1) throw new Error(`fill-in ${i}: no verdict from the Worker`);
    }
  }
}

/** A written answer long enough to grade. The local Worker's stand-in model
 *  (AI_FAKE) reads its verdict from a marker: [[met]], [[not_met]], [[pending]]. */
let salt = 0;
export const essay = (marker) => `${++salt}. In my own words: this unit teaches how the church received and passed on the faith, and why that matters for ministry today. ${marker}`;

/** The whole exam, as a student sits it, then Submit.
 *  `sa`: one marker per short answer to write (master's tracks), or none. */
export async function takeUnit(page, { pages, prefix, n, lang = 'en', wrongMc = 0, sa = null, fill }) {
  const bank = unitBank(prefix, n);
  await openExam(page, { pages, n, lang });
  await answerMultipleChoice(page, bank, { wrong: wrongMc });
  await answerFillIns(page, bank, { lang, answer: fill });
  if (sa) for (let i = 0; i < sa.length; i++) if (sa[i]) await page.locator(`textarea[data-sa="${i}"]`).fill(essay(sa[i]));
  await page.locator('#submitExamBtn').click();
  return bank;
}

export const PASSED = /Unit \d+ passed|Unidad \d+ aprobada|Unité \d+ réussie|aprobad[ao]|passed/i;

/** The unit counts as passed where the certificate pages look for it. */
export async function expectUnitPassed(page, course, n) {
  await expect.poll(async () => (await lsJson(page, `cts_${course}_progress`, {}))[`unit${n}`],
    { message: `cts_${course}_progress.unit${n} is set`, timeout: 30_000 }).toBe(true);
}
