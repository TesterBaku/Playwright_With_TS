import { Page, Locator } from '@playwright/test'
import { HelperBase } from './helperBase'

export class SmartTablePage extends HelperBase {

    private readonly table = this.page.locator('ng2-smart-table')

    constructor(page: Page) {
        super(page)
    }

    // --- Exposed locators for test assertions ---

    rowByText(text: string): Locator {
        return this.table.getByRole('row').filter({ hasText: text })
    }

    visibleDataRows(): Locator {
        // Data rows have cells but are not the header row
        return this.table.locator('tbody').getByRole('row')
    }

    // --- Actions ---

    async addNewRow(id: string, firstName: string, lastName: string, username: string, email: string, age: string): Promise<void> {
        // Open add form — library stable class on the header add button
        await this.table.locator('a.ng2-smart-action-add-add').click()
        // ng2-smart-table renders the create form in thead as <tr ng2-st-thead-form-row>
        const addRow = this.table.locator('[ng2-st-thead-form-row]')
        const inputs = addRow.getByRole('textbox')
        await inputs.nth(0).fill(id)
        await inputs.nth(1).fill(firstName)
        await inputs.nth(2).fill(lastName)
        await inputs.nth(3).fill(username)
        await inputs.nth(4).fill(email)
        await inputs.nth(5).fill(age)
        // Save new row — inside ng2-st-actions component in the add row
        await addRow.locator('ng2-st-actions .ng2-smart-action-add-create').click()
    }

    async updateAgeByFirstName(firstName: string, newAge: string): Promise<void> {
        const row = this.table.getByRole('row').filter({ hasText: firstName })
        await row.locator('a.ng2-smart-action-edit-edit').click()
        // After edit mode, the row's cells become inputs — Age is last
        const editingRow = this.table.locator('tbody').getByRole('row').filter({ has: this.page.getByRole('textbox') })
        const ageInput = editingRow.getByRole('textbox').last()
        await ageInput.clear()
        await ageInput.fill(newAge)
        await editingRow.locator('a.ng2-smart-action-edit-save').click()
    }

    async deleteRowByFirstName(firstName: string): Promise<void> {
        const row = this.table.getByRole('row').filter({ hasText: firstName })
        await row.locator('a.ng2-smart-action-delete-delete').click()
    }

    async filterByColumn(columnTitle: string, value: string): Promise<void> {
        const columnIndex = await this.getColumnIndex(columnTitle)
        const filterInputs = this.table.locator('thead tr.ng2-smart-filters').getByRole('textbox')
        await filterInputs.nth(columnIndex).fill(value)
        // No explicit wait needed — web-first assertions in the test handle timing
    }

    // --- Private helpers ---

    private async getColumnIndex(columnTitle: string): Promise<number> {
        // Target the title row specifically (not filters row) via its Angular attribute
        const sortElements = this.table.locator(
            '[ng2-st-thead-titles-row] .ng2-smart-sort-link, [ng2-st-thead-titles-row] .ng2-smart-sort'
        )
        // Wait for the title row to be rendered before counting — count() is not web-first
        await sortElements.first().waitFor({ state: 'visible' })
        const count = await sortElements.count()
        for (let i = 0; i < count; i++) {
            const text = await sortElements.nth(i).textContent()
            if (text?.trim() === columnTitle) return i
        }
        throw new Error(`Column "${columnTitle}" not found in smart table`)
    }
}


