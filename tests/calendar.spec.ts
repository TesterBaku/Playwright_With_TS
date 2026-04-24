import { test, expect } from '../test-options'

test.describe('Calendar', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().calendarPage()
    })

    test('should select a date and show it in the subtitle @smoke', async ({ page, pageManager }) => {
        // Pick the 15th (always a safe mid-month day)
        await pageManager.onCalendarPage().selectDateInSingleCalendar(15)
        const subtitle = await pageManager.onCalendarPage().getSelectedDateText()
        expect(subtitle).toContain('15')
    })

    test('should navigate to next month in the single calendar', async ({ pageManager }) => {
        const beforeNav = await pageManager.onCalendarPage().singleCalendar
            .locator('nb-calendar-view-mode').textContent()
        await pageManager.onCalendarPage().navigateToNextMonthInSingleCalendar()
        const afterNav = await pageManager.onCalendarPage().singleCalendar
            .locator('nb-calendar-view-mode').textContent()
        expect(afterNav).not.toEqual(beforeNav)
    })

    test('should select a date range and show start and end in the subtitle @smoke', async ({ pageManager }) => {
        await pageManager.onCalendarPage().selectDateRangeStart(5)
        await pageManager.onCalendarPage().selectDateRangeEnd(15)
        const rangeText = await pageManager.onCalendarPage().getRangeText()
        expect(rangeText).toContain('5')
        expect(rangeText).toContain('15')
    })

})
