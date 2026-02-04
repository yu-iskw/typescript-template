# Workflow Orchestration Rules

## Plan Mode Default

For ANY task with 3+ steps or architectural impact:

1. **Enter plan mode** before writing code
2. Write detailed specs in `tasks/todo.md`
3. Get confirmation before implementation
4. If something goes wrong, STOP and re-plan

## Verification Before Done

Never mark a task complete without:

- [ ] Running `pnpm build` - code compiles
- [ ] Running `pnpm lint` - no violations
- [ ] Running `pnpm test` - tests pass
- [ ] Reviewing the diff - changes are correct

Ask: "Would a staff engineer approve this?"

## Self-Improvement Loop

After ANY correction from the user:

1. **Acknowledge** the correction
2. **Understand** the root cause
3. **Update** `tasks/lessons.md` with the pattern:
   ```
   **Issue**: What went wrong
   **Root Cause**: Why it happened
   **Prevention Rule**: How to avoid it
   ```
4. **Apply** the lesson immediately

## Autonomous Bug Fixing

When given a bug report:

1. **Just fix it** - don't ask for hand-holding
2. **Point at logs/errors** - then resolve them
3. **Zero context switching** from the user
4. **Fix failing CI** without being told how

## Demand Elegance (Balanced)

For non-trivial changes:

- Pause and ask: "Is there a more elegant way?"
- If a fix feels hacky: implement the elegant solution
- **Skip this for simple, obvious fixes** - don't over-engineer
- Challenge your own work before presenting it

## Core Principles

- **Simplicity First**: Make every change as simple as possible
- **No Laziness**: Find root causes, no temporary fixes
- **Minimal Impact**: Only touch what's necessary
- **No Guessing**: Read actual code before suggesting changes
