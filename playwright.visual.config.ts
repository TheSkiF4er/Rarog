import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "tests/visual-report", open: "never" }]],
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:4175",
    trace: "on-first-retry",
    viewport: { width: 1440, height: 1600 },
    colorScheme: "dark"
  },
  webServer: {
    command: "node tools/visual-dev.mjs --port 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: undefined,
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium"
        }
      }
    }
  ]
});
