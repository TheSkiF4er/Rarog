const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  PROJECT_ROOT,
  pathInProject,
  readJsonFile,
  writeProjectFile,
  fileExistsInProject
} = require("./fs");

const defaultConfig = {
  theme: {
    colors: {
      primary: {
        50: "#eff6ff",
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
        50: "#f8fafc",
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
        50: "#ecfdf3",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
        base: "{color.success.600}"
      },
      danger: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        base: "{color.danger.600}"
      },
      warning: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        base: "{color.warning.600}"
      },
      info: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e",
        base: "{color.info.600}"
      },
      semantic: {
        bg: "#f3f4f6",
        bgSoft: "#ffffff",
        bgElevated: "#ffffff",
        bgElevatedSoft: "#f9fafb",
        surface: "#ffffff",
        border: "#e5e7eb",
        borderSubtle: "#e5e7eb",
        borderStrong: "#111827",
        muted: "#9ca3af",
        text: "#0f172a",
        textMuted: "#6b7280",
        focusRing: "var(--rarog-color-primary-500)",
        accentSoft: "var(--rarog-color-primary-50)"
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
  variants: {
    group: ["hover"],
    peer: ["checked", "focus"],
    data: ["state"]
  },
  plugins: [],
  mode: "full",
  content: ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"]
};

const defaultInitConfig = {
  ...JSON.parse(JSON.stringify(defaultConfig)),
  mode: "jit",
  content: ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"]
};

const defaultProjectBuildManifest = {
  version: 1,
  tokens: {
    colors: "dist/tokens/_color.css",
    spacing: "dist/tokens/_spacing.css",
    radius: "dist/tokens/_radius.css",
    shadow: "dist/tokens/_shadow.css",
    breakpoints: "dist/tokens/_breakpoints.css"
  },
  outputs: {
    jitCss: "dist/rarog.jit.css"
  }
};

const defaultRepoBuildManifest = {
  version: "3.2.0",
  tokens: {
    colors: "packages/core/src/tokens/_color.css",
    spacing: "packages/core/src/tokens/_spacing.css",
    radius: "packages/core/src/tokens/_radius.css",
    shadow: "packages/core/src/tokens/_shadow.css",
    breakpoints: "packages/core/src/tokens/_breakpoints.css",
    grid: "packages/core/src/tokens/_grid.css"
  },
  build: {
    core: true,
    utilities: true,
    components: true,
    themes: ["default", "dark", "contrast"]
  },
  outputs: {
    jitCss: "dist/rarog.jit.css"
  }
};

const THEME_CONFIG_CANDIDATES = [
  { type: "js", rel: "rarog.config.js" },
  { type: "ts", rel: "rarog.config.ts" },
  { type: "json", rel: "rarog.config.json" }
];

const BUILD_MANIFEST_CANDIDATES = [
  { rel: "rarog.build.json" },
  { rel: "rarog.config.json" }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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

function transpileTypeScriptConfig(source) {
  return source
    .replace(/^\s*import\s+type\s+.+?;\s*$/gmu, "")
    .replace(/const\s+config\s*:\s*[^=]+=/, "const config =")
    .replace(/\s+as\s+[A-Za-z0-9_<>, .\[\]"']+/g, "")
    .replace(/export\s+default\s+config\s*;?/g, "module.exports = config;");
}

function loadTsConfig(tsPath) {
  const source = fs.readFileSync(tsPath, "utf8");
  const compiled = transpileTypeScriptConfig(source);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rarog-config-"));
  const tempFile = path.join(tmpDir, "rarog.config.cjs");
  fs.writeFileSync(tempFile, compiled, "utf8");
  delete require.cache[tempFile];
  const loaded = require(tempFile);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return loaded && loaded.default ? loaded.default : loaded;
}

function loadJsonConfig(jsonPath) {
  const config = readJsonFile(jsonPath);
  if (config && (config.tokens || config.build || config.outputs)) {
    return null;
  }
  return config;
}

function loadBuildManifestFile(manifestPath) {
  const parsed = readJsonFile(manifestPath);
  if (parsed && (parsed.tokens || parsed.build || parsed.outputs)) {
    return parsed;
  }
  return null;
}

function inspectConfigSurface() {
  const themeConfigs = [];
  const buildManifests = [];

  for (const candidate of THEME_CONFIG_CANDIDATES) {
    const file = pathInProject(candidate.rel);
    if (!fs.existsSync(file)) continue;
    if (candidate.type === "json") {
      const parsed = readJsonFile(file);
      if (parsed && (parsed.tokens || parsed.build || parsed.outputs)) continue;
    }
    themeConfigs.push({ ...candidate, file });
  }

  for (const candidate of BUILD_MANIFEST_CANDIDATES) {
    const file = pathInProject(candidate.rel);
    if (!fs.existsSync(file)) continue;
    const parsed = loadBuildManifestFile(file);
    if (!parsed) continue;
    buildManifests.push({ ...candidate, file });
  }

  return {
    themeConfigs,
    buildManifests,
    selectedThemeConfig: themeConfigs[0] || null,
    selectedBuildManifest: buildManifests[0] || null
  };
}

function getConfigSurfaceDiagnostics() {
  const surface = inspectConfigSurface();
  const warnings = [];

  if (surface.themeConfigs.length > 1) {
    warnings.push({
      code: "MULTIPLE_THEME_CONFIGS",
      message: `Найдено несколько theme-config файлов (${surface.themeConfigs.map((entry) => path.basename(entry.file)).join(", ")}). Канонический flow использует rarog.config.js.`
    });
  }

  if (surface.selectedThemeConfig && surface.selectedThemeConfig.type === "ts") {
    warnings.push({
      code: "TS_CONFIG_COMPAT",
      message: "rarog.config.ts поддерживается только как compatibility-path. Канонический flow использует rarog.config.js."
    });
  }

  if (surface.buildManifests.length > 1) {
    warnings.push({
      code: "MULTIPLE_BUILD_MANIFESTS",
      message: `Найдено несколько build-manifest файлов (${surface.buildManifests.map((entry) => path.basename(entry.file)).join(", ")}). Канонический flow использует rarog.build.json.`
    });
  }

  if (surface.selectedBuildManifest && path.basename(surface.selectedBuildManifest.file) === "rarog.config.json") {
    warnings.push({
      code: "LEGACY_BUILD_MANIFEST",
      message: "rarog.config.json как build-manifest считается legacy. Канонический путь — rarog.build.json."
    });
  }

  return {
    ...surface,
    warnings
  };
}

function loadUserConfig() {
  const selected = inspectConfigSurface().selectedThemeConfig;
  if (!selected) return null;

  if (selected.type === "ts") {
    return loadTsConfig(selected.file);
  }

  if (selected.type === "js") {
    delete require.cache[selected.file];
    const cfg = require(selected.file);
    return cfg && cfg.default ? cfg.default : cfg;
  }

  if (selected.type === "json") {
    return loadJsonConfig(selected.file);
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
      merged.theme.colors = Object.assign({}, merged.theme.colors, user.extend.colors);
    }
    if (user.extend.spacing) {
      merged.theme.spacing = Object.assign({}, merged.theme.spacing, user.extend.spacing);
    }
    if (user.extend.radius) {
      merged.theme.radius = Object.assign({}, merged.theme.radius, user.extend.radius);
    }
    if (user.extend.shadow) {
      merged.theme.shadow = Object.assign({}, merged.theme.shadow, user.extend.shadow);
    }
  }

  merged.variants = Object.assign({}, defaultConfig.variants || {}, user.variants || {});
  merged.mode = user.mode || defaultConfig.mode || "full";
  merged.content = user.content || defaultConfig.content || ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"];
  merged.plugins = user.plugins || defaultConfig.plugins || [];
  return merged;
}

function getDefaultInitConfig() {
  return clone(defaultInitConfig);
}

function getProjectBuildManifestTemplate() {
  return clone(defaultProjectBuildManifest);
}

function loadBuildManifest() {
  const selected = inspectConfigSurface().selectedBuildManifest;
  if (selected) {
    const parsed = loadBuildManifestFile(selected.file);
    if (parsed) {
      return deepMerge(defaultProjectBuildManifest, parsed);
    }
  }

  if (
    fileExistsInProject("packages/core/src/tokens") &&
    fileExistsInProject("packages/utilities/src") &&
    fileExistsInProject("packages/components/src")
  ) {
    return clone(defaultRepoBuildManifest);
  }

  return clone(defaultProjectBuildManifest);
}

function validateConfig(config) {
  const result = {
    errors: [],
    warnings: []
  };

  if (!config) {
    result.warnings.push({
      code: "CONFIG_MISSING",
      message: "Файл rarog.config.js не найден. Используется встроенный defaultConfig."
    });
    return result;
  }

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
        const match = value.match(/^(\d+)(px)?$/);
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

  if (config.plugins && !Array.isArray(config.plugins)) {
    result.errors.push({
      code: "PLUGINS_TYPE",
      message: "Поле plugins в rarog.config.* должно быть массивом (Array)."
    });
  }

  if (config.theme && config.theme.colors && typeof config.theme.colors !== "object") {
    result.errors.push({
      code: "THEME_COLORS_TYPE",
      message: "theme.colors должен быть объектом с цветовыми палитрами."
    });
  }

  return result;
}

function validateBuildManifest(manifest) {
  const result = {
    errors: [],
    warnings: []
  };

  if (!manifest) {
    result.warnings.push({
      code: "BUILD_MANIFEST_MISSING",
      message: "Файл rarog.build.json не найден. Используется встроенный build-manifest."
    });
    return result;
  }

  if (!manifest.tokens || typeof manifest.tokens !== "object") {
    result.errors.push({
      code: "BUILD_MANIFEST_TOKENS",
      message: "Поле tokens в rarog.build.json обязательно и должно быть объектом с путями вывода токенов."
    });
  } else {
    for (const [name, value] of Object.entries(manifest.tokens)) {
      if (typeof value !== "string" || !value.trim()) {
        result.errors.push({
          code: "BUILD_MANIFEST_TOKEN_PATH",
          message: `Поле tokens.${name} должно быть непустой строкой с путём вывода.`
        });
      }
    }
  }

  if (manifest.outputs != null && typeof manifest.outputs !== "object") {
    result.errors.push({
      code: "BUILD_MANIFEST_OUTPUTS",
      message: "Поле outputs в rarog.build.json должно быть объектом."
    });
  }

  if (manifest.outputs && manifest.outputs.jitCss != null && typeof manifest.outputs.jitCss !== "string") {
    result.errors.push({
      code: "BUILD_MANIFEST_JIT_OUTPUT",
      message: "Поле outputs.jitCss должно быть строкой с путём к выходному CSS-файлу."
    });
  }

  return result;
}

module.exports = {
  PROJECT_ROOT,
  defaultConfig,
  deepMerge,
  loadUserConfig,
  getEffectiveConfig,
  loadBuildManifest,
  getDefaultInitConfig,
  getProjectBuildManifestTemplate,
  inspectConfigSurface,
  getConfigSurfaceDiagnostics,
  validateConfig,
  validateBuildManifest,
  writeProjectFile
};
