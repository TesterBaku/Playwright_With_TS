import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class WindowPage extends HelperBase {

    readonly windowFormCard = this.page.locator('nb-card', { hasText: 'Window Form' })
    readonly window = this.page.locator('nb-window')
    readonly windowCloseButton = this.window.locator('.buttons button').last()

    constructor(page: Page) {
        super(page)
    }

    async openWindowForm(): Promise<void> {
        await this.windowFormCard.getByRole('button', { name: 'Open window form' }).click()
        await this.window.waitFor({ state: 'visible' })
    }

    async openWindowWithTemplate(): Promise<void> {
        await this.windowFormCard.getByRole('button', { name: 'Open window with template' }).click()
        await this.window.waitFor({ state: 'visible' })
    }

    async closeWindow(): Promise<void> {
        await this.windowCloseButton.click()
        await this.window.waitFor({ state: 'hidden' })
    }
}
