# Skill: run-and-fix-tests

**Purpose:** Run the full Playwright test suite, diagnose failures, apply targeted fixes, and loop until all tests pass or the iteration limit is reached.

**When to load this skill:** After new tests have been created by `create-playwright-tests`, or whenever asked to fix failing tests.

**Prerequisite:** Read `.claude/rules/bug-fixing.md` before proceeding.

---

## Execution Loop

Repeat the following cycle up to **5 times**. Stop early when all tests pass.

---

### Iteration Start: Run All Tests

```bash
npx playwright test --reporter=list
```

Capture the full output. Extract:
- Total passed / failed / skipped counts
- For each failure: test name, file, line, error type, error message

If **all pass** → exit the loop, proceed to commit.

If **failures exist** → continue to diagnosis.

---

### Diagnosis Phase

For each failing test, apply the classification from `.claude/rules/bug-fixing.md`:

1. **Read the test file** at the failing line
2. **Read the page object** used by that test
3. **Identify root cause** using the failure classification table in bug-fixing.md

Group failures by root cause type before fixing — fix the same class of problem together.

---

### Fix Phase (apply in this order)

#### Fix 1: Selector Issues
If the selector matches nothing or is too fragile:
- Replace with a higher-priority selector (role → label → placeholder → text)
- Use scoped locators when the target is inside a specific card/section

```typescript
// Fragile
this.page.locator('.input-full-width').nth(0)

// Resilient
this.page.getByLabel('Email')
// or scoped
this.page.locator('nb-card', { hasText: 'Basic form' }).getByLabel('Email')
```

#### Fix 2: Timing / Async Race
If an element exists but isn't ready when the action runs:
- Add `waitFor({ state: 'visible' })` before interaction
- Replace navigation waits with `waitForURL()` or `waitForLoadState()`

#### Fix 3: Wrong Assertion
If the assertion fails due to text mismatch or wrong element:
- Log the actual value first: use `console.log(await locator.textContent())`
- Adjust assertion to match actual rendered text
- If the app renders data differently than expected, update the assertion (do not change `src/`)

#### Fix 4: Scope / Context Issues
If actions are hitting the wrong element on the page:
- Narrow the locator scope to the specific container
- Use `within` pattern: `page.locator('nb-card').filter({ hasText: 'Title' }).locator('input')`

#### Fix 5: Navigation Incomplete
If page content isn't present after navigation:
- Add `await page.waitForURL('**/target-route')` after the navigation click
- Or add `await page.waitForLoadState('networkidle')`

---

### Verify Fix in Isolation

After fixing a test, verify the fix before re-running the full suite:

```bash
npx playwright test --grep "exact test name" --project=chromium
```

If isolated run passes → include in full suite run.
If isolated run still fails → try one more fix approach, then skip and mark with TODO.

---

### Skip Threshold

If a specific test has failed for **3 consecutive fix attempts**:
```typescript
test.skip('scenario that fails @smoke', async ({ pageManager }) => {
  // TODO: Skipped after 3 fix attempts. Root cause: <describe issue>
  // Needs investigation of: <specific selector/behavior>
})
```

Document the skip with enough context to resume later.

---

### Full Suite Re-run

After fixing all diagnosable failures, run the full suite:

```bash
npx playwright test
```

Parse results again. If failures remain and iteration count < 5, repeat from Diagnosis Phase.

---

### Loop Exit Conditions

| Condition | Action |
|---|---|
| All tests pass | Exit loop, proceed to commit |
| 5 iterations reached, tests still fail | Stop, report remaining failures to user, ask how to proceed |
| Only skipped tests remain | Exit loop, proceed to commit (skips are documented) |

---

### Post-Loop: TypeScript Check

Before committing, run:
```bash
npx tsc --noEmit
```

Fix any type errors. Do not commit code with TypeScript compile errors.

---

## Output Contract

This skill outputs:
- Fixed/updated files in `tests/` and `page-objects/`
- A summary: "X tests pass, Y skipped (with reasons)"

This output is consumed by the commit & PR creation phase of the QA agent.
