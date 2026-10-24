"""Bounded pure policy calculation. Core is the only installer."""
from .data import copy, digest, fields, require, integer, closure, ESSENTIAL,sort_full,scan,charge

OWNERS={'contribute':'Env-v1','restore':'Env-v1','schedule':'Obl-v1','cancel':'Obl-v1','fulfill':'Obl-v1',
 'advance':'Core-v1','unload':'Core-v1','reload':'Core-v1','remap':'Core-v1','rebind':'Core-v1',
 'tombstone':'Core-v1','pin':'Core-v1','unpin':'Core-v1','declare_dependency':'Core-v1'}
POLICIES={'Env-v1':'P3-v1','Obl-v1':'P4-v1','Core-v1':'Core-C1-v1'}

def effective(e,t): return max(0,e['base']-(t-e['at']))

def reference(state, artifact, kind, selector, epoch, revision):
    a=state['identity']['artifacts'][artifact]
    return {'producer':a['producer'],'artifact':artifact,'native':a['native'],'normalization':a['normalization'],
            'digest':a['digest'],'kind':kind,'selector':selector,'epoch':epoch,'revision':revision}

def resolve(state, ref, historical=False):
    fields(ref,['producer','artifact','native','normalization','digest','kind','selector','epoch','revision'])
    charge(1,'artifact_lookup');a=state['identity']['artifacts'].get(ref['artifact']);require(a is not None,'MISSING_ARTIFACT')
    require(all(a[k]==ref[k] for k in ['producer','native','normalization','digest']),'ARTIFACT_VERSION_DIGEST')
    require([ref['kind'],ref['selector']] in a['selectors'],'KIND_PARENT_SELECTOR')
    matches=[b for b in scan(state['identity']['bindings'],'binding_record_visit') if all(b[k]==ref[k] for k in ['artifact','kind','selector','epoch','revision']) and (historical or b['current'])]
    require(len(matches)==1,'MISSING_AMBIGUOUS_OR_SUPERSEDED_BINDING')
    b=matches[0]
    require(historical or b['online'],'OFFLINE')
    require(historical or state['identity']['entities'][b['target']]['live'],'TOMBSTONE')
    return copy(b)

def base_calculate(state, r, due_hook=None):
    """Calculate, never publish; return deterministic complete V plus proposed state."""
    state=copy(state);s=copy(state);charge(1,'native_policy_term'); kind=r['kind']; p=r['params'];t=s['clock']['now'];events=[]
    require(kind in OWNERS,'UNSUPPORTED_CAPABILITY')
    require(r['owner']==OWNERS[kind] and r['policy']==POLICIES[r['owner']],'OWNER_POLICY')
    ident=s['identity'];target=r['target']; key=digest(r['key'])
    def event(typ, at, dependencies, payload):
        e={'id':key+':'+str(len(events)),'kind':typ,'effective':at,'publication_time':p.get('to',t) if kind=='advance' else t,
           'dependencies':list(dict.fromkeys(dependencies)), 'payload':copy(payload),'owner':r['owner'],'policy':r['policy']}
        events.append(e);return e['id']
    def live_target():
        charge(1,'entity_lookup')
        require(target in ident['entities'] and ident['entities'][target]['live'],'MISSING_OR_TOMBSTONED_ENTITY')
        if r['reference'] is not None:require(resolve(s,r['reference'])['target']==target,'TARGET_BINDING')
    if kind in ['contribute','restore','rebind']:
        require(r['reference'] is not None,'QUALIFIED_REFERENCE_REQUIRED');live_target()
    if kind=='contribute':
        fields(p,['q']);q=p['q'];require(integer(q,0,4),'Q_RANGE')
        require(target in s['families']['Env'],'WRONG_TARGET_KIND')
        e=s['families']['Env'][target];before=copy(e);x=effective(e,t);y=min(20,(3*x)//2+q)
        crossing=x<7<=y
        proposed={'blocked':False if crossing else e['blocked'],'base':y,'at':t}
        eid=event('contribution_release' if crossing else 'contribution',t,[e['cause']],{'target':target,'q':q,'x':x,'y':y,'crossing':crossing})
        if any(e[k]!=v for k,v in proposed.items()):e.update(proposed,cause=eid)
    elif kind=='restore':
        fields(p,[]);require(target in s['families']['Env'],'WRONG_TARGET_KIND')
        e=s['families']['Env'][target];before=copy(e)
        eid=event('restore_obstruction',t,[e['cause']],{'target':target})
        if not (e['blocked'] and e['base']==0 and e['at']==t):e.update(blocked=True,base=0,at=t,cause=eid)
    elif kind=='advance':
        fields(p,['to']);T=p['to'];require(integer(T,t,1000000),'TIME_RANGE')
        due=sort_full([(k,o) for k,o in scan(s['clock']['obligations'].items(),'obligation_record_visit') if o['status']=='active' and t<o['due']<=T],key=lambda pair:(pair[1]['due'],pair[1]['ordinal']))
        require(len(due)<=s['profile']['limits']['due_jobs'],'DUE_WORK_CAPACITY')
        for name,o in scan(due,'due_job_visit'):
            charge(1,'native_policy_term')
            e=s['families']['Env'][o['target']];at=o['due'];x=effective(e,at)
            if due_hook: due_hook({'obligation':name,'time':at,'effective':x,'state':copy(s)})
            dep=[o['cause'],e['cause']]
            if o['policy']=='release8':
                eid=event('expiry_release',at,dep,{'obligation':name,'target':o['target'],'observed_effective':x})
                o.update(status='expired',cause=eid);e.update(blocked=False,base=8,at=at,cause=eid)
            else:
                threshold=5 if o['policy']=='readiness5' else 8
                status='expired-blocked' if e['blocked'] else ('expired-ready' if x>=threshold else 'expired-low')
                eid=event(status,at,dep,{'obligation':name,'target':o['target'],'observed_effective':x,'threshold':threshold})
                o.update(status=status,cause=eid)
        s['clock']['now']=T
    elif kind=='schedule':
        fields(p,['id','due','policy']);live_target();require(target in s['families']['Env'],'WRONG_TARGET_KIND')
        require(type(p['id']) is str and 0<len(p['id'])<=32,'OBLIGATION_ID')
        require(integer(p['due'],t+1,1000000) and p['policy'] in ['release8','readiness5','readiness8'],'SCHEDULE_POLICY_TIME')
        obs=s['clock']['obligations']
        if p['id'] not in obs:
            require(len(obs)<8,'OBLIGATION_CAPACITY')
            eid=event('schedule',t,[],p);obs[p['id']]={'status':'active','due':p['due'],'ordinal':s['clock']['next_ordinal'],'policy':p['policy'],'target':target,'cause':eid};s['clock']['next_ordinal']+=1
    elif kind in ['cancel','fulfill']:
        fields(p,['id']);o=s['clock']['obligations'].get(p['id']);require(o is not None,'UNKNOWN_OBLIGATION')
        if o['status']=='active':
            require(t<o['due'],'UNSETTLED_DUE_STATE')
            eid=event(kind,t,[o['cause']],{'obligation':p['id']});o.update(status='canceled' if kind=='cancel' else 'fulfilled',cause=eid)
    elif kind in ['unload','reload']:
        fields(p,['artifact','old_epoch'] if kind=='unload' else ['artifact','old_epoch','new_epoch'])
        matches=[b for b in scan(ident['bindings'],'binding_record_visit') if b['artifact']==p['artifact'] and b['epoch']==p['old_epoch'] and b['current']]
        require(bool(matches),'INCARNATION')
        if kind=='unload':
            for b in scan(matches,'binding_record_visit'):b['online']=False
        else:
            require(type(p['new_epoch']) is str and 0<len(p['new_epoch'])<=32 and not any(b['artifact']==p['artifact'] and b['epoch']==p['new_epoch'] for b in scan(ident['bindings'],'binding_record_visit')),'EPOCH_REUSE')
            require(all(not b['online'] for b in scan(matches,'binding_record_visit')),'MUST_UNLOAD_FIRST')
            for b in scan(matches,'binding_record_visit'):
                b['current']=False;new=copy(b);new.update(epoch=p['new_epoch'],revision=b['revision']+1,current=True,online=True);ident['bindings'].append(new)
    elif kind=='rebind':
        fields(p,['entity']);require(p['entity']==target,'CANONICAL_BINDING_CONFLICT')
        b=resolve(s,r['reference']);actual=next(x for x in scan(ident['bindings'],'binding_record_visit') if x==b)
        actual['current']=False;new=copy(actual);new.update(current=True,revision=actual['revision']+1);ident['bindings'].append(new)
    elif kind=='remap':
        fields(p,['digest']);require(p['digest']==s['binding_plan']['digest'],'REMAP_AUTHORITY')
        plan=s['binding_plan']['remap'];old,old_epoch=plan['old'].split('@');new,new_epoch=plan['new'].split('@')
        current=[b for b in scan(ident['bindings'],'binding_record_visit') if b['artifact']==old and b['epoch']==old_epoch and b['current']]
        require(bool(current) and all(b['online'] for b in scan(current,'binding_record_visit')),'REMAP_OLD_SCOPE')
        require(len(current)==len(plan['pairs']),'REMAP_CARDINALITY')
        for pair in scan(plan['pairs'],'remap_pair_visit'):
            local,dest=pair.split('->');k,selector=local.split('|');entity=dest.split(';')[0]
            require([k,selector] in ident['artifacts'][new]['selectors'],'REMAP_SELECTOR')
            matches=[b for b in scan(current,'binding_record_visit') if b['kind']==k and b['selector']==selector and b['target']==entity];require(len(matches)==1,'REMAP_PAIR')
            b=matches[0];b['current']=False;c=copy(b);c.update(artifact=new,epoch=new_epoch,revision=int(plan['binding-revision']),current=True);ident['bindings'].append(c)
    elif kind=='tombstone':
        fields(p,[]);live_target();require(ident['entities'][target]['kind'] in ['actor','mechanism'],'UNSUPPORTED_LIFECYCLE')
        require(target in s['binding_plan']['tombstone_targets'],'UNSUPPORTED_LIFECYCLE_TARGET')
        require(not any(o['status']=='active' and o['target']==target for o in scan(s['clock']['obligations'].values(),'obligation_record_visit')),'ACTIVE_OBLIGATION_TARGET')
        ident['entities'][target]['live']=False
    elif kind in ['pin','unpin']:
        fields(p,['node']);n=p['node'];require(n in s['protection']['graph'],'UNKNOWN_RETENTION_UNIT')
        if kind=='pin':s['protection']['pins']=sort_full(set(s['protection']['pins'])|{n})
        else:
            require(n not in ESSENTIAL,'ESSENTIAL_ROOT');s['protection']['pins']=[x for x in scan(s['protection']['pins'],'retention_pin_visit') if x!=n]
    elif kind=='declare_dependency':
        fields(p,['from','to','fidelity']);g=s['protection']['graph']
        require(p['from'] in g and p['to'] in g and p['fidelity']=='exact','DEPENDENCY_SCOPE_FIDELITY')
        g[p['from']]=sort_full(set(g[p['from']])|{p['to']})
    require(len(ident['bindings'])<=64,'BINDING_CAPACITY')
    # No active due item may survive at/before admitted world time.
    require(all(o['status']!='active' or o['due']>s['clock']['now'] for o in scan(s['clock']['obligations'].values(),'obligation_record_visit')),'UNSETTLED_DUE_STATE')
    material=any(s[k]!=state[k] for k in ['families','identity','clock','protection'])
    status='O1' if material else 'O2'
    if not events:event('no_material_effect' if status=='O2' else kind,p['to'] if kind=='advance' else t,[],{'target':target,'params':p})
    s['lineage']['events'].extend(events)
    changes={k:copy(s[k]) for k in s if s[k]!=state[k]}
    v={'id':r['result_id'],'request':digest(r),'status':status,'effects':changes,'occurrences':events,
       'dependencies':{'head':r['witness']['head'],'policy':r['policy'],'time':t},'disclosures':[]}
    return s,v

# One native dispatcher; these reducers cannot install or open storage.
from . import information,organization
OWNERS.update({k:'L1-v1' for k in information.KINDS})
OWNERS.update({k:'L2-v1' for k in organization.KINDS})
OWNERS['ApplyReferenceEffect']='Core-v1';OWNERS['AdvanceTime']='Core-v1'
POLICIES.update({'L1-v1':'IE-information-v1','L2-v1':'IE-organization-v1'})
def calculate(state,r,due_hook=None):
    require(r['kind'] in OWNERS and r['owner']==OWNERS[r['kind']] and r['policy']==POLICIES[r['owner']],'OWNER_POLICY')
    if r['kind'] not in information.KINDS+organization.KINDS:
        rr=copy(r)
        if rr['kind']=='AdvanceTime':rr['kind']='advance'
        s,v=base_calculate(state,rr,due_hook)
        s['lineage']['admission_seq']=state['lineage']['admission_seq']+1
        v['request']=digest(r);v['effects']['lineage']=copy(s['lineage'])
    else:
        s=copy(state);ctx=information.Context(s,r)
        if r['kind'] in information.KINDS:information.reduce(ctx)
        else:organization.reduce(ctx)
        require(ctx.updates<=s['profile']['limits']['queue_updates'],'QUEUE_UPDATE_CAPACITY')
        information.validate_state(s);s['lineage']['admission_seq']=ctx.seq
        occurrence={'id':ctx.ident('occurrence'),'kind':r['kind'],'effective':s['clock']['now'],
          'publication_time':s['clock']['now'],'dependencies':[],
          'payload':{'actor':r['params'].get('actor')},'owner':r['owner'],'policy':r['policy']}
        s['lineage']['events'].append(occurrence)
        v={'id':r['result_id'],'request':digest(r),'status':'O1' if s!=state else 'O2',
          'effects':{'kind':r['kind'],'created':[x['id'] for key in ['versions','receipts','transmissions','derivations'] for x in scan(s['information'][key],'information_created_scan') if x['seq']==ctx.seq]},
          'occurrences':[occurrence],'dependencies':{'head':r['witness']['head'],'policy':r['policy'],'time':state['clock']['now']},'disclosures':[]}
    information.validate_state(s)
    return s,v
