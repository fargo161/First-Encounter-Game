"""Fresh complete remediation checks; original independent inputs remain unchanged."""
from pathlib import Path
import json,os,shutil,subprocess,sys
root=Path(__file__).resolve().parents[1];folder=root/'evidence/m3-d01';folder.mkdir(parents=True,exist_ok=True)
commands=[('regression',['python','scripts/check-m3.py']),('independent-m3',['node','--test','--test-reporter=tap','scripts/run-independent-m3-r1.mjs']),('independent-d01',['node','--test','--test-reporter=tap','independent/m3-review/notice-display-defect.test.mjs']),('browser-evidence',['node','scripts/generate-m3-d01-evidence.mjs']),('preservation',['python','scripts/preserve-m3-r1.py'])]
records=[];env=dict(os.environ,M3_CHECKPOINT=str(root),PYTHONUTF8='1')
for name,args in commands:
 result=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=root,env=env,capture_output=True,text=True,encoding='utf-8')
 entry={'cwd':str(root),'executable':shutil.which(args[0]),'args':args[1:],'environmentBinding':{'M3_CHECKPOINT':str(root)},'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr};records.append(entry)
 (folder/('fresh-'+name+'.txt')).write_text(json.dumps(entry,indent=2)+'\n',encoding='utf-8')
 (folder/'executed-commands.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'command':name,'exitCode':result.returncode,'tail':result.stdout.splitlines()[-9:]}),flush=True)
 if result.returncode:raise SystemExit(result.returncode)
