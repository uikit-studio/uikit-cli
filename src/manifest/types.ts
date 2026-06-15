import type { z } from "zod";
import type {
  authorSchema,
  baseManifestSchema,
  blockSchema,
  componentSchema,
  consumeSchema,
  designSchema,
  fontSchema,
  frameworkSchema,
  manifestSchema,
  mediaSchema,
  paletteSchema,
  promptsSchema,
  registrySchema,
  screenshotKindSchema,
  screenshotSchema,
  surfaceSchema,
  techSchema,
  templateSchema,
} from "./schema.js";

/** A validated `uikit.json`. */
export type Manifest = z.infer<typeof manifestSchema>;

/** The structural shape (before cross-field refinements). */
export type ManifestInput = z.input<typeof baseManifestSchema>;

export type Framework = z.infer<typeof frameworkSchema>;
export type ScreenshotKind = z.infer<typeof screenshotKindSchema>;

export type Author = z.infer<typeof authorSchema>;
export type Tech = z.infer<typeof techSchema>;
export type Font = z.infer<typeof fontSchema>;
export type Palette = z.infer<typeof paletteSchema>;
export type Design = z.infer<typeof designSchema>;
export type Component = z.infer<typeof componentSchema>;
export type Block = z.infer<typeof blockSchema>;
export type Template = z.infer<typeof templateSchema>;
export type Surface = z.infer<typeof surfaceSchema>;
export type Prompts = z.infer<typeof promptsSchema>;
export type Consume = z.infer<typeof consumeSchema>;
export type Screenshot = z.infer<typeof screenshotSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Registry = z.infer<typeof registrySchema>;
