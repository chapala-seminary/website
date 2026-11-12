/* A Spanish-speaking student, from sign-up to a second device, in Spanish.
 *
 * Most students who reach the seminary from Latin America study in Spanish.
 * The language a student studies in is part of the record (students.lang): it
 * decides the language of the emails and of the pages a restored device opens.
 * The answers here are the Spanish keys, typed on the Spanish pages.
 */
import { test, expect } from './fixtures.mjs';
import { record, person } from './lib/site.mjs';
import { signUp, restoreWithCode, takeUnit, openExam, expectUnitPassed, lsJson, PASSED } from './lib/student.mjs';

const CH = { pages: 'CTSCH', prefix: 'CTSCH', course: 'ch' };

test('un estudiante se inscribe, aprueba una unidad y la recupera en otro dispositivo, en español', async ({ device, students }) => {
  const laptop = await device('laptop');
  const phone = await device('phone', { viewport: { width: 390, height: 844 } });
  const who = person('Espanol');
  let code;

  await test.step('signs up on the Spanish front page', async () => {
    code = await signUp(laptop.page, { ...who, track: 'assoc', lang: 'es' });
    students.push(code);
    const r = await record(code);
    expect(r.student, 'the record holds Spanish as the language of study, and the Associate goal').toMatchObject({ lang: 'es', track: 'cert', goal: 'assoc' });
  });

  await test.step('passes unit 1 on the Spanish page, answering in Spanish', async () => {
    await takeUnit(laptop.page, { ...CH, n: 1, lang: 'es' });
    await expect(laptop.page.locator('body')).toContainText(PASSED);
    await expectUnitPassed(laptop.page, CH.course, 1);
    await expect(laptop.page.locator('html')).toHaveAttribute('lang', /^es/);
  });

  await test.step('restores the phone from the Spanish backup page', async () => {
    await restoreWithCode(phone.page, code, { lang: 'es' });
    await expect(phone.page.locator('#code-note')).toContainText('Restaurado');
    expect(await lsJson(phone.page, 'cts_student'), 'the phone knows the student and the goal').toMatchObject({ name: who.name, goal: 'assoc' });
  });

  await test.step('the phone shows the passed unit, in Spanish', async () => {
    await openExam(phone.page, { ...CH, n: 1, lang: 'es' });
    await expect(phone.page.locator('body')).toContainText(PASSED);
    await expectUnitPassed(phone.page, CH.course, 1);
  });
});
