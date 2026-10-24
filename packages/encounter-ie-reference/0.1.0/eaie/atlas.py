"""Read-only diagnostics of verified detached input; no Core/SQLite writer."""
from .data import copy, canonical, closure, require,metered,Rejected,charge,scan
from .core import Snapshot
from .policies import effective

def inspect(snapshot,audience='public',query='current',bundle=None):
    if not isinstance(snapshot,Snapshot):return {'status':'O5','reason':'unverified_snapshot'}
    try:
        limit=snapshot.state['profile']['limits']['query_work'];basis=snapshot.census['cold_work']
    except (AttributeError,KeyError,TypeError):return {'status':'O5','reason':'unverified_snapshot'}
    try:
        with metered(limit) as work:
            charge(basis,'verified_snapshot_basis')
            return _inspect(snapshot,audience,query,bundle)
    except Rejected:return {'status':'O5','reason':'query_capacity'}
    except (AttributeError,KeyError,TypeError,ValueError):return {'status':'O5','reason':'unverified_snapshot'}

def _inspect(snapshot,audience='public',query='current',bundle=None):
    if not isinstance(snapshot,Snapshot) or not snapshot.verified():return {'status':'O5','reason':'unverified_snapshot'}
    require(audience in ['public','author'],'AUDIENCE')
    bundle=copy(bundle or {});s=snapshot.state
    # Non-disclosure includes unknown/hidden existence and all cost metadata.
    if audience=='public':
        return {'status':'O5','reason':'unavailable'}
    if query=='current':
        out={'head':snapshot.head,'time':s['clock']['now'],'condition':{k:dict(copy(v),effective=effective(v,s['clock']['now']) if 'base' in v else v['value']) for k,v in scan(s['families']['Env'].items(),'author_condition_record_visit')}}
    elif query=='identity':out=copy(s['identity'])
    elif query=='due':out=copy(s['clock'])
    elif query=='cause':out=copy(s['lineage']['events'])
    elif query=='typed-history':out={'events':copy(s['lineage']['events']),'fidelity':'typed','dialogue_quote':'unsupported'}
    elif query=='terminal-receipt':out=copy(snapshot.stores['6-RVD-registry'])
    elif query=='coverage':out=copy(snapshot.stores['3-lineage-coverage'])
    elif query=='resource-census':out=copy(snapshot.census)
    elif query=='closure':
        p=s['protection'];out=closure(p['graph'],list(p['essential'])+list(p['pins']))
        out.update(head=snapshot.head,roots=copy(p['essential']),pins=copy(p['pins']),destructive_collection=False)
        # Actual mode-A records are all essential, independently of optional-unit eligibility.
        records=snapshot.stores['9-proof-index']['history']
        out['modeA_records']=[{'ordinal':e['seq'],'head':e['head'],'depends_on':e['previous'],'request':e['result']['request'],'receipt_retained':True,'fidelity':'exact'} for e in scan(records,'author_history_record_visit')]
    elif query=='stores':out=copy(snapshot.stores)
    elif query in ['quote:M','source:M']:
        if query=='quote:M':return {'status':'O5','reason':'meaning_only_no_exact_quote'}
        out={'meaning':s['proof']['optional_sources']['M']['meaning'],'fidelity':'meaning'}
    elif query in ['source:Z','quote:Z']:
        observed=bundle.get('Z',{})
        if observed.get('status')!='exact' or type(observed.get('text')) is not str:return {'status':'O5','reason':'known_optional_detail_offline'}
        out={'fidelity':'exact','text':observed['text'],'provenance':'explicit_observed_retrieval_bundle'}
    else:return {'status':'O5','reason':'unsupported_query'}
    size=len(canonical(out))
    if size>s['profile']['limits']['query_bytes']:
        return {'status':'O5','reason':'query_capacity'}
    return {'status':'available','value':out}
