import { test, expect } from '../test-options'

test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
})

test.describe('Form Layout Page @special', () => {
    test.describe.configure({ retries: 2 }) //override the global retries just for this describe block
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry > 0) {
            console.log(`This test is being retried ${testInfo.retry} time(s)`);
        }
        const usingTheGridEmailInpit = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInpit.fill('test@test.com')
        await usingTheGridEmailInpit.clear()
        await usingTheGridEmailInpit.pressSequentially('test2@test.com', { delay: 500 })

        //generic assertios
        const inputValue = await usingTheGridEmailInpit.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInpit).toHaveValue('test2@test.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridEmailForm = page.locator('nb-card', { hasText: 'Using the Grid' })

        //await usingTheGridEmailForm.getByLabel('Option 1').check({ force: true })
        await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).check({ force: true })
        const radioStatus = await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).isChecked()
        expect(radioStatus).toBeTruthy() //checks if the statement is true
        await expect(usingTheGridEmailForm.getByRole('radio', { name: "Option 1" })).toBeChecked()

        await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridEmailForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    //await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true }) // this will click and depending on current status will check or uncheck
    await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true }) //if the box is already checked this will do nothing as it only checks
    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked).toBeTruthy()
    }
})

test('Lists and dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
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

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCards = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCards.getByRole('button', { name: "Top" }).hover()

    //page.getByRole('tooltip') //only if you have a role tooltip created in your code
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')

})

test('dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //create a listener for the dialog box
    page.on('dialog', async dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        await dialog.accept()
    })

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.comm')
})

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1. get the row by any text in this row
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // 2. get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 3. test filter of the table

    const ages = ["20", "30", "40", "200"]
    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else { expect(cellValue?.trim()).toEqual(age) }
        }
    }
})

test('date picker', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calenderInputFiled = page.getByPlaceholder('Form Picker')
    await calenderInputFiled.click()

    let date = new Date()
    date.setDate(date.getDate() + 21)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('default', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('default', { month: 'long' })
    const expectedYear = date.getFullYear().toString()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthYear = await page.locator('nb-calendar-view-mode').getByText(expectedYear).textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    while (calendarMonthYear != expectedMonthAndYear) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthYear = await page.locator('nb-calendar-view-mode').getByText(expectedYear).textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calenderInputFiled).toHaveValue(dateToAssert)
})

test('sliders', async ({ page }) => {

    //update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    // mouse movement
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