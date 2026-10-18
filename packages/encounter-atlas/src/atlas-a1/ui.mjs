import {openAtlas,explainValidation} from './adapter.mjs';
import {renderPeople,renderPerson,renderFailure,escapeHTML} from './render.mjs';
import catalog from '../../content/ar0/last-collection.json' with {type:'json'};
import initial from '../../evidence/ar0-r1/browser/ui-initial.json' with {type:'json'};
import warned from '../../evidence/ar0-r1/browser/ui-warned.json' with {type:'json'};
import repaired from '../../evidence/ar0-r1/browser/ui-repaired.json' with {type:'json'};
import pending from '../../evidence/ar0-r1/browser/ui-pending.json' with {type:'json'};
import recovery from '../../evidence/ar0-r1/browser/ui-recovery.json' with {type:'json'};
import collapse from '../../evidence/ar0-r1/browser/ui-collapse.json' with {type:'json'};

const examples={initial,warned,repaired,pending,recovery,collapse};
const $=id=>document.getElementById(id);let reader=null,current=null,selected=null,loading=false,generation=0;
const busy=value=>{loading=value;for(const id of ['audience','open-example','open-import','read-check'])$(id).disabled=value;};
const render=()=>{
 if(!reader)return;
 const {model}=reader,person=model.people.find(p=>p.id===selected)??model.people[0];selected=person?.id??null;
 $('people-list').innerHTML=renderPeople(model.people,selected);$('people-count').textContent=model.people.length;
 $('person-view').innerHTML=person?renderPerson(person):'<h1>No People shown in this view</h1>';
 $('view-label').textContent=model.context.viewLabel;$('snapshot-label').textContent=current.title+' · Step '+model.context.revision;
 $('audience-note').textContent=model.context.audience==='author'?'Full developer state is available. Each person’s received fragments and conclusions remain separate.':'Shows information received by the player. Other people’s private local records are not shown.';
 $('snapshot-details').textContent=JSON.stringify(model.context,null,2);
 $('defects').innerHTML=model.technicalDefects.length?`<details class="defect-notice"><summary>${model.technicalDefects.length} recorded technical ${model.technicalDefects.length===1?'issue':'issues'}</summary><p>Encounter recorded these issues in the saved run. Inspection does not repair them.</p>${model.technicalDefects.map(d=>`<p>${d.type==='MISSING_CLOSURE_PREVIEW'?'A required closure preview was missing.':'Untranslated Encounter detail'}</p>`).join('')}<details class="technical"><summary>Encounter details</summary><pre>${escapeHTML(JSON.stringify(model.technicalDefects,null,2))}</pre></details></details>`:'';
 $('purity-result').textContent='Inspection does not submit commands or change this saved run.';
};
async function open(saved,names,title){
 const token=++generation;busy(true);reader=null;current=null;$('person-view').innerHTML='<div class="loading" role="status">Validating the saved run and its recorded steps…</div>';$('people-list').innerHTML='';$('people-count').textContent='—';$('defects').innerHTML='';$('snapshot-details').textContent='';$('purity-details').textContent='';$('snapshot-label').textContent='Validating…';
 try{const next=await openAtlas(saved,names,{audience:$('audience').value});if(token!==generation)return;reader=next;current={saved,names,title};render();$('import-panel').open=false;$('status').textContent='Saved run validated. Inspection is read-only.';}
 catch(error){if(token!==generation)return;reader=null;current=null;selected=null;$('person-view').innerHTML=renderFailure(explainValidation(error));$('snapshot-label').textContent='No saved run open';$('view-label').textContent='';$('audience-note').textContent='Validation failed; no previous Person information is retained on screen.';$('purity-result').textContent='No saved run is open.';$('status').textContent='Input not accepted.';}
 finally{if(token===generation)busy(false);}
}
$('open-example').addEventListener('click',()=>open(examples[$('example').value],catalog,$('example').selectedOptions[0].textContent));
$('audience').addEventListener('change',()=>{if(current)open(current.saved,current.names,current.title);});
$('people-list').addEventListener('click',event=>{const b=event.target.closest('[data-person]');if(b&&reader){selected=b.dataset.person;render();}});
$('read-check').addEventListener('click',async()=>{
 if(!reader||loading){$('purity-result').textContent='Open a validated saved run first.';return;}
 const token=generation,result=await reader.integrity();if(token!==generation)return;
 $('purity-result').textContent=result.unchanged?'Read-only check passed. Saved run, recorded steps, content and catalog are unchanged.':'Read-only check failed.';
 $('purity-details').textContent=JSON.stringify(result,null,2);
});
for(const [file,area] of [['save-file','save-json'],['catalog-file','catalog-json']])$(file).addEventListener('change',async()=>{const f=$(file).files[0];if(f)$(area).value=await f.text();});
$('open-import').addEventListener('click',()=>{
 try{const saved=JSON.parse($('save-json').value),names=$('catalog-json').value.trim()?JSON.parse($('catalog-json').value):catalog;open(saved,names,'Opened saved run');}
 catch(error){++generation;reader=null;current=null;selected=null;loading=false;$('people-list').innerHTML='';$('people-count').textContent='—';$('person-view').innerHTML=renderFailure(explainValidation(error));$('snapshot-label').textContent='No saved run open';$('snapshot-details').textContent='';$('defects').innerHTML='';$('purity-details').textContent='';$('purity-result').textContent='No saved run is open.';$('view-label').textContent='';$('audience-note').textContent='No previous Person information is retained on screen.';$('status').textContent='Input not accepted.';}
});
open(warned,catalog,'After warning');
