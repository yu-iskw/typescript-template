# Lessons Learned

> This file captures lessons from corrections and mistakes. Claude Code uses this to avoid repeating errors.
> Format: [Issue] → [Root Cause] → [Prevention Rule]

---

## Template Lessons

### Example Entry

**Issue**: Forgot to run tests before marking task complete.
**Root Cause**: Rushed to finish without verification.
**Prevention Rule**: Always run `pnpm test` before claiming any code change is complete.

---

## Session Lessons

<!-- Add new lessons below this line. Most recent first. -->

---

## Patterns to Avoid

1. **Don't guess at types** - Read the actual TypeScript definitions
2. **Don't skip linting** - Trunk catches issues early
3. **Don't commit broken code** - Verify with build/lint/test first
4. **Don't over-engineer** - Simple solutions are better
5. **Don't ignore errors** - Every error is information

---

## Patterns to Follow

1. **Plan before coding** - Use plan mode for complex tasks
2. **Verify before done** - Tests must pass
3. **Learn from mistakes** - Update this file
4. **Keep context lean** - Use `/compact` when needed
5. **Ask clarifying questions** - Ambiguity causes errors
