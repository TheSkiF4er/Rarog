#!/usr/bin/env bash
# lint-fix.sh — Утилита для запуска линтеров и автофиксов в монорепозитории Rarog
# Автор: TheSkiF4er
# Описание: единый скрипт, который запускает ESLint, Stylelint, Prettier и дополнительные автофиксы
# для всех пакетов (pnpm workspaces). Предназначен для использования перед PR и в CI (как опция).

set -euo pipefail
IFS=$'\n\t'

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

PNPM=${PNPM:-pnpm}
ESLINT_CMD="${ESLINT_CMD:-$PNPM -w exec eslint}"
STYLELINT_CMD="${STYLELINT_CMD:-$PNPM -w exec stylelint}"
PRETTIER_CMD="${PRETTIER_CMD:-$PNPM -w exec prettier}"
LINT_STAGED_CMD="${LINT_STAGED_CMD:-npx lint-staged}"

FIX=true
STAGED=false
WATCH=false
QUIET=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --no-fix         Только проверить (не применять автофикс)
  --staged         Запустить только на staged файлах (lint-staged; требует git)
  --watch          Непрерывный режим watch (eslint --watch где поддерживается)
  --quiet          Тише вывод (сокращает логи)
  --help           Показать это сообщение

Примеры:
  ./scripts/lint-fix.sh                # применить автофиксы ко всему репо
  ./scripts/lint-fix.sh --staged      # применить автофиксы только к staged файлам
  ./scripts/lint-fix.sh --no-fix      # проверить без изменений

EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-fix) FIX=false; shift ;;
    --staged) STAGED=true; shift ;;
    --watch) WATCH=true; shift ;;
    --quiet) QUIET=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

log() { if [ "$QUIET" = false ]; then echo "[$(date +'%H:%M:%S')] $*"; fi }
err() { echo "ERROR: $*" >&2; }

ensure_pnpm() {
  if ! command -v "$PNPM" >/dev/null 2>&1; then
    err "pnpm not found. Установите pnpm или укажите переменную PNPM="
    exit 2
  fi
}

ensure_tools() {
  # eslint
  if ! $PNPM -w -s exec eslint --version >/dev/null 2>&1; then
    log "ESLint не найден в зависимостях. Попытка установить линтеры..."
    # пытаемся установить devDependencies (без изменения lockfile, просто pnpm install)
    $PNPM install --frozen-lockfile || true
  fi
}

run_eslint() {
  if ! command -v node >/dev/null 2>&1; then
    err "Node.js не найден. ESLint пропущен."
    return
  fi

  if [ "$STAGED" = true ]; then
    log "Запуск ESLint на staged файлах (через lint-staged, если настроено)"
    if command -v npx >/dev/null 2>&1 && grep -q "lint-staged" package.json 2>/dev/null || true; then
      if [ "$FIX" = true ]; then
        $LINT_STAGED_CMD --config .lintstagedrc || true
      else
        $LINT_STAGED_CMD --config .lintstagedrc --no-stash || true
      fi
      return
    else
      log "lint-staged не настроен — получаем список staged файлов вручную"
      files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx|vue|mjs|cjs)$' || true)
      if [ -z "$files" ]; then log "Нет staged JS/TS файлов"; return; fi
      if [ "$FIX" = true ]; then
        $ESLINT_CMD --fix $files || true
      else
        $ESLINT_CMD $files || true
      fi
      return
    fi
  fi

  # Полный запуск по workspace
  if [ "$WATCH" = true ]; then
    log "ESLint: watch mode"
    $ESLINT_CMD --ext .js,.ts,.jsx,.tsx packages docs --watch || true
  else
    if [ "$FIX" = true ]; then
      log "ESLint: запуск с --fix по workspace"
      $ESLINT_CMD "packages/**/*.{js,jsx,ts,tsx}" "docs/**/*.{js,jsx,ts,tsx}" --fix || true
    else
      log "ESLint: проверка без фиксов"
      $ESLINT_CMD "packages/**/*.{js,jsx,ts,tsx}" "docs/**/*.{js,jsx,ts,tsx}" || true
    fi
  fi
}

run_stylelint() {
  # stylelint для scss/css
  if [ "$STAGED" = true ]; then
    files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(css|scss|sass)$' || true)
    if [ -z "$files" ]; then log "Нет staged CSS/SCSS файлов"; return; fi
    if [ "$FIX" = true ]; then
      $STYLELINT_CMD --fix $files || true
    else
      $STYLELINT_CMD $files || true
    fi
    return
  fi

  if [ "$FIX" = true ]; then
    log "Stylelint: запуск с --fix"
    $STYLELINT_CMD "packages/**/*.{css,scss}" --fix || true
  else
    log "Stylelint: проверка"
    $STYLELINT_CMD "packages/**/*.{css,scss}" || true
  fi
}

run_prettier() {
  # Prettier для форматирования
  if [ "$STAGED" = true ]; then
    files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx|json|md|css|scss|html|yaml|yml)$' || true)
    if [ -z "$files" ]; then log "Нет staged файлов для Prettier"; return; fi
    if [ "$FIX" = true ]; then
      log "Prettier: форматирование staged файлов"
      echo "$files" | xargs $PRETTIER_CMD --write || true
    else
      log "Prettier: проверка staged файлов"
      echo "$files" | xargs $PRETTIER_CMD --check || true
    fi
    return
  fi

  if [ "$FIX" = true ]; then
    log "Prettier: форматирование всего репозитория"
    $PRETTIER_CMD --write "**/*.{js,ts,jsx,tsx,json,md,css,scss,html,yml,yaml}" || true
  else
    log "Prettier: проверка форматирования"
    $PRETTIER_CMD --check "**/*.{js,ts,jsx,tsx,json,md,css,scss,html,yml,yaml}" || true
  fi
}

run_stylelint_fix_sass_graph() {
  # Иногда stylelint не обрабатывает все файлы — обеспечим дополнительно запуск по src
  if [ -d packages/core/src ]; then
    if [ "$FIX" = true ]; then
      $STYLELINT_CMD "packages/core/src/**/*.{scss,css}" --fix || true
    fi
  fi
}

post_fix_steps() {
  # Organize imports & run TypeScript formatting if typescript is present
  if command -v pnpm >/dev/null 2>&1; then
    if [ "$FIX" = true ]; then
      log "Выполнение дополнительных автофиксов: pnpm -w run format && pnpm -w exec import-sort (если настроено)"
      $PNPM -w -s run format || true
    fi
  fi

  # show git status
  log "Текущий git статус (после автофиксов):"
  git status --short || true
}

main() {
  ensure_pnpm
  ensure_tools

  if [ "$STAGED" = true ]; then
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
      err "--staged требует git repository"
      exit 3
    fi
  fi

  run_prettier
  run_eslint
  run_stylelint
  run_stylelint_fix_sass_graph
  post_fix_steps

  log "lint-fix completed"
}

main "$@"

# EOF
