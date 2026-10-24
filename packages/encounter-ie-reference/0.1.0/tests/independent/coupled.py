"""Coupled encoded intent/state/query bounds and indispensable work visits."""
from verify_independent import encoded,plain,save


def register(t):
    def query_viability():
        from eaie.profile import DEFAULT_LIMITS
        c=t.new('lower-query-bytes',limits=dict(DEFAULT_LIMITS,query_bytes=8192))
        for query in ('boundary','census'):
            assert len(encoded(c.inspect(query=query)))<=8192
        params={'actor':'alice','body':'x'*512,'subject':{'kind':'alleged','scope':'alice','label':'y'*4000},
                'value':'TRUE','source_assertion':'attributed','valid_until':None,'corrects':None}
        assert len(encoded({'kind':'AssertClaim','params':params,'target':None,'reference':None}))<8192
        t.call(c,'large-subject','AssertClaim',params)
        assert c.holder_view('alice')['status']=='ok'
        h=t.receipts(c,'alice')[-1]['handle']
        delivery={'actor':'alice','source':h,'body':'x'*512,'targets':[{'kind':'actor','id':'handler'}],
                  'source_assertion':'z'*4000,'disclose_origin':False}
        assert len(encoded({'kind':'Deliver','params':delivery,'target':None,'reference':None}))<8192
        before=t.state(c);r=c.prepare('cannot-query','Deliver',delivery);a=c.admit(r)
        assert a['status']=='O4',('acknowledged future unreadable promised holder page',a,c.holder_view('alice'))
        assert t.state(c)==before
    t.run('M4-promised-query-byte-feasibility-before-acknowledgement',query_viability)

    def unicode_pages():
        c=t.new('unicode-full-witness')
        # Independently fill each closed intent near8KiB while retaining the
        # fragment512 UTF8 cap. Subject and later source assertion are distinct.
        body='\U0001f642'*128
        params={'actor':'alice','body':body,'subject':{'kind':'alleged','scope':'alice','label':''},
                'value':'TRUE','source_assertion':'source','valid_until':None,'corrects':None}
        while True:
            trial=plain(params);trial['subject']['label']+='\u00e9'
            if len(encoded({'kind':'AssertClaim','params':trial,'target':None,'reference':None}))>8192:break
            params=trial
        assert len(params['body'].encode('utf8'))==512
        t.call(c,'large-subject','AssertClaim',params);h=t.receipts(c,'alice')[-1]['handle']
        delivery={'actor':'alice','source':h,'body':body,'targets':[{'kind':'actor','id':'handler'}],
                  'source_assertion':'','disclose_origin':False}
        while True:
            trial=plain(delivery);trial['source_assertion']+='\u00e9'
            if len(encoded({'kind':'Deliver','params':trial,'target':None,'reference':None}))>8192:break
            delivery=trial
        points=[]
        for i in range(4):
            request=c.prepare('large-delivery-'+str(i),'Deliver',delivery)
            assert len(encoded(request))<=163840
            before=t.state(c);a=c.admit(request)
            if a['status']=='O4':
                assert t.state(c)==before
                points.append({'attempt':i+2,'conjunctive_refusal':a})
                break
            assert a['status']=='O1',a
            current=c.holder_view('handler',limit=4)
            assert current['status']=='ok' and len(current['receipts'])==i+1
            assert len(encoded(current))<=65536
            handle=t.receipts(c,'handler')[-1]['handle']
            for cutoff in (i+2,c.snapshot().ordinal):
                view=c.holder_view('handler',cutoff=cutoff,handle=handle)
                assert view['status']=='ok' and len(encoded(view))<=65536
            points.append({'admission':c.snapshot().ordinal,'request_bytes':len(encoded(request)),
                           'state_bytes':len(encoded(c.snapshot().state)),'reply_bytes':len(encoded(current))})
        t.preserved(c);save(c.path.parent/'coupled-byte-observations.json',points)
        four=t.new('explicit-four-entry-page')
        for i in range(4):t.claim(four,body='four-page-'+str(i),name='four-'+str(i))
        page=four.holder_view('alice',limit=4)
        assert page['status']=='ok' and len(page['receipts'])==4 and len(encoded(page))<=65536
        for entry in page['receipts']:
            assert four.holder_view('alice',cutoff=4,handle=entry['handle'])['status']=='ok'
        t.preserved(four)
        return points
    t.run('M4-coupled-Unicode-intent-witness-four-entry-query-envelope',unicode_pages)

    def closure_visit_cost():
        from eaie.data import metered,closure,GRAPH,ESSENTIAL
        seen=set();pending=list(ESSENTIAL);edges=0
        while pending:
            n=pending.pop()
            if n in seen:continue
            seen.add(n);edges+=len(GRAPH[n]);pending.extend(GRAPH[n])
        with metered(20000000) as work:out=closure(GRAPH,ESSENTIAL)
        assert out['protected']==sorted(seen) and out['edges_visited']==edges
        assert work.total>=len(seen)+edges,('unaccounted actual graph visits',work.report(),len(seen),edges)
        return {'observed_nodes':len(seen),'observed_edges':edges,'work':work.report()}
    t.run('M4-independent-protection-graph-record-visit-charge',closure_visit_cost)

    def reserve_before_serialize():
        from eaie import data
        seen=[];original=data.json.dumps
        def spy(value,*args,**kwargs):
            if isinstance(value,dict):seen.append(value)
            return original(value,*args,**kwargs)
        data.json.dumps=spy
        try:
            try:
                with data.metered(4236):data.canonical({'large':'x'*4096})
            except data.Rejected:pass
            else:raise AssertionError('too small serialization budget accepted')
            assert not seen,'whole-object serialization ran before its work reservation'
            try:
                with data.metered(4236):
                    with data.metered(20000000):data.canonical({'large':'x'*4096})
            except data.Rejected:pass
            else:raise AssertionError('ample child bypassed tight parent serialization budget')
            assert not seen,'child whole-object dump ran before ancestor work reservation'
            with data.metered(20000000):value=data.canonical({'large':'x'*4096})
            assert len(seen)==1 and value==encoded({'large':'x'*4096}).decode()
        finally:data.json.dumps=original
    t.run('M4-work-reserved-before-whole-serialization-stage',reserve_before_serialize)
