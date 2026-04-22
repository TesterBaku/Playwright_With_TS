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

---

## QA Automation Agent

To run the full autonomous QA cycle (analyze → create tests → fix → PR → review → merge), read the agent file first:

**File:** [`.claude/agents/qa-automation-agent.md`](.claude/agents/qa-automation-agent.md)

**Trigger:** Load this file via `read_file` when the user says "run the QA agent", "analyze and test the app", or "start the automation workflow".

The agent orchestrates these skills in sequence — load each skill file with `read_file` at the relevant phase:

---

## Project Skills

These are loaded on demand via `read_file`. Load a skill BEFORE taking action in its domain.

### analyze-app
**File:** `.claude/skills/analyze-app/SKILL.md`
**When to load:** Before creating any new tests. Maps app pages vs existing coverage → produces prioritized test plan.

### create-playwright-tests
**File:** `.claude/skills/create-playwright-tests/SKILL.md`
**When to load:** When creating new page objects or test files. Enforces POM conventions, selector strategy, and test structure.

### run-and-fix-tests
**File:** `.claude/skills/run-and-fix-tests/SKILL.md`
**When to load:** When running tests and fixing failures. Runs the execute → diagnose → fix loop (max 5 iterations).

### create-pull-request
**File:** `c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\create-pull-request\SKILL.md`
**When to load:** When creating a PR for a completed batch. Opens a scoped PR with proper title, description, and base branch.

### address-pr-comments
**File:** `c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\address-pr-comments\SKILL.md`
**When to load:** When review comments exist on an open PR. Fetches, classifies, and addresses each comment thread.

---

## Rules

All rules in `.claude/rules/` apply to every file in the workspace:

| Rule File | Applies To |
|---|---|
| [`rules/architecture.md`](rules/architecture.md) | Test architecture, fixtures, config |
| [`rules/test-writing.md`](rules/test-writing.md) | Writing tests and page objects |
| [`rules/bug-fixing.md`](rules/bug-fixing.md) | Diagnosing and fixing test failures |

**Always read the relevant rule files before writing tests or fixing bugs.**
