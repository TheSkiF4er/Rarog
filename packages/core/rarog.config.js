/*
  rarog.config.js — Конфигурация темы и сборки для Rarog (packages/core)
  Автор: TheSkiF4er
  Лицензия: Apache-2.0

  Это наиболее полный и удобный конфиг для генератора тем и утилит Rarog.
  Содержит: Dual Token Grid (Force + Skin), настройки сборки CSS, пресеты плотности,
  варианты тем (light/dark), параметры генерации CSS-переменных и метаданные пакета.

  Формат:
    module.exports = { ... }

  Примечание: значения цветов заданы как "R G B" (подход удобен для использования: rgb(var(--name))).
*/

module.exports = {
  meta: {
    name: 'rarog-core',
    displayName: 'Rarog — Core Theme',
    version: '0.1.0',
    author: 'TheSkiF4er',
    license: 'Apache-2.0',
    repository: 'https://github.com/TheSkiF4er/rarog',
    description: 'Ядро токенов и базовые стили Rarog (Dual Token Grid).'
  },

  // ---------------------------
  // Dual Token Grid
  // ---------------------------
  // Force tokens — описывают характер/поведение UI (плотность, импульс, масса и т.д.)
  force: {
    // Плотность интерфейса (semantic levels)
    density: {
      'dens-1': { label: 'airy', value: 0.6 },
      'dens-2': { label: 'loose', value: 0.85 },
      'dens-3': { label: 'normal', value: 1 },
      'dens-4': { label: 'compact', value: 1.15 },
      'dens-5': { label: 'dense', value: 1.3 }
    },

    // Импульс — влияет на скорость анимаций
    impulse: {
      'imp-1': 0.6,
      'imp-2': 0.85,
      'imp-3': 1,
      'imp-4': 1.15,
      'imp-5': 1.4
    },

    // Масса / упругость
    mass: {
      light: 0.6,
      regular: 1,
      heavy: 1.4
    },

    // Напряжение — влияет на кривые анимации
    tension: {
      soft: 0.6,
      regular: 1,
      hard: 1.28
    }
  },

  // Skin tokens — визуальная оболочка (цвета, глубина, свечение, текстуры)
  skin: {
    colors: {
      primary: '30 120 255',
      secondary: '96 132 255',
      success: '16 185 129',
      danger: '220 38 38',
      warning: '245 158 11',

      // surface / on-surface
      surface: '255 255 255',
      'on-surface': '18 18 20',
      'muted-surface': '250 250 252',
      'on-muted': '34 34 34'
    },

    // depth — относительная интенсивность теней
    depth: {
      1: 0.04,
      2: 0.06,
      3: 0.08
    },

    // glow — подсветка
    glow: {
      0: 0,
      1: 0.08,
      2: 0.14,
      3: 0.22
    },

    // texture — небольшие наложения
    tex: {
      1: 0.02,
      2: 0.04
    },

    // radius scale
    radius: {
      xs: '6px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      pill: '9999px'
    },

    // spacing baseline (semantic)
    spacing: {
      s0: '0px',
      s1: '4px',
      s2: '8px',
      s3: '12px',
      s4: '16px',
      s5: '20px',
      s6: '24px',
      s7: '32px'
    }
  },

  // ---------------------------
  // Темы: light и dark + возможность добавлять свои
  // ---------------------------
  themes: {
    light: {
      meta: { name: 'light', label: 'Светлая' },
      overrides: {
        // цветовые алиасы — храним в "R G B"
        '--tone-primary': '30 120 255',
        '--tone-secondary': '96 132 255',
        '--tone-success': '16 185 129',
        '--tone-danger': '220 38 38',

        '--tone-surface': '255 255 255',
        '--tone-on-surface': '18 18 20',
        '--tone-backdrop': '10 12 16'
      }
    },

    dark: {
      meta: { name: 'dark', label: 'Тёмная' },
      overrides: {
        '--tone-primary': '100 160 255',
        '--tone-secondary': '140 160 255',
        '--tone-success': '72 220 150',
        '--tone-danger': '255 86 86',

        '--tone-surface': '18 18 20',
        '--tone-on-surface': '235 238 240',
        '--tone-backdrop': '4 6 10'
      }
    }
  },

  // ---------------------------
  // Компонентные пресеты — семантические alias для компонентов
  // ---------------------------
  components: {
    btn: {
      variants: {
        primary: { tone: 'primary', depth: 2, glow: 2 },
        secondary: { tone: 'secondary', depth: 1, glow: 1 },
        ghost: { tone: 'primary', depth: 0, glow: 0 },
        danger: { tone: 'danger', depth: 1, glow: 0 }
      },
      sizes: {
        xs: { padding: ['s1', 's2'], fontSize: '0.75rem', minHeight: 28 },
        sm: { padding: ['s1', 's3'], fontSize: '0.85rem', minHeight: 32 },
        md: { padding: ['s2', 's4'], fontSize: '0.95rem', minHeight: 36 },
        lg: { padding: ['s3', 's5'], fontSize: '1.05rem', minHeight: 44 }
      },
      defaults: { variant: 'primary', size: 'md', density: 'dens-3' }
    },

    modal: {
      sizes: { sm: 420, md: 640, lg: 900, full: '100%' },
      defaults: { size: 'md', closeOnEsc: true, closeOnBackdrop: true, preventScroll: true }
    },

    card: {
      defaults: { elevation: 1, radius: 'md', density: 'dens-3' },
      variants: { ghost: { bg: 'muted-surface' }, neutral: { bg: 'surface' } }
    }
  },

  // ---------------------------
  // Генерация CSS / build опции
  // ---------------------------
  build: {
    // куда генерировать файлы для пакета core
    outDir: 'packages/core/dist',

    // имя файла сгенерированных CSS-переменных (подключать после core CSS)
    themeCssFile: 'rarog.theme.css',

    // опции генератора токенов
    tokens: {
      // true: сохранять значения как CSS custom properties в формате R G B (строки)
      emitRgbStrings: true,
      // преобразовывать радиусы/spacing в px/units
      emitUnits: true,
      // include comments with source mapping
      includeComments: true
    },

    // доп. артефакты
    artifacts: {
      themeJson: 'rarog.theme.json',
      changelogTemplate: 'CHANGELOG.md'
    }
  },

  // ---------------------------
  // Presets / quick profiles
  // ---------------------------
  presets: {
    airy: { density: 'dens-1', impulse: 'imp-2' },
    cozy: { density: 'dens-3', impulse: 'imp-3' },
    compact: { density: 'dens-4', impulse: 'imp-4' }
  },

  // ---------------------------
  // CLI: генерация и watch (используется scripts/generate-theme.js)
  // ---------------------------
  cli: {
    defaultConfig: 'rarog.config.js',
    watch: { enabled: true, debounce: 220 },
    prettyJson: true
  },

  // ---------------------------
  // Metadata для docs / badges
  // ---------------------------
  docs: {
    title: 'Rarog — Core',
    description: 'Токены и базовые стили Rarog. Dual Token Grid: Force + Skin.',
    logo: { text: 'Rarog', svg: null }
  },

  // ---------------------------
  // Security / contributors
  // ---------------------------
  security: {
    contact: 'security@rarog.example',
    policy: 'Please use responsible disclosure. See SECURITY.md in the repo.'
  },

  // ---------------------------
  // Helper functions (runtime used by generator). Не обязательны и могут быть переопределены.
  // ---------------------------
  _helpers: {
    // map token name to CSS variable name
    cssVarName: (name) => `--${name}`,

    // convert rgb triple to CSS-friendly string (e.g. [30,120,255] -> '30 120 255')
    rgbString: (arr) => Array.isArray(arr) ? arr.join(' ') : String(arr)
  }
};
