import fs from 'node:fs/promises';
import { sealPackage } from '../src/package.mjs';
import { startEncounter, prepareSend, prepareInspection, dispatch } from '../src/encounter.mjs';
export const authored=JSON.parse(await fs.readFile(new URL('../content/last-collection.json',import.meta.url),'utf8'));
export const sealed=await sealPackage(authored);
export const draft=(vibe='EA',salience='NUANCED',act='request_access')=>({act,vibe,salience});
export function commit(run,pkg,command) {
  const result=dispatch(run,pkg,command); if (result.status!=='committed') throw Error(`Commit failed: ${result.code}`); return result.run;
}
export async function path(pkg=sealed,vibe='EA') {
  let run=await startEncounter(pkg); const commands=[];
  commands.push(prepareSend(run,pkg,draft(vibe))); run=commit(run,pkg,commands.at(-1));
  commands.push(prepareInspection(run,pkg)); run=commit(run,pkg,commands.at(-1));
  commands.push(prepareSend(run,pkg,draft(vibe,'NUANCED','challenge_record'))); run=commit(run,pkg,commands.at(-1));
  return {run,commands};
}
