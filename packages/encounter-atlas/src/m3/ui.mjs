import { fixture } from '../../content/m3/seed.mjs';
import { BASED_CATALOG } from './types.mjs';
import { draft, evidenceKey, markNoticeDisplayed } from './meaning.mjs';
import { startEncounter,playerView,prepareSend,prepareAction,prepareSessionOperation,prepareConfirmation,dispatch,renderEpisode,inspectRun,exportRun,importRun } from './engine.mjs';
const $=id=>document.getElementById(id),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const r=fixture.content.initial.rule,scale=fixture.content.initial.minorUnitsPerCoin;
let run=null,family='Request',intent='paperwork',phase='ready',episodeId=null,pending=null,url=null;
const commandId=()=>`command_${crypto.randomUUID().replaceAll('-','')}`;
const name=(v,id)=>v.participants.find(a=>a.id===id)?.label??v.references.find(s=>s.id===id)?.label??'Participant';
function notice(text,error=false){$('notice').textContent=text;$('notice').hidden=!text;$('notice').classList.toggle('error',error);}
function choices(v){const has=id=>v.references.some(x=>x.id===id);return [
 {id:'paperwork',family:'Request',label:'Request case paperwork',ok:true,input:()=>draft('request_access',{targetId:v.recordId,scopeId:v.rule?.relevantScopeId??v.recordId})},
 {id:'case-location',family:'Request',label:'Ask where the case is',ok:true,input:()=>draft('ask_whereabouts',{operation:'ask',targetId:v.itemId,scopeId:v.itemId})},
 {id:'owner-location',family:'Request',label:'Ask about the owner’s whereabouts',ok:has(r.ownerTopicId),input:()=>draft('ask_whereabouts',{operation:'ask',targetId:r.ownerTopicId,scopeId:r.ownerTopicId})},
 {id:'whole-file',family:'Request',label:'Request the whole customer file',ok:has(r.wholeScopeId),input:()=>draft('request_access',{targetId:v.recordId,scopeId:r.wholeScopeId})},
 {id:'protected-scope',family:'Request',label:'Request private contact information',ok:has(r.protectedScopeIds[0]),input:()=>draft('request_access',{targetId:v.recordId,scopeId:r.protectedScopeIds[0]})},
 {id:'comparison',family:'Request',label:'Accept the case-only supervised comparison',ok:has(r.relevantScopeId),input:()=>draft('request_access',{operation:'compare',targetId:v.recordId,scopeId:r.relevantScopeId})},
 {id:'collection',family:'Request',label:'Request authorized collection',ok:true,input:()=>draft('request_access',{operation:'collect',targetId:v.itemId,scopeId:v.itemId})},
 {id:'show-evidence',family:'Remark',label:'Present the evidence in your notebook',ok:v.evidence.length>0&&has(r.relevantScopeId),input:()=>draft('present_evidence',{operation:'show',targetId:v.recordId,scopeId:r.relevantScopeId,evidenceKeys:v.evidence.map(evidenceKey)})},
 {id:'challenge',family:'Remark',label:'Challenge the entry using learned evidence',ok:v.evidence.length>0&&has(r.relevantScopeId),input:()=>draft('challenge_record',{operation:'challenge',targetId:v.recordId,scopeId:r.relevantScopeId,evidenceKeys:v.evidence.map(evidenceKey)})},
 {id:'why',family:'Remark',label:'Why about the restriction and warning',ok:Boolean(v.warningMessageId)&&v.partnerId===r.custodianId,input:()=>draft('why',{operation:'explain',targetId:v.recordId,scopeId:r.relevantScopeId,contextMessageId:v.warningMessageId})},
 {id:'apology',family:'Remark',label:'Acknowledge the concern with an apology',ok:Boolean(v.warningMessageId),input:()=>draft('acknowledge_grievance',{targetId:v.recordId,scopeId:r.relevantScopeId})},
 {id:'yes',family:'Remark',label:'Acknowledge the current proposal (not confirmation)',ok:Boolean(v.activeOffer),input:()=>draft('yes',{targetId:v.itemId,scopeId:v.itemId})},
 {id:'ordinary-money',family:'Offer',label:'Offer ordinary collection payment',ok:true,input:()=>draft('propose_exchange',{targetId:v.itemId,scopeId:v.itemId,amountMinor:Number($('amount').value)*scale,purpose:'ordinary_collection'})},
 {id:'money-bypass',family:'Offer',label:'Offer money to bypass the private-file boundary',ok:has(r.wholeScopeId),input:()=>draft('propose_exchange',{targetId:v.itemId,scopeId:r.wholeScopeId,amountMinor:Number($('amount').value)*scale,purpose:'boundary_exception'})}
 ].filter(x=>x.ok&&x.family===family);}
function acknowledgeVisibleNotice(){
 if(!pending?.payload.preview.notice||pending.payload.preview.notice.displayed)return;
 const el=$('closure-notice'),rect=el.getBoundingClientRect(),style=getComputedStyle(el);
 // Opacity is not inherited in computed style: a transparent ancestor also
 // prevents this notice from being displayed, despite its onscreen rectangle.
 for(let node=el;node;node=node.parentElement){
  const opacity=Number(getComputedStyle(node).opacity);
  if(!Number.isFinite(opacity)||opacity<=0)return;
 }
 const geometry=[rect.left,rect.right,rect.top,rect.bottom,rect.width,rect.height,innerWidth,innerHeight];
 const contained=geometry.every(Number.isFinite)&&innerWidth>0&&innerHeight>0&&rect.width>0&&rect.height>0&&rect.right>rect.left&&rect.bottom>rect.top&&rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight;
 if(!el.hidden&&style.visibility==='visible'&&style.display!=='none'&&contained)pending=markNoticeDisplayed(pending);
}
function preview(){
 const v=playerView(run),choice=choices(v).find(x=>x.id===intent);$('closure-notice').hidden=true;
 if(!choice||v.partnerId===null){pending=null;$('preview').textContent=v.partnerId===null?'Approach a partner to compose a message.':'No supported message in this context.';$('send').disabled=true;return;}
 try{const input=choice.input();input.vibe=$('vibe').value;input.salience=$('salience').value;pending=prepareSend(run,fixture,input,commandId());$('preview').textContent=pending.payload.preview.text;
  const n=pending.payload.preview.notice;if(n){$('closure-notice').textContent=n.text;$('closure-notice').hidden=false;requestAnimationFrame(acknowledgeVisibleNotice);}
  $('send').textContent=n?'Send anyway':'Send message';$('send').disabled=phase!=='ready';
 }catch{$('preview').textContent='This composition is unavailable. Review the selected meaning and known evidence.';pending=null;$('send').disabled=true;}
}
function render(){
 const v=playerView(run),busy=phase!=='ready';
 $('brief').textContent=`You carry collection authority for ${name(v,v.itemId)}. The entry reads “${v.entry}”. Show the ticket, then investigate through the relevant records and people.`;
 $('ticket-status').textContent=v.ticketVerified?'COLLECTION TICKET / VERIFIED':'COLLECTION TICKET / IN YOUR POSSESSION';$('balance').textContent=`${v.balanceMinor/scale} coins remaining`;
 $('partner').textContent=v.partnerId?name(v,v.partnerId):'Conversation ended';$('partner-select').innerHTML=v.participants.filter(a=>a.kind==='npc').map(a=>`<option value="${a.id}" ${a.id===v.partnerId?'selected':''}>${esc(a.label)}</option>`).join('');
 $('switch-partner').disabled=busy||$('partner-select').value===v.partnerId;$('partner-select').disabled=busy;$('end').disabled=busy||v.partnerId===null;
 for(const f of ['Offer','Request','Remark']){$('family-'+f.toLowerCase()).setAttribute('aria-pressed',String(family===f));$('family-'+f.toLowerCase()).disabled=busy;}
 const available=choices(v);if(!available.some(x=>x.id===intent))intent=available[0]?.id??'';$('intent').innerHTML=available.length?available.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join(''):'<option value="">No learned message in this family</option>';$('intent').value=intent;$('intent').disabled=busy;
 $('amount-wrap').hidden=family!=='Offer';$('amount').disabled=busy;$('vibe').disabled=busy;$('salience').disabled=busy;
 $('revision').textContent=`Revision ${run.revision} · ${v.opportunities.used} opportunities`;
 $('references').innerHTML=v.references.map(x=>`<span class="chip">${esc(x.label)}</span>`).join('');
 $('learned').innerHTML=v.evidence.length?v.evidence.map(e=>`<p>${esc(e.label)}<br><span class="small muted">${e.form==='document'?'Inspected/shown document':e.form==='report'?'Received report':'Directly observed'}</span></p>`).join(''):'<p class="small muted">No handling detail has been inspected yet. Permission alone reveals no result.</p>';
 $('actions').innerHTML=v.permissions.filter(p=>p.status==='allowed'&&!v.performedActionIds.includes(p.actionId)).map(p=>fixture.content.actions.find(a=>a.id===p.actionId)).filter(a=>a&&!['handover','close_service'].includes(a.kind)).map(a=>`<button class="primary wide physical-action" data-action="${a.id}" ${busy?'disabled':''}>${esc(a.label)}</button>`).join('');
 $('actions').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{try{submit(prepareAction(run,fixture,b.dataset.action,commandId()));}catch{notice('A current permission and valid context are required.',true);}}));
 $('warning-reminder').hidden=!v.warningMessageId;$('warning-reminder').textContent='Public visit-long warning: renewed protected/full-file demands can end collection service after an explicit preview notice. The case-only route remains available while service is open; clarification and End do not reset this warning.';
 $('reminder').textContent=!v.opportunities.noPressure&&v.opportunities.used>=v.opportunities.allowance?'Closing-time reminder only: no automatic service closure or loss.':'';
 const entries=v.messages.map(m=>({sequence:m.sequence,html:`<article class="history-entry"><p class="label">${esc(name(v,m.outward.senderId))} · ${esc(m.outward.family)}${m.ownComposition?' · '+esc(BASED_CATALOG[m.ownComposition.selectedVibe]):''}</p><p>${esc(m.outward.content.text)}</p></article>`}));
 for(const o of run.data.observations.filter(o=>o.observerId===v.actorId&&o.source.kind==='action_result'))entries.push({sequence:o.sequence,html:`<article class="history-entry action"><p class="label">Physical result</p><p>${esc(o.receivedDetails.conduct??'')}${o.receivedDetails.evidence?.length?'\n'+esc(o.receivedDetails.evidence.map(e=>e.label).join('\n')):''}</p></article>`});
 $('history').innerHTML=entries.length?entries.sort((a,b)=>a.sequence-b.sequence).map(x=>x.html).join(''):'<p class="empty">Begin by deliberately showing and verifying the collection ticket.</p>';
 $('offer-panel').hidden=!v.activeOffer;if(v.activeOffer){const t=v.activeOffer.terms;$('offer-id').textContent=`${v.activeOffer.id} / version ${v.activeOffer.revision}`;$('offer-terms').innerHTML=`<p><strong>Receive custody:</strong> ${esc(name(v,t.itemId))}</p><p><strong>Pay:</strong> ${t.amountMinor/scale} coins</p><p><strong>Owner remains:</strong> ${esc(name(v,t.ownerId))}</p><p><strong>Private information:</strong> none</p>`;$('confirm').disabled=busy;}
 if(v.activeOffer){const origin=document.createElement('p');origin.textContent=`Released by ${name(v,v.activeOffer.partnerId)} from ${name(v,v.activeOffer.terms.fromId)}.`;$('offer-terms').append(origin);}
 $('outcome').hidden=!v.recovered&&!v.serviceClosed;
 $('outcome').textContent=v.recovered?`CASE RECOVERED · Spent ${ (fixture.content.initial.balances[v.actorId]-v.balanceMinor)/scale } coins · Remaining ${v.balanceMinor/scale} · Ownership remains with ${name(v,fixture.content.initial.ownerId)} · Private contact information not disclosed · Record ${v.recordCorrected?'corrected with original retained':'correction is a separate outcome'}`:v.serviceClosed?'COLLECTION SERVICE CLOSED FOR THIS VISIT · The case has not been recovered. The previously warned, previewed renewed demand ended service.':'';
 $('outcome').classList.toggle('closed',v.serviceClosed&&!v.recovered);
 $('progress').textContent=v.recovered?'Recovery completed':v.serviceClosed?'Visit closed':v.comparisonComplete?'Comparison performed · exact confirmation remains separate':v.evidence.length?'Evidence learned · share relevant fragments deliberately':'Investigate through actual actions and communications';
 renderPerformance();preview();if(!$('inspector').hidden)refreshInspector();
}
function renderPerformance(){const e=episodeId?renderEpisode(run,episodeId):null;$('phase').textContent=phase==='intake'?'Intake':phase==='delivery'?'Delivery':'Your move';$('pose').textContent=e?(phase==='intake'?e.intake.description:e.delivery.description):'The duty clerk waits beside the record. Physical actions and conversation remain separate.';$('delivery').textContent=e&&phase!=='intake'?e.delivery.text:'';$('advance').hidden=phase==='ready';$('skip').hidden=phase==='ready';$('advance').textContent=phase==='intake'?'Continue to Delivery':'Return to composer';$('replay').disabled=!episodeId||phase!=='ready';}
function submit(c){try{const result=dispatch(run,fixture,c);if(result.status==='rejected'){notice(`This command was not committed (${result.code}). Review the current state and preview.`,true);return;}run=result.run;const response=result.receipt.result.episodeId;if(response)episodeId=response;else if(['switch_partner','end_conversation'].includes(c.payload.operation))episodeId=null;phase=response?'intake':'ready';notice(response?'The communication/action committed once. Read Intake and Delivery.':'The deliberate operation committed once.');render();}catch{notice('The operation was not committed. Review the current permission and context.',true);}}
function refreshInspector(){const trace=inspectRun(run,fixture);$('trace-summary').textContent=`${trace.canonicalMessages.length} messages · ${trace.actionResults.length} physical results · ${trace.decisions.length} decisions · ${trace.technicalDefects.length} technical defects`;$('trace').textContent=JSON.stringify(trace,null,2);}
function showJson(title,help,value,filename,importing=false){$('file-title').textContent=title;$('file-help').textContent=help;$('file-json').value=importing?'':JSON.stringify(value,null,2);$('file-json').readOnly=!importing;$('file-error').textContent='';$('load-json').hidden=!importing;$('download-json').hidden=importing;if(url)URL.revokeObjectURL(url);if(!importing){url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'}));$('download-json').href=url;$('download-json').download=filename;}$('file-dialog').showModal();}
for(const f of ['Offer','Request','Remark'])$('family-'+f.toLowerCase()).addEventListener('click',()=>{family=f;intent='';render();});
$('intent').addEventListener('change',e=>{intent=e.target.value;preview();});for(const id of ['vibe','salience','amount'])$(id).addEventListener('change',preview);
$('send').addEventListener('click',()=>{acknowledgeVisibleNotice();if(pending)submit(pending);});window.addEventListener('scroll',acknowledgeVisibleNotice,{passive:true});
$('advance').addEventListener('click',()=>{phase=phase==='intake'?'delivery':'ready';render();});$('skip').addEventListener('click',()=>{phase='ready';render();});$('replay').addEventListener('click',()=>{phase='intake';render();});
$('partner-select').addEventListener('change',()=>{$('switch-partner').disabled=phase!=='ready'||$('partner-select').value===playerView(run).partnerId;});
$('switch-partner').addEventListener('click',()=>submit(prepareSessionOperation(run,fixture,'switch_partner',$('partner-select').value,commandId())));$('end').addEventListener('click',()=>submit(prepareSessionOperation(run,fixture,'end_conversation',null,commandId())));
$('confirm').addEventListener('click',()=>{try{submit(prepareConfirmation(run,fixture,commandId()));}catch{notice('No current accepted handover is available.',true);}});
$('inspector-toggle').addEventListener('click',()=>{$('inspector').hidden=!$('inspector').hidden;$('inspector-toggle').setAttribute('aria-expanded',String(!$('inspector').hidden));if(!$('inspector').hidden)refreshInspector();});$('refresh-inspector').addEventListener('click',refreshInspector);
$('save').addEventListener('click',()=>showJson('Save M3 run','Download or copy this complete author/debug snapshot. Manual saves preserve continuing visit state; they contain authored fixture truth.',exportRun(run,fixture),'Encounter_M3_Run.json'));
$('open').addEventListener('click',()=>showJson('Open M3 run','Paste a complete matching M3 save. Loading validates and reconstructs the committed journal; it does not perform new world actions.',null,'',true));
$('load-json').addEventListener('click',async()=>{try{run=await importRun(JSON.parse($('file-json').value),fixture);episodeId=run.data.episodes.at(-1)?.id??null;phase='ready';$('file-dialog').close();notice('M3 run restored with its original warning, repair, offers and physical results.');render();}catch{$('file-error').textContent='This is not a compatible validated M3 save. The current run and original files are unchanged.';}});
$('export-trace').addEventListener('click',()=>showJson('M3 author trace','Read-only causal data for this exact run. Private composition and NPC hypotheses belong to the author view.',inspectRun(run,fixture),'Encounter_M3_Trace.json'));
$('export-package').addEventListener('click',()=>showJson('M3 author package','Authored configuration contains synthetic hidden fixture truth. It is separate from the current run.',fixture,'Encounter_M3_Package.json'));$('close-file').addEventListener('click',()=>$('file-dialog').close());
$('restart').addEventListener('click',async()=>{run=await startEncounter(fixture);family='Request';intent='paperwork';phase='ready';episodeId=null;$('vibe').value='EA';$('salience').value='NUANCED';notice('New M3 run started. Save manually to retain a run before closing or restarting.');render();});
async function main(){$('vibe').innerHTML=fixture.content.communication.expressions.map(e=>`<option value="${e.vibe}">${esc(BASED_CATALOG[e.vibe])}</option>`).join('');run=await startEncounter(fixture);render();}main().catch(()=>notice('The package could not be verified. Rebuild from the supplied source.',true));
