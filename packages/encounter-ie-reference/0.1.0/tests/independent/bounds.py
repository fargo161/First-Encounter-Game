"""Actual smaller immutable-profile boundaries, never raised default caps."""
from verify_independent import plain,encoded,save


def register(t):
    from eaie.profile import DEFAULT_LIMITS
    def limits(**changes):return dict(DEFAULT_LIMITS,**changes)
    def claim_params(body='x',corrects=None):
        return {'actor':'alice','body':body,'subject':{'kind':'alleged','scope':'alice','label':'boundary'},
                'value':'TRUE','source_assertion':'fixture','valid_until':None,'corrects':corrects}
    def derive_params(h):
        return {'actor':'alice','rule':'identity-v1','alternatives':[[h]],'body':'d',
                'subject':{'kind':'alleged','scope':'alice','label':'boundary'},'value':'TRUE'}
    def referral_params(h,create=True):
        return {'actor':'alice','source':h,'body':'x','targets':[{'kind':'container','id':'receiver-inbox'}],
                'source_assertion':'fixture','disclose_origin':False,'organization':'receiver',
                'create_case':create,'dispatcher':'dispatcher' if create else None}
    def one_more(field,cap):
        c=t.new('lower-'+field+'-'+str(cap),limits=limits(**{field:cap}))
        source=None
        if field not in ('roots','versions','receipts'):
            t.call(c,'basis','AssertClaim',claim_params())
            source=t.receipts(c,'alice')[-1]['handle']
        for i in range(cap+1):
            if field in ('roots','versions','receipts'):
                kind='AssertClaim';p=claim_params(str(i),source if field=='versions' else None)
            elif field=='transmissions':
                kind='Deliver';p={'actor':'alice','source':source,'body':'x',
                    'targets':[{'kind':'actor','id':'observer'}],'source_assertion':'x','disclose_origin':False}
            elif field in ('derivations','premise_edges'):kind='Derive';p=derive_params(source)
            else:kind='Refer';p=referral_params(source)
            if i<cap:
                t.call(c,'entry-'+str(i),kind,p)
                if source is None:source=t.receipts(c,'alice')[-1]['handle']
            else:t.refuse(c,'one-over',kind,p)
        assert c.snapshot().ordinal==(cap if field in ('roots','versions','receipts') else cap+1)
        if cap:t.preserved(c)
    for field in ('roots','versions','receipts','transmissions','derivations','premise_edges','cases'):
        def run(field=field):
            for cap in (0,1,2):one_more(field,cap)
            return {'kind':'actual lowered immutable profiles','caps':[0,1,2],
                    'default_maximum':DEFAULT_LIMITS[field],'default_maximum_reachability':'not established by this case'}
        t.run('M4-lowered-'+field+'-minus-at-plus-real-writer',run)

    def per_unit_profile():
        for field in ('targets','queue_updates'):
            for cap in (1,2,3):
                c=t.new('unit-'+field+'-'+str(cap),limits=limits(**{field:cap}))
                t.call(c,'basis','AssertClaim',claim_params())
                h=t.receipts(c,'alice')[-1]['handle']
                if field=='targets':
                    kind='Deliver';p={'actor':'alice','source':h,'body':'x',
                       'targets':[{'kind':'actor','id':'observer'},{'kind':'actor','id':'handler'}],
                       'source_assertion':'x','disclose_origin':False}
                else:kind='Refer';p=referral_params(h,True)
                if cap<2:t.refuse(c,'unit',kind,p)
                else:t.call(c,'unit',kind,p);t.preserved(c)
    t.run('M4-lowered-per-unit-targets-queue-updates',per_unit_profile)

    def closed_tasks_count():
        for cap in (0,1,2):
            c=t.new('retained-tasks-'+str(cap),limits=limits(tasks=cap))
            t.call(c,'basis','AssertClaim',claim_params())
            h=t.receipts(c,'alice')[-1]['handle']
            if cap==0:t.refuse(c,'intake','Refer',referral_params(h));continue
            t.call(c,'intake','Refer',referral_params(h));case=t.state(c)['organization']['cases'][0];task=t.state(c)['organization']['tasks'][0]
            t.call(c,'assign','AssignTask',{'actor':'dispatcher','task':task['id'],'assignee':'handler'})
            notice=t.receipts(c,'handler',False)[-1]['handle']
            t.call(c,'read','AcquireRecord',{'actor':'handler','notice':notice})
            h=t.receipts(c,'handler')[-1]['handle']
            t.call(c,'review','TransitionCase',{'actor':'handler','case':case['id'],'state':'in_review','evidence':h})
            t.call(c,'decision','RecordDecision',{'actor':'handler','case':case['id'],'evidence':h,'policy':'reference-true-v1','reason':'x'})
            t.call(c,'close','TransitionCase',{'actor':'handler','case':case['id'],'state':'closed','evidence':h})
            fresh=t.claim(c,body='new',name='new-evidence')
            t.deliver(c,'alice',fresh,[('actor','handler')],body='new',name='new-delivery')
            new=t.receipts(c,'handler')[-1]['handle']
            before=t.state(c);p={'actor':'handler','case':case['id'],'state':'queued','evidence':new}
            if cap==1:
                t.refuse(c,'reopen','TransitionCase',p)
                assert t.state(c)==before and len(t.receipts(c,'handler'))==2
            else:
                t.call(c,'reopen','TransitionCase',p)
                tasks=t.state(c)['organization']['tasks'];assert len(tasks)==2 and tasks[0]['state']=='closed'
                assert tasks[1]['previous']==tasks[0]['id'] and tasks[1]['enqueued']>tasks[0]['enqueued']
            t.preserved(c)
    t.run('M4-lowered-tasks-counts-closed-and-reopened',closed_tasks_count)

    def exact_state_bytes():
        reference=t.new('state-byte-reference',limits=limits(state_bytes=20000))
        p=claim_params('x'*512)
        t.call(reference,'state-shape','AssertClaim',p)
        floor=len(encoded(t.state(reference)));assert 10000<floor<20000
        for delta in (-1,0,1):
            c=t.new('state-byte-'+str(delta),limits=limits(state_bytes=floor+delta))
            if delta<0:t.refuse(c,'state-shape','AssertClaim',p)
            else:
                t.call(c,'state-shape','AssertClaim',p)
                assert len(encoded(t.state(c)))==floor
                t.preserved(c)
        return {'independent_encoded_poststate_floor':floor,'scope':'lowered immutable profiles'}
    t.run('M4-exact-poststate-bytes-minus-at-plus',exact_state_bytes)

    def exact_request_bytes():
        reference=t.new('request-byte-reference',limits=limits(request_bytes=20000))
        p=claim_params('x')
        floor=len(encoded(reference.prepare('request-shape','AssertClaim',p)))
        assert 10000<floor<20000
        for delta in (-1,0,1):
            c=t.new('request-byte-'+str(delta),limits=limits(request_bytes=floor+delta))
            before=t.state(c)
            try:r=c.prepare('request-shape','AssertClaim',p)
            except t.Rejected:
                assert delta<0 and t.state(c)==before;continue
            assert delta>=0 and len(encoded(r))==floor
            a=c.admit(r);assert a['status']=='O1',a
            t.oldest[str(c.path)]=(plain(r),plain(a));t.preserved(c)
        return {'independent_encoded_request_floor':floor,'scope':'lowered immutable profiles'}
    t.run('M4-exact-full-private-request-minus-at-plus',exact_request_bytes)

    def exact_intent_bytes():
        for n in (8191,8192,8193):
            c=t.new('intent-bytes-'+str(n));p=claim_params('x'*512)
            p['subject']['label']='s'*4096;p['source_assertion']=''
            base=len(encoded({'kind':'AssertClaim','params':p,'target':None,'reference':None}))
            p['source_assertion']='a'*(n-base)
            assert len(p['source_assertion'].encode())<=4096
            assert len(encoded({'kind':'AssertClaim','params':p,'target':None,'reference':None}))==n
            if n>8192:t.refuse(c,'intent-shape','AssertClaim',p)
            else:t.call(c,'intent-shape','AssertClaim',p);t.preserved(c)
        return {'scope':'actual default-profile intent8192 boundary','sizes':[8191,8192,8193]}
    t.run('M4-actual-default-intent-bytes-minus-at-plus',exact_intent_bytes)
