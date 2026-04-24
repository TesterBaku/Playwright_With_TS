import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Form Layouts', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().formLayoutsPage()
    })
    test('should submit the grid form with valid credentials @smoke', async ({ pageManager }) => {
        await pageManager.formLayoutsPage().submitUsingTheGridForm(
            process.env.USERNAME,
            process.env.PASSWORD,
            'Option 1'
        )
        await expect(
            pageManager.formLayoutsPage().usingTheGridCard.getByRole('radio', { name: 'Option 1' })
        ).toBeChecked()
    })

    test('should submit the inline form with random user data @smoke', async ({ pageManager }) => {
        const name = faker.person.fullName()
        const email = faker.internet.email()

        await pageManager.formLayoutsPage().submitInlineForm(name, email, true)
        await expect(
            pageManager.formLayoutsPage().inlineFormCard.getByRole('checkbox')
        ).toBeChecked()
    })

})

test.describe('Date Picker', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().datepickerPage()
    })

    test('should select a single date 5 days from today @smoke', async ({ pageManager }) => {
        await pageManager.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    })

    test('should select a date range starting 3 and ending 10 days from today @smoke', async ({ pageManager }) => {
        await pageManager.onDatePickerPage().selectDatePickerWithRangeFromToday(3, 10)
    })

})
