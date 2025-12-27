const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Простое расширение VSCode для Rarog:
 * - автодополнение классов (из rarog-classmap.json);
 * - hover-доки по классам.
 */

function activate(context) {
  if (vscode.workspace.getConfiguration('rarogCss').get('enable') === false) {
    return;
  }

  let classMap = [];
  try {
    const jsonPath = path.join(context.extensionPath, 'rarog-classmap.json');
    const raw = fs.readFileSync(jsonPath, 'utf8');
    classMap = JSON.parse(raw);
  } catch (err) {
    console.warn('[rarog-vscode] Не удалось загрузить rarog-classmap.json:', err.message);
  }

  const completionItems = classMap.map(entry => {
    const item = new vscode.CompletionItem(entry.className, vscode.CompletionItemKind.Keyword);
    item.detail = entry.category ? `Rarog ${entry.category}` : 'Rarog CSS';
    if (entry.description) {
      item.documentation = new vscode.MarkdownString(entry.description);
    }
    return item;
  });

  const selector = [
    'html',
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
    'vue'
  ];

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    selector,
    {
      provideCompletionItems() {
        return completionItems;
      }
    },
    '-', ':', ' ', '"', '\'', '.', '[', ']'
  );

  const hoverProvider = vscode.languages.registerHoverProvider(selector, {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position, /[A-Za-z0-9_\-:\.\[\]=]+/);
      if (!range) return;
      const word = document.getText(range);
      const entry = classMap.find(e => e.className === word);
      if (!entry) return;

      const md = new vscode.MarkdownString();
      md.appendCodeblock(entry.className, 'text');
      if (entry.description) {
        md.appendMarkdown('\n\n' + entry.description);
      }
      md.isTrusted = true;
      return new vscode.Hover(md, range);
    }
  });

  context.subscriptions.push(completionProvider, hoverProvider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
