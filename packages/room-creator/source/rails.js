/* TRAPSTAR Room Creator 0.13 — rails, automatic paths and smooth camera motion.
   Pure geometry: no drawing. A rail is an ordered list of stops (placed viewpoints) and via points.
   railPlan() turns it into a timed camera path; sampleRail() gives the camera pose at any time.
   findPath() walks around walls, through open doors and up stairs on a 0.2 m floor grid. */
(function (root, factory) {
  const api = factory(root && root.RCCore ? root.RCCore : (typeof require !== 'undefined' ? require('./core.js') : null));
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.RCRails = api;
})(typeof window !== 'undefined' ? window : null, function (C) {
  'use strict';
  const CELL = .2, CLEAR = .2, TAU = Math.PI * 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const angDiff = (a, b) => { let d = ((b - a) % 360 + 540) % 360 - 180; return d; };
  const lerpAngle = (a, b, t) => C.norm(a + angDiff(a, b) * t);
  const heading = (a, b) => C.heading(a, b);

  // ------------------------------------------------------------------ navigation grid per story
  const gridCache = new Map();
  function navKey(p) {
    return JSON.stringify([p.rooms.map(r => [r.id, r.x, r.y, r.width, r.length, r.story]), (p.floorSections || []).map(f => [f.x, f.y, f.width, f.length, f.story]),
      (p.floorCuts || []).map(c => [c.x, c.y, c.width, c.length, c.story]), (p.partitions || []).map(q => [q.x, q.y, q.axis, q.length, q.height, q.story, q.roomId]),
      p.openings.map(o => [o.roomId, o.side, o.partitionId, o.offset, o.width, o.height, o.kind, o.open, o.trim, o.frameWidth]),
      (p.pillars || []).map(q => [q.x, q.y, q.width, q.depth, q.height, q.story, q.blocks]), (p.stairs || []).map(s => [s.x, s.y, s.width, s.length, s.dir, s.story]),
      p.objects.filter(o => o.blocks && o.visible).map(o => [o.x, o.y, o.width, o.depth, o.facing, o.story]), p.wallHeight, p.storyHeight,
      (p.props || []).map(q => [q.x, q.y, q.z, q.rotation, q.scale, q.story, q.enabled, q.collision, q.bounds, C.propFrontTurn(((p.objectLibrary || {}).setups || {})[q.asset])])]);
  }
  function storyGrid(p, story, key) {
    const ck = key + '|' + story; if (gridCache.has(ck)) return gridCache.get(ck);
    const rects = [...p.rooms.filter(r => (r.story || 0) === story), ...(p.floorSections || []).filter(f => (f.story || 0) === story)];
    if (!rects.length) { gridCache.set(ck, null); return null; }
    const x0 = Math.min(...rects.map(r => r.x)) - 1, y0 = Math.min(...rects.map(r => r.y)) - 1, x1 = Math.max(...rects.map(r => r.x + r.width)) + 1, y1 = Math.max(...rects.map(r => r.y + r.length)) + 1;
    const W = Math.ceil((x1 - x0) / CELL), H = Math.ceil((y1 - y0) / CELL), cells = new Uint8Array(W * H);
    const cx = i => x0 + (i + .5) * CELL, cy = j => y0 + (j + .5) * CELL;
    const fill = (r, value, pad = 0) => {
      const i0 = Math.max(0, Math.ceil((r.x - pad - x0) / CELL - .5)), i1 = Math.min(W - 1, Math.floor((r.x + r.width + pad - x0) / CELL - .5));
      const j0 = Math.max(0, Math.ceil((r.y - pad - y0) / CELL - .5)), j1 = Math.min(H - 1, Math.floor((r.y + r.length + pad - y0) / CELL - .5));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) cells[j * W + i] = value;
    };
    for (const r of rects) fill(r, 1);
    for (const c of (p.floorCuts || []).filter(c => (c.story || 0) === story)) fill(c, 0, CLEAR);
    // Walls: every solid interval becomes a band CLEAR wide on each side. Walkable door/passage gaps stay open.
    for (const w of C.roomWalls(p).filter(w => (w.story || 0) === story)) {
      const cap = C.wallCap(p, w); if (cap < .3) continue;
      let solid = [[w.start, w.end]];
      for (const o of C.openingsForWall(p, w)) {
        const walk = o.kind !== 'window' && o.height >= 1.65 && !(o.kind === 'door' && !o.open); if (!walk) continue;
        const l = C.openingLine(p, o), jamb = C.openingGeometry(o).frame, a = l.start + jamb, b = l.end - jamb; if (b - a < .3) continue;
        solid = solid.flatMap(([s, e]) => b <= s || a >= e ? [[s, e]] : [[s, a], [b, e]].filter(([u, v]) => v - u > 1e-6));
      }
      for (const [s, e] of solid) fill(w.axis === 'h' ? { x: s, y: w.fixed, width: e - s, length: 0 } : { x: w.fixed, y: s, width: 0, length: e - s }, 0, CLEAR);
    }
    for (const q of (p.pillars || []).filter(q => (q.story || 0) === story && q.blocks !== false && q.height >= .3)) fill({ x: q.x - q.width / 2, y: q.y - q.depth / 2, width: q.width, length: q.depth }, 0, CLEAR);
    for (const o of p.objects.filter(o => o.blocks && o.visible && (o.story || 0) === story)) { const e = C.extent(o); fill({ x: o.x - e.x, y: o.y - e.y, width: 2 * e.x, length: 2 * e.y }, 0, CLEAR * .5); }
    // 0.14 placed 3D objects: solid ones block walking with their simple footprint (box or round)
    for (const q of (p.props || []).filter(q => (q.story || 0) === story)) {
      const fz = C.propFloorZ(p, q), fp = C.propFootprint(q, ((p.objectLibrary || {}).setups || {})[q.asset], null, fz); if (!C.propBlocksWalking(q, fp, fz)) continue;
      const xs = fp.poly.map(v => v.x), ys = fp.poly.map(v => v.y), pad = CLEAR * .75;
      const i0 = Math.max(0, Math.floor((Math.min(...xs) - pad - x0) / CELL)), i1 = Math.min(W - 1, Math.ceil((Math.max(...xs) + pad - x0) / CELL));
      const j0 = Math.max(0, Math.floor((Math.min(...ys) - pad - y0) / CELL)), j1 = Math.min(H - 1, Math.ceil((Math.max(...ys) + pad - y0) / CELL));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const pt = { x: cx(i), y: cy(j) }; if (C.pointInPoly(pt, fp.poly) || fp.poly.some((v, k) => C.segDist(pt, v, fp.poly[(k + 1) % fp.poly.length]) < pad)) cells[j * W + i] = 0; }
    }
    for (const st of (p.stairs || []).filter(s => (s.story || 0) === story)) fill(C.stairRect(st), 0, .05);
    const g = { story, x0, y0, W, H, cells, cx, cy, z: C.storyElevation(p, story) };
    gridCache.set(ck, g); if (gridCache.size > 40) gridCache.delete(gridCache.keys().next().value);
    return g;
  }
  const cellOf = (g, q) => ({ i: Math.floor((q.x - g.x0) / CELL), j: Math.floor((q.y - g.y0) / CELL) });
  function walkable(g, i, j) { return i >= 0 && j >= 0 && i < g.W && j < g.H && g.cells[j * g.W + i] === 1; }
  function nearestWalkable(g, q, maxR = 8) {
    const c = cellOf(g, q); if (walkable(g, c.i, c.j)) return c;
    for (let r = 1; r <= maxR; r++) { let best = null, bd = Infinity;
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) { if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue; const i = c.i + di, j = c.j + dj; if (walkable(g, i, j)) { const d = di * di + dj * dj; if (d < bd) { bd = d; best = { i, j }; } } }
      if (best) return best; }
    return null;
  }
  function lineClear(g, a, b) {
    const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / (CELL * .5)));
    for (let k = 0; k <= n; k++) { const t = k / n, c = cellOf(g, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }); if (!walkable(g, c.i, c.j)) return false; }
    return true;
  }

  // ------------------------------------------------------------------ A* over all stories, linked by stairs
  class Heap { constructor() { this.k = []; this.v = []; } push(key, val) { const k = this.k, v = this.v; let i = k.length; k.push(key); v.push(val); while (i > 0) { const pa = (i - 1) >> 1; if (k[pa] <= key) break; k[i] = k[pa]; v[i] = v[pa]; i = pa; } k[i] = key; v[i] = val; }
    pop() { const k = this.k, v = this.v, top = v[0], lk = k.pop(), lv = v.pop(); if (k.length) { let i = 0; const n = k.length; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; let mk = lk; if (l < n && k[l] < mk) { m = l; mk = k[l]; } if (r < n && k[r] < mk) { m = r; mk = k[r]; } if (m === i) break; k[i] = k[m]; v[i] = v[m]; i = m; } k[i] = lk; v[i] = lv; } return top; }
    get size() { return this.k.length; } }
  function findPath(p, a, b, { maxNodes = 900000 } = {}) {
    const key = navKey(p), sa = a.story || 0, sb = b.story || 0;
    const stories = [...new Set([sa, sb, ...(p.stairs || []).flatMap(s => [s.story, s.story + 1])])].filter(s => C.storyRecord(p, s)).sort((m, n) => m - n);
    const grids = new Map(), base = new Map(); let total = 0;
    for (const s of stories) { const g = storyGrid(p, s, key); if (!g) continue; grids.set(s, g); base.set(s, total); total += g.W * g.H; }
    const ga = grids.get(sa), gb = grids.get(sb); if (!ga || !gb) return null;
    const ca = nearestWalkable(ga, a), cb = nearestWalkable(gb, b); if (!ca || !cb) return null;
    // stair links: entry cell on the lower story <-> exit cell on the upper story
    const links = new Map();
    for (const st of p.stairs || []) { const lo = grids.get(st.story), hi = grids.get(st.story + 1); if (!lo || !hi) continue; const geo = C.stairGeometry(p, st), e = nearestWalkable(lo, geo.entry, 3), x = nearestWalkable(hi, geo.exit, 3); if (!e || !x) continue;
      const ia = base.get(st.story) + e.j * lo.W + e.i, ib = base.get(st.story + 1) + x.j * hi.W + x.i, cost = geo.along * 1.25 + .9;
      if (!links.has(ia)) links.set(ia, []); if (!links.has(ib)) links.set(ib, []); links.get(ia).push({ to: ib, cost, stair: st.id, up: true }); links.get(ib).push({ to: ia, cost, stair: st.id, up: false }); }
    const storyOf = idx => { let s0 = stories[0]; for (const s of stories) if (base.has(s) && idx >= base.get(s)) s0 = s; return s0; };
    const start = base.get(sa) + ca.j * ga.W + ca.i, goal = base.get(sb) + cb.j * gb.W + cb.i;
    const gx = gb.cx(cb.i), gy = gb.cy(cb.j), gz = gb.z;
    const gScore = new Float32Array(total).fill(Infinity), came = new Int32Array(total).fill(-1), closed = new Uint8Array(total);
    const pos = idx => { const s = storyOf(idx), g = grids.get(s), l = idx - base.get(s), j = Math.floor(l / g.W), i = l - j * g.W; return { s, g, i, j, x: g.cx(i), y: g.cy(j) }; };
    const hFn = q => { const dx = Math.abs(q.x - gx), dy = Math.abs(q.y - gy); return (Math.max(dx, dy) + .41421356 * Math.min(dx, dy)) + Math.abs(q.g.z - gz) * 1.2; };
    const heap = new Heap(); gScore[start] = 0; heap.push(hFn(pos(start)), start); let seen = 0;
    const N8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.41421356], [1, -1, 1.41421356], [-1, 1, 1.41421356], [-1, -1, 1.41421356]];
    while (heap.size) {
      const cur = heap.pop(); if (closed[cur]) continue; closed[cur] = 1; if (cur === goal) break; if (++seen > maxNodes) return null;
      const q = pos(cur), gc = gScore[cur], b0 = base.get(q.s);
      for (const [di, dj, c] of N8) { const i = q.i + di, j = q.j + dj; if (!walkable(q.g, i, j)) continue; if (di && dj && (!walkable(q.g, q.i + di, q.j) || !walkable(q.g, q.i, q.j + dj))) continue;
        const n = b0 + j * q.g.W + i; if (closed[n]) continue; const ng = gc + c * CELL; if (ng < gScore[n]) { gScore[n] = ng; came[n] = cur; heap.push(ng + hFn({ x: q.g.cx(i), y: q.g.cy(j), g: q.g }), n); } }
      for (const l of links.get(cur) || []) { if (closed[l.to]) continue; const ng = gc + l.cost; if (ng < gScore[l.to]) { gScore[l.to] = ng; came[l.to] = cur; heap.push(ng + hFn(pos(l.to)), l.to); } }
    }
    if (came[goal] < 0 && goal !== start) return null;
    const cellsPath = []; for (let c = goal; c >= 0; c = came[c]) { cellsPath.push(c); if (c === start) break; } cellsPath.reverse();
    // split into per-story runs; stair hops become explicit climbs
    const runs = []; let run = null;
    for (const c of cellsPath) { const q = pos(c); if (!run || run.s !== q.s) { run = { s: q.s, g: q.g, pts: [] }; runs.push(run); } run.pts.push({ x: q.x, y: q.y }); }
    const out = [];
    runs.forEach((r, k) => {
      const pts = r.pts.slice(); if (k === 0) pts[0] = { x: a.x, y: a.y }; if (k === runs.length - 1) pts[pts.length - 1] = { x: b.x, y: b.y };
      // string pulling: keep the furthest visible point each step
      const pulled = [pts[0]]; let i = 0;
      while (i < pts.length - 1) { let j = pts.length - 1; while (j > i + 1 && !lineClear(r.g, pts[i], pts[j])) j--; pulled.push(pts[j]); i = j; }
      const z = r.g.z;
      if (k > 0) { // the climb from the previous run's end to this run's start follows the stair
        const prev = runs[k - 1], st = (p.stairs || []).find(s => (s.story === prev.s && s.story + 1 === r.s) || (s.story === r.s && s.story + 1 === prev.s));
        if (st) { const geo = C.stairGeometry(p, st), up = r.s > prev.s, lowZ = C.storyElevation(p, st.story), hiZ = C.storyElevation(p, st.story + 1);
          const seq = up ? [[geo.bottom, lowZ], [geo.top, hiZ]] : [[geo.top, hiZ], [geo.bottom, lowZ]]; for (const [pt, zz] of seq) out.push({ x: pt.x, y: pt.y, z: zz, story: zz === hiZ ? st.story + 1 : st.story, stair: st.id }); }
      }
      for (const q of pulled) out.push({ x: q.x, y: q.y, z, story: r.s });
    });
    // drop duplicate consecutive points
    return out.filter((q, k) => k === 0 || Math.hypot(q.x - out[k - 1].x, q.y - out[k - 1].y) > 1e-4 || Math.abs(q.z - out[k - 1].z) > 1e-4);
  }

  // ------------------------------------------------------------------ smoothing and resampling
  function filletPolyline(pts, radius) {
    if (pts.length < 3 || radius <= 0) return pts.slice();
    const out = [pts[0]];
    for (let k = 1; k < pts.length - 1; k++) {
      const a = pts[k - 1], v = pts[k], b = pts[k + 1];
      if (v.stair || a.stair && b.stair) { out.push(v); continue; }
      const la = Math.hypot(v.x - a.x, v.y - a.y), lb = Math.hypot(b.x - v.x, b.y - v.y); if (la < 1e-6 || lb < 1e-6) { out.push(v); continue; }
      const r = Math.min(radius, la * .45, lb * .45), p0 = { x: v.x + (a.x - v.x) * r / la, y: v.y + (a.y - v.y) * r / la, z: v.z + (a.z - v.z) * r / la, story: v.story }, p1 = { x: v.x + (b.x - v.x) * r / lb, y: v.y + (b.y - v.y) * r / lb, z: v.z + (b.z - v.z) * r / lb, story: v.story };
      const n = 8; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push({ x: u * u * p0.x + 2 * u * t * v.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * v.y + t * t * p1.y, z: u * u * p0.z + 2 * u * t * v.z + t * t * p1.z, story: v.story }); }
    }
    out.push(pts[pts.length - 1]); return out;
  }
  function resample(pts, step = .1) {
    const seg = [0]; for (let k = 1; k < pts.length; k++) seg.push(seg[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y, pts[k].z - pts[k - 1].z));
    const L = seg[seg.length - 1], n = Math.max(1, Math.ceil(L / step)), xs = new Float32Array(n + 1), ys = new Float32Array(n + 1), zs = new Float32Array(n + 1), st = new Int16Array(n + 1);
    let k = 1;
    for (let i = 0; i <= n; i++) { const d = L * i / n; while (k < pts.length - 1 && seg[k] < d) k++; const a = pts[k - 1], b = pts[k] || a, span = seg[k] - seg[k - 1], t = span > 1e-9 ? clamp((d - seg[k - 1]) / span, 0, 1) : 0;
      xs[i] = a.x + (b.x - a.x) * t; ys[i] = a.y + (b.y - a.y) * t; zs[i] = a.z + (b.z - a.z) * t; st[i] = t < .5 ? a.story : b.story; }
    return { L, n, xs, ys, zs, st };
  }

  // ------------------------------------------------------------------ rail planning
  function stopPose(p, node) {
    if (node.kind === 'stop') { const v = p.viewpoints.find(v => v.id === node.viewId); if (!v) return null; return { x: v.x, y: v.y, story: v.story || 0, z: C.storyElevation(p, v.story || 0), facing: v.facing, eye: v.eyeHeight, fov: v.fov, horizon: v.horizon ?? .42, name: v.name, viewId: v.id, stop: true }; }
    return { x: node.x, y: node.y, story: node.story || 0, z: C.storyElevation(p, node.story || 0), stop: false };
  }
  function legPath(p, a, b, rail, warnings) {
    const straight = () => {
      const pts = [{ x: a.x, y: a.y, z: a.z, story: a.story }, { x: b.x, y: b.y, z: b.z, story: b.story }];
      if (a.story === b.story) { const chk = C.routeCheck(p, { ...a }, { ...b }, { ignoreDoorState: false }); if (!chk.ok) warnings.push({ type: 'blocked', from: a, to: b, reason: chk.reason }); }
      return pts;
    };
    if (!rail.autoPath) return straight();
    const path = findPath(p, a, b);
    if (!path) { warnings.push({ type: 'nopath', from: a, to: b, reason: 'No walkable path found between these points' + (a.story !== b.story ? ' (add stairs between the stories)' : '') + '. A straight line is used.' }); return straight(); }
    if (path.length) { path[0] = { ...path[0], x: a.x, y: a.y, z: a.z }; path[path.length - 1] = { ...path[path.length - 1], x: b.x, y: b.y, z: b.z }; }
    return path;
  }
  function railKey(p, rail) { return JSON.stringify([rail, p.viewpoints.map(v => [v.id, v.x, v.y, v.story, v.facing, v.eyeHeight, v.fov, v.horizon]), navKey(p)]); }
  const planCache = new Map();
  function railPlan(p, rail, { cache = true } = {}) {
    const key = cache ? railKey(p, rail) : null; if (key && planCache.has(key)) return planCache.get(key);
    const warnings = [], nodes = rail.nodes.map(n => ({ node: n, pose: stopPose(p, n) })).filter(n => n.pose);
    if (rail.loop && nodes.length > 1) nodes.push(nodes[0]);
    const defaults = { eye: 1.55, fov: 72, horizon: .42 };
    const legs = [], timeline = []; let t = 0;
    if (nodes.length < 2) { const plan = { rail, legs, timeline, duration: 0, warnings: nodes.length ? [] : [{ type: 'empty', reason: 'Add at least two points to this rail.' }], single: nodes[0]?.pose || null }; if (key) planCache.set(key, plan); return plan; }
    // split into legs at stops; vias are corners inside a leg
    let cur = [nodes[0]];
    for (let k = 1; k < nodes.length; k++) { cur.push(nodes[k]); if (nodes[k].pose.stop || k === nodes.length - 1) { legs.push({ items: cur }); cur = [nodes[k]]; } }
    for (const leg of legs) {
      const first = leg.items[0], last = leg.items[leg.items.length - 1];
      let pts = [];
      for (let k = 0; k < leg.items.length - 1; k++) { const seg = legPath(p, leg.items[k].pose, leg.items[k + 1].pose, rail, warnings); pts = pts.length ? pts.concat(seg.slice(1)) : seg; }
      const smoothPts = filletPolyline(pts, rail.corner ?? 1.2), rs = resample(smoothPts, .1);
      const a = first.pose, b = last.pose, speed = clamp(first.node.speed ?? rail.speed ?? 3, .2, 40), ease = Math.min(rs.L / 2, rail.ease ?? 1.5);
      const ta = ease > 1e-6 ? 2 * ease / speed : 0, tc = Math.max(0, rs.L - 2 * ease) / speed, T = rs.L < 1e-4 ? 0 : 2 * ta + tc;
      // headings along the leg: look ahead, smoothed, blended into the stop facings near each end
      const n = rs.n, raw = new Float32Array(n + 1), look = Math.max(.1, rail.lookAhead ?? 2), step = rs.L / Math.max(1, n);
      for (let i = 0; i <= n; i++) { const j = Math.min(n, i + Math.max(1, Math.round(look / Math.max(step, 1e-6)))); let x0 = rs.xs[i], y0 = rs.ys[i], x1 = rs.xs[j], y1 = rs.ys[j]; if (j === i || Math.hypot(x1 - x0, y1 - y0) < 1e-4) { const i0 = Math.max(0, i - 1); x0 = rs.xs[i0]; y0 = rs.ys[i0]; x1 = rs.xs[Math.min(n, i0 + 1)]; y1 = rs.ys[Math.min(n, i0 + 1)]; }
        raw[i] = Math.hypot(x1 - x0, y1 - y0) < 1e-5 ? (i ? raw[i - 1] : (a.facing ?? 0)) : heading({ x: x0, y: y0 }, { x: x1, y: y1 }); }
      const un = new Float32Array(n + 1); un[0] = raw[0]; for (let i = 1; i <= n; i++) un[i] = un[i - 1] + angDiff(raw[i - 1], raw[i]);
      const win = Math.max(1, Math.round(1 / Math.max(step, 1e-6))), hd = new Float32Array(n + 1), pre = new Float64Array(n + 2);
      for (let i = 0; i <= n; i++) pre[i + 1] = pre[i] + un[i];
      const turn = Math.max(.01, rail.turnDistance ?? 2.5);
      for (let i = 0; i <= n; i++) { const lo = Math.max(0, i - win), hi = Math.min(n, i + win); let h = C.norm((pre[hi + 1] - pre[lo]) / (hi - lo + 1)); const s = i * step;
        if (a.stop) h = lerpAngle(h, a.facing, smooth(1 - s / turn)); if (b.stop) h = lerpAngle(h, b.facing, smooth(1 - (rs.L - s) / turn)); hd[i] = h; }
      const pa = { eye: a.eye ?? defaults.eye, fov: a.fov ?? defaults.fov, horizon: a.horizon ?? defaults.horizon }, pb = { eye: b.eye ?? pa.eye, fov: b.fov ?? pa.fov, horizon: b.horizon ?? pa.horizon };
      if (!a.stop) Object.assign(pa, { eye: pb.eye, fov: pb.fov, horizon: pb.horizon });
      Object.assign(leg, { a, b, rs, speed, ease, ta, tc, T, hd, pa, pb, points: pts });
    }
    // timeline: hold at each stop, then travel
    const holdOf = pose => { if (!pose.stop) return 0; const n = rail.nodes.find(x => x.viewId === pose.viewId); return n?.hold ?? rail.hold ?? 1.5; };
    legs.forEach((leg, k) => {
      if (k === 0 && leg.a.stop) { const h = holdOf(leg.a); timeline.push({ type: 'hold', t0: t, t1: t + h, pose: leg.a, leg: k }); t += h; }
      timeline.push({ type: 'move', t0: t, t1: t + leg.T, leg: k }); t += leg.T;
      if (leg.b.stop && !(rail.loop && k === legs.length - 1)) { const h = holdOf(leg.b); timeline.push({ type: 'hold', t0: t, t1: t + h, pose: leg.b, leg: k, end: true }); t += h; }
    });
    const plan = { rail, legs, timeline, duration: t, warnings, length: legs.reduce((s, l) => s + l.rs.L, 0) };
    if (key) { planCache.set(key, plan); if (planCache.size > 30) planCache.delete(planCache.keys().next().value); }
    return plan;
  }
  function legDistance(leg, tau) {
    const { ta, tc, T, speed, rs } = leg; if (T <= 0) return 0;
    tau = clamp(tau, 0, T);
    // cosine speed ramps: no sudden starts or stops
    const ramp = t => speed / 2 * (t - ta / Math.PI * Math.sin(Math.PI * t / ta));
    if (ta > 0 && tau < ta) return ramp(tau);
    const dA = ta > 0 ? ramp(ta) : 0;
    if (tau < ta + tc) return dA + (tau - ta) * speed;
    const td = tau - ta - tc; return Math.min(rs.L, dA + tc * speed + (dA - (ta > 0 ? ramp(ta - td) : 0)));
  }
  function poseOnLeg(leg, d) {
    const rs = leg.rs, f = rs.L > 1e-9 ? clamp(d / rs.L, 0, 1) : 0, x = f * rs.n, i = Math.min(rs.n - 1, Math.floor(x)), t = rs.n ? x - i : 0, j = Math.min(rs.n, i + 1);
    const w = smooth(f);
    return { x: rs.xs[i] + (rs.xs[j] - rs.xs[i]) * t, y: rs.ys[i] + (rs.ys[j] - rs.ys[i]) * t, z: rs.zs[i] + (rs.zs[j] - rs.zs[i]) * t, story: t < .5 ? rs.st[i] : rs.st[j],
      facing: lerpAngle(leg.hd[i], leg.hd[j], t), eye: leg.pa.eye + (leg.pb.eye - leg.pa.eye) * w, fov: leg.pa.fov + (leg.pb.fov - leg.pa.fov) * w, horizon: leg.pa.horizon + (leg.pb.horizon - leg.pa.horizon) * w };
  }
  function sampleRail(plan, time) {
    if (!plan.timeline.length) { const s = plan.single; return s ? { x: s.x, y: s.y, z: s.z, story: s.story, facing: s.facing ?? 0, eye: s.eye ?? 1.55, fov: s.fov ?? 72, horizon: s.horizon ?? .42, stop: s, t: 0 } : null; }
    const tt = plan.rail.loop && plan.duration > 0 ? ((time % plan.duration) + plan.duration) % plan.duration : clamp(time, 0, plan.duration);
    let seg = plan.timeline[plan.timeline.length - 1]; for (const s of plan.timeline) if (tt <= s.t1 + 1e-9) { seg = s; break; }
    if (seg.type === 'hold') { const q = seg.pose; return { x: q.x, y: q.y, z: q.z, story: q.story, facing: q.facing, eye: q.eye, fov: q.fov, horizon: q.horizon, stop: q, t: tt, segment: seg }; }
    const leg = plan.legs[seg.leg], d = legDistance(leg, tt - seg.t0); return { ...poseOnLeg(leg, d), t: tt, segment: seg, distance: d };
  }
  function stopTimes(plan) { return plan.timeline.filter(s => s.type === 'hold').map(s => ({ t0: s.t0, t1: s.t1, name: s.pose.name, viewId: s.pose.viewId })); }
  // Smooth travel between two placed viewpoints for Test walk.
  function transitPlan(p, from, to, { speed = 2.4 } = {}) {
    const rail = { id: 'transit', name: 'Transit', speed, ease: 1.2, corner: .9, lookAhead: 1.6, turnDistance: 2.2, hold: 0, autoPath: true, loop: false, nodes: [{ id: 'a', kind: 'stop', viewId: from.id, hold: 0, speed: null }, { id: 'b', kind: 'stop', viewId: to.id, hold: 0, speed: null }] };
    return railPlan(p, rail, { cache: true });
  }
  function exportFrames(plan, fps = 30) {
    const frames = [], n = Math.max(1, Math.ceil(plan.duration * fps));
    for (let i = 0; i <= n; i++) { const q = sampleRail(plan, i / fps); if (!q) break; frames.push({ t: +(i / fps).toFixed(4), x: +q.x.toFixed(4), y: +q.y.toFixed(4), story: q.story, eyeZ: +(q.z + q.eye).toFixed(4), facing: +q.facing.toFixed(3), fov: +q.fov.toFixed(3), horizon: +q.horizon.toFixed(4), stop: q.stop ? q.stop.viewId || null : null }); }
    return frames;
  }
  function newRail(name = 'Rail 1') { return { id: C.uid('rail'), name, speed: 3, ease: 1.5, corner: 1.2, lookAhead: 2, turnDistance: 2.5, hold: 1.5, autoPath: true, loop: false, nodes: [] }; }
  function stopNode(viewId) { return { id: C.uid('rnode'), kind: 'stop', viewId, hold: null, speed: null }; }
  function viaNode(q, story) { return { id: C.uid('rnode'), kind: 'via', x: q.x, y: q.y, story, speed: null }; }
  function clearCaches() { gridCache.clear(); planCache.clear(); }
  return { CELL, CLEAR, findPath, filletPolyline, resample, railPlan, sampleRail, stopTimes, transitPlan, exportFrames, newRail, stopNode, viaNode, clearCaches, lerpAngle, angDiff, storyGrid, navKey };
});
