---
name: codeql-fix
description: Run CodeQL security/quality analysis and fix findings. Use when the user asks to run CodeQL, security scan, static analysis, or fix CodeQL findings.
compatibility: Requires CodeQL CLI on PATH (e.g. brew install codeql) and Node.js compatible with this repo (see `.node-version` and `package.json` engines) for JavaScript/TypeScript extraction.
---

# CodeQL Fix

## Trigger scenarios

Activate this skill when the user says or implies:

- Run CodeQL, security scan, static analysis
- Fix CodeQL findings, address CodeQL alerts

## Preconditions

- [CodeQL CLI](https://github.com/github/codeql-cli-binaries/releases) on `PATH` (e.g. `brew install codeql`)
- **JavaScript / TypeScript:** CodeQL uses the `javascript` extractor for both; run `pnpm install` at the repo root before creating a database so dependency resolution matches the workspace.

## Run analysis (repository root)

All commands below assume `cd "$(git rev-parse --show-toplevel)"`.

### 1. Create the database (default: JavaScript/TypeScript)

Use `--source-root .` at the monorepo root so `packages/*` and other workspace paths are included.

For a **minimal** create without a code-scanning config file:

```bash
codeql database create ./codeql-db --language=javascript --source-root . --overwrite
```

Do not commit `codeql-db/` (large, machine-specific). It should remain in [`.gitignore`](../../../.gitignore).

### 2. Optional: render a code scanning config

Use the renderer when you want a documented `paths-ignore` list (e.g. skip `node_modules`, build outputs), hand-edited query blocks, or consistency with GitHub code scanning YAML workflows. Pass the rendered file to `codeql database create --codescanning-config=<file>` so **`paths-ignore` applies** to JavaScript extraction.

```bash
REPO="$(git rev-parse --show-toplevel)"
"$REPO/.claude/skills/codeql-fix/scripts/render-code-scanning-config.sh" "$REPO" /tmp/codeql-config.yml
codeql database create ./codeql-db --language=javascript --source-root . --codescanning-config=/tmp/codeql-config.yml --overwrite
```

### 3. Analyze and emit SARIF

```bash
codeql database analyze --format=sarifv2.1.0 --output=codeql-results.sarif -- ./codeql-db codeql/javascript-queries:codeql-suites/javascript-security-and-quality.qls
```

- View `codeql-results.sarif` with the SARIF Viewer in VS Code (or upload to GitHub Security tab if your org uses code scanning).
- For a narrower run matching default GitHub code scanning, use `codeql/javascript-queries:codeql-suites/javascript-code-scanning.qls` instead.

If `codeql/javascript-queries` is missing, run `codeql pack download codeql/javascript-queries` once.

See also: [JavaScript and TypeScript built-in queries](https://docs.github.com/en/code-security/code-scanning/managing-your-code-scanning-configuration/javascript-typescript-built-in-queries).

## Fixer loop

If `codeql-results.sarif` has an empty `runs[].results` array, there are **no CodeQL alerts to fix** for that suite; stop unless the user explicitly wants a broader suite or diagnostic queries.

When SARIF findings remain:

1. **Identify:** Read `codeql-results.sarif` or the CLI output for reported findings.
2. **Fix:** Apply the minimum necessary edit to resolve each finding.
3. **Verify:** From the repository root, run `pnpm test`. Optionally run `pnpm lint` (Trunk) after substantive edits.
4. **Re-scan:** Repeat database create + analyze (steps 1 and 3 above) until clean or up to 3 iterations to avoid unbounded loops.

## Optional: code scanning config details

See [references/code-scanning-config.md](references/code-scanning-config.md) and the official [code scanning configuration](https://aka.ms/code-scanning-docs/config-file) reference.
