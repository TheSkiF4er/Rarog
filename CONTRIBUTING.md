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
   npm run docs:lint
   ```

   Если изменение затрагивает React/Vue adapters или их `dist`-контур, дополнительно прогоните `npm run test:adapters`.

   `npm run build` — каноническая полная сборка. Если вы меняли только CSS-слои, можно дополнительно использовать `npm run build:css` для более точечной локальной проверки.

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

Каноническая полная сборка проекта сейчас идёт через:

```bash
npm run build
```

Эта команда последовательно выполняет:
- `npm run build:css`
- `npm run build:js`
- `npm run build:adapters`

Если вы меняете только CSS-слои, можно локально прогонять и более узкую команду:

```bash
npm run build:css
```

Убедитесь, что структура output не ломает существующие пути подключения.

---

## Тесты

Полезные команды:

```bash
npm run test:unit
npm run test:adapters
npm run test:release
node packages/cli/bin/rarog.js --help
node packages/cli/bin/rarog.js validate
```

`npm run test:unit` проверяет source/runtime-контур JS core. `npm run test:adapters` сначала пересобирает `@rarog/js`, `@rarog/react` и `@rarog/vue`, а затем гоняет adapter dist-smoke, чтобы локально не получать ложнозелёный результат на устаревшем `dist`. `npm run test:release` — канонический релизный тестовый gate: он объединяет `test:unit`, `test:adapters` и `test:contracts`.

Если меняете README или `docs/`, прогоняйте ещё и:

```bash
npm run docs:lint
```

Полный `npm run docs:check` нужен, когда вы хотите локально подтвердить, что VitePress действительно собирается и output не пустой.

---

## Документация

Репозиторий уже проходил через несколько этапов расширения, поэтому особенно важно не оставлять в docs обещания о том, чего код не поставляет.

Хорошая практика:
- писать о том, что есть **в текущем состоянии репозитория**;
- явно помечать experimental и placeholder-пакеты;
- не ссылаться на `dist/` или пакеты, если они не создаются текущим build pipeline;
- обновлять `README.md`, `docs/getting-started.md` и `docs/javascript.md` вместе с релевантными изменениями.

---

## Релизы

Релизный процесс описан в `RELEASE.md`.

Если вы меняете version strings, package metadata или release surface, сначала прогоните:

```bash
npm run docs:lint
```

И затем убедитесь, что обновлены все заметные пользовательские entrypoints.


## Что обязательно для PR и что обязательно для релиза

Для обычного PR минимальный путь такой:
- `npm run build`
- `npm run test:unit`
- `npm run docs:lint`, если менялись README или `docs/`

Дополнительно запускайте `npm run test:adapters`, если затронуты adapters, adapter build или `dist`-артефакты.

Для релиза используйте единый вход:
- `npm run release:verify`
- `npm run build`
- `npm run test:release`
- `npm run verify:artifacts`
- `npm run pack:packages`
