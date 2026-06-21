import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { KIT_TYPES, type KitType } from "../manifest/index.js";
import { loadKit } from "../lib/kit.js";
import { log, pc } from "../lib/log.js";

const MARKER_START = "<!-- uikit:start -->";
const MARKER_END = "<!-- uikit:end -->";

/** The build brief a kit of this type should be developed against. */
const BUILD_BRIEF: Record<KitType, string> = {
  app: "prompts/build.md",
  ecommerce: "prompts/build.ecommerce.md",
};

/** Type-specific guidance baked into the managed CLAUDE.md block. */
function typeGuidance(type: KitType): string {
  if (type === "ecommerce") {
    return `- This is an **ecommerce storefront** kit: build storefront · products (search + filters) · product detail · cart/checkout — **not** a dashboard. Brief: \`${BUILD_BRIEF.ecommerce}\`.\n`;
  }
  return "";
}

function claudeBlock(
  kitName: string,
  skillName: string,
  skillPath: string,
  type: KitType,
  entry?: string,
): string {
  return `${MARKER_START}
## UI: ${kitName}

This project uses the **${kitName}** UI kit. A Claude Code skill is bundled at
\`${skillPath}\` (skill name: \`${skillName}\`). **Use it whenever you build or
style UI** — it has the kit's components, tokens, and rules so the result stays
consistent and cheap to produce.

- Build with the kit's tokens and components; don't invent new colors or one-off components.
${typeGuidance(type)}${entry ? `- Human usage guide: \`${entry}\`.\n` : ""}- Validate the manifest after changes: \`npx uikit-cli validate\`.
${MARKER_END}`;
}

/** Pull `--type <app|ecommerce>` out of the arg list; returns it (validated) + the rest. */
function takeType(args: string[]): { type?: KitType; rest: string[] } {
  const rest: string[] = [];
  let type: KitType | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i] as string;
    let value: string | undefined;
    if (a === "--type") value = args[++i];
    else if (a.startsWith("--type=")) value = a.slice("--type=".length);
    else {
      rest.push(a);
      continue;
    }
    if (!value || !(KIT_TYPES as readonly string[]).includes(value)) {
      throw new Error(`--type must be one of: ${KIT_TYPES.join(", ")}`);
    }
    type = value as KitType;
  }
  return { type, rest };
}

/** `uikit init` — wire a cloned kit's skill into the project. */
export function init(args: string[]): number {
  const { type: typeOverride, rest } = takeType(args);
  const { root, manifestPath, manifest: m } = loadKit(rest[0] ?? process.cwd());
  log.heading(`Initializing ${m.name}`);

  // 0. Resolve the effective kit type. An explicit --type wins and is persisted
  //    back into uikit.json so the kit declares it (the runnable app reads it to
  //    pick its page set).
  const type: KitType = typeOverride ?? m.type;
  if (typeOverride && typeOverride !== m.type) {
    const raw = readFileSync(manifestPath, "utf8");
    const updated = /"type"\s*:\s*"[^"]*"/.test(raw)
      ? raw.replace(/"type"\s*:\s*"[^"]*"/, `"type": "${typeOverride}"`)
      : raw.replace(/(\{\s*)/, `$1\n  "type": "${typeOverride}",`);
    writeFileSync(manifestPath, updated);
    log.ok(`set kit type: ${typeOverride}`);
  }

  // 1. Confirm the bundled consumer skill is present.
  if (m.consume) {
    const skillDir = resolve(root, m.consume.skill);
    if (existsSync(skillDir)) {
      log.ok(`skill ready: ${m.consume.skillName} (${m.consume.skill})`);
    } else {
      log.warn(`manifest references a skill at ${m.consume.skill}, but it was not found`);
    }
  } else {
    log.warn("this kit has no bundled consumer skill (consume block missing)");
  }

  // 2. Write/refresh the managed block in CLAUDE.md.
  const claudePath = resolve(root, "CLAUDE.md");
  const block = claudeBlock(
    m.name,
    m.consume?.skillName ?? m.id,
    m.consume?.skill ?? ".claude/skills",
    type,
    m.consume?.entry,
  );
  let next: string;
  if (existsSync(claudePath)) {
    const current = readFileSync(claudePath, "utf8");
    if (current.includes(MARKER_START)) {
      next = current.replace(
        new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`),
        block,
      );
    } else {
      next = `${current.trimEnd()}\n\n${block}\n`;
    }
  } else {
    next = `# ${m.name} app\n\n${block}\n`;
  }
  writeFileSync(claudePath, next);
  log.ok("wrote CLAUDE.md hints");

  // 3. Report dependencies to install.
  const deps = m.tech.deps ?? [];
  if (deps.length) {
    log.heading("Install dependencies");
    log.info(`  ${pc.cyan(`npm install ${deps.join(" ")}`)}`);
  }

  // 4. Next step.
  log.heading("Next");
  const ask = m.consume?.steps.at(-1) ?? "Open in Claude Code and ask it to build with this kit.";
  log.info(`  ${ask}`);
  if (existsSync(resolve(root, BUILD_BRIEF[type]))) {
    log.info(`  Build brief for this ${type} kit: ${pc.cyan(BUILD_BRIEF[type])}`);
  }
  return 0;
}
