/* A student moves up to the Master of Divinity on one device; an old device
 * that still says "Certificate" must not move them back down.
 *
 * Before #301 the track on the record changed on every routine save from any
 * device (last writer wins). An old phone that still said Certificate demoted
 * master's students, whose next exams were then graded, and their courses
 * recorded, at Certificate level (#298, #292, #239, #183; 14 students in
 * production). Since #301 only a deliberate change (the "Change track" menu,
 * the sign-up form) changes the track, and a browser adopts the record's.
 *
 * test/track-explicit-change.test.mjs checks that rule at the API. This is the
 * same story told through the screens, on two devices, through to an exam.
 */
import { test, expect } from './fixtures.mjs';
import { record, person } from './lib/site.mjs';
import { signUp, restoreWithCode, changeTrack, takeUnit, openExam, expectUnitPassed, ls, PASSED } from './lib/student.mjs';

const CH = { pages: 'CTSCH', prefix: 'CTSCH', course: 'ch' };
const sitting = (page) => page.evaluate(() => {
  const S = window.CTS_ENGINE?.live?.()?.S;
  return S && { track: S.track, sa: !!(S.needs && S.needs.sa) };
});

test('an old device adopts the track chosen on another, and grades at that level', async ({ device, students }) => {
  const laptop = await device('laptop');
  const oldPhone = await device('old phone', { viewport: { width: 390, height: 844 } });
  const who = person('Track');
  let code;

  await test.step('signs up for the Certificate, and the phone is restored while it is still Certificate', async () => {
    code = await signUp(laptop.page, { ...who, track: 'cert' });
    students.push(code);
    await restoreWithCode(oldPhone.page, code);
    expect(await ls(oldPhone.page, 'cts_track')).toBe('cert');
  });

  await test.step('chooses the Master of Divinity from the "Change track" menu on the laptop', async () => {
    await laptop.page.goto('/CTSCHUnit1.html');
    await changeTrack(laptop.page, 'mdiv');
    expect((await record(code)).student.track, 'the record has the new track').toBe('mdiv');
  });

  await test.step('the old phone, still saying Certificate, opens an exam: it takes the record\'s track', async () => {
    await openExam(oldPhone.page, { ...CH, n: 1 });
    await expect.poll(() => sitting(oldPhone.page), { message: 'the Worker grades this sitting at the M.Div. level, short answers counting' })
      .toEqual({ track: 'mdiv', sa: true });
    await expect.poll(() => ls(oldPhone.page, 'cts_track'), { message: 'the phone now says M.Div. too' }).toBe('mdiv');
    expect((await record(code)).student.track, 'and its routine save did not move the record back').toBe('mdiv');
  });

  await test.step('passes the unit on the old phone, at the M.Div. level', async () => {
    await takeUnit(oldPhone.page, { ...CH, n: 1, sa: Array(10).fill('[[met]]') });
    await expect(oldPhone.page.locator('body')).toContainText(PASSED, { timeout: 60_000 });
    await expectUnitPassed(oldPhone.page, CH.course, 1);
    expect((await record(code)).student.track, 'the record is still M.Div. after the exam').toBe('mdiv');
  });

  await test.step('the laptop, reopened later, is still M.Div. and has the unit', async () => {
    await laptop.page.goto('/CTSCHUnit2.html');
    await expect.poll(() => ls(laptop.page, 'cts_track')).toBe('mdiv');
    await expectUnitPassed(laptop.page, CH.course, 1);
  });
});

test('moving down is a choice too: Certificate chosen on the laptop reaches the phone', async ({ device, students }) => {
  const laptop = await device('laptop');
  const phone = await device('phone');
  const code = await signUp(laptop.page, { ...person('Track Down'), track: 'thm' });
  students.push(code);
  await restoreWithCode(phone.page, code);
  expect(await ls(phone.page, 'cts_track')).toBe('thm');

  await laptop.page.goto('/CTSCHUnit1.html');
  await changeTrack(laptop.page, 'cert');
  expect((await record(code)).student.track).toBe('cert');

  await openExam(phone.page, { ...CH, n: 1 });
  await expect.poll(() => sitting(phone.page), { message: 'the Worker grades at Certificate level, short answers not counting' })
    .toEqual({ track: 'cert', sa: false });
  expect((await record(code)).student.track, 'the phone did not move the record back up').toBe('cert');
});
