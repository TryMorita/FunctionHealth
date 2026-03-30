import { expect } from "@playwright/test";
import type { Locator, Page } from '@playwright/test';


// helpers/scan.ts
export const getCard = (page: Page, testId: string) =>
    page.getByTestId(testId);

export const expectDisabled = async (card: Locator) => {
    await expect(card.locator('.disabled')).toBeVisible();
};

export const clickCard = async (card: Locator) => {
    await card.scrollIntoViewIfNeeded();
    await card.waitFor({ state: 'visible' });
    await card.locator('div').first().click();
};

export const expectAddonDisabled = async (page: Page, addonTestId: string) => {
    await expect(
        page.getByTestId(addonTestId).locator('.disabled-overlay')
    ).toBeVisible();
};

export const expectTooltip = async (card: Locator, text: RegExp) => {
    await card.locator('.disable-description').hover();

    const tooltip = card.locator('.disable-description-content');

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(text);
};

export const selectAddon = async (page: Page, testId: string) => {
    const addon = page.getByTestId(testId);
    await addon.scrollIntoViewIfNeeded();
    await addon.waitFor({ state: 'visible' });
    await addon.click();
};

export const answerPreScreen = async (page: Page, answers: string[]) => {
  for (const testId of answers) {
    await page.getByTestId(testId).click();
  }
};

export const expectPreScreenFailure = async (page: Page) => {
    await expect(page.locator('.pre-screen-modal')).toBeVisible();
    await expect(page.locator('.pre-screen-modal__content')).toContainText("We're sorry, this product isn't right for you.");
};

export const expectPreScreenSuccess = async (page: Page) => {
    await expect(page.locator('.next-step-page')).toBeVisible();
};
