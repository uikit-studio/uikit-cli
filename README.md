# uikit-cli

The `uikit` CLI — scaffold, validate, and add UI kits from the
[uikit.studio](https://uikit.studio) gallery.

A kit is a runnable starter product: a full design system, real pages, and a
bundled AI skill. This CLI clones one into your project, wires its skill into
Claude Code, and copies individual components/templates shadcn-style.

## Install

```bash
npm i -g uikit-cli   # provides the `uikit` command
```

Or run any command one-off with `npx uikit-cli <command>`.

## Commands

```
uikit new <src> <dir>     Clone (git URL) or copy (local path) a kit into <dir>, then init it
uikit remix <src> <dir>   Like new, + a REMIX.md brief to restyle/restructure into a new kit
uikit init [path]         Wire a cloned kit's consumer skill into the project (writes CLAUDE.md)
uikit add <item...>       Copy components/blocks/templates (and their deps) into your project
uikit validate [path]     Validate a uikit.json against the contract
uikit info [path]         Print a kit's tech, templates, and consume steps
uikit agent <id|url>      Fetch a kit's agent-readable design spec (--json, --save)
```

### Examples

```bash
# Start a new app from a kit
npx uikit-cli new https://github.com/uikit-studio/aurora-uikit my-app
cd my-app

# Pull a full template plus every component it depends on
uikit add dashboard

# Make sure a kit you authored is contract-valid before submitting
uikit validate
```

## Build with a design by URL (agent-ready)

Every kit on uikit.studio is **agent-ready**: it publishes a machine-readable design
spec, so you can hand any AI agent a single URL and get that exact design.

Paste into Claude Code / Cursor / Codex:

> Build me a website styled exactly like this design: https://uikit.studio/kit/spark —
> it's agent-ready. Read the spec at https://uikit.studio/kit/spark/llms.txt and match
> its tokens, fonts, radius and components.

Or pull the spec from the terminal so your agent can ingest it:

```bash
uikit agent spark                 # print the design brief (llms.txt) to stdout
uikit agent spark --json          # the machine manifest (tokens, fonts, components)
uikit agent spark --save          # write spark.design.md next to your code
```

The spec lives at `uikit.studio/kit/<id>/llms.txt` (+ `manifest.json`), indexed
site-wide at `uikit.studio/llms.txt`. Kits you author ship the same files
(`AGENTS.md` + `llms.txt`) at their repo root, so pointing an agent at the **repo**
works too.

## Author a kit — the full loop

The whole lifecycle, copy‑paste:

```bash
# 1 · Scaffold — fork an existing kit and reskin it (fastest start)
npx uikit-cli new ./aurora-uikit my-kit      # local path, or a git URL
cd my-kit/react

# 2 · Develop — it's a real Vite app
pnpm install
pnpm dev                                         # edit & see live

# 3 · Reskin — give it its OWN identity:
#     design/theme.css + design/tokens.json  (colors, fonts, radius)
#     react/src/routes/*  and  react/src/i18n/*  (pages + EN/AR copy)

# 4 · Validate the contract
cd ..                                            # kit root
npx uikit-cli validate                        # must pass
npx uikit-cli info                            # preview tech/templates

# 5 · Ship its own repo
git init -b main && git add -A && git commit -m "my-kit"
gh repo create <you>/my-kit --public --source=. --push
```

Then **list it in the gallery**: open a PR adding `apps/web/content/kits/<id>.json`
to [`uikit-studio/uikit`](https://github.com/uikit-studio/uikit). CI validates it; a
maintainer merges; it's live. Full guide: <https://uikit.studio/submit>.

> A kit must **run out of the box** and be a full product, with a real design system
> (light + dark) and EN/AR + RTL. The required pages depend on the kit's **`type`**:
> `app` (default) → landing · pricing · dashboard · components; `ecommerce` →
> storefront · products (search + filter) · product detail · cart/checkout · components.
> Scaffold a store with `uikit new <src> <dir> --type ecommerce`. Pick a fresh identity —
> never copy another kit's theme. Ship `AGENTS.md` + `llms.txt` at the root so it's
> **agent-ready** (reproducible by URL).

## What's in this repo

- `src/` — the CLI (published to npm as **uikit-cli**).
- `src/manifest/` + `schema/` — the **`uikit.json` contract**: the Zod schema, the
  generated JSON Schema, and the validator the CLI runs.
- `standard/` — **`uikit-standard`**, the Claude Code skill that generates a complete,
  contract-valid kit from a brief.

## License

MIT
