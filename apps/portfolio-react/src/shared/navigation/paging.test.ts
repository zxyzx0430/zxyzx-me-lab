import { describe,it,expect } from 'vitest';
import { normalizedWheel, swipeDirection } from './paging';
describe('paging gesture thresholds', () => {
  it('translates line and page mouse units', () => {expect(normalizedWheel(2,1,900)).toBe(32);expect(normalizedWheel(1,2,900)).toBe(900);});
  it('separates intentional vertical swipe from small gestures', () => {
    expect(swipeDirection(90,10)).toBe(1);expect(swipeDirection(-90,5)).toBe(-1);
    expect(swipeDirection(30,1)).toBe(0);expect(swipeDirection(90,90)).toBe(0);
  });
});
