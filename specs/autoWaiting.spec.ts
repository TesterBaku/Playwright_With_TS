import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
        await page.setContent(`
            <button id="trigger">Button Triggering AJAX Request</button>
            <div class="bg-success"></div>
            <script>
                document.getElementById('trigger').addEventListener('click', () => {
                    setTimeout(() => {
                        document.querySelector('.bg-success').textContent = 'Data loaded with AJAX get request.';
                    }, 1500);
                });
            </script>
        `)
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

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 5000 })

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})