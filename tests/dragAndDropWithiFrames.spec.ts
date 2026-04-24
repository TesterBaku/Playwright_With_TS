import { expect } from '@playwright/test';
import { test } from '../test-options';


test('drag and drop', async ({ page, globalsQaURL }) => {
    await page.goto(globalsQaURL);
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', { hasText: "High Tatras 2" }).dragTo(frame.locator('#trash'))

    await frame.locator('li', { hasText: "High Tatras 4" }).dragTo(frame.locator('#trash'))

    await expect(frame.locator('#trash li h5')).toHaveCount(2)
    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})