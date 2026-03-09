# CONTRIBUTING.md

Спасибо, что хотите внести вклад в Rarog.

Этот документ описывает **текущий фактический workflow репозитория**: какие команды запускать, какие проверки обязательны и как не сломать публичный контур.

---

## Быстрый старт

1. Fork репозиторий `https://github.com/TheSkiF4er/rarog`.
2. Клонируйте проект локально.
3. Установите зависимости:

   ```bash
   npm ci
   ```

4. Создайте ветку:

   ```bash
   git checkout -b fix/<short-name>
   ```

5. Перед PR прогоните:

   ```bash
   npm run build
   npm run test:unit
   npm run docs:check
   ```

---

## Что считается изменением публичного контура

Обновляйте документацию вместе с кодом, если вы меняете:
- CLI-команды или их аргументы;
- версии, релизные баннеры, пакетные метаданные;
- CSS entrypoints или имена выходных файлов;
- JS API или поддерживаемые компоненты;
- список реально поставляемых пакетов.

---

## PR checklist

В каждом PR желательно указать:
- что изменилось;
- почему это изменение нужно;
- как проверить;
- затрагивает ли оно docs, build, CLI, JS runtime или CSS output.

Если меняется поведение пользователя, добавьте или обновите тест.

---

## Коммиты

Рекомендуемый формат — Conventional Commits:
- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `build:`
- `ci:`
- `chore:`

Примеры:
- `fix(cli): wire validate command`
- `docs(readme): align quick start with shipped artifacts`
- `build(css): emit minified theme bundles`

---

## Сборка

Основная сборка проекта сейчас идёт через:

```bash
npm run build
```

Скрипт использует `tools/build.mjs` и генерирует CSS в `dist/` директории пакетов.

Если вы меняете CSS-слои, убедитесь, что сборка проходит без ошибок и что структура output не ломает существующие пути подключения.

---

## Тесты

Полезные команды:

```bash
npm run test:unit
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
```

Если меняете README или `docs-site/`, прогоняйте ещё и:

```bash
npm run docs:check
```

---

## Документация

Репозиторий уже проходил через несколько этапов расширения, поэтому особенно важно не оставлять в docs обещания о том, чего код не поставляет.

Хорошая практика:
- писать о том, что есть **в текущем состоянии репозитория**;
- явно помечать experimental и placeholder-пакеты;
- не ссылаться на `dist/` или пакеты, если они не создаются текущим build pipeline;
- обновлять `README.md`, `docs-site/getting-started.md` и `docs-site/javascript.md` вместе с релевантными изменениями.

---

## Релизы

Релизный процесс описан в `RELEASE.md`.

Если вы меняете version strings, package metadata или release surface, сначала прогоните:

```bash
npm run docs:check
```

И затем убедитесь, что обновлены все заметные пользовательские entrypoints.
