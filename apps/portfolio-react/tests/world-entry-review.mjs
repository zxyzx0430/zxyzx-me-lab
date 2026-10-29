import { chromium } from '@playwright/test';
import fs from 'node:fs';
const out='/tmp/m01-stage2-review';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const errors=[];
async function shoot(name,mode='desktop'){
 const page=await browser.newPage({viewport:mode==='mobile'?{width:390,height:844}:{width:1440,height:810},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(name+': '+e.message));
 await page.goto('http://127.0.0.1:5173/zxyzx-me-lab/preview/m01-react/',{waitUntil:'networkidle'});
 await page.evaluate(()=>window.dispatchEvent(new Event('m01:intro-skip')));
 await page.waitForTimeout(140);
 await page.screenshot({path:out+'/'+name+'-home.png'});
 const choose=name.includes('beyond')?'beyond':'within';
 await page.getByRole('button',{name:choose==='within'?/进入 WITHIN/:/进入 BEYOND/}).click();
 await page.waitForTimeout(420);
 await page.screenshot({path:out+'/'+name+'-042.png'});
 await page.waitForTimeout(500);
 await page.screenshot({path:out+'/'+name+'-092.png'});
 await page.waitForTimeout(450);
 await page.screenshot({path:out+'/'+name+'-final.png'});
 const inspect=await page.evaluate(()=>({
  world:document.querySelector('.m01-root')?.dataset.entryWorld,
  bodyWorld:document.body.dataset.m01World,
  stageTransform:getComputedStyle(document.querySelector('.cinema-stage')).transform,
  activeInspector:!!document.querySelector('.m01-entry-inspector'),
  overflow:document.documentElement.style.overflow,
  width:document.documentElement.scrollWidth,innerWidth:window.innerWidth,
  progress:document.querySelector('.m01-entry-progress input')?.value
 }));
 await page.keyboard.press('Escape');
 await page.waitForTimeout(60);
 const reset=await page.evaluate(()=>({
  world:document.querySelector('.m01-root')?.dataset.entryWorld??null,
  transform:getComputedStyle(document.querySelector('.cinema-stage')).transform,
  inspector:!!document.querySelector('.m01-entry-inspector')
 }));
 await page.close();return {name,inspect,reset};
}
try{
const results=[];
for(const [name,mode] of [['within-desktop','desktop'],['beyond-desktop','desktop'],['within-mobile','mobile'],['beyond-mobile','mobile']])results.push(await shoot(name,mode));
console.log(JSON.stringify({results,errors},null,2));
}finally{await browser.close();}
