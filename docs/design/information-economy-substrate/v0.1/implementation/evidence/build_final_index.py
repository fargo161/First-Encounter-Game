"""Pin the completed Gate B review packet; never grants owner acceptance."""
import argparse
import datetime
import hashlib
import importlib.util
import json
from pathlib import Path


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def pin(path, root):
    raw = path.read_bytes()
    return {'path': path.relative_to(root).as_posix(), 'bytes': len(raw),
            'sha256': hashlib.sha256(raw).hexdigest()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--source', required=True)
    parser.add_argument('--i-summary', required=True)
    parser.add_argument('--j-results', required=True)
    parser.add_argument('--h-results', required=True)
    args = parser.parse_args()
    repo = args.repo.resolve()
    evidence = Path(__file__).resolve().parent
    packet = evidence.parent
    package = repo / 'packages/encounter-ie-reference/0.1.0'
    spec = importlib.util.spec_from_file_location('candidate_census', evidence / 'collect_candidate.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    candidate = module.run(package, repo)
    identity = read(package / 'ARCHITECTURE_IDENTITY.json')
    preservation = read(evidence / 'preservation-final.json')
    entry = read(evidence / 'phase-entry.json')
    current_contract = hashlib.sha256((package / 'PACKAGE_CONTRACT.md').read_bytes()).hexdigest()
    m0_contract = hashlib.sha256((package / 'M0_FREEZE/PACKAGE_CONTRACT.md').read_bytes()).hexdigest()
    assert candidate['source_identity'] == identity['source_identity'] == args.source
    assert candidate['profile_id'] == identity['default_profile_id'] == identity['profile']['id']
    assert identity['profile']['limits'] == candidate['profile_limits']
    assert current_contract == identity['contract_sha256'] == identity['current_contract_sha256']
    assert m0_contract == identity['initial_m0_contract_sha256']
    assert preservation['status'] == 'PASS'
    assert not candidate['external_runtime_imports'] and not candidate['donor_provenance_mismatches']
    assert identity['owner_acceptance'] is False and identity['gate_b'] == 'PENDING'
    for name, expected in entry['approved_architecture_pins'].items():
        path = packet.parent / 'architecture' / name
        assert hashlib.sha256(path.read_bytes()).hexdigest() == expected
    for name in (args.i_summary, args.j_results, args.h_results):
        assert (evidence / name).is_file(), name
    tester = read(evidence / args.i_summary)
    auditor = read(evidence / args.j_results)
    builder = read(evidence / args.h_results)
    assert tester['source_identity'] == auditor['source'] == builder['source_identity'] == args.source
    assert tester['profile_id'] == candidate['profile_id']
    assert tester['status'] == 'PASS' and tester['semantic_file_count'] == 19
    assert len(tester['executed_main_harness']) == 20 and len(tester['executed_supplemental_harness']) == 1
    for name, expected in {**tester['executed_main_harness'], **tester['executed_supplemental_harness']}.items():
        assert hashlib.sha256((package / name).read_bytes()).hexdigest() == expected, name
    assert len(auditor['probes']) == 13 and all(p['status'] == 'PASS' for p in auditor['probes'].values())
    generated = [p.relative_to(package).as_posix() for p in package.rglob('*')
                 if p.name == '__pycache__' or p.suffix in ('.pyc', '.pyo', '.db', '.sqlite', '.sqlite3')]
    assert not generated, generated
    reports = sorted(packet.glob('*.md'))
    required = {'README.md', 'INFORMATION_ECONOMY_IMPLEMENTATION_REPORT.md',
                'INFORMATION_ECONOMY_TEST_REPORT.md', 'INFORMATION_ECONOMY_INDEPENDENT_AUDIT.md',
                'INFORMATION_ECONOMY_AUDIT_CLOSURE.md',
                'INFORMATION_ECONOMY_FINAL_ACCEPTANCE_CANDIDATE.md'}
    assert required <= {p.name for p in reports}
    candidate_path = evidence / 'candidate-final.json'
    candidate_path.write_text(json.dumps(candidate, indent=2) + '\n', encoding='utf-8')
    index_path = evidence / 'final-verification.json'
    retained = [p for p in sorted(evidence.iterdir()) if p.is_file() and p != index_path]
    result = {
        'captured_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'scope': 'Completed bounded reference-proof review packet; report verdicts remain attributed to their independent authors',
        'state': 'STOP_AT_GATE_B_OWNER_APPROVAL_PENDING', 'owner_acceptance': False,
        'source_identity': args.source, 'profile_id': candidate['profile_id'],
        'contract_sha256': current_contract, 'pre_world_m0_contract_sha256': m0_contract,
        'approved_architecture_pins': entry['approved_architecture_pins'],
        'candidate_package_manifest_sha256': candidate['package_manifest_sha256'],
        'preservation': preservation,
        'qualification_records': {'independent_tester_I': args.i_summary,
                                  'independent_auditor_J': args.j_results,
                                  'builder_H_not_independent': args.h_results},
        'reports': [pin(p, repo) for p in reports],
        'retained_evidence': [pin(p, repo) for p in retained],
        'excluded_claims': ['production integration', 'old-world compatibility', 'migration',
                            'compaction', 'indefinite campaign', 'simultaneous capacity maxima',
                            'hostile Python or formal timing isolation', 'device/power-loss certification',
                            'automatic psychology or domain law', 'playable content', 'Unity/Stage 13',
                            'owner acceptance or next-phase authorization'],
    }
    index_path.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: result[k] for k in ('captured_utc', 'state', 'source_identity',
                                          'profile_id', 'candidate_package_manifest_sha256')}, indent=2))


if __name__ == '__main__':
    main()
