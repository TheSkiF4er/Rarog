import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Rarog CSS',
  description:
    'Современный CSS-фреймворк на базе дизайн-токенов, утилит, компонентов и собственного JS-ядра.',
  base: '/rarog/',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Why Rarog', link: '/why-rarog' },
      { text: 'Tokens', link: '/tokens' },
      { text: 'Design System', link: '/design-system' },
      { text: 'Utilities', link: '/utilities' },
      { text: 'Variants & JIT', link: '/variants-jit' },
      { text: 'Components', link: '/components' },
      { text: 'JavaScript', link: '/javascript' },
      { text: 'Accessibility', link: '/accessibility' },
      { text: 'Theming', link: '/theming' },
      { text: 'Cookbook', link: '/cookbook' },
      { text: 'Showcase', link: '/showcase' },
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
      { text: 'EN', link: '/en/' },
      {
        text: 'More',
        items: [
          { text: 'Integration Guides', link: '/integration-guides' },
          { text: 'IDE & Plugins', link: '/ide-plugins' },
          { text: 'Plugins Registry', link: '/plugins-registry' },
          { text: 'Performance', link: '/performance' },
          { text: 'Branding', link: '/branding' },
          { text: 'Versioning & Support', link: '/versioning' },
          { text: 'API Reference', link: '/api-reference' },
          { text: 'API Contract', link: '/api-contract' },
          { text: 'Migration 1.x → 2.x', link: '/migration-1x-to-2x' },
          { text: 'Migration 2.x → 3.x', link: '/migration-2x-to-3x' },
          { text: 'Storybook', link: '/storybook' },
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
            { text: 'Why Rarog', link: '/why-rarog' },
            { text: 'Tokens', link: '/tokens' },
            { text: 'Design System', link: '/design-system' },
            { text: 'Utilities', link: '/utilities' },
            { text: 'Variants & JIT', link: '/variants-jit' },
            { text: 'Components', link: '/components' },
            { text: 'JavaScript', link: '/javascript' },
            { text: 'Accessibility', link: '/accessibility' },
            { text: 'Theming', link: '/theming' },
            { text: 'Cookbook', link: '/cookbook' },
            { text: 'Showcase', link: '/showcase' }
          ]
        },
        {
          text: 'Справка и поддержка',
          items: [
            { text: 'API Reference', link: '/api-reference' },
            { text: 'API Contract', link: '/api-contract' },
            { text: 'Performance', link: '/performance' },
            { text: 'Branding', link: '/branding' },
            { text: 'Versioning & Support', link: '/versioning' },
            { text: 'Migration 1.x → 2.x', link: '/migration-1x-to-2x' },
            { text: 'Migration 2.x → 3.x', link: '/migration-2x-to-3x' }
          ]
        },
        {
          text: 'Интеграция и инструменты',
          items: [
            { text: 'Integration Guides', link: '/integration-guides' },
            { text: 'Guide: Laravel', link: '/guide-laravel' },
            { text: 'Guide: React', link: '/guide-react' },
            { text: 'Guide: Vue', link: '/guide-vue' },
            { text: 'Guide: Next.js', link: '/guide-nextjs' },
            { text: 'Guide: Cajeer Stack', link: '/guide-cajeer-stack' },
            { text: 'IDE & Plugins', link: '/ide-plugins' },
            { text: 'Plugins Registry', link: '/plugins-registry' },
            { text: 'Storybook', link: '/storybook' },
            { text: 'Playground', link: '/playground' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/TheSkiF4er/rarog' }]
  }
})
