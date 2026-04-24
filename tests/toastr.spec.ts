import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Toastr', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().toastrPage()
    })

    test('should show a toast with custom title and content @smoke', async ({ pageManager }) => {
        const title = faker.word.words(2)
        const content = faker.lorem.sentence()

        await pageManager.onToastrPage().setTitle(title)
        await pageManager.onToastrPage().setContent(content)
        await pageManager.onToastrPage().showToast()

        await expect(pageManager.onToastrPage().toastContainer).toBeVisible()
        await expect(pageManager.onToastrPage().toastContainer).toContainText(title)
        await expect(pageManager.onToastrPage().toastContainer).toContainText(content)
    })

    test('should show a random toast @smoke', async ({ pageManager }) => {
        await pageManager.onToastrPage().showRandomToast()
        await expect(pageManager.onToastrPage().toastContainer).toBeVisible()
    })

    test('should check and uncheck the Hide on click checkbox', async ({ page, pageManager }) => {
        await pageManager.onToastrPage().setCheckbox('Hide on click', true)
        await expect(page.getByRole('checkbox', { name: 'Hide on click' })).toBeChecked()

        await pageManager.onToastrPage().setCheckbox('Hide on click', false)
        await expect(page.getByRole('checkbox', { name: 'Hide on click' })).not.toBeChecked()
    })

    test('should check the Prevent duplicate toast checkbox', async ({ page, pageManager }) => {
        await pageManager.onToastrPage().setCheckbox('Prevent arising of duplicate toast', true)
        await expect(page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' })).toBeChecked()
    })

})
