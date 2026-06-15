# uikit-studio

The `uikit` CLI — scaffold, validate, and add UI kits from the
[uikit.studio](https://uikit.studio) gallery.

A kit is a runnable starter product: a full design system, real pages, and a
bundled AI skill. This CLI clones one into your project, wires its skill into
Claude Code, and copies individual components/templates shadcn-style.

## Install

```bash
npm i -g uikit-studio   # provides the `uikit` command
```

Or run any command one-off with `npx uikit-studio <command>`.

## Commands

```
uikit new <src> <dir>     Clone (git URL) or copy (local path) a kit into <dir>, then init it
uikit init [path]         Wire a cloned kit's consumer skill into the project (writes CLAUDE.md)
uikit add <item...>       Copy components/blocks/templates (and their deps) into your project
uikit validate [path]     Validate a uikit.json against the contract
uikit info [path]         Print a kit's tech, templates, and consume steps
```

### Examples

```bash
# Start a new app from a kit
npx uikit-studio new https://github.com/uikit-studio/aurora-uikit my-app
cd my-app

# Pull a full template plus every component it depends on
uikit add dashboard

# Make sure a kit you authored is contract-valid before submitting
uikit validate
```

## Authoring & submitting a kit

See the full guide at <https://uikit.studio/submit>.

## What's in this repo

- `src/` — the CLI (published to npm as **uikit-studio**).
- `src/manifest/` + `schema/` — the **`uikit.json` contract**: the Zod schema, the
  generated JSON Schema, and the validator the CLI runs.
- `standard/` — **`uikit-standard`**, the Claude Code skill that generates a complete,
  contract-valid kit from a brief.

## License

MIT
