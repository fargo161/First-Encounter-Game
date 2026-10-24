"""Read-only stewardship check; no runtime or independent qualification claim."""
import argparse
import datetime
import hashlib
import json
from pathlib import Path
import subprocess


def git(repo, *args):
    return subprocess.check_output(['git', *args], cwd=repo).decode('utf-8').strip()


def run(repo):
    phase = Path(__file__).with_name('phase-entry.json')
    entry = json.loads(phase.read_text(encoding='utf-8'))
    prefixes = tuple(x.rstrip('/') + '/' for x in entry['allowed_new_scope'])
    protected = {x['path']: x for x in entry['protected_existing_files']}
    inventory = subprocess.check_output(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], cwd=repo)
    current = set(x for x in inventory.decode('utf-8').split('\0') if x)
    missing = sorted(set(protected) - current)
    extra = sorted(x for x in current - set(protected) if not x.startswith(prefixes))
    changed = []
    for name, old in protected.items():
        p = repo / name
        if p.is_file():
            data = p.read_bytes()
            if len(data) != old['bytes'] or hashlib.sha256(data).hexdigest() != old['sha256']:
                changed.append(name)
        elif name not in missing:
            missing.append(name)
    branch = git(repo, 'branch', '--show-current')
    head = git(repo, 'rev-parse', 'HEAD')
    tracked = git(repo, 'diff', '--name-only', 'HEAD')
    generated = sorted(str(p.relative_to(repo)).replace('\\', '/')
                       for p in (repo / 'packages').rglob('*')
                       if p.name == '__pycache__' or p.suffix in ('.pyc', '.pyo'))
    return {
        'checked_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'scope': 'Protected existing bytes/membership and allowed new paths; not IE runtime acceptance',
        'protected_file_count': len(protected),
        'missing': sorted(missing), 'changed': sorted(changed),
        'unexpected_new_paths': extra, 'bytecode_or_cache_paths': generated,
        'branch': branch, 'head': head, 'tracked_diff': tracked,
        'branch_head_unchanged': branch == entry['branch'] and head == entry['head'],
        'status': 'PASS' if not (missing or changed or extra or generated or tracked)
                  and branch == entry['branch'] and head == entry['head'] else 'FAIL',
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    result = run(args.repo.resolve())
    args.out.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result['status'] == 'PASS' else 1)
