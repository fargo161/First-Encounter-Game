"""Complete R2 checks; optional phases allow browser evidence capture in parallel."""
from pathlib import Path
import json,os,shutil,subprocess,sys
root=Path(__file__).resolve().parents[1];folder=root/'evidence/m3-d02';folder.mkdir(parents=True,exist_ok=True)
regressions=[('inherited-regressions',['python','scripts/check-m3-r1.py']),('independent-d02',['node','--test','--test-reporter=tap','scripts/run-independent-m3-d02.mjs'])]
evidence=[('browser-evidence',['node','scripts/generate-m3-d02-evidence.mjs']),('preservation',['python','scripts/preserve-m3-r2.py'])]
phase=sys.argv[1] if len(sys.argv)>1 else '--all';assert phase in ['--all','--regressions','--evidence']
commands=regressions if phase=='--regressions' else evidence if phase=='--evidence' else regressions+evidence
log=folder/'executed-commands.json';records=json.loads(log.read_text(encoding='utf-8')) if phase=='--evidence' and log.exists() else []
for name,args in commands:
 p=subprocess.run([shutil.which(args[0]),*args[1:]],cwd=root,env=dict(os.environ,PYTHONUTF8='1',M3_CHECKPOINT=str(root)),capture_output=True,text=True,encoding='utf-8')
 record={'phase':phase,'cwd':str(root),'executable':shutil.which(args[0]),'args':args[1:],'environmentBinding':{'M3_CHECKPOINT':str(root)},'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr};records.append(record)
 (folder/('fresh-'+name+'.json')).write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');log.write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'command':name,'exitCode':p.returncode,'tail':p.stdout.splitlines()[-8:]}),flush=True)
 if p.returncode:raise SystemExit(p.returncode)
