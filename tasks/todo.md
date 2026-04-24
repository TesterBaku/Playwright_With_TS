# Task Todo

## Plan

- [x] Audit the current Angular upgrade constraints.
- [x] Choose Angular 15 as the first migration step.
- [x] Align Angular, CDK, Nebular, and TypeScript package versions.
- [x] Refresh the lockfile and installed packages.
- [x] Run focused Angular build and typecheck validation.

## Progress Notes

- Angular 15 is the smallest supported step that lines up with Nebular 11 and Angular CDK 15.
- Replaced the library with an in-app Smart Table implementation that preserves the test-facing DOM hooks.
- Installed Playwright browser binaries matching the pinned Playwright version.
- Stabilized the remaining test failures in `uiComponents`, `usePageObjects`, `dragAndDropWithiFrames`, and `autoWaiting`.

## Review

- Angular 15 / TypeScript 4.9 migration completed.
- `ng2-smart-table` was removed and replaced with a custom Smart Table implementation that preserved the existing Playwright-facing selectors and behavior.
- Validation completed successfully:
	- `npx ng build` passed.
	- `npx tsc --noEmit -p src/tsconfig.app.json` passed.
	- `npx tsc --noEmit -p tsconfig.json` passed.
	- `npx playwright test` passed with `148 passed`.