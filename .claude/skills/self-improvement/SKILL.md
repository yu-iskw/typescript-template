---
name: self-improvement
description: Capture lessons learned and update project memory after corrections or mistakes. Use this skill after receiving user corrections to prevent repeating errors.
---

# Self-Improvement Loop

## Purpose

An autonomous loop for capturing lessons learned and updating project memory to prevent repeating mistakes.

## When to Use

Trigger this skill when:
- User corrects a mistake
- A bug fix reveals a pattern
- An architectural decision is made
- A non-obvious solution is discovered

## Process

### Step 1: Reflect on What Happened

Analyze the correction or discovery:
- What was the original mistake or issue?
- What was the root cause?
- What was the correct approach?

### Step 2: Abstract the Pattern

Generalize the lesson:
- Is this a one-time issue or recurring pattern?
- What conditions trigger this issue?
- How can it be prevented in the future?

### Step 3: Update Lessons File

Add entry to `tasks/lessons.md`:

```markdown
### [Short Title] - [Date]

**Issue**: [What went wrong]
**Root Cause**: [Why it happened]
**Prevention Rule**: [How to avoid it]
```

### Step 4: Consider Rule Updates

If the pattern is project-specific:
- Update relevant file in `.claude/rules/`
- Add to CLAUDE.md if it's a core pattern

### Step 5: Confirm the Learning

Summarize what was learned and how it's been captured.

## Examples

### Example 1: Type Safety Lesson

**Trigger**: Used `any` type and caused runtime error.

**Lesson Entry**:
```markdown
### Avoid `any` Types - 2026-02-04

**Issue**: Used `any` type for API response, caused runtime error when property was undefined.
**Root Cause**: Took shortcut instead of properly typing the response.
**Prevention Rule**: Always define interfaces for external data. Use `unknown` and type guards.
```

### Example 2: Testing Lesson

**Trigger**: Forgot to update tests after changing function signature.

**Lesson Entry**:
```markdown
### Update Tests with Code - 2026-02-04

**Issue**: Changed function signature without updating tests, CI failed.
**Root Cause**: Made change and marked complete without running tests.
**Prevention Rule**: Always run `pnpm test` after any code change, before claiming completion.
```

## Termination Criteria

- Lesson has been documented in `tasks/lessons.md`
- Relevant rules updated if needed
- User has acknowledged the captured learning
