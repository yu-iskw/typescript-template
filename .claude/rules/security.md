---
paths:
  - "packages/**/*.ts"
  - "packages/**/*.tsx"
---

# Security Guidelines

## Input Validation

- Validate all external inputs at system boundaries
- Use TypeScript types for compile-time safety
- Runtime validation for user input and API responses
- Sanitize data before database queries

## Secrets Management

- **NEVER** commit secrets to git
- Use environment variables for configuration
- Keep `.env` files in `.gitignore`
- Use `.env.example` for documentation (no real values)

## Dependencies

- Run `pnpm audit` regularly
- Use Trunk's Trivy and OSV-scanner for vulnerability detection
- Keep dependencies updated via Dependabot
- Review new dependencies before adding

## Code Patterns to Avoid

- SQL injection: Use parameterized queries
- XSS: Sanitize output, use safe templating
- Command injection: Avoid shell execution with user input
- Path traversal: Validate file paths
- Prototype pollution: Freeze objects when needed

## Security Audit

Run the security audit skill:
```bash
# Uses Trivy + OSV-scanner via Trunk
pnpm lint:all  # Includes security linters
```

## Reporting Issues

If you find a security vulnerability:
1. Do NOT commit the fix publicly first
2. Document the issue privately
3. Notify maintainers
4. Follow responsible disclosure
