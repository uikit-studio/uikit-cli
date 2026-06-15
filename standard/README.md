# uikit-standard (generator skill)

A Claude Code skill that scaffolds a **complete, contract-valid UI kit** in its own
repo from a brief — tokens, components, dashboard + landing templates, a bundled
consumer skill, screenshots, and a passing `uikit.json`.

- **[SKILL.md](./SKILL.md)** — the generation process (9 steps + hard rules).
- **[reference/](./reference)** — the contract + the kit repo structure.
- **[templates/](./templates)** — fill-in-the-blanks scaffolds (manifest, consumer
  skill, starter components, theme).

It shares the **same contract** (`@uikit/manifest`) as the platform and the `uikit`
CLI, so what it generates is exactly what the gallery ingests and the CLI consumes —
they can never drift. The generated kit must pass `npx uikit-studio validate`.

The **Aurora** kit (`aurora-uikit`) is the gold-standard reference output.
