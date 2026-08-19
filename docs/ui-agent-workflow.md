# UI agent workflow

This template keeps UI tooling **opt-in** because it is also used for backend, CLI, library, and infrastructure-oriented TypeScript projects. The goal is to give coding agents a commercial-grade UI workflow without forcing a frontend framework or design system into every repository created from the template.

The repository-local source of truth is the `ui-quality` skill at `.claude/skills/ui-quality/SKILL.md`. Compatible agents can also discover it through `.agents/skills`.

## Recommended capability stack

Use a small layered stack rather than a large bundle of overlapping UI prompts.

| Layer | Recommended capability | Role | Required by template? |
| --- | --- | --- | --- |
| Product/design direction | Anthropic `frontend-design` | Establish deliberate visual direction and avoid generic generated UI | No |
| Implementation constraints | Existing project design system; shadcn/ui when already selected | Reuse proven components and interaction primitives | No |
| Frontend engineering | Repository `ui-quality` skill + existing framework conventions | Responsive, accessible, maintainable implementation | Yes for UI work |
| Visual feedback | Cursor Design Mode | Select/annotate rendered UI and provide precise visual feedback | No |
| Browser verification | Cursor Playwright plugin | Exercise the real rendered application, interactions, viewports, and runtime states | Strongly recommended |
| Deterministic gates | Existing lint/build/test/E2E/a11y/visual checks | Catch regressions independently of model judgment | Use what the derived project provides |

## Cursor setup

Cursor is the primary interactive coding-agent surface for this template.

### shadcn/ui

When a derived project has intentionally chosen shadcn/ui, install the official shadcn Cursor plugin:

```text
/add-plugin shadcn
```

Do **not** add shadcn/ui to a project merely to use the plugin. Existing components and design systems take precedence.

Marketplace: <https://cursor.com/marketplace/shadcn>

### Playwright

Install Cursor's verified Playwright plugin when you want the agent to inspect and exercise the rendered web application:

```text
/add-plugin playwright
```

Marketplace: <https://cursor.com/marketplace/cursor/playwright>

Use the browser feedback loop after material UI implementation. The agent should navigate the changed route, exercise the primary journey, inspect representative viewports, check keyboard behavior, and report what was actually verified.

### Design Mode

Use Cursor Design Mode for iterative visual review when selecting or annotating the rendered element is clearer than describing it in prose. Design Mode complements browser testing; it does not replace interaction or accessibility verification.

## Claude Code setup

For design-heavy frontend work, install Anthropic's official `frontend-design` plugin through Claude Code's plugin UI/commands when available:

```text
/plugin install frontend-design@claude-plugins-official
```

Official plugin source: <https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design>

The plugin is an aesthetic/design capability. Continue to follow `AGENTS.md`, the local `ui-quality` skill, the existing component architecture, and repository quality gates.

## Optional community skills

The following projects can add useful specialized guidance, but they are **not vendored or auto-installed by this template**:

- Impeccable: <https://github.com/pbakaus/impeccable>
- UI Skills: <https://github.com/ibelick/ui-skills>
- Addy Osmani agent skills: <https://github.com/addyosmani/agent-skills>
- Vercel agent skills: <https://github.com/vercel-labs/agent-skills>

Before adopting a community skill:

1. Review its license and provenance.
2. Inspect `SKILL.md`, scripts, hooks, MCP configuration, and any remote references.
3. Prefer a small set of skills with distinct responsibilities.
4. Pin or vendor a reviewed revision when reproducibility matters.
5. Re-review before upgrading instead of tracking mutable remote instructions blindly.

Do not install a large skill bundle just to increase the number of available prompts.

## Closed-loop workflow

### 1. Understand the product surface

Identify the user, job-to-be-done, relevant route/components, framework, existing component system, styling strategy, and supported breakpoints.

### 2. Choose a coherent direction

Use the existing visual language first. For new product surfaces, establish hierarchy, density, typography, spacing, color, and interaction intent before writing large amounts of UI code.

### 3. Implement with proven primitives

Reuse existing project components. Use shadcn/ui only when it is already part of the project or explicitly selected for the product.

Implement production states, not only the happy-path screenshot:

- loading/progress;
- empty/no-results;
- validation/error;
- success/confirmation;
- disabled and destructive actions;
- keyboard/focus states;
- narrow and wide layouts;
- overflow/long-content cases where relevant.

### 4. Inspect the rendered result

Use Cursor Design Mode for targeted visual feedback and Playwright/browser tooling for the running application.

Review hierarchy, spacing, typography, density, alignment, color usage, icons, motion, content overflow, and responsive behavior.

### 5. Exercise the interaction

Run the primary user journey end to end. Check keyboard navigation and representative non-happy states that can be exercised safely.

A code review is not a visual review. If the agent could not inspect the rendered UI, it must say so rather than claiming that the UI looks correct.

### 6. Run deterministic checks

Use the derived project's existing checks. For this template, the shared gates include:

```bash
pnpm lint:eslint
pnpm test
pnpm build
```

If the derived project already has E2E, accessibility, Storybook, Lighthouse, or visual-regression checks, include the relevant ones. Avoid adding heavyweight tooling without a product or regression-prevention reason.

### 7. Report evidence

A UI implementation handoff should state:

- changed user journey/pages;
- reused/introduced design-system components;
- viewports and interactions actually inspected;
- accessibility checks actually performed;
- deterministic commands run and results;
- any unverified visual/product states.

## Suggested prompt

Use this when delegating a material UI feature:

```text
Implement this UI as a production product surface, not a demo screenshot.

Follow the repository ui-quality skill. Preserve the existing framework and design system. Establish a coherent visual hierarchy before implementation, cover loading/empty/error/success/focus/responsive states that apply, and prefer existing components over bespoke primitives.

After implementation, inspect the actual rendered application with the available browser tooling, exercise the primary user journey and keyboard behavior, check representative wide/medium/narrow viewports, fix issues you find, then run the repository's relevant lint/build/test gates.

In the final handoff, distinguish what you actually verified from anything that remains unverified.
```
