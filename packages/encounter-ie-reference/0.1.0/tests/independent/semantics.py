"""I controls for pure structural guards and holder-qualified causal meaning."""
from verify_independent import encoded,plain


def register(t):
    def pure_guards():
        from eaie.expressions import evaluate
        from eaie.data import decode,plain as capture
        def chain(n):
            out={'literal':True}
            for _ in range(n-1):out={'not':out}
            return out
        for n in (31,32,33):
            sizes={31:[7,7,8,8],32:[7,8,8,8],33:[8,8,8,8]}[n]
            expr={'and':[chain(k) for k in sizes]}
            try:r=evaluate(expr,{})
            except Exception:assert n==33
            else:assert n<=32 and type(r) is bool
        for depth in (7,8,9):
            try:evaluate(chain(depth+1),{})
            except Exception:assert depth==9
            else:assert depth<=8
        for bad in ({'call':'os.system'},{'field':'reference_truth'},{'import':'os'},
                    {'eq':[{'literal':1},{'literal':True}]}):
            try:evaluate(bad,{})
            except Exception:pass
            else:raise AssertionError('unapproved policy expression accepted')
        for op,inputs,expected in [
            ('and',[False,'UNKNOWN'],False),('and',[True,'UNKNOWN'],'UNKNOWN'),
            ('and',[True,True],True),('or',[True,'UNKNOWN'],True),
            ('or',[False,'UNKNOWN'],'UNKNOWN'),('or',[False,False],False)]:
            assert evaluate({op:[{'literal':x} for x in inputs]}, {})==expected
        import json
        for field,bound,maker in [('object',128,lambda n:{str(i):0 for i in range(n)}),
              ('array',256,lambda n:[0]*n),('string',4096,lambda n:'x'*n)]:
            for n in (bound-1,bound,bound+1):
                try:decode(json.dumps(maker(n)))
                except Exception:assert n==bound+1,(field,n)
                else:assert n<=bound,(field,n)
        for depth in (23,24,25):
            try:decode('['*depth+'0'+']'*depth)
            except Exception:assert depth==25
            else:assert depth<=24
        for nodes in (32767,32768,32769):
            value={str(i):[0]*254 for i in range(127)}
            value['last']=[0]*(nodes-(1+128*2+127*254))
            assert 1+128*2+sum(len(a) for a in value.values())==nodes
            try:capture(value)
            except Exception:assert nodes==32769
            else:assert nodes<=32768
        return {'scope':'pure guard qualification; no claim these maxima are reachable together in an admitted world'}
    t.run('M0-M4-pure-policy-JSON-exact-node-depth-guards',pure_guards)

    def unknown_support():
        c=t.new('unknown-support');h1=t.claim(c,name='p1');h2=t.claim(c,name='p2')
        def derive(name,alternatives):
            t.call(c,name,'Derive',{'actor':'alice','rule':'all-true-v1','alternatives':alternatives,
                'body':name,'subject':{'kind':'alleged','scope':'alice','label':name},'value':'TRUE'})
            return t.receipts(c,'alice')[-1]['handle']
        conjunction=derive('and',[[h1,h2]]);alternative=derive('or',[[h1],[h2]])
        basis=t.claim(c,body='challenge basis',name='challenge-basis',value='UNKNOWN')
        t.call(c,'challenge-p1','QualifySupport',{'actor':'alice','target':h1,'basis':basis,'kind':'challenge'})
        assert b'AFFECTED/INDETERMINATE' in encoded(c.holder_view('alice',handle=conjunction))
        assert b'"status":"SUPPORTED"' in encoded(c.holder_view('alice',handle=alternative))
        t.call(c,'withdraw-p2','QualifySupport',{'actor':'alice','target':h2,'basis':basis,'kind':'withdrawal'})
        assert b'"status":"UNSUPPORTED"' in encoded(c.holder_view('alice',handle=conjunction))
        assert b'AFFECTED/INDETERMINATE' in encoded(c.holder_view('alice',handle=alternative))
        assert t.state(c)['information']['stances']==[]
        t.preserved(c)
    t.run('L-AND-OR-unknown-surviving-alternatives',unknown_support)

    def hidden_qualification():
        c=t.new('hidden-qualification');h=t.claim(c)
        t.deliver(c,'alice',h,[('actor','observer')])
        ho=t.receipts(c,'observer')[-1]['handle']
        t.call(c,'observer-conclusion','Derive',{'actor':'observer','rule':'identity-v1',
            'alternatives':[[ho]],'body':'conclusion','subject':{'kind':'alleged','scope':'observer','label':'x'},'value':'TRUE'})
        before=t.items(c,'observer')
        basis=t.claim(c,body='private withdrawal',value='FALSE',name='private-basis')
        t.call(c,'private-withdrawal','QualifySupport',{'actor':'alice','target':h,'basis':basis,'kind':'withdrawal'})
        assert t.items(c,'observer')==before
        assert t.items(c,'observer',cutoff=3)==before
        t.preserved(c)
    t.run('L-holder-eligible-withdrawal-hidden-paired-control',hidden_qualification)

    def causal_and_player_guards():
        c=t.new('causal-guards');h=t.claim(c)
        p={'actor':'alice','rule':'identity-v1','alternatives':[['h999']], 'body':'forward',
            'subject':{'kind':'alleged','scope':'alice','label':'x'},'value':'TRUE'}
        t.refuse(c,'forward-premise','Derive',p)
        p['alternatives']=[[h]];p['parents']=['future']
        t.refuse(c,'extra-parent','Derive',p)
        for entity in ('Q','D2'):
            t.refuse(c,'hidden-'+entity,'AssertClaim',{'actor':'alice','body':'x','subject':{'kind':'actual','entity':entity},
                'value':'TRUE','source_assertion':'x','valid_until':None,'corrects':None})
        for actor in ('player','foreign'):
            t.refuse(c,'author-'+actor,'AssertClaim',{'actor':actor,'body':'x','subject':{'kind':'alleged','scope':actor,'label':'x'},
                'value':'TRUE','source_assertion':'x','valid_until':None,'corrects':None})
        t.deliver(c,'alice',h,[('actor','player')],name='player-acquires')
        hp=t.receipts(c,'player')[-1]['handle']
        p={'actor':'player','rule':'identity-v1','alternatives':[[hp]], 'body':'scratch',
            'subject':{'kind':'alleged','scope':'player','label':'x'},'value':'TRUE'}
        t.refuse(c,'player-derive','Derive',p)
        info=t.state(c)['information'];seen={}
        for r in sorted(info['versions']+info['receipts']+info['transmissions']+info['derivations'],key=lambda r:(r['seq'],r['pos'])):
            for parent in r['parents']:assert parent in seen and seen[parent]<(r['seq'],r['pos'])
            assert r['id'] not in seen;seen[r['id']]=(r['seq'],r['pos'])
        assert t.receipts(c,'player')[-1]['body']=='selected X'
        t.preserved(c)
    t.run('M2-same-unit-causal-order-forward-foreign-player-guards',causal_and_player_guards)

    def destination_and_disclosure():
        c=t.new('I-destination-disclosure-pairs',fixture='I')
        for actor,reason in [('observer','RECEIVER_INTAKE'),('outsider','SENDER_DISCLOSURE')]:
            h=t.claim(c,actor=actor,name='source-'+actor)
            p={'actor':actor,'source':h,'body':'selected X','targets':[{'kind':'container','id':'receiver-inbox'}],
                'source_assertion':'source','disclose_origin':False}
            a=t.refuse(c,'denied-'+actor,'Deliver',p)
            assert reason in str(a),(actor,a)
        assert t.receipts(c,'receiver-inbox',False)==[]
        assert t.state(c)['organization']['cases']==[] and t.state(c)['organization']['tasks']==[]
        t.preserved(c)
    t.run('I-independent-destination-intake-vs-sender-disclosure',destination_and_disclosure)

    def case_acquisition_authority():
        c=t.new('case-acquisition-authority');h=t.claim(c)
        t.call(c,'intake','Refer',{'actor':'alice','source':h,'body':'selected X',
            'targets':[{'kind':'container','id':'receiver-inbox'}],'source_assertion':'x',
            'disclose_origin':False,'organization':'receiver','create_case':True,'dispatcher':'dispatcher'})
        case=t.state(c)['organization']['cases'][0];task=t.state(c)['organization']['tasks'][0]
        age=task['enqueued']
        t.call(c,'reprioritize','RouteTask',{'actor':'dispatcher','task':task['id'],'priority':9,'due':4})
        assert t.state(c)['organization']['tasks'][0]['enqueued']==age
        t.call(c,'assign','AssignTask',{'actor':'dispatcher','task':task['id'],'assignee':'handler'})
        notice=t.receipts(c,'handler',False)[-1]['handle']
        unrelated=t.claim(c,actor='handler',body='unrelated personal assertion',name='unrelated')
        p={'actor':'handler','case':case['id'],'state':'in_review','evidence':unrelated}
        t.refuse(c,'notice-plus-personal-claim','TransitionCase',p)
        t.call(c,'actual-acquisition','AcquireRecord',{'actor':'handler','notice':notice})
        proper=t.receipts(c,'handler')[-1]['handle']
        t.refuse(c,'unrelated-evidence','TransitionCase',p)
        p['evidence']=proper;t.call(c,'proper-review','TransitionCase',p)
        decision={'actor':'handler','case':case['id'],'evidence':unrelated,'policy':'reference-true-v1','reason':'unrelated'}
        t.refuse(c,'unrelated-decision','RecordDecision',decision)
        decision['evidence']=proper;t.call(c,'proper-decision','RecordDecision',decision)
        assert t.state(c)['families']['Env']['ReferenceCounter']['value']==0
        t.preserved(c)
    t.run('H-assignment-notice-personal-claim-no-case-authority',case_acquisition_authority)

    def support_boundaries():
        for kind,bound in [('alternatives',3),('premises',4)]:
            for count in (bound-1,bound,bound+1):
                c=t.new('support-'+kind+'-'+str(count))
                hs=[t.claim(c,name='p'+str(i)) for i in range(count)]
                p={'actor':'alice','rule':'all-true-v1','alternatives':[[h] for h in hs] if kind=='alternatives' else [hs],
                    'body':'conclusion','subject':{'kind':'alleged','scope':'alice','label':'support boundary'},'value':'TRUE'}
                if count>bound:t.refuse(c,'derive','Derive',p)
                else:t.call(c,'derive','Derive',p);t.preserved(c)
        c=t.new('support-depth');h=t.claim(c)
        for depth in range(1,10):
            p={'actor':'alice','rule':'all-true-v1','alternatives':[[h]],'body':'chain',
               'subject':{'kind':'alleged','scope':'alice','label':'depth'},'value':'TRUE'}
            if depth==9:t.refuse(c,'depth9','Derive',p)
            else:
                t.call(c,'depth'+str(depth),'Derive',p);h=t.receipts(c,'alice')[-1]['handle']
                assert t.state(c)['information']['derivations'][-1]['depth']==depth
                if depth in (7,8):
                    view=c.holder_view('alice',handle=h)
                    assert b'"status":"SUPPORTED"' in encoded(view) and b'"complete":true' in encoded(view)
        t.preserved(c)
    t.run('M2-M4-actual-support-alternative-premise-depth-boundaries',support_boundaries)

    def local_handle_aliases():
        c=t.new('local-handle-aliases');ha=t.claim(c,body='secret A')
        hb=t.claim(c,actor='outsider',body='secret B',name='other-claim')
        assert ha==hb=='h1'
        a=c.holder_view('alice',handle=hb);b=c.holder_view('outsider',handle=ha)
        assert a['receipts'][0]['body']=='secret A' and b['receipts'][0]['body']=='secret B'
        t.deliver(c,'alice',hb,[('actor','handler')],body='secret A')
        assert t.receipts(c,'handler')[-1]['body']=='secret A'
        assert b'secret B' not in encoded(t.items(c,'handler'))
        t.preserved(c)
    t.run('M2-actor-local-canonical-equal-unjoined-handles',local_handle_aliases)

    def explicit_determinism():
        import os,json,subprocess,sys
        from pathlib import Path
        from verify_independent import SOURCE,save
        results=[]
        for seed,order in [('17','forward'),('731','reverse')]:
            folder=t.out/('seed-'+seed);folder.mkdir()
            cmd=[sys.executable,'-B',str(Path(__file__).with_name('determinism_worker.py')),str(folder/'world.db'),order]
            child=subprocess.run(cmd,cwd=SOURCE,env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',PYTHONHASHSEED=seed),
                                 capture_output=True,text=True,timeout=120)
            save(folder/'command.json',{'command':cmd,'hash_seed':seed,'construction_order':order,
                'exit':child.returncode,'stderr':child.stderr})
            assert child.returncode==0,child.stderr
            value=json.loads(child.stdout);save(folder/'semantic-output.json',value);results.append(value)
        assert results[0]==results[1]
        return {'seeds':[17,731],'same_input_dict_orders':['forward','reverse'],'same_native_head_state_views':True}
    t.run('M1-M4-explicit-hash-seed-dict-order-determinism',explicit_determinism)
