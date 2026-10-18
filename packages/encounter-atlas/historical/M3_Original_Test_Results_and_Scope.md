# M3 fresh test results and review scope

READY FOR INDEPENDENT M3 REVIEW. No remaining functional blocker was found in executed coverage. This is builder readiness, not independent sign-off. Stop after M3.

## Exact tested identity

| Component | Identity |
| --- | --- |
| Source revision | `M3-runtime-v1` |
| Source digest, 47 executable/content/test/tool entries | `716a11c4efe9462e8ad60f16d6615ed8537811cf779d10dee424ef92558e3a94` |
| Content revision | `M3-protective-shortcut-v1` |
| Package | `package_0003`, revision 1 |
| Package digest | `2ce9f61b996f17392a39c56f4005d8203b7940aa4974564fafa54d110e35ae8f` |
| Browser build SHA-256 | `4fa1f60a1ec6a561375bdc38799693943b0910886d2f7ea838099d9303469e58` |
| Preserved M2 ZIP SHA-256 | `940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7` |

The sibling external identity records the final ZIP hash, length and every member hash. Including that hash inside this report would be circular. `evidence/m3/source-identity.json` precisely defines the source digest. Transcripts/traces bind these source/package identities and their actual run export hash.

## Fresh execution

Environment: Windows 11 build 26200, Node v24.18.0, npm 11.16.0, Python 3.12. Exact executables, bindings, arguments, stdout/stderr and exits are recorded in `evidence/m3/environment.json` and `executed-commands.json`.

| Suite | Fresh result | Evidence under evidence/m3 unless stated |
| --- | --- | --- |
| M0 baseline audit | 7 passed | `fresh-m0-audit.txt` |
| All builder tests | 112 passed: 64 inherited + 48 M3; 0 failed/skipped | `fresh-builder-tests.tap` |
| Unchanged independent M1 tests | 22 passed; 0 failed/skipped | `fresh-independent-m1.tap` |
| Unchanged independent M2 tests | 18 passed; 0 failed/skipped | `fresh-independent-m2.tap` |
| Actual browser UI | 18 distinct passed groups; 19 records including a B18 repeat | `browser-checks.json`, root `Browser_Test_Record.md` |
| Actual UI save exports | All 11 validate through complete journal replay | `generated-evidence-summary.json` |
| Raw UI inspector equality | Recovery/closure match reconstructed actual-input traces | Same summary; raw `browser-*-trace.json` |
| Save/load/read equality | Complete recorded comparisons pass | Same summary and browser exports |
| Missing displayed notice | Received/refused, service open, one technical defect | `missing-notice-run.json`, `missing-notice-trace.json` |
| Neutral renaming | Same core completes recovery and warned closure | `neutral-package.json`, `neutral-*-run.json`, `neutral-*-trace.json` |
| Preservation | 73 baseline members, 57 independent evidence entries verified; four shared kernel modules and inherited tests unchanged | `preservation.json` |

These are fresh executions, not historical totals. Independent suites remain unchanged and run against their original compatibility APIs. The 48 new M3 tests exercise the extended API and shared invariants; old unsupported-capability assertions do not define M3 behavior. Browser groups are integration checks, not a new independent suite. External frozen-extraction verification repeats these checks without inflating distinct counts.

## Requested LC mapping

All M3 references are in `tests/m3.test.mjs`. Coverage is the authorized Seed A portion of each target.

| Target | Tests/evidence |
| --- | --- |
| LC-T17 specific restriction | M3-10; browser B09 |
| LC-T18 meaningful repair | M3-12–16; B10–12 and repair saves |
| LC-T19 warned closure | M3-18–24; B14–15, closure transcript/trace |
| LC-T20 retain authority | M3-11; B10–12 |
| LC-T21 custody/ownership | M3-01, 16; B07, B12 |
| LC-T25 no fictitious debt | M3-01, 25; B03, B07 |
| LC-T26 failed/stale transaction | M3-28, 48; altered terms/current custody/current balances fail atomically |
| LC-T28 duplicate protection | M3-30, 31; exact retry/conflict/stale and result redelivery |
| LC-T30 private-information-free recovery | M3-01, 16; successful UI runs |
| LC-T31 independent outcomes | M3-42; recovery with/without correction, money/privacy/social separate |
| LC-T32 absent actor | M3-34; Nera receives no office events |
| LC-T33 continuity | M3-29, 32, 33; partial/restricted/warned/repaired/pending/closed saves |
| LC-T35 playback neutrality | M3-34; B08 complete export equality |
| LC-T42 protected first request | M3-03 all nine available BASED/salience variants; B01–02 |
| LC-T44 unnecessary-payment refusal | M3-25, 26; B03 |
| LC-T55 shorthand vs evasion | M3-35; distinct record/movement and later response causes |
| LC-T62 interface cannot consume repair | M3-05, 12–15; B01, B10–13 |
| LC-T65 refusal alone is not failure | M3-09, 17, 18, 25 |
| LC-T69 always-previewed closure | M3-18–24; B13–14, missing-notice harness |

## Adversarial coverage

M3-03–10 and 36–38 attack private drafts, unheard other-NPC conversation, hidden selectors/truth, scoped same-observer inference, witnessed conduct versus inspected detail, limited witness claims and source-pointer leakage. M3-43/45 prohibit simulated human belief/psychology. M3-46 verifies current authoritative physical resolution without teaching unobserving NPCs.

M3-12–16 cover repair through clarification, End/switch, rejected commands and vague versus substantive correction. M3-18–24 cover prior warning, current/edited/abandoned notices, actual display, missing display, exactly one physical closure, warning retained after repair and completed-recovery protection.

M3-25–31, 44 and 48 cover ordinary payment refusal, distinct bypass proposal meaning, acknowledgment versus confirmation, altered/stale terms, retries and atomic current balance/custody checks. The neutral priced fixture tests the transfer primitive, not Seed B negotiation. M3-32–34 cover required save stages, journal/package tampering, legacy refusal, read purity and absence. M3-39–40 rename all identities/labels and audit core for authored-name shortcuts. M3-41 preserves material meaning across salience. M3-47 tests 30 repeated requests, exact reconstructed inputs, save/load and read purity; it does not promise unlimited history.

## Development defects corrected

A reproducing test found beliefs being derived for the human actor. Knowledge now derives NPC beliefs only, with closed-schema rejection of invented human psychology. `human-belief-before-fix.tap` is an intentionally failing development reproduction; final M3-43/45 and the full suite pass.

Repeated requests exposed quadratic growth from duplicated complete decision inputs. Decisions now retain observation/claim references and the exact own-state snapshot. Commit-time equality and M3-47 verify exact reconstruction without weakening the inherited JSON limit. A source-audit false positive matching a name inside another word was corrected to whole-word matching. Historical development failures are not final-suite failures.

## Known limitations and deferred scope

- Finished art/wording is fallback quality. QA used one desktop in-app browser. Mobile layout, accessibility certification and novice usability were not certified. Direct file launch was not verified; loopback launch was tested.
- Persistence is manual; no autosave or old-save conversion. The inherited validator limits canonical JSON to 1,048,576 characters and depth 32. History is bounded; expanded author traces can be larger than compact saves.
- Author/debug exports contain fictional hidden facts and complete journals. Observation filtering governs engine behavior, not cryptographic secrecy against someone reading source/debug files.
- Policies use deterministic bounded role/scope/evidence rules and fixed response priority. Authored actor profiles do not constitute full personality/needs/relationship simulation. No broad economy, unrestricted promises or sensory simulation is claimed.
- Renaming proves equivalent authored packages, not arbitrary new content without authoring/validation. No spatial host adapter was needed.
- Full 20-vibe × 6-act × 3-salience coverage, all 69 master targets, Seed B, M4+, full Assembler/live editing and NPC initiation are deferred. Routes/rails/lanes/nodes/geometry/locomotion/LOS/spawning/sprite-facing remain host/reference-only.

The approved missing-preview rule adds no extra player-facing consequence. No additional owner rule is pending. Independent M3 review is next.
