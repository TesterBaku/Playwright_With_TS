import { test as base } from '@playwright/test';
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage?: string
    pageManager?: PageManager
}

export { expect } from '@playwright/test'

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', { option: true }],
    formLayoutsPage: async ({ page }, use) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
        await use('');
    },
    pageManager: async ({ page }, use) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const pm = new PageManager(page)
        await use(pm);
    }
});