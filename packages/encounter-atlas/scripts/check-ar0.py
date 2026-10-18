from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,tempfile,re
root=Path(__file__).resolve().parents[1];folder=root/'evidence/ar0';folder.mkdir(exist_ok=True)
phase=sys.argv[1] if len(sys.argv)>1 else '--all';assert phase in ['--all','--regressions','--evidence']
records=[];log=folder/'executed-commands.json'
if phase=='--evidence' and log.exists():records=json.loads(log.read_text(encoding='utf-8'))
def run(name,args,cwd=root,expected=0):
 p=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=cwd,env=dict(os.environ,PYTHONUTF8='1',M3_CHECKPOINT=str(cwd)),capture_output=True,text=True,encoding='utf-8')
 e={'name':name,'cwd':str(cwd),'executable':shutil.which(args[0]),'args':args[1:],'M3_CHECKPOINT':str(cwd),'exitCode':p.returncode,'expectedExitCode':expected,'stdout':p.stdout,'stderr':p.stderr};records.append(e);(folder/('fresh-'+name+'.json')).write_text(json.dumps(e,indent=2)+'\n',encoding='utf-8');log.write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'name':name,'exitCode':p.returncode,'expectedExitCode':expected,'tail':p.stdout.splitlines()[-8:]}),flush=True);assert p.returncode==expected,(name,p.stderr[-1000:]);return p
run('identity',['python','scripts/identity-ar0.py'])
identity=json.loads((folder/'source-identity.json').read_text(encoding='utf-8'))
if phase in ['--all','--regressions']:
 clone=Path(tempfile.mkdtemp(prefix='encounter-ar0-regression-',dir=root.parent)).resolve();assert clone.parent==root.parent.resolve();shutil.copytree(root,clone,dirs_exist_ok=True)
 for e in identity['files']:assert hashlib.sha256((clone/e['path']).read_bytes()).hexdigest()==e['sha256']
 run('all-inherited-plus-ar0',['python','scripts/check-m3-r3.py'],cwd=clone)
 target=folder/'regression';shutil.copytree(clone/'evidence/m3-d03',target,dirs_exist_ok=True)
 (folder/'regression-source-binding.json').write_text(json.dumps({'AR0SourceDigest':identity['sourceDigest'],'allSourceInputsByteIdentical':True,'disposableExecutionCopy':str(clone),'legacySourceIdentityLabelIsHistoricalToolMetadata':'Canonical AR0 identity is evidence/ar0/source-identity.json; legacy helpers regenerate their own R3-labeled identity only in the disposable copy.'},indent=2)+'\n',encoding='utf-8')
 p=run('independent-r3',['node','--test','--test-reporter=tap','scripts/run-independent-m3-r3.mjs'],expected=1)
 assert re.search(r'^# pass 24$',p.stdout,re.M) and re.search(r'^# fail 1$',p.stdout,re.M) and re.search(r'^# skipped 0$',p.stdout,re.M)
 assert 'not ok 25 - IR3-25 inconsistent rectangle dimensions' in p.stdout
 if re.findall(r'^not ok .*$',p.stdout,re.M)!=[next(x for x in p.stdout.splitlines() if x.startswith('not ok 25 - IR3-25'))]:raise AssertionError('Unexpected independent R3 failure')
if phase in ['--all','--evidence']:run('browser-and-proof-evidence',['node','scripts/generate-ar0-evidence.mjs'])
run('preservation',['python','scripts/preserve-ar0.py'])
