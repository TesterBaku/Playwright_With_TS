import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Smart Table', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().smartTablePage()
    })

    test('should add a new row and verify it appears in the table @smoke', async ({ pageManager }) => {
        const newId = faker.number.int({ min: 100, max: 999 }).toString()
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const username = `@${faker.internet.userName()}`
        const email = faker.internet.email()
        const age = faker.number.int({ min: 18, max: 65 }).toString()

        await pageManager.onSmartTablePage().addNewRow(newId, firstName, lastName, username, email, age)

        const addedRow = pageManager.onSmartTablePage().rowByText(firstName)
        await expect.soft(addedRow).toBeVisible()
        await expect.soft(addedRow).toContainText(lastName)
        await expect.soft(addedRow).toContainText(email)
        expect(test.info().errors).toHaveLength(0)
    })

    test('should update the age of an existing user @smoke', async ({ pageManager }) => {
        const firstName = 'Mark'
        const newAge = '35'

        await pageManager.onSmartTablePage().updateAgeByFirstName(firstName, newAge)

        const updatedRow = pageManager.onSmartTablePage().rowByText(firstName).first()
        await expect(updatedRow).toContainText(newAge)
    })

    test('should delete a row and verify it is removed from the table', async ({ page, pageManager }) => {
        const firstNameToDelete = 'Larry'

        const row = pageManager.onSmartTablePage().rowByText(firstNameToDelete)
        await expect(row).toBeVisible()

        page.on('dialog', dialog => dialog.accept())
        await pageManager.onSmartTablePage().deleteRowByFirstName(firstNameToDelete)

        await expect(row).toBeHidden()
    })

    test('should filter rows by age and show only matching results @smoke', async ({ pageManager }) => {
        const targetAge = '20'

        await pageManager.onSmartTablePage().filterByColumn('Age', targetAge)

        const visibleRows = pageManager.onSmartTablePage().visibleDataRows()
        // Web-first: wait until every visible row contains the filter value (no unmatched rows)
        await expect(visibleRows.filter({ hasNotText: targetAge })).toHaveCount(0)
        await expect(visibleRows.first()).toBeVisible()
    })

    test('should filter rows by email and show only matching results', async ({ pageManager }) => {
        const emailDomain = 'gmail.com'

        await pageManager.onSmartTablePage().filterByColumn('E-mail', emailDomain)

        const visibleRows = pageManager.onSmartTablePage().visibleDataRows()
        // Web-first: wait until every visible row contains the filter value (no unmatched rows)
        await expect(visibleRows.filter({ hasNotText: emailDomain })).toHaveCount(0)
        await expect(visibleRows.first()).toBeVisible()
    })

})
