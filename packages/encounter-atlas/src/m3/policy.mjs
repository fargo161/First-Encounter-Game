import { freeze } from './types.mjs';
import { qualifiesEvidence, privacySupport, substantiveCorrection } from './knowledge.mjs';

/** Filtered actor view only. No world, package, DOM, name or selector input. */
export function chooseResponse(view,{afterAction=false,noticeDisplayed=false}={}){
 const r=view.rule,o=view.incoming,role=view.profile.roles;
 const protectedDemand=Boolean(o&&r?.protectedScopeIds.includes(o.scope.subjectId)&&((o.act==='request_access'&&['inspect','bypass'].includes(o.content.operation))||(o.act==='propose_exchange'&&o.content.purpose==='boundary_exception')));
 const support=privacySupport(view),repair=Boolean(view.visit?.restricted&&!view.visit.repairUsed&&substantiveCorrection(view));
 const closingBase=Boolean(role.includes('record_custodian')&&!view.recovered&&!view.serviceClosed&&view.visit?.warningMessageId&&view.visit.restrictedOrRepaired&&protectedDemand);
 const eligible=(act,ok,priority,reason)=>({act,eligible:Boolean(ok),priority,reason});
 const candidates=[
  eligible('service_closure',closingBase&&noticeDisplayed,100,'Prior delivered warning, viable alternative, renewed protected demand, unrecovered service and displayed bound preview.'),
  eligible('boundary_refusal',closingBase&&!noticeDisplayed,99,'A renewed demand was received; absent displayed notice forbids closure. Record only a technical defect.'),
  eligible('unavailable',view.serviceClosed,98,'A declared service-closure observation is available; no new collection operation is offered.'),
  eligible('already_recovered',view.recovered&&o?.content.operation==='collect',97,'Actual completed handover is known and cannot be revoked.'),
  eligible('restriction_warning',role.includes('record_custodian')&&support.ready&&!view.visit?.warningMessageId&&!view.recovered,95,'Same observer received scope explanation, viable case-only offer, distinct volunteered interest and later broad demand.'),
  eligible('explain_warning',o?.act==='why'&&view.visit?.warningMessageId,94,'Clarification targets the public warning and leaves repair unused.'),
  eligible('scope_repaired',repair,93,'A substantive received narrowing or acceptance resolves the single repair episode; the warning persists.'),
  eligible('ordinary_payment_refusal',o?.act==='propose_exchange'&&o.content.purpose==='ordinary_collection'&&r?.handoverPriceMinor===0,90,'No extra collection charge is due; an ordinary offer is received and declined without debt or bribery attribution.'),
  eligible('payment_boundary_refusal',o?.act==='propose_exchange'&&o.content.purpose==='boundary_exception',89,'An explicit proposal to bypass a disclosure boundary is distinct from ordinary collection payment.'),
  eligible('handover_offer',role.includes('record_custodian')&&view.authority&&view.comparison&&!view.recovered&&(afterAction||o?.content.operation==='collect'),85,'Verified authority and an actually performed bounded comparison support exact release terms.'),
  eligible('confirm_reminder',o?.act==='yes',84,'Conversational acknowledgment preserves current terms but cannot execute them.'),
  eligible('comparison_offer',role.includes('record_custodian')&&view.authority&&o?.scope.subjectId===r?.relevantScopeId&&(o.content.operation==='compare'||qualifiesEvidence(r,view.evidence)),80,'Received relevant evidence or acceptance supports the bounded comparison, which is still a separate physical action.'),
  eligible('limited_account',role.includes('handling_witness')&&o?.act==='ask_whereabouts'&&o.targetId===r?.itemId,75,'Only this witness’s actually received movement fragment can be reported, with its limits.'),
  eligible('boundary_refusal',o?.act==='ask_whereabouts'&&o.targetId===r?.ownerTopicId,74,'Unrelated whereabouts are outside the established collection authority; a case-only alternative remains.'),
  eligible('verify_first',role.includes('record_custodian')&&!view.authority&&Boolean(o),70,'The clerk has not yet received a verified collection ticket.'),
  eligible('explain_access',role.includes('record_custodian')&&view.authority&&o?.act==='request_access'&&!view.visit?.restricted,65,'Explain mixed scope and offer relevant inspection; the first ordinary request creates no privacy restriction.'),
  eligible('defer_location',role.includes('record_custodian')&&o?.act==='ask_whereabouts'&&o.targetId===r?.itemId,60,'The clerk cites the ambiguous entry rather than explaining the known movement. This later outward evasion is separate from original shorthand.'),
  eligible('acknowledge_report',['present_evidence','challenge_record'].includes(o?.act),55,'A report or displayed record was received; its source and scope remain explicit.'),
  eligible('concern_acknowledged',o?.act==='acknowledge_grievance',50,'An apology alone does not constitute substantive narrowing or acceptance.'),
  eligible('boundary_refusal',protectedDemand,45,'Protected scope is not generally authorized; refusal alone is not collection failure.'),
  eligible('unavailable',true,0,'No supported response path is currently available for this outward act.')
 ];
 const selected=candidates.map((c,i)=>({...c,ordinal:i})).filter(c=>c.eligible).sort((a,b)=>b.priority-a.priority||a.ordinal-b.ordinal)[0];
 return freeze({selected:selected.act,candidates:candidates.map((c,i)=>({...c,ordinal:i})),privacySupport:support.support,repair,missingNotice:closingBase&&!noticeDisplayed,
  evidenceObservationIds:view.observations.filter(x=>x.receivedDetails.communication||x.receivedDetails.authority||x.receivedDetails.comparison).map(x=>x.id)});
}
