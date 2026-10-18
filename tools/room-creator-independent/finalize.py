from pathlib import Path
import hashlib,json,subprocess,sys,shutil,zipfile
W=Path(__file__).resolve().parent;B=W.parents[1];O=B/'outputs/Room_Creator_v0_14_1_Independent_Audit';C=W/'candidate/Room_Creator_v0_14_1_remediation_candidate'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(n,x):(O/n).write_text(json.dumps(x,indent=2),encoding='utf-8')
index=json.loads((O/'fresh-native/run-index.json').read_text());assert len(index)==33,(len(index),index[-1]);assert all(x['exitCode']==0 for x in index)
with (O/'final-integrity-run.log').open('w',encoding='utf-8') as f:subprocess.run([sys.executable,str(W/'identity.py'),'--final'],check=True,stdout=f,stderr=subprocess.STDOUT)
initial=json.loads((O/'identity-initial.json').read_text());final=json.loads((O/'integrity-final.json').read_text())
changes=[n for n,h in initial['candidateFiles'].items() if final['candidateFiles'].get(n)!=h]
production=[n for n in changes if n.startswith(('source/','examples/')) or n=='Room_Creator.html']
testsource=[n for n in changes if n.startswith('tests/') and n.endswith(('.py','.js','.ps1','.sh'))]
preserved={'inputArchivesAndPriorAuditIdentical':initial['inputs']==final['inputs'],'productionChanged':production,'testSourceChanged':testsource,'disposableOutputChanges':changes,'originalManifest':final['original'],'libraryManifest':final['library'],'deliveredChecksums':final['delivered'],'baselineMapHashesIdentical':initial['mapHashes']==final['mapHashes']}
assert not production and not testsource and preserved['inputArchivesAndPriorAuditIdentical'] and preserved['baselineMapHashesIdentical'] and not final['original']['failures'] and not final['library']['failures']
# Recheck the pre-existing read-only original extraction as well as the fresh reproduction.
root=B/'work/rc014-audit/input/Room_Creator_v0_14_asset_library';bad=[];count=0
for line in (root/'MANIFEST_SHA256.txt').read_text().splitlines():
 if not line.strip():continue
 h,n=line.split(maxsplit=1);p=root/n.lstrip('* ');count+=1
 if not p.is_file() or sha(p)!=h:bad.append(n)
preserved['priorAuditOriginalExtraction']={'files':count,'failures':bad};assert not bad
save('production-preservation.json',preserved)
# All raw, complete current route observations; retain the two diagnostic encoding differences.
old=json.loads((W/'prior-evidence/fresh-route-eval-results.json').read_text());new=json.loads((C/'tests/route/out/route_eval_results.json').read_text())
diff=json.loads((O/'route-differences.json').read_text());assert len(diff)==2 and all(x[0].endswith('/markWhy') for x in diff)
def normalized(x):
 if isinstance(x,dict):return {k:normalized(v) for k,v in x.items()}
 if isinstance(x,list):return [normalized(v) for v in x]
 if isinstance(x,str):return x.replace('Â·','·')
 return x
save('route-evaluation-comparison.json',{'scenarioCount':len(new)-2,'exactDataEqual':old==new,'equalAfterDiagnosticEncodingCorrection':normalized(old)==new,'differences':diff});assert normalized(old)==new
# Preserve the normal generated result comparison only after the generator's completed run record.
p=subprocess.run(['node',str(W/'compare-generated.cjs')],capture_output=True,text=True,check=True);gen=json.loads(p.stdout);gen['generatedSHA256']=sha(C/'generated/Route_Prototype_Street_ASSET_DEMO.room.json');assert gen['propPlacementAndMetadataEqual'] and all(gen['preserved'].values());save('fresh-demo-regeneration-comparison.json',gen)
for folder in ['assets_evidence','route/out']:shutil.copytree(C/'tests'/folder,O/('fresh-'+folder.replace('/','-')),dirs_exist_ok=True)
scripts=O/'audit-scripts';scripts.mkdir(exist_ok=True)
for p in W.iterdir():
 if p.is_file() and p.suffix in ['.py','.cjs'] and p.name!='fixture-check.js':shutil.copy2(p,scripts/p.name)
notes={'date':'2026-10-18 America/New_York','runtime':{'python':sys.version,'node':subprocess.check_output(['node','--version'],text=True).strip(),'playwright':'1.56.0','chrome':'155.0.8059.41','graphics':'ANGLE SwiftShader'},'environmentAttempts':[{'folder':'fresh-all','disposition':'discarded browser launch: audit dependency path resolved against wrong working directory; Node passed, browser dependencies absent; build scratch denied by sandbox'},{'folder':'fresh-corrected','disposition':'discarded: corrected dependency path but Windows sandbox stalled Playwright; build scratch denied; only those audit processes were stopped'},{'folder':'fresh-native','disposition':'accepted fresh execution; explicit workspace TEMP/TMP, read-only library, untouched test scripts; all 33 indexed scripts exit 0'}],'independentFixtureAttempts':['First adversarial fixture had a missing JavaScript brace; fixed only the audit script.','First expanded ray fixture crossed enclosing walls in two sloped-ray cases and left a raw incomplete legacy pillar that triggered renderer fallback; expanded the room and reset the fixture before yielding. The retained adversarial-fixture-attempt.json is excluded from application findings.','A lifecycle dialog probe used #modal instead of #modalRoot; corrected only the audit selector and reran.','First standalone audit server was sandbox-isolated from native Chrome; replaced it with a native read-only localhost server.'],'provenanceNotes':['The first evidence collection ran while route evaluation/generation were still executing. Final route comparison and generated map comparison were recomputed only after completed run-index records.','The older audit logs include a middle-dot encoding artifact corrected in the current run. All numeric route observations are unchanged.','No native Linux/macOS run or long-duration cache soak is claimed.'],'finalVerdict':'HOLD FOR FURTHER REMEDIATION','remainingFailures':['R1 P2: known-ID missing palette/texture image files do not trigger selected-object repair handling.']}
save('RUN_NOTES.json',notes)
readme='Independent Room Creator v0.14.1 audit evidence. Start with AUDIT_REPORT.md. Fresh accepted runner logs are in fresh-native/. Additional independent failures and passes are in adversarial-results.json and additional-lifecycle-results.json. Historical and discarded fixture/environment attempts are identified in RUN_NOTES.json. Original archives, production source and the external asset library were not changed or promoted. Original packages and the asset library are excluded from this evidence ZIP. SHA256 manifest excludes itself and the ZIP/delivery checksum file.\n'
(O/'README_EVIDENCE.txt').write_text(readme,encoding='utf-8')
exclude={'EVIDENCE_SHA256.txt','Room_Creator_v0_14_1_Independent_Audit_Evidence.zip','DELIVERABLE_SHA256.txt'}
paths=sorted(p for p in O.rglob('*') if p.is_file() and p.name not in exclude and '__pycache__' not in p.parts)
(O/'EVIDENCE_SHA256.txt').write_text(''.join(sha(p)+'  '+p.relative_to(O).as_posix()+'\n' for p in paths),encoding='utf-8')
zpath=O/'Room_Creator_v0_14_1_Independent_Audit_Evidence.zip'
with zipfile.ZipFile(zpath,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in paths+[O/'EVIDENCE_SHA256.txt']:z.write(p,p.relative_to(O).as_posix())
with zipfile.ZipFile(zpath) as z:assert z.testzip() is None
delivered=[O/'AUDIT_REPORT.md',zpath,O/'EVIDENCE_SHA256.txt']
(O/'DELIVERABLE_SHA256.txt').write_text(''.join(sha(p)+'  '+p.name+'\n' for p in delivered),encoding='utf-8')
print(json.dumps({'acceptedScripts':len(index),'allExitZero':True,'preserved':{k:v for k,v in preserved.items() if k!='disposableOutputChanges'},'evidenceFiles':len(paths)+1,'zipBytes':zpath.stat().st_size,'zipSHA256':sha(zpath),'reportSHA256':sha(O/'AUDIT_REPORT.md')},indent=2))
