"""Sole semantic installer; complete immutable mode-A evidence in one SQLite DB.

Controlled hooks are test seams, never serialized actions or installed modules.
No arbitrary hostile Python/plugin sandbox is claimed.
"""
import ctypes
import hashlib
import json
import os
import shutil
import sqlite3
import inspect as pyinspect
from pathlib import Path
from dataclasses import dataclass
from .data import (VERSION,HASHES,Rejected,Unavailable,canonical,copy,digest,freeze,
                   require,fields,integer,authored,authority,closure,plain)
from .policies import OWNERS,POLICIES,calculate,resolve,reference,effective

DEFAULT_LIMITS={'operations':64,'checkpoints':8,'cold_work':20000000,
 'admission_work':40000000,'checkpoint_work':40000000,'query_work':20000000,'retry_work':20000000,
 'logical_bytes':8388608,'memory_bytes':268435456,'workspace_bytes':1073741824,
 'due_jobs':8,'query_bytes':2097152}
ACTIVE={}
TABLES={'root','history','meta','checkpoints'}

def profile(limits=None):
    p=copy(DEFAULT_LIMITS if limits is None else limits)
    require(set(p)==set(DEFAULT_LIMITS) and all(integer(v,0,DEFAULT_LIMITS[k]) for k,v in p.items()),'PROFILE_LIMITS')
    return {'id':'EA-C1-profile/2/'+digest(p),'accounting':'full-prefix/2','limits':p}

def source_identity():
    p=Path(__file__).resolve().parent
    return digest({f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(p.glob('*.py'))})

def root_payload(cfg):
    return {'version':VERSION,'contracts':'R1+R1a-owner-Q1-Q5','source':source_identity(),
            'backend':{'sqlite':sqlite3.sqlite_version,'vfs':'win32','journal':'DELETE','synchronous':'EXTRA','encoding':'UTF-8'},
            'fixtures':HASHES,'authority':authority(),'profile':cfg,'initial':dict(authored(),profile=cfg)}

def key(r): return canonical(r['key'])

def witness(state,head):
    return {'head':head,'query':'complete-family+absence/set/1',
      'families':copy(state['families']),'identity':copy(state['identity']),
      'clock':copy(state['clock']),'profile':copy(state['profile']),
      'protection':copy(state['protection']),'binding_plan':copy(state['binding_plan'])}

def census(root,rows,checkpoints=()):
    """Conservative algorithm units, not CPU cycles. Every byte pass is charged.

    100 whole-prefix byte passes and 4000+800*due policy/validation steps per
    entry dominate the bounded algorithms (5 entities, <=64 bindings, <=8 jobs).
    64x encoded bytes + 64MiB reserves simultaneous decoded/staged/replay objects
    plus the bounded 512KiB SQLite page cache. Physical reservation separately
    includes database, rollback and staging overhead. Measurements remain vital.
    """
    B=len(canonical(root).encode())+sum(len(canonical(x).encode()) for x in rows)
    C=sum(len(canonical(x).encode()) for x in checkpoints)
    n=len(rows); visits=sum(len(x['state']['identity']['bindings']) for x in rows)
    edges=sum(sum(len(v) for v in x['state']['protection']['graph'].values()) for x in rows)
    W=n*(4000+800*8)+visits+edges+3*n+(100*(B+C)+1023)//1024
    return {'prefix_entries':n,'encoded_prefix_bytes':B,'checkpoint_bytes':C,
      'record_visits':n,'binding_checks':visits,'edge_visits':edges,
      'receipt_comparisons':n,'index_coverage_visits':n,
      'validator_steps_bound':n*(4000+800*8),
      'byte_work_1024_bound':(100*(B+C)+1023)//1024,
      'cold_work':W,'admission_work':2*W,'checkpoint_work':2*W,'retry_work':W,
      'memory_bound':64*(B+C)+67108864,'logical_bytes':B+C,
      'workspace_bound':32*(B+C)+1048576}

_SNAPSHOT_ISSUER=object()

@dataclass(frozen=True,init=False)
class Snapshot:
    head: str
    ordinal: int
    state: object
    stores: object
    census: object

    def __init__(self,head,ordinal,state,stores,census,*,_issuer=None):
        require(_issuer is _SNAPSHOT_ISSUER,'CORE_VERIFIED_SNAPSHOT_REQUIRED')
        for k,v in dict(head=head,ordinal=ordinal,state=state,stores=stores,census=census).items():object.__setattr__(self,k,v)
        object.__setattr__(self,'_issuer',_issuer)
        object.__setattr__(self,'_seal',digest({'head':head,'ordinal':ordinal,'state':state,'stores':stores,'census':census}))

    def verified(self):
        return (getattr(self,'_issuer',None) is _SNAPSHOT_ISSUER and
          getattr(self,'_seal',None)==digest({'head':self.head,'ordinal':self.ordinal,'state':self.state,'stores':self.stores,'census':self.census}))

class Core:
    def __init__(self,path,limits=None,expected=None):
        self.path=Path(path).resolve();self.profile=profile(limits);self.expected=copy(expected)
        self.authority=freeze(authority())
        self._uncertain=False;self.resolutions=0;self.last_census=None
        require(os.name=='nt','SUPPORTED_PLATFORM_WINDOWS_ONLY')
        require(not str(self.path).startswith('\\\\') and not any(x.lower() in ['onedrive','dropbox','googledrive'] for x in self.path.parts),'LOCAL_STORAGE_REQUIRED')
        require(ctypes.windll.kernel32.GetDriveTypeW(str(self.path.anchor))==3,'FIXED_LOCAL_DRIVE_REQUIRED')
        self.owner_token=str(self.path).casefold()

    def _connect(self,create=False):
        uri=self.path.as_uri()+'?mode='+('rwc' if create else 'rw')+'&vfs=win32'
        db=sqlite3.connect(uri,uri=True,isolation_level=None,timeout=0.5)
        try:
            if create: db.execute('PRAGMA journal_mode=DELETE')
            db.execute('PRAGMA synchronous=EXTRA');db.execute('PRAGMA cache_size=-512')
            require(db.execute('PRAGMA journal_mode').fetchone()[0]=='delete','JOURNAL_CONFIGURATION')
            require(db.execute('PRAGMA synchronous').fetchone()[0]==3,'SYNCHRONOUS_CONFIGURATION')
            require(db.execute('PRAGMA encoding').fetchone()[0]=='UTF-8','STORAGE_ENCODING')
            require(len(db.execute('PRAGMA database_list').fetchall())==1,'ATTACHED_DATABASE')
            return db
        except BaseException:
            db.close();raise

    @classmethod
    def create(cls,path,limits=None,root_digest=HASHES['R0']):
        require(root_digest==HASHES['R0'],'UNAUTHORIZED_ROOT')
        c=cls(path,limits);require(not c.path.exists(),'NO_OVERWRITE')
        c.path.parent.mkdir(parents=True,exist_ok=True)
        root=root_payload(c.profile);head=digest(root);charge=census(root,[])
        c._budget(charge,0,0)
        require(charge['admission_work']<=c.profile['limits']['admission_work'],'ROOT_WORK_CAPACITY')
        db=c._connect(True)
        try:
            db.executescript('BEGIN IMMEDIATE; CREATE TABLE root (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL); CREATE TABLE history (seq INTEGER PRIMARY KEY, opkey TEXT UNIQUE NOT NULL, payload TEXT NOT NULL); CREATE TABLE meta (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL); CREATE TABLE checkpoints (generation INTEGER PRIMARY KEY, payload TEXT NOT NULL);')
            db.execute('INSERT INTO root VALUES (1,?)',(canonical(root),))
            db.execute('INSERT INTO meta VALUES (1,?)',(canonical({'seq':0,'head':head,'generation':0}),))
            c._publication_budget(db,charge,0,0)
            db.execute('COMMIT')
        except BaseException:
            if db.in_transaction:db.execute('ROLLBACK')
            raise
        finally:db.close()
        c.snapshot();return c

    def _budget(self,c,n,checkpoints,physical=None,database_bytes=None):
        L=self.profile['limits']
        require(n<=L['operations'] and checkpoints<=L['checkpoints'],'RECORD_CAPACITY')
        require(all(c[k]<=L[k] for k in ['cold_work','logical_bytes']),'COLD_OR_LOGICAL_CAPACITY')
        require(c['retry_work']<=L['retry_work'],'RETRY_RECOVERY_CAPACITY')
        require(c['memory_bound']<=L['memory_bytes'],'MEMORY_CAPACITY')
        actual=self.path.stat().st_size if self.path.exists() else 0
        # A preliminary call may use current size; only the staged transaction
        # check below can authorize publication. Cold reads use actual size.
        reserved=actual if database_bytes is None else max(actual,database_bytes)
        storage=c['workspace_bound']+4*reserved
        require(storage<=L['workspace_bytes'],'STORAGE_CAPACITY')
        # Admission needs physical free workspace too; existing-head cold reads
        # do not require an additional new-publication reservation.
        if physical is not False:
            require(shutil.disk_usage(self.path.parent).free>=storage,'FREE_WORKSPACE')
        return storage

    def _publication_budget(self,db,c,n,checkpoints):
        """Reserve the complete *post-publication* cold bound before COMMIT.

        page_count on the writer includes dirty/unflushed allocations. No SQL
        mutations follow this check. SQLite COMMIT flushes those pages without
        allocating more b-tree pages. Keep the larger of allocated and current
        file bytes (including a retained free list); never infer growth from the
        old file. Four database images reserve the DB, rollback and publication/
        recovery workspace; the encoded-prefix reserve includes fixed overhead.
        This same bound is checked on cold replay; it is not a new read bypass.
        """
        page_size=db.execute('PRAGMA page_size').fetchone()[0]
        pages=db.execute('PRAGMA page_count').fetchone()[0]
        require(integer(page_size,512,65536) and page_size & (page_size-1)==0 and
                integer(pages,1,1073741823),'BACKEND_PAGE_GEOMETRY')
        allocated=pages*page_size
        storage=self._budget(c,n,checkpoints,database_bytes=allocated)
        physical=sum(p.stat().st_size for p in self.path.parent.glob(self.path.name+'*') if p.is_file())
        require(physical+c['workspace_bound']<=storage,'ACTUAL_BACKEND_CAPACITY')
        return storage

    def _validate(self,s,head,r):
        fields(r,['key','mode','kind','params','target','reference','witness','owner','policy','profile','result_id'])
        fields(r['key'],['world','lineage','producer','incarnation','operation'])
        require(r['mode'] in ['internal','supplied'],'UNSUPPORTED_MODE')
        require(type(r['kind']) is str and r['kind'] in OWNERS,'UNSUPPORTED_CAPABILITY')
        require(type(r['result_id']) is str and 0<len(r['result_id'])<=64,'RESULT_ID')
        require(r['profile']==self.profile['id'],'PROFILE_ID')
        require(copy(r['witness'])==witness(s,head),'STALE_OR_INCOMPLETE_WITNESS')
        require(len(canonical(r).encode())<=65536,'REQUEST_SIZE')

    def _scope(self,r,caller):
        k=r['key'];fields(k,['world','lineage','producer','incarnation','operation'])
        require(k['world']==self.authority['world'] and k['lineage']==self.authority['lineage'],'WRONG_WORLD_LINEAGE')
        require(k['producer'] in self.authority['producers'] and k['incarnation'] in self.authority['producers'][k['producer']],'UNAUTHORIZED_PRODUCER')
        require(all(type(k[x]) is str and 0<len(k[x])<=64 for x in k),'KEY')
        require(caller=={'producer':k['producer'],'incarnation':k['incarnation']},'CALLER_SCOPE')

    def _entry(self,s,head,r,v,n,g):
        h=digest({'previous':head,'seq':n,'request':r,'result':v,'state':s})
        d={'key':copy(r['key']),'ordinal':n,'head':h,'status':v['status'],'result_id':v['id']}
        return {'seq':n,'generation':g,'previous':head,'head':h,'request':copy(r),'result':copy(v),'receipt':d,'state':copy(s)}

    def _load(self,db):
        try:
            raw_total=0
            for table,maximum in [('root',1),('meta',1),('history',64),('checkpoints',8)]:
                count,size=db.execute('SELECT COUNT(*),COALESCE(SUM(length(CAST(payload AS BLOB))),0) FROM '+table).fetchone()
                require(count<=maximum and size<=self.profile['limits']['logical_bytes'],'PREDECODE_LIMIT')
                if table=='meta':require(size<=1024,'META_SIZE')
                raw_total+=size
            # Bound backend-page/free-list work before quick_check scans it.
            # The 100-pass encoded-prefix census includes this <=8x physical
            # overhead plus fixed schema/source costs; no uncharged giant file.
            require(self.path.stat().st_size<=8*raw_total+65536,'BACKEND_OVERHEAD_BOUND')
            require(not db.execute("SELECT name FROM sqlite_master WHERE type IN ('trigger','view')").fetchall(),'UNSUPPORTED_SCHEMA_OBJECT')
            require(db.execute('PRAGMA quick_check').fetchall()==[('ok',)],'SQLITE_INTEGRITY')
            require({x[0] for x in db.execute("SELECT name FROM sqlite_master WHERE type='table'") }==TABLES,'STORE_INVENTORY')
            root_text=db.execute('SELECT payload FROM root WHERE id=1').fetchone()[0];root=json.loads(root_text)
            require(root_text==canonical(root),'ROOT_STORAGE_DOMAIN')
            require(root==root_payload(self.profile),'ROOT_PROFILE_BUILD_OR_CONTRACT')
            meta_text=db.execute('SELECT payload FROM meta WHERE id=1').fetchone()[0];meta=json.loads(meta_text)
            require(meta_text==canonical(meta),'META_STORAGE_DOMAIN')
            require(db.execute('SELECT COUNT(*) FROM root').fetchone()[0]==1 and db.execute('SELECT COUNT(*) FROM meta').fetchone()[0]==1,'ROOT_META_CARDINALITY')
            fields(meta,['seq','head','generation']);s=copy(root['initial']);head=digest(root)
            raw=db.execute('SELECT seq,opkey,payload FROM history ORDER BY seq').fetchall()
            require(len(raw)<=self.profile['limits']['operations'],'RECORD_CAPACITY')
            rows=[];heads=[head];ids=set();keys=set();generation=0
            for i,(seq,opkey,payload) in enumerate(raw,1):
                e=json.loads(payload);require(payload==canonical(e),'HISTORY_STORAGE_DOMAIN');r=e['request'];v=e['result']
                require(seq==i and e['seq']==i and opkey==key(r) and opkey not in keys,'COVERAGE_KEY_INDEX')
                self._scope(r,{'producer':r['key']['producer'],'incarnation':r['key']['incarnation']})
                self._validate(s,head,r)
                ident=(r['key']['producer'],v['id']);require(ident not in ids,'RESULT_COLLISION')
                new,expected=calculate(s,r);require(v==expected,'INVALID_DERIVATION')
                require(integer(e['generation'],generation+1,1000000),'GENERATION_ORDER')
                expected_entry=self._entry(new,head,r,v,i,e['generation'])
                require(e==expected_entry,'STATE_RECEIPT_HEAD_PROOF')
                rows.append(e);s=new;head=e['head'];heads.append(head);ids.add(ident);keys.add(opkey);generation=e['generation']
            require(meta['seq']==len(rows) and meta['head']==head and integer(meta['generation'],generation,len(rows)+self.profile['limits']['checkpoints']),'HEAD_COVERAGE')
            if self.expected is not None:
                fields(self.expected,['seq','head']);at=self.expected['seq']
                require(integer(at,0,len(rows)) and heads[at]==self.expected['head'],'EXTERNAL_EXPECTED_BOUNDARY')
            checkpoints=[]
            for (payload,) in db.execute('SELECT payload FROM checkpoints ORDER BY generation'):
                try:
                    cp=json.loads(payload)
                    if not isinstance(cp,dict) or payload!=canonical(cp):raise ValueError('noncanonical accelerator')
                except (ValueError,TypeError):cp={'invalid_accelerator_payload':payload}
                checkpoints.append(cp)
            # Accelerators are optional and never trusted to establish state.
            cp_status=[]
            for cp in checkpoints:
                q=cp.get('seq');good=integer(q,0,len(rows)) and cp.get('head')==heads[q] and cp.get('state')==(root['initial'] if q==0 else rows[q-1]['state'])
                cp_status.append('verified' if good else 'ignored_invalid_accelerator')
            c=census(root,rows,checkpoints);c['observed_database_bytes']=self.path.stat().st_size
            self._budget(c,len(rows),len(checkpoints),False)
            return root,meta,s,rows,checkpoints,c,cp_status
        except (Rejected,KeyError,ValueError,TypeError,IndexError,sqlite3.Error,OSError) as e:
            raise Unavailable(str(e)) from e

    def _read(self):
        db=None
        try:
            db=self._connect();db.execute('BEGIN');return self._load(db)
        except (sqlite3.Error,Rejected,OSError) as e:raise Unavailable(str(e)) from e
        finally:
            if db is not None:
                if db.in_transaction:db.execute('ROLLBACK')
                db.close()

    def snapshot(self):
        root,m,s,rows,cps,c,cp_status=self._read();self.last_census=copy(c)
        stores={'1-families':s['families'],'2-identity':s['identity'],'3-lineage-coverage':dict(s['lineage'],coverage=list(range(1,m['seq']+1))),
          '4-clock':s['clock'],'5-protection':s['protection'],'6-RVD-registry':[{k:e[k] for k in ['request','result','receipt']} for e in rows],
          '7-profile-policy':{'profile':s['profile'],'owners':OWNERS,'policies':POLICIES,'binding_plan':s['binding_plan'],'authority':root['authority']},
          '8-publication':m,'9-proof-index':{'root':root,'history':rows,'accelerators':cps,'accelerator_status':cp_status,'fidelity':s['proof']}}
        return Snapshot(m['head'],m['seq'],freeze(s),freeze(stores),freeze(c),_issuer=_SNAPSHOT_ISSUER)

    def prepare(self,operation,kind,params=None,target=None,ref=None,mode='internal',incarnation='e1',result_id=None):
        a=self.snapshot();s=copy(a.state)
        return {'key':{'world':s['lineage']['world'],'lineage':s['lineage']['lineage'],'producer':self.authority['default_caller']['producer'],'incarnation':incarnation,'operation':operation},
          'mode':mode,'kind':kind,'params':copy(params or {}),'target':target,'reference':copy(ref),'witness':witness(s,a.head),
          'owner':OWNERS.get(kind,'unsupported'),'policy':POLICIES.get(OWNERS.get(kind),'unsupported'),'profile':self.profile['id'],'result_id':result_id or operation+'-result'}

    def qualified(self,artifact,kind,selector,epoch,revision):
        return reference(self.snapshot().state,artifact,kind,selector,epoch,revision)

    def resolve(self,ref,historical=False):
        try:return {'status':'resolved','binding':resolve(copy(self.snapshot().state),ref,historical)}
        except Rejected as e:return {'status':'O5','reason':str(e)}

    def preview(self,r):
        a=self.snapshot();rr=copy(r);self._validate(a.state,a.head,rr)
        return calculate(a.state,rr)[1]

    def admit(self,request,supplied=None,caller=None,lookup=False,hook=None,publication_hook=None,backend_fault=None):
        if self._uncertain:return {'status':'O5','reason':'RECONCILIATION_REQUIRED'}
        if self.owner_token in ACTIVE:
            ACTIVE[self.owner_token]['violated']=True
            return {'status':'O4','reason':'PROHIBITED_REENTRANT_WRITE'}
        guard={'violated':False};ACTIVE[self.owner_token]=guard
        try:
            require(not pyinspect.iscoroutinefunction(hook) and not pyinspect.iscoroutinefunction(publication_hook),'ASYNC_CALLBACK_UNSUPPORTED')
            plain(request,_budget=[65536])
            if supplied is not None:plain(supplied,_budget=[131072])
            require(len(canonical(request).encode())<=65536,'REQUEST_SIZE')
            r=freeze(request);v=freeze(supplied) if supplied is not None else None
            self._scope(r,caller if caller is not None else self.authority['default_caller'])
            root,m,s,rows,cps,c,_=self._read()
            prior=next((e for e in rows if key(e['request'])==key(r)),None)
            if prior:
                require(prior['request']==copy(r) and (v is None or prior['result']==copy(v)),'IDENTITY_CONFLICT')
                require(not (lookup and v is not None),'LOOKUP_CANNOT_SUPPLY_RESULT')
                return {'status':'O3','receipt':copy(prior['receipt'])}
            require(not lookup,'UNKNOWN_TERMINAL_KEY')
            self._validate(s,m['head'],r)
            require(not any(e['request']['key']['producer']==r['key']['producer'] and e['result']['id']==r['result_id'] for e in rows),'RESULT_COLLISION')
            def call(phase,value=None):
                if hook is not None:
                    returned=hook(phase,r,freeze(value) if value is not None else None)
                    if pyinspect.iscoroutine(returned):returned.close()
                    require(returned is None or returned is True,'VALIDATOR_FAULT_OR_UNSUPPORTED_ASYNC')
                require(not guard['violated'],'PROHIBITED_REENTRANT_WRITE')
            call('validate')
            self.resolutions+=1
            new,expected=calculate(s,copy(r),lambda value:call('due',value))
            call('resolve',expected)
            if v is not None:require(copy(v)==expected,'INVALID_RESULT')
            require(r['mode']=='supplied' if v is not None else r['mode']=='internal','RESULT_MODE')
            call('final',expected)
            entry=self._entry(new,m['head'],copy(r),expected,m['seq']+1,m['generation']+1)
            c=census(root,rows+[entry],cps);self._budget(c,len(rows)+1,len(cps))
            require(c['admission_work']<=self.profile['limits']['admission_work'],'ADMISSION_WORK_CAPACITY')
            require(not guard['violated'],'PROHIBITED_REENTRANT_WRITE')
            return self._publish(m,entry,c,publication_hook,backend_fault)
        except (Unavailable,sqlite3.Error,OSError) as e:return {'status':'O5','reason':str(e)[:160]}
        except Exception as e:return {'status':'O4','reason':str(e)[:160]}
        finally:ACTIVE.pop(self.owner_token,None)

    def _publish(self,old,entry,c,hook,fault):
        db=self._connect();committing=False
        try:
            db.execute('BEGIN IMMEDIATE');_,m,_,_,_,_,_=self._load(db);require(m==old,'STALE_DURING_PUBLICATION')
            if hook:hook('before_write',entry)
            if fault=='full':db.execute('PRAGMA max_page_count='+str(db.execute('PRAGMA page_count').fetchone()[0]))
            if fault=='readonly':db.execute('PRAGMA query_only=ON')
            db.execute('INSERT INTO history VALUES (?,?,?)',(entry['seq'],key(entry['request']),canonical(entry)))
            db.execute('UPDATE meta SET payload=? WHERE id=1',(canonical({'seq':entry['seq'],'head':entry['head'],'generation':entry['generation']}),))
            if hook:hook('before_commit',entry)
            self._publication_budget(db,c,entry['seq'],len(db.execute('SELECT generation FROM checkpoints').fetchall()))
            committing=True
            if hook:hook('commit_enter',entry)
            if fault=='commit-kill':db.set_progress_handler(lambda:os._exit(93),1)
            db.execute('COMMIT')
            if hook:hook('after_commit',entry)
            self.last_census=c
            return {'status':entry['result']['status'],'receipt':copy(entry['receipt'])}
        except BaseException as e:
            if db.in_transaction:db.execute('ROLLBACK')
            if committing:
                self._uncertain=True
                return {'status':'O5','reason':'UNCERTAIN_PUBLICATION_RECONCILE','detail':type(e).__name__}
            return {'status':'O4','reason':'PROVEN_PREPUBLICATION_FAILURE','detail':str(e)[:160]}
        finally:db.close()

    def reconcile(self):
        a=self.snapshot();self._uncertain=False
        return {'head':a.head,'ordinal':a.ordinal,'status':'verified'}

    def checkpoint(self):
        if self.owner_token in ACTIVE:
            ACTIVE[self.owner_token]['violated']=True
            return {'status':'O4','reason':'PROHIBITED_REENTRANT_WRITE'}
        if self._uncertain:return {'status':'O5','reason':'RECONCILIATION_REQUIRED'}
        db=self._connect();committing=False
        try:
            db.execute('BEGIN IMMEDIATE');root,m,s,rows,cps,_,_=self._load(db)
            cp={'seq':m['seq'],'head':m['head'],'state':s};c=census(root,rows,cps+[cp]);self._budget(c,len(rows),len(cps)+1)
            require(c['checkpoint_work']<=self.profile['limits']['checkpoint_work'],'CHECKPOINT_WORK_CAPACITY')
            m['generation']+=1;db.execute('INSERT INTO checkpoints VALUES (?,?)',(m['generation'],canonical(cp)))
            db.execute('UPDATE meta SET payload=? WHERE id=1',(canonical(m),))
            self._publication_budget(db,c,len(rows),len(cps)+1)
            committing=True;db.execute('COMMIT')
            return {'status':'checkpointed','head':m['head'],'ordinal':m['seq'],'generation':m['generation']}
        except (Rejected,Unavailable,sqlite3.Error) as e:
            if db.in_transaction:db.execute('ROLLBACK')
            if committing:
                self._uncertain=True
                return {'status':'O5','reason':'UNCERTAIN_CHECKPOINT_RECONCILE'}
            return {'status':'O4','reason':str(e)}
        finally:db.close()

    def configuration(self):
        db=self._connect()
        try:return {'python_sqlite_library':sqlite3.sqlite_version,'vfs':'win32 (explicit URI selection)',
          'journal_mode':db.execute('PRAGMA journal_mode').fetchone()[0],'synchronous':db.execute('PRAGMA synchronous').fetchone()[0],
          'page_size':db.execute('PRAGMA page_size').fetchone()[0],'cache_size':db.execute('PRAGMA cache_size').fetchone()[0],
          'encoding':db.execute('PRAGMA encoding').fetchone()[0],
          'compile_options':[x[0] for x in db.execute('PRAGMA compile_options')],
          'authoritative_tables':sorted(TABLES),'profile':self.profile}
        finally:db.close()
