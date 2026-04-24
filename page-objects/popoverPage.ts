import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class PopoverPage extends HelperBase {

    readonly simplePopoversCard = this.page.locator('nb-card', { hasText: 'Simple Popovers' })
    readonly templatePopoversCard = this.page.locator('nb-card', { hasText: 'Template Popovers' })
    readonly popoverContent = this.page.locator('nb-popover')

    constructor(page: Page) {
        super(page)
    }

    async clickPopover(buttonName: string): Promise<void> {
        await this.simplePopoversCard.getByRole('button', { name: buttonName }).click()
        await this.popoverContent.waitFor({ state: 'visible' })
    }

    async hoverPopover(buttonName: string): Promise<void> {
        await this.simplePopoversCard.getByRole('button', { name: buttonName }).hover()
        await this.popoverContent.waitFor({ state: 'visible' })
    }

    async openTemplatePopover(buttonName: string): Promise<void> {
        await this.templatePopoversCard.getByRole('button', { name: buttonName }).click()
        await this.popoverContent.waitFor({ state: 'visible' })
    }
}
