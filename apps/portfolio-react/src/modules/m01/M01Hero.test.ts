import { describe, it, expect } from 'vitest';
import { artboardScale } from './M01Hero';
describe('poster 1672x941 artboard', () => {
  it('uses pixel parity at the source resolution',()=>expect(artboardScale(1672,941)).toBe(1));
  it('scales uniformly at smaller desktop size',()=>expect(artboardScale(1440,900)).toBeCloseTo(1440/1672));
  it('uses responsive reflow at tablet and mobile',()=>{
    expect(artboardScale(768,1024)).toBe(1); expect(artboardScale(390,844)).toBe(1);
  });
});
