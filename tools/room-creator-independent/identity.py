from pathlib import Path
import hashlib,json,zipfile,sys
W=Path(__file__).resolve().parent
BASE=W.parents[1]
OUT=BASE/'outputs/Room_Creator_v0_14_1_Independent_Audit'
OUT.mkdir(parents=True,exist_ok=True)
DEL=BASE/'outputs/Room_Creator_v0_14_1_Remediation'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def manifest(root,file):
    rows=[]
    for line in (root/file).read_text(encoding='utf-8-sig').splitlines():
        if not line.strip():continue
        h,n=line.split(maxsplit=1);n=n.lstrip('* ')
        p=root/n
        rows.append({'file':n,'expected':h.lower(),'actual':sha(p) if p.is_file() else None})
    return {'count':len(rows),'failures':[r for r in rows if r['expected']!=r['actual']]}
inputs=[DEL/n for n in ['Room_Creator_v0_14_1_remediation_candidate.zip','Room_Creator_v0_14_1_Independent_Tester_Handoff.zip','Room_Creator_v0_14_1_source.zip','Room_Creator_v0_14_1_regression_tests.zip','Room_Creator_v0_14_1_reports.zip']]
inputs += [Path('C:/Users/mcdon/Desktop/gamefuse')/n for n in ['Room_Creator_v0_14_asset_library.zip','Trapstar_RoomCreator_Asset_Library_v1.zip']]
inputs += [Path('C:/Users/mcdon/Downloads/Room_Creator_v0_13_1_route_prototype.zip'),BASE/'outputs/Room_Creator_v0_14_Independent_Audit/Room_Creator_v0_14_Audit_Evidence.zip',BASE/'outputs/Room_Creator_v0_14_Independent_Audit/AUDIT_REPORT.md']
rows=[{'path':str(p),'bytes':p.stat().st_size,'sha256':sha(p)} for p in inputs]
if '--final' not in sys.argv:
    for p,d in [(inputs[0],'candidate'),(inputs[1],'handoff'),(inputs[-2],'prior-evidence')]:
        with zipfile.ZipFile(p) as z:
            assert z.testzip() is None
            for n in z.namelist():assert (W/d/n).resolve().is_relative_to((W/d).resolve())
            z.extractall(W/d)
    # Fresh prior extraction for reproductions; the original and prior audit work stay read only.
    with zipfile.ZipFile(inputs[5]) as z:z.extractall(W/'original')
C=W/'candidate/Room_Creator_v0_14_1_remediation_candidate'
O=W/'original/Room_Creator_v0_14_asset_library'
L=BASE/'work/rc014-audit/dependency/Trapstar_RoomCreator_Asset_Library_v1'
data={'inputs':rows,'delivered':manifest(DEL,'SHA256SUMS.txt'),'candidate':manifest(C,'MANIFEST_SHA256.txt'),'original':manifest(O,'MANIFEST_SHA256.txt'),'library':manifest(L,'CHECKSUMS.sha256')}
data['mapHashes']={str(p):sha(p) for root in [C,O,BASE/'work/rc014-audit/prior-full0131/Room_Creator_v0_13_1_route_prototype'] for p in (root/'examples').glob('Route_Prototype_Street*.json')}
data['candidateFiles']={str(p.relative_to(C)):sha(p) for p in C.rglob('*') if p.is_file() and not any(x in p.parts for x in ['__pycache__'])}
f=OUT/('integrity-final.json' if '--final' in sys.argv else 'identity-initial.json')
f.write_text(json.dumps(data,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in data.items() if k!='candidateFiles'},indent=2))
