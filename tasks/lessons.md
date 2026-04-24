# Lessons Learned

Add short entries after user corrections or repeated mistakes.

## Template

- Date:
- Situation:
- Correction:
- Prevention rule:

## Entries

- Date: 2026-04-24
- Situation: I treated interrupted long-running validation as if the migration state had already been verified.
- Correction: Re-anchor on actual changed files and rerun the narrow executable check before claiming progress.
- Prevention rule: After any killed or timed-out process, verify the current workspace state and rerun the smallest blocking validation before making further claims.

- Date: 2026-04-24
- Situation: I provided recommendations and then proceeded with implementation flow without clearly honoring the requested recommendation order + feedback gate.
- Correction: Present recommendations strictly in the user's requested order, then pause and wait for explicit user confirmation before making code changes.
- Prevention rule: When the user asks for suggestions/recommendations, do not implement anything until the user selects items and approves proceeding.
- Prevention rule: If the user asks to review recommendations, implementation is blocked until the user explicitly says to implement.