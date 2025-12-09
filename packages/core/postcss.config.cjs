// postcss.config.cjs — конфигурация PostCSS для проекта Rarog
// Автор: TheSkiF4er
// Описание: полная и гибкая конфигурация PostCSS, готовая для сборки в production и
// development. Поддерживает импорт файлов, вложенные правила, CSS-переменные (tokens),
// современные возможности через postcss-preset-env, автопрефиксер, минификацию и оптимизации.

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // Плагин-порядок важен: сначала импорт, затем трансформации, затем оптимизации
  plugins: {
    // Импортирует @import правила (объединяет файлы в один bundle)
    'postcss-import': {},

    // Небольшие фиксапы для известных багов с flexbox в старых браузерах
    'postcss-flexbugs-fixes': {},

    // Позволяет использовать вложенные селекторы (как в Sass)
    'postcss-nested': {},

    // Обработка CSS custom properties (переменных).
    // preserve: true — оставляет переменные в итоговом CSS (рекомендуется для темизации через runtime)
    // В production можно выбрать preserve:false если вы генерируете конкретные значения в build step
    'postcss-custom-properties': {
      preserve: true
    },

    // postcss-preset-env — включает автопрефиксы, современный синтаксис CSS и stage-опции.
    // Конфигурируем так, чтобы поддерживать широкую совместимость, а также enable features we use
    'postcss-preset-env': {
      stage: 3, // разумный компромисс: стабилизированные и близкие к стандарту возможности
      autoprefixer: { grid: true },
      features: {
        'nesting-rules': false, // используем postcss-nested вместо этого
        'custom-properties': false // выключен т.к. используем postcss-custom-properties для контроля
      },
      insertBefore: {},
      browsers: ['>0.2%', 'not dead', 'not op_mini all']
    },

    // Минификация и оптимизация CSS — включаем только в production
    ...(isProduction
      ? {
          cssnano: {
            preset: ['advanced', {
              autoprefixer: false, // автопрефиксер уже выполнен postcss-preset-env
              discardComments: { removeAll: true },
              normalizeWhitespace: false
            }]
          }
        }
      : {}),

    // Пример: плагин для добавления fallbacks (optional). Оставлен закомментированным — подключайте при необходимости
    // 'postcss-color-mod-function': {},

    // Плагин для логирования (удобен в dev). Отключён в production.
    ...(isProduction ? {} : { 'postcss-reporter': { clearReportedMessages: true } })
  }
};
