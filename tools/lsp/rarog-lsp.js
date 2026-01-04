#!/usr/bin/env node
/*!
 * Rarog LSP Server
 * LSP-сервер для автодополнения классов, токенов и базовой валидации rarog.config.*.
 */

const fs = require("fs");
const path = require("path");
const url = require("url");
const {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  CompletionItemKind,
  DiagnosticSeverity
} = require("vscode-languageserver/node");
const { TextDocument } = require("vscode-languageserver-textdocument");

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let workspaceRoot = null;
let classMap = [];
let tokens = {};
let cliApi = null;

function resolveWorkspacePath(relativePath) {
  if (!workspaceRoot) return null;
  return path.join(workspaceRoot, relativePath);
}

function loadClassMap() {
  const candidates = [
    resolveWorkspacePath("tools/vscode-rarog/rarog-classmap.json"),
    path.join(__dirname, "..", "vscode-rarog", "rarog-classmap.json")
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, "utf8");
        classMap = JSON.parse(raw);
        connection.console.log(`[rarog-lsp] classmap loaded from ${candidate}`);
        return;
      }
    } catch (err) {
      connection.console.error(`[rarog-lsp] failed to load classmap from ${candidate}: ${err.message}`);
    }
  }

  classMap = [];
  connection.console.warn("[rarog-lsp] classmap not found, completions will be limited.");
}

function loadTokens() {
  const candidates = [
    resolveWorkspacePath("rarog.tokens.json"),
    path.join(__dirname, "..", "..", "rarog.tokens.json")
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, "utf8");
        const json = JSON.parse(raw);
        tokens = json.tokens || {};
        connection.console.log(`[rarog-lsp] tokens loaded from ${candidate}`);
        return;
      }
    } catch (err) {
      connection.console.error(`[rarog-lsp] failed to load tokens from ${candidate}: ${err.message}`);
    }
  }

  tokens = {};
}

function loadCliApi() {
  const candidates = [
    resolveWorkspacePath("packages/cli/bin/rarog.js"),
    path.join(__dirname, "..", "..", "packages", "cli", "bin", "rarog.js")
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        cliApi = require(candidate);
        connection.console.log(`[rarog-lsp] cli api loaded from ${candidate}`);
        return;
      }
    } catch (err) {
      connection.console.error(`[rarog-lsp] failed to load cli api from ${candidate}: ${err.message}`);
    }
  }
}

function buildTokenCompletions() {
  const items = [];

  const theme = tokens.theme || {};
  const colors = theme.colors || {};
  const spacing = theme.spacing || {};
  const radius = theme.radius || {};
  const shadow = theme.shadow || {};

  // Цветовые токены: primary-500, success-600...
  Object.entries(colors).forEach(([scale, shades]) => {
    if (typeof shades !== "object") return;
    Object.entries(shades).forEach(([key, value]) => {
      if (key === "base") return;
      const label = `${scale}-${key}`;
      items.push({
        label,
        kind: CompletionItemKind.Constant,
        detail: `color.${scale}.${key}`,
        documentation: value ? `Цвет ${scale}-${key}: ${value}` : undefined
      });
    });
  });

  // spacing tokens: space-4
  Object.entries(spacing).forEach(([key, value]) => {
    items.push({
      label: `space-${key}`,
      kind: CompletionItemKind.Constant,
      detail: `spacing.${key}`,
      documentation: value ? `Шаг spacing ${key}: ${value}` : undefined
    });
  });

  // radius tokens
  Object.entries(radius).forEach(([key, value]) => {
    items.push({
      label: `radius-${key}`,
      kind: CompletionItemKind.Constant,
      detail: `radius.${key}`,
      documentation: value ? `Радиус ${key}: ${value}` : undefined
    });
  });

  // shadow tokens
  Object.entries(shadow).forEach(([key, value]) => {
    items.push({
      label: `shadow-${key}`,
      kind: CompletionItemKind.Constant,
      detail: `shadow.${key}`,
      documentation: value ? `Тень ${key}: ${value}` : undefined
    });
  });

  return items;
}

let tokenCompletionsCache = [];

connection.onInitialize(params => {
  workspaceRoot = params.rootUri ? url.fileURLToPath(params.rootUri) : process.cwd();
  loadClassMap();
  loadTokens();
  loadCliApi();
  tokenCompletionsCache = buildTokenCompletions();

  const capabilities = {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: {
      resolveProvider: false,
      triggerCharacters: [" ", '"', "'", ".", "-", ":", "[", "]"]
    },
    hoverProvider: true
  };

  return { capabilities };
});

connection.onInitialized(() => {
  connection.console.log("[rarog-lsp] initialized");
});

documents.onDidChangeContent(change => {
  const uri = change.document.uri;
  if (uri.endsWith("rarog.config.json") || uri.endsWith("rarog.config.js") || uri.endsWith("rarog.config.ts")) {
    validateConfigDocument(change.document);
  }
});

function validateConfigDocument(doc) {
  if (!cliApi || typeof cliApi.validateConfig !== "function") {
    // LSP всё равно может подсветить синтаксические ошибки JSON
    if (doc.languageId === "json") {
      try {
        JSON.parse(doc.getText());
      } catch (err) {
        const diag = {
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 1 }
          },
          message: "Некорректный JSON в rarog.config.json: " + err.message,
          source: "rarog-lsp"
        };
        connection.sendDiagnostics({ uri: doc.uri, diagnostics: [diag] });
        return;
      }
    }
    connection.sendDiagnostics({ uri: doc.uri, diagnostics: [] });
    return;
  }

  let config = null;

  if (doc.languageId === "json") {
    try {
      config = JSON.parse(doc.getText());
    } catch (err) {
      const diag = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 1 }
        },
        message: "Некорректный JSON в rarog.config.json: " + err.message,
        source: "rarog-lsp"
      };
      connection.sendDiagnostics({ uri: doc.uri, diagnostics: [diag] });
      return;
    }
  } else {
    // Для JS/TS-конфига пробуем прочитать с диска
    try {
      const fsPath = url.fileURLToPath(doc.uri);
      delete require.cache[fsPath];
      // eslint-disable-next-line global-require, import/no-dynamic-require
      config = require(fsPath);
      if (config && config.default) config = config.default;
    } catch (err) {
      const diag = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 1 }
        },
        message: "Не удалось загрузить rarog.config.* для валидации: " + err.message,
        source: "rarog-lsp"
      };
      connection.sendDiagnostics({ uri: doc.uri, diagnostics: [diag] });
      return;
    }
  }

  const result = cliApi.validateConfig(config);
  const diagnostics = [];

  (result.errors || []).forEach(err => {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      },
      message: err.message,
      source: "rarog-lsp"
    });
  });

  (result.warnings || []).forEach(warn => {
    diagnostics.push({
      severity: DiagnosticSeverity.Warning,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 1 }
      },
      message: warn.message,
      source: "rarog-lsp"
    });
  });

  connection.sendDiagnostics({ uri: doc.uri, diagnostics });
}

connection.onCompletion(params => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];

  const text = doc.getText();
  const offset = doc.offsetAt(params.position);
  const prefix = extractPrefix(text, offset);

  const items = [];

  // Классы Rarog (rg-*, btn-*, bg-*, text-*)
  classMap.forEach(entry => {
    if (!prefix || entry.className.startsWith(prefix)) {
      items.push({
        label: entry.className,
        kind: CompletionItemKind.Keyword,
        detail: entry.category ? `Rarog ${entry.category}` : "Rarog CSS",
        documentation: entry.description || undefined
      });
    }
  });

  // Токены (primary-500, space-4 и т.п.) — особенно полезно внутри rarog.config.*
  if (doc.uri.endsWith("rarog.config.ts") || doc.uri.endsWith("rarog.config.js") || doc.uri.endsWith("rarog.config.json")) {
    tokenCompletionsCache.forEach(tok => {
      if (!prefix || tok.label.startsWith(prefix)) {
        items.push(tok);
      }
    });
  }

  return items;
});

function extractPrefix(text, offset) {
  let i = offset - 1;
  while (i >= 0) {
    const ch = text[i];
    if (!ch || /[\s"'<>,]/.test(ch)) break;
    i--;
  }
  return text.slice(i + 1, offset);
}

connection.onHover(params => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return null;

  const pos = params.position;
  const offset = doc.offsetAt(pos);
  const text = doc.getText();

  const prefix = extractPrefix(text, offset);
  if (!prefix) return null;

  const entry = classMap.find(e => e.className === prefix);
  if (!entry) return null;

  const docsUrl = "https://cajeer.ru/rarog";

  const contents = [
    { language: "text", value: entry.className },
    entry.description || "",
    `Документация: ${docsUrl}`
  ].filter(Boolean);

  return {
    contents
  };
});

documents.listen(connection);
connection.listen();
