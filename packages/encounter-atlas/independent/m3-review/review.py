import sys,json,hashlib,zipfile,re,stat,subprocess,platform,datetime,shutil,os
from pathlib import Path
ROOT=Path(__file__).resolve().parent
E=ROOT/'evidence'; E.mkdir(exist_ok=True)
def sha(b): return hashlib.sha256(b).hexdigest()
def save(n,d): (E/n).write_text(json.dumps(d,indent=2,ensure_ascii=False),encoding='utf-8')
def log(d):
 with (E/'commands.jsonl').open('a',encoding='utf-8') as f: f.write(json.dumps({'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),**d})+'\n')
def safe(names):
 seen=set()
 for n in names:
  assert n and '\\' not in n and not n.startswith('/') and not re.search(r'[\x00-\x1f:]',n),('unsafe',n)
  parts=n.split('/')
  assert all(p not in ('','..','.') and not p.endswith((' ','.')) and not re.match(r'(?i)^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)',p) for p in parts),('unsafe',n)
  assert n.casefold() not in seen,('collision',n)
  seen.add(n.casefold())
def verify(z,entries,allowed_extra=()):
 names=z.namelist(); safe(names); safe([x['path'] for x in entries])
 assert set(names)=={x['path'] for x in entries}|set(allowed_extra)
 records=[]
 for x in entries:
  info=z.getinfo(x['path']); assert not info.is_dir(); assert stat.S_IFMT(info.external_attr>>16) not in (stat.S_IFLNK,stat.S_IFBLK,stat.S_IFCHR,stat.S_IFIFO,stat.S_IFSOCK)
  b=z.read(info); actual={'path':x['path'],'bytes':len(b),'sha256':sha(b)}
  assert actual==x,actual
  records.append(actual)
 assert z.testzip() is None
 return records
def identity():
 outer=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_Independent_Tester_Handoff_v1.zip')
 prompt=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_Independent_Tester_Prompt.md')
 assert not (ROOT/'handoff').exists() and not (ROOT/'checkpoint').exists(),'fresh extraction required'
 with zipfile.ZipFile(outer) as z:
  m=json.loads(z.read('HANDOFF_MANIFEST.json')); records=verify(z,m['files'],['HANDOFF_MANIFEST.json'])
  assert z.read('Encounter_M3_Independent_Tester_Prompt.md')==prompt.read_bytes()
  z.extractall(ROOT/'handoff')
 save('outer-verification.json',{'sha256':sha(outer.read_bytes()),'members':len(records)+1,'files':records,'externalPromptIdentical':True})
 p=ROOT/'handoff/inputs/Encounter_M3_Checkpoint.zip'; ident=ROOT/'handoff/inputs/Encounter_M3_Checkpoint.identity.json'; d=json.loads(ident.read_text(encoding='utf-8'))
 assert sha(p.read_bytes())==d['sha256']=='de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64'
 assert p.stat().st_size==d['bytes']==7534657
 with zipfile.ZipFile(p) as z:
  assert len(z.infolist())==len(d['files'])==189
  records=verify(z,d['files']); z.extractall(ROOT/'checkpoint')
 save('identity-verification.json',{'zipSha256':sha(p.read_bytes()),'zipBytes':p.stat().st_size,'identitySha256':sha(ident.read_bytes()),'memberCount':len(records),'unsafeDuplicateCaseCollisionMissingExtra':False,'files':records})
 save('environment.json',{'platform':platform.platform(),'python':sys.version,'pythonExecutable':sys.executable,'cwd':str(Path.cwd()),'reviewRoot':str(ROOT)})
 print('PASS: outer handoff, external prompt, exact checkpoint and every one of 189 members; fresh extraction complete')
def run():
 name,cwd,*args=sys.argv[2:]; started=datetime.datetime.now(datetime.timezone.utc).isoformat()
 r=subprocess.run(args,cwd=cwd,capture_output=True,text=True,encoding='utf-8',errors='replace')
 (E/(name+'.stdout.txt')).write_text(r.stdout,encoding='utf-8'); (E/(name+'.stderr.txt')).write_text(r.stderr,encoding='utf-8')
 log({'started':started,'argv':args,'cwd':cwd,'exitCode':r.returncode,'stdout':name+'.stdout.txt','stderr':name+'.stderr.txt'})
 print(r.stdout); print(r.stderr,file=sys.stderr); sys.exit(r.returncode)
def regressions():
 c=ROOT/'tooling-clone'; assert not c.exists(); shutil.copytree(ROOT/'checkpoint',c)
 env=dict(os.environ,ENCOUNTER_CHECKPOINT=str(c),M2_BROWSER_EVIDENCE=str(c/'independent/m2-browser-evidence'),PYTHONUTF8='1')
 for name,args in [('node-version',['node','--version']),('npm-version',['npm.cmd','--version']),('git-version',['git','--version']),('fresh-checkpoint-verifier',['python','scripts/verify-checkpoint.py',str(ROOT/'handoff/inputs/Encounter_M3_Checkpoint.identity.json')]),('fresh-checks',['python','scripts/check-m3.py'])]:
  r=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=c,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
  (E/(name+'.stdout.txt')).write_text(r.stdout,encoding='utf-8'); (E/(name+'.stderr.txt')).write_text(r.stderr,encoding='utf-8')
  log({'argv':args,'cwd':str(c),'exitCode':r.returncode,'environmentBinding':{k:env[k] for k in ['ENCOUNTER_CHECKPOINT','M2_BROWSER_EVIDENCE']}})
  print(name,r.returncode,r.stdout[-4000:],r.stderr[-1000:],flush=True)
  assert r.returncode==0
 for p in (c/'evidence/m3').glob('fresh-*'): shutil.copy2(p,E/p.name)
 shutil.copy2(c/'evidence/m3/executed-commands.json',E/'regression-command-details.json')
 d=json.loads((ROOT/'handoff/inputs/Encounter_M3_Checkpoint.identity.json').read_text(encoding='utf-8'))
 changed=[x['path'] for x in d['files'] if sha((c/x['path']).read_bytes())!=x['sha256']]
 save('regeneration-changed-files.json',changed)
 print('Fresh regeneration changed:',changed)
if __name__=='__main__':
 if sys.argv[1]=='identity':
  try: identity()
  except Exception as e: log({'argv':sys.argv,'exitCode':1,'error':repr(e)}); raise
  log({'argv':sys.argv,'exitCode':0})
 elif sys.argv[1]=='run': run()
 elif sys.argv[1]=='regressions': regressions()
