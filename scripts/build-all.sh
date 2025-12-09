#!/usr/bin/env bash
# build-all.sh — универсальный скрипт сборки для монорепозитория Rarog
# Автор: TheSkiF4er
# Описание: собирает все пакеты, документацию и (опционально) образ Docker, подготовливая артефакты для релиза.

set -euo pipefail
IFS=$'\n\t'

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

# Конфигурация по умолчанию
SKIP_TESTS=false
SKIP_DOCS=false
SKIP_DOCKER=false
CLEAN=false
PNPM_CMD=${PNPM_CMD:-pnpm}
PARALLEL=${PARALLEL:-true}
BUILD_DIR=${BUILD_DIR:-$ROOT_DIR/build-artifacts}
LOG_FILE=${LOG_FILE:-$ROOT_DIR/build.log}

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --skip-tests        Пропустить тесты
  --skip-docs         Пропустить сборку документации
  --skip-docker       Пропустить сборку Docker образа
  --clean             Удалить сборки и кэши перед сборкой
  --pnpm <cmd>        Явно указать команду pnpm (по умолчанию: pnpm)
  --no-parallel       Отключить параллельную сборку (turbo/pnpm)
  --help              Показать это сообщение

Примеры:
  ./scripts/build-all.sh                # обычная сборка
  ./scripts/build-all.sh --skip-docs    # сборка пакетов, без docs
  SKIP_DOCKER=true ./scripts/build-all.sh  # через env

EOF
}

# Разбор аргументов
while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-tests) SKIP_TESTS=true; shift ;;
    --skip-docs) SKIP_DOCS=true; shift ;;
    --skip-docker) SKIP_DOCKER=true; shift ;;
    --clean) CLEAN=true; shift ;;
    --pnpm) PNPM_CMD="$2"; shift 2 ;;
    --no-parallel) PARALLEL=false; shift ;;
    --help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

log() {
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $*" | tee -a "$LOG_FILE"
}

ensure_pnpm() {
  if ! command -v "$PNPM_CMD" >/dev/null 2>&1; then
    log "ERROR: pnpm not found. Установите pnpm или передайте --pnpm <cmd>"
    exit 2
  fi
}

clean() {
  log "Cleaning build artifacts and caches..."
  rm -rf "$BUILD_DIR"
  rm -rf packages/*/dist
  rm -rf docs/.docusaurus
  rm -rf node_modules
  rm -rf pnpm-lock.yaml
  log "Clean finished"
}

prepare() {
  log "Prepare: ensure pnpm and install deps"
  ensure_pnpm
  log "Installing dependencies (frozen lockfile)..."
  $PNPM_CMD install --frozen-lockfile
}

build_packages() {
  log "Start building packages"
  mkdir -p "$BUILD_DIR"

  # Если в монорепо используется turbo/pnpm workspaces - делаем глобальную команду
  if $PARALLEL && command -v turbo >/dev/null 2>&1; then
    log "Using turbo to run build tasks in parallel"
    $PNPM_CMD -w run build
  elif $PARALLEL; then
    log "Using pnpm -w run build (parallel where possible)"
    $PNPM_CMD -w run build
  else
    log "Sequential build: проход по пакетам"
    for pkg in packages/*; do
      if [ -f "$pkg/package.json" ]; then
        log "Building package: $(basename "$pkg")"
        (cd "$pkg" && $PNPM_CMD run build)
      fi
    done
  fi

  # Собрать дист-артефакты
  log "Collecting build artifacts into $BUILD_DIR"
  find packages -maxdepth 2 -type d -name dist -print0 | while IFS= read -r -d '' d; do
    target="$BUILD_DIR/$(dirname "$d" | sed 's#packages/##')"
    mkdir -p "$target"
    cp -r "$d"/* "$target/" || true
  done
  log "Packages build complete"
}

run_tests() {
  if [ "$SKIP_TESTS" = true ]; then
    log "Tests skipped by flag"
    return
  fi
  log "Running tests (unit/integration)"
  set +e
  $PNPM_CMD -w run test || rc=$?
  set -e
  if [ "${rc:-0}" != "0" ]; then
    log "WARNING: some tests failed (exit code: $rc). Check logs for details"
  else
    log "All tests passed"
  fi
}

build_docs() {
  if [ "$SKIP_DOCS" = true ]; then
    log "Docs build skipped by flag"
    return
  fi
  if [ -d docs ]; then
    log "Building documentation site"
    (cd docs && $PNPM_CMD install --frozen-lockfile && $PNPM_CMD build)
    # Собрать output
    DOC_OUT=""
    for p in docs/.docusaurus/build docs/.vitepress/dist docs/.vuepress/dist docs/.output/public docs/dist; do
      if [ -d "$p" ]; then
        DOC_OUT="$p"
        break
      fi
    done
    if [ -n "$DOC_OUT" ]; then
      mkdir -p "$BUILD_DIR/docs"
      cp -r "$DOC_OUT"/* "$BUILD_DIR/docs/"
      log "Docs built and copied to $BUILD_DIR/docs"
    else
      log "Docs built, но не найден ожидаемый output. Проверьте конфигурацию документации"
    fi
  else
    log "No docs directory found — пропуск"
  fi
}

build_docker() {
  if [ "$SKIP_DOCKER" = true ]; then
    log "Docker build skipped by flag"
    return
  fi
  if [ -f Dockerfile ]; then
    if ! command -v docker >/dev/null 2>&1; then
      log "Docker не установлен — пропуск шага сборки образа"
      return
    fi
    IMAGE_NAME=${IMAGE_NAME:-rarog}
    TAG=${IMAGE_TAG:-$(git rev-parse --short HEAD)}
    FULL_TAG="$IMAGE_NAME:$TAG"
    log "Building Docker image $FULL_TAG"
    docker build -t "$FULL_TAG" .
    docker save "$FULL_TAG" -o "$BUILD_DIR/${IMAGE_NAME//[:/]-}-$TAG.tar" || true
    log "Docker image built and exported to $BUILD_DIR"
  else
    log "Dockerfile не найден — пропуск сборки образа"
  fi
}

post_build() {
  log "Post-build: permissions and summary"
  chmod -R a+r "$BUILD_DIR" || true
  du -sh "$BUILD_DIR" || true
  log "Build artifacts are in: $BUILD_DIR"
  log "Build log: $LOG_FILE"
}

# Main
if [ "$CLEAN" = true ]; then
  clean
fi

# Ensure log file
mkdir -p "$(dirname "$LOG_FILE")"
: > "$LOG_FILE"

log "Rarog build started"
prepare
build_packages
run_tests
build_docs
build_docker
post_build
log "Rarog build finished successfully"

exit 0
