/** @type {загрузка('@storybook/html-vite').StorybookConfig} */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|mjs)'
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: true
  }
};

export default config;
