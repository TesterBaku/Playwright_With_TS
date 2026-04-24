import { test, expect } from '../test-options'

test.describe('Charts — Echarts', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().chartsPage()
    })

    test('should render the Pie chart card @smoke', async ({ page }) => {
        await expect(page.locator('nb-card', { hasText: 'Pie' })).toBeVisible()
        await expect(page.locator('ngx-echarts-pie')).toBeVisible()
    })

    test('should render the Bar chart card @smoke', async ({ page }) => {
        await expect(page.locator('nb-card', { hasText: 'Bar' }).first()).toBeVisible()
        await expect(page.locator('ngx-echarts-bar')).toBeVisible()
    })

    test('should render the Line chart card', async ({ page }) => {
        await expect(page.locator('nb-card', { hasText: 'Line' })).toBeVisible()
        await expect(page.locator('ngx-echarts-line')).toBeVisible()
    })

    test('should render all seven chart cards', async ({ page }) => {
        const chartComponents = [
            'ngx-echarts-pie',
            'ngx-echarts-bar',
            'ngx-echarts-line',
            'ngx-echarts-multiple-xaxis',
            'ngx-echarts-area-stack',
            'ngx-echarts-bar-animation',
            'ngx-echarts-radar',
        ]
        for (const component of chartComponents) {
            await expect(page.locator(component)).toBeVisible()
        }
    })

})
