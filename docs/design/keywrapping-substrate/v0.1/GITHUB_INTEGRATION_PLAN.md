# GitHub integration and owner-review plan

**Version:** v0.1 · **Date:** 2026-10-22
**Status:** PROPOSED / NON-RUNTIME / NOT AN ACCEPTED SHARED CONTRACT
**Role:** Repository & Documentation Steward.

The package belongs in the existing [fargo161/First-Encounter-Game repository](https://github.com/fargo161/First-Encounter-Game). The owner approved documentation production and a branch/commit **plan**. Actual commits, push, merge and publication remain reserved for separate authorization. No new repository, PR, release or remote branch is required for this delivery.

## Branch state and authority

| Item | Delivery expectation |
| --- | --- |
| Local branch | `docs/keywrapping-substrate-v0.1` |
| Inspected base / HEAD before any later authorized commit | `76a92fd82ac5ec6f10748f0b439a5d661fff5ea5` |
| Change state | Documentation additions and one documentation-index edit, left uncommitted for owner review |
| Actual commits | None created for this package |
| Push/publication | **HOLD** — owner preflight #17 and subsequent instruction expressly withhold authorization |
| Merge / acceptance promotion | Not authorized |
| Existing C2.1 B0 | Input/comparison only; no precedence over KeyWrapping source pack, implementation contract or acceptance inferred |
| Candidate schema files | **Deferred by owner #9 = NO**. JSON instances and schema-design prose in Markdown only |

The fresh clone restores local access that was unavailable during the initial preflight. It does not restore a missing numbered source copy or change design precedence. The owner accepted the supplied complete Context v0.1 baseline conditionally: compare additional numbered/unnumbered copies if they become available before asserting equivalence. The current [source snapshot](../../../research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md) records hashes and limits.

## Public/private discrepancy and publication gate

GitHub repository metadata observed on 2026-10-22 reported **public**. Existing root README, development instructions and provenance prose describe a **private** canonical repository. Preserve both observations without inferring when or why visibility changed. This package does not edit visibility settings, historical authority ledgers or those older descriptions.

Prepare every prospective committed artifact as though it could become public. That includes no owner-held source-pack copies, private local paths, credentials, raw donor corpora or unreviewed assets. Public metadata does not confer redistribution permission or authorize a push. Before a later publication decision the owner must review the exact diff and license scope, resolve or explicitly retain the visibility discrepancy, and authorize the intended destination/action. Commit approval and push approval are separable; neither is implied by the documentation-production approval.

## Exact artifact inventory and commit groups

Paths below are the intended final paths, including the two supplementary mining reports and portable team/verification reports. The package has **23 Markdown documents** plus the existing documentation index edit. Retain only substantive artifacts; no empty directories or schema placeholders are planned.

### Group 1 — research/source identity and licensing

Candidate message: `docs(keywrapping): record source authority and license ledger`

| Final path | Purpose |
| --- | --- |
| `docs/research/keywrapping-substrate/v0.1/SOURCE_SNAPSHOT.md` | Owner-held source identities, precedence, duplicate/missing-material limits and repository snapshot |
| `docs/research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md` | Ten donor pins, exact license scopes, declared selected VN metadata and retained attribution/notice |

### Group 2 — semantic/domain mining

Candidate message: `docs(keywrapping): map actions and compare semantic donors`

| Final path | Purpose |
| --- | --- |
| `docs/research/keywrapping-substrate/v0.1/STANDARDS_MINING.md` | Concepts retained, adapted or rejected and source-to-proposal traceability |
| `docs/research/keywrapping-substrate/v0.1/ACTION_PREDICATE_MAPPING.md` | All 66 starting words, donor senses, roles, validity, examples, gaps and near-duplicates |
| `docs/research/keywrapping-substrate/v0.1/TRANSACTION_DONOR_MINING.md` | ODRL/ActivityStreams comparison for proposals, commitments and authority |
| `docs/research/keywrapping-substrate/v0.1/PROVENANCE_DONOR_MINING.md` | PROV/ActivityStreams comparison for source lineage, claims and sealed viewpoints |
| `docs/research/keywrapping-substrate/v0.1/SOCIAL_REASONING_DONORS.md` | Ensemble/FAtiMA comparison and decision/wording separation |

### Group 3 — proposed substrate and JSON records

Candidate message: `docs(keywrapping): specify proposed substrate and JSON records`

| Final path | Purpose |
| --- | --- |
| `docs/design/keywrapping-substrate/v0.1/SUBSTRATE_SPEC.md` | Coherent proposed record/concept foundation and preserved invariants |
| `docs/design/keywrapping-substrate/v0.1/TRANSACTIONS_COMMITMENTS.md` | Exact-version proposals, agreements, obligation state and performative validity |
| `docs/design/keywrapping-substrate/v0.1/PERSPECTIVE_PROVENANCE.md` | Canonical history, receipt, claim, stance and safe actor projection |
| `docs/design/keywrapping-substrate/v0.1/REFERENCES_PROMOTION.md` | Identity, aliases, acquisition, significance, retention and salience |
| `docs/design/keywrapping-substrate/v0.1/EXPRESSIONS_COMPATIBILITY.md` | Grouped expressions, typed slots, ambiguity and bounded graph expansion |
| `docs/design/keywrapping-substrate/v0.1/JSON_RECORD_FAMILY.md` | Concrete illustrative JSON instances for central concepts/interactions |
| `docs/design/keywrapping-substrate/v0.1/SCHEMA_DESIGN.md` | Candidate 2020-12 validation design and limits in prose; no schema files |
| `docs/design/keywrapping-substrate/v0.1/DECISION_LOG.md` | Explicit owner decisions separated from synthesis proposals and publication hold |
| `docs/design/keywrapping-substrate/v0.1/OPEN_QUESTIONS.md` | Unresolved design choices and later acceptance decisions |

### Group 4 — audit evidence and revisions

Candidate message: `docs(keywrapping): record sealing and semantic audits`

| Final path | Purpose |
| --- | --- |
| `docs/audits/keywrapping-substrate/v0.1/PREFLIGHT_REPORT.md` | Portable A–M historical preflight snapshot plus sign-off/access-restoration addendum |
| `docs/audits/keywrapping-substrate/v0.1/LEAK_SEALING_AUDIT.md` | Independent hostile knowledge/disclosure review, findings and dispositions |
| `docs/audits/keywrapping-substrate/v0.1/COMBINATORIAL_SEMANTIC_AUDIT.md` | Subsequent independent nonsense/ambiguity review, findings and dispositions |
| `docs/audits/keywrapping-substrate/v0.1/TEAM_EXECUTION.md` | Ten distinct role assignments, handoffs and evidence of the required review sequence |
| `docs/audits/keywrapping-substrate/v0.1/VERIFICATION_REPORT.md` | Portable execution evidence, documentation checks, preservation checks and limits |

If an audit changes a model, put the revised model in Group 3 and retain the audit's finding, disposition and recheck in Group 4. The final package should describe the corrected design without preserving obsolete contradictory instructions as active requirements. The audit reports preserve review evidence and unresolved disagreements.

### Group 5 — reading guide and packaging

Candidate message: `docs(keywrapping): add reading guide and integration plan`

| Final path | Purpose |
| --- | --- |
| `docs/design/keywrapping-substrate/v0.1/README.md` | Proposed status, reading order, team sequence and limits |
| `docs/design/keywrapping-substrate/v0.1/GITHUB_INTEGRATION_PLAN.md` | This inventory, authorization boundary and future commit/verification instructions |
| `docs/README.md` | One link into the proposed KeyWrapping package, preserving existing entries |

No root README, AGENTS, accepted `contracts/`, `packages/`, C1, existing C2.1 B0, Room Creator, ZANT, tools, CI, assets, archives, source-authority, fingerprints, known-defects or STATUS_INTERPRETATION change is part of this plan. No `.schema.json`, runtime module, adapter, loader, database table, migration, Unity file, dependency manifest or implementation stub is permitted.

## Citation and license placement

The source snapshot carries original identities without redistributing the source pack. The source/license ledger carries exact donor URLs, pins, dates, present copying scope and unresolved rights. Mining reports link evidence at each borrowed concept. Design proposals link the relevant mining/source rationale; record/field names invented for Encounter remain proposed.

The action mapping transcribes selected VN3.4 role/frame metadata. Its exported copies must retain or accompany the full [VerbNet attribution and notice](../../../research/keywrapping-substrate/v0.1/SOURCE_LICENSE_LEDGER.md#verbnet-attribution-and-retained-notice). No donor corpus or source example is shipped. FrameNet dataset redistribution remains uncleared pending the original release notice. No blanket license for the entire Encounter repository is created by this ledger.

## Read-only checks for owner review

Run these from the checkout root. They inspect the existing branch and do not stage, commit or publish anything:

```powershell
git branch --show-current
git rev-parse HEAD
git status --short --untracked-files=all
git diff --check
git diff --name-status 76a92fd82ac5ec6f10748f0b439a5d661fff5ea5
git ls-files --others --exclude-standard
python -B tools/repo.py doctor
python -B tools/repo.py integrity
```

Expected branch/HEAD are in the first table. The union of changed tracked paths and untracked paths must equal only the explicit inventory above. In this uncommitted delivery, `git diff` alone omits new untracked files; the status/listing is mandatory. A `BASE...HEAD` comparison will be empty before commits and must not be offered as evidence of no working-tree changes.

Confirm no tracked change exists outside the allowlist:

```powershell
git diff --exit-code 76a92fd82ac5ec6f10748f0b439a5d661fff5ea5 -- . ':(exclude)docs/README.md' ':(exclude)docs/research/keywrapping-substrate/v0.1/**' ':(exclude)docs/design/keywrapping-substrate/v0.1/**' ':(exclude)docs/audits/keywrapping-substrate/v0.1/**'
```

This command does not inspect untracked paths; compare `git ls-files --others --exclude-standard` to the allowlist too. The [verification report](../../../audits/keywrapping-substrate/v0.1/VERIFICATION_REPORT.md) records the actual final documentation checks: parse every fenced JSON example, resolve local links, check metadata and whitespace in new untracked documents, confirm all 66 words, and inspect audit finding dispositions. Syntax or link success establishes documentary consistency, not implemented behavior.

The approved repository package command is:

```powershell
python -B tools/repo.py all
```

It runs existing package checks in disposable copies outside canonical packages. To retain inspectable logs, use its documented `--out` option with a **new absolute directory outside the checkout**; ephemeral sandbox TEMP may disappear after a command session. Never run package writers in frozen packages. The portable verification report records fresh `doctor`, `integrity` and `all` evidence and the retained-evidence arrangement. A broad package rerun is unnecessary after later prose-only corrections unless they reveal a preservation concern; rerun appropriate path/integrity/documentation checks instead.

`all` covers Encounter/Atlas, held Room Creator and incomplete ZANT. It does not certify standalone C1 or the new substrate, and this task preserves C1 unchanged. Expected limitations remain: IR3-25 is one actual accepted failure; RC stays HOLD_FOR_FURTHER_REMEDIATION; ZANT Gate A remains incomplete. Existing green CI is historical evidence, not a fresh KeyWrapping execution result.

## Checks after a later explicit commit authorization

The five candidate messages/groups above become actionable only after the owner authorizes actual commits. Use explicit file lists; do not indiscriminately stage the checkout. Review each staged diff, include linked notice/source material in the same eventual review package, and confirm all final documents before any publication decision. Cross-links between planned commit groups resolve once the complete five-group series is present.

After those separately authorized commits, the following read-only comparisons supplement the working-tree checks:

```powershell
git diff --check 76a92fd82ac5ec6f10748f0b439a5d661fff5ea5...HEAD
git diff --name-status 76a92fd82ac5ec6f10748f0b439a5d661fff5ea5...HEAD
git log --oneline 76a92fd82ac5ec6f10748f0b439a5d661fff5ea5..HEAD
git status --short --untracked-files=all
```

Before any separately authorized push, recheck the exact branch/destination, current base drift, staged/committed contents, changed-path allowlist, primary license notices, unresolved rights, owner publication decision and preserved gates. A later main-branch change requires an evidence comparison and appropriately scoped checks, not a silent authority promotion or history rewrite. Do not force-push, merge or change visibility under this plan.

## Reviewable completion and remaining gates

The deliverable is a coherent documentation proposal with four research miners, architecture/schema synthesis, independent sealing review followed by independent combinatorial review, recorded revisions and verification. Every critical finding must be fixed, explicitly deferred or escalated; no finding disappears into an unqualified PASS. The [package guide](README.md), [audit reports](../../../audits/keywrapping-substrate/v0.1/LEAK_SEALING_AUDIT.md) and verification report distinguish documentary review from implementation.

Later implementation requires its own scope, selected senses/capabilities, consumer, storage/schema decision, executable validation, behavior tests and owner authorization. Paper/prototype testing of whether composition is enjoyable remains a separate acceptance activity. Neither this package nor green preservation checks starts Stage 13, accepts KeyWrapping into Core, promotes C2.1 B0, integrates the sandbox or changes a frozen subsystem's acceptance.
