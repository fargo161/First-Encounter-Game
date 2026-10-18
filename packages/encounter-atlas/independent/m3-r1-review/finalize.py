from pathlib import Path
import json,hashlib,zipfile,re,shutil,datetime
R=Path(__file__).resolve().parent;E=R/'evidence';OUT=R.parents[1]/'outputs';sha=lambda b:hashlib.sha256(b).hexdigest()
def write(n,v):(E/n).write_text(json.dumps(v,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def preserve():
 d=json.loads((R/'handoff/Encounter_M3_Checkpoint_R1.identity.json').read_text(encoding='utf-8'));initial=json.loads((E/'identity-verification.json').read_text(encoding='utf-8'))
 p=R/'handoff/Encounter_M3_Checkpoint_R1.zip';assert sha(p.read_bytes())==initial['sha256'];assert p.stat().st_size==28146000
 ident=R/'handoff/Encounter_M3_Checkpoint_R1.identity.json';assert sha(ident.read_bytes())==initial['identitySha256']
 actual={p.relative_to(R/'checkpoint').as_posix() for p in (R/'checkpoint').rglob('*') if p.is_file()};assert actual=={x['path'] for x in d['files']}
 for x in d['files']:
  b=(R/'checkpoint'/x['path']).read_bytes();assert len(b)==x['bytes'] and sha(b)==x['sha256'],x['path']
 od=json.loads((R/'checkpoint/historical/Encounter_M3_Checkpoint.identity.json').read_text(encoding='utf-8'))
 for x in od['files']:assert sha((R/'failed-checkpoint'/x['path']).read_bytes())==x['sha256'],x['path']
 assert sha((R/'checkpoint/historical/Encounter_M3_Checkpoint.identity.json').read_bytes())=='d025fe33a6a2773e88e249ce3c624280fca70921c8f541617ec8e92d4302abf4'
 outer=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_R1_Independent_Rereview_Handoff.zip');assert sha(outer.read_bytes())==initial['outerSha256']
 assert (R/'handoff/M3_D01_Remediation_Report.md').read_bytes()==(R/'checkpoint/M3_D01_Remediation_Report.md').read_bytes()
 inputs=[{'path':p.name,'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for p in (R/'handoff').iterdir() if p.is_file()]
 write('final-preservation.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'r1ZipSha256':sha(p.read_bytes()),'r1IdentitySha256':sha(ident.read_bytes()),'all592R1MembersUnchanged':True,'noMissingExtraExtractedFiles':True,'all189FailedControlMembersUnchanged':True,'originalOuterHandoffUnchanged':True,'looseRemediationReportEqualsCheckpointMember':True,'inputFiles':inputs,'files':d['files']})
def commands():
 candidates=[]
 for day in ['17','18']:
  folder=Path(r'C:\Users\mcdon\.codex\sessions\2026\10')/day
  if not folder.exists():continue
  for p in folder.glob('*01a1483b*.jsonl'):
   rows=[json.loads(s) for s in p.read_text(encoding='utf-8').splitlines()]
   for i,x in enumerate(rows):
    d=x.get('payload',{})
    if d.get('role')=='user' and d.get('type')=='message':
     text=' '.join(c.get('text','') for c in d.get('content',[]))
     if 'remediated R1 checkpoint only' in text:candidates.append((x['timestamp'],rows[i+1:]))
 assert candidates;rows=max(candidates,key=lambda x:x[0])[1];calls=[];byid={}
 def plain(x):
  if isinstance(x,str):return x
  if isinstance(x,list):return '\n'.join(plain(y) for y in x)
  if isinstance(x,dict):return x.get('text','')
  return ''
 for x in rows:
  if x['type']!='response_item':continue
  d=x['payload'];kind=d.get('type');cid=d.get('call_id')
  if kind in ['function_call','custom_tool_call']:
   v={'utc':x['timestamp'],'tool':d.get('name'),'callId':cid,'exactInput':d.get('arguments',d.get('input','')),'outputAvailableAtFreeze':False};calls.append(v);byid[cid]=v
  elif kind in ['function_call_output','custom_tool_call_output'] and cid in byid:
   out=plain(d.get('output'));byid[cid].update({'outputAvailableAtFreeze':True,'outputText':out,'reportedExitCodes':[int(x) for x in re.findall(r'"exit_code"\s*:\s*(-?\d+)',out)]})
 shell=[];browser=[]
 for x in calls:
  for literal in re.findall(r'\bcmd\s*:\s*("(?:\\.|[^"\\])*")',x['exactInput']):shell.append({'utc':x['utc'],'command':json.loads(literal),'reportedExitCodes':x.get('reportedExitCodes',[]),'toolCallId':x['callId']})
  if x['tool']=='js':
   try:args=json.loads(x['exactInput'])
   except:continue
   if 'code' in args:browser.append({'utc':x['utc'],**args,'outputText':x.get('outputText','')})
 write('exact-tool-command-log.json',calls);write('exact-shell-command-log.json',shell);write('exact-browser-command-log.json',browser);print('Exact command records:',len(calls),'tool calls;',len(shell),'shell commands;',len(browser),'browser calls')
def bundle():
 name='M3_R1_Independent_Test_Evidence';report='M3_R1_Independent_Test_Report.md';assert (R/report).exists();OUT.mkdir(exist_ok=True)
 destinations=[name+'.zip',name+'.identity.json',report,'M3_R1_Independent_Rendering_Tests.test.mjs','M3_R1_D02_Offscreen_Notice.jpg','M3_R1_D02_Closure_Result.jpg','M3_R1_Visible_Notice_Control.jpg']
 for n in destinations:assert not (OUT/n).exists(),('Refuse overwrite',n)
 files={p.name:p for p in R.iterdir() if p.is_file() and p.suffix in ('.mjs','.py','.md')}
 files.update({p.relative_to(R).as_posix():p for p in E.rglob('*') if p.is_file()})
 files.update({'reviewed-checkpoint/'+p.name:p for p in (R/'handoff').iterdir() if p.is_file()})
 entries=[{'path':n,'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for n,p in sorted(files.items())]
 target=OUT/(name+'.zip')
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for n,p in sorted(files.items()):z.write(p,n)
  z.writestr('EVIDENCE_MANIFEST.json',json.dumps({'purpose':'Independent M3 R1 re-review; fresh evidence under evidence/. Frozen supplied checkpoint is identified input.','files':entries},indent=2)+'\n')
 with zipfile.ZipFile(target) as z:
  assert z.testzip() is None
  for x in entries:assert sha(z.read(x['path']))==x['sha256']
 shutil.copy2(R/report,OUT/report);shutil.copy2(R/'independent-r1-display.test.mjs',OUT/'M3_R1_Independent_Rendering_Tests.test.mjs')
 for src,dst in [('D02-horizontal-verified-before-send.jpg','M3_R1_D02_Offscreen_Notice.jpg'),('D02-horizontal-verified-result.jpg','M3_R1_D02_Closure_Result.jpg'),('verified-visible-before-send.jpg','M3_R1_Visible_Notice_Control.jpg')]:shutil.copy2(E/src,OUT/dst)
 record={'artifact':target.name,'bytes':target.stat().st_size,'sha256':sha(target.read_bytes()),'members':len(entries)+1,'allMembersVerified':True};(OUT/(name+'.identity.json')).write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
if __name__=='__main__':
 import sys
 preserve();commands()
 if '--bundle' in sys.argv:bundle()
