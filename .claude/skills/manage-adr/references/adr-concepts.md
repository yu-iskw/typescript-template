# Architecture Decision Records (ADRs)

An Architecture Decision Record (ADR) is a short text file that captures an important architectural decision made along with its context and consequences.

## Why use ADRs?

- **Historical Context**: Understand _why_ a decision was made months or years later.
- **Onboarding**: Help new team members understand the architectural evolution.
- **Alignment**: Ensure everyone is on the same page regarding technical choices.
- **Avoiding Regressions**: Prevent re-litigating old decisions without new context.

## ADR Structure (Nygard Format)

1. **Title**: Number and short noun phrase (e.g., "1. Record architecture decisions").
2. **Status**: Proposed, Accepted, Superseded, etc.
3. **Context**: The situation and the problem being solved.
4. **Decision**: The chosen solution.
5. **Consequences**: The results of the decision (good and bad).

## Managing Lifecycle

- **Superseding**: When a new decision replaces an old one, the old one is marked as "Superseded" and links to the new one.
- **Linking**: Related decisions should be linked (e.g., "Amends", "Depends on").

## Immutability vs factual maintenance (this repo)

Classical ADR guidance often treats accepted records as **append-only** for the _decision narrative_. In this repository we add a practical rule for **AI agents and operators**:

- **Surgical edits are allowed** on **Accepted** ADRs when **only operational facts** drift: file paths, URLs, shell commands, diagram labels, and cross-links. The **Decision** and **tradeoffs** must remain the same; you are correcting _where_ and _how_, not rewriting _what we chose_ or _why_ without transparency.
- **Supersede** (or create a linked follow-on ADR) when the **decision itself** is no longer valid or a different tradeoff was chosen.
- **Do not** silently rewrite **Context** or **Decision** to pretend the organization always believed something different. If the story of the past must change, use **superseding** or a short **Historical note** that preserves honesty.

See [`../SKILL.md`](../SKILL.md) §2–§3 for the agent workflow (including when to ask the user).

## Agent-oriented scope

- **Good fit for a new ADR:** A **durable choice** among approaches (e.g. delivery semantics, routing model, operator CLI shape) with tradeoffs that future agents must not unknowingly undo.
- **Poor fit (default elsewhere):** A **checklist ADR** whose body is mostly “delete file X, remove job Y, drop target Z.” Prefer **one paragraph** under the ADR that records your **stack or tooling baseline** (**Follow-ups** / **Consequences**) and links to **`CLAUDE.md`** and relevant READMEs (and **`AGENTS.md`** if present); keep the full inventory in the **PR** or runbook.
- **Baseline ADR:** After `adr init docs/adr`, designate one early ADR (or the nearest equivalent) as the place for short operational follow-ups so agents have a single “current truth” pointer without a chain of cleanup ADRs.

## Tools

We use `adr-tools` to manage these records. It handles numbering, linking, and status updates automatically.
