# AR0 R1 fresh test results

Source revision: `AR0-projection-v1-R1-D01`. Source SHA-256: `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c` (112 enumerated inputs).

Preserved M3 runnable build SHA-256: `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`. Catalog SHA-256: `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`. Sealed content remains package_0003 revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`.

M0 audit: seven passed, zero failed.

| Suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Builder M1/M2/M3/R1/R2/R3 + AR0 + D01 | 194 | 0 | 0 |
| Independent M1 | 22 | 0 | 0 |
| Independent M2 | 18 | 0 | 0 |
| Prior independent M3 | 18 | 0 | 0 |
| Original M3 D01 | 1 | 0 | 0 |
| Independent R1/D02 | 9 | 0 | 0 |
| Independent R2/D03 | 20 | 0 | 0 |
| Independent R3 (IR3-25 preserved) | 24 | 1 | 0 |
| Independent AR0 incl. original D01 reproducer | 22 | 0 | 0 |

328 overlapping suite passes, one accepted unchanged non-blocking IR3-25 failure, zero new blockers and zero skips. Counts are not unique semantic guarantees. Builder coverage includes the unchanged 47 AR0 tests and ten new focused D01 tests. Independent AR0 includes its original 21 checks plus unchanged IA0-22, now passing by safe rejection.

Fresh browser: 13 actual save exports, 12 grouped checks, three raw inspector comparisons and 26 author/player projections. Original 18 supplied saves regenerate 36 projections with all 108 export files byte-identical. All saves replay, all committed commands retry idempotently, and projections remain pure/deterministic across save/load.

Logs: evidence/ar0-r1/executed-commands.json; nested regression/ contains fresh inherited logs. Legacy helpers run in disposable clones because they regenerate historical evidence and identity labels. regression-source-binding.json binds all enumerated inputs to the current R1 source digest; legacy labels do not identify the R1 source.

The independent AR0 loader redirects only the source root and evidence output directory in memory; original test files and expectations remain byte-identical. The inherited independent R3 adapter redirects evidence output only, preserving the precise IR3-25 failure. All prior disclosed inherited adapters remain unchanged.
