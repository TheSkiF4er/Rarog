# Рекомендации для production

## Рекомендуемый путь внедрения

1. Начните с ближайшего starter'а.
2. Зафиксируйте semantic tokens и naming policy.
3. Используйте theme builder для brand review и accessibility review.
4. Подключите `rarog doctor`, `rarog audit a11y`, `rarog audit bundle` в CI.
5. Для релизов используйте quality gates и проверку экспортируемой поверхности.

## Для multi-theme SaaS

- храните tenant themes как versioned manifests;
- проверяйте diff тем перед релизом;
- ограничьте brand overrides токенами, а не ad-hoc CSS.

## Для white-label B2B

- держите baseline corporate theme и customer overlays;
- используйте режим сравнения для sign-off;
- готовьте import/export flow как часть customer onboarding.

## Для внутренних дашбордов

- используйте dense defaults;
- заранее проверяйте accessibility контрастов;
- собирайте component scaffolds вместо ручных вариаций.
