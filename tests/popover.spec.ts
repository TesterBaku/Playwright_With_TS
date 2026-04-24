import { test, expect } from '../test-options'

test.describe('Popover', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().popoverPage()
    })

    test('should show popover content on click @smoke', async ({ pageManager }) => {
        await pageManager.onPopoverPage().clickPopover('on click')
        await expect(pageManager.onPopoverPage().popoverContent).toBeVisible()
        await expect(pageManager.onPopoverPage().popoverContent).toContainText('Hello, how are you today?')
    })

    test('should show popover content on hover', async ({ pageManager }) => {
        await pageManager.onPopoverPage().hoverPopover('on hover')
        await expect(pageManager.onPopoverPage().popoverContent).toBeVisible()
        await expect(pageManager.onPopoverPage().popoverContent).toContainText('Hello, how are you today?')
    })

    test('should open a template popover with tabs @smoke', async ({ pageManager }) => {
        await pageManager.onPopoverPage().openTemplatePopover('With tabs')
        await expect(pageManager.onPopoverPage().popoverContent).toBeVisible()
        await expect(pageManager.onPopoverPage().popoverContent).toContainText("What's up?")
    })

    test('should open a template popover with form', async ({ pageManager }) => {
        await pageManager.onPopoverPage().openTemplatePopover('With form')
        await expect(pageManager.onPopoverPage().popoverContent).toBeVisible()
        await expect(pageManager.onPopoverPage().popoverContent.getByPlaceholder('Recipients')).toBeVisible()
    })

})
