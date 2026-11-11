/* A Certificate student studies on a laptop and a phone.
 *
 * Signs up on the front page, passes a unit on the laptop, restores the phone
 * with the code from the backup page, passes the next unit there, and finishes
 * the course on the laptop -- which has not been opened since unit 1. Then the
 * phone, now the device that is behind, opens the Certificate of Ministry page
 * and the course certificate.
 *
 * The bug this journey is shaped around: a device that is behind must show
 * what the record says without the student having to reload. A degree page
 * said "0 / 30, not yet eligible" to a student who had finished, on a phone
 * the student had not used before (#310, found by hand on 10 Nov 2026).
 */
import { test, expect } from './fixtures.mjs';
import { record, priorUnits, priorCourses, person, catalog } from './lib/site.mjs';
import { signUp, restoreWithCode, takeUnit, expectUnitPassed, lsJson, PASSED } from './lib/student.mjs';

const CH = { pages: 'CTSCH', prefix: 'CTSCH', course: 'ch', code: 'CTSCH', units: catalog.courses.ch.totalUnits };
const PHONE = { width: 390, height: 844 };

test('a student\'s work follows them between devices, and the device that fell behind catches up', async ({ device, students }) => {
  const laptop = await device('laptop');
  const phone = await device('phone', { viewport: PHONE });
  const who = person('Two Devices');
  let code;

  await test.step('signs up on the front page and is shown a code', async () => {
    code = await signUp(laptop.page, { ...who, track: 'cert' });
    students.push(code);
    const r = await record(code);
    expect(r.student, 'the record holds what the form asked').toMatchObject({ name: who.name, email: who.email, track: 'cert' });
  });

  await test.step('passes Church History unit 1 on the laptop', async () => {
    await takeUnit(laptop.page, { ...CH, n: 1 });
    await expect(laptop.page.locator('body')).toContainText(PASSED);
    await expectUnitPassed(laptop.page, CH.course, 1);
    expect((await record(code)).progress, 'the record has the unit').toContainEqual(expect.objectContaining({ course: 'ch', unit: 1 }));
  });

  await test.step('restores the phone with the code, on the backup page', async () => {
    await restoreWithCode(phone.page, code);
    expect(await lsJson(phone.page, 'cts_student'), 'the phone knows the student').toMatchObject({ name: who.name });
    expect(await lsJson(phone.page, 'cts_ch_progress', {}), 'and the unit passed on the laptop').toMatchObject({ unit1: true });
  });

  await test.step('passes unit 2 on the phone', async () => {
    await takeUnit(phone.page, { ...CH, n: 2 });
    await expectUnitPassed(phone.page, CH.course, 2);
  });

  await test.step('back on the laptop, which last saw unit 1, finishes the course', async () => {
    // Units 3 to 9, as if done on the phone over the following weeks.
    priorUnits(code, CH.course, [3, 4, 5, 6, 7, 8, 9]);
    await takeUnit(laptop.page, { ...CH, n: CH.units });
    await expect(laptop.page.locator('body')).toContainText(PASSED);
    await expect.poll(() => lsJson(laptop.page, 'cts_done_codes', []), { message: 'the laptop records the course as done' }).toContain(CH.code);
    expect((await record(code)).completions, 'the record has the course, at the Certificate level')
      .toContainEqual(expect.objectContaining({ code: CH.code, track: 'cert' }));
  });

  await test.step('the phone, now behind, opens the Certificate of Ministry page: it counts the record with no reload by the student (#310)', async () => {
    // Eleven more courses, finished earlier: six foundations and five electives.
    const foundations = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'WISESPEAK'];
    const electives = Object.keys(catalog.completions).filter((c) => !foundations.includes(c) && c !== CH.code && !/^CTSELEC/.test(c)).slice(0, 5);
    priorCourses(code, [...foundations, ...electives], 'cert');
    await phone.page.goto('/CTSCertificateOfMinistry.html');
    await expect(phone.page.locator('#certCard'), 'the diploma is shown').toBeVisible();
    const st = await phone.page.evaluate(() => window.CTSDegrees.status('certificate'));
    expect(st, 'twelve courses, nothing missing').toMatchObject({ count: 12, earned: true });
    expect((await record(code)).degrees, 'the Worker agrees').toMatchObject({ certificate: true });
  });

  await test.step('and the course certificate, with the student\'s name', async () => {
    await phone.page.goto('/CTSCHCertificate.html');
    await expect(phone.page.locator('#cert-section'), 'the certificate is shown').toBeVisible();
    await expect(phone.page.locator('#cert-name')).toHaveText(who.name);
    await expect(phone.page.locator('#partial-msg')).toBeHidden();
  });
});

/* KNOWN BUG, found by this suite on 10 Nov 2026. The course certificate pages
 * decide once, as they open, from this browser's lists. On a device that is
 * behind, the record arrives a moment later (cts-sync.js fills in every unit)
 * but the page goes on showing "units still to do" until the student reloads.
 * The degree pages had the same fault and were fixed in #310.
 *
 * test.fail(): this test is expected to fail while the bug stands, so the
 * suite stays green -- and it turns red the day the bug is fixed, so the
 * marker cannot be forgotten. Remove test.fail() then.
 */
test('a device that is behind shows a finished course\'s certificate without a reload', async ({ device, students }) => {
  test.fail(true, 'known bug: course certificate pages do not look again when the record arrives (see the comment above)');
  const laptop = await device('laptop');
  const phone = await device('phone', { viewport: PHONE });
  const code = await signUp(laptop.page, { ...person('Behind Cert'), track: 'cert' });
  students.push(code);
  await restoreWithCode(phone.page, code);
  // The course is finished elsewhere after the phone was restored.
  priorUnits(code, CH.course, Array.from({ length: CH.units }, (_, i) => i + 1));
  priorCourses(code, [CH.code], 'cert');
  await phone.page.goto('/CTSCHCertificate.html');
  await expect.poll(() => lsJson(phone.page, 'cts_ch_progress', {}), { message: 'the record reached the phone' })
    .toMatchObject({ unit1: true, [`unit${CH.units}`]: true });
  await expect(phone.page.locator('#cert-section'), 'the certificate is shown without a reload').toBeVisible({ timeout: 10_000 });
});
