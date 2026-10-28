import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const manifest=JSON.parse(read("module.json"));
test("M01 draft is not falsely approved",()=>{
 assert.equal(manifest.id,"home-hero");
 assert.equal(manifest.status,"draft");
 assert.equal(manifest.approvedTag,null);
});
test("M01 is independent of V4 homepage and knowledge V5",()=>{
 const code=read("module.js");
 assert.match(code,/customElements\.define\("zxyzx-home-hero"/);
 assert.match(code,/attachShadow/);
 assert.match(code,/import\.meta\.url/);
 assert.doesNotMatch(code,/network-v5|experiments\/|document\.body\.style|document\.documentElement\.style/);
});
test("M01 preview has honest M02 boundary and correct brand",()=>{
 const html=read("index.html");
 assert.match(html,/忠心于中心/);
 assert.match(html,/M02 HAS NOT BEEN DESIGNED OR INTEGRATED/);
 assert.doesNotMatch(html,/ZXYZX®/);
});
test("portrait resource is present and not tiny in bytes",()=>{
 const stat=fs.statSync(path.join(root,"assets/portrait-cinematic-enhanced.webp"));
 assert.ok(stat.size>=2000,stat.size);
});
test("reduced-motion and media layout are declared",()=>{
 const css=read("module.css");
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/max-width:640px/);
});
