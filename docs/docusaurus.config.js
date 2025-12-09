/**
 * Rarog — Docusaurus config
 * packages: Rarog/docs/docusaurus.config.js
 * Язык: русский
 * Автор: TheSkiF4er
 * Лицензия: Apache-2.0
 *
 * Полная и продуманная конфигурация Docusaurus v2 для документации Rarog.
 * Конфиг включает i18n (русский как основной), search (локальная), themeConfig,
 * интеграцию с GitHub pages / Netlify, presets для документации и site metadata.
 */

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'Rarog',
  tagline: 'Элементно-ориентированный CSS-фреймворк нового поколения',
  url: 'https://theSkif4er.github.io', // замените при необходимости
  baseUrl: '/rarog/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/img/favicon.ico',

  // i18n
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    localeConfigs: {
      ru: { label: 'Русский' },
      en: { label: 'English' }
    }
  },

  // GitHub pages / repo
  organizationName: 'TheSkiF4er',
  projectName: 'rarog',
  deploymentBranch: 'gh-pages',

  // Custom fields available in site generator
  customFields: {
    repoUrl: 'https://github.com/TheSkiF4er/rarog',
    author: 'TheSkiF4er',
    license: 'Apache-2.0'
  },

  stylesheets: [
    // Place to add external fonts or style overrides
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
      rel: 'stylesheet'
    }
  ],

  scripts: [
    // optional analytics or helpers
    { src: '/js/theme-toggle.js', defer: true }
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/TheSkiF4er/rarog/tree/main/docs/',
          routeBasePath: '/', // docs at site root
          showLastUpdateAuthor: true,
          showLastUpdateTime: true
        },
        blog: false, // отключаем блог (можно включить при желании)
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],

  plugins: [
    // Local search plugin (optional, but highly recommended for docs)
    require.resolve('@cmfcmf/docusaurus-search-local'),
    // Optional: plugin for redoc or openapi docs if you host API references
    // ['@docusaurus/plugin-content-docs', { id: 'api', path: 'api', routeBasePath: 'api' }],
  ],

  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
    image: '/img/rarog-og.png',
    metadata: [
      { name: 'keywords', content: 'rarog, css, design system, tokens, ui' },
      { name: 'author', content: 'TheSkiF4er' }
    ],

    navbar: {
      title: 'Rarog',
      logo: {
        alt: 'Rarog Logo',
        src: '/img/logo-light.svg',
        srcDark: '/img/logo-dark.svg'
      },
      items: [
        { to: '/', label: 'Документация', position: 'left' },
        { to: '/guides/getting-started', label: 'Руководства', position: 'left' },
        { to: '/components/overview', label: 'Компоненты', position: 'left' },
        { to: '/tokens', label: 'Токены', position: 'left' },
        {
          href: 'https://github.com/TheSkiF4er/rarog',
          label: 'GitHub',
          position: 'right'
        },
        {
          type: 'localeDropdown',
          position: 'right'
        }
      ]
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            { label: 'Начало работы', to: '/' },
            { label: 'Токены', to: '/tokens' },
            { label: 'Компоненты', to: '/components/overview' }
          ]
        },
        {
          title: 'Сообщество',
          items: [
            { label: 'GitHub', href: 'https://github.com/TheSkiF4er/rarog' },
            { label: 'Issues', href: 'https://github.com/TheSkiF4er/rarog/issues' }
          ]
        },
        {
          title: 'Дополнительно',
          items: [
            { label: 'CONTRIBUTING', to: '/contributing' },
            { label: 'SECURITY', to: '/security' }
          ]
        }
      ],
      copyright: `© ${new Date().getFullYear()} TheSkiF4er. Distributed under the Apache-2.0 License.`
    },

    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['scss', 'typescript', 'bash']
    },

    // Search plugin options
    algolia: undefined
  })
};
