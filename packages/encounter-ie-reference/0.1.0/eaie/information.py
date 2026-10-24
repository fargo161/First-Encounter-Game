"""Pure L1 participant. A receipt is the sole acquired basis; no truth writer."""
from .data import copy,digest,fields,require,integer,charge,sort_full,scan
from .identity import subject
from .fixtures import eligible_subjects,OBSERVATION,LOSS_OBSERVATION
from .expressions import evaluate,RULES
KINDS=['AssertClaim','Observe','Deliver','Refer','AcquireRecord','SetRecordAccess',
       'Derive','QualifySupport','DeclareStance']

class Context:
    def __init__(self,s,r):
        self.s=s;self.r=r;self.seq=s['lineage']['admission_seq']+1;self.pos=0;self.targets=0;self.updates=0
        self.prefix=digest({'domain':'EA-IE-native-operation/1','key':r['key']})
    def ident(self,kind):self.pos+=1;charge(1,'causal_position');return self.prefix+':'+kind+':'+str(self.pos)
    def actor(self,a):
        charge(len(self.s['information']['actors'])+1,'actor_identity_visit')
        require(a in self.s['information']['actors'] and self.s['identity']['entities'].get(a,{}).get('kind')=='actor' and self.s['identity']['entities'][a]['live'],'ACTOR')
    def receipt(self,a,handle,content=True):
        self.actor(a)
        matches=[x for x in self.s['information']['receipts'] if x['holder_kind']=='actor' and x['holder']==a and x['handle']==handle]
        charge(len(self.s['information']['receipts']),'receipt_visit');require(len(matches)==1,'INELIGIBLE_RECEIPT')
        x=matches[0];require(not content or x['kind']=='content','CONTENT_RECEIPT_REQUIRED');return x
    def access(self,a,c):
        matches=[x for x in self.s['information']['access'] if x['holder']==a and x['container']==c]
        charge(len(self.s['information']['access']),'access_visit');return bool(matches and matches[-1]['allow'])
    def grant(self,a,o,f):
        self.actor(a);gs=self.s['organization']['grants'];charge(len(gs),'grant_visit')
        require({'actor':a,'organization':o,'function':f} in gs,'FUNCTION_GRANT')
    def parent(self,ident):
        records=self.s['information']['versions']+self.s['information']['receipts']+self.s['information']['transmissions']+self.s['information']['derivations']
        found=[v for v in records if v['id']==ident];charge(len(records),'causal_parent_visit')
        require(len(found)==1 and (found[0]['seq'],found[0]['pos'])<(self.seq,self.pos),'CAUSAL_PARENT_ORDER')
    def append(self,collection,record):
        for p in record.get('parents',[]):
            charge(1,'causal_edge_visit');self.parent(p)
        self.s['information'][collection].append(record);return record
    def acquire(self,kind,holder,version,body,value,record=None,source=None,known=None,assertion='',parents=None,notice=False):
        require(kind in ['actor','container'],'HOLDER_KIND')
        if kind=='actor':self.actor(holder)
        else:require(holder in self.s['information']['containers'],'CONTAINER')
        self.targets+=1;require(self.targets<=self.s['profile']['limits']['targets'],'TARGET_CAPACITY')
        rid=self.ident('receipt');own=[x for x in self.s['information']['receipts'] if x['holder_kind']==kind and x['holder']==holder]
        charge(len(self.s['information']['receipts']),'holder_handle_visit')
        return self.append('receipts',{'id':rid,'holder_kind':kind,'holder':holder,'version':version,
          'body':body,'value':value,'kind':'notice' if notice else 'content','record':copy(record),
          'source_receipt':source,'known_origin':known,'source_assertion':assertion,
          'seq':self.seq,'pos':self.pos,'handle':'h'+str(len(own)+1),'parents':list(parents or [])})
    def notice(self,actor,receipt):
        return self.acquire('actor',actor,None,'','UNKNOWN',{'container':receipt['holder'],'receipt':receipt['id']},
          receipt['id'],None,'assignment existence',[receipt['id']],True)

def fragment(body):require(type(body) is str and 0<len(body.encode('utf-8'))<=512,'FRAGMENT_BOUND')
def version(ctx,p,actor,parents=(),root=None,origin=None):
    ctx.actor(actor);fragment(p['body']);subject(ctx.s,actor,p['subject'])
    if p['subject']['kind']=='actual':require(p['subject']['entity'] in eligible_subjects(actor),'INELIGIBLE_REFERENT')
    require(p['value'] in ['TRUE','FALSE','UNKNOWN'],'CLAIM_VALUE')
    require(type(p['source_assertion']) is str,'SOURCE_ASSERTION')
    require(p['valid_until'] is None or integer(p['valid_until'],0,1000000),'VALIDITY')
    ident=ctx.ident('version')
    v={'id':ident,'root':root or ident,'body':p['body'],'subject':copy(p['subject']),'value':p['value'],
       'source_assertion':p['source_assertion'],'valid_until':p['valid_until'],'corrects':p['corrects'],
       'creator':actor,'origin':origin or ident,'seq':ctx.seq,'pos':ctx.pos,'parents':list(parents)}
    if root is None:ctx.s['information']['items'].append(ident)
    return ctx.append('versions',v)

def reduce(ctx):
    s=ctx.s;r=ctx.r;k=r['kind'];p=r['params'];info=s['information']
    if k in ['AssertClaim','Observe']:
        fields(p,['actor','body','subject','value','source_assertion','valid_until','corrects']);a=p['actor']
        require(a!='player','PLAYER_AUTHORING_EXCLUDED')
        if k=='Observe':
            require(p in [OBSERVATION,LOSS_OBSERVATION],'OBSERVATION_RECIPE')
            if p==OBSERVATION:require(s['families']['Env']['D']['blocked'],'OBSERVATION_CONTEXT_CHANGED')
        parent=[];root=None;params=copy(p)
        if p['corrects'] is not None:
            old=ctx.receipt(a,p['corrects']);parent=[old['version']];root=next(v['root'] for v in scan(info['versions'],'information_record_visit') if v['id']==old['version']);params['corrects']=old['version']
        v=version(ctx,params,a,parent,root)
        ctx.acquire('actor',a,v['id'],v['body'],v['value'],known=v['origin'],assertion=v['source_assertion'],parents=[v['id']])
    elif k in ['Deliver','Refer']:
        extra=['organization','create_case','dispatcher'] if k=='Refer' else []
        fields(p,['actor','source','body','targets','source_assertion','disclose_origin']+extra)
        a=p['actor'];src=ctx.receipt(a,p['source']);fragment(p['body']);require(p['body'] in src['body'],'UNACQUIRED_FRAGMENT')
        require(type(p['disclose_origin']) is bool and type(p['source_assertion']) is str,'DISCLOSURE_FIELDS')
        targets=p['targets'];require(type(targets) is list and 1<=len(targets)<=s['profile']['limits']['targets'],'TARGET_CAPACITY')
        seen=set();received=[]
        for target in sort_full(targets,lambda x:(x['kind'],x['id'])):
            fields(target,['kind','id']);token=(target['kind'],target['id']);require(token not in seen,'DUPLICATE_TARGET');seen.add(token)
            if target['kind']=='container':
                c=target['id'];require(c in info['containers'],'CONTAINER');o=info['containers'][c];org=s['organization']['organizations'][o]
                require(a in org['disclosers'],'SENDER_DISCLOSURE');require(a in org['intake'],'RECEIVER_INTAKE')
            rec=ctx.acquire(target['kind'],target['id'],src['version'],p['body'],src['value'],
              {'container':target['id'],'receipt':None} if target['kind']=='container' else None,
              src['id'],src['known_origin'] if p['disclose_origin'] else None,p['source_assertion'],[src['id']])
            received.append(rec)
        tid=ctx.ident('transmission');ctx.append('transmissions',{'id':tid,'actor':a,'source':src['id'],
          'receipts':[x['id'] for x in received],'seq':ctx.seq,'pos':ctx.pos,'parents':[src['id']]+[x['id'] for x in received]})
        if k=='Refer':
            require(type(p['create_case']) is bool and p['organization'] in s['organization']['organizations'],'REFER_SCOPE')
            if p['create_case']:
                from .organization import open_case
                matches=[x for x in received if x['holder_kind']=='container' and info['containers'][x['holder']]==p['organization']]
                require(len(matches)==1,'RECEIVER_SLICE_REQUIRED');ctx.grant(a,p['organization'],'open')
                open_case(ctx,a,p['organization'],matches[0],p['dispatcher'])
            else:require(p['dispatcher'] is None,'DELIVERY_ONLY_NOTICE_NOT_SELECTED')
    elif k=='AcquireRecord':
        fields(p,['actor','notice']);a=p['actor'];n=ctx.receipt(a,p['notice'],False)
        require(n['kind']=='notice' and n['record'] is not None,'KNOWN_EXISTENCE_REQUIRED')
        require(ctx.access(a,n['record']['container']),'RECORD_ACCESS')
        matches=[x for x in scan(info['receipts'],'information_record_visit') if x['id']==n['record']['receipt'] and x['holder_kind']=='container' and x['holder']==n['record']['container']]
        require(len(matches)==1,'RECORD_SLICE');src=matches[0]
        ctx.acquire('actor',a,src['version'],src['body'],src['value'],copy(n['record']),src['id'],src['known_origin'],src['source_assertion'],[src['id'],n['id']])
    elif k=='SetRecordAccess':
        fields(p,['actor','holder','container','allow']);ctx.actor(p['holder']);require(p['container'] in info['containers'] and type(p['allow']) is bool,'ACCESS_FIELDS')
        ctx.grant(p['actor'],info['containers'][p['container']],'access')
        info['access'].append({'holder':p['holder'],'container':p['container'],'allow':p['allow'],'seq':ctx.seq})
    elif k=='Derive':
        fields(p,['actor','rule','alternatives','body','subject','value']);a=p['actor'];ctx.actor(a)
        require(a!='player','PLAYER_AUTHORING_EXCLUDED')
        require(p['rule'] in ['identity-v1','all-true-v1'],'DERIVATION_RULE');alts=p['alternatives']
        require(type(alts) is list and 1<=len(alts)<=3,'SUPPORT_ALTERNATIVES');premises=[];handles=[];depth=1
        for alt in scan(alts,'derivation_alternative_visit'):
            require(type(alt) is list and 1<=len(alt)<=4 and len(set(alt))==len(alt),'SUPPORT_PREMISES');refs=[]
            for handle in scan(alt,'derivation_premise_edge_visit'):
                rr=ctx.receipt(a,handle);require(rr['seq']<ctx.seq,'EARLIER_PREMISE_REQUIRED');refs.append(rr['id']);premises.append(rr)
                dr=next((d for d in scan(info['derivations'],'information_record_visit') if d['version']==rr['version']),None)
                if dr:depth=max(depth,dr['depth']+1)
            handles.append(refs)
        require(depth<=8,'DERIVATION_DEPTH')
        outcomes=[]
        for alt in scan(handles,'derivation_rule_alternative_visit'):
            selected=[x for x in scan(premises,'derivation_premise_scan') if x['id'] in alt]
            values=[evaluate(RULES[p['rule']],{'value':x['value'],'body':x['body']}) for x in selected]
            if p['rule']=='identity-v1':
                require(len(alt)==1,'IDENTITY_RULE_ARITY');outcomes.append(values[0])
            else:outcomes.append('FALSE' if False in values else 'UNKNOWN' if 'UNKNOWN' in values else 'TRUE')
        # Each retained alternative must actually justify this conclusion under
        # the chosen rule. Later eligible-support OR-of-AND is a separate view.
        charge(len(outcomes),'derivation_conclusion_term');require(all(p['value']==x for x in outcomes),'DERIVATION_CONCLUSION')
        pp={k:p[k] for k in ['body','subject','value']};pp.update(source_assertion=p['rule'],valid_until=None,corrects=None)
        v=version(ctx,pp,a,[x['id'] for x in premises]);did=ctx.ident('derivation')
        ctx.append('derivations',{'id':did,'actor':a,'version':v['id'],'rule':p['rule'],'alternatives':handles,'depth':depth,'seq':ctx.seq,'pos':ctx.pos,'parents':[v['id']]+[x['id'] for x in premises]})
        ctx.acquire('actor',a,v['id'],v['body'],v['value'],known=v['origin'],assertion=p['rule'],parents=[did])
    elif k=='QualifySupport':
        fields(p,['actor','target','basis','kind']);a=p['actor'];target=ctx.receipt(a,p['target']);basis=ctx.receipt(a,p['basis'])
        require(p['kind'] in ['withdrawal','correction','challenge','expiry'],'QUALIFICATION_KIND')
        if p['kind']=='expiry':
            v=next(x for x in scan(info['versions'],'information_record_visit') if x['id']==target['version']);require(v['valid_until'] is not None and v['valid_until']<=s['clock']['now'],'EXPIRY_BASIS')
        info['qualifications'].append({'actor':a,'target':target['version'],'basis':basis['id'],'kind':p['kind'],'seq':ctx.seq})
    elif k=='DeclareStance':
        fields(p,['actor','source','stance']);require(p['actor']!='player','PLAYER_STANCE_EXCLUDED');src=ctx.receipt(p['actor'],p['source']);require(p['stance'] in ['accept','reject','uncertain'],'STANCE')
        info['stances'].append({'actor':p['actor'],'source':src['id'],'stance':p['stance'],'seq':ctx.seq})
    else:raise ValueError('UNSUPPORTED_INFORMATION_OPERATION')

def validate_state(s):
    i=s['information'];L=s['profile']['limits']
    require(sum(1 for e in scan(s['identity']['entities'].values(),'information_record_visit') if e['kind']=='actor')<=L['actors'],'CAPACITY_actors')
    for key,limit in [('items','roots'),('versions','versions'),('receipts','receipts'),('transmissions','transmissions'),('derivations','derivations')]:require(len(i[key])<=L[limit],'CAPACITY_'+limit)
    require(len(s['organization']['organizations'])<=L['organizations'],'CAPACITY_organizations')
    require(sum(sum(len(a) for a in d['alternatives']) for d in scan(i['derivations'],'information_record_visit'))<=L['premise_edges'],'CAPACITY_premise_edges')
    for key in ['cases','tasks']:require(len(s['organization'][key])<=L[key],'CAPACITY_'+key)
