import { canonicalJson, copy, freeze, fields, id, ids, integer, isRecord, requireThat, text, BASED_CATALOG } from './contracts.mjs';

export async function sha256(value) {
  const bytes = new TextEncoder().encode(canonicalJson(value));
  return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
}
export function validatePackage(pkg) {
  canonicalJson(pkg);
  fields(pkg, ['schema','id','revision','title','contentRevision','actors','subjects','bindings','initial','communication','presentation']);
  requireThat(pkg.schema === 'encounter-package@2', 'UNSUPPORTED_PACKAGE'); id(pkg.id,'package'); integer(pkg.revision); text(pkg.title,120); text(pkg.contentRevision,100);
  requireThat(Array.isArray(pkg.actors) && Array.isArray(pkg.subjects));
  ids(pkg.actors.map(a=>a.id),'actor'); ids(pkg.subjects.map(s=>s.id),'subject');
  for (const a of pkg.actors) {
    fields(a,['id','label','kind','profile']); text(a.label,120); requireThat(['human','npc','absent'].includes(a.kind));
    if (a.kind==='npc') {
      fields(a.profile,['roles','priorities']); requireThat(Array.isArray(a.profile.roles)); a.profile.roles.forEach(x=>text(x,100));
      fields(a.profile.priorities,['relevantService','privacy','verification']); Object.values(a.profile.priorities).forEach(x=>{integer(x); requireThat(x<=100);});
    } else requireThat(a.profile===null);
  }
  for (const s of pkg.subjects) { fields(s,['id','label']); text(s.label,120); }
  const b=pkg.bindings;
  fields(b,['humanId','serviceId','ownerId','itemId','ticketId','recordId','fileId','handlingId','contactId','holderId']);
  for (const key of ['humanId','serviceId','ownerId']) requireThat(pkg.actors.some(a=>a.id===b[key]));
  for (const key of ['itemId','ticketId','recordId','fileId','handlingId','contactId','holderId']) requireThat(pkg.subjects.some(s=>s.id===b[key]));
  requireThat(new Set(Object.values(b)).size===Object.keys(b).length);
  requireThat(pkg.actors.find(a=>a.id===b.humanId).kind==='human' && pkg.actors.find(a=>a.id===b.serviceId).kind==='npc' && pkg.actors.find(a=>a.id===b.ownerId).kind==='absent');
  fields(pkg.initial,['entry','signature','protectedContact','balanceMinor','minorUnitsPerCoin','softAllowance']);
  text(pkg.initial.entry,100); requireThat(['unfilled','filled'].includes(pkg.initial.signature)); text(pkg.initial.protectedContact,400);
  integer(pkg.initial.balanceMinor); integer(pkg.initial.minorUnitsPerCoin); requireThat(pkg.initial.minorUnitsPerCoin>0); integer(pkg.initial.softAllowance); requireThat(pkg.initial.softAllowance>0);
  fields(pkg.communication,['expressions']); requireThat(Array.isArray(pkg.communication.expressions) && pkg.communication.expressions.length>0);
  requireThat(new Set(pkg.communication.expressions.map(x=>x.vibe)).size===pkg.communication.expressions.length);
  for (const e of pkg.communication.expressions) {
    fields(e,['vibe','templateId','cues']); requireThat(Object.hasOwn(BASED_CATALOG,e.vibe)); id(e.templateId,'template'); requireThat(Array.isArray(e.cues) && e.cues.length>0 && e.cues.length<=8);
    for (const cue of e.cues) { fields(cue,['kind','text']); requireThat(['scope_limit','displayed_concern','direct_demand','possible_consequence'].includes(cue.kind)); text(cue.text); }
  }
  fields(pkg.presentation,['intake','delivery','art']);
  for (const key of ['intake','delivery','art']) requireThat(pkg.presentation[key]===null || typeof pkg.presentation[key]==='string');
  return true;
}
export async function sealPackage(authored) {
  const content=copy(authored); validatePackage(content);
  return freeze({content,ref:{id:content.id,revision:content.revision,digest:await sha256(content)}});
}
export async function verifyPackage(sealed) {
  fields(sealed,['content','ref']); const checked=await sealPackage(sealed.content);
  requireThat(canonicalJson(checked.ref)===canonicalJson(sealed.ref),'PACKAGE_MISMATCH'); return checked;
}
