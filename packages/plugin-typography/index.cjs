/*!
 * @rarog/plugin-typography
 * Официальный плагин типографики (контентные блоки, markdown-статьи).
 */

module.exports = function rarogTypographyPlugin(ctx) {
  const componentsCss = `
/* Rarog Typography Plugin */

.prose {
  color: var(--rarog-color-semantic-text);
  max-width: 70ch;
  line-height: 1.7;
  font-size: 1rem;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  font-weight: 700;
  color: var(--rarog-color-semantic-text);
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose h1 { font-size: 2rem; }
.prose h2 { font-size: 1.6rem; }
.prose h3 { font-size: 1.3rem; }
.prose h4 { font-size: 1.1rem; }

.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose a {
  color: var(--rarog-color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.12em;
}

.prose a:hover {
  color: var(--rarog-color-primary-600);
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose li + li {
  margin-top: 0.25em;
}

.prose code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
  padding: 0.1em 0.3em;
  border-radius: 0.25rem;
  background-color: rgba(15, 23, 42, 0.04);
}

.prose pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  overflow-x: auto;
}

.prose blockquote {
  border-left: 3px solid var(--rarog-color-semantic-border);
  padding-left: 1rem;
  margin-left: 0;
  color: var(--rarog-color-semantic-muted);
  font-style: italic;
}

.prose img,
.prose video {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  border-radius: 0.5rem;
}
`;

  return {
    componentsCss
  };
};
