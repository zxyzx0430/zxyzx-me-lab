import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, statSync} from "node:fs";
const root=new URL("../",import.meta.url);
const html=readFileSync(new URL("index.html",root),"utf8");
test("two long continuous orbit paths cross typography",()=>{
  assert.match(html,/poster-ink-orbits/);
  assert.match(html,/class="major" d="M -100 444 C/);
  assert.match(html,/class="subtle" d="M -86 743 C/);
  assert.match(html,/mix-blend-mode:difference/);
  assert.match(html,/z-index:7/);
});
test("distressed black ink contains irregular ivory erosion instead of tiled polka dots",()=>{
  const asset=statSync(new URL("assets/ink-erosion.png",root));
  assert.ok(asset.size>12000);
  assert.match(html,/ink-erosion\.png/);
  assert.doesNotMatch(html,/background-image:radial-gradient\(circle,#eeeae1/);
});
test("no changes to photo positioning or page-turn API in markup",()=>{
  assert.match(html,/portrait-gaze-hd\.webp/);
  assert.match(html,/this\._wheel/);
  assert.match(html,/this\._touchEnd/);
  assert.match(html,/prefers-reduced-motion:reduce/);
});
