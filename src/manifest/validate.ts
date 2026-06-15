import { z } from "zod";
import { manifestSchema } from "./schema.js";
import type { Manifest } from "./types.js";

export interface ValidationIssue {
  /** Dotted path to the offending field, e.g. "media.screenshots". */
  path: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: Manifest }
  | { ok: false; issues: ValidationIssue[] };

function toIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.length ? issue.path.join(".") : "(root)",
    message: issue.message,
  }));
}

/**
 * Validate an unknown value against the `uikit.json` contract.
 * Never throws — returns a discriminated result so callers (CLI, ingest,
 * generator) can report errors uniformly.
 */
export function validateManifest(input: unknown): ValidationResult {
  const result = manifestSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, issues: toIssues(result.error) };
}

/**
 * Parse a JSON string into a validated manifest. Returns a JSON-parse issue
 * instead of throwing on malformed input.
 */
export function parseManifest(json: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch (error) {
    return {
      ok: false,
      issues: [
        {
          path: "(root)",
          message: `invalid JSON: ${(error as Error).message}`,
        },
      ],
    };
  }
  return validateManifest(raw);
}

/** Throwing variant — handy in tests and trusted code paths. */
export function assertManifest(input: unknown): Manifest {
  return manifestSchema.parse(input);
}

/** Format issues into a human-readable, multi-line string. */
export function formatIssues(issues: ValidationIssue[]): string {
  return issues.map((i) => `  • ${i.path}: ${i.message}`).join("\n");
}
