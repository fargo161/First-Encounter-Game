"""Create a deterministic candidate ZIP (fixed metadata, sorted names, stored bytes).
Run from a disposable, fully verified candidate; destination must be outside it.
"""
from pathlib import Path
import argparse,hashlib,zipfile

def files(root):
 return sorted((p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc'),key=lambda p:p.relative_to(root).as_posix())
def package(root,destination,selected=None):
 root=Path(root).resolve();destination=Path(destination).resolve()
 if destination.is_relative_to(root):raise ValueError('Write the ZIP outside the candidate tree.')
 destination.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(destination,'w',compression=zipfile.ZIP_STORED) as z:
  for p in files(root):
   relative=p.relative_to(root).as_posix()
   if selected and not selected(relative):continue
   info=zipfile.ZipInfo(root.name+'/'+relative,(2026,10,18,0,0,0));info.create_system=3;info.external_attr=0o100644<<16;info.compress_type=zipfile.ZIP_STORED
   z.writestr(info,p.read_bytes())
 return hashlib.file_digest(destination.open('rb'),'sha256').hexdigest()
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('candidate',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();print(package(args.candidate,args.output))
