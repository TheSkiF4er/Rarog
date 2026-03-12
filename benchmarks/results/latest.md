# Benchmark results

Generated: 2026-03-12T04:33:49.911Z

| framework | build ms | jit ms | output KB | runtime ms | theme switch ms | render overhead ms |
| rarog | 420 | 95 | 313.09 | 4.69 | 0.102 | 0.032 |
| bootstrap | 1320 | 1320 | 229 | 2.8 | 1.4 | 5.7 |
| tailwind | 1040 | 180 | 91 | 1.2 | 0.9 | 4.3 |
| unocss | 710 | 95 | 74 | 1.1 | 0.7 | 4.1 |
| shadcn-ui-stack | 1180 | 190 | 98 | 1.6 | 1.2 | 6.1 |
| chakra-ui | 1490 | 1490 | 164 | 3.4 | 2.3 | 7.8 |
| mui | 1710 | 1710 | 193 | 3.9 | 2.6 | 8.4 |

## Notes

- Rarog metrics are measured from this repo with the reproducible harness in `benchmarks/`.
- Non-Rarog frameworks are declared baselines from `benchmarks/scenarios/framework-baselines.json` until their checkout commands are wired into CI.
- Update baselines only together with scenario notes and optimization backlog.
