/* A master's student fails a unit by one short answer, asks for a person to
 * look again from the exam page, and a member of staff overturns the grade
 * from the staff grading screen. The overturn runs the pass rules again; the
 * student, back on the unit page, has passed (docs/ai-grading.md).
 *
 * Three people's screens in one story -- the student's, the staff member's,
 * and the student's again -- which no other test chains: grading-e2e checks
 * that the appeal is sent, staff-grading that the ruling is recorded.
 */
import { test, expect } from './fixtures.mjs';
import { record, person, staffHeaders } from './lib/site.mjs';
import { signUp, takeUnit, openExam, expectUnitPassed, ls, PASSED } from './lib/student.mjs';

const CH = { pages: 'CTSCH', prefix: 'CTSCH', course: 'ch' };

test('a short answer appealed by the student and overturned by staff passes the unit', async ({ device, students }) => {
  const student = await device('student');
  const who = person('Appeal');
  let code;

  await test.step('a Th.M. student fails unit 1: eight of ten short answers meet the standard, nine are needed', async () => {
    code = await signUp(student.page, { ...who, track: 'thm' });
    students.push(code);
    const marks = [...Array(8).fill('[[met]]'), '[[not_met]]', '[[not_met]]'];
    await takeUnit(student.page, { ...CH, n: 1, sa: marks });
    await expect(student.page.locator('body')).toContainText('Not yet', { timeout: 60_000 });
    await expect(student.page.locator('body')).toContainText(/short answer 8\/10, need 9/);
    expect((await record(code)).progress.filter((p) => p.course === 'ch'), 'no credit yet').toEqual([]);
  });

  await test.step('asks for a human review of the ninth answer, from the page', async () => {
    const q = student.page.locator('.question[data-sa="8"]');
    await q.locator('[data-cts-appeal-open]').click();
    const note = q.locator('textarea[data-cts-appeal-note]');
    if (await note.count()) await note.fill('I think my answer does make the main point.');
    await q.locator('[data-cts-appeal-send]').click();
    await expect(student.page.locator('body')).toContainText('Human review requested.');
  });

  await test.step('staff take the appeal and overturn it, on the staff grading screen', async () => {
    const staff = await device('staff', { staffHeaders: staffHeaders() });
    await staff.page.goto('/staff/grading/appeals');
    const card = staff.page.locator('.card').filter({ hasText: who.name });
    await expect(card, 'the appeal is waiting, with the student\'s name').toHaveCount(1);
    await card.getByRole('button', { name: 'Take this appeal' }).click();
    await expect(staff.page.locator('body')).toContainText('You have taken this appeal.');
    const mine = staff.page.locator('.card').filter({ hasText: who.name });
    await mine.locator('input[name="ruling"][value="overturn"]').check();
    await mine.locator('textarea[name="note"]').fill('E2E: the answer makes the point the rubric asks for.');
    await mine.getByRole('button', { name: 'Record my ruling' }).click();
    await expect(staff.page.locator('body')).toContainText('Changed.');
  });

  await test.step('the student, back on the unit, has passed', async () => {
    expect((await record(code)).progress, 'the record has the unit').toContainEqual(expect.objectContaining({ course: 'ch', unit: 1 }));
    await openExam(student.page, { ...CH, n: 1 });
    await expect(student.page.locator('body')).toContainText(PASSED);
    await expectUnitPassed(student.page, CH.course, 1);
    const lock = Number(await ls(student.page, 'cts_ch_u1_sa_lock') || 0);
    expect(lock <= Date.now(), 'and is not left waiting out the failed attempt\'s lock').toBe(true);
  });
});
