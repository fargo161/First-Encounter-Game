"""Explicit hash-seed and dict-construction trial, only disposable worlds."""
import json
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from eaie import Core
from verify_independent import plain
path=Path(sys.argv[1]);reverse=sys.argv[2]=='reverse';c=Core.create(path)
def order(d):return dict(reversed(list(d.items()))) if reverse else d
for i,actor in enumerate(('alice','observer')):
    p=order({'actor':actor,'body':'same selected fragment','subject':order({'kind':'alleged','scope':actor,'label':'same named allegation'}),
         'value':'TRUE','source_assertion':'source','valid_until':None,'corrects':None})
    r=c.prepare('claim-'+str(i),'AssertClaim',p);a=c.admit(r);assert a['status']=='O1'
    assert c.admit(r)=={'status':'O3','receipt':a['receipt']}
p=order({'actor':'alice','source':'h1','body':'selected','targets':[{'kind':'actor','id':'handler'},{'kind':'actor','id':'dispatcher'}],
         'source_assertion':'source','disclose_origin':False})
assert c.admit(c.prepare('deliver','Deliver',p))['status']=='O1'
c=Core(path);s=c.snapshot()
print(json.dumps({'head':s.head,'ordinal':s.ordinal,'state':plain(s.state),
  'views':[c.holder_view(a,cutoff=k) for a in ('alice','observer','handler','dispatcher','outsider') for k in (0,1,3)]}))
