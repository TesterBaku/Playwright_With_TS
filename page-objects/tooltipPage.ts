import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class TooltipPage extends HelperBase {

    readonly placementsCard = this.page.locator('nb-card', { hasText: 'Tooltip Placements' })
    readonly iconCard = this.page.locator('nb-card', { hasText: 'Tooltip With Icon' })
    readonly coloredCard = this.page.locator('nb-card', { hasText: 'Colored Tooltips' })
    readonly tooltip = this.page.locator('nb-tooltip')

    constructor(page: Page) {
        super(page)
    }

    async hoverButtonInCard(card: 'placements' | 'icon' | 'colored', buttonName: string): Promise<void> {
        const cardLocator = {
            placements: this.placementsCard,
            icon: this.iconCard,
            colored: this.coloredCard,
        }[card]
        await cardLocator.getByRole('button', { name: buttonName }).first().hover()
        await this.tooltip.waitFor({ state: 'visible' })
    }
}
