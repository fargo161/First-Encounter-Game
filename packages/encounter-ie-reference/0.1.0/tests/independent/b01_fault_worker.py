# Tester I fresh-native execution port of donor B01 own-disposable worker.
"""Bounded B01 process-death seam; only disposable candidate worlds."""
import json, os, sys, sqlite3
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from eaie import Core
from eaie.data import copy
from ported_b01 import req, sql_measure, write
kind,mode,folder=sys.argv[1:];f=Path(folder);L=json.loads((f/'limits.json').read_text());path=f/'world.db'
if mode=='cold':
    c=Core(path,L);s=c.snapshot();generation=s.stores['8-publication']['generation']
    published=s.ordinal==1 if kind=='operation' else generation==2
    if kind=='operation':
        r=json.loads((f/'request.json').read_text());result=c.admit(r)
    else:result={'status':'verified'}
    print(json.dumps({'published':published,'opened_head':s.head,'opened_ordinal':s.ordinal,'opened_generation':generation,'result':result,'resolver_calls':c.resolutions}))
    sys.exit(0)
class FaultCore(Core):
    def _publication_budget(self,db,c,n,cp):
        write(f/'staged-backend.json',sql_measure(db,self.path))
        value=super()._publication_budget(db,c,n,cp)
        write(f/'reservation.json',{'bytes':value,'cap':L['workspace_bytes'],'ordinal':n,'checkpoints':cp})
        if mode=='before_commit':os._exit(93)
        if mode=='during_commit':db.set_progress_handler(lambda:os._exit(93),1)
        return value
c=FaultCore(path,L)
if kind=='operation':
    r=req(c);write(f/'request.json',r)
    def hook(phase,e):
        write(f/(phase+'.json'),{'phase':phase,'receipt':e['receipt']})
        if mode==phase:os._exit(93)
    result=c.admit(r,publication_hook=hook)
else:result=c.checkpoint()
print(json.dumps(result),flush=True)
if mode=='after_ack':os._exit(93)
raise AssertionError('fault not exercised')
