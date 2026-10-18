# Foundation verification

From the repository root, run:

    python -B tools/verify_foundation.py --require-git

To recheck all preserved files and unchanged originals as well, run:

    python -B tools/verify_foundation.py --require-git --verify-originals --archive-root "C:\Users\mcdon\Documents\ChatGPT\First Encounter Game Archive\pre-migration-2026-10-18-stages-0-3"

The full check is read-only and hashes 6722 archive files plus their originals. The foundation inventory excludes itself to avoid a self-referential hash.

Independent Git checks:

    git status --short
    git branch --show-current
    git rev-list --count HEAD
    git rev-list --max-parents=0 HEAD
    git cat-file -p HEAD
    git ls-remote origin refs/heads/main

The initial foundation has a single root commit with no parent, on main. Confirm the private repository metadata and compare the remote branch SHA with local HEAD. The external FOUNDATION_COMPLETION_REPORT.json records the observed completion evidence.

No subsystem functional/build suite was rerun. Prior independent reports and known failures remain explicitly distinguished from fresh preservation checks. Source-dependent CI is intentionally absent.
