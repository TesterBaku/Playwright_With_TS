import { expect, test } from '@playwright/test';

test.beforeAll(async () => {
    console.log('This is the beginning of the tests');
});

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
})


test('locator syntax rules', async ({ page }) => {
    // Locate by tag name
    await page.locator('input').first().click()

    // Locate by id
    //await page.locator('#inputEmail1').click();

    //by class values
    page.locator('.shape-rectangle');

    // by attribute name
    page.locator('[placeholder="Email"]');

    // by Class value (full)
    page.locator('[class="input-full-width size-medium shape-rectangle"]');

    //combine different types of locators
    page.locator('input#inputEmail1.shape-rectangle[placeholder="Email"]');

    // by XPath (NOT RECOMMENDED)
    page.locator('//input[@id="inputEmail1"]');

    // by partial text match
    page.locator(':text("Using")');

    // by exact text match
    page.locator(':text-is("Using the Grid")');
});

test('User facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid')
    await page.getByTitle('IoT Dashboard').click()
    //await page.getByTestId('SignIn').click()
})

test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()
    //least preferred - using indexes
    await page.locator('nb-card').nth(1).locator('nb-radio').nth(2).click()
})

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click()

    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click()

    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" }).getByRole('textbox', { name: "Email" }).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
});

test('Reusing the locators', async ({ page }) => {

    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const emailField = basicForm.getByRole('textbox', { name: "Email" })

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
});

test('extracting values', async ({ page }) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //get all txt values
    const allRadioButtonLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLabels).toContain("Option 1")

    //input value
    const emailFiled = basicForm.getByRole('textbox', { name: "Email" })
    await emailFiled.fill('test@test.com')
    const emailValue = await emailFiled.inputValue()
    expect(emailValue).toEqual('test@test.com')

    //attribute value
    const placeholderValue = await emailFiled.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')
    //general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    await expect(basicFormButton).toHaveText("Submit")

    //soft assertion
    await expect.soft(basicFormButton).toHaveText("Submit");
    await basicFormButton.click();
})