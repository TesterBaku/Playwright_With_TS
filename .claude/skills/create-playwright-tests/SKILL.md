# Skill: create-playwright-tests

**Purpose:** Create new page objects and test files based on the test plan produced by the `analyze-app` skill. Follows all conventions in `.claude/rules/test-writing.md` and `.claude/rules/architecture.md`.

**When to load this skill:** After the `analyze-app` skill has produced a confirmed test plan.

**Prerequisite:** Read `.claude/rules/test-writing.md` and `.claude/rules/architecture.md` before proceeding.

---

## Execution Steps

### Step 1 — Load Context

Before writing any code:

1. Read `page-objects/helperBase.ts` — understand the base class API
2. Read `page-objects/pageManager.ts` — understand how to register a new page
3. Read `page-objects/navigationPage.ts` — understand navigation method pattern
4. Read one existing page object (e.g., `page-objects/formLayouts.ts`) — as a reference implementation
5. Read one existing test file (e.g., `tests/usePageObjects.spec.ts`) — as a reference test

### Step 2 — Create Page Objects (one at a time)

For each page that needs a new page object (from the test plan):

**Template:**
```typescript
import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class <PageName>Page extends HelperBase {
  // Locators — use semantic selectors per rules/test-writing.md
  readonly <element> = this.page.getByRole('<role>', { name: '<name>' })

  constructor(page: Page) {
    super(page)
  }

  // Action methods — no assertions here
  async <actionName>(<params>): Promise<void> {
    // implementation
  }
}
```

**Rules:**
- Locators as `readonly` class properties
- Methods are verb-based: `fillForm()`, `submitForm()`, `selectOption()`
- No `expect()` calls inside page objects
- Use scoped locators for tables/cards: `this.page.locator('nb-card', { hasText: 'Title' })`

### Step 3 — Register in PageManager

After creating each page object class, add it to `page-objects/pageManager.ts`:

1. Import the new class at the top
2. Add a private field: `private readonly _myFeaturePage: MyFeaturePage`
3. Instantiate in constructor: `this._myFeaturePage = new MyFeaturePage(this.page)`
4. Add a public accessor: `myFeaturePage() { return this._myFeaturePage }`

### Step 4 — Create Test Files

For each feature from the test plan, create `tests/<featureName>.spec.ts`.

**Template:**
```typescript
import { test, expect } from '../test-options'
import { faker } from '@faker-js/faker'

test.describe('<Feature Area>', () => {

  test('<scenario description> @smoke', async ({ pageManager }) => {
    // Navigate
    await pageManager.navigateTo().<featurePage>()

    // Act
    await pageManager.<featurePage>().<action>()

    // Assert
    await expect(<locator>).toBeVisible()
  })

  test('<another scenario>', async ({ pageManager }) => {
    // ...
  })

})
```

**Per-test checklist:**
- [ ] Starts with navigation to the feature page
- [ ] Uses `pageManager` fixture exclusively (no raw `page` access unless unavoidable)
- [ ] Uses `faker` for any input data
- [ ] `@smoke` tag on the happy path test
- [ ] Assertions are specific (exact text, role, value — not just visibility)
- [ ] Test is fully independent (no shared state with other tests)

### Step 5 — Scenario Coverage Targets

For each page, create tests that cover at minimum:

| Page Type | Required Scenarios |
|---|---|
| **Forms** | Fill valid data → submit, Leave required field blank → see validation error |
| **Tables** | View rows, Filter/search, Create row, Edit row, Delete row |
| **Modals/Dialogs** | Open, Confirm action, Cancel/dismiss |
| **Toasts/Notifications** | Trigger, Verify message text, Verify disappears |
| **Date Pickers** | Select specific date, Navigate months, Select date range |
| **Dropdowns** | Open, Select option, Verify selection reflects in UI |

### Step 6 — Self-Review Checklist

Before finishing, verify each new file:

- [ ] Imports from `../test-options`, not `@playwright/test`
- [ ] All selectors follow priority order (role > label > placeholder > text > testid > css)
- [ ] No `waitForTimeout` calls
- [ ] All page object methods have no `expect()` calls
- [ ] PageManager updated with new page accessor
- [ ] At least one `@smoke` test per feature

### Step 7 — Compile Check

After creating all files, run TypeScript check:
```bash
npx tsc --noEmit
```

Fix any type errors before proceeding to test execution.

---

## Output Contract

This skill outputs:
1. New/updated files in `page-objects/`
2. New files in `tests/`
3. Updated `page-objects/pageManager.ts`

These are consumed by the `run-and-fix-tests` skill in the next phase.
