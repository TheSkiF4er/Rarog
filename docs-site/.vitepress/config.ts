import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Rarog CSS',
  description: 'Современный CSS-фреймворк на базе дизайн-токенов, утилит, компонентов и собственного JS-ядра.',
  base: '/rarog/',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Why Rarog', link: '/why-rarog' },
      { text: 'Tokens', link: '/tokens' },
      { text: 'Utilities', link: '/utilities' },
      { text: 'Variants & JIT', link: '/variants-jit' },
      { text: 'Components', link: '/components' },
      { text: 'JavaScript', link: '/javascript' },
      { text: 'Theming', link: '/theming' },
      { text: 'Cookbook', link: '/cookbook' },
      {
        text: 'Guides',
        items: [
          { text: 'Laravel Guide', link: '/guide-laravel' },
          { text: 'React Guide', link: '/guide-react' },
          { text: 'Vue Guide', link: '/guide-vue' },
          { text: 'Next.js Guide', link: '/guide-nextjs' },
          { text: 'Cajeer Stack Guide', link: '/guide-cajeer-stack' }
        ]
      },
      {
        text: 'More',
        items: [
          { text: 'Integration Guides', link: '/integration-guides' },
          { text: 'IDE & Plugins', link: '/ide-plugins' },
          { text: 'Performance', link: '/performance' },
          { text: 'Branding', link: '/branding' },
          { text: 'Versioning & Support', link: '/versioning' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Migration 1.x → 2.x', link: '/migration-1x-to-2x' },
          { text: 'Playground', link: '/playground' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Основы',
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'Tokens', link: '/tokens' },
            { text: 'Utilities', link: '/utilities' },
      { text: 'Variants & JIT', link: '/variants-jit' },
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
      { text: 'IDE & Plugins', link: '/ide-plugins' },
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
