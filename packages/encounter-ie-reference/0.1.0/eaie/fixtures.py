"""Finite synthetic root content. Authority facts do not imply receipts."""
from .data import authored,authority,require,copy,scan,charge
ACTORS=['alice','observer','dispatcher','handler','outsider','player']
CONTAINERS={'alice-file':'tiny','receiver-inbox':'receiver','other-inbox':'other','archive':'tiny'}
FUNCTIONS=['open','route','assign','analyze','decide','close','effect','access']
OBSERVATION={'actor':'observer','body':'The fixture mechanism D is blocked.','subject':{'kind':'actual','entity':'D'},'value':'TRUE','source_assertion':'direct fixture observation','valid_until':None,'corrects':None}
LOSS_OBSERVATION={'actor':'observer','body':'One fixture token is missing; the culprit is unknown.','subject':{'kind':'actual','entity':'incident-1'},'value':'TRUE','source_assertion':'direct fixture discrepancy','valid_until':None,'corrects':None}
def initial(fixture,cfg):
    require(fixture in ['reference','tiny','compartment']+list('ABCDEFGHIJKL'),'FIXTURE')
    s=authored();s['profile']=copy(cfg);s['lineage'].update(world=authority()['world'],lineage=authority()['lineage'],admission_seq=0)
    for a in scan(ACTORS,'fixture_entity_visit'):s['identity']['entities'][a]={'kind':'actor','live':True,'origin':'EA-IE-root'}
    for c in scan(CONTAINERS,'fixture_entity_visit'):s['identity']['entities'][c]={'kind':'container','live':True,'origin':'EA-IE-root'}
    for o in scan(['tiny','receiver','other','spare'],'fixture_entity_visit'):s['identity']['entities'][o]={'kind':'organization','live':True,'origin':'EA-IE-root'}
    s['identity']['entities']['incident-1']={'kind':'event','live':True,'origin':'EA-IE-root'}
    s['reference_truth']={'incident':'incident-1','kind':'synthetic-token-loss','culprit':'P','innocent':'alice','tokens_before':2,'tokens_after':1}
    # Fixture-issued eligible native subjects, separate from content acquisition.
    s['information']={'actors':ACTORS[:],'containers':copy(CONTAINERS),'items':[],'versions':[],
      'receipts':[],'transmissions':[],'derivations':[],'qualifications':[],'stances':[],
      'access':[{'holder':a,'container':c,'allow':True,'seq':0} for a,c in
        [('alice','alice-file'),('alice','archive'),('dispatcher','receiver-inbox'),('handler','receiver-inbox'),('outsider','other-inbox')]]}
    grants=[{'actor':a,'organization':o,'function':f} for a,o,fs in
      [('alice','tiny',FUNCTIONS),('alice','receiver',['open']),('alice','other',['open']),
       ('dispatcher','receiver',['open','route','assign','access']),
       ('handler','receiver',['analyze','decide','close','effect']),('outsider','other',FUNCTIONS)] for f in fs]
    if fixture in ['tiny','J']:
        grants.extend({'actor':'alice','organization':'receiver','function':f} for f in FUNCTIONS if f!='open')
        s['information']['access'].append({'holder':'alice','container':'receiver-inbox','allow':True,'seq':0})
    s['organization']={'organizations':{o:{'container':c,'intake':['alice','observer','dispatcher','handler','outsider'],'disclosers':['alice','observer','dispatcher','handler','outsider']} for o,c in [('tiny','alice-file'),('receiver','receiver-inbox'),('other','other-inbox'),('spare','archive')]},
      'grants':grants,'cases':[],'tasks':[],'decisions':[]}
    if fixture=='I':
        s['organization']['organizations']['receiver']['intake'].remove('observer')
        s['organization']['organizations']['receiver']['disclosers'].remove('outsider')
    s['reference_effects']=[];s['families']['Env']['ReferenceCounter']={'value':0}
    charge(len(grants)+len(s['information']['access'])+len(s['organization']['organizations']),'fixture_authority_record')
    from .information import validate_state
    validate_state(s)
    return s
def eligible_subjects(actor):
    # All named fixture participants know D/P and themselves; D2/Q remain hidden
    # until a separately authored acquisition feature is explicitly added.
    return ['D','P','alice','observer','incident-1',actor]
