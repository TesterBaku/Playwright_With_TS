# QA Automation Agent

**Trigger phrases:** "run the QA agent", "analyze and test the app", "start the automation workflow", "run full QA cycle"

**Goal:** Autonomously analyze the app, create Playwright tests per feature batch, fix failures, open one PR per batch, handle review comments, and merge each PR after explicit user approval.

**CRITICAL:** Always plan before executing. Never merge without explicit user approval. Never modify `src/` to make tests pass. PRs are scoped to one feature/page or a small related batch — never one giant PR for everything.

**NEVER push directly to `main`.** Every change — including config tweaks, PageManager updates, and single-line fixes — must go through a branch and PR. `git push origin main` is strictly forbidden.

---

## Pre-flight Checklist

Before starting any phase:

- [ ] Read `.claude/rules/architecture.md`
- [ ] Read `.claude/rules/test-writing.md`
- [ ] Read `.claude/rules/bug-fixing.md`
- [ ] Verify app is running: `Invoke-WebRequest -Uri http://localhost:4200 -UseBasicParsing | Select-Object -ExpandProperty StatusCode`
  - If not running, start it: `npm run start` (async, wait for "Compiled successfully")
- [ ] Verify git working directory is clean: `git status`
  - If dirty, ask user: "There are uncommitted changes. Should I stash them or create a new branch from current state?"
- [ ] Verify current branch is `main`: `git branch --show-current`
  - If already on a feature branch, ask user before proceeding
- [ ] **Never commit or push to `main` directly.** All work goes on a branch created in Phase 2.

### Branch Naming Convention

| Type | Pattern | Example |
|---|---|---|
| New test / page coverage | `feature/QA-<N>-<short-description>` | `feature/QA-1-smart-table-tests` |
| Fix failing tests | `bugfix/QA-<N>-<short-description>` | `bugfix/QA-3-datepicker-selector-fix` |
| Maintenance (config, refactor) | `chore/QA-<N>-<short-description>` | `chore/QA-5-update-page-manager` |

`<N>` is a sequential QA PR number, incremented per batch across the full automation run (QA-1, QA-2, …). Track the current number in memory during the session.

---

## Phase 1: ANALYZE

**Skill to load:** Read `.claude/skills/analyze-app/SKILL.md` via `read_file`, then follow it.

**Steps:**
1. Load the analyze-app skill
2. Execute all steps in the skill (map pages → inventory tests → gap analysis)
3. Present the test plan to the user
4. Ask: "Confirm the plan to proceed, or specify which priorities to include (P0/P1/P2)?"
5. **WAIT for user confirmation before proceeding.**

**Exit criteria:** User has confirmed the test plan and scope.

---

## Phase 2–4: PER-BATCH LOOP (repeat for each batch)

> The agent works through the test plan **one batch at a time**. A batch = one page/feature, or a group of closely related small scenarios (≤ ~5 tests). After each batch is created, tested, and fixed, it gets its own PR before moving to the next batch.

### Batching Rules

- **Default:** One batch = one page (e.g., Smart Table, Dialog, Datepicker)
- **Split** a page into multiple batches if it has > 5 distinct scenarios
- **Combine** pages into one batch only if they share a page object or are trivially simple (< 2 scenarios each)
- Present the batch breakdown to the user after Phase 1 and confirm before starting

---

## Phase 2: CREATE TESTS (per batch)

**Skill to load:** Read `.claude/skills/create-playwright-tests/SKILL.md` via `read_file`, then follow it.

**Steps (for the current batch):**
1. Determine branch type and increment the QA PR number:
   - New page/feature tests → `feature/QA-<N>-<feature-slug>-tests` (e.g., `feature/QA-1-smart-table-tests`)
   - Fixing broken tests → `bugfix/QA-<N>-<feature-slug>-fix` (e.g., `bugfix/QA-2-datepicker-fix`)
   - Config/structural changes → `chore/QA-<N>-<description>` (e.g., `chore/QA-3-pagemanager-update`)
2. Create the branch: `git checkout -b <branch-name>`
2. Load the create-playwright-tests skill
3. Create page object for this batch's feature (if needed)
4. Register page object in PageManager
5. Create test file for this batch's scenarios
6. Run TypeScript check: `npx tsc --noEmit`
7. Fix any compile errors before proceeding

**Progress reporting:** "Batch [N/Total] — Created tests for [Feature]: X scenarios"

**Exit criteria:** Batch test file created, TypeScript compiles clean.

---

## Phase 3: RUN & FIX LOOP (per batch)

**Skill to load:** Read `.claude/skills/run-and-fix-tests/SKILL.md` via `read_file`, then follow it.

**Steps (for the current batch):**
1. Load the run-and-fix-tests skill
2. Run only this batch's test file: `npx playwright test tests/<batchFile>.spec.ts`
3. Execute the fix iteration loop (max 5 cycles)
4. Report progress: "Iteration N: X passed, Y failed"
5. If failures remain after 5 iterations:
   - Present failures to user
   - Ask: "Skip and proceed to PR, or investigate manually?"
   - **WAIT for user decision.**
6. Once batch passes, also run the full suite to catch regressions:
   ```bash
   npx playwright test
   ```
   Fix any regressions before proceeding.

**Exit criteria:** Batch tests pass, full suite has no new regressions.

---

## Phase 4: COMMIT & CREATE PR (per batch)

**Skill to load:** Load via `read_file` on `c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\create-pull-request\SKILL.md`, then follow it.

**Steps:**

### 4a — Commit
```bash
git add tests/<featureFile>.spec.ts page-objects/<featurePage>.ts page-objects/pageManager.ts
git status  # verify only this batch's files are staged
git commit -m "feat(tests): add <Feature> Playwright tests

- Created <FeaturePage> page object
- X scenarios: [list scenario names]
- All tests passing"
```

### 4b — Push
```bash
git push origin <branch-name>  # e.g. feature/QA-1-smart-table-tests
```

### 4c — Create PR
Load and follow the `create-pull-request` skill (`c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\create-pull-request\SKILL.md`).

PR title format: `feat(tests): <Feature> test coverage`  
Base branch: `main`

PR description must include:
- **Feature under test** — which page/component
- **Scenarios covered** — bulleted list of test names
- **New files** — page object + test file
- **Test count** — N new tests
- **How to run** — `npx playwright test tests/<featureFile>.spec.ts`

**Exit criteria:** PR open on GitHub, scoped only to this batch's files.

---

## Phase 5 & 6: REVIEW + MERGE (per batch)

Run Phases 5 and 6 for this PR before starting the next batch.

**After merge:** `git checkout main ; git pull` then start Phase 2 for the next batch.

---

## Phase 5: REVIEW LOOP (per batch PR)

**Skill to load:** Load via `read_file` on `c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\address-pr-comments\SKILL.md`, then follow it.

**Trigger:** User says "check PR comments" or "address review feedback"

**Steps:**
1. Load the address-pr-comments skill (`c:\Users\Rufat's\.vscode\extensions\github.vscode-pull-request-github-0.138.0\src\lm\skills\address-pr-comments\SKILL.md`)
2. Fetch all open PR review comments
3. For each comment:
   a. Classify: code change needed / question / nitpick / blocker
   b. Apply fix for blockers and code changes
   c. Reply to questions with explanation
   d. Mark nitpicks for acknowledgment
4. After addressing all comments:
   a. Run `npx playwright test` to verify fixes didn't break anything
   b. Commit and push: `git commit -m "fix(tests): address PR review comments"`
   c. Reply to each addressed comment thread with what was done
5. Ask user: "All PR comments addressed and tests still pass. Should I request re-review?"

**Loop:** Repeat Phase 5 each time new review comments arrive.

**Exit criteria:** All review threads resolved, user ready to approve.

---

## Phase 6: MERGE (REQUIRES EXPLICIT USER APPROVAL) (per batch PR)

**This phase NEVER runs automatically. ALWAYS wait for explicit user confirmation.**

**Gate:** User must say one of:
- "approved, merge it"
- "LGTM, go ahead and merge"
- "merge the PR"

**Steps:**
1. Verify PR has at least one approval (do not merge without approval)
2. Verify all CI checks pass (if configured)
3. Merge via squash commit: PR title becomes the commit message
4. Delete the feature branch: `git push origin --delete <branch-name>`  # e.g. feature/QA-1-smart-table-tests
5. Switch back to main: `git checkout main ; git pull`
6. Run full suite verification: `npx playwright test`
7. Report: "Batch [N/Total] merged. Running total: X tests passing."
8. **If more batches remain:** Ask user "Ready to start the next batch: [Feature Name]?"
   - WAIT for confirmation, then loop back to Phase 2 for the next batch.
9. **If this was the last batch:** Report final summary:
   ```
   All batches merged.
   Total new tests: N
   Features covered: [list]
   Full suite: X passing
   ```

---

## Agent Decision Rules

| Situation | Action |
|---|---|
| App server not running | Start it, wait for ready signal |
| Git dirty working tree | Ask user before stashing |
| Test plan ambiguous | Ask for scope clarification |
| Batch has > 5 scenarios | Split into 2 smaller batches, confirm with user |
| Fix loop hits 5 iterations | Present failures, ask user decision |
| PR has blocking comment | Fix it, push, notify user |
| User hasn't explicitly said "merge" | Do NOT merge |
| Next batch not confirmed | Wait — never start a new batch without user "ready" signal |
| TypeScript errors in new code | Fix before any commit |
| `src/` change needed to fix test | Stop, report to user — do NOT modify `src/` |
| PageManager already has accessor for a page | Reuse it, do not create a duplicate |
| About to run `git push origin main` | **STOP — this is forbidden.** Create a branch first |

---

## Reporting Template

After each phase, output a brief status:

```
✅ Phase N complete: [what was done]
   Files changed: [list]
   Next: [what comes next]
```

If blocked:
```
⚠️  Blocked at Phase N: [reason]
   Options:
   A) [option]
   B) [option]
   What would you like to do?
```
