import { test, expect } from '../test-options'

test.describe('Tooltip', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().tooltipPage()
    })

    test('should show tooltip text on Top placement hover @smoke', async ({ pageManager }) => {
        await pageManager.onTooltipPage().hoverButtonInCard('placements', 'Top')
        await expect(pageManager.onTooltipPage().tooltip).toHaveText('This is a tooltip')
    })

    test('should show tooltip on Right placement hover', async ({ pageManager }) => {
        await pageManager.onTooltipPage().hoverButtonInCard('placements', 'Right')
        await expect(pageManager.onTooltipPage().tooltip).toHaveText('This is a tooltip')
    })

    test('should show tooltip on Bottom placement hover', async ({ pageManager }) => {
        await pageManager.onTooltipPage().hoverButtonInCard('placements', 'Bottom')
        await expect(pageManager.onTooltipPage().tooltip).toHaveText('This is a tooltip')
    })

    test('should show tooltip on Left placement hover', async ({ pageManager }) => {
        await pageManager.onTooltipPage().hoverButtonInCard('placements', 'Left')
        await expect(pageManager.onTooltipPage().tooltip).toHaveText('This is a tooltip')
    })

    test('should show tooltip with icon @smoke', async ({ pageManager }) => {
        await pageManager.onTooltipPage().hoverButtonInCard('icon', 'Show Tooltip')
        await expect(pageManager.onTooltipPage().tooltip).toBeVisible()
    })

})
