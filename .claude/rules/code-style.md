---
paths:
  - "packages/**/*.ts"
  - "packages/**/*.tsx"
---

# TypeScript Code Style Rules

## Formatting

- Use 2-space indentation (enforced by Prettier via Trunk)
- Maximum line length: 100 characters
- Use single quotes for strings
- Trailing commas in multi-line structures
- Semicolons required

## TypeScript Specifics

- Enable strict mode in all packages
- Avoid `any` - use `unknown` and narrow types
- Prefer interfaces over type aliases for object shapes
- Use explicit return types for exported functions
- Use `readonly` for immutable properties

## Naming Conventions

- **Files**: kebab-case (`my-component.ts`)
- **Classes/Interfaces**: PascalCase (`MyClass`, `IMyInterface`)
- **Functions/Variables**: camelCase (`myFunction`, `myVariable`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Type Parameters**: Single uppercase letter or PascalCase (`T`, `TKey`)

## Imports

- Group imports: external → internal → relative
- Use named imports over default imports when possible
- Avoid circular dependencies

## Error Handling

- Use typed errors with `Error` subclasses
- Always handle Promise rejections
- Prefer early returns for guard clauses
