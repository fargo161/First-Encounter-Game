"""Static source/dependency/provenance census; does not execute the proof."""
import argparse
import ast
import datetime
import hashlib
import json
from pathlib import Path
import sys


def digest(value):
    raw = json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=True).encode()
    return hashlib.sha256(raw).hexdigest()


def run(package, repo):
    semantic = {}
    imports = set()
    syntax = []
    for folder in ('eaie', 'fixtures'):
        for p in sorted((package / folder).glob('*')):
            if p.is_file():
                data = p.read_bytes()
                semantic[p.relative_to(package).as_posix()] = hashlib.sha256(data).hexdigest()
                if p.suffix == '.py':
                    tree = ast.parse(data, filename=str(p))
                    syntax.append(p.name)
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            imports.update(x.name.split('.')[0] for x in node.names)
                        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
                            imports.add(node.module.split('.')[0])
    profile_tree = ast.parse((package / 'eaie/profile.py').read_bytes())
    limits = next(ast.literal_eval(n.value) for n in profile_tree.body
                  if isinstance(n, ast.Assign) and any(isinstance(x, ast.Name)
                  and x.id == 'DEFAULT_LIMITS' for x in n.targets))
    provenance = json.loads((package / 'SOURCE_PROVENANCE.json').read_text(encoding='utf-8'))
    donor = repo / provenance['donor']
    bad_donor = []
    for item in provenance['raw_files']:
        p = donor / item['path']
        if not p.is_file():
            bad_donor.append(item['path'])
        else:
            raw = p.read_bytes()
            if len(raw) != item['bytes'] or hashlib.sha256(raw).hexdigest() != item['sha256']:
                bad_donor.append(item['path'])
    all_files = []
    for p in sorted(package.rglob('*')):
        if p.is_file():
            raw = p.read_bytes()
            all_files.append({'path': p.relative_to(package).as_posix(), 'bytes': len(raw),
                              'sha256': hashlib.sha256(raw).hexdigest()})
    return {
        'captured_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'scope': 'Static candidate identity/dependencies/provenance, not runtime acceptance',
        'source_identity': digest({'domain': 'EA-IE-source/1', 'files': semantic}),
        'semantic_files': semantic,
        'profile_id': 'EA-IE-profile/1/' + digest(limits),
        'profile_limits': limits,
        'runtime_imports': sorted(imports),
        'external_runtime_imports': sorted(imports - set(sys.stdlib_module_names)),
        'parsed_runtime_modules': sorted(syntax),
        'donor_provenance_files': len(provenance['raw_files']),
        'donor_provenance_mismatches': bad_donor,
        'package_files': all_files,
        'package_manifest_sha256': digest(all_files),
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--package', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    result = run(args.package.resolve(), args.repo.resolve())
    args.out.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: v for k, v in result.items()
                      if k not in ('semantic_files', 'package_files', 'profile_limits')}, indent=2))
