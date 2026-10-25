---
name: design-ui
description: Guide user-facing interface work without choosing a frontend framework. Use this skill whenever a task changes layout, screens, forms, navigation, visual hierarchy, focus, keyboard behavior, responsive layout, or accessibility, even when the user does not say UX or design. Skip backend, library, and CLI tasks that do not change a user-facing interface.
---

# Design UI

## Purpose

Change a user-facing interface inside the stack the project already uses.

## When to skip

Skip this skill for backend, library, and CLI work that leaves the interface unchanged.

## Workflow

1. Read the UI stack from the manifest and the source. Name the framework, the styling system, and any design tokens already in use. If the project has no UI layer, ask which stack to use. Ask before you introduce or replace a framework, a styling system, or a component library.
2. Name the person using the screen, the task they must finish, and the devices to support. Keep that brief proportional to the task.
3. Reuse the project's components and tokens. Set hierarchy, type, spacing, feedback, and motion inside that system.
4. Use semantic elements, a visible focus style, and keyboard operation. Reflow the layout for narrow and wide viewports. Include loading, empty, error, and success when the screen has them. When you add motion, honor `prefers-reduced-motion`.
5. Run the project's existing checks. Walk the critical path with a keyboard at two viewport widths. If the project already has browser tests or an accessibility checker, run them on that path and record the command. Treat WCAG 2.2 as the requirements reference. A scan does not prove conformance.
6. Report the items in **Report**.

## Decide without asking

Make these choices inside the current architecture.

- Adjust type, spacing, hierarchy, and responsive layout.
- Improve semantic markup, names, and keyboard access.
- Use design tokens the project already has.
- Reuse components the project already ships.

## Ask before doing

Stop and ask before any of these.

- Introduce or replace a frontend framework or a styling system.
- Add a dependency, a paid service, a CI job, or a package script.
- Install or update a third-party agent skill, or enable an MCP server.
- Send project data to an external service.
- Change security policy or architecture policy.

## Report

List each item.

- Checks that ran, with the command and the result
- Checks that did not run, and why
- Assumptions you did not verify
- Remaining interface risks
- Decisions waiting for approval
