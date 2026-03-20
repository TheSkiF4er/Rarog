# Documentation

Rarog docs platform теперь ориентирована на **GitBook** как на основной delivery-слой документации. Цель — сделать документацию не приложением «рядом», а полноценным конкурентным преимуществом: с быстрым поиском, живыми примерами, lookup-страницами, anatomy-разборами компонентов, accessibility notes, token/theme explorer и понятными migration-путями.

## What is new in docs platform

- **GitBook-native IA** через `docs/SUMMARY.md` и `.gitbook.yaml`
- **Live playground** в `examples/playground/` для интерактивных сценариев
- **Utility lookup** для быстрого поиска классов и альтернатив
- **Component anatomy** и accessibility notes для production-команд
- **Token/theme explorer** как вход в theming workflows
- **Migration pages** для перехода с Tailwind и Bootstrap
- **Copy-paste examples** для быстрых стартов и внедрения в проекты
- **Starter catalog** с официальными шаблонами и smoke-проверкой

## Key sections

- [Docs platform](docs-platform.md)
- [Live playground](live-playground.md)
- [Copy-paste examples](copy-paste-examples.md)
- [Utility lookup](utilities/lookup.md)
- [Component anatomy](components/anatomy.md)
- [Accessibility notes](components/accessibility-notes.md)
- [Token and theme explorer](themes/token-theme-explorer.md)
- [Migration guides](migration/README.md)
- [Official starters](starters/README.md)

## Authoring model

GitBook является source of truth для структуры разделов и навигации. Для локальной проверки репозиторий также умеет делать lightweight static export в `.gitbook/dist`, чтобы CI мог проверить структуру, ссылки и готовность документации к публикации.
