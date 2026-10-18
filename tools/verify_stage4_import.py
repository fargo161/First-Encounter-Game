"""Stage 4 import integrity only. Does not execute subsystem source, builds or tests."""
from pathlib import Path
import argparse,json,hashlib,os,subprocess
ROOT=Path(__file__).resolve().parents[1]
def sha(p):
    with p.open('rb')as f:return hashlib.file_digest(f,'sha256').hexdigest()
def digest(rows):return hashlib.sha256(json.dumps(rows,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def paths_under(root):
    return sorted((p for p in root.rglob('*')if p.is_file()and'__pycache__'not in p.parts),key=lambda p:p.relative_to(root).as_posix())
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--original-root',type=Path)
    ap.add_argument('--require-git',action='store_true')
    args=ap.parse_args()
    m=json.loads((ROOT/'docs/provenance/encounter-atlas-stage4-import.json').read_text(encoding='utf-8'))
    package=ROOT/m['repository_package']
    actual={p.relative_to(package).as_posix()for p in paths_under(package)}
    expected={e['path']for e in m['files']}
    assert actual==expected,{'missing':sorted(expected-actual),'extra':sorted(actual-expected)}
    rows=[]
    for e in m['files']:
        p=package/e['path'];assert p.stat().st_size==e['bytes']and sha(p)==e['sha256'],e['path']
        rows.append({'path':e['path'],'bytes':e['bytes'],'sha256':e['sha256']})
        if args.original_root:
            original=args.original_root/e['path'];st=original.stat()
            assert st.st_size==e['bytes']and st.st_mtime_ns==e['original_mtime_ns']and sha(original)==e['sha256'],str(original)
    assert digest(rows)==m['source_tree_sha256']
    if args.original_root:
        assert {p.relative_to(args.original_root).as_posix()for p in paths_under(args.original_root)}==expected
    inputs=[package/'package.json',package/'Start_Atlas_A1.cmd']
    for d in ['src','content','tests','scripts','fixtures/atlas-a1']:inputs.extend(p for p in(package/d).rglob('*')if p.is_file()and'__pycache__'not in p.parts)
    inputs.extend((package/'independent').rglob('*.mjs'));inputs.extend((package/'independent').rglob('*.py'))
    entries=[{'path':p.relative_to(package).as_posix(),'sha256':sha(p)}for p in sorted(set(inputs),key=lambda p:p.relative_to(package).as_posix())]
    assert len(entries)==132 and digest(entries)==m['source_digest']
    for e in m['supplemental_provenance']:
        assert (ROOT/e['repository_path']).stat().st_size==e['bytes']and sha(ROOT/e['repository_path'])==e['sha256']
    for name in ['initial','warned','repaired','pending','recovery','collapse']:
        assert (package/('evidence/ar0-r1/browser/ui-'+name+'.json')).is_file()
    for e in m['tracking_exceptions']['zip_fixtures']:
        assert sha(package/e['path'])==e['sha256']
    a=json.loads((ROOT/'docs/provenance/source-authority.json').read_text(encoding='utf-8'))
    assert a['current_authorized_stage']==4 and a['next_stage'].startswith('Stage 5')
    assert a['imported_subsystems']==['encounter_atlas']
    assert a['subsystems']['room_creator']==m['unchanged_other_subsystems']['room_creator']
    assert a['subsystems']['zant']==m['unchanged_other_subsystems']['zant']
    for name in ['room-creator','zant']:assert sorted(p.name for p in(ROOT/'packages'/name).iterdir())==['README.md']
    assert not(ROOT/'runtime').exists()
    assert not list((ROOT/'.github').rglob('*.yml'))and not list((ROOT/'.github').rglob('*.yaml'))
    assert 'filter=lfs'not in(ROOT/'.gitattributes').read_text(encoding='utf-8')
    for e in m['foundation_files_required_unchanged']:
        assert sha(ROOT/e['path'])==e['sha256'],e['path']
    result={'stage4_import_integrity':'PASS','baseline_files':len(rows),'baseline_bytes':sum(e['bytes']for e in rows),'source_revision':m['source_revision'],'source_digest':m['source_digest'],'source_tree_sha256':m['source_tree_sha256'],'execution_inputs':len(entries),'supplemental_provenance_files':len(m['supplemental_provenance']),'required_saved_runs':6,'selected_zip_fixtures':8,'room_creator_imported':False,'zant_imported':False,'stage5_executed':False,'subsystem_builds_tests_or_browser_run':False,'originals':'PASS'if args.original_root else'not_requested'}
    if args.require_git:
        def git(*cmd):return subprocess.check_output(['git','-C',str(ROOT),*cmd],encoding='utf-8').strip()
        assert git('branch','--show-current')=='main'
        assert not git('status','--porcelain=v1'),'Worktree is not clean'
        assert git('rev-list','--max-parents=0','HEAD')==m['pre_import_commit']
        result['head']=git('rev-parse','HEAD');result['git']='PASS'
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
