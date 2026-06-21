# The contract (`uikit.json`) — what a kit must declare

Validated by `@uikit/manifest` (Zod + JSON Schema). Run `npx uikit-cli validate`.

## Required (the floor)

- `manifestVersion`: `1`
- `id`: kebab-case slug, globally unique
- `name`, `version` (semver, e.g. `1.0.0`)
- `tech.frameworks`: at least one of `react` · `vue` · `web-components`
- `media.screenshots`: must include **`logo`** and **`landing`** (kinds)

Everything else is optional in the *schema*, but the **standard** also requires a
runnable app per framework, the four pages (landing · pricing · dashboard ·
components), and EN/AR + RTL — see [structure.md](structure.md). The schema is the
floor; the standard is the bar.

Everything else is optional but strongly encouraged.

## Sections

| Section | Holds |
| --- | --- |
| `author` | `{ name, github?, url? }` |
| `type` | `app` (default) or `ecommerce` — the **structural type**: it decides the required pages (app → dashboard set; ecommerce → storefront set), not just a gallery facet |
| `categories` / `tags` | facets for the gallery |
| `tech` | `frameworks[]`, `styling` (`tailwind`/`css-vars`/`both`), `tailwindVersion?`, `icons?`, `deps[]` |
| `design` | `tokens`, `tailwindPreset`, `themeCss`, `fonts[]`, `palettes[]`, `modes[]` |
| `surface` | `components[]`, `blocks[]`, `templates[]` (each may carry repo-relative paths) |
| `prompts` | `origin`, `extend`, `skillVersion` |
| `consume` | `skill`, `skillName`, `steps[]`, `entry?`, `requires[]` — how an end user builds with it |
| `media` | `demoUrl?`, `screenshots[]` (typed: `logo`/`landing`/`dashboard`/`other`) |
| `registry` | `install?`, `components?` (path to shadcn-style registry) |

## Screenshot kinds

`logo` (required, used as the card icon) · `landing` (required, used as the card
thumbnail) · `dashboard` (optional) · `other` (optional, give it a `label`).

The gallery derives the card icon from `logo` and the thumbnail from `landing` —
there is no separate thumbnail field.

## Trust

`source` (official/community), `verified`, `verifiedBy`, `verifiedAt` live in the
**platform DB only**. Never put them in `uikit.json`.

See [templates/uikit.json](../templates/uikit.json) for a fill-in-the-blanks manifest.
