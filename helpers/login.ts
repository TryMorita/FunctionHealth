import { users } from "../assets/users";
import type { Locator, Page } from '@playwright/test';
import { dismissCookieBanner } from "./ui";

export async function loginAs(page: Page, userKey) {
    const user = users[userKey];

    await page.goto("https://myezra-staging.ezra.com/sign-in");

    await page.locator("#email").fill(user.email);
    await page.locator("#password").fill(user.password);

    await page.locator("button.submit-btn").click();

    // Wait for navigation or dashboard element
    await page.waitForURL("https://myezra-staging.ezra.com/");
    await dismissCookieBanner(page);

}
