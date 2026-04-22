# Skill: analyze-app

**Purpose:** Analyze the Angular app structure and existing test coverage to produce a prioritized test plan with specific gaps identified.

**When to load this skill:** Before creating any new tests. Load via `read_file` on this file.

---

## Execution Steps

### Step 1 — Map Available App Pages

Read `src/app/pages/pages-menu.ts` to get the full navigation menu structure.
Read `src/app/pages/pages-routing.module.ts` to get all routed page components.

Produce a flat list of all pages in the format:
```
[Section] Page Name → route path
```

Example:
```
[Forms] Form Layouts → /pages/forms/form-layouts
[Forms] Datepicker → /pages/forms/datepicker
[Tables] Smart Table → /pages/tables/smart-table
[Modal & Overlays] Dialog → /pages/modal-overlays/dialog
...
```

### Step 2 — Inventory Existing Tests

Read every file in `tests/`:
- `firstTest.spec.ts`
- `uiComponents.spec.ts`
- `usePageObjects.spec.ts`
- `autoWaiting.spec.ts`
- `dragAndDropWithiFrames.spec.ts`
- `testMobile.spec.ts`
- `testWithFixture.spec.ts`

For each file, extract: which pages are visited and what scenarios are covered.

### Step 3 — Inventory Existing Page Objects

Read every file in `page-objects/`:
- `helperBase.ts` — shared utilities
- `pageManager.ts` — facade registry
- `navigationPage.ts` — navigation methods
- `formLayouts.ts` — form layout actions
- `datePickerPage.ts` — date picker actions

Note which pages already have a page object class and which do not.

### Step 4 — Gap Analysis

Compare the page list (Step 1) against existing test coverage (Step 2) and page objects (Step 3).

Classify each untested page as:
- **P0 / Must Have** — core user-facing flows (forms, tables with CRUD)
- **P1 / Should Have** — interactive components (modals, dialogs, toasts)
- **P2 / Nice to Have** — informational pages (charts, dashboard widgets)

### Step 5 — Output Test Plan

Produce a structured test plan in this format:

```
## Test Plan

### P0 — Must Have
| Page | Scenarios | Needs New Page Object? |
|---|---|---|
| Smart Table | Create row, Edit row, Delete row, Filter by column | Yes |
| Form Layouts | (already covered — skip) | No |

### P1 — Should Have
| Page | Scenarios | Needs New Page Object? |
|---|---|---|
| Dialog | Open dialog, confirm, cancel | Yes |
| Toast | Trigger toast, verify message, verify position | Yes |

### P2 — Nice to Have
| Page | Scenarios | Needs New Page Object? |
|---|---|---|
| Line Chart | Renders with data | No |
```

### Step 6 — Present & Confirm

Show the test plan to the user.
Ask: "Should I proceed with all priorities, or focus on a specific priority level?"
Wait for response before moving to test creation.

---

## Output Contract

This skill outputs:
1. A test plan markdown table (P0/P1/P2)
2. A list of page objects that need to be created
3. A list of test files that will be created

This output is consumed by the `create-playwright-tests` skill in the next phase.
