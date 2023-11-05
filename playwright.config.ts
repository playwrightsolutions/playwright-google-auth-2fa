import { PlaywrightTestConfig, defineConfig, devices } from "@playwright/test";
import "dotenv/config";

require("dotenv").config();

export default defineConfig({
  timeout: 20_000,
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      fullyParallel: true,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "ui-tests",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            "--no-sandbox-and-elevated",
            "--disable-translate",
            "--allow-file-access-from-files",
            "--mute-audio",
            "--disable-dev-shm-usage",
            "--autoplay-policy=no-user-gesture-required",
            "--disable-gpu",
            "--disable-sync",
            "--no-first-run",
            "--ignore-certificate-errors",
            "--disable-web-security",
          ],
        },
      },
    },
  ],
  testDir: "./tests",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    headless: false,
    baseURL: process.env.BASE_URL || "https://www.tanyaaja.in",
    trace: "on",
  },
});

// I have this commented out but I'm leaving it here for reference, using this you could use playwright-extra's for extra functionality (using google to login rather than firefox)
// const config: PlaywrightTestConfig = {
//   globalSetup: process.env.SKIP_AUTH ? "" : "./lib/globalSetup",
//   fullyParallel: false,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : undefined,
//   reporter: "html",
//   testDir: "./tests",
//   timeout: 30 * 1000,
//   expect: {
//     timeout: 10000,
//   },

//   use: {
//     actionTimeout: 10 * 1000,
//     navigationTimeout: 30 * 1000,
//     baseURL: process.env.BASE_URL,
//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: "retain-on-failure",
//     video: "retain-on-failure",
//     screenshot: "only-on-failure",
//     viewport: { width: 1280, height: 720 },
//     headless: false,
//   },
//   projects: [
//     {
//       name: "chromium",
//       use: {
//         ...devices["Desktop Chrome"],
//       },
//     },

//     // {
//     //   name: "firefox",
//     //   use: { ...devices["Desktop Firefox"] },
//     // },
//   ],
// };
// export default config;
