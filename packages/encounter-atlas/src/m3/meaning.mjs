import { ACTS, copy, freeze, fields, id, integer, requireThat, SALIENCE, messageRecord } from './types.mjs';

export const draft=(act='request_access',extra={})=>({act,operation:'inspect',targetId:null,scopeId:null,evidenceKeys:[],amountMinor:0,purpose:'ordinary_collection',contextMessageId:null,vibe:'EA',salience:'NUANCED',...extra});
export const evidenceKey=e=>[e.subjectId,e.predicate,JSON.stringify(e.value)].join('|');
export function describe(o){
 return [o.content.text,...o.framing.map(c=>c.text),`Social framing is ${o.prominence}.`].join('\n');
}
export function compile(definitions,view,input,identity){
 fields(input,['act','operation','targetId','scopeId','evidenceKeys','amountMinor','purpose','contextMessageId','vibe','salience']);requireThat(Object.hasOwn(ACTS,input.act),'UNSUPPORTED_ACT');requireThat(SALIENCE.includes(input.salience));
 const expression=definitions.expressions.find(e=>e.vibe===input.vibe);requireThat(Boolean(expression),'UNAVAILABLE_EXPRESSION');integer(input.amountMinor);
 const targetId=input.targetId??view.itemId,scopeId=input.scopeId??view.rule?.relevantScopeId??targetId;
 requireThat(view.references.some(r=>r.id===targetId)&&view.references.some(r=>r.id===scopeId),'UNKNOWN_REFERENCE');
 requireThat(Array.isArray(input.evidenceKeys)&&new Set(input.evidenceKeys).size===input.evidenceKeys.length);
 const evidence=input.evidenceKeys.map(k=>{const e=view.evidence.find(e=>evidenceKey(e)===k);requireThat(Boolean(e),'UNLEARNED_EVIDENCE');return copy(e);});
 if(['present_evidence','challenge_record'].includes(input.act))requireThat(evidence.length>0,'EVIDENCE_REQUIRED');
 const knownRule=view.rule,protectedScope=Boolean(knownRule?.protectedScopeIds.includes(scopeId));
 if(input.contextMessageId!==null)requireThat(view.messages.some(m=>m.id===input.contextMessageId&&m.outward.senderId===view.partnerId),'CONTEXT_REQUIRED');
 const scope={subjectId:scopeId,kind:protectedScope?(scopeId===knownRule.wholeScopeId?'whole':'protected'):knownRule&&scopeId===knownRule.relevantScopeId?'relevant':'subject'};
 const label=ref=>view.references.find(r=>r.id===ref)?.label??'the selected subject';
 let text,kind='request';
 if(input.act==='request_access'){
  requireThat(['inspect','compare','collect','bypass'].includes(input.operation));
  if(input.operation==='collect')requireThat(targetId===view.itemId&&scopeId===view.itemId,'AMBIGUOUS_SCOPE');
  if(input.operation==='compare')requireThat(Boolean(knownRule)&&targetId===view.recordId&&scopeId===knownRule.relevantScopeId,'AMBIGUOUS_SCOPE');
  if(input.operation==='bypass')requireThat(protectedScope,'AMBIGUOUS_SCOPE');
  text=input.operation==='collect'?`Requests authorized collection of ${label(targetId)}.`:input.operation==='compare'?`Accepts the offered supervised comparison, limited to ${label(scopeId)}.`:input.operation==='bypass'?`Asks the clerk to bypass the stated boundary and disclose ${label(scopeId)}.`:`Requests access to ${label(scopeId)} concerning ${label(targetId)}.`;
 }else if(input.act==='ask_whereabouts'){requireThat(input.operation==='ask');kind='question';text=`Asks where ${label(targetId)} is. This is a request for location information, not a physical search.`;}
 else if(input.act==='challenge_record'){kind='assertion';text=`Challenges the collection entry using the inspected/reported evidence below, limiting the present request to ${label(scopeId)}.`;}
 else if(input.act==='present_evidence'){kind='assertion';text=`Shows only the selected evidence below, concerning ${label(scopeId)}. Showing it does not transfer the object.`;}
 else if(input.act==='acknowledge_grievance'){kind='acknowledgment';text='Acknowledges the stated privacy concern with an apology. Does not accept the comparison or narrow the present request.';}
 else if(input.act==='why'){kind='question';requireThat(Boolean(view.warningMessageId)&&input.contextMessageId===view.warningMessageId&&view.partnerId===knownRule?.custodianId,'CONTEXT_REQUIRED');text='Asks Why about the recorded restriction and warning. This is clarification, not a renewed demand.';}
 else if(input.act==='yes'){kind='acknowledgment';requireThat(Boolean(view.activeOffer),'NO_ACTIVE_OFFER');identity={...identity,contextMessageId:view.activeOffer.sourceMessageId};text=`Acknowledges handover proposal ${view.activeOffer.id}, version ${view.activeOffer.revision}. This does not confirm or execute its material terms.`;}
 else {kind='proposal';requireThat(['ordinary_collection','boundary_exception'].includes(input.purpose));text=`Offers ${input.amountMinor} minor money units ${input.purpose==='ordinary_collection'?'for ordinary collection; no fee or debt is asserted.':`in return for bypassing the privacy boundary for ${label(scopeId)}.`}`;}
 if(evidence.length)text+='\n'+evidence.map(e=>e.label).join('\n');
 const m={schema:'encounter-message@3',...identity,privateComposition:{selectedVibe:input.vibe,selectedSalience:input.salience,authorId:'author_0001',templateId:expression.templateId,intendedFraming:expression.cues.map(c=>c.text).join(' ')},outward:{family:ACTS[input.act],act:input.act,senderId:view.actorId,recipientIds:[view.partnerId],subjectIds:[...new Set([targetId,scopeId,...evidence.map(e=>e.subjectId)])],targetId,scope,content:{kind,operation:input.operation,evidence,amountMinor:input.amountMinor,purpose:input.purpose,text},framing:copy(expression.cues),prominence:{SUBTLE:'understated',NUANCED:'measured',OVERT:'emphatic'}[input.salience],terms:null}};
 messageRecord(m);return freeze(m);
}

/** The sole predicted consequence uses public warning, draft and known success. */
export function closureNotice(view,outward){
 if(!view.warningMessageId||view.recovered||view.serviceClosed||outward.recipientIds[0]!==view.rule?.custodianId)return null;
 const demand=view.rule.protectedScopeIds.includes(outward.scope.subjectId)&&((outward.act==='request_access'&&['inspect','bypass'].includes(outward.content.operation))||(outward.act==='propose_exchange'&&outward.content.purpose==='boundary_exception'));
 return demand?{warningMessageId:view.warningMessageId,text:'The clerk warned that renewing this protected/full-file demand will end collection service for this visit. Send anyway or edit the draft.',displayed:false}:null;
}
export function markNoticeDisplayed(command){
 const next=copy(command);requireThat(next.kind==='send_message'&&Boolean(next.payload.preview.notice),'NO_NOTICE');next.payload.preview.notice.displayed=true;return freeze(next);
}
