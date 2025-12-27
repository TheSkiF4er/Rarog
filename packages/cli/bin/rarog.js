#!/usr/bin/env node
/*!
 * Rarog CLI
 * Простая утилита командной строки для сборки токенов и работы с проектом.
 *
 * Команды:
 *   rarog build   - сгенерировать CSS-токены и rarog.tokens.json из rarog.config.js
 *   rarog init    - создать стартовый rarog.config.js/ts и пример проекта
 *   rarog docs    - запустить dev-документацию (обёртка вокруг tools/docs-dev.mjs)
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

/* -------------------------------------------------------------------------- */
/* Путь до корня проекта                                                      */
/* -------------------------------------------------------------------------- */

const BIN_DIR = __dirname;
const ROOT_DIR = path.resolve(BIN_DIR, "..", "..", "..");

/* -------------------------------------------------------------------------- */
/* Конфиг по умолчанию                                                        */
/* -------------------------------------------------------------------------- */

const defaultConfig = {
  theme: {
    colors: {
      primary: {
        50:  "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a"
      },
      secondary: {
        50:  "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a"
      },
      success: {
        50:  "#ecfdf3",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d"
      },
      danger: {
        50:  "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d"
      },
      warning: {
        50:  "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12"
      },
      info: {
        50:  "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e"
      },
      semantic: {
        bg: "#f3f4f6",
        bgSoft: "#ffffff",
        bgElevated: "#ffffff",
        bgElevatedSoft: "#f9fafb",
        surface: "#ffffff",
        borderSubtle: "#e5e7eb",
        border: "#e5e7eb",
        borderStrong: "#111827",
        muted: "#9ca3af",
        text: "#0f172a",
        textMuted: "#6b7280",
        focusRing: "#3b82f6",
        accentSoft: "#eff6ff"
      }
    },
    spacing: {
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem"
    },
    radius: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px"
    },
    shadow: {
      xs: "0 1px 2px rgba(15, 23, 42, 0.08)",
      sm: "0 2px 4px rgba(15, 23, 42, 0.12)",
      md: "0 4px 6px rgba(15, 23, 42, 0.16)",
      lg: "0 10px 15px rgba(15, 23, 42, 0.25)"
    }
  },
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  extend: {
    colors: {},
    spacing: {},
    radius: {},
    shadow: {}
  },
  plugins: []
};

/* -------------------------------------------------------------------------- */
/* Утилиты                                                                    */
/* -------------------------------------------------------------------------- */

function pathFromRoot(rel) {
  return path.join(ROOT_DIR, rel);
}

function readJSON(rel) {
  const p = pathFromRoot(rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeFile(rel, content) {
  const p = pathFromRoot(rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, "utf8");
}

/**
 * Простое глубокое слияние объектов (для theme / extend).
 */
function deepMerge(base, extra) {
  if (!extra || typeof extra !== "object") return base;
  const result = Array.isArray(base) ? base.slice() : Object.assign({}, base);

  for (const key of Object.keys(extra)) {
    const value = extra[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Загрузка конфига                                                           */
/* -------------------------------------------------------------------------- */

function loadUserConfig() {
  const jsPath = pathFromRoot("rarog.config.js");
  if (fs.existsSync(jsPath)) {
    // CJS-конфиг
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const cfg = require(jsPath);
    return cfg && cfg.default ? cfg.default : cfg;
  }
  return null;
}

function getEffectiveConfig() {
  const user = loadUserConfig();
  if (!user) return defaultConfig;

  const merged = Object.assign({}, defaultConfig);

  merged.theme = deepMerge(defaultConfig.theme, user.theme || {});
  merged.screens = deepMerge(defaultConfig.screens, user.screens || {});

  if (user.extend) {
    if (user.extend.colors) {
      merged.theme.colors = Object.assign(
        {},
        merged.theme.colors,
        user.extend.colors
      );
    }
    if (user.extend.spacing) {
      merged.theme.spacing = Object.assign(
        {},
        merged.theme.spacing,
        user.extend.spacing
      );
    }
    if (user.extend.radius) {
      merged.theme.radius = Object.assign(
        {},
        merged.theme.radius,
        user.extend.radius
      );
    }
    if (user.extend.shadow) {
      merged.theme.shadow = Object.assign(
        {},
        merged.theme.shadow,
        user.extend.shadow
      );
    }
  }

  merged.plugins = user.plugins || defaultConfig.plugins || [];
  return merged;
}

/* -------------------------------------------------------------------------- */
/* Генерация токенов из конфига                                               */
/* -------------------------------------------------------------------------- */

function generateColorCss(theme) {
  const c = theme.colors || {};
  const primary = c.primary || {};
  const secondary = c.secondary || {};
  const success = c.success || {};
  const danger = c.danger || {};
  const warning = c.warning || {};
  const info = c.info || {};
  const semantic = c.semantic || {};

  return [
":root {",
"  /* Primary scale (blue) */",
`  --rarog-color-primary-50:  ${primary[50] || "#eff6ff"};`,
`  --rarog-color-primary-100: ${primary[100] || "#dbeafe"};`,
`  --rarog-color-primary-200: ${primary[200] || "#bfdbfe"};`,
`  --rarog-color-primary-300: ${primary[300] || "#93c5fd"};`,
`  --rarog-color-primary-400: ${primary[400] || "#60a5fa"};`,
`  --rarog-color-primary-500: ${primary[500] || "#3b82f6"};`,
`  --rarog-color-primary-600: ${primary[600] || "#2563eb"};`,
`  --rarog-color-primary-700: ${primary[700] || "#1d4ed8"};`,
`  --rarog-color-primary-800: ${primary[800] || "#1e40af"};`,
`  --rarog-color-primary-900: ${primary[900] || "#1e3a8a"};`,
"",
"  /* Secondary scale (slate) */",
`  --rarog-color-secondary-50:  ${secondary[50] || "#f8fafc"};`,
`  --rarog-color-secondary-100: ${secondary[100] || "#f1f5f9"};`,
`  --rarog-color-secondary-200: ${secondary[200] || "#e2e8f0"};`,
`  --rarog-color-secondary-300: ${secondary[300] || "#cbd5e1"};`,
`  --rarog-color-secondary-400: ${secondary[400] || "#94a3b8"};`,
`  --rarog-color-secondary-500: ${secondary[500] || "#64748b"};`,
`  --rarog-color-secondary-600: ${secondary[600] || "#475569"};`,
`  --rarog-color-secondary-700: ${secondary[700] || "#334155"};`,
`  --rarog-color-secondary-800: ${secondary[800] || "#1e293b"};`,
`  --rarog-color-secondary-900: ${secondary[900] || "#0f172a"};`,
"",
"  /* Success scale (green) */",
`  --rarog-color-success-50:  ${success[50] || "#ecfdf3"};`,
`  --rarog-color-success-100: ${success[100] || "#dcfce7"};`,
`  --rarog-color-success-200: ${success[200] || "#bbf7d0"};`,
`  --rarog-color-success-300: ${success[300] || "#86efac"};`,
`  --rarog-color-success-400: ${success[400] || "#4ade80"};`,
`  --rarog-color-success-500: ${success[500] || "#22c55e"};`,
`  --rarog-color-success-600: ${success[600] || "#16a34a"};`,
`  --rarog-color-success-700: ${success[700] || "#15803d"};`,
`  --rarog-color-success-800: ${success[800] || "#166534"};`,
`  --rarog-color-success-900: ${success[900] || "#14532d"};`,
"",
"  /* Danger scale (red) */",
`  --rarog-color-danger-50:  ${danger[50] || "#fef2f2"};`,
`  --rarog-color-danger-100: ${danger[100] || "#fee2e2"};`,
`  --rarog-color-danger-200: ${danger[200] || "#fecaca"};`,
`  --rarog-color-danger-300: ${danger[300] || "#fca5a5"};`,
`  --rarog-color-danger-400: ${danger[400] || "#f87171"};`,
`  --rarog-color-danger-500: ${danger[500] || "#ef4444"};`,
`  --rarog-color-danger-600: ${danger[600] || "#dc2626"};`,
`  --rarog-color-danger-700: ${danger[700] || "#b91c1c"};`,
`  --rarog-color-danger-800: ${danger[800] || "#991b1b"};`,
`  --rarog-color-danger-900: ${danger[900] || "#7f1d1d"};`,
"",
"  /* Warning scale (orange) */",
`  --rarog-color-warning-50:  ${warning[50] || "#fff7ed"};`,
`  --rarog-color-warning-100: ${warning[100] || "#ffedd5"};`,
`  --rarog-color-warning-200: ${warning[200] || "#fed7aa"};`,
`  --rarog-color-warning-300: ${warning[300] || "#fdba74"};`,
`  --rarog-color-warning-400: ${warning[400] || "#fb923c"};`,
`  --rarog-color-warning-500: ${warning[500] || "#f97316"};`,
`  --rarog-color-warning-600: ${warning[600] || "#ea580c"};`,
`  --rarog-color-warning-700: ${warning[700] || "#c2410c"};`,
`  --rarog-color-warning-800: ${warning[800] || "#9a3412"};`,
`  --rarog-color-warning-900: ${warning[900] || "#7c2d12"};`,
"",
"  /* Info scale (sky) */",
`  --rarog-color-info-50:  ${info[50] || "#f0f9ff"};`,
`  --rarog-color-info-100: ${info[100] || "#e0f2fe"};`,
`  --rarog-color-info-200: ${info[200] || "#bae6fd"};`,
`  --rarog-color-info-300: ${info[300] || "#7dd3fc"};`,
`  --rarog-color-info-400: ${info[400] || "#38bdf8"};`,
`  --rarog-color-info-500: ${info[500] || "#0ea5e9"};`,
`  --rarog-color-info-600: ${info[600] || "#0284c7"};`,
`  --rarog-color-info-700: ${info[700] || "#0369a1"};`,
`  --rarog-color-info-800: ${info[800] || "#075985"};`,
`  --rarog-color-info-900: ${info[900] || "#0c4a6e"};`,
"",
"  /* Brand (semantic base) */",
`  --rarog-color-primary: ${(semantic.primary && semantic.primary) || "var(--rarog-color-primary-600)"};`,
`  --rarog-color-primary-foreground: ${semantic.primaryForeground || "#ffffff"};`,
"",
`  --rarog-color-secondary: ${(semantic.secondary && semantic.secondary) || "var(--rarog-color-secondary-600)"};`,
`  --rarog-color-secondary-foreground: ${semantic.secondaryForeground || "#ffffff"};`,
"",
"  --rarog-color-success: var(--rarog-color-success-600);",
"  --rarog-color-danger:  var(--rarog-color-danger-600);",
"  --rarog-color-warning: var(--rarog-color-warning-600);",
"  --rarog-color-info:    var(--rarog-color-info-600);",
"",
"  /* Backgrounds & neutrals (default theme) */",
`  --rarog-color-bg:              ${semantic.bg || "#f3f4f6"};`,
`  --rarog-color-bg-soft:         ${semantic.bgSoft || "#ffffff"};`,
`  --rarog-color-bg-elevated:     ${semantic.bgElevated || "#ffffff"};`,
`  --rarog-color-bg-elevated-soft:${semantic.bgElevatedSoft || "#f9fafb"};`,
`  --rarog-color-surface:         ${semantic.surface || "#ffffff"};`,
"",
`  --rarog-color-border-subtle:   ${semantic.borderSubtle || "#e5e7eb"};`,
`  --rarog-color-border:          ${semantic.border || "#e5e7eb"};`,
`  --rarog-color-border-strong:   ${semantic.borderStrong || "#111827"};`,
"",
`  --rarog-color-muted:           ${semantic.muted || "#9ca3af"};`,
`  --rarog-color-text:            ${semantic.text || "#0f172a"};`,
`  --rarog-color-text-muted:      ${semantic.textMuted || "#6b7280"};`,
"",
"  /* Semantic helpers */",
`  --rarog-color-focus-ring:      ${semantic.focusRing || "var(--rarog-color-primary-500)"};`,
`  --rarog-color-accent-soft:     ${semantic.accentSoft || "var(--rarog-color-primary-50)"};`,
"}",
""].join("\n");
}

function generateSpacingCss(theme) {
  const spacing = theme.spacing || {};
  const keys = Object.keys(spacing).sort((a, b) => Number(a) - Number(b));
  const lines = [":root {"];
  for (const key of keys) {
    lines.push(`  --rarog-space-${key}: ${spacing[key]};`);
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function generateRadiusCss(theme) {
  const radius = theme.radius || {};
  const order = ["xs", "sm", "md", "lg", "xl", "full"];
  const lines = [":root {"];
  for (const key of order) {
    if (radius[key] != null) {
      lines.push(`  --rarog-radius-${key}: ${radius[key]};`);
    }
  }
  // Дополнительные (если добавлены через extend)
  for (const key of Object.keys(radius)) {
    if (!order.includes(key)) {
      lines.push(`  --rarog-radius-${key}: ${radius[key]};`);
    }
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function generateShadowCss(theme) {
  const shadow = theme.shadow || {};
  const order = ["xs", "sm", "md", "lg"];
  const lines = [":root {"];
  for (const key of order) {
    if (shadow[key] != null) {
      lines.push(`  --rarog-shadow-${key}: ${shadow[key]};`);
    }
  }
  for (const key of Object.keys(shadow)) {
    if (!order.includes(key)) {
      lines.push(`  --rarog-shadow-${key}: ${shadow[key]};`);
    }
  }
  lines.push("}");
  lines.push("");
  return lines.join("\n");
}

function generateBreakpointsCss(screens) {
  const sc = screens || {};
  const sm = sc.sm || "640px";
  const md = sc.md || "768px";
  const lg = sc.lg || "1024px";
  const xl = sc.xl || "1280px";
  const x2 = sc["2xl"] || "1536px";

  return [
"/* Rarog CSS Framework - Breakpoints",
" *",
" * Рекомендуемые значения (min-width):",
` *   sm: ${sm}   — малые экраны (телефоны в горизонтали, небольшие планшеты)`,
` *   md: ${md}   — планшеты`,
` *   lg: ${lg}  — ноутбуки`,
` *   xl: ${xl}  — широкие экраны`,
` *   2xl: ${x2} — очень широкие экраны и десктопы`,
" *",
" * Эти значения можно переопределять в своей теме или через сборку.",
" */",
"",
":root {",
`  --rarog-breakpoint-sm: ${sm};`,
`  --rarog-breakpoint-md: ${md};`,
`  --rarog-breakpoint-lg: ${lg};`,
`  --rarog-breakpoint-xl: ${xl};`,
`  --rarog-breakpoint-2xl: ${x2};`,
"}",
""].join("\n");
}

function generateTokensJson(theme, screens, version) {
  const tokens = {
    version: version || "1.0.0",
    source: "Rarog CSS Framework",
    tokens: {
      color: {
        primary: Object.assign({}, theme.colors.primary, {
          base: "{color.primary.600}",
          foreground: "#ffffff"
        }),
        secondary: Object.assign({}, theme.colors.secondary, {
          base: "{color.secondary.600}",
          foreground: "#ffffff"
        }),
        success: Object.assign({}, theme.colors.success, {
          base: "{color.success.600}"
        }),
        danger: Object.assign({}, theme.colors.danger, {
          base: "{color.danger.600}"
        }),
        warning: Object.assign({}, theme.colors.warning, {
          base: "{color.warning.600}"
        }),
        info: Object.assign({}, theme.colors.info, {
          base: "{color.info.600}"
        }),
        semantic: {
          bg: theme.colors.semantic.bg,
          bgSoft: theme.colors.semantic.bgSoft,
          bgElevated: theme.colors.semantic.bgElevated,
          bgElevatedSoft: theme.colors.semantic.bgElevatedSoft,
          surface: theme.colors.semantic.surface,
          border: theme.colors.semantic.border,
          borderSubtle: theme.colors.semantic.borderSubtle,
          borderStrong: theme.colors.semantic.borderStrong,
          muted: theme.colors.semantic.muted,
          text: theme.colors.semantic.text,
          textMuted: theme.colors.semantic.textMuted,
          focusRing: theme.colors.semantic.focusRing,
          accentSoft: theme.colors.semantic.accentSoft
        }
      },
      spacing: theme.spacing,
      radius: theme.radius,
      shadow: theme.shadow,
      screens: screens
    }
  };

  return JSON.stringify(tokens, null, 2);
}

/* -------------------------------------------------------------------------- */
/* Команды CLI                                                                */
/* -------------------------------------------------------------------------- */

function cmdBuild() {
  const cfgJson = readJSON("rarog.config.json");
  const effective = getEffectiveConfig();

  const colorCss = generateColorCss(effective.theme);
  const spacingCss = generateSpacingCss(effective.theme);
  const radiusCss = generateRadiusCss(effective.theme);
  const shadowCss = generateShadowCss(effective.theme);
  const breakpointsCss = generateBreakpointsCss(effective.screens);

  writeFile(cfgJson.tokens.colors, colorCss);
  writeFile(cfgJson.tokens.spacing, spacingCss);
  writeFile(cfgJson.tokens.radius, radiusCss);
  writeFile(cfgJson.tokens.shadow, shadowCss);
  writeFile(cfgJson.tokens.breakpoints, breakpointsCss);

  const pkg = readJSON("package.json");
  const tokensJson = generateTokensJson(
    effective.theme,
    effective.screens,
    pkg.version
  );
  writeFile("rarog.tokens.json", tokensJson);

  console.log("[rarog] Tokens have been generated from rarog.config.js");
}

function cmdInit() {
  const jsPath = pathFromRoot("rarog.config.js");
  const tsPath = pathFromRoot("rarog.config.ts");

  if (fs.existsSync(jsPath) || fs.existsSync(tsPath)) {
    console.error("[rarog] rarog.config.js/ts уже существует, init отменён.");
    process.exit(1);
  }

  const jsContent = `/**
 * Rarog Config (JavaScript)
 * Базовый конфиг для темы, брейкпоинтов и расширений.
 *
 * Поля:
 *   - theme: цвета, spacing, radius, shadow;
 *   - screens: брейкпоинты;
 *   - extend: добавление/расширение токенов;
 *   - plugins: хуки для дополнительных возможностей (пока заглушка).
 */

/** @type {import('./rarog.config.types').RarogConfig | any} */
const config = ${JSON.stringify(defaultConfig, null, 2)};

module.exports = config;
`;

  const tsTypes = `export interface RarogThemeColorsScale {
  [shade: number]: string;
}

export interface RarogSemanticColors {
  bg: string;
  bgSoft: string;
  bgElevated: string;
  bgElevatedSoft: string;
  surface: string;
  borderSubtle: string;
  border: string;
  borderStrong: string;
  muted: string;
  text: string;
  textMuted: string;
  focusRing: string;
  accentSoft: string;
}

export interface RarogThemeColors {
  primary: RarogThemeColorsScale;
  secondary: RarogThemeColorsScale;
  success: RarogThemeColorsScale;
  danger: RarogThemeColorsScale;
  warning: RarogThemeColorsScale;
  info: RarogThemeColorsScale;
  semantic: RarogSemanticColors;
}

export interface RarogThemeConfig {
  colors: RarogThemeColors;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
}

export interface RarogConfig {
  theme: RarogThemeConfig;
  screens: Record<string, string>;
  extend?: {
    colors?: Partial<RarogThemeColors>;
    spacing?: Record<string, string>;
    radius?: Record<string, string>;
    shadow?: Record<string, string>;
  };
  plugins?: Array<(config: RarogConfig) => void>;
}
`;

  const tsContent = `import type { RarogConfig } from "./rarog.config.types";

const config: RarogConfig = ${JSON.stringify(defaultConfig, null, 2)} as RarogConfig;

export default config;
`;

  writeFile("rarog.config.js", jsContent);
  writeFile("rarog.config.types.ts", tsTypes);
  writeFile("rarog.config.ts", tsContent);

  // Пример проекта
  const exampleHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Rarog Starter</title>
  <link rel="stylesheet" href="../../packages/core/src/rarog-core.css">
  <link rel="stylesheet" href="../../packages/utilities/src/rarog-utilities.css">
  <link rel="stylesheet" href="../../packages/components/src/rarog-components.css">
  <script src="../../packages/js/dist/rarog.js"></script>
</head>
<body class="p-4">
  <h1 class="text-2xl mb-4">Rarog Starter</h1>
  <button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#welcomeModal">
    Открыть модалку
  </button>

  <div class="modal" id="welcomeModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="card-header">Добро пожаловать в Rarog</h2>
      </div>
      <div class="modal-body">
        <p>Эта страница создана командой <code>rarog init</code>.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-rg-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
</body>
</html>
`;

  writeFile("examples/starter/index.html", exampleHtml);

  console.log("[rarog] rarog.config.js/ts и пример проекта созданы.");
}

function cmdDocs() {
  const script = pathFromRoot("tools/docs-dev.mjs");
  if (!fs.existsSync(script)) {
    console.error("[rarog] tools/docs-dev.mjs не найден.");
    process.exit(1);
  }

  const child = spawn("node", [script], {
    stdio: "inherit",
    cwd: ROOT_DIR
  });

  child.on("exit", code => {
    process.exit(code || 0);
  });
}

/* -------------------------------------------------------------------------- */
/* Точка входа                                                                */
/* -------------------------------------------------------------------------- */

function printHelp() {
  console.log("Rarog CLI");
  console.log("");
  console.log("Использование:");
  console.log("  rarog build   Сгенерировать CSS-токены и rarog.tokens.json из rarog.config.js");
  console.log("  rarog init    Создать стартовый rarog.config.js/ts и пример проекта");
  console.log("  rarog docs    Запустить dev-документацию (tools/docs-dev.mjs)");
  console.log("");
}

function main() {
  const [, , cmd] = process.argv;

  switch (cmd) {
    case "build":
      cmdBuild();
      break;
    case "init":
      cmdInit();
      break;
    case "docs":
      cmdDocs();
      break;
    case "-h":
    case "--help":
    case undefined:
      printHelp();
      break;
    default:
      console.error(`[rarog] Неизвестная команда: ${cmd}`);
      printHelp();
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  defaultConfig,
  getEffectiveConfig,
  generateColorCss,
  generateSpacingCss,
  generateRadiusCss,
  generateShadowCss,
  generateBreakpointsCss,
  generateTokensJson
};

