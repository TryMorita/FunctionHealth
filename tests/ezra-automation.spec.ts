import { expect, Page, test } from "@playwright/test";
import { loginAs } from "../helpers/login";
import { answerPreScreen, clickCard, expectAddonDisabled, expectDisabled, expectPreScreenFailure, expectTooltip, getCard, selectAddon } from "../helpers/scans";
import { PRESCREEN_NO, PRESCREEN_YES } from "../constants/prescreen";
import { dismissCookieBanner, waitForClinicsToHydrate } from "../helpers/ui";
import { computeDynamicDate, selectNthTimeSlot } from "../helpers/schedule";
import { format } from "node:path";

test('Age‑Based Scan Restrictions', async ({ page }) => {

  // Login as User A
  await loginAs(page, 'userA');
  await page.goto('https://myezra-staging.ezra.com/book-scan/select-plan');

  // Wait for scroll container to settle
  const container = page.locator('.sign-up-scroll-container');
  await container.waitFor({ state: 'visible' });
  await container.waitFor();
  await dismissCookieBanner(page);

  // Cards
  const gatedCard = getCard(page, 'GATEDCAC-encounter-card');
  const lungCard = getCard(page, 'LUNG-encounter-card');
  const fb30Card = getCard(page, 'FB30-encounter-card');

  //
  // ─── VERIFY RESTRICTED SCANS ARE DISABLED ────────────────────────────────
  //
  await expectDisabled(gatedCard);
  await expectDisabled(lungCard);

  //
  // ─── SELECT AN ALLOWED SCAN ──────────────────────────────────────────────
  //
  await clickCard(fb30Card);

  //
  // ─── VERIFY ADD‑ONS ──────────────────────────────────────────────────────
  //
  await container.evaluate(el => el.scrollTo(0, el.scrollHeight));
  await expectAddonDisabled(page, 'lung-addon-card');

  //
  // ─── VERIFY TOOLTIP CONTENT ──────────────────────────────────────────────
  //
  await expectTooltip(
    gatedCard,
    /Gated CAC scan is recommended for individuals aged 35-85/i
  );

  await expectTooltip(
    lungCard,
    /This scan is not available for those your age/i
  );
});

test('Pre‑Screening Flow for Heart CT / Lung CT', async ({ page }) => {

  //
  // ─── LOGIN + NAVIGATION ─────────────────────────────────────────────────────
  //
  await loginAs(page, 'userB');
  await page.goto('https://myezra-staging.ezra.com/book-scan/select-plan');

  const container = page.locator('.sign-up-scroll-container');
  await container.waitFor({ state: 'visible' });


  //
  // ─── SELECT BASE SCAN (FB30) ────────────────────────────────────────────────
  //
  const fb30 = page.getByTestId('FB30-encounter-card');
  await fb30.scrollIntoViewIfNeeded();
  await fb30.locator('div').first().click();


  //
  // ─── SELECT HEART + LUNG ADD‑ONS ─────────────────────────────────────────────
  //
  await container.evaluate(el => el.scrollTo(0, el.scrollHeight));

  await selectAddon(page, 'gatedcac-addon-card');
  await selectAddon(page, 'lung-addon-card');

  await page.getByTestId('select-plan-submit-btn').click();


  //
  // ─── PRE‑SCREEN MODAL ───────────────────────────────────────────────────────
  //
  const modal = page.locator('.pre-screen-modal');
  await expect(modal).toBeVisible();


  //
  // ─── FAIL CASE: ANSWER “YES” TO ALL QUESTIONS ───────────────────────────────
  //
  await answerPreScreen(page, [
    PRESCREEN_YES.chestSymptoms,
    PRESCREEN_YES.gatedCacStent,
    PRESCREEN_YES.pacemaker,
    PRESCREEN_YES.coronaryHistory,
    PRESCREEN_YES.previousCacScoreThreeYears,
    PRESCREEN_YES.previousCacScoreOver400
  ]);

  await page.getByTestId('cac-prescreen-modal-submit-btn').click();


  //
  // ─── VERIFY FAILURE MODAL ───────────────────────────────────────────────────
  //
  await expectPreScreenFailure(page);


  //
  // ─── CONTINUE WITHOUT HEART CALCIUM ─────────────────────────────────────────
  //
  const continueBtn = page.getByRole('button', { name: /continue without heart calcium/i });

  await expect(continueBtn).toBeVisible();
  await expect(continueBtn).toBeEnabled();

  await continueBtn.click();


  //
  // ─── VERIFY USER IS ON SCHEDULING PAGE ──────────────────────────────────────
  //
  await expect(
    page.getByText('Schedule your scan Select a location, date and time to book your scan.')
  ).toBeVisible();
});

test('Dynamic Scan Selection Updates Pricing, Add‑Ons, and Required Steps', async ({ page }) => {

  //
  // ─── LOGIN + NAVIGATION ─────────────────────────────────────────────────────
  //
  await loginAs(page, 'userB');
  await page.goto('https://myezra-staging.ezra.com/book-scan/select-plan');
  await dismissCookieBanner(page);

  const container = page.locator('.sign-up-scroll-container');
  await container.waitFor({ state: 'visible' });


  //
  // ─── SELECT FB60 SCAN ───────────────────────────────────────────────────────
  //
  const fb60 = page.getByTestId('FB60-encounter-card');
  await fb60.scrollIntoViewIfNeeded();
  await fb60.locator('div').first().click();
  const scanPrice = fb60.locator('.encounter-card-price.b2');
  const priceText = await scanPrice.innerText();
  const scanPriceValue = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
  console.log('Selected FB60 scan with price:', scanPriceValue);

  //
  // ─── SELECT ADD‑ONS ─────────────────────────────────────────────────────────
  //
  await container.evaluate(el => el.scrollTo(0, el.scrollHeight));

  await selectAddon(page, 'gatedcac-addon-card'); // Heart CT
  const gatedCacPriceLoc = await page.getByTestId('gatedcac-addon-card').locator('.addon-card-price')
  const gatedCacPriceText = await gatedCacPriceLoc.innerText();
  const gatedCacPrice = parseInt(gatedCacPriceText.replace(/[^0-9]/g, ''), 10);
  await selectAddon(page, 'lung-addon-card');     // Lung CT
  const lungCtPriceLoc = await page.getByTestId('lung-addon-card').locator('.addon-card-price')
  const lungCtPriceText = await lungCtPriceLoc.innerText();
  const lungCtPrice = parseInt(lungCtPriceText.replace(/[^0-9]/g, ''), 10);
  await page.getByTestId('select-plan-submit-btn').click();


  //
  // ─── PRE‑SCREEN MODAL ───────────────────────────────────────────────────────
  //
  const modal = page.locator('.pre-screen-modal');
  await expect(modal).toBeVisible();

  // Answer NO to all questions
  await answerPreScreen(page, [
    PRESCREEN_NO.chestSymptoms,
    PRESCREEN_NO.gatedCacStent,
    PRESCREEN_NO.pacemaker,
    PRESCREEN_NO.coronaryHistory,
    PRESCREEN_NO.previousCacScoreThreeYears,
    PRESCREEN_NO.previousCacScoreOver400
  ]);

  await page.getByTestId('cac-prescreen-modal-submit-btn').click();


  //
  // ─── SCHEDULING PAGE ────────────────────────────────────────────────────────
  //

  await expect(page.getByText('Schedule your scan')).toBeVisible();

  await page.waitForSelector('.location-cards', { state: 'attached' });
  await expect(page.locator('.location-card').first()).toBeVisible();


  //
  // ─── VERIFY STATES AVAILABLE ────────────────────────────────────────────────
  //
  const stateDropdown = page.locator('.city__selection .container--inner');
  await stateDropdown.click();

  await expect(page.locator('[data-selected="Selected"]').getByText(/Alaska/i)).toBeVisible();
  await expect(page.locator('[data-selected="Selected"]').getByText(/New York/i)).toBeVisible();

  const newYorkselector = stateDropdown
    .locator('[data-selected="Selected"]')
    .getByText(/New York/i);

  await newYorkselector.hover();
  await newYorkselector.click();
  await waitForClinicsToHydrate(page);

  //
  // ─── SELECT CLINIC ──────────────────────────────────────────────────────────
  //

  const scrollContainer = page.locator('.sign-up-scroll-container');
  await scrollContainer.evaluate(el => el.scrollTo(0, el.scrollHeight));

  // Select the correct clinic card
  const clinicCard = page
    .locator('.location-card')
    .filter({ hasText: 'QA Automation Center' });

  // Capture the address
  const clinicAddress = await clinicCard.locator('.location-card__street').innerText();

  await page.locator('.location-card', { hasText: 'QA Automation Center' }).click();

  // Wait for the calendar to load
  await page.waitForSelector('.vuecal__cells.month-view', { state: 'visible' });

  //
  // ───  FILLOUT ADDITIOANL BOOKING INFORMATION─────────────────────────────────
  //

  const additionalInfo = page.locator('#additionalBookingInformation');
  await additionalInfo.first().fill('This is some additional information for testing purposes.');

  //
  // ─── SELECT DATE (DYNAMIC) ──────────────────────────────────────────────────
  //

  const DateContainer = page.locator('.datepicker');

  await DateContainer.scrollIntoViewIfNeeded();
  await expect(DateContainer).toBeVisible();
  await expect(DateContainer.locator('.month-view')).toBeVisible();

  const { formatted, testId } = computeDynamicDate();

  const dateCell = page.getByTestId(testId);
  await dateCell.scrollIntoViewIfNeeded();
  await dateCell.click();


  //
  // ─── SELECT TIME SLOTS (3 IN LIST) ──────────────────────────────────────────
  //

  const selectedTime = [];
  selectedTime.push(await selectNthTimeSlot(page, 1)); // selects the 2nd real slot

  const AdditionalTimeSlotsModal = page.locator('.modal-dialogue__container', { hasText: 'Please select 3 times you are available' });
  await expect(AdditionalTimeSlotsModal).toBeVisible();
  AdditionalTimeSlotsModal.getByRole('button', { name: /i understand/i }).click();

  selectedTime.push(await selectNthTimeSlot(page, 2)); // selects the 3nd real slot
  selectedTime.push(await selectNthTimeSlot(page, 3)); // selects the 4th real slot

  console.log('Selected time slots:', selectedTime);


  //
  // ─── CONTINUE TO PAYMENT ────────────────────────────────────────────────────
  //
  await page.getByRole('button', { name: /continue/i }).click();


  //
  // ─── PAYMENT PAGE VALIDATION ────────────────────────────────────────────────
  //
  const plan = page.locator('.pricing-descriptions');
  await expect(plan).toContainText(/MRI Scan with Spine/i);
  await expect(plan).toContainText(/Heart CT/i);
  await expect(plan).toContainText(/CT/i);

  const center = page.locator('.b3--bold.__center');
  await expect(center).toContainText(/QA Automation Center/i);

  const address = page.locator('.b4.__address');
  await expect(address).toContainText(clinicAddress);

  const dateTime = page.locator('ul', { hasText: formatted });
  console.log(formatted, "formatted date for assertion");

  await expect(dateTime).toContainText(formatted);
  await expect(dateTime).toContainText(selectedTime[0]);
  await expect(dateTime).toContainText(selectedTime[1]);
  await expect(dateTime).toContainText(selectedTime[2]);

  const totalLabel = page.locator('.b1--bold');
  await expect(totalLabel).toHaveText('Total');

  const totalPrice = page.locator('.__total.__today');
  const finalScanPrice =  scanPriceValue + gatedCacPrice + lungCtPrice;
  const finalScanPriceString = `$${finalScanPrice}`;
  await expect(totalPrice).toContainText(finalScanPriceString);
});
