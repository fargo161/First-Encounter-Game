# AR0 R1 independent tester handoff

Review only AR0-D01 remediation against the exact R1 ZIP identified by the external manifest. Verify ZIP SHA-256/bytes, CRC, safe unique regular member names, each member hash, source identity, unchanged catalog and M3 build. Start with START_HERE_AR0_R1.md. Original AR0 and accepted R3 artifacts are historical baselines, not substitutes for R1.

Source revision: `AR0-projection-v1-R1-D01`. Source SHA-256: `8dd542efed9f74573bcb1913d367f7c791d63c3830d65b7f35f68abdcb92f09c` (112 enumerated inputs).

Preserved M3 runnable build SHA-256: `8e1c14e25a515b92188703927344e97b744921ec9b033ee2b1d8cc0b63f517cb`. Catalog SHA-256: `21a0747936c3e8e7e9cf33833348ff6eb7b07a183179ce1e21181d618c854c5b`. Sealed content remains package_0003 revision 1, digest `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f`.

## Rerun

Use a disposable extraction or clone for tests which generate outputs.

```powershell
node --test --test-reporter=tap tests/ar0-d01.test.mjs
node --test --test-reporter=tap scripts/run-independent-ar0.mjs
python scripts/check-ar0-r1.py
node scripts/generate-ar0-r1-evidence.mjs
python scripts/preserve-ar0-r1.py
```

Full gates intentionally require the accepted unchanged IR3-25 failure and no other independent R3 failure. Do not alter, skip or reclassify its assertion. R1 current identity is evidence/ar0-r1/source-identity.json. The old evidence/ar0 identity and reports are preserved as historical data.

To execute independent test files without the adapter, make a review folder, place their unchanged sources from independent/ar0-review/ at its root, extract this R1 ZIP into checkpoint/, and copy independent/ar0-review/evidence/ui-warned.json into evidence/. Run both independent-ar0*.test.mjs there. The exact conflicting catalog is independent/ar0-review/evidence/alias-trust-catalog.json. The CLI below must exit 1 with CONFLICTING_ACTOR_CARD_BINDING and create no output artifacts:

```powershell
node scripts/atlas-export.mjs independent/ar0-review/evidence/ui-warned.json UNUSED_PREFIX player independent/ar0-review/evidence/alias-trust-catalog.json
```

Test canonical actor-pair aliases, alias-only Persons, missing/duplicate actor cards, alternate labels/card IDs and valid owner-topic/non-actor aliases. Confirm private local records and attributed reports retain their canonical actor. Reproduce original before behavior only with the historical AR0 ZIP. Compare original unchanged proof exports with proofs/ar0-r1/preserved-ar0/. Inspect fresh UI saves, raw inspectors, geometry and screenshots under evidence/ar0-r1/browser/. Proofs are JSON/Markdown/network exports, not Atlas UI.

For fresh browser replay, use the unchanged dist-m3/index.html or `python scripts/serve-ar0-r1.py` for a local CSS-only rendering-fault host. Normal/collapse routes use unchanged executable bytes. Stop only the server started for your review. No external service or credentials are needed. The builder's server and tab were closed.

Exact production change: evidence/ar0-r1/production.diff. Full original-member preservation: evidence/ar0-r1/preservation.json. Before/after API/CLI diagnostics and unchanged independent test sources are included. Independently test normal projections/privacy, IDs/scenario membership/Event identity/recent changes and preserved M3 behavior. Stop at AR0 R1. Do not implement Atlas v0.1/UI or M4.
