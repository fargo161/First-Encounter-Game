import { copy, freeze } from './contracts.mjs';

/** Deliberately has no package, canonical message, world store or callback input. */
export function selectResponse(view) {
  const ruleObservation=view.observations.find(o=>o.receivedDetails.accessRule);
  const authorityObservation=view.observations.find(o=>o.receivedDetails.collectionAuthority?.collectorId===view.incoming.senderId);
  const rule=ruleObservation?.receivedDetails.accessRule;
  const authority=authorityObservation?.receivedDetails.collectionAuthority;
  const role=view.profile.roles.includes('record_custodian');
  const relevant=Boolean(rule && view.incoming.targetId===rule.recordId && view.incoming.scope.kind==='relevant_records');
  const authorized=Boolean(authority && authority.verified && authority.itemId===rule?.itemId);
  const heardClaim=view.claims.find(c=>c.messageId===view.currentMessageId && c.proposition.subjectId===rule?.recordId && c.proposition.predicate==='recipient_signature');
  const bounded=view.incoming.framing.some(c=>c.kind==='scope_limit');
  const candidates=[
    {act:'explain_access',eligible:role && relevant && authorized && view.incoming.act==='request_access',score:view.profile.priorities.relevantService+view.profile.priorities.privacy+(bounded?1:0),ordinal:0,
      reason:'A received relevant-record request, a known access rule and verified collection authority permit limited inspection.'},
    {act:'acknowledge_report',eligible:role && relevant && authorized && view.incoming.act==='challenge_record' && Boolean(heardClaim),score:view.profile.priorities.verification+view.profile.priorities.relevantService,ordinal:1,
      reason:'A matching assertion was actually heard. Acknowledge it as a report and offer verification; do not treat seeing conduct as reading the record.'},
    {act:'decline_scope',eligible:true,score:0,ordinal:2,reason:'A bounded public refusal is available when relevant scope or authority is insufficient.'}
  ];
  const winner=candidates.filter(c=>c.eligible).sort((a,b)=>b.score-a.score || a.ordinal-b.ordinal)[0];
  return freeze({selected:winner.act,candidates,evidenceObservationIds:[ruleObservation?.id,authorityObservation?.id,...(heardClaim?.observationIds || [])].filter(Boolean),
    rule:rule?copy(rule):null,reportedValue:heardClaim?.proposition.value ?? null,
    intakeDescription:view.incoming.framing.some(c=>c.kind==='possible_consequence')?
      'Sets both hands beside the record, squares the file on the counter, and meets the collector’s gaze with a steady expression.':
      'Looks from the verified ticket to the record, brings the file within reach, and holds a composed expression.'});
}
