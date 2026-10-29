import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanPath, cleanSlug, isAllowedHost, publicProps, safeProps } from '../src/core.js';
test('paths exclude query and fragments', () => {
 assert.equal(cleanPath('/about/?email=test@example.com#secret'), '/about/');
 assert.equal(cleanPath('https://invalid'), '/');
});
test('production allowlist is exact and preview is blocked', () => {
 assert.equal(isAllowedHost('ai.zxyzx.me', 'production', ['ai.zxyzx.me']), true);
 assert.equal(isAllowedHost('evil-ai.zxyzx.me','production',['ai.zxyzx.me']), false);
 assert.equal(isAllowedHost('ai.zxyzx.me','preview',['ai.zxyzx.me']), false);
});
test('only safe event fields are stored', () => {
 assert.deepEqual(safeProps({section_id:'M01 Home', target_id:'ABOUT', email:'user@example.com', duration_ms:999999999}), {section_id:'m01-home',target_id:'about',duration_ms:3600000});
});
test('event scope is safe and stable', () => {
 const p = publicProps({ siteId:'Personal' },{location:{hostname:'zxyzx.me',pathname:'/work/'}});
 assert.equal(p.site_id,'personal');
 assert.equal(p.pathname,'/work/');
 assert.equal(p.environment,'production');
 assert.equal(cleanSlug('M01 - Poster'),'m01-poster');
});
