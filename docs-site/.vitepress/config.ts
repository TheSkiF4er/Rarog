import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Rarog CSS',
  description: 'Современный CSS-фреймворк на базе дизайн-токенов, утилит, компонентов и собственного JS-ядра.',
  base: '/rarog/',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Tokens', link: '/tokens' },
      { text: 'Utilities', link: '/utilities' },
      { text: 'Components', link: '/components' },
      { text: 'JavaScript', link: '/javascript' },
      { text: 'Theming', link: '/theming' },
      { text: 'API Reference', link: '/api-reference' },
      { text: 'Migration 1.x → 2.x', link: '/migration-1x-to-2x' },
      { text: 'Versioning & Support', link: '/versioning' },
      { text: 'Integration Guides', link: '/integration-guides' },
      { text: 'Playground', link: '/playground' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Основы',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Tokens', link: '/tokens' },
            { text: 'Utilities', link: '/utilities' },
            { text: 'Components', link: '/components' },
            { text: 'JavaScript', link: '/javascript' },
            { text: 'Theming', link: '/theming' },
            { text: 'API Reference', link: '/api-reference' },
            { text: 'Migration 1.x → 2.x', link: '/migration-1x-to-2x' },
            { text: 'Versioning & Support', link: '/versioning' }
          ]
        },
        {
          text: 'Интеграция',
          items: [
            { text: 'Integration Guides', link: '/integration-guides' },
            { text: 'Playground', link: '/playground' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TheSkiF4er/rarog-css' }
    ]
  }
})
