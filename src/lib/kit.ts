import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Manifest, parseManifest } from "../manifest/index.js";

export interface LoadedKit {
  root: string;
  manifestPath: string;
  manifest: Manifest;
}

/**
 * Load + validate the uikit.json in `root`. Throws a friendly error if it is
 * missing or invalid.
 */
export function loadKit(root = process.cwd()): LoadedKit {
  const manifestPath = resolve(root, "uikit.json");
  if (!existsSync(manifestPath)) {
    throw new Error(
      `No uikit.json found in ${root}. Run this inside a cloned kit repo (or pass a path).`,
    );
  }
  const result = parseManifest(readFileSync(manifestPath, "utf8"));
  if (!result.ok) {
    const issues = result.issues.map((i) => `  • ${i.path}: ${i.message}`).join("\n");
    throw new Error(`uikit.json is invalid:\n${issues}`);
  }
  return { root, manifestPath, manifest: result.data };
}
