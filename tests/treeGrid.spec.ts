import { test, expect } from '../test-options'

test.describe('Tree Grid', () => {

    test.beforeEach(async ({ pageManager }) => {
        await pageManager.navigateTo().treeGridPage()
    })

    test('should display all top-level rows on load @smoke', async ({ pageManager }) => {
        await expect(pageManager.onTreeGridPage().rowByName('Projects')).toBeVisible()
        await expect(pageManager.onTreeGridPage().rowByName('Reports')).toBeVisible()
        await expect(pageManager.onTreeGridPage().rowByName('Other')).toBeVisible()
    })

    test('should expand a row and show its children @smoke', async ({ pageManager }) => {
        await pageManager.onTreeGridPage().expandRowByName('Projects')
        await expect(pageManager.onTreeGridPage().rowByName('project-1.doc')).toBeVisible()
        await expect(pageManager.onTreeGridPage().rowByName('project-2.doc')).toBeVisible()
    })

    test('should filter rows by search term', async ({ pageManager }) => {
        await pageManager.onTreeGridPage().search('Report')
        await expect(pageManager.onTreeGridPage().rowByName('Reports')).toBeVisible()
        await expect(pageManager.onTreeGridPage().rowByName('Projects')).toHaveCount(0)
    })

    test('should expand Reports and show its child rows', async ({ pageManager }) => {
        await pageManager.onTreeGridPage().expandRowByName('Reports')
        await expect(pageManager.onTreeGridPage().rowByName('Report 1')).toBeVisible()
        await expect(pageManager.onTreeGridPage().rowByName('Report 2')).toBeVisible()
    })

})
