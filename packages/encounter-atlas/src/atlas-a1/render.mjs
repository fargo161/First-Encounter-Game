export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const e=escapeHTML,json=v=>e(JSON.stringify(v,null,2));
function technical(value,label='Encounter details'){
 return `<details class="technical"><summary>${e(label)}</summary><p class="detail-label">Exact underlying Encounter record</p><pre>${json(value)}</pre></details>`;
}
function fragments(record){
 const d=record.receivedDetails??{},lines=[];
 for(const evidence of d.evidence??[])lines.push(evidence.label);
 if(d.communication)lines.push(d.communication.content.text);
 if(d.ownCommunication)lines.push(d.ownCommunication.content.text);
 if(d.conduct)lines.push(d.conduct);
 if(d.accountInterpretation)lines.push(d.accountInterpretation);
 return lines.length?`<ul class="fragments">${[...new Set(lines)].map(x=>`<li>${e(x)}</li>`).join('')}</ul>`:'<p class="muted">Received context; exact fields are available below.</p>';
}
function path(p){
 return `<div class="source-path"><strong>${e(p.title)}</strong><span>${e(p.period)}</span><p class="muted">${e(p.access)}</p>${p.receivedFragments.map(f=>fragments(f)).join('')}${technical({citation:p.citation,receivedFragments:p.receivedFragments})}${p.fullDeveloperRecord?technical(p.fullDeveloperRecord,'Full developer source · Encounter details'):''}</div>`;
}
function source(s){
 return `<details class="source"><summary>Source <span>How this information arrived</span></summary><div class="source-body">${s.immediate.length?'<h4>Immediate source</h4>'+s.immediate.map(path).join(''):''}${s.support.length?'<h4>Based on received information</h4>'+s.support.map(x=>`<div class="support"><strong>${e(x.arrival)}</strong>${fragments(x.record)}${path(x.path)}</div>`).join(''):''}${s.correction.length?'<h4>Addressed by</h4>'+s.correction.map(x=>`<div class="support"><strong>${e(x.arrival)}</strong>${fragments(x.record)}${path(x.path)}</div>`).join(''):''}${s.earlier.length?'<h4>Earlier source</h4>'+s.earlier.map(path).join(''):''}<p class="source-note">${e(s.note)}</p>${technical(s.technicalRecord)}</div></details>`;
}
export function renderPeople(people,selected){
 return people.map((p,i)=>`<button class="person-button ${p.id===selected?'selected':''}" data-person="${e(p.id)}" aria-pressed="${p.id===selected}"><span class="avatar" aria-hidden="true">${e(p.name.slice(0,1))}</span><span><strong>${e(p.name)}</strong><small>${e(p.kindLabel)}</small>${p.sharedName?`<small class="shared-name">Shared name · ${e(p.id)}</small>`:''}</span><span class="person-arrow" aria-hidden="true">›</span></button>`).join('');
}
function assertion(r){return `<article class="assertion" data-record="${e(r.key)}"><span class="basis ${r.basis==='Report'||r.basis==='Report shared'?'report':''}">${e(r.basis)}</span><p class="assertion-text">${e(r.text)}</p>${r.note?`<p class="qualification">${e(r.note)}</p>`:''}${source(r.source)}</article>`;}
function informationSection(s){
 const primary=s.rows.filter(r=>!r.secondary),secondary=s.rows.filter(r=>r.secondary);
 return `<section class="information-section" data-section="${e(s.id)}"><div class="section-heading"><h2>${e(s.title)}</h2><span>${s.rows.length} ${s.rows.length===1?'record':'records'}</span></div>${['received','reports','shared'].includes(s.id)?'<p class="qualification">The same information may be received more than once. Repeated entries do not mean independent sources.</p>':''}${primary.map(assertion).join('')}${secondary.length?`<details class="additional-information"><summary>Other received context and communications <span>${secondary.length} records</span></summary>${secondary.map(assertion).join('')}</details>`:''}</section>`;
}
export function renderPerson(p){
 return `<header class="person-heading"><div><p class="eyebrow">Person inspection</p><h1>${e(p.name)}</h1><p>${e(p.kindLabel)}</p></div><span class="read-badge">Read-only</span></header><section class="identity-card"><h2>Identity</h2><p class="state-status">${e(p.status)}</p>${p.sharedName?`<p class="shared-name">This name is shared. Selected identity: ${e(p.id)}</p>`:''}${p.identityNote?`<p class="muted">${e(p.identityNote)}</p>`:''}${technical(p.technical)}</section>${p.sections.map(informationSection).join('')}`;
}
export function renderFailure(problem){return `<section class="failure" role="alert"><p class="eyebrow">Input not accepted</p><h1>Unable to open this saved run</h1><p>${e(problem.text)}</p><p>Choose a supported saved run and its matching catalog, or open a bundled example.</p>${technical({validationCode:problem.code})}</section>`;}
