import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { waitForCatalogLanding } from '../tools/lib/catalog-landing.mjs';

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage();
  await page.route('http://catalog.test/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<div id="catalog" style="position:absolute;top:100px">Courses</div>',
  }));
  await page.goto('http://catalog.test/index.html#catalog');
  await page.evaluate(() => {
    scrollTo(0, 0);
    setTimeout(() => document.getElementById('catalog').style.top = '321px', 100);
    setTimeout(() => document.getElementById('catalog').style.top = '80px', 300);
  });
  const settled = await waitForCatalogLanding(page);
  assert.equal(settled.landed, true);
  assert.equal(settled.top, 80, 'must wait through a late layout shift');

  await page.evaluate(() => document.getElementById('catalog').style.top = '321px');
  assert.equal((await waitForCatalogLanding(page, { timeout: 700 })).landed, false,
    'a catalog that remains outside the original 200px limit must fail');
  await page.goto('http://catalog.test/index.html#wrong');
  assert.equal((await waitForCatalogLanding(page, { timeout: 700 })).landed, false,
    'a wrong anchor must fail even when the catalog is visible');
  await page.evaluate(() => document.getElementById('catalog').remove());
  assert.equal((await waitForCatalogLanding(page, { timeout: 700 })).landed, false,
    'a missing catalog must fail');
  console.log('PASS — catalog landing waits for settled layout and rejects wrong/missing targets.');
} finally {
  await browser.close();
}
