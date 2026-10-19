"""Strict JSON values, immutable boundary, pinned authored fixture decoding."""
import hashlib
import json
from collections.abc import Mapping
from pathlib import Path
from types import MappingProxyType

VERSION = 'EA-C1/0.1.3'
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

def plain(v, depth=0, _budget=None):
    if _budget is None:_budget=[33554432]
    def charge(n):
        _budget[0]-=n;require(_budget[0]>=0,'ENCODED_JSON_BOUND')
    require(depth <= 32, 'DEPTH')
    if v is None or type(v) in (bool, int, str):
        if type(v) is int: require(abs(v) <= 2**53-1, 'INTEGER_RANGE')
        if type(v) is str:
            require(len(v) <= 2000000 and len(v)<=_budget[0],'STRING_RANGE')
            size=len(v)+2 if v.isascii() and v.isprintable() and '"' not in v and '\\' not in v else len(json.dumps(v,ensure_ascii=True))
            charge(size)
        else:charge(len(str(v))+1)
        return v
    if isinstance(v, Mapping):
        require(len(v) <= 10000 and all(type(k) is str for k in v), 'OBJECT')
        charge(2+2*len(v))
        return {plain(k,depth+1,_budget):plain(x,depth+1,_budget) for k,x in v.items()}
    if type(v) in (list,tuple):
        require(len(v)<=10000,'ARRAY')
        charge(2+len(v))
        return [plain(x,depth+1,_budget) for x in v]
    raise Rejected('JSON_ONLY_NO_FLOAT_ASYNC_OR_OPAQUE')

def canonical(v):
    return json.dumps(plain(v), sort_keys=True, separators=(',',':'), ensure_ascii=True, allow_nan=False)
def copy(v): return json.loads(canonical(v))
def digest(v): return hashlib.sha256(canonical(v).encode()).hexdigest()
def freeze(v):
    v=plain(v)
    def f(x):
        if isinstance(x,dict): return MappingProxyType({k:f(y) for k,y in x.items()})
        if isinstance(x,list): return tuple(f(y) for y in x)
        return x
    return f(v)
def integer(n,lo,hi): return type(n) is int and lo<=n<=hi
def fields(v,keys): require(isinstance(v,Mapping) and set(v)==set(keys),'FIELDS')

def literals():
    path=Path(__file__).resolve().parent.parent/'fixtures'
    result={}
    for n,h in HASHES.items():
        b=(path/(n+'.txt')).read_bytes()
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
    values=dict(line.split('=',1) for line in literals()['R0'].splitlines()[1:])
    return {'world':values['world'],'lineage':values['lineage'],
            'producers':{'test-producer':['e1','e2']},
            'default_caller':{'producer':'test-producer','incarnation':'e1'}}

def closure(graph, roots):
    seen=set(); pending=list(roots); visits=0
    while pending:
        n=pending.pop()
        require(n in graph,'MISSING_DEPENDENCY')
        if n in seen: continue
        seen.add(n); visits+=len(graph[n]); pending.extend(graph[n])
    return {'protected':sorted(seen),'edges_visited':visits,
            'eligible':sorted(set(graph)-seen)}

def authored():
    """Decode literal selectors without guessing label/position equivalence."""
    lit=literals(); config={}
    for line in lit['R0'].splitlines()[1:]:
        k,v=line.split('=',1);config[k]=v
    entities={}
    for item in config['entities'].split(','):
        name,kind=item.split(':');entities[name]={'kind':kind,'live':True,'origin':'R0'}
    env={}
    for name,item in entities.items():
        if item['kind']=='mechanism':
            parts=config[name].split(',')
            env[name]={'blocked':parts[0]=='blocked','base':int(parts[1].split(':')[1]),'at':int(parts[2].split(':')[1]),'cause':'R0'}
    obligations={}
    for name,value in config.items():
        if value.startswith('active,due:'):
            # P4 explicitly authors D as the A/B subject; this is fixture content.
            p=value.split(',');obligations[name]={'status':'active','due':int(p[1].split(':')[1]),'ordinal':int(p[2].split(':')[1]),'policy':p[3].split(':')[1],'target':'D','cause':'R0'}
    artifacts={}
    for n in ['S','T','U','S2']:
        lines=lit[n].splitlines(); props={}; selectors=[]
        for line in lines:
            k,value=line.split('=',1)
            if k in ['actor','mechanism','point','place']:
                selectors.append([k,value.split(',')[0]])
            else:props[k]=value
        artifacts[props['artifact']]={**props,'digest':HASHES[n],'selectors':selectors}
    bindings=[]
    for line in lit['BX'].splitlines()[1:]:
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
