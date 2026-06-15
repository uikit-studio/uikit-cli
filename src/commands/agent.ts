import { writeFileSync } from "node:fs";
import { log, pc } from "../lib/log.js";

const SITE = "https://uikit.studio";

/** Resolve a kit id / gallery URL / spec URL → the spec + manifest URLs. */
function resolveSpec(target: string): { id: string; page: string; llms: string; manifest: string } {
  // Bare id, e.g. "spark".
  if (/^[a-z0-9][a-z0-9-]*$/.test(target)) {
    const page = `${SITE}/kit/${target}`;
    return { id: target, page, llms: `${page}/llms.txt`, manifest: `${page}/manifest.json` };
  }
  // A URL — strip a trailing /llms.txt or /manifest.json and any trailing slash.
  const base = target.replace(/\/$/, "").replace(/\/(llms\.txt|manifest\.json)$/, "");
  const id = base.match(/\/kit\/([a-z0-9-]+)/)?.[1] ?? base.split("/").filter(Boolean).pop() ?? "kit";
  return { id, page: base, llms: `${base}/llms.txt`, manifest: `${base}/manifest.json` };
}

/**
 * `uikit agent <id|url>` — fetch a kit's agent-readable design spec so an AI agent
 * (or you) can reproduce that exact design. Prints the markdown brief to stdout by
 * default; `--json` prints the machine manifest; `--save` writes it to a file.
 */
export async function agent(args: string[]): Promise<number> {
  const flags = args.filter((a) => a.startsWith("-"));
  const [target] = args.filter((a) => !a.startsWith("-"));
  if (!target) {
    log.error("usage: uikit agent <kit-id|url> [--json] [--save]");
    log.dim("  e.g. uikit agent spark   ·   uikit agent https://uikit.studio/kit/spark --save");
    return 1;
  }

  const asJson = flags.includes("--json");
  const save = flags.includes("--save") || flags.includes("-o");
  const { id, page, llms, manifest } = resolveSpec(target);
  const url = asJson ? manifest : llms;

  let body: string;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      log.error(`could not fetch ${url} (HTTP ${res.status})`);
      log.dim("Is the kit listed on uikit.studio? Try the bare id, e.g. `uikit agent spark`.");
      return 1;
    }
    body = await res.text();
  } catch (err) {
    log.error(`fetch failed: ${err instanceof Error ? err.message : String(err)}`);
    return 1;
  }

  if (save) {
    const out = asJson ? `${id}.manifest.json` : `${id}.design.md`;
    writeFileSync(out, body);
    log.ok(`saved ${out}`);
    log.dim(`Tell your agent: "read ${out} and build my site in that exact design."`);
    return 0;
  }

  // Default: emit the spec to stdout (what an agent ingests).
  process.stdout.write(body.endsWith("\n") ? body : body + "\n");
  // Human hint on stderr so piping stdout stays clean.
  console.error(
    `\n${pc.dim("— spec:")} ${llms}  ${pc.dim("manifest:")} ${manifest}  ${pc.dim("page:")} ${page}`,
  );
  return 0;
}
