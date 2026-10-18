from pathlib import Path
import hashlib,zipfile,json,subprocess,sys,shutil,importlib.util,difflib
W=Path(__file__).resolve().parent;B=W.parents[1];O=B/'outputs/Room_Creator_v0_14_1_Independent_Audit';C=W/'candidate/Room_Creator_v0_14_1_remediation_candidate';P=W/'original/Room_Creator_v0_14_asset_library'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
# Independent originals of the prior audit probes, changing paths and outputs only.
for version,root in [('original',P),('candidate',C)]:
    script=(B/'work/rc014-audit/independent_data.cjs').read_text()
    script=script.replace("require('./disposable/source/core.js')",f"require({json.dumps(str(root/'source/core.js'))})")
    script=script.replace("path.resolve(B,'../../outputs/Room_Creator_v0_14_Independent_Audit')",json.dumps(str(O)))
    script=script.replace("path.join(B,'disposable/examples/",f"path.join({json.dumps(str(root))},'examples/")
    script=script.replace('independent-data-probes.json',f'{version}-prior-data-probes.json')
    (W/f'{version}-prior-data.cjs').write_text(script)
    src=(B/'work/rc014-audit/audit_probe.py').read_text()
    src=src.replace("B.parents[1]/'outputs/Room_Creator_v0_14_Independent_Audit'",repr(str(O)))
    src=src.replace("O=\"", "O=Path(\"") if False else src
    src=src.replace('O='+repr(str(O)), 'O=Path('+repr(str(O))+')')
    src=src.replace("PIC=O/'independent-evidence'",f"PIC=O/'{version}-prior-browser'")
    src=src.replace('http://127.0.0.1:8770/pkg/Room_Creator.html',f'http://127.0.0.1:8783/{version}/Room_Creator.html')
    src=src.replace('independent-browser-probes.json',f'{version}-prior-browser-probes.json')
    (W/f'{version}-prior-browser.py').write_text(src)
# Build in separate scratch copies, retain raw old Windows output as an F6 reproduction.
rows=[]
for v,r in [('original',P),('candidate',C)]:
    dst=W/('build-'+v)/'source';shutil.copytree(r/'source',dst,dirs_exist_ok=True)
    p=subprocess.run([sys.executable,str(dst/'build.py')],capture_output=True,text=True)
    f=dst.parent/'Room_Creator.html';rows.append({'version':v,'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr,'bytes':f.stat().st_size,'sha256':sha(f),'packagedSHA256':sha(r/'Room_Creator.html'),'equal':f.read_bytes()==(r/'Room_Creator.html').read_bytes()})
(O/'independent-builds.json').write_text(json.dumps(rows,indent=2))
# Byte-level ZIP reproduction from a second pristine extraction, before any tests write outputs.
with zipfile.ZipFile(B/'outputs/Room_Creator_v0_14_1_Remediation/Room_Creator_v0_14_1_remediation_candidate.zip') as z:z.extractall(W/'package-pristine')
R=W/'package-pristine/Room_Creator_v0_14_1_remediation_candidate'
spec=importlib.util.spec_from_file_location('pack',R/'tests/package_checkpoint.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
zrows=[]
for n in [1,2]:
    f=W/f'reproduced-{n}.zip';digest=m.package(R,f);zrows.append({'file':str(f),'sha256':digest,'bytes':f.stat().st_size,'matchesDelivered':digest=='9b9cd3e9220edbdffbd836154b44d69b5527aa8b0d74300ad546f868a18da78d'})
(O/'independent-packaging.json').write_text(json.dumps(zrows,indent=2))
diff=[]
for f in sorted((C/'source').iterdir()):
    old=P/'source'/f.name
    if old.is_file():
        equal=f.read_bytes()==old.read_bytes();diff.append({'file':f.name,'equal':equal,'original':sha(old),'candidate':sha(f)})
        if not equal and f.suffix in ['.js','.py','.md','.html','.css']:
            (O/('diff-'+f.name+'.txt')).write_text(''.join(difflib.unified_diff(old.read_text('utf-8').splitlines(True),f.read_text('utf-8').splitlines(True),fromfile='v014/'+f.name,tofile='v0141/'+f.name)),encoding='utf-8')
(O/'independent-source-comparison.json').write_text(json.dumps(diff,indent=2))
print(json.dumps({'builds':rows,'packaging':zrows},indent=2))
