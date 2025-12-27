# Versioning & Support Policy for Rarog 3.x

Rarog follows SemVer (`MAJOR.MINOR.PATCH`) and clearly separates change types.

## 3.x branch

- **3.0.0** — API Freeze v3, first stable 3.x release;
- **3.1–3.4** — feature expansion (components, utilities, DX, design system);
- **3.5.0** — reliability, tests and ecosystem hardening.

Guarantees for 3.x:

- public CSS classes (utilities + components), JS API and Plugin API
  are considered stable across 3.x;
- minor 3.x releases may add features but should not break existing code
  without a strong reason;
- patch releases (3.5.1, 3.5.2, …) are used for bugfixes/security updates.

## Support

Planned support window for 3.x:

- **bugfix** updates — at least 12 months after 3.5.0;
- **security** updates — at least 18 months after 3.5.0 or
  until a stable 4.x branch is available (whichever is later).

For production projects it is recommended to pin major version (`^3.5.0`)
and update within 3.x regularly.

## 4.x (high-level)

A 4.x branch will only be justified by changes that cannot be introduced
into 3.x without breaking:

- major redesign of tokens/themes;
- removing legacy layers or reworking components;
- revisiting the plugin API.

Detailed 4.x plans will be published separately; until then 3.x is the
recommended stable branch.
