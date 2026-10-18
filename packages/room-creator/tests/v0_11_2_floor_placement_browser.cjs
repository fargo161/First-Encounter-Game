// v0.11.2 — viewpoints and props on a floor-space-only upper story (no enclosed room).
// Replays the reported workflow through the real UI. Run: node tests/v0_11_2_floor_placement_browser.cjs
// Optional env: ROOM_CREATOR_HTML (page path), CHROMIUM (browser executable).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const html = process.env.ROOM_CREATOR_HTML || path.join(root, 'Room_Creator.html');
const results = [];
const check = (name, ok, detail) => { results.push({ name, passed: !!ok, detail: ok ? undefined : detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || detail === undefined ? '' : ' :: ' + JSON.stringify(detail))); };

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => d.accept());
  await page.goto('file://' + html); await page.waitForFunction('window.RCApp');
  const E = (f, a) => page.evaluate(f, a);
  const settle = () => E(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const at = (x, y, story = 1) => E(({ x, y, story }) => RCApp.projectPoint({ x, y }, story), { x, y, story });
  const click = async (x, y, story = 1) => { const p = await at(x, y, story); await page.mouse.click(p.x, p.y); await settle(); };
  const toast = () => page.locator('#toast').innerText().catch(() => '');

  // Fresh project with a 1x1 PNG in the image library.
  await E(async () => {
    const c = document.createElement('canvas'); c.width = c.height = 4; const g = c.getContext('2d'); g.fillStyle = '#c33'; g.fillRect(0, 0, 4, 4);
    await RCApp.applyBundle({ project: RCApp.core.newProject(), assets: [{ id: 'asset_crate', name: 'Crate', src: c.toDataURL('image/png'), width: 4, height: 4 }] });
  });
  const ground = await E(() => { const r = RCApp.project.rooms[0]; return { x: r.x, y: r.y, w: r.width, l: r.length }; });

  // Add Floor 2 and draw floor space on it, as in the recording.
  await page.locator('[data-action="add-story"]').click(); await page.locator('input[name=newStoryMode][value=empty]').check();await page.locator('#storyAddConfirm').click(); await settle();
  await click(ground.x + 1, ground.y + 1); await click(ground.x + 7, ground.y + 5);
  check('Floor 2 has floor space and no enclosed room', await E(() => RCApp.project.floorSections.some(f => f.story === 1) && !RCApp.project.rooms.some(r => r.story === 1)));

  // + View on the floor section.
  await E(() => RCApp.setTool('view')); await settle();
  await click(ground.x + 3, ground.y + 3); await click(ground.x + 3, ground.y + 1.5);
  const view = await E(() => RCApp.project.viewpoints.find(v => v.story === 1) || null);
  check('Viewpoint can be placed on Floor 2 floor space', !!view, await toast());
  check('Floor-space viewpoint is on Floor 2 at its elevation', view && view.story === 1 && view.roomId === null && Math.abs(view.floorZ - 3.2) < 1e-6, view);
  check('Placing a viewpoint off the floor space is still refused', await (async () => {
    await E(() => RCApp.setTool('view')); await settle(); const n = await E(() => RCApp.project.viewpoints.length);
    await click(ground.x + 7.6, ground.y + 5.6); // outside the drawn rectangle
    const ok = (await E(() => RCApp.project.viewpoints.length)) === n && (await E(() => RCApp.state.pending)) === null;
    await page.keyboard.press('Escape'); return ok;
  })());

  // Prop placed on the floor section through the isometric view.
  await E(() => RCApp.setTool('select')); await settle();
  await E(() => RCApp.selectStory(1)); await settle();
  const p = await at(ground.x + 5, ground.y + 4);
  await page.locator('#stageWrap canvas, #stage').first().dispatchEvent('drop', { clientX: p.x, clientY: p.y, dataTransfer: await page.evaluateHandle(() => { const d = new DataTransfer(); d.setData('application/x-room-asset', 'asset_crate'); return d; }) });
  await settle();
  const obj = await E(() => RCApp.project.objects.find(o => o.story === 1) || null);
  check('Prop can be placed on Floor 2 floor space', !!obj, await toast());
  check('Floor-space prop sits at Floor 2 elevation', obj && obj.roomId === null && Math.abs(obj.floorZ - 3.2) < 1e-6, obj);

  // Prop drag stays on the floor space.
  if (obj) {
    await E(id => RCApp.selectObject(id), obj.id); await settle();
    const a = await at(obj.x, obj.y), b = await at(obj.x - 1, obj.y);
    // The object handle is its footprint in iso; drag from its floor point.
    await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(b.x, b.y, { steps: 6 }); await page.mouse.up(); await settle();
    const moved = await E(id => RCApp.project.objects.find(o => o.id === id), obj.id);
    check('Floor-space prop stays on Floor 2 after editing', moved.story === 1 && moved.roomId === null);
  }

  // Cover + partner on a floor-space viewpoint.
  const pair = await E(id => {
    const C = RCApp.core; let ok = RCApp.mutate(() => { C.createPillar(RCApp.project, 1, { x: RCApp.project.viewpoints.find(v => v.id === id).x, y: RCApp.project.viewpoints.find(v => v.id === id).y - 0.8 }); }, 'pillar');
    const pil = RCApp.project.pillars.at(-1);
    ok = ok && RCApp.mutate(() => C.assignCover(RCApp.project, id, { kind: 'pillar', id: pil.id }, 'edge'), 'cover');
    ok = ok && RCApp.mutate(() => C.createPartner(RCApp.project, id, { sideOffset: 0.8 }), 'partner');
    const pr = RCApp.project.pairs[0], ev = pr && RCApp.project.viewpoints.find(v => v.id === pr.exposedViewId);
    return { ok, ev: ev && { story: ev.story, roomId: ev.roomId } };
  }, view?.id);
  check('Floor-space viewpoint can take a cover pair', pair.ok && pair.ev && pair.ev.story === 1, pair);

  // First-person render from the floor-space viewpoint shows Floor 2 floor space.
  // (default lens: nearest visible floor is ~3.4 m ahead, so use a floor large enough to be in frame)
  const fp = await E(() => {
    const C = RCApp.core, p = C.newProject(), r = p.rooms[0]; C.addStory(p);
    C.makeFloorSection(p, 1, { x: r.x - 4, y: r.y - 6 }, { x: r.x + 10, y: r.y + 8 });
    const v = C.createViewpoint(p, { x: r.x + 3, y: r.y + 3 }, { x: r.x + 3, y: r.y + 1 }, 'fp', null, 1);
    let n = 0; for (let y = v.height * 0.6; y < v.height; y += 25) for (let x = 0; x < v.width; x += 25) { const m = RCApp.renderer.probe(p, v, { x, y })?.meta; if (m?.kind === 'floorSection' && m.story === 1) n++; }
    return n;
  });
  check('First person from a floor-space viewpoint renders its own story floor', fp > 50, fp);

  // Save / reopen keeps everything on Floor 2.
  const round = await E(async () => {
    const b = RCApp.makeBundle(); const json = JSON.parse(JSON.stringify(b));
    await RCApp.applyBundle(json);
    const p = RCApp.project;
    return { views: p.viewpoints.filter(v => v.story === 1).map(v => [v.roomId, v.floorZ]), objs: p.objects.filter(o => o.story === 1).map(o => [o.roomId, o.floorZ]) };
  });
  check('Save/reopen keeps floor-space items on Floor 2', round.views.length >= 1 && round.objs.length === 1 && [...round.views, ...round.objs].every(([r, z]) => r === null && Math.abs(z - 3.2) < 1e-6), round);

  // A floor-space item is never pulled down onto the Ground room by validation.
  const pulled = await E(() => { const C = RCApp.core, p = C.newProject(), r = p.rooms[0]; C.addStory(p); C.makeFloorSection(p, 1, { x: r.x, y: r.y }, { x: r.x + 4, y: r.y + 4 }); C.createViewpoint(p, { x: r.x + 2, y: r.y + 2 }, { x: r.x + 2, y: r.y + 1 }, 'v', null, 1); const v = C.validateBundle({ project: p, assets: [] }).project.viewpoints[0]; return { story: v.story, roomId: v.roomId }; });
  check('Validation keeps a floor-space viewpoint on its story (not the Ground room below)', pulled.story === 1 && pulled.roomId === null, pulled);

  check('No page errors', errors.length === 0, errors);
  const failed = results.filter(r => !r.passed).length;
  console.log(`${results.length - failed} passed, ${failed} failed`);
  fs.writeFileSync(path.join(__dirname, 'v0_11_2_floor_placement_browser_results.json'), JSON.stringify({ passed: results.length - failed, failed, results }, null, 2));
  await browser.close(); process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
