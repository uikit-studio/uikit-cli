import { loadKit } from "../lib/kit.js";
import { log, pc } from "../lib/log.js";

/** `uikit info [path]` — print a kit's tech, templates, and consume steps. */
export function info(args: string[]): number {
  const { manifest: m } = loadKit(args[0] ?? process.cwd());

  log.heading(`${m.name} ${pc.dim(`v${m.version}`)}`);
  if (m.description) log.dim(m.description);

  log.heading("Tech");
  log.info(`  frameworks: ${m.tech.frameworks.join(", ")}`);
  log.info(`  styling:    ${m.tech.styling}`);
  if (m.tech.icons) log.info(`  icons:      ${m.tech.icons}`);

  const templates = m.surface?.templates ?? [];
  if (templates.length) {
    log.heading("Templates");
    for (const t of templates) log.info(`  • ${t.name}${t.route ? pc.dim(`  ${t.route}`) : ""}`);
  }

  if (m.consume) {
    log.heading("Consume");
    log.info(`  skill: ${m.consume.skillName} (${m.consume.skill})`);
    m.consume.steps.forEach((s, i) => log.info(`  ${i + 1}. ${s}`));
  }

  if (m.media.demoUrl) {
    log.heading("Demo");
    log.info(`  ${m.media.demoUrl}`);
  }
  return 0;
}
