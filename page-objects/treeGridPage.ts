import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class TreeGridPage extends HelperBase {

    readonly searchInput = this.page.locator('#search')
    readonly table = this.page.locator('table[nbtreegrid]')
    readonly allRows = this.page.locator('tr[nbtreegridrow]')

    constructor(page: Page) {
        super(page)
    }

    async search(term: string): Promise<void> {
        await this.searchInput.clear()
        await this.searchInput.fill(term)
    }

    rowByName(name: string) {
        return this.allRows.filter({ hasText: name })
    }

    async expandRowByName(name: string): Promise<void> {
        await this.rowByName(name).locator('nb-tree-grid-row-toggle').click()
    }

    async getVisibleRowNames(): Promise<string[]> {
        const names: string[] = []
        for (const row of await this.allRows.all()) {
            const text = await row.locator('td').first().textContent()
            if (text?.trim()) names.push(text.trim())
        }
        return names
    }
}
