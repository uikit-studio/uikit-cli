import { describe, expect, it } from "vitest";
import { collectNpmDeps, resolveItems, type Registry } from "./lib/registry.js";

const registry: Registry = {
  name: "test",
  items: [
    { name: "cn", type: "lib", files: [{ path: "a", target: "a" }], dependencies: ["clsx"] },
    {
      name: "button",
      type: "component",
      files: [{ path: "b", target: "b" }],
      dependencies: ["cva"],
      registryDependencies: ["cn"],
    },
    {
      name: "dashboard",
      type: "template",
      files: [{ path: "c", target: "c" }],
      registryDependencies: ["button"],
    },
  ],
};

describe("resolveItems", () => {
  it("orders registry dependencies before dependents, no dupes", () => {
    const order = resolveItems(registry, ["dashboard"]).map((i) => i.name);
    expect(order).toEqual(["cn", "button", "dashboard"]);
  });

  it("dedupes across multiple requested items", () => {
    const order = resolveItems(registry, ["button", "dashboard"]).map((i) => i.name);
    expect(order).toEqual(["cn", "button", "dashboard"]);
  });

  it("throws on an unknown item", () => {
    expect(() => resolveItems(registry, ["nope"])).toThrow(/Unknown registry item/);
  });
});

describe("collectNpmDeps", () => {
  it("collects unique sorted npm deps", () => {
    const items = resolveItems(registry, ["dashboard"]);
    expect(collectNpmDeps(items)).toEqual(["clsx", "cva"]);
  });
});
