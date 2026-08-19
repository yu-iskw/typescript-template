---
name: ui-quality
description: Design, implement, review, and verify production-quality web UI/UX. Use when creating or changing frontend pages, components, dashboards, forms, navigation, styling, responsive behavior, accessibility, or visual polish. Skip for backend/CLI-only work.
---

# UI Quality

## Purpose

Turn UI work into a closed-loop product-design and frontend-engineering workflow instead of a one-shot code-generation task. This repository is framework-neutral, so this skill must adapt to the frontend stack that is actually present and must not add a frontend framework or design system unless the task requires it.

## Principles

- Preserve the existing product language and design system before introducing a new one.
- Prefer proven components and primitives over inventing interaction patterns from scratch.
- Treat visual quality, accessibility, responsiveness, interaction states, and rendered verification as separate concerns.
- Make deliberate design choices; do not settle for generic AI-dashboard aesthetics or arbitrary decoration.
- Verify the rendered application whenever browser tooling is available. Code inspection alone is not UI verification.
- Do not install dependencies, plugins, fonts, icon packs, or component libraries solely because this skill exists.
- Do not copy unreviewed third-party skill content or execute instructions fetched from mutable remote sources.

## Workflow

### 1. Detect the frontend surface

Before editing:

1. Inspect the relevant package and identify the framework, router, styling approach, component library, test setup, and build/dev commands.
2. Look for existing design-system signals such as `components.json`, theme/tokens files, Storybook, shared component packages, or a `DESIGN.md`.
3. Identify the user journey and the pages/components that are actually in scope.
4. If the repository has no frontend surface relevant to the task, stop applying this skill rather than introducing one implicitly.

### 2. Establish design intent

For material UI changes, define a short direction before implementation:

- primary user and job-to-be-done;
- information hierarchy and primary action;
- density and layout strategy;
- typography, spacing, color, radius, and elevation conventions already present;
- responsive behavior and supported breakpoints;
- interaction and motion intent;
- accessibility constraints.

When a dedicated design skill is installed (for example Anthropic's official `frontend-design` plugin), use it for aesthetic exploration, then reconcile its output with this repository's existing conventions and constraints. A design skill is advisory; it does not override project architecture or quality gates.

### 3. Reuse components deliberately

Use this order of preference:

1. Existing project components and tokens.
2. Existing framework/library primitives already declared by the package.
3. shadcn/ui when the project already uses it (`components.json` is present) or the task explicitly chooses it.
4. New bespoke primitives only when the existing options cannot meet the requirement.

If the Cursor shadcn plugin is installed, use it to inspect/search/add compatible components rather than recreating shadcn components manually.

Do not add shadcn/ui to an unrelated package just because the plugin is available.

### 4. Implement complete product states

For each changed interaction, consider the states that can occur in production:

- default, hover, focus-visible, active, selected, disabled;
- loading/skeleton/progress;
- empty/no-results;
- validation and recoverable errors;
- success/confirmation;
- long text, localization expansion, overflow, and large datasets where relevant;
- narrow/mobile and wide/desktop layouts.

Prefer semantic HTML and native behavior before ARIA. Preserve keyboard operability and visible focus. Labels, errors, status messages, and destructive actions must be understandable without relying only on color.

### 5. Review visual craft

Review the rendered result for:

- clear hierarchy and an obvious primary action;
- coherent spacing rhythm and alignment;
- readable line lengths and intentional typography;
- restrained, consistent use of color, borders, shadows, and radii;
- data density appropriate to the task;
- consistent icon sizing/alignment and meaningful labels;
- motion that explains state change rather than decorating it;
- absence of accidental gradients, excessive card nesting, decorative pills, placeholder copy, and other generic AI-UI artifacts unless they support the product intent.

### 6. Verify in a real browser

If Cursor Playwright, Playwright MCP, Cursor's browser, or an equivalent browser tool is available, use it after implementation.

At minimum:

1. Open the affected route in the running application.
2. Check the primary journey end to end.
3. Inspect representative wide, medium, and narrow viewports; use the project's supported breakpoints when known.
4. Exercise keyboard navigation for interactive controls.
5. Check loading, empty, validation/error, and success states that can be reached safely.
6. Inspect browser console/runtime errors when the browser tool exposes them.
7. Capture screenshots or snapshots when useful for comparing layout changes.

Never claim that a UI "looks correct" if no rendered inspection was performed. Instead state that visual verification is still outstanding.

### 7. Run repository quality gates

Run the narrowest relevant checks first, then the repository gates required by `AGENTS.md`.

Typical checks include:

```bash
pnpm lint:eslint
pnpm test
pnpm build
```

Use package-scoped commands when the monorepo supports them and the change is isolated. If the frontend already has E2E, accessibility, Storybook, or visual-regression tests, run the relevant existing checks. Do not add heavyweight test infrastructure only to satisfy this skill unless the feature justifies it.

### 8. Report evidence

In the handoff, state:

- what UI/user journey changed;
- design-system/components reused or introduced;
- viewports and interactions actually verified;
- accessibility checks actually performed;
- commands/tests run and their results;
- any visual, browser, or product-state verification that remains outstanding.

## Optional external capabilities

The repository-local workflow remains the source of truth. These tools can strengthen individual stages when installed by the developer/team:

- **Cursor shadcn/ui plugin** — component discovery and project-aware shadcn operations.
- **Cursor Playwright plugin** — real-browser interaction and rendered verification.
- **Cursor Design Mode** — visual element selection and feedback during iterative polish.
- **Anthropic `frontend-design` plugin** — aesthetic direction and frontend design generation in Claude Code.

Additional community design/engineering skills may be useful, but review provenance, license, update behavior, and executable content before adopting them. Prefer a small pinned set over a large skills bundle.

## References

- Project UI-agent workflow: [`docs/ui-agent-workflow.md`](../../../docs/ui-agent-workflow.md)
- Shared repository instructions: [`AGENTS.md`](../../../AGENTS.md)
