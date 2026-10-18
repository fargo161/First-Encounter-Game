import hashlib,json,shutil,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
expected=hashlib.sha256((ROOT/'Room_Creator.html').read_bytes()).hexdigest()
rows=[]
for ending in ['LF','CRLF']:
 with tempfile.TemporaryDirectory(prefix='rc-build-') as tmp:
  src=Path(tmp)/'source';shutil.copytree(ROOT/'source',src)
  for f in src.iterdir():
   if f.suffix in ['.js','.html','.css','.py']:
    text=f.read_text('utf-8');f.write_bytes(text.replace('\r\n','\n').replace('\n','\r\n' if ending=='CRLF' else '\n').encode('utf-8'))
  subprocess.run([sys.executable,str(src/'build.py')],check=True,capture_output=True)
  data=(src.parent/'Room_Creator.html').read_bytes();digest=hashlib.sha256(data).hexdigest()
  assert b'\r' not in data,ending+' output contains CR';assert digest==expected,(ending,digest,expected)
  rows.append({'sourceNewlines':ending,'outputSHA256':digest,'bytes':len(data)})
print(json.dumps({'passed':True,'builds':rows},indent=2))
