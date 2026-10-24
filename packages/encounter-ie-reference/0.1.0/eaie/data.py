"""Strict JSON values, immutable boundary, pinned authored fixture decoding."""
import hashlib
import json
import math
from contextvars import ContextVar
from contextlib import contextmanager
from collections.abc import Mapping
from pathlib import Path
from types import MappingProxyType

VERSION = 'EA-IE/0.1.0'
HASHES = dict(zip(['R0','S','T','U','BX','S2','RX'], [
 'b1ad16d09f5651e9505c8288ce1930d0ea35dfa213fa70750d24ee1dfdff2095',
 'a9008316ff9304eb43576f20019ba3c65f632515ec506048dee8d385cdab3449',
 '99beac400b126f6ed09ae54c84c30e13dcdf817bffa0a48516a1afd1260e338f',
 'd82c5a44cddd6b724bdd8489408bf064e4c4af2f6260760e16a4b7fb1b910f3a',
 '561eb38e6682e9a2fc1604c3be637e8894f20f250dbff106797281a362913de8',
 'eba31deef62e145ad2a89a42d3b1958f741ec95a2e04fb4c976529791450e6c4',
 '4a621598ba52c531ff1547c0e535224e5be4e2febfbd58636bbcbafc1f8ed427']))

class Rejected(Exception): pass
class Unavailable(Exception): pass
def require(ok, why='INVALID'):
    if not ok: raise Rejected(why)

METER=ContextVar('eaie_work',default=None)
class Work:
    def __init__(self,limit=20000000,parent=None,stage='nested_phase'):
        self.limit=limit;self.total=0;self.stages={};self.parent=parent;self.parent_stage=stage
    def charge(self,n,stage):
        require(type(n) is int and n>=0,'WORK_BASIS')
        self.total+=n;self.stages[stage]=self.stages.get(stage,0)+n
        # Charge every enclosing phase as work happens, including the bounded
        # stage which causes a refusal. Successful-only aggregation loses the
        # work of failed nested replay/query stages and enforces parents late.
        if self.parent is not None:self.parent.charge(n,self.parent_stage)
        require(self.total<=self.limit,'WORK_CAPACITY')
    def reserve(self,n,stage):
        require(type(n) is int and n>=0,'WORK_BASIS')
        require(self.total+n<=self.limit,'WORK_CAPACITY_BEFORE_'+stage)
        if self.parent is not None:self.parent.reserve(n,stage)
    def report(self):return {'total':self.total,'stages':dict(self.stages)}
def charge(n=1,stage='visit'):
    m=METER.get()
    if m is not None:m.charge(n,stage)
def reserve(n,stage):
    """Check a conservative next-stage bound without charging it twice."""
    m=METER.get()
    if m is not None:m.reserve(n,stage)
def scan(records,stage='record_visit'):
    """Reserve a complete bounded scan, including short-circuit cases."""
    charge(len(records),stage);return records
@contextmanager
def metered(limit,stage='nested_phase'):
    m=Work(limit,METER.get(),stage);token=METER.set(m)
    try:yield m
    finally:METER.reset(token)
def sort_full(values,key=lambda x:x):
    pairs=[(key(x),x) for x in values];keys=[canonical(k) for k,x in pairs]
    charge(sum(len(k) for k in keys)+max([1]+[len(k) for k in keys])*len(pairs)*math.ceil(math.log2(len(pairs)+1)),'full_key_sort')
    return [x for k,x in sorted(pairs,key=lambda p:p[0])]

def plain(v, depth=0, _budget=None, _nodes=None, _reserve_extra=None):
    if _budget is None:_budget=[8388608]
    if _nodes is None:_nodes=[0]
    _nodes[0]+=1;charge(1,'json_node');require(_nodes[0]<=32768,'JSON_NODES')
    require(depth<=24,'DEPTH')
    def use(n,exact=None):
        # Exact encoded limits and conservative work/stage reserves are distinct.
        # Preserve the existing validation charge and pre-dump separator reserve.
        _budget[0]-=n if exact is None else exact
        if _reserve_extra is not None and exact is not None:_reserve_extra[0]+=n-exact
        charge(n,'json_validate_bytes');require(_budget[0]>=0,'ENCODED_JSON_BOUND')
    if v is None or type(v) in (bool,int,str):
        if type(v) is int:require(abs(v)<=2**53-1,'INTEGER_RANGE')
        if type(v) is str:
            require(len(v)<=4096,'STRING_RANGE')
            require(len(v.encode('utf-8'))<=4096,'STRING_RANGE');use(len(json.dumps(v,ensure_ascii=True)))
        else:use(len(json.dumps(v)))
        return v
    if isinstance(v,Mapping):
        require(len(v)<=128 and all(type(k) is str for k in v),'OBJECT');use(2+2*len(v),2+len(v)+max(0,len(v)-1))
        return {plain(k,depth+1,_budget,_nodes,_reserve_extra):plain(x,depth+1,_budget,_nodes,_reserve_extra) for k,x in v.items()}
    if type(v) in (list,tuple):
        require(len(v)<=256,'ARRAY');use(2+len(v),2+max(0,len(v)-1))
        return [plain(x,depth+1,_budget,_nodes,_reserve_extra) for x in v]
    raise Rejected('JSON_ONLY_NO_FLOAT_ASYNC_OR_OPAQUE')

def canonical(v):
    byte_budget=[8388608];reserve_extra=[0];p=plain(v,_budget=byte_budget,_reserve_extra=reserve_extra)
    encoded_upper=8388608-byte_budget[0]+reserve_extra[0]
    def costs(x):
        charge(1,'canonical_sort_walk_node')
        if isinstance(x,dict):
            ks=[json.dumps(k,ensure_ascii=True) for k in x]
            charge(sum(map(len,ks))+max([1]+list(map(len,ks)))*len(ks)*math.ceil(math.log2(len(ks)+1)),'full_key_sort')
            for y in x.values():costs(y)
        elif isinstance(x,list):
            for y in x:costs(y)
    costs(p);reserve(encoded_upper,'JSON_SERIALIZATION')
    out=json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=True,allow_nan=False)
    charge(len(out),'json_serialize_bytes');return out

def encoded_size(v):
    """Exact canonical encoded size without an unnecessary key sort/whole JSON
    construction. Inputs have already crossed strict plain/decode capture."""
    def size(x):
        charge(1,'json_size_node')
        if isinstance(x,Mapping):
            n=2+max(0,len(x)-1);charge(n,'json_size_bytes')
            for k,y in x.items():
                fragment=len(json.dumps(k,ensure_ascii=True))+1;charge(fragment,'json_size_bytes');n+=fragment+size(y)
            return n
        if type(x) in [list,tuple]:
            n=2+max(0,len(x)-1);charge(n,'json_size_bytes')
            for y in x:n+=size(y)
            return n
        require(x is None or type(x) in [str,bool,int],'JSON_ONLY_NO_FLOAT_ASYNC_OR_OPAQUE')
        n=len(json.dumps(x,ensure_ascii=True,allow_nan=False));charge(n,'json_size_bytes');return n
    return size(v)

def decode(raw,maximum=8388608):
    require(type(raw) in (str,bytes),'JSON_INPUT')
    if type(raw) is bytes:
        require(len(raw)<=maximum,'PREDECODE_BYTES');charge(len(raw),'raw_utf8_decode_bytes')
        b=raw;raw=raw.decode('utf-8')
    else:
        require(len(raw)<=maximum,'PREDECODE_BYTES');reserve(4*len(raw),'JSON_UTF8_ENCODE')
        b=raw.encode('utf-8');charge(len(b),'raw_utf8_encode_bytes')
    require(len(b)<=maximum,'PREDECODE_BYTES');charge(len(b),'json_lexical_bytes')
    depth=0;quoted=False;escaped=False;tokens=0;start=0
    for i,c in enumerate(raw):
        if quoted:
            if escaped:escaped=False
            elif c=='\\':escaped=True
            elif c=='"':quoted=False;require(i-start<=24578,'PREDECODE_STRING')
        elif c=='"':quoted=True;start=i;tokens+=1
        elif c in '[{':depth+=1;tokens+=1;require(depth<=24,'PREDECODE_DEPTH')
        elif c in ']}':depth-=1;require(depth>=0,'PREDECODE_DEPTH')
        elif c in ',:':tokens+=1
        require(tokens<=65536,'PREDECODE_TOKENS')
    require(not quoted and depth==0,'PREDECODE_SYNTAX')
    def pairs(values):
        d={}
        for k,v in values:require(k not in d,'DUPLICATE_KEY');d[k]=v
        return d
    def bad(_):raise Rejected('JSON_FLOAT_OR_NONFINITE')
    charge(len(b),'json_decode_bytes')
    return plain(json.loads(raw,object_pairs_hook=pairs,parse_float=bad,parse_constant=bad))
def copy(v):
    # plain validates and constructs detached dictionaries/lists recursively.
    # Re-encoding and lexically parsing that already captured in-memory value
    # would repeat identical work; raw persisted JSON still uses strict decode.
    return plain(v)
def digest(v):
    text=canonical(v);charge(len(text),'digest_encode_bytes');b=text.encode('ascii')
    charge(len(b),'hash_bytes');return hashlib.sha256(b).hexdigest()
def freeze(v):
    v=plain(v)
    def f(x):
        charge(1,'freeze_node')
        if isinstance(x,dict): return MappingProxyType({k:f(y) for k,y in x.items()})
        if isinstance(x,list): return tuple(f(y) for y in x)
        return x
    return f(v)

def freeze_verified(v):
    """Assemble already verified bounded records without inventing a giant JSON
    envelope as another admitted semantic value. Internal snapshots only."""
    charge(1,'snapshot_assembly_visit')
    if isinstance(v,Mapping):return MappingProxyType({k:freeze_verified(x) for k,x in v.items()})
    if type(v) in [list,tuple]:return tuple(freeze_verified(x) for x in v)
    return v
def integer(n,lo,hi): return type(n) is int and lo<=n<=hi
def fields(v,keys): require(isinstance(v,Mapping) and set(v)==set(keys),'FIELDS')

def literals():
    path=Path(__file__).resolve().parent.parent/'fixtures'
    result={}
    for n,h in HASHES.items():
        p=path/(n+'.txt');size=p.stat().st_size
        charge(4*size+1,'fixture_read_hash_decode_bytes')
        b=p.read_bytes();require(len(b)==size,'FIXTURE_SIZE_CHANGED')
        require(hashlib.sha256(b).hexdigest()==h,'FIXTURE_DIGEST')
        result[n]=b.decode('utf-8')
    return result

GRAPH = {'Live':['Cause'],'Receipt':['Req','Result'],
 'Prefix':['Root','Cause','Req','Result','CX'],'Cause':['Policy','Bind'],
 'Result':['Cause'],'Req':['Root','Policy','Bind'],'CX':['CY'],'CY':['CX'],
 'OU':['OV'],'OV':['OU'],'Root':[],'Policy':[],'Bind':[]}
ESSENTIAL = ['Live','Receipt','Prefix']

def authority():
    # Authored proof-root grants, separate from reusable admission policy.
    root_literal=literals()['R0'];charge(2*len(root_literal.encode('utf-8')),'fixture_authority_parse_bytes')
    values=dict(line.split('=',1) for line in scan(root_literal.splitlines()[1:],'fixture_field_visit'))
    return {'world':'EA-IE-reference','lineage':'EA-IE-lineage-1',
            'producers':{'test-producer':['e1','e2']},
            'default_caller':{'producer':'test-producer','incarnation':'e1'}}

def closure(graph, roots):
    seen=set(); pending=list(roots); visits=0
    while pending:
        n=pending.pop()
        charge(1,'closure_node_visit')
        require(n in graph,'MISSING_DEPENDENCY')
        if n in seen: continue
        seen.add(n); visits+=len(graph[n]);charge(len(graph[n]),'closure_edge_visit');pending.extend(graph[n])
    charge(len(graph),'closure_inventory_visit')
    return {'protected':sort_full(seen),'edges_visited':visits,
            'eligible':sort_full(set(graph)-seen)}

def authored():
    """Decode literal selectors without guessing label/position equivalence."""
    lit=literals();charge(sum(4*len(x.encode('utf-8')) for x in lit.values()),'fixture_authored_parse_bytes');config={}
    for line in scan(lit['R0'].splitlines()[1:],'fixture_field_visit'):
        k,v=line.split('=',1);config[k]=v
    entities={}
    for item in scan(config['entities'].split(','),'fixture_entity_visit'):
        name,kind=item.split(':');entities[name]={'kind':kind,'live':True,'origin':'R0'}
    env={}
    for name,item in scan(entities.items(),'fixture_entity_visit'):
        if item['kind']=='mechanism':
            parts=config[name].split(',')
            env[name]={'blocked':parts[0]=='blocked','base':int(parts[1].split(':')[1]),'at':int(parts[2].split(':')[1]),'cause':'R0'}
    obligations={}
    for name,value in scan(config.items(),'fixture_field_visit'):
        if value.startswith('active,due:'):
            # P4 explicitly authors D as the A/B subject; this is fixture content.
            p=value.split(',');obligations[name]={'status':'active','due':int(p[1].split(':')[1]),'ordinal':int(p[2].split(':')[1]),'policy':p[3].split(':')[1],'target':'D','cause':'R0'}
    artifacts={}
    for n in ['S','T','U','S2']:
        lines=lit[n].splitlines(); props={}; selectors=[]
        for line in scan(lines,'fixture_field_visit'):
            k,value=line.split('=',1)
            if k in ['actor','mechanism','point','place']:
                selectors.append([k,value.split(',')[0]])
            else:props[k]=value
        artifacts[props['artifact']]={**props,'digest':HASHES[n],'selectors':selectors}
    bindings=[]
    for line in scan(lit['BX'].splitlines()[1:],'fixture_binding_visit'):
        local,world=line.split('->'); artifact_epoch,kind,selector=local.split('|');artifact,epoch=artifact_epoch.split('@')
        target=world.split(';')[0]
        bindings.append({'artifact':artifact,'epoch':epoch,'kind':kind,'selector':selector,'target':target,'revision':1,'current':True,'online':True,'role':'anchor' if ';role:anchor' in world else 'representation'})
    rx=lit['RX'].splitlines(); remap=dict(x.split('=',1) for x in rx[1:4])
    remap['pairs']=[x for x in rx[4:]]
    state={'families':{'Env':env},'identity':{'entities':entities,'artifacts':artifacts,'bindings':bindings},
      'lineage':{'world':config['world'],'lineage':config['lineage'],'root':HASHES['R0'],'events':[]},
      'clock':{'now':0,'obligations':obligations,'next_ordinal':3},
      'protection':{'graph':copy(GRAPH),'essential':ESSENTIAL[:],'pins':[]},
      'profile':{},'proof':{'optional_sources':{'Z':{'audience':'author','fidelity':'exact'},'M':{'audience':'author','fidelity':'meaning','meaning':'obstruction released'}},'fidelity':'typed+exact-transition'},
      'binding_plan':{'remap':remap,'digest':HASHES['RX'],'tombstone_targets':['P','D']}}
    return state
