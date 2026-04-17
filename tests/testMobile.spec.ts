import { test, expect } from '@playwright/test';

test('input fields', async ({ page }, testInfo) => {
    await page.goto('/');
    if (testInfo.project.name === 'mobile') {
        await page.locator('.sidebar-toggle').click();
    }

    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
    if (testInfo.project.name === 'mobile') {
        await page.locator('.sidebar-toggle').click();
    }

    const usingTheGridEmailInpit = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" })

    await usingTheGridEmailInpit.fill('test@test.com')
    await usingTheGridEmailInpit.clear()
    await usingTheGridEmailInpit.pressSequentially('test2@test.com')
})
