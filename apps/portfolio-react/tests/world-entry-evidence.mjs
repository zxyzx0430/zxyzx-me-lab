import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync,mkdirSync,copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const dir='/tmp/m01-stage2-review';
mkdirSync(dir,{recursive:true});
const local='http://127.0.0.1:5173/zxyzx-me-lab/preview/m01-react/';
const live='https://zxyzx.me/';
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const errors=[];
try{
 const pages=[];
 for(const [name,url] of [['baseline',live+'?static=1'],['proposed',local+'?static=1']]){
  const page=await browser.newPage({viewport:{width:1440,height:810},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(name+':'+e.message));
  await page.goto(url,{waitUntil:'networkidle'});
  await page.screenshot({path:dir+'/'+name+'-static.png'});
  pages.push(page);
 }
 const p=PNG.sync.read(readFileSync(dir+'/baseline-static.png'));
 const q=PNG.sync.read(readFileSync(dir+'/proposed-static.png'));
 const changed=pixelmatch(p.data,q.data,null,p.width,p.height,{threshold:.1});
 console.log('STATIC_BASELINE='+JSON.stringify({changed,total:p.width*p.height,ratio:(changed/(p.width*p.height)).toFixed(5)}));
 for(const page of pages)await page.close();
 for(const route of ['within','beyond']){
  const context=await browser.newContext({
   viewport:{width:1440,height:810},deviceScaleFactor:1,
   recordVideo:{dir,size:{width:1440,height:810}}
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(route+':'+e.message));
  await page.goto(local,{waitUntil:'networkidle'});
  await page.evaluate(()=>window.dispatchEvent(new Event('m01:intro-skip')));
  await page.waitForTimeout(700);
  await page.getByRole('button',{name:route==='within'?/进入 WITHIN/:/进入 BEYOND/}).click();
  await page.waitForTimeout(1550);
  await page.close();
  const src=await page.video().path();
  const dst=dir+'/'+route+'-browser-recording.mp4';
  const enc=spawnSync('ffmpeg',['-y','-loglevel','error','-sseof','-2.0','-i',src,
    '-t','2.0','-vf','fps=24,scale=1280:-2','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p',dst]);
  console.log('VIDEO '+route+' '+JSON.stringify({exit:enc.status,path:dst,stderr:enc.stderr.toString().slice(0,300)}));
  await context.close();
 }
 console.log('BROWSER_ERRORS='+JSON.stringify(errors));
}finally{await browser.close();}
