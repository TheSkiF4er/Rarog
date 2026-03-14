# Рекомендации для production

## Рекомендуемый путь внедрения

1. Начните с ближайшего стартовый шаблон'а.
2. Зафиксируйте semantic tokens и naming policy.
3. Используйте конструктор тем для brand review и accessibility review.
4. Подключите `rarog doctor`, `rarog audit a11y`, `rarog audit bundle` в CI.
5. Для релизов используйте контрольные пороги качества и проверку экспортируемой поверхности.

## Для многотемный SaaS

- храните tenant themes как versioned manifests;
- проверяйте различие тем перед релизом;
- ограничьте brand overrides токенами, а не ad-hoc CSS.

## Для под стороннюю марку B2B

- держите базовый уровень corporate theme и customer overlays;
- используйте режим сравнения для sign-off;
- готовьте import/export flow как часть customer onboarding.

## Для внутренних дашбордов

- используйте dense defaults;
- заранее проверяйте accessibility контрастов;
- собирайте Компонент scaffolds вместо ручных вариаций.
