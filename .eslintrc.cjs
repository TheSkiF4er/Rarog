/**
 * .eslintrc.cjs — ESLint конфигурация для monorepo Rarog
 * Автор: TheSkiF4er
 * Цель: единый, строгий, но практичный набор правил для JS/TS/React/Node пакетов
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'sonarjs',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {}
    }
  },
  rules: {
    // Общие правила качества
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'warn',
    'no-duplicate-imports': 'error',
    'no-param-reassign': ['error', { props: false }],

    // Prettier
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'all' }],

    // Import rules
    'import/no-unresolved': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],

    // TypeScript specific
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // React
    'react/prop-types': 'off', // используем TypeScript для типов
    'react/react-in-jsx-scope': 'off', // не нужно в новых версиях React
    'react/jsx-uses-react': 'off',

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'warn',

    // SonarJS (code smells)
    'sonarjs/cognitive-complexity': ['warn', 20],

    // Дополнительные правила безопасности / надёжности
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name='log']",
        message: 'console.log запрещён в production-коде — используйте логгер или console.info/warn/error'
      }
    ]
  },

  overrides: [
    // Конфигурация для файлов TypeScript/TSX
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-ts-comment': 'warn'
      }
    },

    // Конфигурация для тестов
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx', '**/__tests__/**'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-unused-expressions': 'off'
      }
    },

    // Конфигурация для конфигов и скриптов Node (директории scripts/, infra/)
    {
      files: ['scripts/**', 'infra/**', 'packages/**/scripts/**', '*.cjs', '*.config.js'],
      env: { node: true },
      rules: {
        'no-console': 'off'
      }
    },

    // Lint для React/JSX файлов
    {
      files: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
      rules: {
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }]
      }
    }
  ],

  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    'packages/*/dist/',
    'docs/.docusaurus/',
    'docs/build/',
    '*.min.js'
  ]
};
