---
paths:
  - "packages/**/*.test.ts"
  - "packages/**/*.spec.ts"
---

# Testing Guidelines

## Framework

- Use **Vitest** for all unit tests
- Test files: `*.test.ts` or `*.spec.ts`
- Co-locate tests with source files in `src/`

## Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should do expected behavior', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Best Practices

- One assertion per test when practical
- Use descriptive test names: "should [expected behavior] when [condition]"
- Test edge cases: empty inputs, nulls, boundaries
- Mock external dependencies, not internal modules
- Avoid testing implementation details

## Commands

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- -u        # Update snapshots
pnpm test -- --coverage # Coverage report
```

## Coverage Targets

- Aim for 80%+ coverage on critical paths
- Don't chase 100% - focus on meaningful tests
- Test business logic thoroughly
- Skip trivial getters/setters
