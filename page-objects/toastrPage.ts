import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class ToastrPage extends HelperBase {

    readonly titleInput = this.page.locator('input[name="title"]')
    readonly contentInput = this.page.locator('input[name="content"]')
    readonly showToastButton = this.page.getByRole('button', { name: 'Show toast' })
    readonly randomToastButton = this.page.getByRole('button', { name: 'Random toast' })
    readonly toastContainer = this.page.locator('nb-toast')

    constructor(page: Page) {
        super(page)
    }

    async setTitle(title: string): Promise<void> {
        await this.titleInput.clear()
        await this.titleInput.fill(title)
    }

    async setContent(content: string): Promise<void> {
        await this.contentInput.clear()
        await this.contentInput.fill(content)
    }

    async showToast(): Promise<void> {
        await this.showToastButton.click()
        await this.toastContainer.waitFor({ state: 'visible' })
    }

    async showRandomToast(): Promise<void> {
        await this.randomToastButton.click()
        await this.toastContainer.waitFor({ state: 'visible' })
    }

    async setCheckbox(label: string, checked: boolean): Promise<void> {
        const checkbox = this.page.getByRole('checkbox', { name: label })
        if (checked) {
            await checkbox.check({ force: true })
        } else {
            await checkbox.uncheck({ force: true })
        }
    }
}
