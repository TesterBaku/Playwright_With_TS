import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DialogPage extends HelperBase {

    readonly openDialogCard = this.page.locator('nb-card', { hasText: 'Open Dialog' }).first()
    readonly returnResultCard = this.page.locator('nb-card', { hasText: 'Return Result From Dialog' })

    // Dialog overlay elements
    readonly dialog = this.page.locator('nb-dialog-container')
    readonly dialogDismissButton = this.dialog.getByRole('button', { name: 'Dismiss Dialog' })
    readonly dialogCloseButton = this.dialog.getByRole('button', { name: 'Close Dialog' })
    readonly namesList = this.returnResultCard.locator('ul li')

    constructor(page: Page) {
        super(page)
    }

    async openDialogWithComponent(): Promise<void> {
        await this.openDialogCard.getByRole('button', { name: 'Open Dialog with component' }).click()
        await this.dialog.waitFor({ state: 'visible' })
    }

    async dismissDialog(): Promise<void> {
        await this.dialogDismissButton.click()
        await this.dialog.waitFor({ state: 'hidden' })
    }

    async openNamePrompt(): Promise<void> {
        await this.returnResultCard.getByRole('button', { name: 'Enter Name' }).click()
        await this.dialog.waitFor({ state: 'visible' })
    }

    async submitName(name: string): Promise<void> {
        await this.dialog.getByPlaceholder('Name').fill(name)
        await this.dialog.getByRole('button', { name: 'Submit' }).click()
        await this.dialog.waitFor({ state: 'hidden' })
    }

    async cancelNamePrompt(): Promise<void> {
        await this.dialog.getByRole('button', { name: 'Cancel' }).click()
        await this.dialog.waitFor({ state: 'hidden' })
    }
}
