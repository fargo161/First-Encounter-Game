"""Read-only Stage 5 source/evidence integrity. Does not execute subsystem source."""
from pathlib import Path
import argparse,hashlib,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def digest(rows):
    return hashlib.sha256(json.dumps(rows,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def files(root):
    return sorted((p for p in root.rglob('*') if p.is_file()),key=lambda p:p.relative_to(root).as_posix())
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--original-root',type=Path)
    ap.add_argument('--evidence-root',type=Path)
    ap.add_argument('--require-git',action='store_true')
    args=ap.parse_args()
    m=json.loads((ROOT/'docs/provenance/encounter-atlas-stage4-import.json').read_text(encoding='utf-8'))
    s=json.loads((ROOT/'docs/provenance/encounter-atlas-stage5-verification.json').read_text(encoding='utf-8'))
    package=ROOT/m['repository_package']
    expected={e['path'] for e in m['files']}
    assert {p.relative_to(package).as_posix() for p in files(package)}==expected
    rows=[]
    for e in m['files']:
        p=package/e['path']
        assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],e['path']
        rows.append({k:e[k] for k in ['path','bytes','sha256']})
        if args.original_root:
            original=args.original_root/e['path'];st=original.stat()
            assert st.st_size==e['bytes'] and st.st_mtime_ns==e['original_mtime_ns'] and sha(original)==e['sha256'],str(original)
    assert digest(rows)==m['source_tree_sha256']==s['baseline']['full_tree_sha256']
    if args.original_root:
        assert {p.relative_to(args.original_root).as_posix() for p in files(args.original_root)}==expected
    inputs=[package/'package.json',package/'Start_Atlas_A1.cmd']
    for d in ['src','content','tests','scripts','fixtures/atlas-a1']:
        inputs.extend(p for p in (package/d).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    inputs.extend((package/'independent').rglob('*.mjs'))
    inputs.extend((package/'independent').rglob('*.py'))
    entries=[{'path':p.relative_to(package).as_posix(),'sha256':sha(p)} for p in sorted(set(inputs),key=lambda p:p.relative_to(package).as_posix())]
    assert len(entries)==132 and digest(entries)==m['source_digest']==s['baseline']['source_digest']
    for e in m['supplemental_provenance']:
        assert sha(ROOT/e['repository_path'])==e['sha256']
    for e in s['repository_evidence']:
        p=ROOT/e['path']
        assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],e['path']
    a=json.loads((ROOT/'docs/provenance/source-authority.json').read_text(encoding='utf-8'))
    assert a['current_authorized_stage']==5 and a['next_stage'].startswith('Stage 6')
    assert a['imported_subsystems']==['encounter_atlas']
    assert a['subsystems']['room_creator']==m['unchanged_other_subsystems']['room_creator']
    assert a['subsystems']['zant']==m['unchanged_other_subsystems']['zant']
    for name in ['room-creator','zant']:
        assert sorted(p.name for p in (ROOT/'packages'/name).iterdir())==['README.md']
    assert not (ROOT/'runtime').exists()
    assert not list((ROOT/'.github').rglob('*.yml')) and not list((ROOT/'.github').rglob('*.yaml'))
    assert 'filter=lfs' not in (ROOT/'.gitattributes').read_text(encoding='utf-8')
    assert s['verdict']=='PASS WITH DOCUMENTED KNOWN LIMITATIONS'
    evidence_count=0
    if args.evidence_root:
        p=args.evidence_root/'evidence-inventory.json'
        assert sha(p)==s['private_evidence_inventory']['sha256']
        index=json.loads(p.read_text(encoding='utf-8'))
        for e in index['files']:
            p=args.evidence_root/e['path']
            assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
            evidence_count+=1
    result={'stage5_source_and_evidence_integrity':'PASS','recorded_behavior_verdict':s['verdict'],'baseline_files':len(rows),'baseline_bytes':sum(e['bytes'] for e in rows),'source_digest':digest(entries),'execution_inputs':len(entries),'repository_evidence_files':len(s['repository_evidence']),'private_evidence_files_verified':evidence_count,'original_A1':'PASS' if args.original_root else 'not_requested','other_subsystems_imported':False,'stage6_started':False,'scope':'Read-only integrity of source and recorded evidence; behavior suites were run previously in disposable copies.'}
    if args.require_git:
        def git(*cmd):
            return subprocess.check_output(['git','-C',str(ROOT),*cmd],encoding='utf-8').strip()
        assert git('branch','--show-current')=='main'
        assert not git('status','--porcelain=v1'),'Worktree is not clean'
        assert git('rev-list','--max-parents=0','HEAD')==m['pre_import_commit']
        assert not git('diff',s['baseline']['source_commit'],'HEAD','--','packages','docs/audits/encounter-atlas/ATLAS_A1_Independent_Test_Report.md','tools/encounter-atlas-independent')
        result['head']=git('rev-parse','HEAD');result['git']='PASS'
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
