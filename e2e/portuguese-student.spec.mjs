/* Portuguese preference and earned foundation-unit credit survive a new device.
 * This is a service regression, not acceptance of the unfinished full course.
 */
import {test, expect} from './fixtures.mjs';
import {record, person} from './lib/site.mjs';
import {signUp, restoreWithCode, takeUnit, openExam, expectUnitPassed, ls, lsJson} from './lib/student.mjs';

test('Portuguese enrollment, foundation unit and restore retain language and credit', async ({device, students}) => {
  const laptop = await device('Portuguese laptop');
  const phone = await device('Portuguese phone', {viewport: {width: 390, height: 844}});
  const who = person('Portugues');
  const code = await signUp(laptop.page, {...who, track: 'assoc', lang: 'pt', country: 'BR'});
  students.push(code);
  expect((await record(code)).student).toMatchObject({lang: 'pt', track: 'cert', goal: 'assoc'});
  const course = {pages: 'CTS', prefix: 'CTS', course: 'ots'};
  await laptop.page.goto('/pt/CTSUnit1.html?cts_lang=pt');
  await laptop.page.locator('#cts-show-source').check();
  await expect(laptop.page.locator('body')).toHaveAttribute('data-show-source', 'true');
  await laptop.page.locator('#cts-show-source').uncheck();
  await takeUnit(laptop.page, {...course, n: 1, lang: 'pt'});
  await expectUnitPassed(laptop.page, 'ots', 1);
  await expect(laptop.page.locator('html')).toHaveAttribute('lang', 'pt');
  await restoreWithCode(phone.page, code, {lang: 'pt'});
  expect(await ls(phone.page, 'cts_lang')).toBe('pt');
  expect(await lsJson(phone.page, 'cts_student')).toMatchObject({name: who.name, goal: 'assoc'});
  await openExam(phone.page, {...course, n: 1, lang: 'pt'});
  await expectUnitPassed(phone.page, 'ots', 1);
  await expect(phone.page.locator('html')).toHaveAttribute('lang', 'pt');
});
