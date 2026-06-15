import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { cp } from "node:fs/promises";
import { resolve } from "node:path";
import { log } from "../lib/log.js";
import { init } from "./init.js";

const REMIX_BRIEF = `# Remix this kit

You are **remixing** an existing kit into a NEW one. A remix is not a recolor:
give it its **own identity** AND **restructure** it so the two kits are not
recognizable as the same layout.

## Do
1. **New identity** — new palette (light + dark moodboard), new fonts, new radius
   feel. Update \`design/theme.css\` + \`design/tokens.json\` together, and document
   them in the README.
2. **New structure** — redesign the hero composition and the section order; swap or
   redesign the signature components. Don't keep the same page rhythm.
3. **Keep it full** — a complete design system, all four pages built for real,
   including a **dense, full dashboard** (multiple tables, charts, users, activity,
   states). Responsive (mobile→desktop). EN + AR + RTL + dark.
4. **Rebrand everything** — name, logo, copy (\`react/src/i18n/en.ts\` + \`ar.ts\`),
   \`uikit.json\` (id, name, description, fonts, palette), and the consumer skill.

## Then
- \`npx uikit-studio validate\` passes.
- Capture fresh screenshots; update the README.
- Push and list it at https://uikit.studio/submit

Reference the full bar in the base kit's \`prompts/build.md\`.
`;

/**
 * `uikit remix <source> <dir>` — like \`new\`, but drops a REMIX.md transform brief
 * so the result becomes a genuinely different kit (new identity + structure), not
 * a recolor.
 */
export async function remix(args: string[]): Promise<number> {
  const [source, dir] = args.filter((a) => !a.startsWith("-"));
  if (!source || !dir) {
    log.error("usage: uikit remix <git-url|local-path> <dir>");
    return 1;
  }
  const dest = resolve(process.cwd(), dir);
  if (existsSync(dest)) {
    log.error(`${dir} already exists`);
    return 1;
  }

  const isUrl = /^(https?:|git@)/.test(source);
  log.heading(`Remixing ${source} → ${dir}`);
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
      filter: (s) => !/\/(\.git|node_modules)(\/|$)/.test(s),
    });
  }

  await writeFile(resolve(dest, "REMIX.md"), REMIX_BRIEF);
  log.ok(`created ${dir} + REMIX.md`);
  log.info("  Open REMIX.md in your AI editor and give it a new identity + structure.");

  return init([dest]);
}
