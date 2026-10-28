import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const viewports = [
  {width:1672,height:941}, {width:1440,height:900},
  {width:768,height:1024}, {width:390,height:844}, {width:320,height:680}
];
mkdirSync('visual/artifacts',{recursive:true});
for(const vp of viewports){
  test('M01 layout and assets '+vp.width+'x'+vp.height,async ({page})=>{
    await page.setViewportSize(vp);
    const errors:string[] = [];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
    await page.goto('?static=1',{waitUntil:'networkidle'});
    await page.locator('.photo-frame img').evaluate((img:HTMLImageElement)=>img.decode());
    await page.screenshot({path:'visual/artifacts/m01-'+vp.width+'x'+vp.height+'.png'});
    expect(errors).toEqual([]);
    expect(await page.getByRole('heading',{name:'向内寻找中心，向外探寻世界。'}).count()).toBe(1);
    expect(await page.locator('.poster-title .t').count()).toBe(6);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    expect(overflow).toBe(false);
    const photo=await page.locator('.photo-frame img').evaluate((img:HTMLImageElement)=>[img.naturalWidth,img.naturalHeight]);
    expect(photo[0]).toBeGreaterThan(1000);
    expect(await page.locator('section.scene').evaluate((s)=>Math.abs(s.getBoundingClientRect().height-innerHeight))).toBeLessThan(3);
    if(vp.width===1672)expect(await page.locator('.poster-artboard').evaluate(e=>Math.round(e.getBoundingClientRect().width))).toBe(1672);
  });
}
test('one wheel impulse moves forward and backward', async ({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('?static=1');
  await page.mouse.wheel(0,82);
  await expect.poll(()=>page.evaluate(()=>Math.round(window.scrollY)),{timeout:2500}).toBeGreaterThan(600);
  await page.waitForTimeout(830);
  await page.mouse.wheel(0,-110);
  await expect.poll(()=>page.evaluate(()=>Math.round(window.scrollY)),{timeout:2500}).toBeLessThan(10);
});
test('keyboard and pointer-friendly anchor operate',async ({page})=>{
  await page.goto('?static=1');
  await page.keyboard.press('PageDown');
  await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:2500}).toBeGreaterThan(600);
  await page.waitForTimeout(830);
  await page.keyboard.press('PageUp');
  await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:2500}).toBeLessThan(10);
  await page.getByRole('link',{name:'跳过首页开场'}).focus();
  await page.keyboard.press('Enter');
  await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:2500}).toBeGreaterThan(600);
});
test('touch swipe advances one page',async ({browser})=>{
  const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await ctx.newPage();
  await page.goto('?static=1');
  await page.evaluate(()=>{
    const a=new Touch({identifier:1,target:document.body,clientX:130,clientY:580});
    const b=new Touch({identifier:1,target:document.body,clientX:130,clientY:390});
    dispatchEvent(new TouchEvent('touchstart',{touches:[a],bubbles:true}));
    dispatchEvent(new TouchEvent('touchend',{changedTouches:[b],bubbles:true}));
  });
  await expect.poll(()=>page.evaluate(()=>scrollY),{timeout:2500}).toBeGreaterThan(500);
  await ctx.close();
});
