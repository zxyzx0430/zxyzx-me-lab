import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4173/zxyzx-me-lab/preview/m01-react/', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], browserName: 'chromium', launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] } } }],
  webServer: { command: 'npm run dev -- --port 4173', url: 'http://127.0.0.1:4173/zxyzx-me-lab/preview/m01-react/', reuseExistingServer: !process.env.CI, timeout: 60_000 }
});
