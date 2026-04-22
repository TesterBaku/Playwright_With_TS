# Test Writing Rules

Apply to all files in `tests/` and `page-objects/`.

## Imports

Always import `test` and `expect` from `../test-options`, NOT from `@playwright/test`:

```typescript
import { test, expect } from '../test-options'
```

Use `@faker-js/faker` for all dynamic test data:

```typescript
import { faker } from '@faker-js/faker'
```

---

## File & Folder Conventions

| Artifact | Location | Pattern |
|---|---|---|
| Test files | `tests/` | `<featureName>.spec.ts` |
| Page objects | `page-objects/` | `<pageName>.ts` (camelCase) |
| Screenshots | `screenshots/` | `<testName>_<Date.now()>.png` |

---

## Test Structure

```typescript
import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('Feature Area', () => {

  test('should do something meaningful @smoke', async ({ pageManager }) => {
    await pageManager.navigateTo().featurePage()
    // actions via page object methods
    // assertions here in the test, not in page objects
    await expect(locator).toBeVisible()
  })

})
```

---

## Page Object Pattern

- Every page class **must extend `HelperBase`**
- Constructor receives `page: Page` and calls `super(page)`
- Locators defined as `readonly` class properties using `this.page.locator()`
- Methods represent **user actions only** — no assertions inside page objects
- Register the new page in `PageManager` via a typed accessor method

```typescript
import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class MyFeaturePage extends HelperBase {
  readonly someButton = this.page.getByRole('button', { name: 'Submit' })

  constructor(page: Page) {
    super(page)
  }

  async doSomething(value: string) {
    await this.someButton.click()
  }
}
```

---

## Selector Priority (best → worst)

1. `getByRole('button', { name: 'Submit' })` — semantic, most resilient
2. `getByLabel('Email address')` — for form inputs
3. `getByPlaceholder('Enter email')` — for inputs without visible labels
4. `getByText('Submit')` — for text-only elements
5. `getByTestId('submit-btn')` — when data-testid is available
6. `locator('css=...')` — **last resort only**, avoid generated class names

---

## Assertions

```typescript
// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()

// Text
await expect(locator).toHaveText('exact text')
await expect(locator).toContainText('partial text')

// Input value
await expect(locator).toHaveValue('expected value')

// Count
await expect(locator).toHaveCount(3)

// Use soft assertions when checking multiple things in one test
await expect.soft(locator1).toBeVisible()
await expect.soft(locator2).toHaveText('x')
// ...
expect(test.info().errors).toHaveLength(0)
```

---

## Test Data

```typescript
const email = faker.internet.email()
const firstName = faker.person.firstName()
const lastName = faker.person.lastName()
const password = faker.internet.password({ length: 12 })
```

- Fixed data for business-logic assertions (e.g., checking a specific label text)
- Faker data for everything that needs to be unique or realistic

---

## Tags

- `@smoke` — critical path tests that must always pass; included in CI fast-path runs
- Add in the test title string: `'user can submit form @smoke'`

---

## Wait Strategy

```typescript
// NEVER do this:
await page.waitForTimeout(2000)

// DO: wait for a specific element state
await locator.waitFor({ state: 'visible' })

// Or wait for URL change
await page.waitForURL('**/forms/form-layouts')

// Or wait for network idle after navigation
await page.waitForLoadState('networkidle')
```

---

## Screenshots (when needed)

```typescript
await page.screenshot({
  path: `screenshots/myTest_${Date.now()}.png`
})
```

---

## Anti-patterns to Avoid

- Do NOT assert inside page object methods
- Do NOT share state between tests (each test must be fully independent)
- Do NOT use `page.waitForTimeout()` — use explicit conditions
- Do NOT use generated/dynamic CSS classes as selectors
- Do NOT import from `@playwright/test` directly in test files
