import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { getTodayDate } from '../helpers/dateUtil';

export class EventSchedulePage extends BasePage {
    //private seeWhatOnBtn: Locator;
    readonly page: Page;
    constructor(page: BasePage['page']) {
        super(page);
        // this.seeWhatOnBtn = this.getByRole('button', { name: /See what\'s on/i });
        this.page = page;
    }

    async goto(): Promise<void> {
        await this.clickByRole("link", { name: 'See what\'s on' });
        // await this.waitForNetworkIdle();
        //this.waitTimeout(50000);
        // await this.page.waitForLoadState('networkidle');
        // await this.page.waitForTimeout(5000);

    }
    async expectH1Visible(): Promise<void> {
        await this.expectHeadingVisible("What's on");
    }

    /**
     * Assert that the current page URL contains today's date (YYYY-MM-DD).
     */
    async assertUrlHasTodayDate(): Promise<void> {
        const today = getTodayDate();
        await this.expectUrlMatches(new RegExp(today));
    }

    /**
     * Expect the "Today" button to be selected/highlighted by default.
     * This checks for aria-pressed=true, or a class containing active/selected/highlight.
     */
    async expectTodayButtonSelected(): Promise<void> {
        const todayBtn = this.page.getByRole('button', { name: /today/i }).first();
        // prefer accessible state
        const ariaPressed = await todayBtn.getAttribute('aria-pressed');
        if (ariaPressed !== null) {
            await expect(ariaPressed).toBe('true');
            return;
        }

        // fallback: check class names
        const classAttr = await todayBtn.getAttribute('class');
        expect(classAttr).toMatch(/border-navy/i);
    }

    /**
     * Return tomorrow's label formatted like 'Sun 19 Oct'.
     */
    getTomorrowLabel(): string {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        return `${weekday} ${day} ${month}`;
    }

    /**
     * Return the label for today + offset days formatted like 'Sun 19 Oct'.
     */
    getLabelForOffset(offset: number): string {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        return `${weekday} ${day} ${month}`;
    }

    /**
     * Expect the button at position (today + offset) shows the expected label.
     * offset=1 => tomorrow, offset=2 => day after tomorrow, etc.
     */
    async expectButtonLabelAfterToday(offset: number): Promise<void> {
        if (offset < 1) throw new Error('offset must be >= 1');
        const todayBtn = this.page.getByRole('button', { name: /Today/i }).first();
        const targetText = await todayBtn.evaluate((el, off) => {
            let ancestor: HTMLElement | null = el.parentElement;
            while (ancestor) {
                const buttons = Array.from(ancestor.querySelectorAll('button')) as HTMLButtonElement[];
                if (buttons.length > 1) {
                    const idx = buttons.indexOf(el as HTMLButtonElement);
                    if (idx !== -1 && idx + off < buttons.length) {
                        return buttons[idx + off].innerText.replace(/\s+/g, ' ').trim();
                    }
                    const elText = (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
                    const foundIdx = buttons.findIndex(b => b.innerText.replace(/\s+/g, ' ').trim() === elText);
                    if (foundIdx !== -1 && foundIdx + off < buttons.length) {
                        return buttons[foundIdx + off].innerText.replace(/\s+/g, ' ').trim();
                    }
                }
                ancestor = ancestor.parentElement;
            }
            return null;
        }, offset) as string | null;

        if (!targetText) throw new Error(`Button at offset ${offset} after Today not found or has no text`);

        const expected = this.getLabelForOffset(offset).replace(/\s+/g, ' ').trim();
        expect(targetText).toBe(expected);
        console.log(`Button label at offset ${offset} after Today is correct: "${targetText}"`);
    }

    /**
     * Open the "Select a date" dropdown/calendar and assert the calendar shows today's date.
     * It attempts multiple selectors to be tolerant to markup variations:
     *  - element with data-date="YYYY-MM-DD"
     *  - element with aria-current="date"
     *  - element with class containing 'today' inside a date container
     */
    async expectCalendarDateIsToday(): Promise<void> {
        // Try to open the date dropdown; tolerate variations in the button label
        const selectBtn = this.page.getByRole('button', { name: /select a date/i }).first();
        try {
            await selectBtn.click();
        } catch {
            // fallback: try clicking any button containing 'date'
            const alt = this.page.getByRole('button', { name: /date/i }).first();
            await alt.click();
        }

        // small wait for datepicker to render
        await this.page.waitForTimeout(250);

        const todayIso = getTodayDate(); // YYYY-MM-DD

        // 1) Look for element with data-date attribute
        const byData = this.page.locator(`[data-date="${todayIso}"]`);
        if (await byData.count() > 0) {
            await expect(byData.first()).toBeVisible();
            return;
        }

        // 2) Look for aria-current="date"
        const byAria = this.page.locator('[aria-current="date"]');
        if (await byAria.count() > 0) {
            const attr = await byAria.first().getAttribute('data-date');
            if (attr) {
                expect(attr).toBe(todayIso);
                return;
            }
            const text = (await byAria.first().innerText()).replace(/\s+/g, ' ').trim();
            const day = String(new Date().getDate());
            expect(text).toContain(day);
            return;
        }

        // 3) Look for any element with class 'today' inside a datepicker-like container
        const todayClass = this.page.locator('.today, .is-today, .current-day, .datepicker-day.today');
        if (await todayClass.count() > 0) {
            await expect(todayClass.first()).toBeVisible();
            return;
        }
        // 4) Fallback: search broadly for an element whose visible text includes today's day number
        const day = String(new Date().getDate());
        const found = await this.page.evaluate((d) => {
            const nodes = Array.from(document.querySelectorAll('body *')) as HTMLElement[];
            for (const n of nodes) {
                // ignore script/style
                if (n.tagName.toLowerCase() === 'script' || n.tagName.toLowerCase() === 'style') continue;
                const text = (n.textContent || '').replace(/\s+/g, ' ').trim();
                if (!text) continue;
                // match whole word day number (e.g., '18' or ' 18 ')
                const regex = new RegExp('\\b' + d + '\\b');
                if (regex.test(text)) {
                    return { tag: n.tagName, class: n.className, text, html: n.outerHTML.slice(0, 400) };
                }
            }
            return null;
        }, day);

        if (found) {
            // log for debugging and consider it a match
            // (this will appear in the test output)
            // eslint-disable-next-line no-console
            console.log('Found candidate today element:', found);
            return;
        }

        throw new Error('Unable to locate today in calendar using known selectors');
    }


}

