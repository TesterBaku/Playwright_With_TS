import { test, expect } from '../test-options'

test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
})

test.describe('Form Layout Page @special', () => {
    test.describe.configure({ retries: 2 })
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry > 0) {
            console.log(`This test is being retried ${testInfo.retry} time(s)`);
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 })

        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridEmailForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).check({ force: true })
        await expect(usingTheGridEmailForm.getByRole('radio', { name: "Option 1" })).toBeChecked()

        await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()
    })
})

test('Lists and dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    }
    await dropDownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != 'Corporate') {
            await dropDownMenu.click()
        }
    }
})

test('sliders', async ({ page }) => {
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
