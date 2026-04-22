# Playwright Best Practices

Sourced from: https://playwright.dev/docs/best-practices  
Apply to all files in `tests/` and `page-objects/`.

---

## Testing Philosophy

### Test user-visible behaviour
- Tests must verify what the **end user sees and interacts with** on screen.
- Never assert on implementation details: CSS classes, function names, array lengths, internal state.

### Make tests fully isolated
- Each test must be **completely independent**: its own local storage, session storage, cookies, data.
- Use `test.beforeEach` for shared setup (navigate to URL, log in), not shared mutable state between tests.
- Never rely on another test having run first.

### Avoid testing third-party dependencies
- Don't assert on external URLs or third-party servers you don't control.
- Use `page.route()` to mock external API calls and guarantee the response:
  ```typescript
  await page.route('**/api/external', route => route.fulfill({ status: 200, body: testData }))
  ```

---

## Locator Rules

### Selector priority (best → worst)
1. `getByRole('button', { name: 'Submit' })` — semantic, most resilient ✅
2. `getByLabel('Email address')` — for form inputs ✅
3. `getByPlaceholder('Enter email')` — for inputs without labels ✅
4. `getByText('Submit')` — text-only elements ✅
5. `getByTestId('submit-btn')` — when `data-testid` is available ✅
6. CSS selectors — **last resort only**, never use generated/dynamic class names ❌

### Chaining and filtering
```typescript
// Scope to a container first, then find the element within it
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' })
await product.getByRole('button', { name: 'Add to cart' }).click()
```

### Never use XPath or brittle CSS
```typescript
// ❌ Breaks when designer changes class names
page.locator('button.buttonIcon.episode-actions-later')

// ✅ Resilient to DOM changes
page.getByRole('button', { name: 'submit' })
```

---

## Assertion Rules

### Always use web-first assertions
Playwright's built-in assertions auto-wait and retry. Manual `isVisible()` checks do NOT wait.

```typescript
// ✅ Web-first — waits and retries automatically
await expect(page.getByText('welcome')).toBeVisible()

// ❌ Manual — returns immediately, no retry
expect(await page.getByText('welcome').isVisible()).toBe(true)
```

### Common assertions
```typescript
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
await expect(locator).toHaveText('exact text')
await expect(locator).toContainText('partial text')
await expect(locator).toHaveValue('expected value')
await expect(locator).toHaveCount(3)
await expect(locator).toBeChecked()
await expect(locator).toBeEnabled()
await expect(locator).toHaveCSS('background-color', 'rgb(255, 255, 255)')
```

### Use soft assertions for multi-check tests
```typescript
// Collects all failures before stopping
await expect.soft(page.getByTestId('status')).toHaveText('Success')
await expect.soft(page.getByTestId('name')).toHaveText('John')
// All soft assertion errors are reported at end of test
```

---

## Timing & Waiting Rules

### Never use `waitForTimeout` as a fix
```typescript
// ❌ Fixed sleep — flaky and slow
await page.waitForTimeout(3000)

// ✅ Wait for element state
await locator.waitFor({ state: 'visible' })

// ✅ Wait for URL change
await page.waitForURL('**/target-path')

// ✅ Wait for network idle
await page.waitForLoadState('networkidle')
```

---

## Test Structure Rules

### One concern per test
- Each test should verify a single, clearly named scenario.
- Prefer many small tests over one large test with multiple assertions.

### Use `test.describe` for grouping
```typescript
test.describe('Smart Table', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.navigateTo().smartTablePage()
  })

  test('should add a new row @smoke', async ({ pageManager, page }) => { /* ... */ })
  test('should edit an existing row @smoke', async ({ pageManager, page }) => { /* ... */ })
})
```

### Parallelism
- Tests in **different files** run in parallel by default.
- Tests in the **same file** run serially in the same worker.
- If tests in a file are fully independent, enable file-level parallelism:
  ```typescript
  test.describe.configure({ mode: 'parallel' })
  ```

---

## Debugging Rules

### Local debugging
- Use the **VS Code Playwright extension** — run tests in debug mode from the editor sidebar.
- Use `--debug` flag for the Playwright Inspector:
  ```bash
  npx playwright test example.spec.ts:9 --debug
  ```

### CI debugging
- Use **trace viewer** instead of videos/screenshots for CI failures.
- Traces are already configured to capture on first retry (`trace: 'on-first-retry'`).
- View a trace locally:
  ```bash
  npx playwright test --trace on
  npx playwright show-report
  ```

---

## Code Quality Rules

### Lint tests
- Use TypeScript (`.ts` extension) — the IDE catches mistakes before runtime.
- Use `@typescript-eslint/no-floating-promises` ESLint rule to catch missing `await` calls.
- Run `tsc --noEmit` in CI to validate function signatures.

### Keep Playwright up to date
```bash
npm install -D @playwright/test@latest
```
Staying current ensures tests run against the latest browser versions.

---

## CI/CD Rules

- Run tests on **every commit and pull request**.
- Use **Linux** on CI (cheaper than Windows/Mac runners).
- Install only the browsers you test against:
  ```bash
  # Instead of: npx playwright install --with-deps
  npx playwright install chromium --with-deps
  ```
- Use **sharding** to parallelize across machines:
  ```bash
  npx playwright test --shard=1/3
  ```
