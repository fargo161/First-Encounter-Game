"""Run additional inherited harnesses only in a disposable Stage12 package."""
from pathlib import Path
import argparse,subprocess,sys,os,json,re,hashlib,shutil
p=argparse.ArgumentParser();p.add_argument('--checkpoint',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
r=a.checkpoint.resolve();out=a.out.resolve()
assert 'EA-C1-candidate' in str(r) and 'GitHub' not in r.parts,'Disposable copy required'
out.mkdir(parents=True,exist_ok=False)
env=dict(os.environ,EA_C1_LEGACY_ROOT=str(r),ENCOUNTER_CHECKPOINT=str(r),M3_CHECKPOINT=str(r),M2_BROWSER_EVIDENCE=str(r/'independent'/'m2-browser-evidence'))
commands=[('m0',[shutil.which('node'),'scripts/audit-baseline.cjs']),
 ('independent-m1',[shutil.which('node'),'--test','--test-reporter=tap','independent/M1_Independent_Contract_Tests.test.mjs']),
 ('independent-m2',[shutil.which('node'),'--test','--test-reporter=tap','independent/M2_Independent_Contract_Tests.test.mjs']),
 ('independent-m3',[shutil.which('node'),'--test','--test-reporter=tap','scripts/run-independent-m3-r1.mjs']),
 ('original-d01',[shutil.which('node'),'--test','--test-reporter=tap','independent/m3-review/notice-display-defect.test.mjs']),
 ('independent-d02',[shutil.which('node'),'--test','--test-reporter=tap','scripts/run-independent-m3-d02.mjs']),
 ('independent-d03',[shutil.which('node'),'--test','--test-reporter=tap','scripts/run-independent-m3-d03.mjs']),
 ('independent-ar0',[shutil.which('node'),'--test','--test-reporter=tap','scripts/run-independent-ar0.mjs']),
 ('independent-ar0-r1',[shutil.which('node'),'--test','--test-reporter=tap',str(Path(__file__).with_name('legacy-ar0-r1.mjs'))])]
records=[]
for name,args in commands:
 print('START',name,flush=True)
 result=subprocess.run(args,cwd=r,env=env,capture_output=True,text=True,encoding='utf-8',timeout=180)
 t=result.stdout+result.stderr;log=out/(name+'.log');log.write_text(t,encoding='utf-8')
 record={'name':name,'args':args,'cwd':str(r),'exit':result.returncode,'log_sha256':hashlib.sha256(log.read_bytes()).hexdigest()}
 record.update({k:int(m[-1]) for k in ['tests','pass','fail','skipped'] if (m:=re.findall('^# '+k+r' (\d+)\s*$',t,re.M))})
 records.append(record);(out/'commands.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
 if result.returncode:print(t[-5000:]);sys.exit(result.returncode)
print(json.dumps(records,indent=2))
