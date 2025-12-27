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
  "theme": {
    "colors": {
      "primary": {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "200": "#bfdbfe",
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
        "600": "#2563eb",
        "700": "#1d4ed8",
        "800": "#1e40af",
        "900": "#1e3a8a"
      },
      "secondary": {
        "50": "#f8fafc",
        "100": "#f1f5f9",
        "200": "#e2e8f0",
        "300": "#cbd5e1",
        "400": "#94a3b8",
        "500": "#64748b",
        "600": "#475569",
        "700": "#334155",
        "800": "#1e293b",
        "900": "#0f172a"
      },
      "success": {
        "50": "#ecfdf3",
        "100": "#dcfce7",
        "200": "#bbf7d0",
        "300": "#86efac",
        "400": "#4ade80",
        "500": "#22c55e",
        "600": "#16a34a",
        "700": "#15803d",
        "800": "#166534",
        "900": "#14532d",
        "base": "{color.success.600}"
      },
      "danger": {
        "50": "#fef2f2",
        "100": "#fee2e2",
        "200": "#fecaca",
        "300": "#fca5a5",
        "400": "#f87171",
        "500": "#ef4444",
        "600": "#dc2626",
        "700": "#b91c1c",
        "800": "#991b1b",
        "900": "#7f1d1d",
        "base": "{color.danger.600}"
      },
      "warning": {
        "50": "#fff7ed",
        "100": "#ffedd5",
        "200": "#fed7aa",
        "300": "#fdba74",
        "400": "#fb923c",
        "500": "#f97316",
        "600": "#ea580c",
        "700": "#c2410c",
        "800": "#9a3412",
        "900": "#7c2d12",
        "base": "{color.warning.600}"
      },
      "info": {
        "50": "#f0f9ff",
        "100": "#e0f2fe",
        "200": "#bae6fd",
        "300": "#7dd3fc",
        "400": "#38bdf8",
        "500": "#0ea5e9",
        "600": "#0284c7",
        "700": "#0369a1",
        "800": "#075985",
        "900": "#0c4a6e",
        "base": "{color.info.600}"
      },
      "semantic": {
        "bg": "#f3f4f6",
        "bgSoft": "#ffffff",
        "bgElevated": "#ffffff",
        "bgElevatedSoft": "#f9fafb",
        "surface": "#ffffff",
        "border": "#e5e7eb",
        "borderSubtle": "#e5e7eb",
        "borderStrong": "#111827",
        "muted": "#9ca3af",
        "text": "#0f172a",
        "textMuted": "#6b7280",
        "focusRing": "var(--rarog-color-primary-500)",
        "accentSoft": "var(--rarog-color-primary-50)"
      }
    },
    "spacing": {
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem"
    },
    "radius": {
      "xs": "0.125rem",
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "0.75rem",
      "xl": "1rem",
      "full": "9999px"
    },
    "shadow": {
      "xs": "0 1px 2px rgba(15, 23, 42, 0.08)",
      "sm": "0 2px 4px rgba(15, 23, 42, 0.12)",
      "md": "0 4px 6px rgba(15, 23, 42, 0.16)",
      "lg": "0 10px 15px rgba(15, 23, 42, 0.25)"
    }
  },
  "screens": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },
  "extend": {
    "colors": {},
    "spacing": {},
    "radius": {},
    "shadow": {}
  },
  "variants": {
    "group": ["hover"],
    "peer": ["checked", "focus"],
    "data": ["state"]
  },
  "plugins": [],
  "mode": "full",
  "content": [
    "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"
  ]
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

  // Variants (group/peer/data)
  merged.variants = Object.assign(
    {},
    defaultConfig.variants || {},
    user.variants || {}
  );

  // Режим сборки и источники контента
  merged.mode = user.mode || defaultConfig.mode || "full";
  merged.content = user.content || defaultConfig.content || [
    "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"
  ];

  merged.plugins = user.plugins || defaultConfig.plugins || [];
  return merged;
}

function validateConfig(config) {
  const result = {
    errors: [],
    warnings: []
  };

  if (!config) {
    result.warnings.push({
      code: "CONFIG_MISSING",
      message: "Файл rarog.config.* не найден. Используется встроенный defaultConfig."
    });
    return result;
  }

  // Проверка screens (брейкпоинты)
  if (config.screens && typeof config.screens === "object") {
    const entries = Object.entries(config.screens);
    const numeric = entries
      .map(([name, value]) => {
        if (typeof value !== "string") {
          result.errors.push({
            code: "SCREEN_VALUE_TYPE",
            message: `Значение screens.${name} должно быть строкой (например, \"640px\"), получено: ${typeof value}`
          });
          return null;
        }
        const match = value.match(/^(\\d+)(px)?$/);
        if (!match) {
          result.warnings.push({
            code: "SCREEN_VALUE_FORMAT",
            message: `Значение screens.${name} имеет нестандартный формат: \"${value}\". Рекомендуется использовать значения в px (например, 640px).`
          });
          return null;
        }
        return { name, px: Number(match[1]) };
      })
      .filter(Boolean)
      .sort((a, b) => a.px - b.px);

    for (let i = 1; i < numeric.length; i++) {
      if (numeric[i].px === numeric[i - 1].px) {
        result.warnings.push({
          code: "SCREEN_DUPLICATE",
          message: `Брейкпоинты screens.${numeric[i - 1].name} и screens.${numeric[i].name} имеют одинаковую ширину ${numeric[i].px}px.`
        });
      }
      if (numeric[i].px < numeric[i - 1].px) {
        result.errors.push({
          code: "SCREEN_ORDER",
          message: `Брейкпоинты screens не отсортированы по возрастанию: ${numeric[i].name} (${numeric[i].px}px) меньше, чем ${numeric[i - 1].name} (${numeric[i - 1].px}px).`
        });
      }
    }
  }

  // Проверка plugins
  if (config.plugins && !Array.isArray(config.plugins)) {
    result.errors.push({
      code: "PLUGINS_TYPE",
      message: "Поле plugins в rarog.config.* должно быть массивом (Array)."
    });
  }

  // Базовая проверка theme.colors
  if (config.theme && config.theme.colors && typeof config.theme.colors !== "object") {
    result.errors.push({
      code: "THEME_COLORS_TYPE",
      message: "theme.colors должен быть объектом с цветовыми палитрами."
    });
  }

  return result;
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
/* JIT / Tree-shaking                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Экранирование имени класса для поиска в CSS (как он записан в селекторе).
 * Преобразует 'sm:d-flex' -> 'sm\:d-flex', 'w-[320px]' -> 'w-\[320px\]' и т.д.
 */
function escapeClassForCssSearch(cls) {
  return cls
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\./g, "\\.")
    .replace(/\//g, "\\/")
    .replace(/#/g, "\\#");
}

/**
 * Экранирование имени класса для использования в селекторе.
 * Используется при генерации произвольных значений (w-[320px] и т.п.).
 */
function escapeClassForSelector(cls) {
  return cls.replace(/([!\"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
}

/**
 * Рекурсивный обход директории с фильтрацией по расширениям.
 */
function walkDir(dir, exts, acc) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, exts, acc);
    } else if (entry.isFile()) {
      if (exts && exts.size > 0) {
        const ext = path.extname(entry.name).slice(1);
        if (!exts.has(ext)) continue;
      }
      acc.add(full);
    }
  }
}

/**
 * Простейшая поддержка паттернов вида:
 *   ./resources/**/*.{html,php,js,jsx,ts,tsx,vue}
 *
 * Мы разбираем:
 *   - базовую директорию до '**'
 *   - список расширений из {..}
 */
function scanContentFiles(patterns) {
  const files = new Set();

  (patterns || []).forEach(pattern => {
    if (!pattern) return;

    let p = pattern;
    if (!path.isAbsolute(p)) {
      p = pathFromRoot(p);
    }

    const braceMatch = p.match(/\{([^}]+)\}/);
    let exts = null;
    if (braceMatch) {
      exts = new Set(
        braceMatch[1]
          .split(",")
          .map(x => x.trim())
          .filter(Boolean)
          .map(x => x.replace(/^\./, ""))
      );
    }

    let base = p;
    const starIdx = base.indexOf("**");
    if (starIdx !== -1) {
      base = base.slice(0, starIdx);
    }
    if (!base) {
      base = ROOT_DIR;
    }

    if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) {
      return;
    }

    walkDir(base, exts, files);
  });

  return Array.from(files);
}

/**
 * Выделение CSS-классов из содержимого файлов (class / className).
 * Лёгкий фильтр по префиксам Rarog.
 */
function extractClassesFromContent(files) {
  const classSet = new Set();
  const classAttrRe = /(class|className)\s*=\s*["'`]([^"'`]+)["'`]/g;
  const classListRe = /\.classList\.add\(([^)]+)\)/g;
  const fnCallRe = /\b(?:clsx|cx|classnames)\(([^)]+)\)/g;

  const isRarogClass = name => {
    if (!name) return false;
    if (name.startsWith("rg-")) return true;
    if (name.startsWith("btn")) return true;
    if (name.startsWith("bg-")) return true;
    if (name.startsWith("text-")) return true;
    if (name.startsWith("w-") || name.startsWith("h-") ||
        name.startsWith("min-w-") || name.startsWith("max-w-") ||
        name.startsWith("min-h-") || name.startsWith("max-h-")) return true;

    // позиционирование и z-слой
    if (name === "relative" || name === "absolute" || name === "fixed" || name === "sticky") return true;
    if (name.startsWith("top-") || name.startsWith("right-") ||
        name.startsWith("bottom-") || name.startsWith("left-")) return true;
    if (name.startsWith("z-")) return true;

    // sizing / aspect
    if (name.startsWith("aspect-")) return true;

    // эффекты и границы
    if (name.startsWith("rounded") || name.startsWith("shadow-") ||
        name === "border" || name.startsWith("border-")) return true;

    // transitions / animations
    if (name === "transition" || name.startsWith("transition-") ||
        name.startsWith("duration-") || name.startsWith("ease-") ||
        name.startsWith("animate-")) return true;

    // advanced typography
    if (name.startsWith("font-") || name.startsWith("leading-")) return true;

    // spacing / layout
    const utilPrefixes = [
      "mt-", "mb-", "ml-", "mr-", "mx-", "my-",
      "pt-", "pb-", "pl-", "pr-", "px-", "py-",
      "d-", "flex-", "items-", "justify-", "gap-",
      "alert", "badge", "list-group", "breadcrumb",
      "nav", "pagination", "progress", "modal",
      "dropdown", "collapse", "card", "rg-container", "rg-row", "rg-col"
    ];
    if (utilPrefixes.some(p => name === p || name.startsWith(p))) return true;

    // responsive / state / variant вариации: sm:d-flex, hover:bg-primary, group-hover:bg-primary и т.п.
    if (name.includes(":")) {
      const base = name.split(":").pop();
      return isRarogClass(base);
    }

    // произвольные значения
    if (name.includes("[") && name.includes("]")) return true;

    return false;
  };

  const collectFromRaw = raw => {
    raw
      .split(/\s+/)
      .map(x => x.trim())
      .filter(Boolean)
      .forEach(cls => {
        if (isRarogClass(cls)) {
          classSet.add(cls);
        }
      });
  };

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    let m;

    // 1) class / className в разметке (HTML/JSX/TSX)
    while ((m = classAttrRe.exec(content)) !== null) {
      const raw = m[2];
      collectFromRaw(raw);
    }

    // 2) classList.add('foo', "bar baz")
    while ((m = classListRe.exec(content)) !== null) {
      const args = m[1];
      const strRe = /["'`]([^"'`]+)["'`]/g;
      let sm;
      while ((sm = strRe.exec(args)) !== null) {
        collectFromRaw(sm[1]);
      }
    }

    // 3) clsx()/cx()/classnames() — берём только строковые литералы
    while ((m = fnCallRe.exec(content)) !== null) {
      const args = m[1];
      const strRe = /["'`]([^"'`]+)["'`]/g;
      let sm;
      while ((sm = strRe.exec(args)) !== null) {
        collectFromRaw(sm[1]);
      }
    }
  }

  return Array.from(classSet);
}


/**
 * Генерация CSS для произвольных значений:
 *   w-[320px], h-[50vh], bg-[#0f172a], text-[rgba(...)]
 */
function generateArbitraryCss(usedClasses) {
  const lines = [];

  const sanitize = (value) => {
    if (!value) return null;
    // Примитивная защита от инъекций: не допускаем ';' и '}'
    if (/[;}]/.test(value)) return null;
    return value;
  };

  usedClasses
    .filter(cls => cls.includes("[") && cls.includes("]"))
    .forEach(cls => {
      const mWidth = cls.match(/^w-\[(.+)\]$/);
      const mHeight = cls.match(/^h-\[(.+)\]$/);
      const mBg = cls.match(/^bg-\[(.+)\]$/);
      const mText = cls.match(/^text-\[(.+)\]$/);

      const mRadius = cls.match(/^rounded-\[(.+)\]$/);
      const mShadow = cls.match(/^shadow-\[(.+)\]$/);
      const mGap = cls.match(/^gap-\[(.+)\]$/);
      const mBorderWidth = cls.match(/^border-\[(.+)\]$/);

      const selector = "." + escapeClassForSelector(cls);

      const pushDecl = (prop, raw) => {
        const v = sanitize(raw);
        if (!v) return;
        lines.push(`${selector} { ${prop}: ${v}; }`);
      };

      if (mWidth) {
        pushDecl("width", mWidth[1]);
      } else if (mHeight) {
        pushDecl("height", mHeight[1]);
      } else if (mBg) {
        pushDecl("background-color", mBg[1]);
      } else if (mText) {
        pushDecl("color", mText[1]);
      } else if (mRadius) {
        pushDecl("border-radius", mRadius[1]);
      } else if (mShadow) {
        pushDecl("box-shadow", mShadow[1]);
      } else if (mGap) {
        pushDecl("gap", mGap[1]);
      } else if (mBorderWidth) {
        pushDecl("border-width", mBorderWidth[1]);
      }
    });

  if (lines.length === 0) return "";
  return "/* Rarog JIT arbitrary values */\n" + lines.join("\n") + "\n";
}


/**
 * Грубый, но практичный фильтр CSS по используемым классам.
 *
 * - Всегда сохраняем комментарии, :root, @keyframes.
 * - Для @media-блоков: если внутри встретился хотя бы один используемый класс,
 *   сохраняем блок целиком.
 * - Для одиночных правил: сохраняем блок, если в нём есть хотя бы один класс
 *   из списка usedClasses.
 */
function filterCssByUsedClasses(css, usedClasses) {
  if (!usedClasses || usedClasses.length === 0) {
    return "";
  }

  const usedEscaped = usedClasses.map(escapeClassForCssSearch);
  const hasClass = block =>
    usedEscaped.some(cls => block.includes("." + cls));

  let i = 0;
  const len = css.length;
  let result = "";

  while (i < len) {
    // @media блок
    if (css.startsWith("@media", i)) {
      const blockStart = i;
      const braceStart = css.indexOf("{", i);
      if (braceStart === -1) {
        break;
      }
      let depth = 0;
      let j = braceStart;
      for (; j < len; j += 1) {
        const ch = css[j];
        if (ch === "{") depth += 1;
        else if (ch === "}") {
          depth -= 1;
          if (depth === 0) {
            j += 1;
            break;
          }
        }
      }
      const block = css.slice(blockStart, j);
      if (hasClass(block)) {
        result += block;
      }
      i = j;
      continue;
    }

    // Прочие блоки: ищем до следующей '}'
    const nextClose = css.indexOf("}", i);
    if (nextClose === -1) {
      // остаток (комментарии и т.п.)
      result += css.slice(i);
      break;
    }

    const block = css.slice(i, nextClose + 1);
    const trimmed = block.trim();

    let keep = false;
    if (
      trimmed.startsWith("/*") ||
      trimmed.startsWith(":root") ||
      trimmed.startsWith("@keyframes") ||
      trimmed.startsWith("@font-face")
    ) {
      keep = true;
    } else if (hasClass(block)) {
      keep = true;
    }

    if (keep) {
      result += block;
    }

    i = nextClose + 1;
  }

  return result;
}
/* -------------------------------------------------------------------------- */
/* Команды CLI                                                                */
/* -------------------------------------------------------------------------- */


function runPlugins(effectiveConfig) {
  const plugins = effectiveConfig.plugins || [];
  let utilitiesCssExtra = "";
  let componentsCssExtra = "";

  if (!Array.isArray(plugins) || plugins.length === 0) {
    return { utilitiesCssExtra, componentsCssExtra };
  }

  const ctx = {
    config: effectiveConfig
  };

  for (const plugin of plugins) {
    let fn = plugin;

    // Строка → путь до модуля
    if (typeof plugin === "string") {
      const resolved = path.isAbsolute(plugin)
        ? plugin
        : pathFromRoot(plugin);

      try {
        const mod = require(resolved);
        fn = mod.default || mod.plugin || mod;
      } catch (err) {
        console.warn("[rarog] Не удалось загрузить плагин:", plugin, "-", err.message);
        continue;
      }
    }

    if (typeof fn !== "function") continue;

    try {
      const result = fn(ctx) || {};
      if (result.utilitiesCss) {
        utilitiesCssExtra += "\n" + String(result.utilitiesCss) + "\n";
      }
      if (result.componentsCss) {
        componentsCssExtra += "\n" + String(result.componentsCss) + "\n";
      }
    } catch (err) {
      console.warn("[rarog] Ошибка в плагине:", err.message);
    }
  }

  return { utilitiesCssExtra, componentsCssExtra };
}


function cmdBuild() {
  const cfgJson = readJSON("rarog.config.json");
  const effective = getEffectiveConfig();

  // 1. Всегда пересобираем токены из конфига (full-режим для design-токенов).
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

  // 2. JIT / Tree-shaking (при необходимости).
  const mode = effective.mode || "full";
  if (mode !== "jit") {
    return;
  }

  const contentPatterns = effective.content && effective.content.length
    ? effective.content
    : ["./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"];

  console.log("[rarog] JIT mode enabled. Scanning content:", contentPatterns);

  const files = scanContentFiles(contentPatterns);
  if (!files.length) {
    console.warn("[rarog] JIT: нет файлов контента по заданным паттернам. CSS не был урезан.");
    return;
  }

  const usedClasses = extractClassesFromContent(files);
  console.log(`[rarog] JIT: найдено ${usedClasses.length} уникальных классов.`);

  const utilitiesCssFull = fs.readFileSync(pathFromRoot("packages/utilities/src/rarog-utilities.css"), "utf8");
  const componentsCssFull = fs.readFileSync(pathFromRoot("packages/components/src/rarog-components.css"), "utf8");

  const utilitiesJit = filterCssByUsedClasses(utilitiesCssFull, usedClasses);
  const componentsJit = filterCssByUsedClasses(componentsCssFull, usedClasses);
  const arbitraryCss = generateArbitraryCss(usedClasses);

  const { utilitiesCssExtra, componentsCssExtra } = runPlugins(effective);

  let jitCss = "";
  jitCss += "/* Rarog CSS Framework - JIT build */\n";
  jitCss += "/* Сгенерировано rarog build (mode=jit) на основе контента проекта. */\n\n";

  // Подключаем токены (цвета/spacing/radius/shadow/breakpoints)
  jitCss += colorCss + "\n";
  jitCss += spacingCss + "\n";
  jitCss += radiusCss + "\n";
  jitCss += shadowCss + "\n";
  jitCss += breakpointsCss + "\n";

  // Включаем урезанные utilities/components + произвольные значения.
  jitCss += "\n/* Rarog Utilities (JIT) */\n";
  jitCss += utilitiesJit + "\n";
  if (utilitiesCssExtra) {
    jitCss += "/* Rarog plugin utilities */\n" + utilitiesCssExtra + "\n";
  }
  jitCss += "\n/* Rarog Components (JIT) */\n";
  jitCss += componentsJit + "\n";
  if (componentsCssExtra) {
    jitCss += "/* Rarog plugin components */\n" + componentsCssExtra + "\n";
  }
  jitCss += arbitraryCss;

  writeFile("dist/rarog.jit.css", jitCss);
  console.log("[rarog] JIT CSS written to dist/rarog.jit.css");
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
/* Валидация конфига                                                            */
/* -------------------------------------------------------------------------- */

function cmdValidate() {
  const userConfig = loadUserConfig();
  const result = validateConfig(userConfig);

  const hasErrors = result.errors.length > 0;
  const hasWarnings = result.warnings.length > 0;

  if (!hasErrors && !hasWarnings) {
    console.log("\x1b[32m[rarog] Конфиг rarog.config.* выглядит корректным.\x1b[0m");
    return;
  }

  if (hasWarnings) {
    console.log("\x1b[33m[rarog] Предупреждения конфига:\x1b[0m");
    result.warnings.forEach(w => {
      console.log("  [warn]", w.code + ":", w.message);
    });
    console.log("");
  }

  if (hasErrors) {
    console.log("\x1b[31m[rarog] Ошибки конфига:\x1b[0m");
    result.errors.forEach(e => {
      console.log("  [error]", e.code + ":", e.message);
    });
    console.log("\nПодробнее о конфиге: https://rarog.css.cajeer.ru/guide/config");
    process.exitCode = 1;
  }
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
  console.log("  rarog validate Проверить rarog.config.* и вывести предупреждения/ошибки");
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
  validateConfig,
  generateColorCss,
  generateSpacingCss,
  generateRadiusCss,
  generateShadowCss,
  generateBreakpointsCss,
  generateTokensJson
};

