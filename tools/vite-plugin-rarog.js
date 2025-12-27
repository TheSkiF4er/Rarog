/*!
 * Vite plugin for Rarog CSS
 *
 * Минимальная обёртка вокруг `rarog build` в JIT-режиме.
 * Использование:
 *
 *   // vite.config.ts
 *   import { defineConfig } from 'vite';
 *   import react from '@vitejs/plugin-react';
 *   import { rarogPlugin } from './tools/vite-plugin-rarog';
 *
 *   export default defineConfig({
 *     plugins: [
 *       react(),
 *       rarogPlugin()
 *     ]
 *   });
 */
const { spawn } = require("child_process");
const path = require("path");

function runRarogBuild(rootDir, options = {}) {
  return new Promise((resolve, reject) => {
    const args = ["build"];
    if (options.mode) {
      // режим управляется через rarog.config.*, но можно пробросить env
      process.env.RAROG_MODE = options.mode;
    }

    const child = spawn("rarog", args, {
      cwd: rootDir,
      stdio: "inherit",
      shell: process.platform === "win32"
    });

    child.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`rarog build exited with code ${code}`));
    });
  });
}

function rarogPlugin(userOptions = {}) {
  const opts = Object.assign({ mode: "jit" }, userOptions);

  return {
    name: "rarog-plugin",
    apply: "serve",

    configResolved(resolved) {
      this._rarogRoot = resolved.root || process.cwd();
    },

    async buildStart() {
      // Для prod-сборки можно вызвать rarog build вручную из npm-скриптов.
      if (this.meta.watchMode) {
        await runRarogBuild(this._rarogRoot, opts).catch(() => {
          // Ошибку выводит сам rarog; Vite продолжает работать.
        });
      }
    },

    configureServer(server) {
      const rootDir = this._rarogRoot || server.config.root;

      const trigger = () => {
        runRarogBuild(rootDir, opts).catch(() => {});
      };

      // Стартовая сборка
      trigger();

      // Пересборка при изменении шаблонов / ресурсов
      server.watcher.on("change", file => {
        if (file.includes("resources/")) {
          trigger();
        }
      });
    }
  };
}

module.exports = {
  rarogPlugin
};
