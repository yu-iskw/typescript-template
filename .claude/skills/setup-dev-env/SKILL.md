---
name: setup-dev-env
description: Set up the development environment for the project. Use when starting work on the project or when dependencies might be out of sync.
---

# Setup Development Environment

This skill automates the process of setting up the development environment to ensure all tools and dependencies are correctly installed and configured.

## Workflow Checklist

- [ ] **Step 1: Environment Validation**
  - [ ] Check Node.js version against `.node-version`
  - [ ] Check for `trunk` installation
- [ ] **Step 2: Dependency Installation**
  - [ ] Run `pnpm install`
- [ ] **Step 3: Tooling Setup**
  - [ ] Run `trunk install` to fetch managed linters and formatters

## Detailed Instructions

### 1. Environment Validation

#### Node.js Version

Read the `.node-version` file in the workspace root. Ensure the current Node.js environment matches this version. If there's a mismatch, inform the user to switch Node versions (e.g., using `nvm` or `fnm`).

#### Trunk CLI

Check if `trunk` is installed by running `trunk --version`.
If `trunk` is not found, advise the user to install it. On macOS, use:

```bash
brew install trunk-io
```

For other platforms, refer to the [Trunk installation documentation](https://docs.trunk.io/cli/getting-started/install).

### 2. Dependency Installation

Run the following command at the workspace root to install all project dependencies:

```bash
pnpm install
```

### 3. Tooling Setup

Trunk manages linters and formatters hermetically. Run the following command to ensure all required tools are downloaded and ready:

```bash
trunk install
```

## Success Criteria

- All `pnpm` dependencies are installed successfully.
- `trunk` is installed and all managed tools are initialized.
- The Node.js version matches the requirement in `.node-version`.
