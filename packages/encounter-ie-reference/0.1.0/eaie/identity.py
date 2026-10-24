"""New exact source identity; donor acceptance does not transfer."""
import hashlib
from pathlib import Path
from .data import digest,require,charge,sort_full
CANDIDATE='30d8e8ce154f498f8bc523315eee12cb74923e2182a46bd34a057568c47a751f'
PROPOSAL='d0e4585f2ad2f3ca05c5a012ff8d7465736fd977259fabc4b4af9474907a849a'
def source_identity():
    base=Path(__file__).resolve().parent.parent;result={}
    for folder in ['eaie','fixtures']:
        for p in sort_full(list((base/folder).glob('*')),key=lambda p:p.name):
            if p.is_file():
                size=p.stat().st_size;charge(2*size+1,'source_read_hash')
                b=p.read_bytes();require(len(b)==size,'SOURCE_SIZE_CHANGED')
                result[p.relative_to(base).as_posix()]=hashlib.sha256(b).hexdigest()
    return digest({'domain':'EA-IE-source/1','files':result})
def subject(state,actor,value):
    if value.get('kind')=='actual':
        require(set(value)=={'kind','entity'} and value['entity'] in state['identity']['entities'],'ACTUAL_SUBJECT')
    else:
        require(set(value)=={'kind','scope','label'} and value['kind']=='alleged' and value['scope']==actor and type(value['label']) is str,'ALLEGED_SUBJECT')
    return value
