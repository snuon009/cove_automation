import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',

  // Increase per-test maximum (ms) — here 10 minutes
  timeout: 10 * 60 * 1000, // 10 minutes per test

  // Default expect timeout for assertions
  expect: {
    timeout: 30 * 1000, // 30 seconds
  },

  fullyParallel: false,
  retries: 0,
  workers: 1,

  // Allure reporter setup
  reporter: [
    ["line"],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
      },
    ],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],
  },

  /* Projects for different user types */
  projects: [
    {
      name: 'owner',
      testMatch: /.*\event_schedule\.spec\.ts/,
      use: {
        storageState: './storageStates/storageState.owner.json',
      },
    },
    {
      name: 'public',
      testMatch: /.*(login|register)\.spec\.ts/,
      use: {
        storageState: undefined,
      },
    },
  ],

  /* Optional: Web server before tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});