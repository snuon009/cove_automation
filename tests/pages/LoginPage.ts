import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: BasePage['page']) {
    super(page);
    this.emailInput = this.getByLabel('Email');
    this.passwordInput = this.getByLabel('Password');
    this.submitButton = this.getByRole('button', { name: /Login/i });
    this.errorMessage = this.getAlert();
  }

  async goto(): Promise<void> {
    await this.gotoPath('');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForNetworkIdle();

  }


  async assertLoggedIn(expectedPathRegex: RegExp = /park/i): Promise<void> {
    await this.expectUrlMatches(expectedPathRegex);
  }

  async assertErrorVisible(messageRegex?: RegExp): Promise<void> {
    await this.expectVisible(this.errorMessage);
    if (messageRegex) {
      await this.expectText(this.errorMessage, messageRegex);
    }
  }
}

export default LoginPage;
