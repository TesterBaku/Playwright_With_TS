import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class SmartTablePage extends HelperBase {

    private readonly table = this.page.locator('ng2-smart-table')
    private readonly dataRows = this.table.locator('tbody tr.ng2-smart-row')
    private readonly filterInputs = this.table.locator('thead tr.ng2-smart-filters input')

    constructor(page: Page) {
        super(page)
    }

    async addNewRow(id: string, firstName: string, lastName: string, username: string, email: string, age: string): Promise<void> {
        await this.table.locator('a.ng2-smart-action-add-add').click()
        // ng2-smart-table renders the create form in thead as <tr ng2-st-thead-form-row>
        const addRow = this.table.locator('tr[ng2-st-thead-form-row]')
        await addRow.locator('input').nth(0).fill(id)
        await addRow.locator('input').nth(1).fill(firstName)
        await addRow.locator('input').nth(2).fill(lastName)
        await addRow.locator('input').nth(3).fill(username)
        await addRow.locator('input').nth(4).fill(email)
        await addRow.locator('input').nth(5).fill(age)
        await addRow.locator('a.ng2-smart-action-add-create').click()
    }

    async updateAgeByFirstName(firstName: string, newAge: string): Promise<void> {
        // Find and click edit; once in edit mode, the row text changes (name is in input)
        // so we capture the row before and use a broader locator for the edit actions
        await this.dataRows.filter({ hasText: firstName }).locator('a.ng2-smart-action-edit-edit').click()
        // After edit mode starts, find the row that now has an Age input
        const editingRow = this.table.locator('tbody tr.ng2-smart-row').filter({ has: this.page.locator('[placeholder="Age"]') })
        await editingRow.locator('[placeholder="Age"]').clear()
        await editingRow.locator('[placeholder="Age"]').fill(newAge)
        await editingRow.locator('a.ng2-smart-action-edit-save').click()
    }

    async deleteRowByFirstName(firstName: string): Promise<void> {
        const row = this.dataRows.filter({ hasText: firstName })
        await row.locator('a.ng2-smart-action-delete-delete').click()
    }

    async filterByAge(age: string): Promise<void> {
        // Age is the last (6th, index 5) filter column
        await this.filterInputs.nth(5).fill(age)
        await this.waitForNumberOfSeconds(1)
    }

    async filterByEmail(email: string): Promise<void> {
        // Email is the 5th column (index 4)
        await this.filterInputs.nth(4).fill(email)
        await this.waitForNumberOfSeconds(1)
    }

    async getRowCount(): Promise<number> {
        return await this.dataRows.count()
    }

    async getRowTextByFirstName(firstName: string): Promise<string> {
        return await this.dataRows.filter({ hasText: firstName }).textContent() ?? ''
    }
}

