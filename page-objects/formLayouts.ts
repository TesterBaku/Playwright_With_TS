import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class FormLayouts extends HelperBase {

    // Scoped container locators — public so tests can assert against child elements
    readonly usingTheGridCard = this.page.locator('nb-card', { hasText: 'Using the Grid' })
    readonly inlineFormCard = this.page.locator('nb-card', { hasText: 'Inline form' })

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridForm(email: string, password: string, option: string): Promise<void> {
        await this.usingTheGridCard.getByRole('textbox', { name: 'Email' }).fill(email)
        await this.usingTheGridCard.getByRole('textbox', { name: 'Password' }).fill(password)
        await this.usingTheGridCard.getByRole('radio', { name: option }).check({ force: true })
        await this.usingTheGridCard.getByRole('button', { name: 'Sign in' }).click()
    }

    async submitInlineForm(name: string, email: string, rememberMe: boolean): Promise<void> {
        await this.inlineFormCard.getByRole('textbox', { name: 'Jane Doe' }).fill(name)
        await this.inlineFormCard.getByRole('textbox', { name: 'Email' }).fill(email)
        if (rememberMe) {
            await this.inlineFormCard.getByRole('checkbox').check({ force: true })
        }
        await this.inlineFormCard.getByRole('button', { name: 'Submit' }).click()
    }

}