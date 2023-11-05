import { test, expect } from "@playwright/test";
import { sendDataToIndexedDB } from "../lib/helpers/indexedDB";
import { AccountPage } from "../lib/pages/accountPage";

test.describe("Describe Test", () => {
  test.beforeEach(async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.goto();
    await sendDataToIndexedDB(page);
  });

  test("test", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.goto();

    await accountPage.heading.click();
    await expect(accountPage.publicLinkBox).toBeVisible();
    await expect(accountPage.playwrightSolutionsPhoto).toBeVisible();
  });
});
