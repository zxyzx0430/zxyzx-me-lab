import assert from 'node:assert/strict';import {test} from 'node:test';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('V3 identity and slogan are preserved',()=>{const s=read('index-modular.html')+read('module.js');assert.match(s,/忠心于中心/);assert.match(s,/向内寻找中心，向外探寻世界。/);});
test('standalone HTML keeps self-contained user portrait',()=>{const s=read('index.html');assert.match(s,/data:image\/webp;base64,/);assert.match(s,/zxyzx-home-hero-v3/);});
test('modular version remains isolated and production-independent',()=>{const s=read('module.js');assert.match(s,/attachShadow/);assert.match(s,/import\.meta\.url/);assert.doesNotMatch(s,/network-v5|document\.body\.style/);});
test('assets and reduced motion',()=>{assert.ok(fs.statSync(path.join(root,'assets/portrait-user-v3.webp')).size>50000);assert.match(read('module.css'),/prefers-reduced-motion/);});
