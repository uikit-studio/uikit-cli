---
name: uikit-standard
description: >-
  Generate a complete, runnable, contract-valid UIKit kit in its own repo from a
  brief (e.g. "a dark fintech dashboard kit, indigo, Inter, glass cards"). Use
  when an author/admin wants to author a new UI kit for the UIKit gallery.
  Produces a full design system, runnable multi-page apps (React/Vue/Web
  Components), EN/AR + RTL, a bundled consumer skill, screenshots, and a valid
  uikit.json.
---

# UIKit Standard — the kit generator

You are scaffolding a **new UI kit repo** that plugs into the UIKit gallery. The
output is not a bin of loose components — it is a **runnable starter product** a
developer clones, runs, and builds their app from.

> **Pick a fresh identity for every kit.** Choose this kit's own palette, fonts,
> radius, and personality from the brief. **Never copy another kit's theme.** The
> rules below are about *structure and richness*, not a specific look.
>
> **Reference implementation:** the `spark-uikit` repo is the gold standard for the
> *shape* — runnable React+Vite app, full design system, the four pages, and EN/AR +
> RTL. Mirror its structure; give your kit a completely different look.

## What "done" looks like (non-negotiable)

A finished kit MUST:

1. **Run out of the box.** `cd <framework> && pnpm install && pnpm dev` shows a real
   app — no setup, no missing fonts.
2. **Be a full product, not a sampler.** Multiple real pages (see below), each with
   genuine content the dev can swap.
3. **Ship a full design system** — tokens (light + dark), a typographic scale, and a
   real component set.
4. **Support EN + AR with full RTL** — a language toggle, an Arabic typeface, and a
   layout that flips correctly (`dir="rtl"`).
5. **Validate.** `npx uikit-studio validate` passes.

## Required pages (every kit)

Build these as real routes in the runnable app:

- **Landing** — multi-section: hero, a marquee/ticker, a features grid, a dark
  "bento"/feature section, a big CTA, and a footer.
- **Pricing** (or a second marketing page that fits the brief) — full page.
- **Dashboard** — sidebar + KPI stat cards + a data table.
- **Components** — the **design-system showcase**: color swatches, the type scale,
  fonts, and every component in its variants. This is the "see everything" page.

A thin app shell (`routes/layout.tsx`) holds the header: logo, page nav, the
**EN/AR toggle**, a **dark-mode toggle**, and a CTA.

## Signature richness (apply, but theme it yourself)

These techniques make a kit feel designed. Use them with **this kit's own** colors
and fonts:

- A **display typeface** for headings + a **monospace** face for micro-labels
  (eyebrows, stats, table headers) + a body face. Load real fonts.
- A **highlight-marker** heading accent (a `<Mark>` that paints a block behind key
  words). Define `--color-mark` in the theme.
- A **marquee/ticker** strip. **Pills** and **badges**. Subtle **textures**
  (e.g. a dotted background utility). Generous radius; consider pill buttons.
- Dark mode via tokens that flip under `.dark` — never hand-rolled variants.

## Process (in order)

1. **Parse the brief** → id (slug), name, category/tags, palette, fonts, radius,
   personality, target frameworks (React first).
2. **Design tokens** → `design/tokens.json` (DTCG) → `design/theme.css` (Tailwind v4
   `@theme`, incl. `--font-display/--font-sans/--font-mono`, `--color-mark`, dark
   block, and an `[dir="rtl"]` font swap) → `design/tailwind-preset.js` (v3 compat).
3. **i18n** → `<framework>/src/i18n/` with `en` + `ar` dictionaries and a provider
   that sets `document.documentElement.dir`/`lang` and toggles language.
4. **Design system** → `cn` util, then components (Button, Card, Input, Badge, Pill,
   Mark, Marquee, Container, …) on the tokens.
5. **Blocks → pages** → compose Navbar/Footer/StatCards blocks, then assemble the
   four required pages, all driven by the i18n dictionaries.
6. **Consumer skill** → `.claude/skills/<id>/` (SKILL.md + reference) — teaches an AI
   to build with this kit's tokens, components, and rules.
7. **Registry** → `registry/index.json` (shadcn-style add targets) so
   `uikit add <item>` works into another project.
8. **Screenshots** → author real images in `screenshots/` (logo + landing required).
9. **Manifest** → `uikit.json` from [templates/uikit.json](templates/uikit.json),
   then `npx uikit-studio validate` until it passes.
10. **Docs + git** → `USAGE.md` (lead with "cd <framework> && pnpm install &&
    pnpm dev"), `prompts/build.md`, `prompts/extend.md`, `README.md`, then `git init`.

## Frameworks

Ship **React + Vue + Web Components** versions of the same design system, each a
runnable app the user can run independently. Lead with React + Vite; mirror the
design system and pages in `vue/` and `web/`. `design/` is shared and
framework-agnostic.

## Hard rules

- **Run-it-or-it-doesn't-ship.** Every framework folder runs with `pnpm dev`.
- **Required pages:** landing · pricing · dashboard · components-showcase.
- **EN + AR + RTL** are mandatory, not optional.
- **Validate before done:** `npx uikit-studio validate` passes.
- **Required screenshots:** `logo` + `landing`. Author them.
- **Never self-declare trust** (`verified` is platform-side only).
- **Own identity.** New palette + fonts per kit. Reuse *patterns*, not *themes*.
- **Keep it focused.** Four solid pages + a real design system beats twenty rough screens.

See [reference/structure.md](reference/structure.md) for the exact repo layout and
[reference/contract.md](reference/contract.md) for the manifest.
