"""Real disposable child process. os._exit bypasses Python/SQLite cleanup."""
import argparse,json,os,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from eac1 import Core
from eac1.data import copy

p=argparse.ArgumentParser();p.add_argument('mode');p.add_argument('db',type=Path);p.add_argument('folder',type=Path);a=p.parse_args()
c=Core(a.db)
if a.mode=='cold':
    try:
        r=json.loads((a.folder/'request.json').read_text());s=c.snapshot();result=c.admit(r)
        out={'open_ordinal':s.ordinal,'open_head':s.head,'stores_before':copy(s.stores),'retry':result,'stores_after':copy(c.snapshot().stores),'resolutions':c.resolutions}
    except Exception as e:out={'status':'O5','reason':str(e)}
    print(json.dumps(out));sys.exit(0)
r=c.prepare('o1','contribute',{'q':1},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1))
(a.folder/'request.json').write_text(json.dumps(r),encoding='utf-8')
def hook(phase,e):
    (a.folder/(phase+'.json')).write_text(json.dumps({'phase':phase,'prospective_head':e['head'],'receipt':e['receipt'],'journal_exists':Path(str(a.db)+'-journal').exists(),'database_bytes':a.db.stat().st_size}),encoding='utf-8')
    if phase==a.mode:os._exit(93)
out=c.admit(r,publication_hook=hook,backend_fault='commit-kill' if a.mode=='during_commit' else None)
print(json.dumps(out),flush=True)
if a.mode=='after_ack':os._exit(93)
