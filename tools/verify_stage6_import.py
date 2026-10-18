"""Stage 6 import integrity only. Never executes Room Creator or Encounter source."""
from pathlib import Path
import argparse,hashlib,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def digest(rows):
    return hashlib.sha256(json.dumps(rows,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def files(root):return {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--original-root',type=Path)
    ap.add_argument('--preservation-root',type=Path)
    ap.add_argument('--require-git',action='store_true')
    args=ap.parse_args()
    m=load(ROOT/'docs/provenance/room-creator-stage6-import.json')
    package=ROOT/m['repository_package']
    expected={e['path'] for e in m['files']}
    packaging={e['path'] for e in m['packaging_metadata']}
    assert not expected & packaging
    assert files(package)==expected|packaging
    assert len(expected)==383
    for e in m['files']:
        p=package/e['path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
        if args.original_root:
            p=args.original_root/e['path'];s=p.stat()
            assert s.st_size==e['bytes'] and s.st_mtime_ns==e['original_mtime_ns'] and sha(p)==e['sha256'],str(p)
    rows=[{k:e[k] for k in ['path','bytes','sha256']} for e in m['files']]
    assert digest(rows)==m['source_tree_sha256']
    for e in m['packaging_metadata']:
        p=package/e['path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256']
    for e in m['supplemental_provenance']+m['asset_metadata']+m['stage6_records']:
        p=ROOT/e['repository_path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    if args.original_root:
        caches=m['excluded_original_files']
        allowed={Path(e['path']).relative_to(args.original_root).as_posix() for e in caches}
        assert files(args.original_root)==expected|allowed
        for e in caches:
            p=Path(e['path']);s=p.stat()
            assert s.st_size==e['bytes'] and s.st_mtime_ns==e['mtime_ns'] and sha(p)==e['sha256'],str(p)
    # Independently recheck the complete immutable Encounter package, not its code.
    a1=load(ROOT/'docs/provenance/encounter-atlas-stage4-import.json')
    a1root=ROOT/a1['repository_package']
    assert files(a1root)=={e['path'] for e in a1['files']}
    for e in a1['files']:
        p=a1root/e['path'];assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
    assert digest([{k:e[k] for k in ['path','bytes','sha256']} for e in a1['files']])==a1['source_tree_sha256']
    a=load(ROOT/'docs/provenance/source-authority.json')
    assert a['current_authorized_stage']==6 and a['next_stage'].startswith('Stage 7')
    assert a['imported_subsystems']==['encounter_atlas','room_creator']
    assert a['subsystems']['room_creator']['acceptance']=='HOLD_FOR_FURTHER_REMEDIATION'
    assert a['subsystems']['encounter_atlas']==m['unchanged_encounter_authority']
    assert a['subsystems']['zant']==m['unchanged_zant_authority']
    assert sorted(p.name for p in (ROOT/'packages/zant').iterdir())==['README.md']
    assert not (ROOT/'runtime').exists()
    assert 'filter=lfs' not in (ROOT/'.gitattributes').read_text(encoding='utf-8')
    assert not list((ROOT/'.github').rglob('*.yml')) and not list((ROOT/'.github').rglob('*.yaml'))
    assert not m['stage7_executed']
    originals=preserved=0
    if args.preservation_root:
        p=args.preservation_root/'archive-inventory.json'
        assert sha(p)==m['preservation_inventory_sha256']
        inventory=load(p)
        for e in inventory['files']:
            p=Path(e['source_path']);s=p.stat()
            assert s.st_size==e['bytes'] and s.st_mtime_ns==e['source_mtime_ns'] and sha(p)==e['sha256'],str(p)
            originals+=1
            p=args.preservation_root/e['archive_path']
            assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
            preserved+=1
    result={'stage6_import_integrity':'PASS','baseline_files':len(expected),'baseline_bytes':sum(e['bytes'] for e in rows),'source_tree_sha256':digest(rows),'git_packaging_metadata_files':len(packaging),'supplemental_files':len(m['supplemental_provenance']),'external_asset_metadata_files':len(m['asset_metadata']),'status':'HOLD_FOR_FURTHER_REMEDIATION','known_defect_repaired':False,'encounter_files_unchanged':len(a1['files']),'zant_imported':False,'original_Room_Creator':'PASS' if args.original_root else 'not_requested','all_preserved_originals_checked':originals,'all_preservation_copies_checked':preserved,'stage7_executed':False,'subsystem_tests_builds_browser_executed':False}
    if args.require_git:
        def git(*a):return subprocess.check_output(['git','-C',str(ROOT),*a],encoding='utf-8').strip()
        assert git('branch','--show-current')=='main'
        assert not git('status','--porcelain=v1'),'Worktree is not clean'
        assert git('rev-list','--max-parents=0','HEAD')==m['history_root']
        assert not git('diff',m['pre_import_commit'],'HEAD','--','packages/encounter-atlas','packages/zant','docs/audits/encounter-atlas','tools/encounter-atlas-independent')
        result['head']=git('rev-parse','HEAD');result['git']='PASS'
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
