import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const folder = 'visual/motion-evidence';
mkdirSync(folder, { recursive: true });
// Recording finalization can be slower than interaction checks under shared CPU load.
test.setTimeout(90_000);

test('record real desktop film journey', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: folder, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto('');
  await page.waitForTimeout(4000);
  await page.mouse.move(200, 400);
  await page.mouse.move(1020, 420, { steps: 25 });
  await page.waitForTimeout(550);
  await page.mouse.wheel(0, 95);
  await page.waitForTimeout(1800);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(1650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  const video = page.video()!;
  await page.close();
  await context.close();
  await video.saveAs(folder + '/12-desktop-journey.webm');
});

test('record real mobile touch navigation', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    recordVideo: { dir: folder, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto('');
  await page.waitForTimeout(3800);
  await page.evaluate(() => {
    const start = new Touch({identifier:1,target:document.body,clientX:155,clientY:630});
    const end = new Touch({identifier:1,target:document.body,clientX:155,clientY:320});
    dispatchEvent(new TouchEvent('touchstart',{touches:[start],bubbles:true}));
    dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));
  });
  await page.waitForTimeout(1750);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.evaluate(() => {
    const start = new Touch({identifier:1,target:document.body,clientX:155,clientY:250});
    const end = new Touch({identifier:1,target:document.body,clientX:155,clientY:560});
    dispatchEvent(new TouchEvent('touchstart',{touches:[start],bubbles:true}));
    dispatchEvent(new TouchEvent('touchend',{changedTouches:[end],bubbles:true}));
  });
  await page.waitForTimeout(1650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
  const video = page.video()!;
  await page.close();
  await context.close();
  await video.saveAs(folder + '/13-mobile-touch.webm');
});
