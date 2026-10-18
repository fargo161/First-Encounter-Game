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
def run():
 name,cwd,*args=sys.argv[2:];env=dict(os.environ,PYTHONUTF8='1',ENCOUNTER_CHECKPOINT=str(R/'checkpoint'),M2_BROWSER_EVIDENCE=str(R/'checkpoint/independent/m2-browser-evidence'))
 r=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=cwd,env=env,capture_output=True,text=True,encoding='utf-8',errors='replace')
 (E/(name+'.stdout.txt')).write_text(r.stdout,encoding='utf-8');(E/(name+'.stderr.txt')).write_text(r.stderr,encoding='utf-8');log({'argv':args,'cwd':cwd,'exitCode':r.returncode,'stdout':name+'.stdout.txt','stderr':name+'.stderr.txt'})
 print(r.stdout);print(r.stderr,file=sys.stderr);sys.exit(r.returncode)

def identity():
 outer=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_R2_Independent_Rereview_Handoff.zip');h=R/'handoff';p=h/'Encounter_M3_Checkpoint_R2.zip';d=json.loads((h/'Encounter_M3_Checkpoint_R2.identity.json').read_text(encoding='utf-8'))
 expected={'sha256':'c3c866834b64aebc573b42e2839e173bed486cdc8125a0287ddcd952f43a1a10','bytes':94187091,'sourceRevision':'M3-runtime-v1-R2-D02','sourceDigest':'7bbf91958abfb963830f412136baab95601da19cebc6673bf6d72207d18766d0','buildSHA256':'7cbc1251a627631cf352e8a0cd8c5c78b93b76fedd1205a1e84676bfcecfbbe8','previousR1SHA256':'f7afae2bfa1b75a4a8ec3e2ded09a7845671dbfb0ca9fc5ad487c655c6a68ed4','originalM3SHA256':'de808fbdbf6929c5c9cf7915ea982086d5796c7c004b16ec0a882e58170f3b64','baselineM2SHA256':'940a0bfaed6e45861d425a899afcb29cd518f25a25ed2d877b5c1524a1421bd7'}
 for k,v in expected.items(): assert d[k]==v,(k,d[k])
 with zipfile.ZipFile(outer) as z:
  safe(z.namelist());assert z.testzip() is None
  for i in z.infolist(): assert (h/i.filename).read_bytes()==z.read(i)
 assert sha(p.read_bytes())==d['sha256'] and p.stat().st_size==d['bytes']
 assert not (R/'checkpoint').exists()
 with zipfile.ZipFile(p) as z: records=verify(z,d['files']);assert len(records)==1152;z.extractall(R/'checkpoint')
 c=R/'checkpoint';s=json.loads((c/'evidence/m3/source-identity.json').read_text(encoding='utf-8'));entries=[{'path':x['path'],'sha256':sha((c/x['path']).read_bytes())} for x in s['files']]
 digest=sha(json.dumps(entries,sort_keys=True,separators=(',',':')).encode());assert digest==d['sourceDigest'] and len(entries)==61
 assert sha((c/'dist-m3/index.html').read_bytes())==d['buildSHA256']
 previous=[]
 for label,zk,ik,hk,dest in [('R1','historical/Encounter_M3_Checkpoint_R1.zip','historical/Encounter_M3_Checkpoint_R1.identity.json','previousR1SHA256','r1-checkpoint'),('original','historical/Encounter_M3_Checkpoint.zip','historical/Encounter_M3_Checkpoint.identity.json','originalM3SHA256','original-checkpoint')]:
  zp=c/zk;assert sha(zp.read_bytes())==d[hk];md=json.loads((c/ik).read_text(encoding='utf-8'))
  with zipfile.ZipFile(zp) as z: rec=verify(z,md['files']);z.extractall(R/dest)
  previous.append({'label':label,'sha256':sha(zp.read_bytes()),'members':len(rec)})
  if label=='R1': old=rec
 assert sha((c/'baseline/Encounter_M2_Checkpoint.zip').read_bytes())==d['baselineM2SHA256']
 changes=[x['path'] for x in old if not (c/x['path']).is_file() or sha((c/x['path']).read_bytes())!=x['sha256']]
 production=[x for x in changes if x.startswith(('src/','content/'))];added=sorted({x['path'] for x in records}-{x['path'] for x in old});assert production==['src/m3/ui.mjs'];assert not [x for x in added if x.startswith(('src/','content/'))]
 write('identity-verification.json',{'outerSha256':sha(outer.read_bytes()),'identitySha256':sha((h/'Encounter_M3_Checkpoint_R2.identity.json').read_bytes()),**expected,'memberCount':len(records),'allMembersMatch':True,'unsafeDuplicateCaseCollisionMissingExtra':False,'files':records,'historical':previous})
 write('independent-source-identity.json',{'sourceRevision':s['sourceRevision'],'sourceDigest':digest,'files':entries})
 write('independent-preservation-diff.json',{'changedOldMembers':changes,'changedProduction':production,'addedPaths':added})
 write('input-preservation.json',[{'path':str(x),'bytes':x.stat().st_size,'sha256':sha(x.read_bytes())} for x in [outer,*h.iterdir()] if x.is_file()])
 write('environment.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'platform':platform.platform(),'python':sys.version,'pythonExecutable':sys.executable,'cwd':str(Path.cwd()),'reviewRoot':str(R)})
 print(json.dumps({'identity':'PASS','members':len(records),'sourceDigest':digest,'productionChanges':production,'changedOldMembers':changes}))

if __name__=='__main__':
 if sys.argv[1]=='identity':identity();log({'argv':sys.argv,'exitCode':0})
 elif sys.argv[1]=='run':run()
