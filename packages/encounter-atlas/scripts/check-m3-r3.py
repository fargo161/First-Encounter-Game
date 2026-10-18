"""Fresh complete gates on an identical disposable copy; keep old captures historical."""
from pathlib import Path
import json,os,shutil,subprocess,sys,tempfile,hashlib
root=Path(__file__).resolve().parents[1];folder=root/'evidence/m3-d03';folder.mkdir(parents=True,exist_ok=True)
phase=sys.argv[1] if len(sys.argv)>1 else '--all';assert phase in ['--all','--regressions','--evidence']
log=folder/'executed-commands.json';records=json.loads(log.read_text(encoding='utf-8')) if phase=='--evidence' and log.exists() else []
def run(name,args,cwd=root):
 p=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=cwd,env=dict(os.environ,PYTHONUTF8='1',M3_CHECKPOINT=str(cwd)),capture_output=True,text=True,encoding='utf-8')
 entry={'cwd':str(cwd),'executable':shutil.which(args[0]),'args':args[1:],'environmentBinding':{'M3_CHECKPOINT':str(cwd)},'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr};records.append(entry)
 (folder/('fresh-'+name+'.json')).write_text(json.dumps(entry,indent=2)+'\n',encoding='utf-8');log.write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'command':name,'exitCode':p.returncode,'tail':p.stdout.splitlines()[-8:]}),flush=True)
 if p.returncode:raise SystemExit(p.returncode)
if phase in ['--all','--regressions']:
 run('build',['node','scripts/build-m3.mjs']);run('source-identity',['python','scripts/source-identity-m3.py'])
 identity=json.loads((root/'evidence/m3/source-identity.json').read_text(encoding='utf-8'))
 clone=Path(tempfile.mkdtemp(prefix='encounter-r3-regression-',dir=root.parent)).resolve();assert clone.parent==root.parent.resolve();shutil.copytree(root,clone,dirs_exist_ok=True)
 for e in identity['files']:assert hashlib.sha256((clone/e['path']).read_bytes()).hexdigest()==e['sha256']
 run('inherited-gates',['python','scripts/check-m3-r2.py'],cwd=clone)
 regenerated=json.loads((clone/'evidence/m3/source-identity.json').read_text(encoding='utf-8'));assert regenerated==identity
 for name,subdir in [('m3','m0-m3'),('m3-d01','prior-m3'),('m3-d02','r2')]:
  target=folder/'regression'/subdir;target.mkdir(parents=True,exist_ok=True)
  for p in (clone/'evidence'/name).iterdir():
   if p.is_file() and (p.name.startswith('fresh-') or p.name in ['environment.json','executed-commands.json']):shutil.copy2(p,target/p.name)
 (folder/'regression-source-binding.json').write_text(json.dumps({'sourceRevision':identity['sourceRevision'],'sourceDigest':identity['sourceDigest'],'allSourceInputsByteIdentical':True,'disposableExecutionCopy':str(clone),'historicalCapturesRegeneratedOnlyInDisposableCopy':True},indent=2)+'\n',encoding='utf-8')
 run('independent-r2',['node','--test','--test-reporter=tap','scripts/run-independent-m3-d03.mjs'])
if phase in ['--all','--evidence']:
 run('browser-evidence',['node','scripts/generate-m3-d03-evidence.mjs']);run('preservation',['python','scripts/preserve-m3-r3.py'])
