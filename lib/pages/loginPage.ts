import { Page } from "@playwright/test";

export class LoginPage {
  readonly googleButton = this.page.getByRole("button", {
    name: "Lanjutkan dengan Akun Google",
  });

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }
}
