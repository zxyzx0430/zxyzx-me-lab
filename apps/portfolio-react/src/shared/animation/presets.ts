export const cinematic = {
  reveal: { opacity: 0, y: 22, filter: 'blur(8px)', clipPath: 'inset(100% 0 0)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0% 0 0)' },
  staggerSeconds: 0.11,
  ease: 'power3.out'
} as const;
