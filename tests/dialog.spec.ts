import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Dialog', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().dialogPage()
    })

    test('should open a dialog and dismiss it @smoke', async ({ pageManager }) => {
        await pageManager.onDialogPage().openDialogWithComponent()
        await expect(pageManager.onDialogPage().dialog).toBeVisible()

        await pageManager.onDialogPage().dismissDialog()
        await expect(pageManager.onDialogPage().dialog).toBeHidden()
    })

    test('should submit a name and have it appear in the names list @smoke', async ({ pageManager }) => {
        const name = faker.person.firstName()

        await pageManager.onDialogPage().openNamePrompt()
        await pageManager.onDialogPage().submitName(name)

        await expect(pageManager.onDialogPage().namesList.filter({ hasText: name })).toBeVisible()
    })

    test('should cancel the name prompt and keep the names list unchanged', async ({ pageManager }) => {
        const initialCount = await pageManager.onDialogPage().namesList.count()

        await pageManager.onDialogPage().openNamePrompt()
        await pageManager.onDialogPage().cancelNamePrompt()

        await expect(pageManager.onDialogPage().namesList).toHaveCount(initialCount)
    })

})
