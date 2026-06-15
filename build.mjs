import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

rmSync(r("./dist"), { recursive: true, force: true });

/**
 * Bundle the CLI into a single, dependency-free executable. The contract
 * (`src/manifest`) is compiled in, and zod + picocolors are inlined — the
 * published package ships with zero runtime dependencies.
 */
await build({
  entryPoints: [r("./src/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: r("./dist/index.js"),
  logLevel: "info",
});
