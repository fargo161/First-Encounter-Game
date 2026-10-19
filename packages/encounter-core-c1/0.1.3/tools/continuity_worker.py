"""Fresh process continuity proof using public Core methods only."""
import argparse,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from eac1 import Core
from eac1.data import copy
p=argparse.ArgumentParser();p.add_argument('database',type=Path);p.add_argument('scene',choices=['S/1','T/1']);p.add_argument('original',type=Path);a=p.parse_args()
c=Core(a.database)
selector,epoch=('mechanism_0001','s1') if a.scene=='S/1' else ('mechanism_0009','t1')
before=c.snapshot();r=c.prepare('scene1','contribute',{'q':4},'D',c.qualified(a.scene,'mechanism',selector,epoch,1));result=c.admit(r)
original=json.loads(a.original.read_text(encoding='utf-8'));replayed=c.admit(original)
after=c.snapshot();assert result['status']=='O1' and replayed['status']=='O3'
assert after.state['families']['Env']['D']['base']==5 and after.state['families']['Env']['D2']['base']==4
print(json.dumps({'status':'PASS','scene':a.scene,'before':copy(before.stores),'after':copy(after.stores),'commit':result,'original_retry':replayed,'resolver_calls':c.resolutions}))
