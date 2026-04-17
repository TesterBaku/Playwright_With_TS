# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo is an Angular 14 (ngx-admin) application that serves as the test target, plus a full Playwright test suite. The Angular app lives in `src/` and the tests in `tests/`.

## Commands

```bash
# Start the Angular dev server (required before running tests)
npm run start                        # serves on http://localhost:4200

# Run tests
npx playwright test                  # all tests, all configured projects
npx playwright test tests/usePageObjects.spec.ts   # single file
npx playwright test --project=chromium             # single browser
npx playwright test --grep @smoke                  # tagged tests

# Named npm scripts
npm run pageObjects-chrome           # usePageObjects.spec.ts in chromium
npm run pageObjects-firefox          # usePageObjects.spec.ts in firefox
npm run pageObjects-all              # both browsers, sequential
npm run pageObjects-all-parallel     # both browsers, parallel
npm run autoWait-dev                 # auto-waiting tests against external URL

# View HTML report
npx playwright show-report
```

## Test Architecture

### Page Object Model

`page-objects/` uses a **PageManager facade** pattern:

- [HelperBase](page-objects/helperBase.ts) — base class with shared utilities (e.g., `waitForNumberOfSeconds`). All page objects extend this.
- [PageManager](page-objects/pageManager.ts) — single entry point returned by the `pageManager` fixture. Exposes typed accessors: `navigateTo()`, `formLayoutsPage()`, `onDatePickerPage()`.
- Individual page classes (NavigationPage, FormLayouts, DatePickerPage) encapsulate locators and actions for their respective UI areas.

### Custom Fixtures

[test-options.ts](test-options.ts) extends the base Playwright `test` with three fixtures:

| Fixture | Type | Purpose |
|---|---|---|
| `globalsQaURL` | option (string) | Override URL for external test sites |
| `formLayoutsPage` | auto | Navigates to Forms → Form Layouts before each test |
| `pageManager` | scope: test | Provides a ready-to-use `PageManager` instance |

Import the extended `test` from `test-options.ts` to use these fixtures.

### Playwright Configuration

[playwright.config.ts](playwright.config.ts) defines the following projects:

| Project | Browser / Device | Notes |
|---|---|---|
| `chromium` | Desktop Chrome | General tests |
| `firefox` | Desktop Firefox | General tests |
| `webkit` | Desktop Safari | General tests |
| `pageObjectsFullScreen` | Chromium 1920×1080 | Scoped to `usePageObjects.spec.ts` |
| `mobile` | iPhone 13 Pro | Scoped to `testMobile.spec.ts` |
| `dev` / `staging` | Chromium | Environment-specific via `BASE_URL` env var |

**Base URL** is resolved from env vars: `DEV` → `localhost:4201`, `Staging` → `localhost:4202`, default → `localhost:4200`.

The web server (`npm run start`) auto-starts when tests run locally.

## Environment Variables

Credentials and URLs are stored in [.env](.env) (loaded via `dotenv`):

```
URL=http://uitestingplayground.com//ajax
USERNAME='test@test.com'
PASSWORD='Welcome1'
```

## Test Data & Conventions

- Use `@faker-js/faker` for random test data (see `tests/usePageObjects.spec.ts` for examples).
- Tag smoke tests with `@smoke` in the test title.
- Screenshots are saved to `screenshots/` with timestamp-based filenames.
- Traces are captured on first retry; HTML report goes to `playwright-report/`.
