import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
})

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click();

    // const text = await successButton.textContent()
    //await successButton.waitFor({ state: "attached" })
    //const text = await successButton.allTextContents()  //fails immediately because not waiting so we added wait (line 14)
    //expect(text).toEqual('Data loaded with AJAX get request.')
    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test('alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success')

    // wait for element
    //await page.waitForSelector('.bg-success')

    //wait for particular responce
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed ("NOT RECOMMENDED")
    await page.waitForLoadState("networkidle")

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})