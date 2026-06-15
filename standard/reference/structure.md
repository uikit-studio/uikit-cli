# Kit repo structure (what to emit)

A kit is **shared design tokens** + one **runnable app per framework** + the
contract/skill/registry. Each framework folder runs on its own.

```text
<id>-uikit/
├─ uikit.json                  # the contract (validate it!)
├─ README.md · USAGE.md        # USAGE leads with: cd react && pnpm install && pnpm dev
├─ .claude/skills/<id>/        # the consumer skill (SKILL.md + reference/)
├─ design/                     # framework-agnostic, shared by all apps
│  ├─ tokens.json              # W3C DTCG — source of truth
│  ├─ theme.css                # Tailwind v4 @theme: fonts (display/sans/mono),
│  │                           #   colors (+ --color-mark), dark block, [dir=rtl] swap
│  └─ tailwind-preset.js       # Tailwind v3 compat
├─ react/                      # runnable Vite + React app (the reference)
│  ├─ index.html               # loads the display, body, mono + Arabic fonts
│  ├─ package.json · vite.config.ts · tsconfig.json
│  ├─ pnpm-workspace.yaml      # allowBuilds: esbuild, @tailwindcss/oxide
│  └─ src/
│     ├─ main.tsx              # router + <I18nProvider>
│     ├─ app.css               # @import tailwindcss; @import ../../design/theme.css
│     ├─ i18n/                 # en.ts · ar.ts · index.tsx (provider + useI18n)
│     ├─ lib/cn.ts
│     ├─ components/           # button · card · input · badge · pill · mark · marquee · container
│     ├─ blocks/               # navbar · footer · stat-cards
│     └─ routes/               # layout · landing · pricing · dashboard · showcase
├─ vue/                        # same design system + pages, runnable
├─ web/                        # web components, runnable
├─ registry/index.json         # shadcn-style `uikit add` targets (point at <fw>/src/...)
├─ prompts/  build.md · extend.md
└─ screenshots/  logo.svg · landing.svg   (required) · dashboard.svg …
```

## Required routes (in every runnable app)

| Route | Is |
| --- | --- |
| `/` | Landing — hero · marquee · features grid · dark bento · CTA · footer |
| `/pricing` | Full pricing page (or a second marketing page that fits the brief) |
| `/dashboard` | Sidebar · KPI stat cards · data table |
| `/components` | Design-system showcase — colors · type · every component variant |

`routes/layout.tsx` = the app shell: logo · page nav · **EN/AR toggle** ·
**dark toggle** · CTA. All page copy comes from `i18n/en.ts` + `i18n/ar.ts`.

## Naming

- Repo `<id>-uikit` · manifest `id` `<id>` (kebab) · consumer skill `<id>-ui`.
- Registry items lowercase, one per component/block/template, `target` = where it
  lands in a consumer project (e.g. `components/ui/button.tsx`).

## RTL checklist

- `dir`/`lang` set on `<html>` from the active language.
- Use logical utilities (`text-start`, `ps-*/pe-*`) and `rtl:` variants where a
  glyph must flip (e.g. arrows: `rtl:rotate-180`).
- Marquee/animations reverse under `[dir="rtl"]`.
- Arabic typeface loaded; `[dir="rtl"]` swaps `--font-display/--font-sans` to it.
