import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class CalendarPage extends HelperBase {

    // Three calendar containers (0-indexed)
    readonly calendarContainers = this.page.locator('.calendar-container')
    readonly singleCalendar = this.calendarContainers.first().locator('nb-calendar')
    readonly rangeCalendar = this.calendarContainers.nth(1).locator('nb-calendar-range')

    constructor(page: Page) {
        super(page)
    }

    async selectDateInSingleCalendar(day: number): Promise<void> {
        const dayCell = this.singleCalendar.locator('[class*="day-cell"]').getByText(day.toString(), { exact: true })
        await dayCell.click()
    }

    async navigateToNextMonthInSingleCalendar(): Promise<void> {
        await this.singleCalendar.locator('[data-name="chevron-right"]').click()
    }

    async getSelectedDateText(): Promise<string> {
        return this.calendarContainers.first().locator('.subtitle').textContent()
    }

    async selectDateRangeStart(day: number): Promise<void> {
        const dayCell = this.rangeCalendar.locator('[class*="day-cell"]').getByText(day.toString(), { exact: true })
        await dayCell.click()
    }

    async selectDateRangeEnd(day: number): Promise<void> {
        const dayCell = this.rangeCalendar.locator('[class*="day-cell"]').getByText(day.toString(), { exact: true })
        await dayCell.click()
    }

    async getRangeText(): Promise<string> {
        return this.calendarContainers.nth(1).locator('.subtitle').textContent()
    }
}
