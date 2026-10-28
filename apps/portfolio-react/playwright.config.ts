import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4180/zxyzx-me-lab/preview/m01-react/', trace: 'retain-on-failure' },
  projects: [{
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], browserName:'chromium',
      launchOptions: process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH, args:['--no-sandbox'] }
        : { args:['--no-sandbox'] } }
  }],
  webServer: { command: 'pnpm run preview -- --port 4180',
    url:'http://127.0.0.1:4180/zxyzx-me-lab/preview/m01-react/',
    reuseExistingServer: !process.env.CI,timeout:60_000 }
});
