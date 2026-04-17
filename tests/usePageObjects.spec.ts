import { expect, test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker';


test.beforeEach(async ({ page }) => {
    await page.goto('/');
})

test('navigate to form page @smoke', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke', async ({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@example.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.formLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await page.screenshot({ path: `screenshots/form-submission-${Date.now()}.png` })
    // const buffer = await page.screenshot()
    // console.log(buffer.toString('base64'))
    await pm.formLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: `screenshots/inline-form-${Date.now()}.png` })
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(3, 10)
})