import { fixture } from '../content/last-collection.mjs';
import { BASED_CATALOG, copy } from './contracts.mjs';
import { startEncounter, prepareSend, prepareInspection, dispatch, playerView, renderEpisode, inspectRun, exportRun, importRun } from './encounter.mjs';
import { describeOutward } from './compiler.mjs';

const $=id=>document.getElementById(id);
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let run=null,draft={act:'request_access',vibe:'EA',salience:'NUANCED'},pending=null,lastCommand=null,episodeId=null,phase='ready',downloadUrl=null;
const newCommandId=()=>`command_${crypto.randomUUID().replaceAll('-','')}`;
const nameOf=(view,id)=>view.participants.find(x=>x.id===id)?.label || 'Participant';
function notice(text,error=false) {$('notice').textContent=text; $('notice').hidden=!text; $('notice').classList.toggle('error',error);}
function preview() {
  try {pending=prepareSend(run,fixture,draft,newCommandId()); $('preview').textContent=pending.payload.preview.text; $('send').disabled=phase!=='ready';}
  catch(error){pending=null; $('preview').textContent=error.code==='INSPECTION_REQUIRED'?'Inspect a permitted record before using its detail.':'This expression is unavailable in the current context.'; $('send').disabled=true;}
}
function render() {
  const view=playerView(run),busy=phase!=='ready';
  $('brief').textContent=`You are authorized to collect ${view.item.label}. Your ticket has been checked. The entry reads “${view.entry}”.`;
  $('balance').textContent=`${(view.balanceMinor/fixture.content.initial.minorUnitsPerCoin).toFixed(0)} coins`;
  $('partner').textContent=nameOf(view,view.partnerId);
  $('family-request').setAttribute('aria-pressed',String(draft.act==='request_access')); $('family-remark').setAttribute('aria-pressed',String(draft.act==='challenge_record'));
  $('family-request').disabled=busy; $('family-remark').disabled=busy;
  $('act').innerHTML=`<option value="request_access">Request case paperwork</option><option value="challenge_record" ${view.inspectedDetail?'':'disabled'}>${view.inspectedDetail?'Report the inspected signature detail':'Remark about an inspected detail — inspect first'}</option>`;
  $('act').value=draft.act; $('act').disabled=busy; $('vibe').disabled=busy; $('salience').disabled=busy;
  $('act-help').textContent=draft.act==='request_access'?'Ask for the relevant collection record.':'Use the specific detail you actually inspected.';
  $('references').innerHTML=view.references.map(x=>`<span class="chip">${esc(x.label)}</span>`).join('');
  $('learned').innerHTML=view.inspectedDetail?`<p><strong>Inspected detail</strong><br>Recipient signature: ${esc(view.inspectedDetail.value)}.</p>`:'';
  $('permission').textContent=view.permissions.length?'Permission: inspect the handling extract only. The rest of the file stays covered.':'No inspection permission has been offered yet.';
  $('inspect').hidden=!view.actionAvailable; $('inspect').disabled=busy;
  $('reminder').textContent=!view.opportunities.noPressure && view.opportunities.used>=view.opportunities.allowance?'Closing-time reminder: time is passing. Collection service remains available.':'';
  $('revision').textContent=`Revision ${run.revision} · ${view.opportunities.used} actions`;
  const entries=[];
  for(const message of view.messages) entries.push({sequence:message.sequence,html:`<article class="history-entry"><p class="label">${esc(nameOf(view,message.senderId))} · ${esc(message.outward.family)}${message.ownComposition?' · '+esc(BASED_CATALOG[message.ownComposition.selectedVibe]):''}</p><p>${esc(describeOutward(message.outward))}</p></article>`});
  for(const o of run.data.observations.filter(o=>o.observerId===view.actorId && o.source.kind==='action_result')) entries.push({sequence:o.sequence,html:`<article class="history-entry action"><p class="label">Physical action · inspection</p><p>${esc(o.receivedDetails.conduct)}\nRecipient signature: ${esc(o.receivedDetails.recordDetail.value)}.</p></article>`});
  $('history').innerHTML=entries.length?entries.sort((a,b)=>a.sequence-b.sequence).map(x=>x.html).join(''):'<p class="empty">Review your request, then send it. Permission and inspection are separate steps.</p>';
  $('progress').textContent=view.inspectedDetail && run.data.claims.length?'Paperwork interaction complete · next verification step identified':view.inspectedDetail?'Detail inspected · choose Remark to report it':view.permissions.length?'Limited inspection offered · choose when to perform it':'Request → deliberate inspection → report';
  renderPerformance(); preview(); if(!$('inspector').hidden) refreshInspector();
}
function renderPerformance() {
  const latest=episodeId?renderEpisode(run,episodeId):null;
  $('phase').textContent=phase==='intake'?'Intake':phase==='delivery'?'Delivery':'Your move';
  $('pose').textContent=!latest?'The duty clerk waits at the counter, with the record beside the checked ticket.':phase==='intake'?latest.intake.description:latest.delivery.description;
  $('delivery').textContent=latest && phase!=='intake'?latest.delivery.text:'';
  $('advance').hidden=phase==='ready'; $('skip').hidden=phase==='ready'; $('advance').textContent=phase==='intake'?'Continue to Delivery':'Return to composer'; $('replay').disabled=!episodeId || phase!=='ready';
}
function submit(command) {
  const result=dispatch(run,fixture,command);
  if(result.status==='rejected'){notice(`The command was not committed (${result.code}). Review the current preview.`,true);render();return;}
  run=result.run; lastCommand=command;
  if(result.receipt.result.episodeId){episodeId=result.receipt.result.episodeId;phase='intake';notice('Message sent. The clerk received its outward communication.');}
  else {phase='ready';notice('Inspection performed. Your notebook now contains only the permitted detail.');}
  render();
}
function refreshInspector() {
  const trace=inspectRun(run,fixture);
  $('trace-summary').textContent=`${run.data.messages.length} messages · ${run.data.permissions.length} permissions · ${run.data.actionResults.length} performed inspections · ${run.data.decisions.length} recorded decisions. Protected contact value withheld.`;
  $('trace').textContent=JSON.stringify(trace,null,2);
}
function showJson(title,help,value,filename,importing=false) {
  $('file-title').textContent=title; $('file-help').textContent=help; $('file-json').value=importing?'':JSON.stringify(value,null,2); $('file-json').readOnly=!importing; $('file-error').textContent='';
  $('load-json').hidden=!importing; $('download-json').hidden=importing;
  if(downloadUrl)URL.revokeObjectURL(downloadUrl);
  if(!importing){downloadUrl=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'})); $('download-json').href=downloadUrl; $('download-json').download=filename;}
  $('file-dialog').showModal();
}
$('family-request').addEventListener('click',()=>{draft.act='request_access';render();});
$('family-remark').addEventListener('click',()=>{draft.act='challenge_record';render();});
$('act').addEventListener('change',e=>{draft.act=e.target.value;render();});
$('vibe').addEventListener('change',e=>{draft.vibe=e.target.value;preview();});
$('salience').addEventListener('change',e=>{draft.salience=e.target.value;preview();});
$('send').addEventListener('click',()=>{if(pending)submit(pending);});
$('inspect').addEventListener('click',()=>{try{submit(prepareInspection(run,fixture,newCommandId()));}catch{notice('A current inspection permission is required.',true);}});
$('advance').addEventListener('click',()=>{phase=phase==='intake'?'delivery':'ready';render();});
$('skip').addEventListener('click',()=>{phase='ready';render();});
$('replay').addEventListener('click',()=>{phase='intake';render();});
$('inspector-toggle').addEventListener('click',()=>{$('inspector').hidden=!$('inspector').hidden; $('inspector-toggle').setAttribute('aria-expanded',String(!$('inspector').hidden)); if(!$('inspector').hidden){refreshInspector();$('inspector').scrollIntoView({behavior:'smooth'});}});
$('refresh-inspector').addEventListener('click',refreshInspector);
$('save').addEventListener('click',()=>showJson('Save run','Download this JSON file, or copy the complete text as a backup. Saving never commits another action.',exportRun(run,fixture),'Encounter_M2_Run.json'));
$('open').addEventListener('click',()=>showJson('Open run','Paste a complete M2 run JSON export. Only a matching, validated package and command history can replace this run. Old saves remain untouched.',null,'',true));
$('load-json').addEventListener('click',async()=>{try{const restored=await importRun(JSON.parse($('file-json').value),fixture);run=restored;episodeId=run.data.episodes.at(-1)?.id??null;phase='ready';$('file-dialog').close();notice('Run restored without replaying effects or confirming an action.');render();}catch{$('file-error').textContent='This is not a compatible, validated M2 save. The current run and legacy files are unchanged.';}});
$('export-trace').addEventListener('click',()=>showJson('Author inspector trace','Read-only trace of this exact run. Private player composition appears only in this author view.',inspectRun(run,fixture),'Encounter_M2_Inspector_Trace.json'));
$('export-package').addEventListener('click',()=>showJson('Author package','Authored configuration is separate from a running session. This author export includes fixture secrets; it does not disclose them to any actor.',fixture,'Encounter_M2_Package.json'));
$('close-file').addEventListener('click',()=>$('file-dialog').close());
$('restart').addEventListener('click',async()=>{run=await startEncounter(fixture);draft={act:'request_access',vibe:'EA',salience:'NUANCED'};episodeId=null;lastCommand=null;phase='ready';$('vibe').value='EA';$('salience').value='NUANCED';notice('New run started from the authored package. Use Save run to keep a backup.');render();});

async function main(){
  $('vibe').innerHTML=fixture.content.communication.expressions.map(e=>`<option value="${e.vibe}">${esc(BASED_CATALOG[e.vibe])}</option>`).join('');
  run=await startEncounter(fixture);render();
}
main().catch(()=>notice('The package could not be verified. Rebuild from the supplied source or open the verified offline build.',true));
