const fs = require("fs");
const path = require("path");

const SCREEN_VARIANTS = {
  sm: "var(--rarog-breakpoint-sm)",
  md: "var(--rarog-breakpoint-md)",
  lg: "var(--rarog-breakpoint-lg)",
  xl: "var(--rarog-breakpoint-xl)",
  "2xl": "var(--rarog-breakpoint-2xl)",
  xl2: "var(--rarog-breakpoint-2xl)"
};

function normalizePath(relPath) {
  return relPath.replace(/\\/g, "/").replace(/^\.\//, "");
}

function walkDir(dir, acc, ignoreDirs = new Set(["node_modules", ".git", "dist", "coverage", ".next", ".nuxt", ".turbo"])) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walkDir(full, acc, ignoreDirs);
    } else if (entry.isFile()) {
      acc.push(full);
    }
  }
}

function scanContentFiles(projectRoot, patterns) {
  const files = new Set();

  for (const pattern of (patterns || [])) {
    const normalized = normalizePath(pattern || "");
    if (!normalized) continue;

    const braceMatch = normalized.match(/\{([^}]+)\}/);
    let extensions = null;
    if (braceMatch) {
      extensions = new Set(
        braceMatch[1]
          .split(",")
          .map((item) => item.trim().replace(/^\./, ""))
          .filter(Boolean)
      );
    } else {
      const ext = path.extname(normalized).replace(/^\./, "");
      if (ext) extensions = new Set([ext]);
    }

    const specialIdx = normalized.search(/[\*\{\?]/);
    const base = specialIdx === -1 ? normalized : normalized.slice(0, specialIdx);
    const baseDir = path.join(projectRoot, base || ".");
    const collected = [];
    walkDir(baseDir, collected);

    for (const file of collected) {
      if (extensions && extensions.size) {
        const ext = path.extname(file).replace(/^\./, "");
        if (!extensions.has(ext)) continue;
      }
      files.add(file);
    }
  }

  return Array.from(files).sort();
}

function splitClassTokens(raw) {
  return String(raw)
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function extractClassesFromContent(files) {
  const classSet = new Set();
  const rawTokens = [];
  const patterns = [
    /(class|className)\s*=\s*["'`]([^"'`]+)["'`]/g,
    /class: \s*["'`]([^"'`]+)["'`]/g,
    /classList\.(?:add|remove|toggle)\(([^)]+)\)/g,
    /\b(?:clsx|cx|classnames)\(([^)]+)\)/g
  ];

  for (const file of files) {
    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const bucket = match[2] || match[1] || "";
        const strings = [];
        if (pattern === patterns[2] || pattern === patterns[3]) {
          let stringMatch;
          const literalRe = /["'`]([^"'`]+)["'`]/g;
          while ((stringMatch = literalRe.exec(bucket)) !== null) {
            strings.push(stringMatch[1]);
          }
        } else {
          strings.push(bucket);
        }

        for (const candidate of strings) {
          for (const token of splitClassTokens(candidate)) {
            rawTokens.push(token);
            classSet.add(token);
          }
        }
      }
      pattern.lastIndex = 0;
    }
  }

  return {
    classes: Array.from(classSet).sort(),
    rawTokens
  };
}

function unescapeCssClass(className) {
  return className.replace(/\\:/g, ":").replace(/\\\//g, "/").replace(/\\\[/g, "[").replace(/\\\]/g, "]").replace(/\\=/g, "=").replace(/\\\./g, ".");
}

function extractSupportedClassesFromCss(css) {
  const supported = new Set();
  const re = /\.([A-Za-z0-9_\\:\-\[\]\/=%]+)/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    supported.add(unescapeCssClass(match[1]));
  }
  return supported;
}

function isPotentialUtilityClass(token) {
  if (!token || token.startsWith("http")) return false;
  return /[:\-\[\]]/.test(token) || /^(btn|card|modal|dropdown|toast|alert|rg-)/.test(token);
}

function splitVariants(token) {
  const parts = token.split(":");
  const base = parts.pop();
  return { variants: parts, base };
}

function validateArbitraryValue(raw) {
  if (!raw || /[;}]/.test(raw)) {
    return { ok: false, reason: "unsafe arbitrary value" };
  }
  return { ok: true };
}

function buildArbitraryRule(baseClass) {
  const mappings = [
    [/^w-\[(.+)\]$/, "width"],
    [/^h-\[(.+)\]$/, "height"],
    [/^min-w-\[(.+)\]$/, "min-width"],
    [/^max-w-\[(.+)\]$/, "max-width"],
    [/^min-h-\[(.+)\]$/, "min-height"],
    [/^max-h-\[(.+)\]$/, "max-height"],
    [/^m-\[(.+)\]$/, "margin"],
    [/^mx-\[(.+)\]$/, ["margin-left", "margin-right"]],
    [/^my-\[(.+)\]$/, ["margin-top", "margin-bottom"]],
    [/^mt-\[(.+)\]$/, "margin-top"],
    [/^mr-\[(.+)\]$/, "margin-right"],
    [/^mb-\[(.+)\]$/, "margin-bottom"],
    [/^ml-\[(.+)\]$/, "margin-left"],
    [/^p-\[(.+)\]$/, "padding"],
    [/^px-\[(.+)\]$/, ["padding-left", "padding-right"]],
    [/^py-\[(.+)\]$/, ["padding-top", "padding-bottom"]],
    [/^pt-\[(.+)\]$/, "padding-top"],
    [/^pr-\[(.+)\]$/, "padding-right"],
    [/^pb-\[(.+)\]$/, "padding-bottom"],
    [/^pl-\[(.+)\]$/, "padding-left"],
    [/^gap-\[(.+)\]$/, "gap"],
    [/^gap-x-\[(.+)\]$/, "column-gap"],
    [/^gap-y-\[(.+)\]$/, "row-gap"],
    [/^top-\[(.+)\]$/, "top"],
    [/^right-\[(.+)\]$/, "right"],
    [/^bottom-\[(.+)\]$/, "bottom"],
    [/^left-\[(.+)\]$/, "left"],
    [/^inset-\[(.+)\]$/, "inset"],
    [/^bg-\[(.+)\]$/, "background-color"],
    [/^text-\[(.+)\]$/, "color"],
    [/^border-\[(.+)\]$/, "border-width"],
    [/^rounded-\[(.+)\]$/, "border-radius"],
    [/^shadow-\[(.+)\]$/, "box-shadow"],
    [/^opacity-\[(.+)\]$/, "opacity"],
    [/^translate-x-\[(.+)\]$/, ["--rarog-translate-x", "__transform__"]],
    [/^translate-y-\[(.+)\]$/, ["--rarog-translate-y", "__transform__"]],
    [/^rotate-\[(.+)\]$/, ["--rarog-rotate", "__transform__"]],
    [/^scale-\[(.+)\]$/, [["--rarog-scale-x", "--rarog-scale-y"], "__transform__"]]
  ];

  for (const [re, prop] of mappings) {
    const match = baseClass.match(re);
    if (!match) continue;
    const rawValue = match[1];
    const validity = validateArbitraryValue(rawValue);
    if (!validity.ok) {
      return { ok: false, reason: validity.reason };
    }
    const declarations = [];
    if (Array.isArray(prop)) {
      if (prop[1] === "__transform__") {
        if (Array.isArray(prop[0])) {
          declarations.push(`${prop[0][0]}: ${rawValue};`);
          declarations.push(`${prop[0][1]}: ${rawValue};`);
        } else {
          declarations.push(`${prop[0]}: ${rawValue};`);
        }
        declarations.push("transform: translate(var(--rarog-translate-x, 0), var(--rarog-translate-y, 0)) rotate(var(--rarog-rotate, 0)) scaleX(var(--rarog-scale-x, 1)) scaleY(var(--rarog-scale-y, 1));");
      } else {
        for (const item of prop) declarations.push(`${item}: ${rawValue};`);
      }
    } else {
      declarations.push(`${prop}: ${rawValue};`);
    }
    return { ok: true, declarations };
  }

  return { ok: false, reason: "unsupported arbitrary utility" };
}

function escapeClassForSelector(className) {
  return className.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function wrapRuleWithVariants(className, declarations, variants) {
  let selector = `.${escapeClassForSelector(className)}`;
  let media = null;

  for (const variant of variants) {
    if (SCREEN_VARIANTS[variant]) {
      media = SCREEN_VARIANTS[variant];
      continue;
    }

    if (variant === "hover") {
      selector += ":hover";
      continue;
    }
    if (variant === "focus") {
      selector += ":focus";
      continue;
    }
    if (variant === "focus-visible") {
      selector += ":focus-visible";
      continue;
    }
    if (variant === "active") {
      selector += ":active";
      continue;
    }
    if (variant === "disabled") {
      selector += ":disabled";
      continue;
    }
    if (variant === "group-hover") {
      selector = `.group:hover ${selector}`;
      continue;
    }
    if (variant === "group-focus") {
      selector = `.group:focus-within ${selector}`;
      continue;
    }
    if (variant === "peer-checked") {
      selector = `.peer:checked ~ ${selector}`;
      continue;
    }
    if (variant === "peer-focus") {
      selector = `.peer:focus ~ ${selector}`;
      continue;
    }
    if (variant === "peer-disabled") {
      selector = `.peer:disabled ~ ${selector}`;
      continue;
    }
    if (variant === "data-[state=open]") {
      selector += `[data-state="open"]`;
      continue;
    }
    if (variant === "data-[state=closed]") {
      selector += `[data-state="closed"]`;
      continue;
    }
  }

  const rule = `${selector} { ${declarations.join(" ")} }`;
  if (media) {
    return `@media (min-width: ${media}) { ${rule} }`;
  }
  return rule;
}

function generateArbitraryCss(usedClasses) {
  const rules = [];
  const issues = [];

  for (const token of usedClasses) {
    if (!token.includes("[") || !token.includes("]")) continue;
    const { variants, base } = splitVariants(token);
    const result = buildArbitraryRule(base);
    if (!result.ok) {
      issues.push({ className: token, reason: result.reason });
      continue;
    }
    rules.push(wrapRuleWithVariants(token, result.declarations, variants));
  }

  return {
    css: rules.length ? `/* Rarog JIT arbitrary values */\n${rules.join("\n")}\n` : "",
    issues
  };
}

function filterCssByUsedClasses(css, usedClasses) {
  if (!usedClasses || !usedClasses.length) return "";
  const usedEscaped = usedClasses.map((value) => value.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\./g, "\\.").replace(/\//g, "\\/").replace(/#/g, "\\#"));
  const hasClass = (block) => usedEscaped.some((className) => block.includes(`.${className}`));

  let i = 0;
  let result = "";
  while (i < css.length) {
    if (css.startsWith("@media", i)) {
      const braceStart = css.indexOf("{", i);
      if (braceStart === -1) break;
      let depth = 0;
      let j = braceStart;
      for (; j < css.length; j += 1) {
        if (css[j] === "{") depth += 1;
        if (css[j] === "}") {
          depth -= 1;
          if (depth === 0) {
            j += 1;
            break;
          }
        }
      }
      const block = css.slice(i, j);
      if (hasClass(block)) result += block;
      i = j;
      continue;
    }
    const nextClose = css.indexOf("}", i);
    if (nextClose === -1) {
      result += css.slice(i);
      break;
    }
    const block = css.slice(i, nextClose + 1);
    const trimmed = block.trim();
    if (trimmed.startsWith("/*") || trimmed.startsWith(":root") || trimmed.startsWith("@keyframes") || trimmed.startsWith("@font-face") || hasClass(block)) {
      result += block;
    }
    i = nextClose + 1;
  }
  return result;
}

function dedupeCssBlocks(css) {
  const seen = new Set();
  let result = "";
  let i = 0;
  while (i < css.length) {
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i);
      if (end === -1) break;
      const block = css.slice(i, end + 2);
      result += block;
      i = end + 2;
      continue;
    }
    const close = css.indexOf("}", i);
    if (close === -1) {
      result += css.slice(i);
      break;
    }
    const block = css.slice(i, close + 1);
    const normalized = block.trim();
    if (!normalized || !seen.has(normalized)) {
      seen.add(normalized);
      result += block;
    }
    i = close + 1;
  }
  return result;
}

function analyzeClasses({ files, coreCssFull = "", utilitiesCssFull, componentsCssFull }) {
  const extracted = extractClassesFromContent(files);
  const usedClasses = extracted.classes;
  const supported = new Set([
    ...extractSupportedClassesFromCss(coreCssFull),
    ...extractSupportedClassesFromCss(utilitiesCssFull),
    ...extractSupportedClassesFromCss(componentsCssFull)
  ]);

  const knownClasses = [];
  const unknownClasses = [];
  const arbitraryIssues = [];

  for (const className of usedClasses) {
    if (supported.has(className)) {
      knownClasses.push(className);
      continue;
    }
    if (className.includes("[") && className.includes("]")) {
      const { base } = splitVariants(className);
      const arbitrary = buildArbitraryRule(base);
      if (arbitrary.ok) {
        knownClasses.push(className);
      } else {
        unknownClasses.push(className);
        arbitraryIssues.push({ className, reason: arbitrary.reason });
      }
      continue;
    }
    if (isPotentialUtilityClass(className)) {
      unknownClasses.push(className);
    }
  }

  return {
    usedClasses,
    knownClasses: knownClasses.sort(),
    unknownClasses: unknownClasses.sort(),
    arbitraryIssues,
    supportedClasses: Array.from(supported).sort()
  };
}

module.exports = {
  SCREEN_VARIANTS,
  scanContentFiles,
  extractClassesFromContent,
  extractSupportedClassesFromCss,
  isPotentialUtilityClass,
  splitVariants,
  buildArbitraryRule,
  generateArbitraryCss,
  filterCssByUsedClasses,
  dedupeCssBlocks,
  analyzeClasses
};
