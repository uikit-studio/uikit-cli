---
name: REPLACE-slug-ui
description: >-
  Build apps with the REPLACE Name UI kit. Use whenever the user asks to create,
  extend, or style any UI in a project that contains this kit. Gives exact
  components, tokens, import paths, and composition rules so the result matches
  the kit and stays consistent.
---

# Building with REPLACE Name

REPLACE Name is <one-line vibe>. When this skill is active, **build with the
kit's tokens and components — never invent new colors, spacing, or one-off
components.**

## Golden rules

1. **Use the tokens, not hex values.** Style with `bg-background`, `text-foreground`,
   `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary` /
   `text-primary-foreground`. Never write `bg-[#hex]`.
2. **Reuse components.** Import from the kit; don't rebuild. See
   `reference/components.md`.
3. **Type roles are tokens.** Headings use the display font (`font-display`),
   micro-labels/eyebrows/stats use `font-mono`, body uses `font-sans`. Use the
   `<Mark>` highlight on the key word of big headings.
4. **Radius + shadow are tokens** (`rounded-[--radius]`, the kit's shadow token).
5. **Dark mode is free** — tokens flip under `.dark`.
6. **Stay bilingual.** Put every user-facing string in `i18n/en.ts` + `i18n/ar.ts`;
   never hard-code copy in a component. Keep layouts RTL-safe (`text-start`,
   `rtl:` variants for anything directional).
7. **Compose from blocks and pages first** (landing/pricing/dashboard/showcase).

## What's in the box

- Components (`react/components/`): Button, Card, Input, Badge, …
- Blocks (`react/blocks/`): Navbar, StatCards, …
- Templates (`react/templates/`): Dashboard, Landing.
- Tokens (`design/`): tokens.json, theme.css, tailwind-preset.js.

## How to build a new screen

1. Start from the closest template/block.
2. Swap in the user's data; keep the structure and classes.
3. Compose existing components for new pieces.
4. Stay inside the token system; add new tokens to `design/` rather than hard-coding.

See `reference/tokens.md` and `reference/components.md`.
