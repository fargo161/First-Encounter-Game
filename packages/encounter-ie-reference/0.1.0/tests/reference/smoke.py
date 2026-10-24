"""Builder H smoke only. Execute from disposable source with external output."""
import sys,json
from pathlib import Path
from eaie import Core
from eaie.data import copy
def run(out):
    out=Path(out);out.mkdir(parents=True,exist_ok=False);c=Core.create(out/'world.db');requests=[]
    def do(kind,p):
        r=c.prepare('op'+str(len(requests)+1),kind,p);answer=c.admit(r)
        assert answer['status'] in ['O1','O2'],(kind,answer)
        requests.append(r);return answer
    def state():return copy(c.snapshot().state)
    def last(a,kind='content'):return [x for x in state()['information']['receipts'] if x['holder']==a and x['kind']==kind][-1]['handle']
    def claim(body):return {'actor':'alice','body':body,'subject':{'kind':'actual','entity':'alice'},'value':'TRUE','source_assertion':'unverified teller','valid_until':None,'corrects':None}
    do('AssertClaim',claim('Alice took the fixture token.'))
    do('Refer',{'actor':'alice','source':last('alice'),'body':'Alice took the fixture token.','targets':[{'kind':'container','id':'receiver-inbox'}],'source_assertion':'unverified teller','disclose_origin':False,'organization':'receiver','create_case':True,'dispatcher':'dispatcher'})
    case=state()['organization']['cases'][0]['id'];task=state()['organization']['tasks'][0]['id']
    do('AssignTask',{'actor':'dispatcher','task':task,'assignee':'handler'})
    do('AcquireRecord',{'actor':'handler','notice':last('handler','notice')});old=last('handler')
    do('TransitionCase',{'actor':'handler','case':case,'state':'in_review','evidence':old})
    do('RecordDecision',{'actor':'handler','case':case,'evidence':old,'policy':'reference-true-v1','reason':'fixture received TRUE allegation'})
    do('ApplyReferenceEffect',{'actor':'handler','decision':state()['organization']['decisions'][0]['id']})
    do('TransitionCase',{'actor':'handler','case':case,'state':'closed','evidence':old})
    do('AssertClaim',claim('A later teller alleges Alice took the token.'))
    do('Deliver',{'actor':'alice','source':last('alice'),'body':'A later teller alleges Alice took the token.','targets':[{'kind':'actor','id':'handler'}],'source_assertion':'later teller','disclose_origin':False});fresh=last('handler')
    do('TransitionCase',{'actor':'handler','case':case,'state':'queued','evidence':fresh})
    task=state()['organization']['tasks'][-1]['id'];do('AssignTask',{'actor':'dispatcher','task':task,'assignee':'handler'})
    do('AcquireRecord',{'actor':'handler','notice':last('handler','notice')})
    do('TransitionCase',{'actor':'handler','case':case,'state':'in_review','evidence':fresh})
    do('RecordDecision',{'actor':'handler','case':case,'evidence':fresh,'policy':'reference-true-v1','reason':'explicit reassessment'})
    do('AdvanceTime',{'to':1})
    c=Core(c.path);a=c.snapshot();assert a.ordinal==16;assert c.admit(requests[0])['status']=='O3';assert c.holder_view('handler')['status']=='ok'
    assert a.state['families']['Env']['ReferenceCounter']['value']==1
    assert a.state['reference_truth']['culprit']=='P'
    assert len(a.state['organization']['tasks'])==2 and a.state['organization']['tasks'][0]['state']=='closed'
    (out/'builder-smoke.json').write_text(json.dumps({'owner':'Builder H','not_independent':True,'ordinal':a.ordinal,'head':a.head,'census':copy(a.census)},indent=2))
    print('BUILDER16 PASS',a.head,dict(a.census))
if __name__=='__main__':run(sys.argv[1])
