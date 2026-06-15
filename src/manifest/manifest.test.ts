import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildJsonSchema,
  parseManifest,
  validateManifest,
} from "./index.js";

const fixtures = resolve(dirname(fileURLToPath(import.meta.url)), "../fixtures");
const load = (file: string) =>
  JSON.parse(readFileSync(resolve(fixtures, file), "utf8")) as unknown;

describe("validateManifest — valid fixtures", () => {
  it("accepts the full Aurora manifest", () => {
    const result = validateManifest(load("aurora.uikit.json"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe("aurora");
      expect(result.data.tech.frameworks).toContain("react");
    }
  });

  it("accepts a minimal manifest (only required fields)", () => {
    const result = validateManifest(load("minimal.uikit.json"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      // styling defaults applied
      expect(result.data.tech.styling).toBe("tailwind");
    }
  });
});

describe("validateManifest — invalid fixtures", () => {
  it("rejects a manifest missing the required 'landing' screenshot", () => {
    const result = validateManifest(load("invalid-missing-landing.uikit.json"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => /landing/.test(i.message))).toBe(true);
    }
  });

  it("rejects a bad id, bad version, and empty frameworks at once", () => {
    const result = validateManifest(load("invalid-bad-id.uikit.json"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const paths = result.issues.map((i) => i.path);
      expect(paths).toContain("id");
      expect(paths).toContain("version");
      expect(paths).toContain("tech.frameworks");
    }
  });

  it("rejects the wrong manifestVersion", () => {
    const result = validateManifest({
      manifestVersion: 2,
      id: "x",
      name: "X",
      version: "1.0.0",
      tech: { frameworks: ["react"] },
      media: { screenshots: [{ kind: "logo", src: "a" }, { kind: "landing", src: "b" }] },
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non-object input without throwing", () => {
    expect(validateManifest(null).ok).toBe(false);
    expect(validateManifest("nope").ok).toBe(false);
    expect(validateManifest(42).ok).toBe(false);
  });
});

describe("parseManifest", () => {
  it("reports a JSON parse error instead of throwing", () => {
    const result = parseManifest("{ not json ");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.message).toMatch(/invalid JSON/);
    }
  });

  it("round-trips a serialized valid manifest", () => {
    const json = readFileSync(resolve(fixtures, "aurora.uikit.json"), "utf8");
    expect(parseManifest(json).ok).toBe(true);
  });
});

describe("buildJsonSchema", () => {
  it("produces a draft-2020-12 schema with the manifest fields", () => {
    const schema = buildJsonSchema();
    expect(schema.$schema).toMatch(/2020-12/);
    expect(schema.$id).toMatch(/v1\.json$/);
    const props = (schema as { properties?: Record<string, unknown> }).properties;
    expect(props).toBeDefined();
    expect(props).toHaveProperty("id");
    expect(props).toHaveProperty("tech");
    expect(props).toHaveProperty("media");
  });
});
