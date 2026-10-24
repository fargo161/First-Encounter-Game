"""Finite callback-free three-valued predicate evaluator."""
from .data import require,fields,charge
UNKNOWN='UNKNOWN'
RULES={'identity-v1':{'field':'value'},'all-true-v1':{'eq':[{'field':'value'},{'literal':'TRUE'}]},
       'reference-true-v1':{'eq':[{'field':'value'},{'literal':'TRUE'}]}}
def evaluate(expr,inputs):
    count=[0]
    def run(e,depth):
        count[0]+=1;charge(1,'predicate_term');require(count[0]<=32 and depth<=8,'PREDICATE_BOUND')
        require(type(e) is dict and len(e)==1,'PREDICATE_NODE');op,arg=next(iter(e.items()))
        if op=='literal':require(type(arg) in (str,int,bool) or arg is None,'PREDICATE_LITERAL');return arg
        if op=='field':require(arg in ['value','body'],'PREDICATE_FIELD');return inputs.get(arg,UNKNOWN)
        if op=='not':
            x=run(arg,depth+1);require(x in [True,False,UNKNOWN],'PREDICATE_TYPE');return UNKNOWN if x==UNKNOWN else not x
        require(op in ['eq','lt','le','and','or'] and type(arg) is list,'PREDICATE_OPERATOR')
        require((2 if op in ['eq','lt','le'] else 1)<=len(arg)<=4,'PREDICATE_ARITY')
        vs=[run(v,depth+1) for v in arg]
        if op in ['and','or']:
            require(all(x in [True,False,UNKNOWN] for x in vs),'PREDICATE_TYPE')
            if op=='and':return False if False in vs else UNKNOWN if UNKNOWN in vs else True
            return True if True in vs else UNKNOWN if UNKNOWN in vs else False
        a,b=vs
        if UNKNOWN in vs:return UNKNOWN
        require(type(a) is type(b) and type(a) in [str,int,bool],'PREDICATE_TYPE')
        return a==b if op=='eq' else a<b if op=='lt' else a<=b
    return run(expr,0)
