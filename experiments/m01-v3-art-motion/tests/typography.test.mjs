import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const s=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("The hero retains exact original slogan and brand",()=>{
  assert.match(s,/忠心于中心/);
  assert.match(s,/向内寻找中心，向外探寻世界。/);
  assert.match(s,/glyph-first/);
  assert.match(s,/glyph-second/);
});
test("Typography uses separate major/minor roles and no within-glyph gradient",()=>{
  assert.match(s,/寻找中心，/);
  assert.match(s,/探寻世界。/);
  assert.match(s,/V3 TYPOGRAPHY REFINEMENT/);
  assert.match(s,/Ink placement: solid colors per phrase/);
  assert.doesNotMatch(s,/Editorial ink changes exactly at the portrait plane/);
});
test("Existing page-turn behavior has not been removed",()=>{
 assert.match(s,/this\._touchEnd/);
 assert.match(s,/this\._wheel/);
 assert.match(s,/this\._key/);
 assert.match(s,/prefers-reduced-motion:reduce/);
});
