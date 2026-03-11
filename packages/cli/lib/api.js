const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const {
  PACKAGE_ROOT,
  PROJECT_ROOT,
  pathInProject,
  pathInPackage,
  readPackageJson,
  writeProjectFile
} = require("./fs");
const {
  loadUserConfig,
  getEffectiveConfig,
  loadBuildManifest,
  getDefaultInitConfig,
  getProjectBuildManifestTemplate,
  getConfigSurfaceDiagnostics,
  validateConfig,
  validateBuildManifest
} = require("./config");
const jit = require("./jit");

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
 *   ./resources/(recursive)/*.{html,php,js,jsx,ts,tsx,vue}
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
      p = pathInProject(p);
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
      base = PROJECT_ROOT;
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
        : pathInProject(plugin);

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


function resolveCssSources() {
  const coreCssCandidates = [
    "packages/core/dist/rarog-core.css",
    "packages/core/dist/rarog-core.min.css"
  ];
  const utilitiesCssCandidates = [
    "packages/utilities/dist/rarog-utilities.css",
    "packages/utilities/dist/rarog-utilities.min.css",
    "packages/utilities/src/rarog-utilities.css"
  ];
  const componentsCssCandidates = [
    "packages/components/dist/rarog-components.css",
    "packages/components/dist/rarog-components.min.css",
    "packages/components/src/rarog-components.css"
  ];

  const coreCssSource = coreCssCandidates
    .map((rel) => pathInPackage(rel))
    .find((candidate) => fs.existsSync(candidate));
  const utilitiesCssSource = utilitiesCssCandidates
    .map((rel) => pathInPackage(rel))
    .find((candidate) => fs.existsSync(candidate));
  const componentsCssSource = componentsCssCandidates
    .map((rel) => pathInPackage(rel))
    .find((candidate) => fs.existsSync(candidate));

  if (!coreCssSource || !utilitiesCssSource || !componentsCssSource) {
    throw new Error("[rarog] Не найдены CSS-артефакты core/utilities/components. Выполните полную сборку пакета перед publish.");
  }

  return {
    coreCssSource,
    utilitiesCssSource,
    componentsCssSource,
    coreCssFull: fs.readFileSync(coreCssSource, "utf8"),
    utilitiesCssFull: fs.readFileSync(utilitiesCssSource, "utf8"),
    componentsCssFull: fs.readFileSync(componentsCssSource, "utf8")
  };
}

function cmdBuild(options = {}) {
  const debug = Boolean(options.debug);
  const surface = getConfigSurfaceDiagnostics();
  const buildManifest = loadBuildManifest();
  const effective = getEffectiveConfig();

  const themeConfigLabel = surface.selectedThemeConfig
    ? path.basename(surface.selectedThemeConfig.file)
    : "built-in defaults";
  const buildManifestLabel = surface.selectedBuildManifest
    ? path.basename(surface.selectedBuildManifest.file)
    : "built-in defaults";

  console.log(`[rarog] Theme config: ${themeConfigLabel}`);
  console.log(`[rarog] Build manifest: ${buildManifestLabel}`);

  const colorCss = generateColorCss(effective.theme);
  const spacingCss = generateSpacingCss(effective.theme);
  const radiusCss = generateRadiusCss(effective.theme);
  const shadowCss = generateShadowCss(effective.theme);
  const breakpointsCss = generateBreakpointsCss(effective.screens);

  writeProjectFile(buildManifest.tokens.colors, colorCss);
  writeProjectFile(buildManifest.tokens.spacing, spacingCss);
  writeProjectFile(buildManifest.tokens.radius, radiusCss);
  writeProjectFile(buildManifest.tokens.shadow, shadowCss);
  writeProjectFile(buildManifest.tokens.breakpoints, breakpointsCss);

  const pkg = readPackageJson("package.json");
  const tokensJson = generateTokensJson(effective.theme, effective.screens, pkg.version);
  writeProjectFile("rarog.tokens.json", tokensJson);

  console.log(`[rarog] Tokens generated from ${themeConfigLabel}.`);

  const mode = effective.mode || "full";
  if (mode !== "jit") {
    console.log('[rarog] mode !== "jit": generated token artifacts only.');
    return;
  }

  const contentPatterns = effective.content && effective.content.length
    ? effective.content
    : ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"];

  console.log("[rarog] JIT mode enabled. Scanning content:", contentPatterns);

  const { coreCssFull, utilitiesCssFull, componentsCssFull } = resolveCssSources();
  const files = jit.scanContentFiles(PROJECT_ROOT, contentPatterns);
  const analysis = jit.analyzeClasses({ files, coreCssFull, utilitiesCssFull, componentsCssFull });

  let utilitiesJit = utilitiesCssFull;
  let componentsJit = componentsCssFull;
  let arbitraryCss = "";
  let arbitraryIssues = [];

  if (!files.length) {
    console.warn("[rarog] JIT: файлы контента не найдены. Будет записан fallback bundle без tree-shaking.");
  } else if (!analysis.usedClasses.length) {
    console.warn("[rarog] JIT: классы не найдены. Будет записан fallback bundle без tree-shaking.");
  } else {
    utilitiesJit = jit.filterCssByUsedClasses(utilitiesCssFull, analysis.usedClasses);
    componentsJit = jit.filterCssByUsedClasses(componentsCssFull, analysis.usedClasses);
    const arbitrary = jit.generateArbitraryCss(analysis.usedClasses);
    arbitraryCss = arbitrary.css;
    arbitraryIssues = arbitrary.issues;
  }

  if (analysis.unknownClasses.length) {
    console.warn(`[rarog] JIT: найдено ${analysis.unknownClasses.length} подозрительных/неподдерживаемых utility-классов.`);
    analysis.unknownClasses.slice(0, 20).forEach((className) => {
      console.warn(`  [unknown] ${className}`);
    });
    if (analysis.unknownClasses.length > 20) {
      console.warn(`  ... и ещё ${analysis.unknownClasses.length - 20}`);
    }
  }

  if (arbitraryIssues.length) {
    arbitraryIssues.slice(0, 20).forEach((issue) => {
      console.warn(`  [arbitrary] ${issue.className}: ${issue.reason}`);
    });
  }

  const { utilitiesCssExtra, componentsCssExtra } = runPlugins(effective);

  let jitCss = "";
  jitCss += "/* Rarog CSS Framework - JIT build */\n";
  jitCss += `/* Generated by rarog build using ${themeConfigLabel} + ${buildManifestLabel}. */\n\n`;
  jitCss += colorCss + "\n";
  jitCss += spacingCss + "\n";
  jitCss += radiusCss + "\n";
  jitCss += shadowCss + "\n";
  jitCss += breakpointsCss + "\n";
  jitCss += "\n/* Rarog Core */\n";
  jitCss += coreCssFull + "\n";
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
  jitCss = jit.dedupeCssBlocks(jitCss);

  const jitOutput = (buildManifest.outputs && buildManifest.outputs.jitCss) || "dist/rarog.jit.css";
  writeProjectFile(jitOutput, jitCss);
  console.log(`[rarog] JIT CSS written to ${jitOutput}`);

  if (debug) {
    const debugPath = path.join(path.dirname(jitOutput), "rarog.jit.debug.json");
    writeProjectFile(debugPath, JSON.stringify({
      contentPatterns,
      scannedFiles: files,
      usedClasses: analysis.usedClasses,
      unknownClasses: analysis.unknownClasses,
      arbitraryIssues,
      counts: {
        files: files.length,
        usedClasses: analysis.usedClasses.length,
        unknownClasses: analysis.unknownClasses.length
      }
    }, null, 2) + "\n");
    console.log(`[rarog] Debug report written to ${debugPath}`);
  }
}

function cmdAnalyze() {
  const effective = getEffectiveConfig();
  const contentPatterns = effective.content && effective.content.length
    ? effective.content
    : ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"];
  const { coreCssFull, utilitiesCssFull, componentsCssFull } = resolveCssSources();
  const files = jit.scanContentFiles(PROJECT_ROOT, contentPatterns);
  const analysis = jit.analyzeClasses({ files, coreCssFull, utilitiesCssFull, componentsCssFull });

  console.log(`[rarog] analyze: scanned files = ${files.length}`);
  console.log(`[rarog] analyze: used classes = ${analysis.usedClasses.length}`);
  console.log(`[rarog] analyze: unknown utility-like classes = ${analysis.unknownClasses.length}`);
  if (analysis.unknownClasses.length) {
    analysis.unknownClasses.forEach((className) => console.log(`  - ${className}`));
  }
}

function cmdDoctor() {
  const surface = getConfigSurfaceDiagnostics();
  const effective = getEffectiveConfig();
  const contentPatterns = effective.content && effective.content.length
    ? effective.content
    : ["./src/**/*.{html,php,js,jsx,ts,tsx,vue}", "./resources/**/*.{html,php,js,jsx,ts,tsx,vue}"];
  const warnings = [];

  if (!surface.selectedThemeConfig) warnings.push("theme config не найден; используются built-in defaults");
  if (!surface.selectedBuildManifest) warnings.push("build manifest не найден; используются built-in defaults");

  const files = jit.scanContentFiles(PROJECT_ROOT, contentPatterns);
  if (!files.length) warnings.push("content scanning не нашёл ни одного файла");

  try {
    resolveCssSources();
  } catch (error) {
    warnings.push(error.message);
  }

  if (!warnings.length) {
    console.log("[rarog] doctor: всё выглядит здоровым для JIT/build flow.");
    return;
  }

  console.log("[rarog] doctor: найдены потенциальные проблемы:");
  warnings.forEach((warning) => console.log(`  [warn] ${warning}`));
}

function cmdInit() {
  const blockingFiles = [
    "rarog.config.js",
    "rarog.config.ts",
    "rarog.config.json",
    "rarog.build.json",
    "rarog.config.types.ts",
    "src/index.html"
  ].filter((rel) => fs.existsSync(pathInProject(rel)));

  if (blockingFiles.length > 0) {
    console.error(`[rarog] init отменён. Уже существуют: ${blockingFiles.join(", ")}`);
    process.exit(1);
  }

  const initConfig = getDefaultInitConfig();
  const jsContent = `/**
 * Rarog Config (canonical JavaScript flow)
 * - theme: design tokens
 * - screens: breakpoints
 * - extend: token extensions
 * - plugins: runtime hooks
 */
const config = ${JSON.stringify(initConfig, null, 2)};

module.exports = config;
`;

  writeProjectFile("rarog.config.js", jsContent);
  writeProjectFile("rarog.build.json", JSON.stringify(getProjectBuildManifestTemplate(), null, 2) + "\n");

  const starterHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rarog Starter</title>
  <link rel="stylesheet" href="../dist/rarog.jit.css">
</head>
<body>
  <div class="rg-container-lg py-6">
    <div class="card shadow-md">
      <div class="card-header flex items-center justify-between">
        <h1 class="h5 mb-0">Rarog starter</h1>
        <span class="badge badge-primary">jit</span>
      </div>
      <div class="card-body">
        <p class="text-muted mb-4">Этот файл создаётся командой <code>rarog init</code>.</p>
        <button class="btn btn-primary">Build works</button>
      </div>
    </div>
  </div>
</body>
</html>
`;

  writeProjectFile("src/index.html", starterHtml);

  console.log("[rarog] Созданы rarog.config.js, rarog.build.json и src/index.html.");
}

function cmdDocs() {
  const script = pathInPackage("tools/docs-dev.mjs");
  if (!fs.existsSync(script)) {
    console.error("[rarog] tools/docs-dev.mjs не найден.");
    process.exit(1);
  }

  const child = spawn("node", [script], {
    stdio: "inherit",
    cwd: PACKAGE_ROOT
  });

  child.on("exit", code => {
    process.exit(code || 0);
  });
}

/* -------------------------------------------------------------------------- */
/* Валидация конфига                                                            */
/* -------------------------------------------------------------------------- */

function cmdValidate() {
  const surface = getConfigSurfaceDiagnostics();
  const userConfig = loadUserConfig();
  const buildManifest = loadBuildManifest();
  const configResult = validateConfig(userConfig);
  const manifestResult = validateBuildManifest(buildManifest);

  const warnings = [...surface.warnings, ...configResult.warnings, ...manifestResult.warnings];
  const errors = [...configResult.errors, ...manifestResult.errors];

  const themeConfigLabel = surface.selectedThemeConfig
    ? path.basename(surface.selectedThemeConfig.file)
    : "built-in defaults";
  const buildManifestLabel = surface.selectedBuildManifest
    ? path.basename(surface.selectedBuildManifest.file)
    : "built-in defaults";

  console.log(`[rarog] Theme config: ${themeConfigLabel}`);
  console.log(`[rarog] Build manifest: ${buildManifestLabel}`);

  if (!warnings.length && !errors.length) {
    console.log("\x1b[32m[rarog] Config + build manifest выглядят корректно.\x1b[0m");
    return;
  }

  if (warnings.length) {
    console.log("\x1b[33m[rarog] Предупреждения:\x1b[0m");
    warnings.forEach((warning) => {
      console.log("  [warn]", warning.code + ":", warning.message);
    });
    console.log("");
  }

  if (errors.length) {
    console.log("\x1b[31m[rarog] Ошибки:\x1b[0m");
    errors.forEach((error) => {
      console.log("  [error]", error.code + ":", error.message);
    });
    console.log("\nПодробнее о canonical config/build flow: https://cajeer.ru/rarog");
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
  console.log("  rarog build [--debug]    Сгенерировать токены и optional JIT CSS из rarog.config.js + rarog.build.json");
  console.log("  rarog init              Создать rarog.config.js + rarog.build.json + src/index.html");
  console.log("  rarog docs              Запустить dev-документацию из пакета Rarog");
  console.log("  rarog analyze           Показать summary по content scanning и неизвестным utility-классам");
  console.log("  rarog doctor            Проверить JIT/build surface и типовые проблемы");
  console.log("  rarog validate          Проверить theme-config и build-manifest");
  console.log("");
}

function main() {
  const [, , cmd, ...args] = process.argv;
  const debug = args.includes("--debug");

  switch (cmd) {
    case "build":
      cmdBuild({ debug });
      break;
    case "init":
      cmdInit();
      break;
    case "docs":
      cmdDocs();
      break;
    case "validate":
      cmdValidate();
      break;
    case "analyze":
      cmdAnalyze();
      break;
    case "doctor":
      cmdDoctor();
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
  generateColorCss,
  generateSpacingCss,
  generateRadiusCss,
  generateShadowCss,
  generateBreakpointsCss,
  getEffectiveConfig,
  cmdBuild,
  cmdInit,
  cmdDocs,
  cmdValidate,
  cmdAnalyze,
  cmdDoctor,
  printHelp,
  main
};
