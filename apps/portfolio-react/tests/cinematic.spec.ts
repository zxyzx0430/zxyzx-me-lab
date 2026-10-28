import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const evidence = 'visual/motion-evidence';
mkdirSync(evidence, { recursive: true });
test.describe('BEYOND THE FRAME real-browser motion', () => {
  test('entrance has progressive stages and restores complete poster', async ({ page }) => {
    await page.setViewportSize({ width: 1672, height: 941 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('');
    await page.screenshot({ path: evidence + '/01-paper.png' });
    await page.waitForTimeout(1150);
    await page.screenshot({ path: evidence + '/02-ink-and-tracks.png' });
    await page.waitForTimeout(1180);
    await page.screenshot({ path: evidence + '/03-portrait.png' });
    await expect(page.locator('#top')).toHaveAttribute('data-intro', 'complete', { timeout: 3500 });
    await page.screenshot({ path: evidence + '/04-complete.png' });
    expect(errors).toEqual([]);
    for (const selector of ['.word-into', '.word-out', '.word-world', '.photo-frame']) {
      const opacity = await page.locator(selector).evaluate(el => getComputedStyle(el).opacity);
      expect(opacity).toBe('1');
    }
  });

  test('one wheel gesture: track journey, blackout, next scene, rewind, no locks', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('');
    await page.mouse.wheel(0, 100);
    await expect(page.locator('#top')).toHaveAttribute('data-intro', 'complete');
    const peakBlack = await page.evaluate(() => new Promise<number>(resolve => {
      const layer = document.querySelector<HTMLElement>('.cinema-blackout')!;
      let maxOpacity = 0;
      const begin = performance.now();
      const sample = () => {
        maxOpacity = Math.max(maxOpacity, Number(getComputedStyle(layer).opacity));
        if (performance.now() - begin >= 1550) resolve(maxOpacity);
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    }));
    expect(peakBlack).toBeGreaterThan(.6);
    await page.screenshot({ path: evidence + '/06-blackout-and-next.png' });
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeGreaterThan(600);
    await page.waitForTimeout(650);
    await page.screenshot({ path: evidence + '/07-next-scene.png' });
    await page.mouse.wheel(0, -110);
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeLessThan(10);
    await page.waitForTimeout(1150);
    await page.screenshot({ path: evidence + '/08-return.png' });
    expect(await page.locator('.cinema-stage').evaluate(el => getComputedStyle(el).transform)).toBe('none');
    expect(await page.locator('.word-into').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    expect(errors).toEqual([]);
  });

  test('keyboard can skip intro, reverse, repeat without getting stuck', async ({ page }) => {
    await page.goto('');
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeGreaterThan(500);
    await page.waitForTimeout(850);
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeLessThan(10);
    await page.waitForTimeout(950);
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeGreaterThan(500);
  });

  test('mobile swipe forward and back; static disables all cinematic motion', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto('');
    const swipe = async (direction: 1 | -1) => page.evaluate((dir) => {
      const a = new Touch({ identifier: 1, target: document.body, clientX: 165, clientY: dir === 1 ? 620 : 250 });
      const b = new Touch({ identifier: 1, target: document.body, clientX: 165, clientY: dir === 1 ? 350 : 550 });
      dispatchEvent(new TouchEvent('touchstart', { touches: [a], bubbles: true }));
      dispatchEvent(new TouchEvent('touchend', { changedTouches: [b], bubbles: true }));
    }, direction);
    await swipe(1);
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeGreaterThan(500);
    await page.waitForTimeout(850);
    await page.screenshot({ path: evidence + '/09-mobile-next.png' });
    await swipe(-1);
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3500 }).toBeLessThan(10);
    await page.waitForTimeout(900);
    await page.screenshot({ path: evidence + '/10-mobile-return.png' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.goto('?static=1');
    await expect(page.locator('#top')).not.toHaveAttribute('data-intro', 'running');
    await page.screenshot({ path: evidence + '/11-static-mobile.png' });
    await ctx.close();
  });

  test('reduced motion bypasses camera and remains navigable', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 2000 }).toBeGreaterThan(500);
    await page.keyboard.press('PageUp');
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 2000 }).toBeLessThan(10);
    expect(await page.locator('.cinema-stage').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  });
});
