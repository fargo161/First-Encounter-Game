"""I-authored assertions against the approved A–L semantic obligations."""
import copy
import hashlib
import json
import sqlite3
from verify_independent import encoded, plain, save, sql_oracle


def register(t):
    def scenario_a():
        c=t.new('A-unseen',fixture='A'); initial=t.state(c)
        assert initial['reference_truth']=={'incident':'incident-1','kind':'synthetic-token-loss',
            'culprit':'P','innocent':'alice','tokens_before':2,'tokens_after':1}
        for actor in ('alice','observer','dispatcher','handler','outsider','player'):
            assert t.receipts(c,actor)==[]
        from eaie.fixtures import LOSS_OBSERVATION
        t.call(c,'discrepancy','Observe',plain(LOSS_OBSERVATION))
        h=t.receipts(c,'observer')[-1]['handle']
        assert t.receipts(c,'dispatcher')==[] and t.receipts(c,'handler')==[]
        t.deliver(c,'observer',h,[('actor','dispatcher')],body='token')
        assert [r['body'] for r in t.receipts(c,'dispatcher')]==['token']
        assert t.receipts(c,'handler')==[]
        assert t.state(c)['families']==initial['families']
        assert t.state(c)['reference_truth']==initial['reference_truth']
        t.preserved(c)
    t.run('A-unseen-actuality-delivery-boundary',scenario_a)

    def scenario_b():
        c=t.new('B-mistaken',fixture='B'); initial=t.state(c)['families']
        truth=t.state(c)['reference_truth']
        assert truth['culprit']=='P' and truth['innocent']=='alice'
        h=t.claim(c,actor='observer',body='alice took the missing token',value='TRUE',
                  subject={'kind':'actual','entity':'alice'})
        assert t.receipts(c,'handler')==[]
        t.deliver(c,'observer',h,[('actor','handler')],body='alice took the missing token')
        r=t.receipts(c,'handler')[-1]
        assert r['body']=='alice took the missing token' and r['value']=='TRUE'
        assert t.state(c)['families']==initial
        assert t.state(c)['reference_truth']==truth
        view=encoded(t.items(c,'handler'))
        assert b'lie' not in view and b'intent' not in view
        t.preserved(c)
    t.run('B-sincere-false-report-no-world-rewrite',scenario_b)

    def scenario_c():
        c=t.new('C-fabricated',fixture='C'); initial=t.state(c)
        h=t.claim(c,body='fabricated incident X',value='TRUE')
        t.deliver(c,'alice',h,[('actor','handler')],body='incident X')
        assert t.state(c)['identity']==initial['identity']
        assert t.state(c)['families']==initial['families']
        assert len(t.state(c)['information']['versions'])==1
        assert t.state(c)['information']['versions'][0]['subject']['kind']=='alleged'
        bad={'actor':'observer','body':'fabricated incident X','subject':{'kind':'actual','entity':'D'},
             'value':'TRUE','source_assertion':'direct fixture observation','valid_until':None,'corrects':None}
        t.refuse(c,'forged-observation','Observe',bad)
        t.preserved(c)
    t.run('C-fabricated-subject-forged-observation-refused',scenario_c)

    def scenario_d():
        c=t.new('D-common-source',fixture='D'); h=t.claim(c)
        t.deliver(c,'alice',h,[('actor','observer'),('actor','dispatcher')],disclose=False)
        ho=t.receipts(c,'observer')[-1]['handle']; hd=t.receipts(c,'dispatcher')[-1]['handle']
        t.deliver(c,'observer',ho,[('actor','handler')],name='relay-a',disclose=False)
        t.deliver(c,'dispatcher',hd,[('actor','handler')],name='relay-b',disclose=False)
        rows=t.receipts(c,'handler'); assert len(rows)==2
        info=t.state(c)['information']; assert len(info['versions'])==1 and len(info['transmissions'])==3
        assert rows[0]['version']==rows[1]['version']
        assert all(r['known_origin'] is None for r in rows)
        view=encoded(t.items(c,'handler')); assert b'corroborated' not in view and b'independent' not in view
        t.claim(c,actor='outsider',name='independent-origin')
        hx=t.receipts(c,'outsider')[-1]['handle']
        t.deliver(c,'outsider',hx,[('actor','handler')],name='relay-x',disclose=True)
        assert len(t.state(c)['information']['versions'])==2
        assert t.receipts(c,'handler')[-1]['version']!=rows[0]['version']
        t.preserved(c)
    t.run('D-common-origin-and-unknown-not-corroboration',scenario_d)

    def scenario_e():
        c=t.new('E-returned-rumor',fixture='E'); h=t.claim(c)
        t.deliver(c,'alice',h,[('actor','observer')])
        ho=t.receipts(c,'observer')[-1]['handle']
        r=c.prepare('return','Deliver',{'actor':'observer','source':ho,'body':'selected',
            'targets':[{'kind':'actor','id':'alice'}],'source_assertion':'different wording','disclose_origin':True})
        a=c.admit(r); assert a['status']=='O1'
        before=t.state(c); assert c.admit(r)=={'status':'O3','receipt':a['receipt']}
        assert t.state(c)==before
        assert len(before['information']['versions'])==1 and len(before['information']['transmissions'])==2
        assert t.receipts(c,'alice')[-1]['body']=='selected'
        for row in before['information']['versions']+before['information']['receipts']+before['information']['transmissions']:
            assert row['pos']>=0
        t.preserved(c)
    t.run('E-chronological-rumor-loop-exact-retry',scenario_e)

    def scenario_f():
        c=t.new('F-stale',fixture='F'); h=t.claim(c,body='old location')
        at1=t.items(c,'alice',cutoff=1)
        t.call(c,'clock','AdvanceTime',{'to':10})
        assert t.items(c,'alice',cutoff=1)==at1
        assert [r['body'] for r in t.receipts(c,'alice')]==['old location']
        p={'actor':'alice','body':'new location','subject':{'kind':'alleged','scope':'alice','label':'synthetic incident'},
           'value':'TRUE','source_assertion':'later correction','valid_until':None,'corrects':h}
        t.call(c,'correction','AssertClaim',p)
        assert t.items(c,'alice',cutoff=1)==at1
        assert [r['body'] for r in t.receipts(c,'alice')]==['old location','new location']
        assert t.receipts(c,'handler')==[]
        t.preserved(c)
    t.run('F-historical-cutoff-correction-retains-original',scenario_f)

    def make_case(c,name='refer',actor='alice',handle=None,body='selected X',dispatcher='dispatcher'):
        h=handle or t.claim(c)
        t.call(c,name,'Refer',{'actor':actor,'source':h,'body':body,
            'targets':[{'kind':'container','id':'receiver-inbox'}],'source_assertion':'selected attribution',
            'disclose_origin':False,'organization':'receiver','create_case':True,'dispatcher':dispatcher})
        return t.state(c)['organization']['cases'][-1],t.state(c)['organization']['tasks'][-1]

    def assign(c,task,actor='dispatcher',assignee='handler',name='assign'):
        t.call(c,name,'AssignTask',{'actor':actor,'task':task['id'],'assignee':assignee})
        return t.receipts(c,assignee,content=False)[-1]['handle']

    def scenario_g():
        c=t.new('G-restricted',fixture='G'); case,task=make_case(c)
        notice=assign(c,task)
        assert t.receipts(c,'handler')==[]
        for missing in ('h999','unknown',notice+'x'):
            assert c.holder_view('handler',handle=missing)=={'status':'unavailable'}
        t.call(c,'revoke-before','SetRecordAccess',{'actor':'dispatcher','holder':'handler','container':'receiver-inbox','allow':False})
        t.refuse(c,'denied-acquire','AcquireRecord',{'actor':'handler','notice':notice})
        t.call(c,'grant','SetRecordAccess',{'actor':'dispatcher','holder':'handler','container':'receiver-inbox','allow':True})
        assert t.receipts(c,'handler')==[]
        t.call(c,'acquire','AcquireRecord',{'actor':'handler','notice':notice})
        assert [r['body'] for r in t.receipts(c,'handler')]==['selected X']
        before=t.items(c,'handler')
        t.call(c,'revoke-after','SetRecordAccess',{'actor':'dispatcher','holder':'handler','container':'receiver-inbox','allow':False})
        after=t.items(c,'handler')
        assert [r for r in after['receipts'] if r['kind']=='content']==[r for r in before['receipts'] if r['kind']=='content']
        assert all(not r['available'] for r in after['receipts'] if r['kind']=='notice')
        t.refuse(c,'denied-reacquire','AcquireRecord',{'actor':'handler','notice':notice})
        assert t.receipts(c,'outsider')==[]
        t.preserved(c)
    t.run('G-notice-grant-content-revocation-distinct',scenario_g)

    def workflow(c,tiny=False,handle=None,body='selected X'):
        actor='alice' if tiny else 'handler'; assigner='alice' if tiny else 'dispatcher'
        case,task=make_case(c,dispatcher=assigner,handle=handle,body=body)
        notice=assign(c,task,actor=assigner,assignee=actor)
        t.call(c,'acquire','AcquireRecord',{'actor':actor,'notice':notice})
        evidence=t.receipts(c,actor)[-1]['handle']
        t.call(c,'review','TransitionCase',{'actor':actor,'case':case['id'],'state':'in_review','evidence':evidence})
        t.call(c,'decision','RecordDecision',{'actor':actor,'case':case['id'],'evidence':evidence,'policy':'reference-true-v1','reason':'received TRUE fragment'})
        decision=t.state(c)['organization']['decisions'][-1]
        effect=c.prepare('effect','ApplyReferenceEffect',{'actor':actor,'decision':decision['id']})
        result=c.admit(effect); assert result['status']=='O1'
        t.record_work(c,'effect','ApplyReferenceEffect',result)
        assert c.admit(effect)=={'status':'O3','receipt':result['receipt']}
        t.refuse(c,'second-effect-new-id','ApplyReferenceEffect',{'actor':actor,'decision':decision['id']})
        t.call(c,'close','TransitionCase',{'actor':actor,'case':case['id'],'state':'closed','evidence':evidence})
        assert t.state(c)['families']['Env']['ReferenceCounter']['value']==1
        return case,task,evidence

    def false_information_effect():
        c=t.new('B-false-information-effect',fixture='B');truth=t.state(c)['reference_truth']
        body='alice took the missing token'
        h=t.claim(c,actor='observer',body=body,name='mistaken-report',
                  subject={'kind':'actual','entity':'alice'})
        t.deliver(c,'observer',h,[('actor','alice')],body=body,name='report-to-referrer')
        actual=t.receipts(c,'alice')[-1]['handle']
        workflow(c,handle=actual,body=body)
        assert t.state(c)['reference_truth']==truth and truth['culprit']=='P'
        assert t.state(c)['families']['Env']['ReferenceCounter']['value']==1
        decision=t.state(c)['organization']['decisions'][0]
        evidence=[r for r in t.state(c)['information']['receipts'] if r['id']==decision['evidence']][0]
        assert evidence['body']==body and evidence['holder']=='handler'
        t.preserved(c)
    t.run('B-false-information-actual-policy-caused-neutral-effect',false_information_effect)

    def scenario_h():
        c=t.new('H-workflow',fixture='H'); before=t.state(c)['families']['Env']['D']
        workflow(c)
        s=t.state(c); assert s['organization']['cases'][0]['state']=='closed'
        assert s['organization']['tasks'][0]['state']=='closed'
        assert s['families']['Env']['D']==before
        assert len(s['reference_effects'])==1
        assert t.receipts(c,'outsider')==[]
        t.preserved(c)
    t.run('H-information-policy-separated-once-effect',scenario_h)

    def scenario_i():
        c=t.new('I-cross-org',fixture='I'); h=t.claim(c,body='selected X sealed Y')
        case,task=make_case(c,handle=h)
        assert [r['body'] for r in t.receipts(c,'receiver-inbox',content=False)]==['selected X']
        assert t.receipts(c,'handler')==[] and t.receipts(c,'outsider')==[]
        assert b'sealed Y' not in encoded(t.items(c,'dispatcher'))
        t.refuse(c,'foreign-close','TransitionCase',{'actor':'alice','case':case['id'],'state':'closed','evidence':h})
        t.refuse(c,'foreign-assignment','AssignTask',{'actor':'alice','task':task['id'],'assignee':'alice'})
        notice=assign(c,task)
        t.call(c,'read-slice','AcquireRecord',{'actor':'handler','notice':notice})
        assert [r['body'] for r in t.receipts(c,'handler')]==['selected X']
        assert b'sealed Y' not in encoded(t.items(c,'handler'))
        t.preserved(c)
    t.run('I-selected-cross-organization-referral',scenario_i)

    def scenario_j():
        c=t.new('J-tiny',fixture='J'); workflow(c,tiny=True)
        assert len(t.state(c)['organization']['cases'])==1
        assert t.state(c)['organization']['tasks'][0]['assignee']=='alice'
        t.preserved(c)
    t.run('J-one-actor-explicit-functions',scenario_j)

    def scenario_k():
        c=t.new('K-compartment',fixture='K'); hidden=t.items(c,'outsider'); player=t.items(c,'player')
        h=t.claim(c,body='selected X secret attachment'); case,task=make_case(c,handle=h)
        notice=assign(c,task)
        assert t.items(c,'outsider')==hidden and t.items(c,'player')==player
        assert t.receipts(c,'handler')==[]
        t.call(c,'acquire','AcquireRecord',{'actor':'handler','notice':notice})
        assert t.items(c,'outsider')==hidden and t.items(c,'player')==player
        for actor in ('outsider','player','observer'):
            assert c.holder_view(actor,handle=notice)=={'status':'unavailable'}
        before=hashlib.sha256(c.path.read_bytes()).hexdigest(); state=t.state(c)
        for actor in ('handler','outsider','handler','player','dispatcher'):
            t.items(c,actor,cutoff=1); t.items(c,actor)
        c.inspect(); c.inspect(query='failed-guards',request=c.prepare('probe','AcquireRecord',{'actor':'outsider','notice':'h999'}))
        assert hashlib.sha256(c.path.read_bytes()).hexdigest()==before and t.state(c)==state
        t.preserved(c)
    t.run('K-compartments-handles-cache-cutoff-read-purity',scenario_k)

    def scenario_l():
        c=t.new('L-support',fixture='L'); h1=t.claim(c,name='premise-1'); h2=t.claim(c,name='premise-2')
        t.call(c,'derive','Derive',{'actor':'alice','rule':'identity-v1','alternatives':[[h1],[h2]],
            'body':'derived conclusion','subject':{'kind':'alleged','scope':'alice','label':'conclusion'},'value':'TRUE'})
        conclusion=t.receipts(c,'alice')[-1]['handle']
        t.call(c,'stance','DeclareStance',{'actor':'alice','source':conclusion,'stance':'accept'})
        prior=t.items(c,'alice',cutoff=4)
        basis=t.claim(c,name='withdrawal-notice',body='withdrawal cause',value='FALSE')
        t.call(c,'withdraw-1','QualifySupport',{'actor':'alice','target':h1,'basis':basis,'kind':'withdrawal'})
        v=c.holder_view('alice',handle=conclusion); assert b'"status":"SUPPORTED"' in encoded(v),v
        t.call(c,'withdraw-2','QualifySupport',{'actor':'alice','target':h2,'basis':basis,'kind':'withdrawal'})
        v=c.holder_view('alice',handle=conclusion); assert b'"status":"UNSUPPORTED"' in encoded(v),v
        assert t.items(c,'alice',cutoff=4)==prior
        assert t.state(c)['information']['stances'][0]['stance']=='accept'
        assert len(t.state(c)['information']['derivations'])==1
        t.preserved(c)
    t.run('L-alternative-support-withdrawal-stance-retained',scenario_l)

    def nominal16():
        c=t.new('nominal16'); case,task,old=workflow(c)
        t.claim(c,actor='alice',body='new evidence',name='new-claim')
        h=t.receipts(c,'alice')[-1]['handle']
        t.deliver(c,'alice',h,[('actor','handler')],body='new evidence',name='new-evidence-delivery')
        fresh=t.receipts(c,'handler')[-1]['handle']
        t.call(c,'reopen','TransitionCase',{'actor':'handler','case':case['id'],'state':'queued','evidence':fresh})
        newtask=t.state(c)['organization']['tasks'][-1]
        assert newtask['id']!=task['id'] and newtask['enqueued']>task['enqueued']
        assert t.state(c)['organization']['tasks'][0]['state']=='closed'
        notice=assign(c,newtask,name='new-assignment')
        t.call(c,'new-acquire','AcquireRecord',{'actor':'handler','notice':notice})
        current=fresh
        t.call(c,'new-review','TransitionCase',{'actor':'handler','case':case['id'],'state':'in_review','evidence':current})
        t.call(c,'new-decision','RecordDecision',{'actor':'handler','case':case['id'],'evidence':current,'policy':'reference-true-v1','reason':'new actual acquisition'})
        t.call(c,'sixteenth','AdvanceTime',{'to':12})
        assert c.snapshot().ordinal==16,c.snapshot().ordinal
        assert len(t.state(c)['organization']['tasks'])==2 and len(t.state(c)['organization']['decisions'])==2
        assert len(t.state(c)['reference_effects'])==1
        t.preserved(c)
    t.run('M4-minimum-16-admission-mixed-reopen-trace',nominal16)
