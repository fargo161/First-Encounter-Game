"""Read-only Stage 7 source/evidence integrity; does not repeat behavior suites."""
from pathlib import Path
import argparse,json,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1]
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def files(root):return {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--original-root',type=Path)
    ap.add_argument('--evidence-root',type=Path)
    ap.add_argument('--require-git',action='store_true')
    args=ap.parse_args()
    m=load(ROOT/'docs/provenance/room-creator-stage6-import.json')
    s=load(ROOT/'docs/provenance/room-creator-stage7-verification.json')
    package=ROOT/m['repository_package']
    assert files(package)=={e['path'] for e in m['files']+m['packaging_metadata']}
    for e in m['files']+m['packaging_metadata']:
        p=package/e['path']
        assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    if args.original_root:
        expected={e['path'] for e in m['files']}|{Path(e['path']).relative_to(args.original_root).as_posix() for e in m['excluded_original_files']}
        assert files(args.original_root)==expected
        for e in m['files']:
            p=args.original_root/e['path'];st=p.stat()
            assert st.st_size==e['bytes'] and st.st_mtime_ns==e['original_mtime_ns'] and sha(p)==e['sha256'],str(p)
        for e in m['excluded_original_files']:
            p=Path(e['path']);st=p.stat()
            assert st.st_size==e['bytes'] and st.st_mtime_ns==e['mtime_ns'] and sha(p)==e['sha256'],str(p)
    a1=load(ROOT/'docs/provenance/encounter-atlas-stage4-import.json')
    root=ROOT/a1['repository_package'];assert files(root)=={e['path'] for e in a1['files']}
    for e in a1['files']:
        p=root/e['path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    for e in s['repository_evidence']:
        p=ROOT/e['path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    # Historical imported independent material stays byte-exact.
    for e in m['supplemental_provenance']+m['asset_metadata']:
        p=ROOT/e['repository_path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    a=load(ROOT/'docs/provenance/source-authority.json')
    assert a['current_authorized_stage']==7 and a['next_stage'].startswith('Stage 8')
    assert a['subsystems']['room_creator']['acceptance']=='HOLD_FOR_FURTHER_REMEDIATION'
    assert a['subsystems']['encounter_atlas']==m['unchanged_encounter_authority']
    assert a['subsystems']['zant']==m['unchanged_zant_authority']
    assert a['imported_subsystems']==['encounter_atlas','room_creator']
    assert s['verdict']=='PASS WITH HOLD PRESERVED'
    assert s['product_status']=='HOLD_FOR_FURTHER_REMEDIATION'
    assert s['known_defect']['passed']==16 and s['known_defect']['failed']==2
    assert not s['known_defect']['repaired_or_weakened']
    assert sorted(p.name for p in (ROOT/'packages/zant').iterdir())==['README.md']
    assert not (ROOT/'runtime').exists()
    assert 'filter=lfs' not in (ROOT/'.gitattributes').read_text(encoding='utf-8')
    evidence_count=0
    if args.evidence_root:
        index=args.evidence_root/'stage7-evidence-inventory.json'
        assert sha(index)==s['private_evidence_inventory']['sha256']
        for e in load(index)['files']:
            p=args.evidence_root/e['path']
            assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
            evidence_count+=1
    result={'stage7_source_and_evidence_integrity':'PASS','recorded_migration_verdict':s['verdict'],'product_status':'HOLD_FOR_FURTHER_REMEDIATION','Room_Creator_baseline_files':383,'Git_only_metadata_files':1,'Encounter_files':2731,'repository_evidence_files':len(s['repository_evidence']),'private_evidence_files_verified':evidence_count,'original_Room_Creator':'PASS' if args.original_root else 'not_requested','known_defect_repaired':False,'ZANT_imported':False,'stage8_started':False,'scope':'Read-only integrity of current source and recorded evidence; no behavior execution.'}
    if args.require_git:
        def git(*a):return subprocess.check_output(['git','-C',str(ROOT),*a],encoding='utf-8').strip()
        assert git('branch','--show-current')=='main'
        assert not git('status','--porcelain=v1'),'Worktree is not clean'
        assert git('rev-list','--max-parents=0','HEAD')==m['history_root']
        assert not git('diff',s['baseline']['source_commit'],'HEAD','--','packages/room-creator','packages/encounter-atlas','packages/zant','tools/room-creator-independent')
        result['head']=git('rev-parse','HEAD');result['git']='PASS'
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
