import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("V3 hero is one viewport, not long sticky scrub",()=>{
  assert.match(html,/:host\{--p:0;--px:0;--py:0;display:block;height:100svh;min-height:0/);
  assert.doesNotMatch(html,/height:170svh/);
  assert.doesNotMatch(html,/position:sticky;isolation:isolate;top:0/);
  assert.match(html,/const bounds=this\.getBoundingClientRect\(\), distance=Math\.max\(1,innerHeight\)/);
});
test("direct wheel, touch and keyboard flipping",()=>{
  assert.doesNotMatch(html,/scroll-snap-type:y mandatory/);
  assert.match(html,/addEventListener\('keydown',this\._key\)/);
  assert.match(html,/addEventListener\('wheel',this\._wheel,\{passive:false\}\)/);
  assert.match(html,/addEventListener\('touchstart',this\._touchStart,\{passive:true\}\)/);
  assert.match(html,/addEventListener\('touchend',this\._touchEnd,\{passive:true\}\)/);
  assert.match(html,/Math\.abs\(dy\)<55/);
});
test("preserves visual and has accessible links and reduced motion",()=>{
  assert.match(html,/忠心于中心/);
  assert.match(html,/向内寻找/);
  assert.match(html,/向外探寻/);
  assert.match(html,/href="#world"/);
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.match(html,/class="skip"/);
});
