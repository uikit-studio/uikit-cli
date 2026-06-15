import { z } from "zod";

/**
 * The `uikit.json` contract.
 *
 * This is the single source of truth for the manifest every kit repo carries.
 * The platform (ingest + gallery), the CLI, and the generator skill all import
 * from here so they can never drift.
 *
 * Keep it strict and versioned. `manifestVersion` is bumped when the *contract*
 * changes shape; it is independent of a kit's own `version`.
 */

export const MANIFEST_VERSION = 1 as const;

/** A url-safe, lowercase, kebab-case identifier. */
const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "must be lowercase kebab-case (a-z, 0-9, dashes)",
  });

/** A semver string like 1.2.0 or 1.2.0-beta.1. */
const semver = z
  .string()
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/, {
    message: "must be a semver version, e.g. 1.2.0",
  });

/** Repo-relative path (no leading slash, no traversal). */
const repoPath = z
  .string()
  .min(1)
  .regex(/^(?!\/)(?!.*\.\.).+$/, {
    message: "must be a repo-relative path (no leading slash, no '..')",
  });

export const FRAMEWORKS = ["react", "vue", "web-components"] as const;
export const STYLING = ["tailwind", "css-vars", "both"] as const;
export const COLOR_MODES = ["light", "dark"] as const;
export const SCREENSHOT_KINDS = ["logo", "landing", "dashboard", "other"] as const;
export const FONT_SOURCES = ["google", "local", "system", "url"] as const;

export const frameworkSchema = z.enum(FRAMEWORKS);
export const screenshotKindSchema = z.enum(SCREENSHOT_KINDS);

export const authorSchema = z.object({
  name: z.string().min(1),
  github: z.string().min(1).optional(),
  url: z.url().optional(),
});

export const techSchema = z.object({
  frameworks: z.array(frameworkSchema).min(1, {
    message: "a kit must ship at least one framework",
  }),
  styling: z.enum(STYLING).default("tailwind"),
  tailwindVersion: z.string().min(1).optional(),
  icons: z.string().min(1).optional(),
  deps: z.array(z.string().min(1)).optional(),
});

export const fontSchema = z.object({
  family: z.string().min(1),
  source: z.enum(FONT_SOURCES).default("google"),
  url: z.url().optional(),
});

export const paletteSchema = z.object({
  name: z.string().min(1),
  primary: z.string().min(1),
});

export const designSchema = z.object({
  tokens: repoPath.optional(),
  tailwindPreset: repoPath.optional(),
  themeCss: repoPath.optional(),
  fonts: z.array(fontSchema).optional(),
  palettes: z.array(paletteSchema).optional(),
  modes: z.array(z.enum(COLOR_MODES)).optional(),
});

export const componentSchema = z.object({
  name: z.string().min(1),
  react: repoPath.optional(),
  vue: repoPath.optional(),
  web: repoPath.optional(),
});

export const blockSchema = z.object({
  name: z.string().min(1),
  preview: repoPath.optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1),
  route: z.string().min(1).optional(),
  preview: repoPath.optional(),
});

export const surfaceSchema = z.object({
  components: z.array(componentSchema).optional(),
  blocks: z.array(blockSchema).optional(),
  templates: z.array(templateSchema).optional(),
});

export const promptsSchema = z.object({
  origin: repoPath.optional(),
  extend: repoPath.optional(),
  skillVersion: z.string().min(1).optional(),
});

export const consumeSchema = z.object({
  skill: repoPath,
  skillName: slug,
  steps: z.array(z.string().min(1)).min(1),
  entry: repoPath.optional(),
  requires: z.array(z.string().min(1)).optional(),
});

export const screenshotSchema = z.object({
  kind: screenshotKindSchema,
  /** repo-relative path or an absolute url. */
  src: z.string().min(1),
  label: z.string().min(1).optional(),
});

export const mediaSchema = z.object({
  demoUrl: z.url().optional(),
  screenshots: z.array(screenshotSchema).min(1, {
    message: "at least the 'logo' and 'landing' screenshots are required",
  }),
});

export const registrySchema = z.object({
  install: z.string().min(1).optional(),
  components: repoPath.optional(),
});

/**
 * Structural schema — fully representable as JSON Schema. Cross-field rules
 * (e.g. "must have a logo + landing screenshot") are layered on in
 * {@link manifestSchema} as refinements so the JSON Schema export stays clean.
 */
export const baseManifestSchema = z.object({
  $schema: z.string().optional(),
  manifestVersion: z.literal(MANIFEST_VERSION),

  id: slug,
  name: z.string().min(1),
  version: semver,
  description: z.string().min(1).optional(),
  author: authorSchema.optional(),
  license: z.string().min(1).optional(),
  homepage: z.url().optional(),
  repository: z.url().optional(),

  categories: z.array(slug).optional(),
  tags: z.array(z.string().min(1)).optional(),

  tech: techSchema,
  design: designSchema.optional(),
  surface: surfaceSchema.optional(),
  prompts: promptsSchema.optional(),
  consume: consumeSchema.optional(),
  media: mediaSchema,
  registry: registrySchema.optional(),
});

/** Screenshot kinds that every kit must provide. */
export const REQUIRED_SCREENSHOT_KINDS = ["logo", "landing"] as const;

/**
 * The full runtime schema: structural shape + cross-field invariants.
 * Use this to validate. Use {@link baseManifestSchema} to emit JSON Schema.
 */
export const manifestSchema = baseManifestSchema.superRefine((value, ctx) => {
  const kinds = new Set(value.media.screenshots.map((s) => s.kind));
  for (const required of REQUIRED_SCREENSHOT_KINDS) {
    if (!kinds.has(required)) {
      ctx.addIssue({
        code: "custom",
        path: ["media", "screenshots"],
        message: `a '${required}' screenshot is required`,
      });
    }
  }
});
