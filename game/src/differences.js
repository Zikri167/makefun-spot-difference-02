// The difference model: kinds, scene declarations, hit testing, markers.
// A difference is { id, x, y, r, kind, label } in panel space (620x430).
// The changed panel draws with the set of ALL difference ids; the base
// panel draws with an empty set. Found markers use the same geometry.
export const PANEL_W = 620;
export const PANEL_H = 430;
export const DIFF_KINDS = ['removed', 'added', 'color', 'moved', 'resized', 'mirrored', 'count', 'detail'];
export function makeDifference(id, x, y, r, kind, label) {
  return { id, x, y, r: Math.max(15, r), kind, label };
}
export function hitTest(differences, foundIds, px, py) {
  let best = null; let bestDist = Infinity;
  for (const d of differences) {
    if (foundIds.has(d.id)) continue;
    const dist = Math.hypot(px - d.x, py - d.y);
    if (dist <= d.r + 6 && dist < bestDist) { best = d; bestDist = dist; }
  }
  return best;
}
export function nearestUnfound(differences, foundIds) {
  for (const d of differences) if (!foundIds.has(d.id)) return d;
  return null;
}
export function markerRadius(d, t) {
  const pop = t < 1 ? 1 + Math.sin(t * Math.PI) * 0.25 : 1;
  return Math.max(17, d.r * 0.92) * pop;
}
