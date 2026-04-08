# Code scanning config (template + renderer)

This skill ships a YAML template and a small shell renderer under the same directory as [`SKILL.md`](../SKILL.md).

- **Template:** [`assets/code-scanning-config.template.yml`](../assets/code-scanning-config.template.yml)
- **Renderer:** [`scripts/render-code-scanning-config.sh`](../scripts/render-code-scanning-config.sh)

Local CodeQL in this repository is **CLI-driven** (no `pnpm` or root npm scripts). Use [`SKILL.md`](../SKILL.md) for the full `database create` / `database analyze` flow.

## JavaScript / TypeScript

Pass the rendered file to `codeql database create --codescanning-config=<file>` when you need `paths-ignore` or other [code scanning configuration](https://aka.ms/code-scanning-docs/config-file) options. For this monorepo, that is useful to exclude **`node_modules`**, **`.git`**, **`dist`**, coverage, and other generated paths (the renderer adds common entries when those directories exist).

Glob patterns such as `**/.venv` are **double-quoted** in generated YAML so the file parses correctly.

## Other languages

If you add **Go** (or another language) later, note that CodeQL may report that `paths` / `paths-ignore` have **limited or no effect for the Go extractor** compared to JavaScript. To drop alerts from certain paths in SARIF after analysis, consider [advanced-security/filter-sarif](https://github.com/advanced-security/filter-sarif).
