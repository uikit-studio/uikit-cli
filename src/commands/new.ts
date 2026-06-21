import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import { log } from "../lib/log.js";
import { init } from "./init.js";

/**
 * `uikit new <source> <dir>` — clone (git URL) or copy (local path) a kit into
 * <dir>, then run init. The one-step version of the consumption flow.
 */
export async function newKit(args: string[]): Promise<number> {
  const [source, dir] = args.filter((a) => !a.startsWith("-"));
  if (!source || !dir) {
    log.error("usage: uikit new <git-url|local-path> <dir> [--type app|ecommerce]");
    return 1;
  }
  // Everything that isn't the two positionals (e.g. `--type ecommerce`, value
  // included) is forwarded to init with its order preserved.
  let seenSource = false;
  let seenDir = false;
  const passthrough = args.filter((a) => {
    if (!seenSource && a === source) return (seenSource = true), false;
    if (!seenDir && a === dir) return (seenDir = true), false;
    return true;
  });
  const dest = resolve(process.cwd(), dir);
  if (existsSync(dest)) {
    log.error(`${dir} already exists`);
    return 1;
  }

  const isUrl = /^(https?:|git@)/.test(source);
  log.heading(`Creating ${dir}`);
  if (isUrl) {
    log.step(`git clone ${source}`);
    execFileSync("git", ["clone", "--depth", "1", source, dest], { stdio: "inherit" });
  } else {
    const src = resolve(process.cwd(), source);
    if (!existsSync(resolve(src, "uikit.json"))) {
      log.error(`${source} is not a kit (no uikit.json)`);
      return 1;
    }
    log.step(`copy ${source}`);
    await cp(src, dest, {
      recursive: true,
      // Skip the .git/ and node_modules/ directories — but keep dotfiles like
      // .gitignore / .github (a plain "/.git" substring check would drop those).
      filter: (s) => !/\/(\.git|node_modules)(\/|$)/.test(s),
    });
  }
  log.ok(`created ${dir}`);

  return init([dest, ...passthrough]);
}
