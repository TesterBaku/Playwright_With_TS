# Full App Coverage — Test Plan

## Phase 0 — Cleanup

- [x] Delete `tests/seed.spec.ts` (empty scaffold)
- [x] Delete `tests/testWithFixture.spec.ts` (duplicates usePageObjects.spec.ts)
- [x] Clean `tests/uiComponents.spec.ts` — removed: checkboxes, tooltips, dialog box, web tables, date picker; kept: input fields, radio buttons, Lists and dropdowns, sliders

## Phase 1 — Navigation + PageManager Wiring

- [x] Add navigation methods to `page-objects/navigationPage.ts`
- [x] Create all page object files
- [x] Register all new pages in `page-objects/pageManager.ts`

## Phase 2 — P0 Dialog

- [x] `page-objects/dialogPage.ts`
- [x] `tests/dialog.spec.ts`

## Phase 3 — P1 Interactive Components

- [x] `page-objects/toastrPage.ts` + `tests/toastr.spec.ts`
- [x] `page-objects/windowPage.ts` + `tests/window.spec.ts`
- [x] `page-objects/tooltipPage.ts` + `tests/tooltip.spec.ts`
- [x] `page-objects/popoverPage.ts` + `tests/popover.spec.ts`
- [x] `page-objects/calendarPage.ts` + `tests/calendar.spec.ts`
- [x] `page-objects/treeGridPage.ts` + `tests/treeGrid.spec.ts`

## Phase 4 — P2 Visual Pages

- [x] `tests/dashboard.spec.ts`
- [x] `tests/charts.spec.ts`

## Phase 5 — Verify

- [x] `npx tsc --noEmit` passes
- [x] `npx playwright test --project=chromium` — 48/48 passed

## Review

All 48 tests pass in Chromium. 3 bugs found and fixed during the run:
1. `selectGroupMenuItem` used substring `getByTitle` — "Charts" matched "Echarts". Fixed with `{ exact: true }`.
2. Tooltip icon card has two "Show Tooltip" buttons — ambiguous locator. Fixed with `.first()`.
3. Nebular window close button is inside `.buttons` div in `nb-card-header`, not a `nb-window-header`. Fixed selector to `.buttons button`.
