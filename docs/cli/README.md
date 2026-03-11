# CLI

Use the CLI for local development, builds, and diagnostics.

## Common commands

```bash
rarog build
rarog build --debug
rarog analyze
rarog doctor
```

## When to use the CLI

Use the CLI when you want to:

* run local development flows
* build production output
* inspect config or runtime behavior

## See also

* [Config](../config/README.md)
* [Build](../build/README.md)


## JIT diagnostics

- `rarog build --debug` — пишет debug JSON рядом с JIT output
- `rarog analyze` — показывает scan summary и unknown utility-like classes
- `rarog doctor` — быстро проверяет config/build/JIT surface
