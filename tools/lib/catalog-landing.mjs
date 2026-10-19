// Observe navigation and geometry together, after scrolling/layout has settled.
export async function waitForCatalogLanding(page, { timeout = 10000, settleMs = 500 } = {}) {
  await page.waitForLoadState('load');
  return page.evaluate(async ({ timeout, settleMs }) => {
    await document.fonts.ready;
    const deadline = performance.now() + timeout;
    let stableSince = null;
    let previousTop = null;
    let result;
    do {
      const el = document.getElementById('catalog');
      const top = el ? el.getBoundingClientRect().top : null;
      const url = location.pathname + location.hash;
      const valid = url === '/index.html#catalog' && top !== null && Math.abs(top) < 200;
      if (!valid || previousTop === null || Math.abs(top - previousTop) > 1) stableSince = null;
      if (valid && stableSince === null) stableSince = performance.now();
      result = { landed: valid && performance.now() - stableSince >= settleMs, url, top };
      if (result.landed) return result;
      previousTop = top;
      await new Promise(resolve => setTimeout(resolve, 50));
    } while (performance.now() < deadline);
    return result;
  }, { timeout, settleMs });
}
