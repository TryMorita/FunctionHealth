import { expect, type Page } from '@playwright/test';

export const dismissCookieBanner = async (page: Page) => {
    const accept = page.locator('.t-acceptAllButton')
    // Is the Accept for the Cookie Banner supposed to be data-tid="banner-accept"?
    if (await accept.isVisible()) {
        await accept.dblclick();
    }
    await expect(accept).not.toBeVisible();
};

export const waitForClinicsToHydrate = async (page: Page) => {
  // Ezra hydration is slow/flaky; empirical buffer
  await page.waitForTimeout(5000);
};
