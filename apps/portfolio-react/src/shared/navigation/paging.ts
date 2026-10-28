export function normalizedWheel(deltaY: number, deltaMode: number, height: number): number {
  return deltaY * (deltaMode === 1 ? 16 : deltaMode === 2 ? height : 1);
}
export function swipeDirection(deltaY: number, deltaX: number): -1 | 0 | 1 {
  return Math.abs(deltaY) >= 55 && Math.abs(deltaY) > Math.abs(deltaX) * 1.25 ? (deltaY > 0 ? 1 : -1) : 0;
}
export function isEditable(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('input,textarea,select,[contenteditable="true"],[role="slider"]'));
}
