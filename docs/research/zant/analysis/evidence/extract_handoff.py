"""Copy supplied evidence to a separate research workspace, preserving bytes."""
from pathlib import Path, PurePosixPath
import io, json, hashlib, zipfile

SOURCE = Path(r'C:\Users\mcdon\Downloads')
WORK = Path(r'C:\Users\mcdon\Documents\ChatGPT\encounter and rc\work\ZANT_analysis_sources')
OUT = Path(__file__).resolve().parent
copies=[]

def unpack(z, dest, label):
    for item in z.infolist():
        if item.is_dir(): continue
        rel=PurePosixPath(item.filename)
        if rel.is_absolute() or '..' in rel.parts: raise ValueError(item.filename)
        if item.filename=='PART_INFO.md':
            target=WORK/'packaging'/f'{label}_PART_INFO.md'
        else: target=dest.joinpath(*rel.parts)
        data=z.read(item)
        if target.exists():
            if target.read_bytes()!=data: raise ValueError(f'Conflicting evidence: {target}')
        else:
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(data)
        copies.append({'source':label+'!'+item.filename,'copy':str(target),'sha256':hashlib.sha256(data).hexdigest()})

for part in range(1,8):
    path=next(SOURCE.glob(f'Trapstar_ZANT_Combinatorial_Character_Research_Handoff_v2_PART{part}_*.zip'))
    with zipfile.ZipFile(path) as z:
        if part==2:
            for name,dest in [('ORIGINAL_USER_SOURCE/characters_trapstar_source.zip',WORK/'original'),('ORIGINAL_USER_SOURCE/C001-C044_clothing_inventory_rgba.zip',WORK/'wardrobe')]:
                with zipfile.ZipFile(io.BytesIO(z.read(name))) as inner: unpack(inner,dest,f'Part2!{name}')
            for item in z.infolist():
                if not item.is_dir() and item.filename.endswith('.png'):
                    t=WORK/'original_screenshots'/Path(item.filename).name
                    t.parent.mkdir(parents=True,exist_ok=True)
                    data=z.read(item)
                    if t.exists() and t.read_bytes()!=data: raise ValueError(str(t))
                    t.write_bytes(data)
        else: unpack(z,WORK/('context' if part==1 else 'modular' if part in (3,4) else 'face'),f'Part{part}')
OUT.mkdir(parents=True,exist_ok=True)
(OUT/'evidence_copy_manifest.json').write_text(json.dumps(copies,indent=2),encoding='utf-8')
print(json.dumps({'work':str(WORK),'verified_copy_records':len(copies),'distinct_paths':len({c['copy'] for c in copies})}))
