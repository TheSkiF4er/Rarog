import '../packages/core/src/rarog-core.css';
import '../packages/utilities/src/rarog-utilities.css';
import '../packages/components/src/rarog-components.css';
import '../packages/themes/src/rarog-theme-default.css';
import '../packages/js/src/rarog.esm.js';
import Rarog from '../packages/js/src/rarog.esm.js';

if (typeof window !== 'undefined') {
  window.Rarog = Rarog;
}

export const parameters = {
  layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i
    }
  },
  options: {
    storySort: {
      order: ['Foundations', 'Overlays', 'Data']
    }
  }
};

export const decorators = [
  (storyFn, context) => {
    const html = storyFn();
    queueMicrotask(() => {
      const root = context.canvasElement || document;
      try {
        Rarog.reinit(root);
      } catch (error) {
        console.error('Rarog Storybook reinit failed', error);
      }
    });
    return html;
  }
];
