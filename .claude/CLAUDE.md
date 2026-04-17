# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 14 (ngx-admin) application used as a Playwright test target. The Angular app lives in `src/`; tests in `tests/`; page objects in `page-objects/`.

See [rules/architecture.md](rules/architecture.md) for test architecture details.

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

## Environment Variables

Stored in [.env](.env) (loaded via `dotenv`):

```
URL=http://uitestingplayground.com//ajax
USERNAME='test@test.com'
PASSWORD='Welcome1'
```

Base URL is resolved from env vars at runtime: `DEV` → `localhost:4201`, `Staging` → `localhost:4202`, default → `localhost:4200`.
