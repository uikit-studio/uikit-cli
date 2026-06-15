import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface RegistryFile {
  path: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: "lib" | "component" | "block" | "template";
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
}

export interface Registry {
  name: string;
  items: RegistryItem[];
}

export function loadRegistry(root: string, relPath = "registry/index.json"): Registry {
  const path = resolve(root, relPath);
  if (!existsSync(path)) {
    throw new Error(`No registry found at ${relPath}. This kit doesn't support \`uikit add\`.`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as Registry;
}

/**
 * Resolve the requested item names into a flat, dependency-ordered list with no
 * duplicates (registryDependencies first). Throws on unknown names.
 */
export function resolveItems(registry: Registry, names: string[]): RegistryItem[] {
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const ordered: RegistryItem[] = [];
  const seen = new Set<string>();

  const visit = (name: string, trail: string[]): void => {
    if (seen.has(name)) return;
    const item = byName.get(name);
    if (!item) {
      const where = trail.length ? ` (required by ${trail[trail.length - 1]})` : "";
      throw new Error(`Unknown registry item "${name}"${where}.`);
    }
    if (trail.includes(name)) return; // guard against cycles
    for (const dep of item.registryDependencies ?? []) {
      visit(dep, [...trail, name]);
    }
    seen.add(name);
    ordered.push(item);
  };

  for (const name of names) visit(name, []);
  return ordered;
}

/** Collect the unique npm dependencies across a set of items. */
export function collectNpmDeps(items: RegistryItem[]): string[] {
  const deps = new Set<string>();
  for (const item of items) for (const d of item.dependencies ?? []) deps.add(d);
  return [...deps].sort();
}
