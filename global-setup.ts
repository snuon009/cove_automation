import { chromium, FullConfig } from "@playwright/test";
import LoginPage from "./tests/pages/LoginPage";
import { validUser, invalidUser } from './tests/data/testData';


async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();

    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();
    const userLogin = new LoginPage(userPage);
    await userLogin.goto();
    await userLogin.login(validUser.email, validUser.password);
    await userLogin.waitForNetworkIdle();
    await userLogin.assertLoggedIn(/park/);
    await userContext.storageState({ path: './storageStates/storageState.owner.json' });
    await browser.close();

}

export default globalSetup;
