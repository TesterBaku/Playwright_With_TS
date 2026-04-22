import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Smart Table', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().smartTablePage()
    })

    test('should add a new row and verify it appears in the table @smoke', async ({ pageManager, page }) => {
        const newId = faker.number.int({ min: 100, max: 999 }).toString()
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const username = `@${faker.internet.userName()}`
        const email = faker.internet.email()
        const age = faker.number.int({ min: 18, max: 65 }).toString()

        await pageManager.onSmartTablePage().addNewRow(newId, firstName, lastName, username, email, age)

        const addedRow = page.locator('ng2-smart-table tbody tr.ng2-smart-row').filter({ hasText: firstName })
        await expect(addedRow).toBeVisible()
        await expect(addedRow).toContainText(lastName)
        await expect(addedRow).toContainText(email)
    })

    test('should update the age of an existing user @smoke', async ({ pageManager, page }) => {
        const firstName = 'Mark'
        const newAge = '35'

        await pageManager.onSmartTablePage().updateAgeByFirstName(firstName, newAge)

        const updatedRow = page.locator('ng2-smart-table tbody tr.ng2-smart-row').filter({ hasText: firstName }).first()
        await expect(updatedRow).toContainText(newAge)
    })

    test('should delete a row and verify it is removed from the table', async ({ pageManager, page }) => {
        const firstNameToDelete = 'Larry'

        // Verify row exists before delete
        const rowBeforeDelete = page.locator('ng2-smart-table tbody tr.ng2-smart-row').filter({ hasText: firstNameToDelete })
        await expect(rowBeforeDelete).toBeVisible()

        page.on('dialog', dialog => dialog.accept())
        await pageManager.onSmartTablePage().deleteRowByFirstName(firstNameToDelete)

        await expect(rowBeforeDelete).toBeHidden()
    })

    test('should filter rows by age and show only matching results @smoke', async ({ pageManager, page }) => {
        const targetAge = '20'

        await pageManager.onSmartTablePage().filterByAge(targetAge)

        const visibleRows = page.locator('ng2-smart-table tbody tr.ng2-smart-row')
        const count = await visibleRows.count()
        for (let i = 0; i < count; i++) {
            await expect(visibleRows.nth(i)).toContainText(targetAge)
        }
    })

    test('should filter rows by email and show only matching results', async ({ pageManager, page }) => {
        const emailDomain = 'gmail.com'

        await pageManager.onSmartTablePage().filterByEmail(emailDomain)

        const visibleRows = page.locator('ng2-smart-table tbody tr.ng2-smart-row')
        const count = await visibleRows.count()
        expect(count).toBeGreaterThan(0)
        for (let i = 0; i < count; i++) {
            await expect(visibleRows.nth(i)).toContainText(emailDomain)
        }
    })

})
