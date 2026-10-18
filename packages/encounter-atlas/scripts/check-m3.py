"""Fresh local checks with actual commands, environment, stdout/stderr and exits."""
from pathlib import Path
import json
import os
import platform
import shutil
import subprocess
root=Path(__file__).resolve().parents[1]
logs=root/'evidence/m3';logs.mkdir(exist_ok=True)
env=dict(os.environ,ENCOUNTER_CHECKPOINT=str(root),M2_BROWSER_EVIDENCE=str(root/'independent/m2-browser-evidence'),PYTHONUTF8='1')
environment={'platform':platform.platform(),'tools':{}}
for tool in ['node','npm.cmd','python']:
    result=subprocess.run([shutil.which(tool),'--version'],cwd=root,capture_output=True,text=True,encoding='utf-8')
    environment['tools'][tool]={'executable':shutil.which(tool),'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr}
(logs/'environment.json').write_text(json.dumps(environment,indent=2)+'\n',encoding='utf-8')
commands=[
 ('fresh-build.txt',['node','scripts/build-m3.mjs']),
 ('fresh-source-identity.txt',['python','scripts/source-identity-m3.py']),
 ('fresh-preservation.txt',['python','scripts/preserve-m3.py']),
 ('fresh-m0-audit.txt',['node','scripts/audit-baseline.cjs']),
 ('fresh-builder-tests.tap',['node','--test','--test-reporter=tap','tests/*.test.mjs']),
 ('fresh-independent-m1.tap',['node','--test','--test-reporter=tap','independent/M1_Independent_Contract_Tests.test.mjs']),
 ('fresh-independent-m2.tap',['node','--test','--test-reporter=tap','independent/M2_Independent_Contract_Tests.test.mjs']),
 ('fresh-generated-evidence.txt',['node','scripts/generate-m3-evidence.mjs'])]
records=[]
for filename,args in commands:
    result=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=root,env=env,capture_output=True,text=True,encoding='utf-8')
    record={'cwd':str(root),'executable':shutil.which(args[0]),'args':args[1:],'environmentBinding':{k:env[k] for k in ['ENCOUNTER_CHECKPOINT','M2_BROWSER_EVIDENCE']},'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr}
    records.append(record)
    (logs/filename).write_text(json.dumps({k:v for k,v in record.items() if k not in ['stdout','stderr']},indent=2)+'\n\nSTDOUT\n'+result.stdout+'\nSTDERR\n'+result.stderr,encoding='utf-8')
    print(json.dumps({'log':filename,'exitCode':result.returncode,'tail':result.stdout.splitlines()[-8:]}),flush=True)
    if result.returncode:break
(logs/'executed-commands.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
if any(r['exitCode'] for r in records):raise SystemExit(1)
