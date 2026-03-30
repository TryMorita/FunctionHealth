import { expect, type Page } from '@playwright/test';

export function computeDynamicDate() {
    const today = new Date();
    const target = new Date(today);
    target.setDate(today.getDate() + 2);

    // If weekend, bump to Monday
    const day = target.getDay();
    if (day === 0) target.setDate(target.getDate() + 1); // Sunday → Monday
    if (day === 6) target.setDate(target.getDate() + 2); // Saturday → Monday

    // Clamp to 28th — but if that puts us in the past, move to next month
    if (target.getDate() > 28) {
        // Move to next month, day 1
        target.setMonth(target.getMonth() + 1);
        target.setDate(1);

        // Skip weekend again if needed
        const d = target.getDay();
        if (d === 0) target.setDate(2); // Sunday → Monday
        if (d === 6) target.setDate(3); // Saturday → Monday
    }

    const month = target.toLocaleString('en-US', { month: 'short' });
    const dayNum = target.getDate();
    const year = target.getFullYear();

    const formatted = `${month} ${dayNum}, ${year}`;
    const testId = `${target.getMonth() + 1}-${dayNum}-cal-day-content`;

    return { target, formatted, testId };
}


export async function selectNthTimeSlot(page: Page, n: number) {
    // Only select *real*, visible time slots
    const realSlots = page.locator('.appointments__individual-appointment:visible');

    // Count how many valid slots exist
    const count = await realSlots.count();

    if (count === 0) {
        throw new Error('No visible time slots found.');
    }

    if (n >= count) {
        throw new Error(`Requested slot index ${n} but only ${count} real slots exist.`);
    }

    // Grab the text BEFORE clicking so we can return it
    const selectedText = await realSlots.nth(n).innerText();

    // Click the slot
    await realSlots.nth(n).click();

    // Return the text of the selected slot
    return selectedText.trim();
}
