# Pre-implementation plan

Recorded before coding in the builder conversation: issue v0.14.1 as a new candidate; leave original ZIP, baseline and canonical library unchanged.

1. F1: core lifecycle plus story/deletion UI; occupancy, forced deletion, collapse, remaining-floor support, undo/redo/reopen.
2. F2: setup mutation and import policy; rendered pose, footprints, world points and metadata through history/reopen.
3. F3: point pointer handling; correct height plane, tiny/raised/scaled/rotated/upper-story drags.
4. F4: route sight and shared footprint clipping; outside-corner/crossing/height/ellipse checks.
5. F5: inspector and renderer reference resolution; visible retained IDs, field repair/reset, custom metadata.
6. F6: explicit LF build, complete portable preservation/browser tests, exact byte/baseline hashes.
7. F7: asset loader and demo tooling diagnostics with bounded retries and injected failures.
8. Narrow additional coverage for the independently reproduced texture-cache reset failure.

Delivery: candidate, separate source/regressions/reports/checksums and independent tester handoff. No canonical promotion by the builder.
