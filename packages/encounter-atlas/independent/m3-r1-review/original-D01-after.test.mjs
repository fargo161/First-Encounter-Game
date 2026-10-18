// Original independent assertion, unchanged, pointed at the exact verified R1 source.
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const home=path.dirname(fileURLToPath(import.meta.url));
process.env.M3_CHECKPOINT=path.join(home,'checkpoint');
await import(pathToFileURL(path.join(home,'checkpoint/independent/m3-review/notice-display-defect.test.mjs')));
