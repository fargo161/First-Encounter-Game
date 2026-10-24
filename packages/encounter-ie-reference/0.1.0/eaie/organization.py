"""Pure L2 bookkeeping; no organization-wide acquisition or action writer."""
from .data import copy,fields,require,integer,sort_full,scan
from .expressions import evaluate,RULES
KINDS=['OpenCase','RouteTask','AssignTask','TransitionCase','RecordDecision','ApplyReferenceEffect']
STATES=['queued','assigned','in_review','decision_recorded','closed']
def open_case(ctx,a,org,src,dispatcher):
    ctx.grant(a,org,'open');require(src['holder_kind']=='container' and ctx.s['information']['containers'][src['holder']]==org,'CASE_RECEIVED_BASIS')
    cid=ctx.ident('case');tid=ctx.ident('task');ctx.updates+=2
    case={'id':cid,'organization':org,'source':src['id'],'state':'queued','task':tid,'opened':ctx.seq,'last_evidence':None,'reason':'intake'}
    task={'id':tid,'case':cid,'assignee':None,'state':'queued','priority':0,'due':None,'enqueued':ctx.seq,'previous':None}
    ctx.s['organization']['cases'].append(case);ctx.s['organization']['tasks'].append(task)
    if dispatcher is not None:ctx.grant(dispatcher,org,'assign');ctx.notice(dispatcher,src)
    return case
def queue(s):
    return sort_full(s['organization']['tasks'],lambda x:(-x['priority'],x['due'] is None,x['due'] or 0,x['enqueued'],x['id']))
def reduce(ctx):
    s=ctx.s;p=ctx.r['params'];k=ctx.r['kind'];o=s['organization'];a=p.get('actor');ctx.actor(a)
    def get_case(cid):
        matches=[x for x in scan(o['cases'],'organization_record_visit') if x['id']==cid];require(len(matches)==1,'CASE');return matches[0]
    def get_task(tid):
        matches=[x for x in scan(o['tasks'],'organization_record_visit') if x['id']==tid];require(len(matches)==1,'TASK');return matches[0]
    def basis(case,handle):
        rr=ctx.receipt(a,handle);src=next(x for x in scan(s['information']['receipts'],'organization_record_visit') if x['id']==case['source'])
        # A handler must actually have acquired the case fragment; a pointer,
        # membership, existence notice or privileged raw source ID cannot do it.
        acquired=any(x['holder_kind']=='actor' and x['holder']==a and x['kind']=='content' and x['version']==src['version'] and x['body']==src['body'] for x in scan(s['information']['receipts'],'organization_record_visit'))
        require(acquired,'ACQUIRED_CASE_BASIS')
        explicit_reopen=ctx.r['kind']=='TransitionCase' and p.get('state')=='queued'
        require(rr['version']==src['version'] and rr['body']==src['body'] or rr['id']==case['last_evidence'] or explicit_reopen,'CASE_EVIDENCE_ASSOCIATION')
        return rr
    if k=='OpenCase':
        fields(p,['actor','organization','source','dispatcher']);src=next((x for x in scan(s['information']['receipts'],'organization_record_visit') if x['id']==p['source']),None);require(src is not None,'CASE_SOURCE');open_case(ctx,a,p['organization'],src,p['dispatcher'])
    elif k in ['RouteTask','AssignTask']:
        fields(p,['actor','task','priority','due'] if k=='RouteTask' else ['actor','task','assignee']);task=get_task(p['task']);case=get_case(task['case']);ctx.grant(a,case['organization'],'route' if k=='RouteTask' else 'assign')
        require(task['state']!='closed','CLOSED_TASK')
        # Dispatcher must know this exact intake slice, rather than enumerate
        # the organization by virtue of the function grant alone.
        src=next(x for x in scan(s['information']['receipts'],'organization_record_visit') if x['id']==case['source'])
        known=any(x['holder_kind']=='actor' and x['holder']==a and (x['source_receipt']==src['id'] or x['version']==src['version'] and x['kind']=='content') for x in scan(s['information']['receipts'],'organization_record_visit'))
        require(known,'DISPATCHER_ACQUISITION_REQUIRED')
        if k=='RouteTask':
            require(integer(p['priority'],-9,9) and (p['due'] is None or integer(p['due'],0,1000000)),'QUEUE_FIELDS');task.update(priority=p['priority'],due=p['due'])
        else:
            require(task['state'] in ['queued','assigned'],'ASSIGNMENT_STATE');ctx.notice(p['assignee'],src);task.update(assignee=p['assignee'],state='assigned');case['state']='assigned'
        ctx.updates+=2
    elif k in ['TransitionCase','RecordDecision']:
        fields(p,['actor','case','state','evidence'] if k=='TransitionCase' else ['actor','case','evidence','policy','reason'])
        case=get_case(p['case']);task=get_task(case['task']);rr=basis(case,p['evidence']);require(task['assignee']==a or k=='TransitionCase' and p.get('state')=='queued','TASK_ASSIGNMENT')
        if k=='RecordDecision':
            ctx.grant(a,case['organization'],'decide');require(case['state']=='in_review' and p['policy']=='reference-true-v1','DECISION_STATE_POLICY')
            require(evaluate(RULES[p['policy']],{'value':rr['value'],'body':rr['body']}) is True,'DECISION_PREDICATE')
            require(type(p['reason']) is str,'REASON');did=ctx.ident('decision');o['decisions'].append({'id':did,'case':case['id'],'actor':a,'evidence':rr['id'],'policy':p['policy'],'reason':p['reason'],'seq':ctx.seq})
            case.update(state='decision_recorded',last_evidence=rr['id'],reason=p['reason']);task['state']='decision_recorded';ctx.updates+=3
        elif p['state']=='queued':
            ctx.grant(a,case['organization'],'analyze');require(case['state']=='closed' and rr['seq']>max([case['opened']]+[d['seq'] for d in scan(o['decisions'],'organization_record_visit') if d['case']==case['id']]) and rr['id']!=case['last_evidence'],'NEW_EVIDENCE_REQUIRED')
            tid=ctx.ident('task');o['tasks'].append({'id':tid,'case':case['id'],'assignee':None,'state':'queued','priority':0,'due':None,'enqueued':ctx.seq,'previous':task['id']});case.update(state='queued',task=tid,last_evidence=rr['id'],reason='reopen');ctx.updates+=2
        else:
            edge={'assigned':'in_review','decision_recorded':'closed'};require(edge.get(case['state'])==p['state'],'WORKFLOW_TRANSITION');ctx.grant(a,case['organization'],'analyze' if p['state']=='in_review' else 'close');case.update(state=p['state'],last_evidence=rr['id'],reason='explicit transition');task['state']=p['state'];ctx.updates+=2
    elif k=='ApplyReferenceEffect':
        fields(p,['actor','decision']);decision=next((x for x in scan(o['decisions'],'organization_record_visit') if x['id']==p['decision']),None);require(decision is not None,'DECISION');case=get_case(decision['case']);ctx.grant(a,case['organization'],'effect')
        slot='referenceEffectSlot';require(not any(x['decision']==decision['id'] and x['slot']==slot for x in scan(s['reference_effects'],'organization_record_visit')),'EFFECT_CREDIT_CONSUMED')
        s['families']['Env']['ReferenceCounter']['value']+=1;s['reference_effects'].append({'decision':decision['id'],'slot':slot,'operation':copy(ctx.r['key']),'seq':ctx.seq})
    else:raise ValueError('UNSUPPORTED_ORGANIZATION_OPERATION')
    require(ctx.updates<=s['profile']['limits']['queue_updates'],'QUEUE_UPDATE_CAPACITY')
