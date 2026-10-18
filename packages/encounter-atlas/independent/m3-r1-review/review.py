from pathlib import Path
import json,hashlib,zipfile,re,stat,sys,platform,subprocess,shutil,os,datetime
R=Path(__file__).resolve().parent;E=R/'evidence';E.mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
def write(n,d):(E/n).write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def log(d):
 with (E/'commands.jsonl').open('a',encoding='utf-8') as f:f.write(json.dumps({'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),**d})+'\n')
def safe(names):
 seen=set()
 for n in names:
  assert n and '\\' not in n and not n.startswith('/') and not re.search(r'[\x00-\x1f:]',n),('unsafe',n)
  assert all(p not in ('','..','.') and not p.endswith((' ','.')) and not re.match(r'(?i)^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)',p) for p in n.split('/')),('unsafe',n)
  assert n.casefold() not in seen,('duplicate/collision',n)
  seen.add(n.casefold())
def verify(z,entries):
 names=z.namelist();safe(names);safe([x['path'] for x in entries]);assert set(names)=={x['path'] for x in entries}
 records=[]
 for x in entries:
  i=z.getinfo(x['path']);assert not i.is_dir();assert stat.S_IFMT(i.external_attr>>16) not in (stat.S_IFLNK,stat.S_IFCHR,stat.S_IFBLK,stat.S_IFIFO,stat.S_IFSOCK)
  b=z.read(i);actual={'path':i.filename,'bytes':len(b),'sha256':sha(b)};assert actual==x,actual;records.append(actual)
 assert z.testzip() is None
 return records
def identity():
 outer=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_R1_Independent_Rereview_Handoff.zip');assert not (R/'handoff').exists() and not (R/'checkpoint').exists()
 with zipfile.ZipFile(outer) as z:
  safe(z.namelist());assert set(z.namelist())=={'Encounter_M3_Checkpoint_R1.zip','Encounter_M3_Checkpoint_R1.identity.json','M3_D01_Remediation_Report.md','Encounter_M3_Checkpoint_R1_Verification.json'};assert z.testzip() is None;z.extractall(R/'handoff')
 d=json.loads((R/'handoff/Encounter_M3_Checkpoint_R1.identity.json').read_text(encoding='utf-8'));p=R/'handoff/Encounter_M3_Checkpoint_R1.zip'
 expected={'sha256':'f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4','bytes':28146000,'sourceRevision':'M3-runtime-v1-R1-D01','sourceDigest':'35fa58990b19a08933fefb7e2f37ba1d5c5edc5807390354eae238e531588711','buildSHA256':'11393dde2ae110d3b04aac03c1044e000be6b410e4bffacb16216829c9050052','previousM3SHA256':'de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64','baselineM2SHA256':'940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7'}
 for k,v in expected.items():assert d[k]==v,(k,d[k])
 assert sha(p.read_bytes())==d['sha256'] and p.stat().st_size==d['bytes']
 with zipfile.ZipFile(p) as z:records=verify(z,d['files']);assert len(records)==592;z.extractall(R/'checkpoint')
 write('identity-verification.json',{'outerSha256':sha(outer.read_bytes()),'identitySha256':sha((R/'handoff/Encounter_M3_Checkpoint_R1.identity.json').read_bytes()),**expected,'memberCount':len(records),'allMembersMatch':True,'unsafeDuplicateCaseCollisionMissingExtra':False,'files':records})
 source=json.loads((R/'checkpoint/evidence/m3/source-identity.json').read_text(encoding='utf-8'));entries=[{'path':x['path'],'sha256':sha((R/'checkpoint'/x['path']).read_bytes())} for x in source['files']]
 digest=sha(json.dumps(entries,sort_keys=True,separators=(',',':')).encode());assert digest==expected['sourceDigest'];assert len(entries)==54
 write('independent-source-identity.json',{'sourceRevision':source['sourceRevision'],'sourceDigest':digest,'files':entries})
 old=R/'checkpoint/historical/Encounter_M3_Checkpoint.zip';oldid=R/'checkpoint/historical/Encounter_M3_Checkpoint.identity.json';assert sha(old.read_bytes())==expected['previousM3SHA256'];od=json.loads(oldid.read_text(encoding='utf-8'))
 with zipfile.ZipFile(old) as z:previous=verify(z,od['files']);z.extractall(R/'failed-checkpoint')
 write('failed-checkpoint-verification.json',{'sha256':sha(old.read_bytes()),'members':len(previous),'files':previous})
 assert sha((R/'checkpoint/baseline/Encounter_M2_Checkpoint.zip').read_bytes())==expected['baselineM2SHA256']
 changes=[]
 for x in previous:
  current=R/'checkpoint'/x['path']
  if not current.exists() or sha(current.read_bytes())!=x['sha256']:changes.append(x['path'])
 production=[n for n in changes if n.startswith(('src/','content/'))];assert production==['src/m3/ui.mjs'],production
 write('independent-preservation-diff.json',{'oldMemberCount':len(previous),'changedOldMembers':changes,'changedProduction':production,'addedPaths':sorted({x['path'] for x in records}-{x['path'] for x in previous})})
 write('environment.json',{'platform':platform.platform(),'python':sys.version,'pythonExecutable':sys.executable,'cwd':str(Path.cwd()),'reviewRoot':str(R)})
 print(json.dumps({'identity':'PASS','members':len(records),'sourceDigest':digest,'productionChanges':production,'oldMemberChanges':changes}))
def run():
 name,cwd,*args=sys.argv[2:];env=dict(os.environ,PYTHONUTF8='1',ENCOUNTER_CHECKPOINT=str(R/'checkpoint'),M2_BROWSER_EVIDENCE=str(R/'checkpoint/independent/m2-browser-evidence'))
 r=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=cwd,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
 (E/(name+'.stdout.txt')).write_text(r.stdout,encoding='utf-8');(E/(name+'.stderr.txt')).write_text(r.stderr,encoding='utf-8');log({'argv':args,'cwd':cwd,'exitCode':r.returncode,'stdout':name+'.stdout.txt','stderr':name+'.stderr.txt'})
 print(r.stdout);print(r.stderr,file=sys.stderr);sys.exit(r.returncode)
if __name__=='__main__':
 if sys.argv[1]=='identity':identity();log({'argv':sys.argv,'exitCode':0})
 elif sys.argv[1]=='run':run()
