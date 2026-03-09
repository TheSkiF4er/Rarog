# Showcase & UI Kits

Rarog 3.0.0 включает готовые UI‑наборы и шаблоны, которые можно использовать
как витрину и стартовую точку для проектов.

## Rarog UI Admin

Полноценный пример admin‑dashboard:

- sidebar + navbar;
- KPI‑карточки;
- таблица с toolbar‑ом и пагинацией;
- формы, модалки, toasts.

Путь в репозитории:

```text
examples/ui-kits/admin-dashboard/index.html
```

Идеален как база для:

- внутренних админ‑панелей;
- панелей управления SaaS‑продуктом;
- админок в Cajeer‑экосистеме.

## Rarog Landing Kit

Набор секций для лендингов:

- hero + CTA;
- features;
- pricing (мини‑блок и полноценная секция);
- блог + FAQ;
- финальный CTA‑блок.

Путь:

```text
examples/ui-kits/landing-kit/index.html
```

Можно использовать как:

- standalone‑лендинг;
- основу для маркетинговых страниц;
- шаблон для лендингов внутри Cajeer‑проектов.

## Rarog SaaS Starter

Мини‑пример SaaS‑приложения:

- `auth.html` — вход/регистрация;
- `dashboard.html` — usage‑статистика, активность, onboarding checklist;
- `settings.html` — профиль, безопасность и блок Billing & Usage.

Путь:

```text
examples/ui-kits/saas-starter/
```

Рекомендуемый сценарий:

- берёшь нужный layout;
- переносишь в Laravel/React/Next.js;
- подключаешь Rarog (JIT/CLI) и начинаешь заменять демо‑данные на реальные.

## Связка с Guides

UI‑киты и Starter интегрируются с существующими гайдами:

- в **Laravel Guide** можно использовать `saas-starter` как основу Blade‑layout’ов;
- в **React/Next.js Guide** — как примеры страниц/route’ов;
- в **Cajeer Stack Guide** — как референс‑layout для админок и лендингов.

Скриншоты и «живые» демо для этих наборов можно вынести на отдельный
`docs.cajeer.ru/rarog/showcase` или похожий раздел.
