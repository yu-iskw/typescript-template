# {PROJECT_NAME}

{PROJECT_DESCRIPTION}

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) **11.x** (see `packageManager` in `package.json`; use [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`)
- Node.js **22+** (see `engines` in `package.json`; `.node-version` pins the version used for local dev and CI)

Dependency installs follow pnpm 11 supply-chain settings in [`pnpm-workspace.yaml`](pnpm-workspace.yaml): **minimum release age** (this template uses a **7-day** quarantine, stricter than pnpm’s built-in 24-hour default), **blocking exotic transitive dependencies**, and an **`allowBuilds`** allowlist for packages that run install scripts. See [pnpm 11 release notes](https://pnpm.io/blog/releases/11.0) and [Supply-chain defaults (Socket)](https://socket.dev/blog/pnpm-11-adds-new-supply-chain-protection-defaults).

Linting and formatting use [Trunk](https://trunk.io/) (ESLint, Prettier, and more). The Trunk **launcher** is installed with project dependencies—you do not need a separate Trunk install for the default workflow.

### Installation

```bash
pnpm install
```

Optional: prefetch Trunk’s hermetic tools (helpful for offline work or CI images):

```bash
pnpm exec trunk install
```

If you prefer a global `trunk` on your PATH, see the [Trunk installation guide](https://docs.trunk.io/references/cli/getting-started/install) (e.g. `brew install trunk-io` on macOS).

### Supply-chain protections

The template uses **pnpm 11** with settings in [`pnpm-workspace.yaml`](pnpm-workspace.yaml): a **7-day** [`minimumReleaseAge`](https://pnpm.io/settings#minimumreleaseage) (10080 minutes, stricter than pnpm’s default 1 day), [`blockExoticSubdeps`](https://pnpm.io/settings#blockexoticsubdeps) enabled, and an [`allowBuilds`](https://pnpm.io/settings#allowbuilds) map for dependencies that must run install scripts (pnpm 11 requires this for native toolchain packages such as esbuild). See the [pnpm 11 release notes](https://pnpm.io/blog/releases/11.0).

### SBOM and vulnerability checks

The [`SBOM` workflow](.github/workflows/sbom.yml) runs for pull requests,
pushes to `main`, a weekly schedule, and manual dispatches. It:

1. installs the workspace from the frozen pnpm lockfile;
2. generates a commit-specific SPDX JSON SBOM with Syft;
3. retains the SBOM as a workflow artifact for 14 days; and
4. scans that exact SBOM with Grype, failing on High or Critical
   vulnerabilities.

The workflow intentionally reports vulnerabilities even when no fix is
currently available. Add narrowly scoped entries to a repository-level
`.grype.yaml` only after documenting the risk acceptance and an expiry or
review date.

To reproduce the check locally, install Syft and Grype and run:

```bash
pnpm install --frozen-lockfile
syft dir:. -o spdx-json=sbom.spdx.json
grype sbom:sbom.spdx.json --fail-on high
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
```

## Project Structure

- `packages/`: Monorepo packages
  - `common/`: Shared utilities and types

## License

{LICENSE}
