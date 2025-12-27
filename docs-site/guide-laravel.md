# Laravel Guide

Этот гайд показывает, как интегрировать Rarog в Laravel‑проект. В репозитории
есть черновой starter:

- `examples/starters/laravel`

## 1. Установка

В уже существующем Laravel‑приложении:

```bash
npm install rarog-css --save-dev
```

(Если ты используешь монорепу с самим Rarog, можно линковать пакет локально.)

## 2. Конфигурация Rarog

Создай `rarog.config.js` в корне Laravel‑проекта (не в монорепе):

```js
/** @type {import('rarog-css/rarog.config.types').RarogConfig} */
module.exports = {
  mode: "jit",
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.{js,jsx,ts,tsx,vue}"
  ],
  theme: {
    // по желанию — переопределить цвета/spacing под бренд проекта
  }
};
```

## 3. Сборка CSS

В `package.json` Laravel‑проекта:

```json
{
  "scripts": {
    "rarog:build": "rarog build",
    "dev": "npm run rarog:build && vite",
    "build": "npm run rarog:build && vite build"
  }
}
```

После этого:

```bash
npm run rarog:build
```

Rarog сгенерирует CSS (по умолчанию `dist/rarog.css` или `dist/rarog.jit.css`
в зависимости от режима).

## 4. Подключение в Blade

Подключи CSS в layout, который используется во всех Blade‑шаблонах:

```blade
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>@yield('title', 'Laravel + Rarog')</title>
    @vite('resources/js/app.js')
    <link rel="stylesheet" href="{{ mix('dist/rarog.jit.css') }}">
  </head>
  <body class="bg-slate-50">
    <div class="rg-container-lg py-6">
      @yield('content')
    </div>
  </body>
</html>
```

(В зависимости от сборки можно использовать `@vite`, `mix()` или статический путь.)

## 5. Использование классов Rarog

Пример Blade‑шаблона:

```blade
@extends('layouts.app')

@section('title', 'Rarog Dashboard')

@section('content')
  <div class="card p-6">
    <h1 class="text-2xl font-semibold mb-4">Laravel + Rarog</h1>
    <p class="text-muted mb-4">
      Это пример admin‑экрана на Blade c утилитами и компонентами Rarog.
    </p>
    <a href="{{ route('projects.create') }}" class="btn btn-primary">
      Новый проект
    </a>
  </div>
@endsection
```

## 6. Отладка JIT

Если какие‑то классы «пропадают» в сборке:

1. Проверь `content` в `rarog.config.*` — охватывают ли они все Blade/JS файлы.
2. Убедись, что классы не строятся динамически строковой конкатенацией.
3. Для сложных случаев можно использовать функцию `clsx()` — JIT умеет её разбирать.

Для более подробной информации см. разделы:

- [Integration Guides](/integration-guides)
- [Variants & JIT](/variants-jit)
