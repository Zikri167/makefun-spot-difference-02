// Shared canvas toolkit: gradients, rounded shapes, glow, speckle texture
// and common motifs (star, cloud, leaf, bubble, fish, pine, gear).
export function vGrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h); return g;
}
export function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
export function ellipse(ctx, x, y, rx, ry, fill) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } }
export function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}
export function poly(ctx, pts, fill, stroke) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
}
export function line(ctx, x1, y1, x2, y2, color, w) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = w || 2; ctx.stroke(); }
export function glowCircle(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
export function speckle(ctx, rng, x, y, w, h, n, color, maxR) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) { ctx.globalAlpha = 0.12 + rng() * 0.25; circle(ctx, x + rng() * w, y + rng() * h, 0.6 + rng() * (maxR || 1.6)); ctx.fillStyle = color; }
  ctx.globalAlpha = 1;
}
export function drawStar(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5; const rad = i % 2 ? r * 0.45 : r; const px = x + Math.cos(ang) * rad; const py = y + Math.sin(ang) * rad; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
export function drawCloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2); ctx.arc(x + 18 * s, y + 3 * s, 12 * s, 0, Math.PI * 2);
  ctx.arc(x - 18 * s, y + 4 * s, 11 * s, 0, Math.PI * 2); ctx.arc(x + 2 * s, y + 7 * s, 13 * s, 0, Math.PI * 2); ctx.fill();
}
export function drawLeaf(ctx, x, y, s, ang, fill) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = fill;
  ctx.beginPath(); ctx.moveTo(0, -9 * s); ctx.quadraticCurveTo(7 * s, 0, 0, 9 * s); ctx.quadraticCurveTo(-7 * s, 0, 0, -9 * s); ctx.fill(); ctx.restore();
}
export function drawBubble(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(220,245,255,0.85)'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
}
export function drawFish(ctx, x, y, s, color, flip) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, 13 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
  poly(ctx, [[11 * s, 0], [20 * s, -7 * s], [20 * s, 7 * s]], color);
  circle(ctx, -6 * s, -1.5 * s, 1.7 * s, '#123'); ctx.restore();
}
export function drawPine(ctx, x, y, h, trunk, leafColor) {
  ctx.fillStyle = trunk; ctx.fillRect(x - 3, y - 8, 6, 10);
  ctx.fillStyle = leafColor;
  for (let i = 0; i < 3; i++) { const w = (30 - i * 7); const yy = y - 6 - i * (h / 3.4); poly(ctx, [[x - w / 2, yy], [x + w / 2, yy], [x, yy - h / 2.6]]); ctx.fillStyle = leafColor; }
}
export function drawGear(ctx, x, y, r, teeth, fill, hole) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = fill; ctx.beginPath();
  for (let i = 0; i < teeth; i++) { const a = (i / teeth) * Math.PI * 2; ctx.save(); ctx.rotate(a); ctx.rect(-r * 0.16, -r * 1.22, r * 0.32, r * 0.4); ctx.restore(); }
  ctx.fill(); circle(ctx, 0, 0, r, fill); circle(ctx, 0, 0, r * 0.42, hole || '#2b2118'); ctx.restore();
}
export function signText(ctx, text, x, y, size, color) {
  ctx.fillStyle = color; ctx.font = '700 ' + size + 'px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y);
}
