# Playwright Practice App

A Playwright end-to-end test suite built against a modified [ngx-admin](https://github.com/akveo/ngx-admin) Angular application. Used as a hands-on practice target for UI automation with the Page Object Model pattern.

Original app: [bondar-artem/pw-practice-app](https://github.com/bondar-artem/pw-practice-app)

---

## Stack

| Layer | Technology |
|---|---|
| App under test | Angular 15 (ngx-admin) |
| Test framework | Playwright |
| Language | TypeScript |
| Test data | @faker-js/faker |
| Config | dotenv |

---

## Project Structure

```
├── tests/               # Spec files (one per feature area)
├── page-objects/        # Page Object Model classes
│   ├── helperBase.ts    # Shared base class for all page objects
│   ├── pageManager.ts   # Central facade — single test entry point
│   └── *.ts             # Individual page classes
├── screenshots/         # Test screenshots (gitignored)
├── test-options.ts      # Custom fixtures extending Playwright's base test
├── playwright.config.ts # Projects, reporters, web server config
├── .env                 # Environment variables (not committed)
└── src/                 # Angular app source
```

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment variables

Create a `.env` file in the project root:

```
URL=http://uitestingplayground.com//ajax
USERNAME='test@test.com'
PASSWORD='Welcome1'
```

---

## Running Tests

```bash
# Start the Angular dev server (required for local test runs)
npm run start

# Run all tests across all configured projects
npx playwright test

# Run a single spec file
npx playwright test tests/usePageObjects.spec.ts

# Run against a single browser
npx playwright test --project=chromium

# Run smoke tests only
npx playwright test --grep @smoke

# View the HTML report after a run
npx playwright show-report
```

### Named npm scripts

| Script | What it runs |
|---|---|
| `npm run pageObjects-chrome` | `usePageObjects.spec.ts` in Chromium |
| `npm run pageObjects-firefox` | `usePageObjects.spec.ts` in Firefox |
| `npm run pageObjects-all` | Both browsers, sequential |
| `npm run pageObjects-all-parallel` | Both browsers, in parallel |
| `npm run autoWait-dev` | Auto-waiting tests against external URL |

---

## Playwright Projects

| Project | Browser / Device | Scope |
|---|---|---|
| `chromium` | Desktop Chrome | All tests |
| `firefox` | Desktop Firefox | All tests |
| `webkit` | Desktop Safari | All tests |
| `pageObjectsFullScreen` | Chrome 1920×1080 | `usePageObjects.spec.ts` |
| `mobile` | iPhone 13 Pro | `testMobile.spec.ts` |
| `dev` | Chrome → `localhost:4200` | Environment-specific |
| `staging` | Chrome → `localhost:4200` | Environment-specific |

---

## Test Coverage

| Spec file | Feature area |
|---|---|
| `usePageObjects.spec.ts` | Forms, date picker — main POM showcase |
| `smartTable.spec.ts` | Smart table CRUD |
| `calendar.spec.ts` | Calendar interactions |
| `charts.spec.ts` | Chart pages |
| `dashboard.spec.ts` | Dashboard widgets |
| `dialog.spec.ts` | Dialog components |
| `popover.spec.ts` | Popovers |
| `toastr.spec.ts` | Toast notifications |
| `tooltip.spec.ts` | Tooltips |
| `treeGrid.spec.ts` | Tree grid |
| `uiComponents.spec.ts` | General UI components |
| `window.spec.ts` | Window/tab handling |
| `dragAndDropWithiFrames.spec.ts` | Drag-and-drop inside iframes |
| `testMobile.spec.ts` | Mobile viewport tests |

---

## Page Object Model

All page classes extend `HelperBase` and expose action methods only — no assertions inside page objects. Tests access pages through a `PageManager` instance provided by the `pageManager` fixture:

```typescript
import { test, expect } from '../test-options'

test('should submit form @smoke', async ({ pageManager }) => {
  await pageManager.navigateTo().formLayoutsPage()
  await pageManager.onFormLayoutsPage().submitInlineForm('user@example.com', 'pass')
  await expect(page.getByText('Success')).toBeVisible()
})
```

---

## Custom Fixtures (`test-options.ts`)

| Fixture | Purpose |
|---|---|
| `globalsQaURL` | URL override for external test targets |
| `formLayoutsPage` | Auto-navigates to Forms → Form Layouts before each test |
| `pageManager` | Provides a ready-to-use `PageManager` instance |

Import from `../test-options` instead of `@playwright/test` in all test files.

---

## Automation Workflow

The `.claude/` directory contains an autonomous QA agent and skills for:

- **analyze-app** — maps app pages vs existing coverage, produces a test plan
- **create-playwright-tests** — generates POM-compliant tests
- **run-and-fix-tests** — execute → diagnose → fix loop (max 5 iterations)
- **create-pull-request** — opens a scoped PR per batch
- **address-pr-comments** — fetches and resolves review threads

Trigger the full workflow by telling Claude Code: `run the QA agent`.

---

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| New tests | `feature/QA-<N>-<description>` | `feature/QA-5-smart-table-tests` |
| Bug fixes | `bugfix/QA-<N>-<description>` | `bugfix/QA-6-datepicker-fix` |
| Maintenance | `chore/QA-<N>-<description>` | `chore/QA-7-update-config` |

All changes go through a PR — never push directly to `main`.
