import { Page } from "@playwright/test";

export class AccountPage {
  readonly heading = this.page.getByRole("heading", {
    name: "Tidak ada satupun pertanyaan",
  });
  readonly playwrightSolutionsPhoto = this.page.getByAltText(
    "Playwright Solutions"
  );
  readonly publicLinkBox = this.page.getByRole("heading", {
    name: "Laman Publik",
  });

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/account");
  }
}
