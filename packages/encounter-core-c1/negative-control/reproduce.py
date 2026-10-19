"""C1-B01 public-API invariant reproducer. No product source modification.

Expected exit1 on the delivered defective candidate; not a passing gate.
"""
from pathlib import Path
import sys,json,hashlib,argparse
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
sys.path.insert(0,str(a.source.resolve()))
from eac1 import Core
from eac1.core import DEFAULT_LIMITS
from eac1.data import copy
out=a.out.resolve();out.mkdir(parents=True,exist_ok=False)
def text(v):return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=True)
def sha(v):return hashlib.sha256(text(v).encode()).hexdigest()
def prepared(c):return c.prepare('o1','contribute',{'q':1},'D',c.qualified('S/1','mechanism','mechanism_0001','s1',1))
cap=4000000;steps=[]
for i in range(6):
 folder=out/('derivation-'+str(i));folder.mkdir();L=dict(DEFAULT_LIMITS,workspace_bytes=cap);c=Core.create(folder/'world.db',L);snap=c.snapshot();r=prepared(c);v=c.preview(r)
 state=copy(snap.state);state.update(v['effects']);head=sha({'previous':snap.head,'seq':1,'request':r,'result':v,'state':state})
 receipt={'key':r['key'],'ordinal':1,'head':head,'status':'O1','result_id':v['id']}
 e={'seq':1,'generation':1,'previous':snap.head,'head':head,'request':r,'result':v,'receipt':receipt,'state':state}
 B=len(text(copy(snap.stores['9-proof-index']['root'])).encode())+len(text(e).encode());needed=32*B+1048576+4*c.path.stat().st_size
 steps.append({'cap':cap,'candidate_bound':needed,'Bnext':B,'old_database_bytes':c.path.stat().st_size})
 if cap==needed:break
 cap=needed
else:raise RuntimeError('failed to derive declared byte boundary')
def execute(core,request):
 before=copy(core.snapshot().stores);old_bytes=core.path.stat().st_size;result=core.admit(request)
 try:
  s=Core(core.path,core.profile['limits']).snapshot();cold={'status':'available','ordinal':s.ordinal,'stores':copy(s.stores)}
 except Exception as exc:cold={'status':'O5','exception':type(exc).__name__,'reason':str(exc)}
 return {'profile':core.profile,'database':str(core.path),'old_database_bytes':old_bytes,'new_database_bytes':core.path.stat().st_size,'before':before,'request':request,'admission':result,'cold':cold}
at=execute(c,r)
folder=out/'one-byte-below';folder.mkdir();small=Core.create(folder/'world.db',dict(DEFAULT_LIMITS,workspace_bytes=cap-1));below=execute(small,prepared(small))
folder=out/'generous-control';folder.mkdir();large=Core.create(folder/'world.db',dict(DEFAULT_LIMITS,workspace_bytes=2097152));positive=execute(large,prepared(large))
assert below['admission']['status']=='O4' and below['cold']['status']=='available' and below['cold']['ordinal']==0
assert positive['admission']['status']=='O1' and positive['cold']['status']=='available' and positive['cold']['ordinal']==1
violation=at['admission']['status'] in ['O1','O2'] and at['cold']['status']=='O5'
result={'finding':'C1-B01','classification':'BLOCKING_PROSPECTIVE_WORKSPACE_RECOVERABILITY','build':'EA-C1/0.1.2','normative_oracle':'Every acknowledged new head must remain cold-reopenable under its declared immutable profile while proof/backend are intact','derivation':steps,'at_limit':at,'one_byte_below':below,'generous_control':positive,'blocking_violation':violation,'status':'FAIL' if violation else 'INVARIANT_NOT_VIOLATED'}
(out/'evidence.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'finding':'C1-B01','cap':cap,'at_limit_admission':at['admission']['status'],'at_limit_cold':at['cold']['status'],'below':below['admission']['status'],'positive':positive['admission']['status'],'status':result['status']},indent=2))
sys.exit(1 if violation else 0)
