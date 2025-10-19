import { Page, Locator, expect } from '@playwright/test';

const BASE_URL = 'https://cove-passes.vercel.app';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoPath(path: string = '/'): Promise<void> {
    const target = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    await this.page.goto(target);
  }

  async gotoBase(): Promise<void> {
    await this.gotoPath('/');
  }

  getByLabel(text: string | RegExp): Locator {
    return this.page.getByLabel(text);
  }

  getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options as any);
  }

  getAlert(): Locator {
    return this.page.getByRole('alert');
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByPlaceholder(text: string | RegExp): Locator {
    return this.page.getByPlaceholder(text);
  }

  async fillByLabel(text: string | RegExp, value: string): Promise<void> {
    await this.getByLabel(text).fill(value);
  }

  async clickByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Promise<void> {
    await this.getByRole(role, options as any).click();
    //await this.page.waitForLoadState("networkidle");
  }

  async clickButtonByName(name: string | RegExp): Promise<void> {
    await this.getByRole('button', { name } as any).click();
  }

  async expectUrlMatches(regex: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(regex);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectHeadingVisible(text: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: text })).toBeVisible();
  }
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitTimeout(timeoutMs: number): Promise<void> {
    await this.page.waitForTimeout(timeoutMs);
  }

  async waitForResponse(predicateOrUrl: string | RegExp | ((resp: any) => boolean), timeoutMs: number = 30000): Promise<void> {
    await this.page.waitForResponse(predicateOrUrl as any, { timeout: timeoutMs });
  }

  async waitForURL(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }
  async fillFormByLabels(values: Record<string, string>): Promise<void> {
    for (const [label, value] of Object.entries(values)) {
      await this.fillByLabel(label, value);
    }
  }
}

export default BasePage;
