# manage-adr

Architecture Decision Records workflow for this repo. **Authoritative instructions:** [`SKILL.md`](SKILL.md).

Create a new ADR from the repository root:

```bash
REPO="$(git rev-parse --show-toplevel)"
"$REPO/.claude/skills/manage-adr/scripts/create-adr.sh" "Title of the ADR"
```

Requires [adr-tools](https://github.com/npryce/adr-tools) (`adr`) on `PATH`.
