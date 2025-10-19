import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',

  // Increase per-test maximum (ms) — here 10 minutes
  timeout: 10 * 60 * 1000,

  // Default expect timeout for assertions
  expect: {
    timeout: 3000 * 1000, // 300s for expect calls (adjust as needed)
  },

  fullyParallel: false,
  //retries: process.env.CI ? 2 : 0,
  retries: 0,
  //workers: process.env.CI ? 1 : undefined,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],


  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    //headless: false,
    viewport: { width: 1280, height: 720 }, // Set default viewport size for consistency
    ignoreHTTPSErrors: true, // Ignore SSL errors if necessary
    permissions: ['geolocation'], // Set necessary permissions for geolocation-based tests
  },

  /* Configure projects for major browsers */
  projects: [{
    name: 'owner',
    testMatch: /.*\event_schedule\.spec\.ts/,
    use: { storageState: './storageStates/storageState.owner.json' },
  },
  {
    name: 'public',
    testMatch: /.*(login|register)\.spec\.ts/,
    use: { storageState: undefined },
  },
    /*
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
      
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
      
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
      */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
