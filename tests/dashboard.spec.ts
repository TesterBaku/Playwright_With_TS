import { test, expect } from '../test-options'

test.describe('IoT Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' })
        await page.waitForURL('**/iot-dashboard')
    })

    test('should render the status cards @smoke', async ({ page }) => {
        await expect(page.locator('ngx-status-card').first()).toBeVisible()
        await expect(page.locator('ngx-status-card')).toHaveCount(4)
    })

    test('should render the temperature component @smoke', async ({ page }) => {
        await expect(page.locator('ngx-temperature')).toBeVisible()
    })

    test('should render the electricity component', async ({ page }) => {
        await expect(page.locator('ngx-electricity')).toBeVisible()
    })

    test('should interact with the temperature slider', async ({ page }) => {
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        await tempGauge.evaluate(node => {
            node.setAttribute('cx', '232.630')
            node.setAttribute('cy', '232.630')
        })
        await tempGauge.click()

        const tempGaugeBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempGaugeBox.scrollIntoViewIfNeeded()

        const box = await tempGaugeBox.boundingBox()
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2

        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x + 100, y)
        await page.mouse.move(x + 100, y + 100)
        await page.mouse.up()
        await expect(tempGaugeBox).toContainText('30')
    })

})
