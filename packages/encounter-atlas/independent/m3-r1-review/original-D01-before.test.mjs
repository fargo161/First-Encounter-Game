// Run the original independent assertion unchanged against the preserved failed source.
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url));
process.env.M3_CHECKPOINT=path.join(home,'failed-checkpoint');
await import(pathToFileURL(path.join(home,'checkpoint/independent/m3-review/notice-display-defect.test.mjs')));
