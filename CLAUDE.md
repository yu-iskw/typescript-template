# Project Memory: TypeScript Template

> This file is automatically loaded by Claude Code. Keep it lean and specific.

## Project Overview

A TypeScript monorepo template using **pnpm workspaces** with integrated Claude Code automation.

**Tech Stack:**

- Language: TypeScript 5.9+
- Package Manager: pnpm 10.28+
- Runtime: Node.js 24.13+
- Testing: Vitest 4.0+
- Linting: Trunk (hermetic)
- License: Apache-2.0

## Quick Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint staged files
pnpm lint:all         # Lint entire project
pnpm format           # Format staged files
pnpm format:all       # Format entire project
```

## Project Structure

```
packages/           # Monorepo packages
  common/           # Shared utilities
.claude/
  agents/           # Custom agents
  skills/           # Automated workflows
  rules/            # Modular guidelines
tasks/
  todo.md           # Current task tracking
  lessons.md        # Self-improvement log
```

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Write detailed specs upfront to reduce ambiguity

### 2. Verification Before Done

- Never mark a task complete without proving it works
- Run tests, check logs, demonstrate correctness
- Ask: "Would a staff engineer approve this?"

### 3. Self-Improvement Loop

After ANY correction from the user:

1. Update `tasks/lessons.md` with the pattern
2. Write rules that prevent the same mistake
3. Review lessons at session start

## Coding Standards

- 2-space indentation
- Strict TypeScript mode
- No `any` types without justification
- All exports must have JSDoc comments for public APIs
- Test coverage: aim for 80%+

## Architecture Decisions

- Monorepo structure for code sharing
- Hermetic linting via Trunk (no global installs)
- Vitest for fast unit testing
- pnpm for efficient dependency management

## File References

See @README.md for template usage.
See @packages/common/src/index.ts for example module.
See @.claude/skills/common-references/troubleshooting.md for error fixes.
