import { test, expect } from '../test-options'

test.describe('Window', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().windowPage()
    })

    test('should open a window form and close it @smoke', async ({ pageManager }) => {
        await pageManager.onWindowPage().openWindowForm()
        await expect(pageManager.onWindowPage().window).toBeVisible()

        await pageManager.onWindowPage().closeWindow()
        await expect(pageManager.onWindowPage().window).toBeHidden()
    })

    test('should open a window with template content @smoke', async ({ pageManager }) => {
        await pageManager.onWindowPage().openWindowWithTemplate()
        await expect(pageManager.onWindowPage().window).toBeVisible()
    })

})
