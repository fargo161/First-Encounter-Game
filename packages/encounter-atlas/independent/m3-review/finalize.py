from pathlib import Path
import json,hashlib,zipfile,shutil,re,datetime
R=Path(__file__).resolve().parent;E=R/'evidence';OUT=R.parents[1]/'outputs'
sha=lambda b:hashlib.sha256(b).hexdigest()
def write(n,x):(E/n).write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def preserve():
 identity=R/'handoff/inputs/Encounter_M3_Checkpoint.identity.json';p=R/'handoff/inputs/Encounter_M3_Checkpoint.zip';d=json.loads(identity.read_text(encoding='utf-8'));before=json.loads((E/'identity-verification.json').read_text(encoding='utf-8'))
 assert sha(p.read_bytes())==d['sha256']==before['zipSha256'];assert sha(identity.read_bytes())==before['identitySha256']
 members=[]
 for x in d['files']:
  b=(R/'checkpoint'/x['path']).read_bytes();assert sha(b)==x['sha256'] and len(b)==x['bytes'],x['path'];members.append({'path':x['path'],'sha256':sha(b),'bytes':len(b)})
 actual={q.relative_to(R/'checkpoint').as_posix() for q in (R/'checkpoint').rglob('*') if q.is_file()};assert actual=={x['path'] for x in d['files']}
 original=Path(r'C:\Users\mcdon\Downloads\Encounter_M3_Independent_Tester_Handoff_v1.zip')
 assert sha(original.read_bytes())==json.loads((E/'outer-verification.json').read_text(encoding='utf-8'))['sha256']
 write('final-preservation.json',{'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'zipSha256':sha(p.read_bytes()),'bytes':p.stat().st_size,'identitySha256':sha(identity.read_bytes()),'originalHandoffSha256':sha(original.read_bytes()),'all189ExtractedMembersUnchanged':True,'extractionNoExtraFiles':True,'files':members})
def commands():
 source=next(Path(r'C:\Users\mcdon\.codex\sessions\2026\10\17').glob('*01a1483b*01a14b94*.jsonl'))
 rows=[json.loads(s) for s in source.read_text(encoding='utf-8').splitlines()]
 cutoff='2026-10-18T03:32:47.751Z';calls=[];byid={}
 def plaintext(x):
  if isinstance(x,str):return x
  if isinstance(x,list):return '\n'.join(plaintext(y) for y in x)
  if isinstance(x,dict):return x.get('text','')
  return ''
 for row in rows:
  if row.get('timestamp','')<=cutoff or row['type']!='response_item':continue
  d=row['payload'];kind=d.get('type');callid=d.get('call_id')
  if kind in ('function_call','custom_tool_call'):
   code=d.get('arguments',d.get('input',''));record={'utc':row['timestamp'],'tool':d.get('name'),'callId':callid,'exactInput':code,'outputAvailableAtBundleFreeze':False};calls.append(record);byid[callid]=record
  elif kind in ('function_call_output','custom_tool_call_output') and callid in byid:
   output=plaintext(d.get('output'));byid[callid].update({'outputAvailableAtBundleFreeze':True,'outputText':output,'reportedExitCodes':[int(v) for v in re.findall(r'"exit_code"\s*:\s*(-?\d+)',output)]})
 write('exact-tool-command-log.json',calls)
 shell=[];browser=[]
 for call in calls:
  inp=call['exactInput']
  for literal in re.findall(r'\bcmd\s*:\s*("(?:\\.|[^"\\])*")',inp):
   shell.append({'utc':call['utc'],'command':json.loads(literal),'reportedExitCodes':call.get('reportedExitCodes',[]),'toolCallId':call['callId'],'rawOutputIsIn':'exact-tool-command-log.json'})
  if call['tool']=='js':
   try:arg=json.loads(inp)
   except:continue
   if 'code' in arg:browser.append({'utc':call['utc'],**arg,'outputText':call.get('outputText','')})
 write('exact-shell-command-log.json',shell);write('exact-browser-command-log.json',browser)
 print('Recorded exact tool calls',len(calls),'shell commands',len(shell),'browser commands',len(browser))
def bundle():
 OUT.mkdir(exist_ok=True);report=R/'M3_Independent_Test_Report.md';assert report.exists()
 target=OUT/'M3_Independent_Test_Evidence.zip';assert not target.exists(),'Refuse overwrite'
 for name in ['M3_Independent_Test_Report.md','independent-m3.test.mjs','notice-display-defect.test.mjs','M3_Normal_Closure_Preview.jpg','M3_D01_Invisible_Notice.jpg','M3_D01_Closure_Result.jpg','M3_Independent_Test_Evidence.identity.json']:assert not (OUT/name).exists(),('Refuse overwrite',name)
 files={f.name:f for f in R.iterdir() if f.is_file() and f.suffix in ('.mjs','.py','.md')}
 files.update({p.relative_to(R).as_posix():p for p in E.rglob('*') if p.is_file()})
 for n in ['Encounter_M3_Checkpoint.zip','Encounter_M3_Checkpoint.identity.json']:files['reviewed-checkpoint/'+n]=R/'handoff/inputs'/n
 for n in ['START_HERE.md','Encounter_M3_Independent_Tester_Prompt.md','HANDOFF_MANIFEST.json']:files['handoff-procedure/'+n]=R/'handoff'/n
 files['display-fault/index.html']=R/'display-fault/index.html'
 entries=[{'path':n,'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for n,p in sorted(files.items())]
 manifest={'purpose':'Independent M3 evidence. Builder checkpoint is identified comparison input; evidence/ contains fresh tester output. No M4.','files':entries}
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for n,p in sorted(files.items()):z.write(p,n)
  z.writestr('EVIDENCE_MANIFEST.json',json.dumps(manifest,indent=2)+'\n')
 with zipfile.ZipFile(target) as z:
  assert z.testzip() is None
  for x in entries:assert sha(z.read(x['path']))==x['sha256']
 shutil.copy2(report,OUT/report.name)
 for n in ['independent-m3.test.mjs','notice-display-defect.test.mjs']:shutil.copy2(R/n,OUT/n)
 for src,dst in [('browser-closure-preview-before-send.jpg','M3_Normal_Closure_Preview.jpg'),('browser-transparent-notice-preview.jpg','M3_D01_Invisible_Notice.jpg'),('browser-transparent-notice-result.jpg','M3_D01_Closure_Result.jpg')]:shutil.copy2(E/src,OUT/dst)
 record={'evidenceZip':str(target),'bytes':target.stat().st_size,'sha256':sha(target.read_bytes()),'members':len(entries)+1,'verified':True}
 (OUT/'M3_Independent_Test_Evidence.identity.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps(record))
if __name__=='__main__':
 import sys
 preserve();commands()
 if '--bundle' in sys.argv:bundle()
