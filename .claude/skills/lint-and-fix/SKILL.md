---
name: lint-and-fix
description: Run linters and fix violations using Trunk. Use when code quality checks fail or before submitting PRs.
---

# Lint and Fix Loop: Trunk

## Purpose

An autonomous loop for the agent to identify, fix, and verify linting and formatting violations using [Trunk](https://trunk.io).

## Loop Logic

1. **Identify**: Run `pnpm lint` (which executes `trunk check`) to list current violations.
2. **Analyze**: Examine the output from Trunk, focusing on the file path, line number, and error message.
3. **Fix**:
   - For formatting issues, run `pnpm format` (which executes `trunk fmt`).
   - For linting violations, apply the minimum necessary change to the source code to resolve the error.
4. **Verify**: Re-run `pnpm lint`.
   - If passed: Move to the next issue or finish if all are resolved.
   - If failed: Analyze the new failure and repeat the loop.

## Termination Criteria

- No more errors reported by `pnpm lint`.
- Reached max iteration limit (default: 5).

## Examples

### Scenario: Fixing a formatting violation

1. `pnpm lint` reports formatting issues in `src/index.ts`.
2. Agent runs `pnpm format`.
3. `pnpm lint` now passes.

### Scenario: Fixing a linting error

1. `pnpm lint` reports an unused variable in `packages/common/src/index.ts`.
2. Agent removes the unused variable.
3. `pnpm lint` passes.
