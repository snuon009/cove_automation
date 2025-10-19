import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.nameInput = this.getByLabel(/name|full name/i);
    this.emailInput = this.getByLabel('Email');
    this.passwordInput = this.getByLabel('Password');
    this.submitButton = this.getByRole('button', { name: /register|sign up|create account/i });
    this.errorMessage = this.getAlert();
  }

  async goto(): Promise<void> {
    await this.gotoPath('/register');
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertRegistered(expectedPathRegex: RegExp = /welcome|verify|dashboard/i): Promise<void> {
    await this.expectUrlMatches(expectedPathRegex);
  }

  async assertErrorVisible(messageRegex?: RegExp): Promise<void> {
    await this.expectVisible(this.errorMessage);
    if (messageRegex) {
      await this.expectText(this.errorMessage, messageRegex);
    }
  }
}

export default RegisterPage;
