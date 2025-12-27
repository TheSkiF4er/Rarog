/*!
 * @rarog/plugin-forms
 * Простейший официальный плагин форм Rarog.
 *
 * Экспортирует функцию-плагин:
 *   module.exports = function (ctx) { return { utilitiesCss, componentsCss? } }
 */

module.exports = function rarogFormsPlugin(ctx) {
  const utilitiesCss = `
/* Rarog Forms Plugin (utilities) */

.form-control-sm {
  min-height: 2rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.form-control-lg {
  min-height: 3rem;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
}

.field {
  margin-bottom: var(--rarog-spacing-4, 1rem);
}

.field-label-inline {
  display: inline-flex;
  align-items: center;
  gap: var(--rarog-spacing-2, 0.5rem);
}

.field-hint {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--rarog-color-semantic-muted);
}

.input-muted {
  background-color: rgba(15, 23, 42, 0.02);
}

input[type="checkbox"].switch,
input[type="radio"].switch {
  width: 2.5rem;
  height: 1.35rem;
  border-radius: 9999px;
  position: relative;
  appearance: none;
  background-color: var(--rarog-color-semantic-borderSubtle);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

input[type="checkbox"].switch::before,
input[type="radio"].switch::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.25);
  transition: transform 0.2s ease;
}

input[type="checkbox"].switch:checked,
input[type="radio"].switch:checked {
  background-color: var(--rarog-color-primary);
}

input[type="checkbox"].switch:checked::before,
input[type="radio"].switch:checked::before {
  transform: translateX(1.1rem);
}
`;

  return {
    utilitiesCss
  };
};
