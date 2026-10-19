"""Builder-owned separate oracle, imports no product implementation.

Independent reviewers must supply their own additional cases/reference logic.
"""
import json,hashlib
def text(v):return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=True,allow_nan=False)
def sha(v):return hashlib.sha256(text(v).encode()).hexdigest()
def trace(qs):
    b=0;out=[]
    for q in qs:
        b=min(20, (b*3)//2+q);out.append(b)
    return out
def reachable(g,rs):
    found=set(rs)
    while True:
        n=found|{v for k in found for v in g[k]}
        if n==found:break
        found=n
    return sorted(found),sum(len(g[k]) for k in found)
def work(root,rows,cps=()):
    B=len(text(root).encode())+sum(len(text(x).encode()) for x in rows)
    C=sum(len(text(x).encode()) for x in cps)
    n=len(rows);bindings=sum(len(x['state']['identity']['bindings']) for x in rows)
    edges=sum(sum(map(len,x['state']['protection']['graph'].values())) for x in rows)
    return n*10400+bindings+edges+3*n+(100*(B+C)+1023)//1024
