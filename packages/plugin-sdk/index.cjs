const path = require("path");

const SDK_API_VERSION = 1;
const DEFAULT_ENGINE_RANGE = ">=3.5.0 <4.0.0";

function normalizeCapabilities(capabilities) {
  const source = capabilities && typeof capabilities === "object" ? capabilities : {};
  return {
    utilities: source.utilities !== false,
    components: source.components !== false,
    tokens: Boolean(source.tokens),
    themes: Boolean(source.themes),
    js: Boolean(source.js),
    diagnostics: Boolean(source.diagnostics)
  };
}

function createPlugin(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("[rarog/plugin-sdk] Plugin definition must be an object.");
  }

  if (!definition.name || typeof definition.name !== "string") {
    throw new TypeError("[rarog/plugin-sdk] Plugin definition requires a string `name`.");
  }

  if (typeof definition.setup !== "function") {
    throw new TypeError("[rarog/plugin-sdk] Plugin definition requires a `setup(ctx)` function.");
  }

  const manifest = {
    apiVersion: SDK_API_VERSION,
    name: definition.name,
    version: definition.version || "0.1.0",
    displayName: definition.displayName || definition.name,
    description: definition.description || "",
    engine: {
      rarog: definition.engine && definition.engine.rarog ? definition.engine.rarog : DEFAULT_ENGINE_RANGE
    },
    compatibility: definition.compatibility || "^1",
    capabilities: normalizeCapabilities(definition.capabilities),
    keywords: Array.isArray(definition.keywords) ? definition.keywords.slice() : [],
    official: Boolean(definition.official)
  };

  return {
    __rarogPlugin: true,
    manifest,
    setup: definition.setup
  };
}

const definePlugin = createPlugin;

function parseVersion(input) {
  const match = String(input || "0.0.0").match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return { major: 0, minor: 0, patch: 0 };
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  };
}

function compareVersions(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function satisfiesSimpleRange(version, range) {
  if (!range || range === "*") return true;
  const current = parseVersion(version);
  const clauses = String(range).trim().split(/\s+/).filter(Boolean);
  return clauses.every((clause) => {
    if (clause.startsWith("^")) {
      const base = parseVersion(clause.slice(1));
      return current.major === base.major && compareVersions(current, base) >= 0;
    }
    if (clause.startsWith(">=")) {
      return compareVersions(current, parseVersion(clause.slice(2))) >= 0;
    }
    if (clause.startsWith(">")) {
      return compareVersions(current, parseVersion(clause.slice(1))) > 0;
    }
    if (clause.startsWith("<=")) {
      return compareVersions(current, parseVersion(clause.slice(2))) <= 0;
    }
    if (clause.startsWith("<")) {
      return compareVersions(current, parseVersion(clause.slice(1))) < 0;
    }
    return compareVersions(current, parseVersion(clause)) === 0;
  });
}

function validatePluginCompatibility(plugin, runtime) {
  const manifest = plugin && plugin.manifest ? plugin.manifest : null;
  if (!manifest) {
    return {
      ok: false,
      errors: ["Plugin manifest is missing."],
      warnings: []
    };
  }

  const runtimeVersion = runtime && runtime.rarogVersion ? runtime.rarogVersion : "0.0.0";
  const range = manifest.engine && manifest.engine.rarog ? manifest.engine.rarog : DEFAULT_ENGINE_RANGE;
  const warnings = [];
  const errors = [];

  if (!satisfiesSimpleRange(runtimeVersion, range)) {
    errors.push(`Plugin ${manifest.name} expects Rarog ${range}, received ${runtimeVersion}.`);
  }

  if (manifest.apiVersion !== SDK_API_VERSION) {
    errors.push(`Plugin ${manifest.name} uses plugin API v${manifest.apiVersion}, expected v${SDK_API_VERSION}.`);
  }

  if (!manifest.capabilities || typeof manifest.capabilities !== "object") {
    warnings.push(`Plugin ${manifest.name} has no capabilities metadata.`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

function createPluginTestHarness(options = {}) {
  const runtime = {
    rarogVersion: options.rarogVersion || "3.5.0",
    rootDir: options.rootDir || process.cwd()
  };

  function load(pluginModule) {
    let loaded = pluginModule;
    if (typeof pluginModule === "string") {
      const resolved = path.isAbsolute(pluginModule)
        ? pluginModule
        : path.join(runtime.rootDir, pluginModule);
      delete require.cache[resolved];
      loaded = require(resolved);
    }
    return loaded && loaded.default ? loaded.default : loaded;
  }

  function execute(pluginModule, context = {}) {
    const loaded = load(pluginModule);
    let plugin = loaded;

    if (typeof plugin === "function") {
      const legacyResult = plugin({ config: context.config || {} }) || {};
      return {
        manifest: null,
        compatibility: { ok: true, errors: [], warnings: ["Legacy function plugin loaded without SDK metadata."] },
        result: {
          utilitiesCss: String(legacyResult.utilitiesCss || ""),
          componentsCss: String(legacyResult.componentsCss || ""),
          diagnostics: Array.isArray(legacyResult.diagnostics) ? legacyResult.diagnostics : []
        }
      };
    }

    if (!plugin || !plugin.__rarogPlugin || typeof plugin.setup !== "function") {
      throw new TypeError("[rarog/plugin-sdk] Expected a plugin created by createPlugin()/definePlugin().");
    }

    const compatibility = validatePluginCompatibility(plugin, runtime);
    const result = plugin.setup({
      config: context.config || {},
      meta: {
        mode: context.mode || "jit",
        rootDir: runtime.rootDir,
        env: context.env || "test"
      },
      helpers: context.helpers || {}
    }) || {};

    return {
      manifest: plugin.manifest,
      compatibility,
      result: {
        utilitiesCss: String(result.utilitiesCss || ""),
        componentsCss: String(result.componentsCss || ""),
        diagnostics: Array.isArray(result.diagnostics) ? result.diagnostics : []
      }
    };
  }

  return {
    runtime,
    execute,
    validate(pluginModule) {
      const loaded = load(pluginModule);
      if (!loaded || !loaded.__rarogPlugin) {
        return { ok: true, errors: [], warnings: ["Legacy function plugin without manifest."] };
      }
      return validatePluginCompatibility(loaded, runtime);
    }
  };
}

module.exports = {
  SDK_API_VERSION,
  DEFAULT_ENGINE_RANGE,
  createPlugin,
  definePlugin,
  createPluginTestHarness,
  validatePluginCompatibility
};
