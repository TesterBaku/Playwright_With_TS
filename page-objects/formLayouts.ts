import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayouts extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionTetx: string) {
        const usingTheGridEmailForm = this.page.locator('nb-card', { hasText: 'Using the Grid' })
        await usingTheGridEmailForm.getByRole('textbox', { name: "Email" }).fill(email)
        await usingTheGridEmailForm.getByRole('textbox', { name: "Password" }).fill(password)
        await usingTheGridEmailForm.getByRole('radio', { name: optionTetx }).check({ force: true })
        await usingTheGridEmailForm.getByRole('button', { name: 'Sign in' }).click()

    }

    /**
     * This method fills the inline form with provided name, email and checks the checkbox based on the boolean value
     * @param name - should be first and last name
     * @param email - valid email for test user
     * @param checkBox - boolean value to check or uncheck the checkbox
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, checkBox: boolean) {
        const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' })
        await inlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(name)
        await inlineForm.getByRole('textbox', { name: "Email" }).fill(email)
        if (checkBox) {
            await inlineForm.getByRole('checkbox').check({ force: true })
        }
        await inlineForm.getByRole('button', { name: 'Submit' }).click()
    }

}