import { test } from '../test-options';
import { faker } from '@faker-js/faker';


// test.beforeEach(async ({ page }) => {
//     await page.goto('/');
// })


test('parametrized methods', async ({ pageManager }) => {
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@example.com`

    await pageManager.formLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await pageManager.formLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})