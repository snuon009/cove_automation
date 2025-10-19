import { test } from '@playwright/test';

test('inspect datepicker classes for today', async ({ page }) => {
    // navigate to a page that has the event schedule
    await page.goto('https://cove-passes.vercel.app/park/Seal_Bay/unit/U0003481/');
    // click "See what's on" if present
    const seeLink = page.getByRole('link', { name: /see what'?s on/i }).first();
    if (await seeLink.count() > 0) {
        await seeLink.click();
        await page.waitForLoadState('networkidle');
    }

    // try to open a Select date / date button if present
    const selectBtn = page.getByRole('button', { name: /select a date|select date|date/i }).first();
    if (await selectBtn.count() > 0) {
        await selectBtn.click().catch(() => { });
    }

    const result = await page.evaluate(() => {
        const today = new Date().toISOString().slice(0, 10);
        const byData = Array.from(document.querySelectorAll(`[data-date="${today}"]`)).map(e => ({ tag: e.tagName, class: e.className, html: e.outerHTML.slice(0, 200) }));
        const byAria = Array.from(document.querySelectorAll('[aria-current="date"]')).map(e => ({ tag: e.tagName, class: e.className, html: e.outerHTML.slice(0, 200) }));
        const todayClassElems = Array.from(document.querySelectorAll('.today, .is-today, .current-day, .datepicker-day.today, .date--today, .day--today')).map(e => ({ tag: e.tagName, class: e.className, html: e.outerHTML.slice(0, 200) }));
        return { today, byData, byAria, todayClassElems };
    });

    // print results
    console.log(JSON.stringify(result, null, 2));
});
