# Bug Fixing Rules for Test Failures

Apply when diagnosing and fixing failures from `npx playwright test`.

---

## Step 1 — Read the Full Error Output

Before touching any code, extract these four things from the failure output:

1. **Test name** — which test failed
2. **File + line** — where the failure occurred
3. **Error type** — timeout / assertion mismatch / element not found / navigation / unexpected value
4. **Expected vs received** — what was expected, what actually happened

---

## Step 2 — Classify the Failure

| Symptom | Most Likely Cause |
|---|---|
| `Timeout: waiting for locator(...)` | Selector is wrong or element loads async |
| `Expected: "x", Received: "y"` | Assertion targets wrong element or stale text |
| `locator.click: Element is not visible` | Page hasn't navigated or element is hidden |
| `Cannot read properties of undefined` | Async race — action ran before page was ready |
| `net::ERR_CONNECTION_REFUSED` | App server not running |
| `Expected 1 element, got 0` | Selector too specific or wrong scope |

---

## Step 3 — Fix Strategy by Type

### Selector Issues
```typescript
// Wrong: brittle generated class
await page.locator('.nb-form-control-container').click()

// Right: semantic role or visible text
await page.getByRole('button', { name: 'Sign In' }).click()
await page.getByLabel('Email address').fill(email)
```

Use browser DevTools on `http://localhost:4200` to inspect the element and validate a selector before committing it.

### Timing / Async Issues
```typescript
// Wrong: fixed wait
await page.waitForTimeout(3000)

// Right: wait for element state
await page.locator('selector').waitFor({ state: 'visible' })

// Right: wait for URL
await page.waitForURL('**/target-path')

// Right: wait for network
await page.waitForLoadState('networkidle')
```

### Wrong Scope
When testing inside a widget/card, scope the locator:
```typescript
const card = page.locator('nb-card', { hasText: 'Using the Grid' })
await card.getByRole('button', { name: 'Submit' }).click()
```

### Navigation Not Completing
Ensure navigation method awaits load:
```typescript
await page.goto('/')
await page.waitForLoadState('domcontentloaded')
await page.getByText('Forms').click()
await page.waitForURL('**/forms/**')
```

### Dropdown / Overlay Timing
```typescript
// Wait for the overlay to appear before interacting
const dropdown = page.locator('nb-option-list')
await dropdown.waitFor({ state: 'visible' })
await dropdown.locator('nb-option', { hasText: 'Light' }).click()
```

---

## Step 4 — Verify the Fix

After applying a fix:

1. Run only the fixed test first:
   ```bash
   npx playwright test --grep "exact test name" --project=chromium
   ```

2. If it passes, run the full suite:
   ```bash
   npx playwright test
   ```

3. If a new failure appears, repeat Steps 1–3 for that failure.

---

## Step 5 — Loop Limit

- Maximum **5 fix iterations** per test before escalating to the user.
- If a test cannot be fixed in 5 attempts, leave a `TODO` comment in the test and move on.
- Do NOT modify app source code in `src/` to make a test pass — fix the test, not the app.

---

## Hard Rules

- **Never** use `waitForTimeout` as a fix — it is a smell, not a solution.
- **Never** modify `src/` to suppress a UI behaviour that the test is correctly catching.
- **Never** skip (`test.skip`) a failing test without a `// TODO:` comment explaining why.
- Always run the corrected test in isolation before running the full suite.
