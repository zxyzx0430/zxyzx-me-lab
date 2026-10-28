import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const image=statSync(new URL('../assets/portrait-gaze-hd.webp',import.meta.url));
test('independent approved portrait asset is full resolution',()=>{
 assert.ok(image.size>100000);
 assert.match(html,/assets\/portrait-gaze-hd\.webp/);
 assert.doesNotMatch(html,/data:image\/webp;base64,UklG/);
});
test('poster has every slogan segment as real text and brand',()=>{
 for(const line of ['向内','寻找','中心，','向外','探寻','世界。','忠心于中心'])assert.ok(html.includes(line));
 assert.match(html,/<h1 class="sr-only">向内寻找中心，向外探寻世界。<\/h1>/);
 assert.match(html,/poster-artboard/);
 assert.match(html,/poster-title/);
});
test('scroll and keyboard/touch interaction preserved',()=>{
 assert.match(html,/this\._wheel/);assert.match(html,/this\._key/);
 assert.match(html,/this\._touchEnd/);
 assert.match(html,/prefers-reduced-motion:reduce/);
});
