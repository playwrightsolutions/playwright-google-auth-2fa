// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import { chromium } from "playwright-extra";
import SessionPlugin from "puppeteer-extra-plugin-session";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import * as OTPAuth from "otpauth";

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
const setupVideoDirectory = "./test-results/global-setup";
const setupTracesArchivePath = "./test-results/global-setup/traces.zip";

// Add the plugin to playwright
chromium.use(StealthPlugin()).use(SessionPlugin());

let totpObject = {
  issuer: "Google",
  label: "playwrightsolutions%40gmail.com",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: process.env.GOOGLE_OTP_SECRET,
};

async function globalSetup(): Promise<void> {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  try {
    await context.tracing.start({
      sources: true,
      snapshots: true,
      screenshots: true,
    });

    const email = process.env.GOOGLE_EMAIL;
    const password = process.env.GOOGLE_PASSWORD;
    const baseURL = process.env.BASE_URL;

    await page.goto(`${baseURL}/login`);

    // Google Popup
    const page1Promise = page.waitForEvent("popup");
    await page
      .getByRole("button", { name: "Lanjutkan dengan Akun Google" })
      .click();
    const page1 = await page1Promise;

    // Logging in through Google Popup
    await page1.getByLabel("Email or phone").click();
    await page1.getByLabel("Email or phone").fill(email);
    await page1.getByRole("button", { name: "Next" }).click();
    await page1.getByLabel("Enter your password").fill(password);
    await page1
      .locator("#passwordNext")
      .getByRole("button", { name: "Next" })
      .click();

    const twoFACode = get2FA(totpObject);
    await page1.getByLabel("Enter code").fill(twoFACode);

    await page1
      .locator("#totpNext")
      .getByRole("button", { name: "Next" })
      .click();

    await page
      .getByRole("heading", { name: "Tidak ada satupun pertanyaan" })
      .click();
  } catch (error) {
    await context.tracing.stop({ path: setupTracesArchivePath });
    throw error;
  }

  await browser.close();
}

function get2FA(totpObject) {
  let totp = new OTPAuth.TOTP(totpObject);
  let token = totp.generate();

  return token;
}
export default globalSetup;
