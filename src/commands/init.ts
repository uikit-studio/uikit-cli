import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadKit } from "../lib/kit.js";
import { log, pc } from "../lib/log.js";

const MARKER_START = "<!-- uikit:start -->";
const MARKER_END = "<!-- uikit:end -->";

function claudeBlock(kitName: string, skillName: string, skillPath: string, entry?: string): string {
  return `${MARKER_START}
## UI: ${kitName}

This project uses the **${kitName}** UI kit. A Claude Code skill is bundled at
\`${skillPath}\` (skill name: \`${skillName}\`). **Use it whenever you build or
style UI** — it has the kit's components, tokens, and rules so the result stays
consistent and cheap to produce.

- Build with the kit's tokens and components; don't invent new colors or one-off components.
${entry ? `- Human usage guide: \`${entry}\`.\n` : ""}- Validate the manifest after changes: \`npx uikit-studio validate\`.
${MARKER_END}`;
}

/** `uikit init` — wire a cloned kit's skill into the project. */
export function init(args: string[]): number {
  const { root, manifest: m } = loadKit(args[0] ?? process.cwd());
  log.heading(`Initializing ${m.name}`);

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
  return 0;
}
