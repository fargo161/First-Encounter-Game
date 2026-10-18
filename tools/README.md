# Repository verification tools

Use python -B tools/repo.py with doctor, integrity, encounter-atlas, room-creator, zant or all. See [development guide](../DEVELOPMENT.md).

repo.py locates tooling/packages, reports optional dependencies and runs unchanged package checks in retained disposable copies. repository_integrity.py verifies current exact package membership/hashes, Stage 10 removal/reconstruction bindings, dependencies, locked evidence and statuses using frozen Stage 10 hash helpers.

verify_stage10_cleanup.py remains byte-identical with its Stage 10 pointer assertion; replay its full CLI at Stage 10. Earlier verifiers likewise belong to recorded historical states. Current orchestration does not rewrite them or require original machine paths. External archive replay is optional and separate from normal setup/CI.
