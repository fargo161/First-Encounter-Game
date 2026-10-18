# Foundation tools

verify_foundation.py is a read-only verifier for the authorized Stages 0-3 foundation. It verifies the exact text/metadata payload, truthful subsystem states, placeholder-only package directories, absence of Unity/LFS/workflows, governing-document hashes, optional private archive/original hashes, and optional Git history/worktree checks.

It does not run subsystem source or certify product behavior. Run Python with -B to avoid bytecode output. It exits nonzero on an assertion failure.
