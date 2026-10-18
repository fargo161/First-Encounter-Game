"""Read-only R4 archive, manifest and history audit; external JSON outputs only."""
from pathlib import Path,PurePosixPath
import hashlib,json,platform,sys,datetime,zipfile
R=Path(__file__).resolve().parent
W=R.parent.parent
NAME='C001_ZANT_GATE_A_R4_NEUTRAL_REVIEW_CANDIDATE_01'
D=W/'work/C001_ZANT_GATE_A_R4_NEUTRAL/deliverables'
Z=D/(NAME+'.zip');F=D/NAME;E=R/'fresh_extraction';P=E/NAME
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def sha(p):
    with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def write(name,obj):(R/name).write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')
def inventory(root):return {p.relative_to(root).as_posix():{'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(root.rglob('*')) if p.is_file()}
def diff(a,b):return {'expectedFiles':len(a),'actualFiles':len(b),'changed':sorted(p for p in a.keys()&b.keys() if a[p]!=b[p]),'missing':sorted(a.keys()-b.keys()),'added':sorted(b.keys()-a.keys())}
def manifest(root):
    es=read(root/'manifest.json')['files'];assert len({e['path'] for e in es})==len(es)
    for e in es:
        p=PurePosixPath(e['path']);assert not p.is_absolute() and '..' not in p.parts and '\\' not in e['path']
    actual=inventory(root);actual.pop('manifest.json')
    return diff({e['path']:{'bytes':e['bytes'],'sha256':e['sha256']} for e in es},actual)
def history():
    baseline=read(P/'validation/preservation_baseline.json')['roots']
    result={}
    for key,entry in baseline.items():
        path=(W/entry['path']).resolve();assert path.is_relative_to(W)
        result[key]=diff(entry['files'],inventory(path))
    result['A25MatchesR2']={name:sha(P/'assets'/name)==sha(W/'work/C001_ZANT_GATE_A_R2_A25/assets'/name) for name in ('A25_head_front_neutral_rgba.png','A25_head_front_silhouette.png')}
    result['sourceReferenceMatchesOriginal']=sha(P/'references/C001_source_neutral_rgba.png')==sha(W/'work/ZANT_analysis_sources/original/characters trapstar source/C001_source_neutral_rgba.png')
    return result
def prepare():
    assert not E.exists()
    external=read(D/(NAME+'_HASHES.json'))
    assert Z.stat().st_size==external['zipBytes'] and sha(Z)==external['zipSha256']
    before=inventory(F)
    with zipfile.ZipFile(Z) as z:
        names=z.namelist();assert len(set(names))==len(names)
        assert all(not PurePosixPath(n).is_absolute() and '..' not in PurePosixPath(n).parts and '\\' not in n and PurePosixPath(n).parts[0]==NAME for n in names)
        assert z.testzip() is None;z.extractall(E)
    assert sha(P/'manifest.json')==external['manifestSha256']
    result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'environment':{'python':sys.version,'executable':sys.executable,'platform':platform.platform(),'workspace':str(W)},
        'archive':{'bytes':Z.stat().st_size,'sha256':sha(Z),'matchesExternalHash':True,'crc':'PASS','entries':len(names)},
        'manifestSha256':sha(P/'manifest.json'),'matchesExternalManifestHash':True,
        'declaredStatus':read(P/'manifest.json')['status'],'freshManifest':manifest(P),'deliveredManifest':manifest(F),
        'deliveredVersusFresh':diff(before,inventory(P)),'preservation':history()}
    write('packet_inventory_before.json',inventory(P));write('delivered_inventory_before.json',before)
    author=D/'fresh_author_audit_results/verification.json'
    result['deliveredAuthorAudit']={'exists':author.is_file(),'sha256':sha(author) if author.is_file() else None,'matchesHandoffSha256':author.is_file() and sha(author)=='1229bb96e1460fa8f724f9fff9c7beaa106a8b8f1f0d18854a95ef7bbd138ab9'}
    write('integrity_initial.json',result);print(json.dumps(result,indent=2))
def finish():
    initial=read(R/'integrity_initial.json')
    result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'archiveSha256':sha(Z),'archiveUnchanged':sha(Z)==initial['archive']['sha256'],
        'freshManifest':manifest(P),'freshUnchanged':diff(read(R/'packet_inventory_before.json'),inventory(P)),
        'deliveredUnchanged':diff(read(R/'delivered_inventory_before.json'),inventory(F)),'preservation':history()}
    write('integrity_final.json',result);print(json.dumps(result,indent=2))
if __name__=='__main__':{'prepare':prepare,'finish':finish}[sys.argv[1]]()
