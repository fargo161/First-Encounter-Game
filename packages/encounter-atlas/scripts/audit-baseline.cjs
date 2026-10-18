/* Fresh, limited M0 checks; not the missing historical test suite. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const file = path.join(__dirname, '../reference/Encounter_Core.html');
const bytes = fs.readFileSync(file);
const html = bytes.toString('utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script, { filename: 'legacy-complete-script.js' });
const boundary = script.indexOf('/* Offline browser workspace.');
assert.ok(boundary > 0);
const context = vm.createContext({});
new vm.Script(script.slice(0, boundary)).runInContext(context);
const C = context.EncounterCore;
const plain = value => JSON.parse(JSON.stringify(value));
let passed = 0;
function check(name, run) { run(); passed++; console.log(`PASS ${name}`); }
const delivery = { vibeId: 'EA', intensity: 'NUANCED' };
check('catalog: twenty distinct ordered pairs and three settings', () => {
  assert.equal(C.Based.BASED_VIBES.length, 20);
  assert.equal(new Set(C.Based.BASED_VIBES.map(v => v.vibeId)).size, 20);
  assert.ok(C.Based.BASED_VIBES.every(v => v.primaryCue !== v.secondaryCue));
  assert.equal(C.Based.DELIVERY_INTENSITIES.length, 3);
});
check('sample world and new session validate', () => {
  assert.equal(C.validateWorld(C.sampleWorld()), true);
  assert.equal(C.validateSession(C.createSession(C.sampleWorld())), true);
});
check('preview leaves baseline state byte-equivalent', () => {
  const state = C.createSession(C.sampleWorld()), before = JSON.stringify(state);
  C.preview(state, { action: 'ASK', topicId: 'sample_topic', delivery, expectedRevision: 0 });
  assert.equal(JSON.stringify(state), before);
});
check('spoken claim reaches legacy NPC as hearsay', () => {
  const state = C.createSession(C.sampleWorld());
  const next = C.send(state, { action: 'TELL', topicId: 'sample_topic', informationId: 'player_information', delivery, expectedRevision: 0 });
  assert.equal(next.world.information.find(i => i.id === 'player_information').npcEvidence, 'HEARSAY');
  assert.equal(state.world.information.find(i => i.id === 'player_information').npcKnown, false);
});
check('proposal transfers nothing; exact confirmation transfers once; stale retry fails', () => {
  const state = C.createSession(C.sampleWorld());
  const terms = { give: { money: 1000, goods: [], information: [] }, receive: { money: 0, goods: [{ id: 'sample_item', quantity: 1 }], information: [] } };
  const proposal = C.send(state, { action: 'TRADE', delivery, terms, expectedRevision: 0 });
  assert.deepEqual(plain(proposal.world.actors), plain(state.world.actors));
  assert.deepEqual(plain(proposal.world.goods), plain(state.world.goods));
  assert.ok(proposal.pending);
  const result = C.acceptOffer(proposal, proposal.pending.id, proposal.revision);
  assert.equal(result.world.actors.player.money, state.world.actors.player.money - 1000);
  assert.equal(result.world.goods[0].playerQty, state.world.goods[0].playerQty + 1);
  assert.throws(() => C.acceptOffer(result, proposal.pending.id, proposal.revision));
});
check('new stale send is rejected without mutating its input', () => {
  const state = C.createSession(C.sampleWorld()), before = JSON.stringify(state);
  assert.throws(() => C.send(state, { action: 'ASK', topicId: 'sample_topic', delivery, expectedRevision: 9 }));
  assert.equal(JSON.stringify(state), before);
});
check('legacy public view demonstrably includes all topics and NPC good quantities', () => {
  const state = C.createSession(C.sampleWorld()), view = C.publicView(state);
  assert.deepEqual(plain(view.topics), plain(state.world.topics));
  assert.equal(view.goods[0].npcQty, 5);
});
console.log(JSON.stringify({ milestone: 'M0', baselineSHA256: crypto.createHash('sha256').update(bytes).digest('hex'), checksPassed: passed, checksFailed: 0, browserExecuted: false, historicalSuiteRecovered: false }, null, 2));
