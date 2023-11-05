import { Page } from "@playwright/test";

export class GooglePopUpPage {
  readonly email = this.page.getByLabel("Email or phone");
  readonly emailNext = this.page.getByRole("button", { name: "Next" });
  readonly password = this.page.getByLabel("Enter your password");
  readonly passwordNext = this.page
    .locator("#passwordNext")
    .getByRole("button", { name: "Next" });

  readonly code = this.page.getByLabel("Enter code");
  readonly totpNext = this.page
    .locator("#totpNext")
    .getByRole("button", { name: "Next" });

  constructor(private readonly page: Page) {}

  async login(email, password) {
    await this.email.click();
    await this.email.fill(email);
    await this.emailNext.click();
    await this.password.fill(password);
    await this.passwordNext.click();
  }

  async enterCode(code) {
    await this.code.fill(code);
    await this.totpNext.click();
  }
}
