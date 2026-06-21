export {
  MANIFEST_VERSION,
  FRAMEWORKS,
  STYLING,
  COLOR_MODES,
  SCREENSHOT_KINDS,
  FONT_SOURCES,
  KIT_TYPES,
  REQUIRED_SCREENSHOT_KINDS,
  manifestSchema,
  baseManifestSchema,
  authorSchema,
  kitTypeSchema,
  techSchema,
  designSchema,
  surfaceSchema,
  promptsSchema,
  consumeSchema,
  mediaSchema,
  screenshotSchema,
  registrySchema,
} from "./schema.js";

export {
  validateManifest,
  parseManifest,
  assertManifest,
  formatIssues,
} from "./validate.js";
export type { ValidationResult, ValidationIssue } from "./validate.js";

export { buildJsonSchema, SCHEMA_ID } from "./json-schema.js";

export type {
  Manifest,
  ManifestInput,
  Framework,
  KitType,
  ScreenshotKind,
  Author,
  Tech,
  Font,
  Palette,
  Design,
  Component,
  Block,
  Template,
  Surface,
  Prompts,
  Consume,
  Screenshot,
  Media,
  Registry,
} from "./types.js";
