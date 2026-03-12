#!/usr/bin/env node

const { createRarogPluginStarter } = require("../lib/plugin-starter");

const [, , name, ...args] = process.argv;
const dirFlagIndex = args.findIndex((item) => item === "--dir");
const dir = dirFlagIndex >= 0 ? args[dirFlagIndex + 1] : undefined;

const result = createRarogPluginStarter({ name: name || "my-plugin", dir });
console.log(`[rarog] Plugin starter created: ${result.packageName}`);
result.files.forEach((file) => console.log(` - ${file}`));
