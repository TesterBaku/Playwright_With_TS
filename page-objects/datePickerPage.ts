import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calenderInputFiled = this.page.getByPlaceholder('Form Picker')
        await calenderInputFiled.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        await expect(calenderInputFiled).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(firstDayOffset: number, secondDayOffset: number) {
        const calenderInputFiled = this.page.getByPlaceholder('Range Picker')
        await calenderInputFiled.click()
        const firstDateToAssert = await this.selectDateInTheCalendar(firstDayOffset)
        const secondDateToAssert = await this.selectDateInTheCalendar(secondDayOffset)
        const rangeDateToAssert = `${firstDateToAssert} - ${secondDateToAssert}`
        await expect(calenderInputFiled).toHaveValue(rangeDateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('default', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('default', { month: 'long' })
        const expectedYear = date.getFullYear().toString()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthYear = await this.page.locator('nb-calendar-view-mode').getByText(expectedYear).textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
        while (calendarMonthYear != expectedMonthAndYear) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthYear = await this.page.locator('nb-calendar-view-mode').getByText(expectedYear).textContent()
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click()
        return dateToAssert
    }
}