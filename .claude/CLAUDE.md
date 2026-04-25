# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Orchestration

### Plan Mode Default

- Enter plan mode for any non-trivial task with 3 or more steps or architectural decisions.
- If execution goes sideways, stop and re-plan immediately.
- Use plan mode for verification steps, not just implementation.
- Write detailed specs upfront to reduce ambiguity.

### Subagent Strategy

- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, use more subagents instead of widening the primary context.
- Keep each subagent focused on one task.

### Self-Improvement Loop

- After any user correction, update `tasks/lessons.md` with the pattern and prevention rule.
- Write rules that prevent the same mistake from recurring.
- Iterate on those lessons until the failure mode stops repeating.
- Review relevant lessons at session start when working in this project.

### Verification Before Done

- Never mark a task complete without proving it works.
- Diff behavior against `main` when that comparison is relevant.
- Ask whether the result would satisfy a staff-level review before closing the task.
- Run tests, inspect logs, and demonstrate correctness before handing work back.

### Demand Elegance

- For non-trivial changes, pause and check whether there is a simpler or more elegant solution.
- If a fix feels hacky, re-evaluate and implement the cleaner version when justified.
- Skip this step for obvious, low-risk fixes to avoid over-engineering.
- Challenge the design before presenting it as complete.

### Autonomous Bug Fixing

- When given a bug report, move directly to diagnosis and repair.
- Use logs, errors, and failing tests as the primary inputs.
- Avoid pushing context-switching work back to the user unless blocked.
- Treat failing CI or local test failures as action items to resolve end-to-end.

## Task Management

1. Plan first: write the plan to `tasks/todo.md` with checkable items.
2. Verify plan: check in before starting implementation.
3. Track progress: mark items complete as work advances.
4. Explain changes: provide a high-level summary at each step.
5. Document results: add a review section to `tasks/todo.md`.
6. Capture lessons: update `tasks/lessons.md` after corrections.

## Core Principles

- Simplicity first: make every change as simple as possible and minimize the code touched.
- No laziness: find root causes and avoid temporary fixes.
- Minimal impact: change only what is necessary and avoid creating side effects.

## Post-Change Workflow (MANDATORY)

After **any** code change — tests, page objects, config, README — you MUST:

1. Update `README.md` if the change affects commands, project structure, test coverage, or workflow.
2. Commit the changes on a feature/bugfix/chore branch (never directly to `main`).
3. Open a PR using the `create-pull-request` skill.
4. Review the PR using the `review` skill.
5. Report the PR URL to the user before closing the task.

This applies to every session where files in `tests/`, `page-objects/`, `.claude/`, or the project root are modified. Do not skip this step even for small changes.

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
**File:** `.claude/skills/create-pull-request/SKILL.md`
**When to load:** When creating a PR for a completed batch. Opens a scoped PR with proper title, description, and base branch.

### address-pr-comments
**File:** `.claude/skills/address-pr-comments/SKILL.md`
**When to load:** When review comments exist on an open PR. Fetches, classifies, and addresses each comment thread.

---

## Rules

All rules in `.claude/rules/` apply to every file in the workspace:

| Rule File | Applies To |
|---|---|
| [`rules/architecture.md`](rules/architecture.md) | Test architecture, fixtures, config |
| [`rules/test-writing.md`](rules/test-writing.md) | Writing tests and page objects |
| [`rules/bug-fixing.md`](rules/bug-fixing.md) | Diagnosing and fixing test failures |
| [`rules/playwright-best-practices.md`](rules/playwright-best-practices.md) | Official Playwright best practices — locators, assertions, timing, CI |

**Always read the relevant rule files before writing tests or fixing bugs.**
