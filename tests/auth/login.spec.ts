import { test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { validUser, invalidUser } from "../data/testData";



test.describe('Test Login Functionality', () => {
  test('User can log in with valid credentials', async ({ page }) => {
    // Test implementation will go here
    const loginP = new LoginPage(page);
    await loginP.goto();
    await loginP.login(validUser.email, validUser.password);
    // Add assertions to verify successful login   
    await loginP.assertLoggedIn();

  });


});