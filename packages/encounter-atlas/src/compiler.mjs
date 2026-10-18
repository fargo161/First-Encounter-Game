import { ACT_FAMILIES, SALIENCE, copy, freeze, fields, requireThat, validateMessage } from './contracts.mjs';

/** Receives only authored communication definitions and the player's received view. */
export function compileMessage(definitions, player, draft, identity) {
  fields(draft,['act','vibe','salience']);
  requireThat(['request_access','challenge_record'].includes(draft.act),'UNSUPPORTED_ACT');
  requireThat(SALIENCE.includes(draft.salience),'INVALID_DRAFT');
  const expression=definitions.expressions.find(e=>e.vibe===draft.vibe);
  requireThat(Boolean(expression),'UNAVAILABLE_EXPRESSION');
  const record=player.record;
  requireThat(Boolean(record),'INVALID_DRAFT');
  if (draft.act==='challenge_record') requireThat(Boolean(player.inspectedDetail),'INSPECTION_REQUIRED');
  const isChallenge=draft.act==='challenge_record';
  const outward={family:ACT_FAMILIES[draft.act],act:draft.act,senderId:player.actorId,recipientIds:[player.partnerId],
    subjectIds:[player.item.id,record.id],targetId:record.id,scope:{subjectId:record.id,kind:'relevant_records'},
    content:isChallenge ? {kind:'assertion',predicate:player.inspectedDetail.predicate,value:player.inspectedDetail.value,timeScope:'current_entry'} :
      {kind:'request',predicate:'inspect_relevant_entry',value:null,timeScope:'current_entry'},
    framing:expression.cues.map(c=>({...copy(c),subjectIds:[record.id]})),
    prominence:{SUBTLE:'understated',NUANCED:'measured',OVERT:'emphatic'}[draft.salience],terms:null};
  const message={schema:'encounter-message@2',...identity,privateComposition:{selectedVibe:draft.vibe,selectedSalience:draft.salience,authorId:'author_0001',templateId:expression.templateId,intendedFraming:expression.cues.map(c=>c.text).join(' ')},outward};
  validateMessage(message); return freeze(message);
}

export function describeOutward(outward) {
  let primary;
  if (outward.act==='request_access') primary='Requests the case paperwork and permission to inspect the relevant collection entry.';
  else if (outward.act==='challenge_record') primary=`Reports the inspected recipient-signature field as ${outward.content.value}; challenges whether the collected entry establishes a completed handover.`;
  else if (outward.act==='explain_access') primary='Explains that the customer file contains case-handling records and unrelated private contact details. Offers inspection of the handling extract only; private contact details remain unavailable.';
  else if (outward.act==='acknowledge_report') primary=`Acknowledges your report that the recipient-signature field is ${outward.content.value}. Offers a supervised comparison with the verified ticket as the next verification step. The report is not yet an independently verified finding by the clerk.`;
  else primary='Declines the requested scope under the current verified authority. No information or material resource is transferred.';
  return [primary,...outward.framing.map(c=>c.text),`Social framing is ${outward.prominence}.`].join('\n');
}
