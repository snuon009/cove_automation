import { test, expect } from '@playwright/test';
import { EventSchedulePage } from '../pages/EventSchedulePage';
import LoginPage from '../pages/LoginPage';
import { validUser } from '../data/testData';

let eventScheduleP!: EventSchedulePage;

test.describe('Test Event Schedule', () => {

    // Goto home page
    test.beforeEach(async ({ page }) => {
        await page.goto('https://cove-passes.vercel.app/');
        eventScheduleP = new EventSchedulePage(page);
        await eventScheduleP.goto();
        await eventScheduleP.waitForNetworkIdle();
        // await eventScheduleP.expectH1Visible();

    });

    /*

    // 1. Verify URL contains today's date
    test('URL contains today\'s date', async ({ page }) => {

        await eventScheduleP.assertUrlHasTodayDate();
    });

    // 2. Verify Today button is selected by default 
    test('Today button is selected by default', async ({ page }) => {
        await eventScheduleP.expectTodayButtonSelected();
    });

    // 3. Virify First button after Today shows tomorrow's label (e.g. 'Sun 19 Oct')
    test('First button after Today shows day+1 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(1);
    });

    // 4. Verify second button after Today shows day+2 label
    test('Second button after Today shows day+2 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(2);
    });
    // 5. Verify third button after Today shows day+3 label
    test('Third button after Today shows day+3 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(3);
    });
    // 6. Verify fourth button after Today shows day+4 label
    test('Fourth button after Today shows day+4 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(4);
    });
    //7. Verify fifth button after Today shows day+5 label
    test('Fifth button after Today shows day+5 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(5);
    });
    //8. Verify sixth button after Today shows day+6 label
    test('Sixth button after Today shows day+6 label', async ({ page }) => {
        await eventScheduleP.expectButtonLabelAfterToday(6);
    });
*/

    // Verify the datepicker's calendar shows today's date
    test('Select a date dropdown shows today in calendar', async ({ page }) => {
        await eventScheduleP.expectCalendarDateIsToday();
    });

});
