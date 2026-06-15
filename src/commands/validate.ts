import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { formatIssues, parseManifest } from "../manifest/index.js";
import { log } from "../lib/log.js";

/** `uikit validate [path]` — validate a uikit.json against the contract. */
export function validate(args: string[]): number {
  const target = args[0] ?? "uikit.json";
  const path = resolve(target.endsWith(".json") ? target : `${target}/uikit.json`);

  if (!existsSync(path)) {
    log.error(`No manifest found at ${path}`);
    return 1;
  }

  const result = parseManifest(readFileSync(path, "utf8"));
  if (result.ok) {
    const m = result.data;
    log.ok(`${path} is valid`);
    log.dim(`  ${m.name} v${m.version} · ${m.tech.frameworks.join(", ")}`);
    return 0;
  }

  log.error(`${path} is invalid:`);
  console.error(formatIssues(result.issues));
  return 1;
}
