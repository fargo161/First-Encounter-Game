# Subsystem packages

Run checks from the repository root with Python 3.12.x and Node 24.x:

| Package | Root command | Preserved state |
| --- | --- | --- |
| encounter-atlas | python -B tools/repo.py encounter-atlas | Accepted A1; actual IR3-25 known failure |
| room-creator | python -B tools/repo.py room-creator | HOLD_FOR_FURTHER_REMEDIATION |
| zant/C001_ZANT_GATE_A_R5 | python -B tools/repo.py zant | Gate A incomplete; accepted neutral separate from failed/provisional pilots |

See [development guide](../DEVELOPMENT.md) for outputs, dependencies and platform limits. All builds/tests run in disposable copies; historical package READMEs/scripts remain exact imported bytes.

Stage 10 keeps A1 at 2460 files with required inputs. Room Creator retains 384 files; ZANT retains its strict 166-file packet. Stop before Stage 12.
