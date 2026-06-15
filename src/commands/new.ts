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
    log.error("usage: uikit new <git-url|local-path> <dir>");
    return 1;
  }
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
      filter: (s) => !s.includes("/.git") && !s.includes("/node_modules"),
    });
  }
  log.ok(`created ${dir}`);

  return init([dest]);
}
