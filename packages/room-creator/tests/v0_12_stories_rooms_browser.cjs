// v0.12 browser: new stories get a room, light pools on upper stories, Make room, deletes, partitions, open-ceiling walls.
// Run: node tests/v0_12_stories_rooms_browser.cjs   (env ROOM_CREATOR_HTML / CHROMIUM optional)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'), html = process.env.ROOM_CREATOR_HTML || path.join(root, 'Room_Creator.html');
const results = [];
const check = (name, ok, detail) => { results.push({ name, passed: !!ok, detail: ok ? undefined : detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || detail === undefined ? '' : ' :: ' + JSON.stringify(detail))); };

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
  await page.goto('file://' + html); await page.waitForFunction('window.RCApp');
  const E = (f, a) => page.evaluate(f, a);
  const settle = () => E(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const click = async (x, y, s) => { const p = await E(({ x, y, s }) => RCApp.projectPoint({ x, y }, s), { x, y, s }); await page.mouse.click(p.x, p.y); await settle(); };
  const toast = async () => { const t = await page.locator('#toast').evaluate(el => el.classList.contains('hidden') ? '' : el.textContent); await E(() => document.getElementById('toast').classList.add('hidden')); return t; };
  const fresh = async (fn) => { await E(async src => { const C = RCApp.core, p = C.newProject(); if (src) new Function('C', 'p', src)(C, p); await RCApp.applyBundle({ project: p, assets: [] }); }, fn ? `(${fn})(C,p)` : null); await settle(); };
  const addStory = async (mode, source) => { await page.locator('[data-action="add-story"]').first().click(); await settle(); if (mode) await page.locator(`input[name=newStoryMode][value=${mode}]`).check(); if (source) await page.locator('#newStorySource').selectOption(source); await page.locator('#storyAddConfirm').click(); await settle(); };

  // 1. Default: + Next story creates a matching room and selects it.
  await fresh();
  await addStory();
  let st = await E(() => ({ s: RCApp.state, rooms: RCApp.project.rooms.map(r => [r.story, r.x, r.y, r.width, r.length]), sel: RCApp.state.selection }));
  check('+ Next story creates Floor 2 with a room matching the room below', st.s.activeStory === 1 && st.rooms.length === 2 && JSON.stringify(st.rooms[1].slice(1)) === JSON.stringify(st.rooms[0].slice(1)) && st.rooms[1][0] === 1, st.rooms);
  check('The new room is selected and its Room panel shows', st.sel?.kind === 'room' && (await page.locator('#roomWidth').count()) === 1, st.sel);

  // 2. Light pool on Floor 2 through the real tool (the reported problem).
  await E(() => RCApp.setTool('light')); await settle(); await click(3, 3, 1);
  let l = await E(() => { const l = RCApp.project.lights.at(-1); return l && { story: RCApp.core.roomById(RCApp.project, l.roomId).story }; });
  check('Light pool can be placed on Floor 2', l?.story === 1, { light: l, toast: await toast() });

  // 3. Partitions, doors, ceiling cut on Floor 2 at the same X/Y as Ground ones.
  await E(() => { const C = RCApp.core; RCApp.mutate(() => C.createPartition(RCApp.project, RCApp.project.rooms[0].id, { x: 2, y: 3 }, { x: 2, y: 5.5 }), 'g'); RCApp.selectStory(1); RCApp.selectRoom(RCApp.project.rooms.find(r => r.story === 1).id); });
  await E(() => RCApp.setTool('partition')); await settle(); await click(2, 3, 1); await click(2, 5.5, 1);
  check('Floor 2 partition can share X/Y with a Ground partition', await E(() => RCApp.project.partitions.filter(q => q.story === 1).length === 1), await toast());
  await E(() => RCApp.setTool('ceilingcut')); await settle(); await click(5, 1, 1); await click(7, 3, 1);
  const ct = await toast();
  check('Ceiling cut reports "Ceiling opening added."', ct.includes('Ceiling opening added') && (await E(() => RCApp.project.ceilingCuts.length)) === 1, ct);

  // 4. Delete the Floor 2 room although it hosts a ceiling cut; a free wall on Floor 2 survives.
  await E(() => RCApp.mutate(() => RCApp.core.createFreeWall(RCApp.project, 1, { x: 1, y: 0.5 }, { x: 4, y: 0.5 }), 'fw'));
  await E(() => RCApp.selectRoom(RCApp.project.rooms.find(r => r.story === 1).id)); await settle();
  await page.locator('[data-action="delete-room"]').first().click(); await settle(); await page.locator('#confirmYes').click(); await settle();
  st = await E(() => ({ rooms: RCApp.project.rooms.filter(r => r.story === 1).length, cuts: RCApp.project.ceilingCuts.length, free: RCApp.project.partitions.filter(q => q.free).length }));
  check('Room hosting a ceiling cut can be deleted', st.rooms === 0 && st.cuts === 0, { ...st, toast: await toast() });
  check('Free walls survive deleting their style-host room', st.free === 1, st);

  // 5. Floor-only story: light tool explains Make room; Make room converts floor space; lights then work.
  await E(() => RCApp.selectStory(1)); await settle();
  await E(() => RCApp.setTool('light')); await settle();
  const msg = await toast();
  check('Room-only tools on a story without a room point to Make room', /Make room/.test(msg), msg);
  await E(() => RCApp.setTool('floorsection')); await settle(); await click(0, 0, 1); await click(6, 4, 1);
  await page.locator('[data-action="floor-make-room"]').click(); await settle();
  st = await E(() => ({ room: RCApp.project.rooms.find(r => r.story === 1), sel: RCApp.state.selection, fs: RCApp.project.floorSections.filter(f => f.story === 1).length }));
  check('Make room turns floor space into an enclosed room on its story', st.room && st.room.width === 6 && st.room.length === 4 && st.fs === 0 && st.sel?.kind === 'room', st);
  await E(() => RCApp.setTool('light')); await settle(); await click(3, 2, 1);
  check('Light pool works after Make room', await E(() => RCApp.project.lights.some(l => RCApp.core.roomById(RCApp.project, l.roomId)?.story === 1)), await toast());

  // 6. Empty option still available.
  await fresh(); await addStory('empty');
  st = await E(() => ({ s: RCApp.state, rooms: RCApp.project.rooms.length }));
  check('"Empty story" option keeps the floor-drawing workflow', st.rooms === 1 && st.s.activeStory === 1 && st.s.tool === 'floorsection', st);

  // 7. Two rooms below → "All rooms below" by default, or one chosen room.
  await fresh(`(C,p)=>{C.addAdjoining(p,p.rooms[0].id,'E',4,4,0,'passage');}`);
  await E(() => RCApp.selectStory(0)); await E(() => RCApp.selectRoom(null)); await addStory();
  check('With several rooms below, all are matched by default', await E(() => RCApp.project.rooms.filter(r => r.story === 1).length === 2));
  await E(() => RCApp.undo()); await settle();
  const east = await E(() => RCApp.project.rooms[1].id); await addStory(null, east);
  check('A single source room can be chosen', await E(e => { const r = RCApp.project.rooms.filter(r => r.story === 1); return r.length === 1 && r[0].x === RCApp.core.roomById(RCApp.project, e).x; }, east));

  // 8. Deleting a story with contents is confirmed, then undoable.
  await E(() => RCApp.selectStory(1)); await settle();
  await page.locator('[data-action="delete-story"]').first().click(); await settle();
  const ask = await page.locator('#modalRoot').innerText();
  await page.locator('#confirmYes').click(); await settle();
  check('Deleting a story lists its contents and removes it', /1 room/.test(ask) && (await E(() => RCApp.project.stories.length)) === 1, ask);
  await E(() => RCApp.undo()); await settle();
  check('Undo restores the deleted story and its room', await E(() => RCApp.project.stories.length === 2 && RCApp.project.rooms.some(r => r.story === 1)));

  // 9. Open ceiling under an upper room: no empty band between the wall top and the floor above.
  const band = await E(() => {
    const C = RCApp.core, p = C.newProject(); C.addStoryWithRooms(p, {}); p.rooms[0].openAbove = true;
    const v = C.createViewpoint(p, { x: 4, y: 4 }, { x: 4, y: 1 }, 'v', p.rooms[0].id), r = RCApp.renderer.drawFP(p, v);
    let none = 0, n = 0; for (let y = 0; y < r.H * 0.42; y += 4) for (let x = 0; x < r.W; x += 8) { n++; if (!r.pick[y * r.W + x]) none++; }
    const top = C.newProject(); top.rooms[0].openAbove = true; const tw = C.roomWalls(top)[0];
    return { none, n, topSlab: RCApp.renderer.slabTop(top, tw), cap: C.wallCap(top, tw) };
  });
  check('Open ceiling under a room shows wall up to the slab, not empty space', band.none === 0, band);
  check('Top-story walls are not extended where nothing is above', band.topSlab === band.cap, band);

  check('No page errors', errors.length === 0, errors);
  const failed = results.filter(r => !r.passed).length;
  console.log(`${results.length - failed} passed, ${failed} failed`);
  fs.writeFileSync(path.join(__dirname, 'v0_12_stories_rooms_browser_results.json'), JSON.stringify({ passed: results.length - failed, failed, results }, null, 2));
  await browser.close(); process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
