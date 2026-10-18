from pathlib import Path
import zipfile,json,hashlib,sys
root=Path(__file__).resolve().parents[1];label='Atlas_A1_Person_Source_Inspection_Checkpoint';assert len(sys.argv)==1 or sys.argv[1]==label
archive=root.parent/(label+'.zip');manifest=root.parent/(label+'.identity.json');assert not archive.exists() and not manifest.exists(),'Refusing to overwrite a frozen artifact'
sha=lambda b:hashlib.sha256(b).hexdigest();entries=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts),key=lambda p:p.relative_to(root).as_posix()):
  b=p.read_bytes();n=p.relative_to(root).as_posix();i=zipfile.ZipInfo(n,date_time=(2026,10,18,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o100644<<16;z.writestr(i,b);entries.append({'path':n,'bytes':len(b),'sha256':sha(b)})
s=json.loads((root/'evidence/atlas-a1/source-identity.json').read_text());record={'snapshot':archive.name,'sha256':sha(archive.read_bytes()),'bytes':archive.stat().st_size,**{k:v for k,v in s.items() if k!='files'},'files':entries};manifest.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');print(json.dumps({k:v for k,v in record.items() if k!='files'}))
