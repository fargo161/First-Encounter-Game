"""Read-only verification for the authorized Stages 0-3 foundation."""
from pathlib import Path
import argparse, hashlib, json, os, subprocess

ROOT=Path(__file__).resolve().parents[1]
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def tracked_payload():
    result=[]
    for base,dirs,files in os.walk(ROOT):
        dirs[:]=[d for d in dirs if d not in {'.git','__pycache__'}]
        result.extend(Path(base)/f for f in files)
    return sorted(result,key=lambda p:p.relative_to(ROOT).as_posix())
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--archive-root',type=Path)
    ap.add_argument('--verify-originals',action='store_true')
    ap.add_argument('--require-git',action='store_true')
    args=ap.parse_args()
    inventory_path=ROOT/'docs/provenance/foundation-file-inventory.json'
    expected=read(inventory_path)
    actual={p.relative_to(ROOT).as_posix() for p in tracked_payload()}
    wanted={e['path']for e in expected['files']}|{inventory_path.relative_to(ROOT).as_posix()}
    assert actual==wanted,{'missing':sorted(wanted-actual),'extra':sorted(actual-wanted)}
    for e in expected['files']:
        p=ROOT/e['path']
        assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],e['path']
        assert p.suffix in {'.md','.json','.py'} or p.name in {'.gitignore','.gitattributes'},str(p)
        assert not p.read_bytes().startswith((b'PK\x03\x04',b'\x89PNG',b'glTF')),str(p)
    authority=read(ROOT/'docs/provenance/source-authority.json')
    assert authority['authorized_stages']==[0,1,2,3]
    assert authority['subsystem_source_imported'] is False
    assert authority['repository']['visibility']=='private'
    assert authority['repository']['branch']=='main'
    assert authority['repository']['legacy_history_reused'] is False
    assert authority['subsystems']['encounter_atlas']['acceptance']=='ACCEPTED_ATLAS_A1_WITH_PRESERVED_ENCOUNTER_DEPENDENCIES'
    assert authority['subsystems']['room_creator']['acceptance']=='HOLD_FOR_FURTHER_REMEDIATION'
    assert authority['subsystems']['zant']['current_work_acceptance']=='GATE_A_FAILED_AT_G_SLEEVE_PILOT'
    assert authority['subsystems']['zant']['neutral_acceptance']=='OWNER_ACCEPTED_R4_CANDIDATE02'
    for name in ['encounter-atlas','room-creator','zant']:
        assert sorted(p.name for p in (ROOT/'packages'/name).iterdir())==['README.md'],name
    assert not (ROOT/'runtime').exists(),'Unity/runtime initialization is outside this stage'
    assert not list((ROOT/'.github').rglob('*.yml')) and not list((ROOT/'.github').rglob('*.yaml'))
    attrs=(ROOT/'.gitattributes').read_text(encoding='utf-8')
    assert 'filter=lfs' not in attrs and attrs.startswith('* -text')
    for name in ['FIRST_ENCOUNTER_GAME_AUTHORIZE_STAGES_0_TO_3.md','GITHUB_CONSOLIDATION_AUDIT_LAUNCH.md']:
        entry=authority['governing_documents'][name]
        assert sha(ROOT/entry['repository_path'])==entry['sha256']
    result={'foundation':'PASS','foundation_files':len(actual),'subsystem_source_imported':False,'legacy_history_reused':False,'unity_initialized':False,'lfs_configured':False}
    if args.archive_root:
        archive=args.archive_root.resolve()
        ref=read(ROOT/'docs/provenance/preservation-checkpoint.json')
        assert sha(archive/'preservation-report.json')==ref['preservation_report_sha256']
        assert sha(archive/'archive-inventory.json')==ref['archive_inventory_sha256']
        preservation=read(archive/'preservation-report.json')
        assert preservation['complete'] is True
        inv=read(archive/'archive-inventory.json')
        for e in inv['files']:
            relative=Path(e['archive_path'])
            assert not relative.is_absolute() and '..' not in relative.parts
            p=archive/relative
            assert p.stat().st_size==e['bytes'] and sha(p)==e['sha256'],str(p)
            if args.verify_originals:
                p=Path(e['source_path']);st=p.stat()
                assert st.st_size==e['bytes'] and st.st_mtime_ns==e['source_mtime_ns'] and sha(p)==e['sha256'],str(p)
        if args.verify_originals:
            for group in preservation['tree_summaries']:
                root=Path(group['source_root']);paths=set()
                for base,dirs,files in os.walk(root):
                    dirs[:]=[d for d in dirs if d not in {'.git','__pycache__','node_modules','.venv'}]
                    paths.update((Path(base)/f).relative_to(root).as_posix()for f in files)
                wanted={e['relative_path']for e in inv['files']if e['group']==group['id']}
                assert paths==wanted,group['id']
        result.update({'archive':'PASS','archive_files':len(inv['files']),'originals':'PASS'if args.verify_originals else 'not_requested','storage':'local_same_drive_checkpoint'})
    elif args.verify_originals:
        raise ValueError('--verify-originals requires --archive-root')
    if args.require_git:
        env=dict(os.environ)
        for k in ['GIT_DIR','GIT_WORK_TREE','GIT_INDEX_FILE','GIT_COMMON_DIR']:env.pop(k,None)
        def git(*cmd):return subprocess.check_output(['git','--no-optional-locks','-C',str(ROOT),*cmd],env=env,text=True).strip()
        assert git('branch','--show-current')=='main'
        assert not git('status','--porcelain=v1'),'Repository is not clean'
        roots=git('rev-list','--max-parents=0','HEAD').splitlines()
        assert len(roots)==1
        assert not any(x.startswith('parent ')for x in git('cat-file','-p',roots[0]).splitlines())
        assert set(git('ls-files').splitlines())==actual
        result.update({'git':'PASS','head':git('rev-parse','HEAD'),'root_commit':roots[0],'commit_count':int(git('rev-list','--count','HEAD'))})
    print(json.dumps(result,indent=2))
if __name__=='__main__':main()
