"""Approved conjunctive finite profile; no capacity increase or retention escape."""
from .data import copy,digest,require,integer
DEFAULT_LIMITS={'operations':64,'checkpoints':8,'cold_work':20000000,
 'admission_work':40000000,'checkpoint_work':40000000,'query_work':20000000,'retry_work':20000000,
 'logical_bytes':8388608,'memory_bytes':268435456,'workspace_bytes':1073741824,
 'due_jobs':8,'query_bytes':65536,'request_bytes':163840,'intent_bytes':8192,'state_bytes':131072,
 'actors':16,'organizations':4,'roots':32,'versions':64,'receipts':128,'transmissions':64,
 'derivations':32,'premise_edges':128,'cases':16,'tasks':32,'targets':4,'queue_updates':8}
def profile(limits=None):
    p=copy(DEFAULT_LIMITS if limits is None else limits)
    require(set(p)==set(DEFAULT_LIMITS) and all(integer(v,0,DEFAULT_LIMITS[k]) for k,v in p.items()),'PROFILE_LIMITS')
    return {'id':'EA-IE-profile/1/'+digest(p),'accounting':'actual-passes/full-key-sort/1','limits':p}
