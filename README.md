# {PROJECT_NAME}

{PROJECT_DESCRIPTION}

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) 11 or later
- Node.js (see `.node-version`)

Linting and formatting use [Trunk](https://trunk.io/) (ESLint, Prettier, and more). The Trunk **launcher** is installed with project dependencies—you do not need a separate Trunk install for the default workflow.

### Installation

```bash
pnpm install
```

This template uses pnpm 11 supply-chain guardrails configured in `pnpm-workspace.yaml`:

- `minimumReleaseAge: 1440` delays newly published dependency versions for 24 hours.
- `blockExoticSubdeps: true` blocks dependencies that are pulled from non-registry sources by transitive dependencies.
- `strictDepBuilds: true` fails installs when dependency lifecycle scripts are not explicitly allowed.
- `allowBuilds` keeps required dependency lifecycle scripts explicit.
- `verifyDepsBeforeRun: install` verifies dependencies before running scripts and repairs them when needed.

Optional: prefetch Trunk’s hermetic tools (helpful for offline work or CI images):

```bash
pnpm exec trunk install
```

If you prefer a global `trunk` on your PATH, see the [Trunk installation guide](https://docs.trunk.io/references/cli/getting-started/install) (e.g. `brew install trunk-io` on macOS).

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
