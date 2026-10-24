"""Detached holder projections; no acquisition, repair, scheduling or clock writes."""
from .data import copy,canonical,require,charge,sort_full,scan

UNAVAILABLE={'status':'unavailable'}
def support(s,actor,receipt,depth=0,seen=None,budget=None,cache=None):
    if seen is None:seen=set()
    if budget is None:budget=[0,0]
    if cache is None:cache={}
    charge(1,'support_cache_lookup')
    if receipt['id'] in cache:return cache[receipt['id']]
    if budget[0]>=256 or budget[1]>=512 or depth>8:return {'status':'AFFECTED/INDETERMINATE','complete':False}
    budget[0]+=1;charge(1,'support_node')
    if receipt['id'] in seen:return {'status':'AFFECTED/INDETERMINATE','complete':False}
    seen=set(seen)|{receipt['id']};info=s['information']
    quals=[q for q in scan(info['qualifications'],'query_record_scan') if q['actor']==actor and q['target']==receipt['version']]
    charge(len(info['qualifications']),'qualification_visit')
    if quals:
        result={'status':'AFFECTED/INDETERMINATE' if quals[-1]['kind']=='challenge' else 'UNSUPPORTED','complete':True};cache[receipt['id']]=result;return result
    dr=next((d for d in scan(info['derivations'],'query_record_scan') if d['actor']==actor and d['version']==receipt['version']),None)
    charge(len(info['derivations']),'derivation_visit')
    if dr is None:
        result={'status':'SUPPORTED','complete':True};cache[receipt['id']]=result;return result
    outcomes=[];complete=True
    for alt in scan(dr['alternatives'],'support_alternative_visit'):
        values=[]
        for rid in alt:
            if budget[0]>=256 or budget[1]>=512:
                values.append('AFFECTED/INDETERMINATE');complete=False;break
            budget[1]+=1;charge(1,'support_edge')
            rr=next((x for x in scan(info['receipts'],'query_record_scan') if x['id']==rid and x['holder_kind']=='actor' and x['holder']==actor),None)
            charge(len(info['receipts']),'support_receipt_visit')
            if rr is None:values.append('AFFECTED/INDETERMINATE');complete=False
            else:
                result=support(s,actor,rr,depth+1,seen,budget,cache);values.append(result['status']);complete=complete and result['complete']
        charge(2*len(values)+1,'support_and_term')
        outcomes.append('UNSUPPORTED' if 'UNSUPPORTED' in values else 'SUPPORTED' if all(x=='SUPPORTED' for x in values) else 'AFFECTED/INDETERMINATE')
    charge(2*len(outcomes)+1,'support_or_term')
    status='SUPPORTED' if 'SUPPORTED' in outcomes else 'UNSUPPORTED' if all(x=='UNSUPPORTED' for x in outcomes) else 'AFFECTED/INDETERMINATE'
    result={'status':status,'complete':complete}
    if complete:cache[receipt['id']]=result
    return result

def holder(s,actor,after=0,limit=4,handle=None):
    require(type(after) is int and after>=0 and type(limit) is int and 1<=limit<=4,'QUERY_PAGE')
    # Receipt enumeration is holder-qualified before labels, ranking, expansion
    # or counts. The implementation makes no timing/physical side-channel claim.
    own=[r for r in s['information']['receipts'] if r['holder_kind']=='actor' and r['holder']==actor]
    charge(len(s['information']['receipts']),'holder_index_visit')
    if actor not in s['information']['actors']:return copy(UNAVAILABLE)
    selected=[r for r in scan(own,'holder_handle_scan') if r['handle']==handle] if handle is not None else own[after:after+limit]
    if handle is not None and not selected:return copy(UNAVAILABLE)
    if handle is not None and selected[0]['kind']=='notice':
        access=[x for x in scan(s['information']['access'],'query_record_scan') if x['holder']==actor and x['container']==selected[0]['record']['container']]
        if not access or not access[-1]['allow']:return copy(UNAVAILABLE)
    origins=[];output=[];traversal=[0,0];cache={}
    for x in scan(own,'holder_origin_scan'):
        charge(len(origins),'holder_origin_membership')
        if x['known_origin'] is not None and x['known_origin'] not in origins:origins.append(x['known_origin'])
    for rr in selected:
        charge(1,'holder_projection_visit')
        value={'handle':rr['handle'],'kind':rr['kind']}
        if rr['kind']=='notice':
            value.update(record_handle=rr['handle'],available=any(x['holder']==actor and x['container']==rr['record']['container'] and x['allow'] for x in scan(s['information']['access'],'query_record_scan')))
            # Latest access overrides earlier grants, without any raw record ID.
            access=[x for x in scan(s['information']['access'],'query_record_scan') if x['holder']==actor and x['container']==rr['record']['container']]
            value['available']=bool(access and access[-1]['allow'])
        else:
            v=next(x for x in scan(s['information']['versions'],'query_record_scan') if x['id']==rr['version']);charge(len(s['information']['versions']),'holder_version_visit')
            charge(len(origins),'holder_origin_lookup')
            value.update(body=rr['body'],value=rr['value'],subject=copy(v['subject']),source_assertion=rr['source_assertion'],
              origin='unknown' if rr['known_origin'] is None else 'basis'+str(origins.index(rr['known_origin'])+1),
              support=support(s,actor,rr,budget=traversal,cache=cache),valid_until=v['valid_until'])
        output.append(value)
    # Local page positions reflect only this actor's acquisitions, never global
    # history gaps, hidden receipt counts, root/head or canonical content hashes.
    return {'status':'ok','receipts':output,'next':after+len(output) if handle is None and after+len(output)<len(own) else None}

def promised_reserve(s):
    """Conservative selected-query cost beyond cold verification.

    Every holder page has at most four receipts. Each <=256-node/512-edge
    support traversal scans at most128 receipts/32 derivations/128 qualifications;
    serialization is bounded separately at64KiB. The 1M reserve dominates these
    visits, 4 reply validation/encode/hash passes and bounded full-key sorting.
    Historical selected states have no more retained records than this state.
    """
    return 1000000

def inspect_snapshot(snapshot,query='current',operation=None):
    s=snapshot.state
    if query=='current':return {'status':'ok','head':snapshot.head,'ordinal':snapshot.ordinal,'state':copy(s)}
    if query in ['resource-census','census']:return {'status':'ok','value':copy(snapshot.census)}
    if query in ['stores','history','provenance']:return {'status':'ok','value':copy(snapshot.stores if query=='stores' else snapshot.stores['9-proof-index']['history'])}
    if query in ['boundary','coverage']:return {'status':'ok','head':snapshot.head,'ordinal':snapshot.ordinal}
    if query in ['terminal-receipt','receipt']:
        rows=snapshot.stores['9-proof-index']['history'];matches=[e for e in scan(rows,'author_operation_lookup') if e['request']['key']['operation']==operation]
        return {'status':'ok','receipt':copy(matches[0]['receipt'])} if len(matches)==1 else {'status':'unavailable','reason':'UNKNOWN_OPERATION'}
    if query=='queue':
        from .organization import queue
        return {'status':'ok','value':queue(copy(s))}
    return {'status':'unavailable','reason':'UNSUPPORTED_QUERY'}
