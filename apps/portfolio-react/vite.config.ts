import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/zxyzx-me-lab/preview/m01-react/',
  build: { outDir: 'dist', emptyOutDir: true },
  test: { include: ['src/**/*.test.ts'] }
});
