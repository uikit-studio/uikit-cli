import { z } from "zod";
import { baseManifestSchema, MANIFEST_VERSION } from "./schema.js";

export const SCHEMA_ID = `https://uikit.dev/schema/v${MANIFEST_VERSION}.json`;

/**
 * Build the JSON Schema for `uikit.json` from the structural Zod schema.
 *
 * Cross-field invariants (required logo + landing screenshots) live in
 * {@link manifestSchema}'s refinements and are not representable in JSON Schema;
 * the runtime validator enforces them. The JSON Schema covers structure, which
 * is what editors and CI use for autocomplete + a first validation pass.
 */
export function buildJsonSchema(): Record<string, unknown> {
  const schema = z.toJSONSchema(baseManifestSchema, {
    target: "draft-2020-12",
    unrepresentable: "any",
  }) as Record<string, unknown>;

  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: SCHEMA_ID,
    title: "uikit.json",
    description: "The UIKit manifest contract — describes a UI kit for the gallery, CLI, and generator.",
    ...schema,
  };
}
