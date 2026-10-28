#!/usr/bin/env node
/**
 * M01 V3 fixed visual review: capture ONLY 1920x1080 desktop.
 * Each source revision gets its own immutable screenshot plus a latest image.
 */
const fs=require("node:fs");
const path=require("node:path");
const {execFileSync}=require("node:child_process");
const project=path.resolve(__dirname,"../..");
const review=path.join(project,"review/m01");
const sourceFile="experiments/m01-v3-art-motion/index.html";
const commitValue=(format)=>execFileSync("git",["log","-1","--format="+format,"--",sourceFile],{cwd:project,encoding:"utf8"}).trim();
const sha=commitValue("%h");
const date=commitValue("%cI");
const message=commitValue("%s");
const url=process.env.CAPTURE_BASE_URL||"http://127.0.0.1:8765/experiments/m01-v3-art-motion/";
const chromium=process.env.CHROME_BIN||["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"].find(fs.existsSync);
if(!chromium)throw Error("Chrome/Chromium executable not found; set CHROME_BIN.");
// CI screenshots must have real Chinese glyphs, never tofu squares.
if(process.env.REQUIRE_CJK_FONT==="1") {
  const matched=execFileSync("fc-match",["-f","%{family}|%{file}","Noto Sans CJK SC:lang=zh-cn"],{encoding:"utf8"}).trim();
  if(!matched.includes("Noto Sans CJK"))throw Error("Missing Chinese Noto CJK font: "+matched);
  console.log("Validated Chinese screenshot font:",matched);
}
const puppeteer=require(process.env.PUPPETEER_PATH||"puppeteer-core");
(async()=>{
  const browser=await puppeteer.launch({headless:true,executablePath:chromium,args:["--no-sandbox","--disable-dev-shm-usage","--hide-scrollbars"]});
  try {
    const page=await browser.newPage();
    await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    const result=await page.goto(url,{waitUntil:"networkidle2",timeout:45000});
    if(!result||result.status()!==200)throw Error("Hero preview did not respond HTTP 200.");
    await page.waitForFunction(()=>{
      const hero=document.querySelector("zxyzx-home-hero-v3art");
      return hero?.shadowRoot?.querySelector("img")?.naturalWidth>0;
    },{timeout:30000});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      window.scrollTo({top:0,behavior:"instant"});
    });
    await new Promise(resolve=>setTimeout(resolve,2200));
    const state=await page.evaluate(()=>({y:scrollY,title:document.title,overflow:document.documentElement.scrollWidth>innerWidth}));
    if(state.overflow||errors.length)throw Error("Screenshot browser check failed: "+JSON.stringify({state,errors}));
    const dir=path.join(review,"versions");
    fs.mkdirSync(dir,{recursive:true});
    const imagePath=path.join(dir,sha+".jpg");
    await page.screenshot({path:imagePath,type:"jpeg",quality:88,fullPage:false});
    fs.copyFileSync(imagePath,path.join(review,"latest.jpg"));
    const manifest=path.join(review,"history.json");
    const doc=fs.existsSync(manifest)?JSON.parse(fs.readFileSync(manifest,"utf8")):{schemaVersion:1,viewport:{width:1920,height:1080},versions:[]};
    doc.viewport={width:1920,height:1080};
    const entry={sha,date,capturedAt:new Date().toISOString(),file:"versions/"+sha+".jpg",message};
    doc.versions=[entry,...(doc.versions||[]).filter(v=>v.sha!==sha)];
    fs.writeFileSync(manifest,JSON.stringify(doc,null,2)+"\n");
    console.log(JSON.stringify({sha,date,message,dimensions:[1920,1080],image:imagePath,versions:doc.versions.length,browserTitle:state.title}));
    await page.close();
  } finally {
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1});
