# Переключатель

On/off toggle with reduced-motion-safe track animation.

## Интерфейс CSS

- Основной селектор: `.switch`
- Точки привязки темизации: `--rarog-color-*`, `--rarog-radius-*`, `--rarog-shadow-*`, переменные контура фокуса
- Ограничение анимации соблюдается общими правилами набора компонентов

## Поведение с точки зрения доступности

- В первую очередь применяется семантическая разметка HTML
- Видимый контур `:focus-visible`
- Атрибуты ARIA там, где этого требует взаимодействие
- Исходные токены с безопасным уровнем контраста

## Пример

```html
<div class="card">
  <div class="card-header">Switch</div>
  <div class="card-body">См. пример набора компонентов в `stories/components/PackV1.stories.js` и `tests/visual/fixtures/components-v1.html`.</div>
</div>
```

## Покрытие зрительными проверками

Проверяется файлом `tests/visual/fixtures/components-v1.html`.
