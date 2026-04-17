# Test Architecture

## Page Object Model

`page-objects/` uses a **PageManager facade** pattern:

- [helperBase.ts](../../page-objects/helperBase.ts) — base class with shared utilities (e.g., `waitForNumberOfSeconds`). All page objects extend this.
- [pageManager.ts](../../page-objects/pageManager.ts) — single entry point returned by the `pageManager` fixture. Exposes typed accessors: `navigateTo()`, `formLayoutsPage()`, `onDatePickerPage()`.
- Individual page classes (NavigationPage, FormLayouts, DatePickerPage) encapsulate locators and actions for their respective UI areas.

## Custom Fixtures

[test-options.ts](../../test-options.ts) extends the base Playwright `test` with three fixtures:

| Fixture | Type | Purpose |
|---|---|---|
| `globalsQaURL` | option (string) | Override URL for external test sites |
| `formLayoutsPage` | auto | Navigates to Forms → Form Layouts before each test |
| `pageManager` | scope: test | Provides a ready-to-use `PageManager` instance |

Import the extended `test` from `test-options.ts` to use these fixtures instead of the base Playwright `test`.

## Playwright Configuration

[playwright.config.ts](../../playwright.config.ts) defines the following projects:

| Project | Browser / Device | Notes |
|---|---|---|
| `chromium` | Desktop Chrome | General tests |
| `firefox` | Desktop Firefox | General tests |
| `webkit` | Desktop Safari | General tests |
| `pageObjectsFullScreen` | Chromium 1920×1080 | Scoped to `usePageObjects.spec.ts` |
| `mobile` | iPhone 13 Pro | Scoped to `testMobile.spec.ts` |
| `dev` / `staging` | Chromium | Environment-specific via `BASE_URL` env var |

The web server (`npm run start`) auto-starts when tests run locally. Traces captured on first retry; HTML report at `playwright-report/`.

## Conventions

- Use `@faker-js/faker` for random test data (see `tests/usePageObjects.spec.ts` for examples).
- Tag smoke tests with `@smoke` in the test title.
- Screenshots saved to `screenshots/` with timestamp-based filenames.
