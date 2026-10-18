"""Independent R5 failure-packet integrity and history audit. External JSON only."""
from pathlib import Path,PurePosixPath
import datetime,hashlib,json,platform,sys,zipfile
R=Path(__file__).resolve().parent;W=R.parent.parent
NAME='C001_ZANT_GATE_A_R5_FAILED_G_SLEEVE_PILOT'
D=W/'work/C001_ZANT_GATE_A_R5/deliverables';Z=D/(NAME+'.zip');F=D/NAME;E=R/'fresh_extraction';P=E/NAME
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def write(name,o):(R/name).write_text(json.dumps(o,indent=2)+'\n',encoding='utf-8')
def inventory(root):return {p.relative_to(root).as_posix():{'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(root.rglob('*')) if p.is_file()}
def diff(a,b):return {'expectedFiles':len(a),'actualFiles':len(b),'changed':sorted(p for p in a.keys()&b.keys() if a[p]!=b[p]),'missing':sorted(a.keys()-b.keys()),'added':sorted(b.keys()-a.keys())}
def manifest(root):
    es=read(root/'manifest.json')['files'];assert len({e['path'] for e in es})==len(es)
    for e in es:
        p=PurePosixPath(e['path']);assert not p.is_absolute() and '..' not in p.parts and '\\' not in e['path']
    actual=inventory(root);actual.pop('manifest.json')
    return diff({e['path']:{'bytes':e['bytes'],'sha256':e['sha256']} for e in es},actual)
def history():
    result={}
    for key,entry in read(P/'validation/preservation_baseline.json')['roots'].items():
        path=(W/entry['path']).resolve();assert path.is_relative_to(W)
        result[key]=diff(entry['files'],inventory(path))
    return result
def neutral_lock():
    lock=read(P/'contract/ACCEPTED_R4_NEUTRAL_LOCK.json')
    return {'acceptedCandidate':lock['acceptedCandidate'],'filesChecked':len(lock['files']),
        'mismatches':[name for name,e in lock['files'].items() if not (P/name).is_file() or (P/name).stat().st_size!=e['bytes'] or sha(P/name)!=e['sha256']]}
def prepare():
    assert not E.exists();external=read(D/(NAME+'_HASHES.json'))
    assert Z.stat().st_size==external['zipBytes'] and sha(Z)==external['zipSHA256']
    before=inventory(F)
    with zipfile.ZipFile(Z) as z:
        names=z.namelist();assert len(set(names))==len(names)
        assert all(not PurePosixPath(n).is_absolute() and '..' not in PurePosixPath(n).parts and '\\' not in n and PurePosixPath(n).parts[0]==NAME for n in names)
        assert z.testzip() is None;z.extractall(E)
    assert sha(P/'manifest.json')==external['manifestSHA256']
    result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'environment':{'python':sys.version,'executable':sys.executable,'platform':platform.platform(),'workspace':str(W)},
        'archive':{'bytes':Z.stat().st_size,'sha256':sha(Z),'externalHashMatches':True,'crc':'PASS','entries':len(names)},
        'manifestSha256':sha(P/'manifest.json'),'externalManifestHashMatches':True,
        'declaredStatus':read(P/'manifest.json')['status'],'freshManifest':manifest(P),'deliveredManifest':manifest(F),'deliveredVersusFresh':diff(before,inventory(P)),
        'acceptedNeutralLock':neutral_lock(),'preservation':history()}
    author=D/'fresh_builder_audit/verification.json'
    result['builderAudit']={'exists':author.is_file(),'sha256':sha(author) if author.is_file() else None,'matchesHandoffHash':author.is_file() and sha(author)=='e9cc3e5b1a8673e5fb1486e1244eef4fade8e4f1bb2638a125a4c9a83bc93838'}
    write('packet_inventory_before.json',inventory(P));write('delivered_inventory_before.json',before);write('integrity_initial.json',result);print(json.dumps(result,indent=2))
def finish():
    initial=read(R/'integrity_initial.json')
    result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'archiveSha256':sha(Z),'archiveUnchanged':sha(Z)==initial['archive']['sha256'],
        'freshManifest':manifest(P),'freshUnchanged':diff(read(R/'packet_inventory_before.json'),inventory(P)),'deliveredUnchanged':diff(read(R/'delivered_inventory_before.json'),inventory(F)),
        'acceptedNeutralLock':neutral_lock(),'preservation':history()}
    write('integrity_final.json',result);print(json.dumps(result,indent=2))
if __name__=='__main__':{'prepare':prepare,'finish':finish}[sys.argv[1]]()
