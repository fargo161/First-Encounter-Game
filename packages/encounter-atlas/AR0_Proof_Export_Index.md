# Atlas-readiness proof export index

These are deterministic read-only snapshots, not Atlas UI. Each stem under `proofs/ar0/` has `-author.json`, `-author.md`, `-author-network.json` and matching `-player` files. Both renderers consume exactly the same normalized links.

Start with `ui-initial-player.md` to see the information boundary, then compare `ui-warned-author.md` / `ui-warned-player.md` and `ui-recovery-author.md` / `ui-recovery-player.md`. Initial author state includes legitimate hidden truth; initial player data does not reveal the storage answer or private NPC state. Recovery proof shows Nera owns the case, the collector holds it, zero payment, and the completed handover's actual committed cause. The warning remains, record correction is separate, and post-recovery outcome is unchanged.

Last Collection's static catalog has four People, four semantic Places, eight Things, two historical Events and one Scenario. There are zero scenario Groups; neutral tests prove generic Group/global/shared-scenario support. Actual meaningful runtime Events are derived from the saved journals.

| Source UI save | Revision | Author / player cards | Author / player Events | Author / player recent changes |
|---|---:|---:|---:|---:|
| ui-acknowledged.json | 19 | 44 / 44 | 27 / 27 | 33 / 26 |
| ui-ancestor.json | 12 | 36 / 34 | 19 / 19 | 13 / 13 |
| ui-collapse.json | 12 | 36 / 34 | 19 / 19 | 13 / 13 |
| ui-horizontal.json | 12 | 36 / 34 | 19 / 19 | 13 / 13 |
| ui-initial.json | 0 | 19 / 11 | 2 / 1 | 0 / 0 |
| ui-missing.json | 12 | 36 / 34 | 19 / 19 | 13 / 13 |
| ui-normal-loaded.json | 12 | 37 / 35 | 20 / 20 | 14 / 14 |
| ui-normal.json | 12 | 37 / 35 | 20 / 20 | 14 / 14 |
| ui-opacity.json | 12 | 36 / 34 | 19 / 19 | 13 / 13 |
| ui-opened.json | 2 | 22 / 16 | 5 / 4 | 3 / 3 |
| ui-pending.json | 18 | 42 / 42 | 25 / 25 | 33 / 26 |
| ui-post-recovery.json | 21 | 47 / 47 | 30 / 30 | 38 / 31 |
| ui-recovery.json | 20 | 45 / 45 | 28 / 28 | 36 / 29 |
| ui-repair-continuity.json | 16 | 38 / 36 | 21 / 21 | 13 / 13 |
| ui-repaired-loaded.json | 17 | 40 / 38 | 23 / 23 | 17 / 17 |
| ui-repaired.json | 17 | 40 / 38 | 23 / 23 | 17 / 17 |
| ui-replayed.json | 21 | 47 / 47 | 30 / 30 | 38 / 31 |
| ui-warned.json | 11 | 34 / 32 | 17 / 17 | 13 / 13 |

Every one of these 18 actual UI exports was replay-validated, every journal command exactly retried, and both audience projections compared across save/load and repeated reads. Three actual raw inspector exports match their reconstructed traces. Proofs expose no protected contact values to the player. See `evidence/ar0/generated-evidence-summary.json` for exact input hashes and counts.
