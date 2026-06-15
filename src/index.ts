#!/usr/bin/env node
import { add } from "./commands/add.js";
import { agent } from "./commands/agent.js";
import { info } from "./commands/info.js";
import { init } from "./commands/init.js";
import { newKit } from "./commands/new.js";
import { remix } from "./commands/remix.js";
import { validate } from "./commands/validate.js";
import { log, pc } from "./lib/log.js";

const HELP = `${pc.bold("uikit")} — work with UI kits from the UIKit gallery

${pc.bold("Usage")}
  uikit <command> [args]

${pc.bold("Commands")}
  init [path]              Wire a cloned kit's skill into the project
  add <item...>            Copy components/blocks/templates into your project
  new <src> <dir>          Clone/copy a kit into <dir> and init it
  remix <src> <dir>        Like new, + a brief to restyle/restructure into a new kit
  validate [path]          Validate a uikit.json against the contract
  info [path]              Print a kit's tech, templates, and consume steps
  agent <id|url>           Fetch a kit's agent-readable design spec (--json, --save)

${pc.bold("Examples")}
  uikit new https://github.com/uikit-studio/base-uikit my-kit
  uikit remix ./aurora-uikit my-kit
  cd my-kit && uikit add dashboard
  uikit agent spark                       # print the design brief an agent can rebuild
  uikit agent https://uikit.studio/kit/spark --save
  uikit validate
`;

async function main(): Promise<number> {
  const [cmd, ...args] = process.argv.slice(2);

  switch (cmd) {
    case "init":
      return init(args);
    case "add":
      return add(args);
    case "new":
      return newKit(args);
    case "remix":
      return remix(args);
    case "validate":
      return validate(args);
    case "info":
      return info(args);
    case "agent":
      return agent(args);
    case undefined:
    case "-h":
    case "--help":
    case "help":
      console.log(HELP);
      return 0;
    default:
      log.error(`unknown command: ${cmd}`);
      console.log(HELP);
      return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
