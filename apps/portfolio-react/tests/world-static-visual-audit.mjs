import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
const out='/tmp/m01-world-static-audit';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const base='http://127.0.0.1:5181/zxyzx-me-lab/preview/m01-react/';
const dims=[[1920,1080],[1536,864],[1440,900],[390,844],[768,1024]];
const report={pages:[],errors:[],static:null};
try {
  for(const world of ['within','beyond']){
    for(const [width,height] of dims){
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('pageerror',e=>report.errors.push(world+width+': '+e.message));
      const response=await page.goto(base+'?world='+world,{waitUntil:'networkidle'});
      const info=await page.evaluate(()=>({
        scene:document.querySelector('.world-canvas')?.getAttribute('aria-label'),
        txt:document.querySelector('.world-word-cut')?.textContent,
        scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth,
        photos:[...document.querySelectorAll('.world-photo')].length,
        svg:document.querySelectorAll('.world-engraving path').length,
        animated:document.getAnimations().length
      }));
      await page.screenshot({path:out+'/'+world+'-'+width+'x'+height+'.png',fullPage:true});
      report.pages.push({world,width,height,status:response.status(),...info});
      if(width===1536){await page.getByRole('link',{name:'BEYOND',exact:true}).click();const next=await page.evaluate(()=>document.querySelector('.world-word-cut')?.textContent);report.pages.at(-1).switchTo=next;}
      await page.close();
    }
  }
  const dims2={width:1440,height:810};
  for(const [name,url] of [['site','https://zxyzx.me/?static=1'],['local',base+'?static=1']]){
    const p=await browser.newPage({viewport:dims2,deviceScaleFactor:1});
    await p.goto(url,{waitUntil:'networkidle'});await p.screenshot({path:out+'/baseline-'+name+'.png'});await p.close();
  }
  const p=PNG.sync.read(fs.readFileSync(out+'/baseline-site.png'));
  const q=PNG.sync.read(fs.readFileSync(out+'/baseline-local.png'));
  report.static={changed:pixelmatch(p.data,q.data,null,p.width,p.height,{threshold:0.1}),total:p.width*p.height};
  console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
function getAnimations(){return [];}
