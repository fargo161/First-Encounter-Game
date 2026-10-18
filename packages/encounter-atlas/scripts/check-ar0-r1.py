from pathlib import Path
import hashlib,json,os,shutil,subprocess,tempfile,re
root=Path(__file__).resolve().parents[1];ev=root/'evidence/ar0-r1';ev.mkdir(exist_ok=True);records=[]
def run(name,args,cwd=root,expected=0):
 p=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=cwd,env=dict(os.environ,PYTHONUTF8='1'),capture_output=True,text=True,encoding='utf-8');record={'name':name,'cwd':str(cwd),'args':args,'exitCode':p.returncode,'expectedExitCode':expected,'stdout':p.stdout,'stderr':p.stderr};records.append(record);(ev/('fresh-'+name+'.json')).write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');(ev/'executed-commands.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8');print(json.dumps({'name':name,'exitCode':p.returncode,'stdoutLog':'fresh-'+name+'.json'}),flush=True);assert p.returncode==expected,(name,p.stderr[-2000:]);return p
run('identity',['python','scripts/identity-ar0-r1.py']);identity=json.loads((ev/'source-identity.json').read_text())
clone=Path(tempfile.mkdtemp(prefix='encounter-ar0-r1-regression-',dir=root.parent)).resolve();assert clone.parent==root.parent.resolve();shutil.copytree(root,clone,dirs_exist_ok=True)
for e in identity['files']:assert hashlib.sha256((clone/e['path']).read_bytes()).hexdigest()==e['sha256']
run('all-inherited-ar0',['python','scripts/check-ar0.py','--regressions'],cwd=clone)
shutil.copytree(clone/'evidence/ar0',ev/'regression',dirs_exist_ok=True)
(ev/'regression-source-binding.json').write_text(json.dumps({'R1SourceDigest':identity['sourceDigest'],'allSourceInputsMatch':True,'disposableClone':str(clone),'legacyIdentityLabelsAreHistoricalOnly':True},indent=2)+'\n')
p=run('independent-ar0',['node','--test','--test-reporter=tap','scripts/run-independent-ar0.mjs']);assert re.search(r'^# pass 22$',p.stdout,re.M) and re.search(r'^# fail 0$',p.stdout,re.M)
for audience in ['author','player']:
 p=run('conflicting-cli-'+audience,['node','scripts/atlas-export.mjs','independent/ar0-review/evidence/ui-warned.json','evidence/ar0-r1/rejected-'+audience,audience,'independent/ar0-review/evidence/alias-trust-catalog.json'],expected=1);assert 'CONFLICTING_ACTOR_CARD_BINDING' in p.stderr;assert not (ev/('rejected-'+audience+'.json')).exists()
run('preservation',['python','scripts/preserve-ar0-r1.py'])
