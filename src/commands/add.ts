import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadKit } from "../lib/kit.js";
import { log, pc } from "../lib/log.js";
import { collectNpmDeps, loadRegistry, resolveItems } from "../lib/registry.js";

/** `uikit add <item...>` — copy components/blocks/templates into the project. */
export function add(args: string[]): number {
  const names = args.filter((a) => !a.startsWith("-"));
  if (names.length === 0) {
    log.error("usage: uikit add <item> [item...]");
    return 1;
  }

  const { root, manifest: m } = loadKit();
  const registry = loadRegistry(root, m.registry?.components ?? "registry/index.json");
  const items = resolveItems(registry, names);

  log.heading(`Adding ${names.join(", ")} from ${registry.name}`);

  let copied = 0;
  for (const item of items) {
    for (const file of item.files) {
      const from = resolve(root, file.path);
      const to = resolve(process.cwd(), file.target);
      if (!existsSync(from)) {
        log.warn(`source missing: ${file.path} (skipped)`);
        continue;
      }
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
      log.ok(`${item.name} → ${file.target}`);
      copied++;
    }
  }

  const deps = collectNpmDeps(items);
  if (deps.length) {
    log.heading("Install dependencies");
    log.info(`  ${pc.cyan(`npm install ${deps.join(" ")}`)}`);
  }

  log.heading("Done");
  log.dim(`  ${copied} file(s) added · ${items.length} registry item(s) resolved`);
  return 0;
}
