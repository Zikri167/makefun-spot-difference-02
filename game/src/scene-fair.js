// Scene 5 — Harvest Fair: autumn fairground drawn from seed 5505.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const fairDifferences = [
  makeDifference('fair-wheel-cabin', 310, 62, 24, 'color', 'ferris cabin turns purple'),
  makeDifference('fair-balloon-count', 120, 84, 28, 'count', 'one balloon fewer in the sky'),
  makeDifference('fair-pumpkin', 96, 348, 22, 'resized', 'big pumpkin shrinks'),
  makeDifference('fair-scarecrow-hat', 520, 268, 20, 'removed', 'scarecrow loses its hat'),
  makeDifference('fair-bunting', 210, 208, 24, 'color', 'bunting flag turns blue'),
  makeDifference('fair-barn-star', 452, 168, 20, 'removed', 'barn star is missing'),
  makeDifference('fair-leaf-count', 380, 300, 24, 'count', 'falling leaves thin out'),
  makeDifference('fair-duck', 556, 356, 18, 'added', 'a duck joins the pond edge'),
  makeDifference('fair-sign', 150, 252, 20, 'detail', 'fair sign letter changes'),
  makeDifference('fair-horse', 268, 330, 22, 'mirrored', 'carousel horse faces left'),
  makeDifference('fair-apple', 596, 268, 17, 'color', 'apple on the stall turns green'),
  makeDifference('fair-wheel-light', 310, 138, 18, 'detail', 'wheel hub light goes dark'),
];

function balloon(ctx, x, y, s, color) {
  P.ellipse(ctx, x, y, 20 * s, 25 * s, color);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; P.ellipse(ctx, x - 7 * s, y - 9 * s, 6 * s, 9 * s);
  P.line(ctx, x - 8 * s, y + 22 * s, x - 4 * s, y + 34 * s, '#7a4a2b', 1.4); P.line(ctx, x + 8 * s, y + 22 * s, x + 4 * s, y + 34 * s, '#7a4a2b', 1.4);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(x - 6 * s, y + 34 * s, 12 * s, 8 * s);
}
function pumpkin(ctx, x, y, s) {
  P.ellipse(ctx, x, y, 20 * s, 15 * s, '#f4842b'); ctx.strokeStyle = '#d96a1e'; ctx.lineWidth = 1.6;
  for (const off of [-10, 0, 10]) { ctx.beginPath(); ctx.ellipse(x + off * s, y, 9 * s, 14 * s, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = '#5d7a2e'; ctx.fillRect(x - 2.4 * s, y - 18 * s, 5 * s, 7 * s);
}

export function drawFair(ctx, changed) {
  const rng = makeRng(5505);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#ffd9a0'], [0.5, '#ffe9c4'], [1, '#f7d9a8']]);
  P.circle(ctx, 566, 52, 24, '#ffb340'); P.glowCircle(ctx, 566, 52, 60, 'rgba(255,180,60,0.4)');
  // balloons
  const balloons = [[76, 74, '#e63946'], [120, 84, '#3b6fd4'], [168, 62, '#3fae6a']];
  balloons.forEach(([bx, by, bc], i) => { if (changed.has('fair-balloon-count') && i === 1) return; balloon(ctx, bx, by, 0.85, bc); });
  balloon(ctx, 470, 96, 0.65, '#e6a23b');
  // ferris wheel
  ctx.save(); ctx.translate(310, 138);
  ctx.strokeStyle = '#7a4a6b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 76, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 58, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.stroke();
  const cabinColors = ['#e63946', '#3b6fd4', '#3fae6a', '#e6a23b', '#e63946', '#3b6fd4', '#3fae6a', '#e6a23b'];
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + 0.4; const cx = Math.cos(a) * 76, cy = Math.sin(a) * 76;
    P.line(ctx, 0, 0, cx, cy, '#7a4a6b', 2);
    let col = cabinColors[i];
    if (changed.has('fair-wheel-cabin') && i === 2) col = '#9b59d0';
    P.roundRect(ctx, cx - 10, cy - 2, 20, 15, 4, col, '#54304a');
  }
  P.circle(ctx, 0, 0, 11, '#54304a'); P.circle(ctx, 0, 0, 5.4, changed.has('fair-wheel-light') ? '#4a3542' : '#ffd76a');
  P.line(ctx, 0, 0, -34, 108, '#7a4a6b', 5); P.line(ctx, 0, 0, 34, 108, '#7a4a6b', 5); ctx.restore();
  // ground
  P.vGrad(ctx, 0, 300, 620, 130, [[0, '#d9a75e'], [1, '#b57f3a']]);
  P.speckle(ctx, rng, 0, 310, 620, 110, 70, '#8a5f24', 1.8);
  // barn
  ctx.fillStyle = '#b03a2e'; ctx.fillRect(404, 168, 96, 76);
  P.poly(ctx, [[398, 168], [500, 168], [452, 132]], '#7e271c');
  ctx.fillStyle = '#7e271c'; ctx.fillRect(438, 202, 28, 42);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; P.line(ctx, 438, 202, 466, 244, '#fff', 2.4); P.line(ctx, 466, 202, 438, 244, '#fff', 2.4);
  if (!changed.has('fair-barn-star')) P.drawStar(ctx, 452, 168, 11, '#ffd23e');
  ctx.fillStyle = '#fff'; ctx.fillRect(416, 182, 16, 14); ctx.fillRect(472, 182, 16, 14);
  // stalls with bunting
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(52, 252, 196, 10);
  ctx.beginPath(); ctx.moveTo(52, 252); ctx.quadraticCurveTo(150, 282, 248, 252); ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 2; ctx.stroke();
  const bunt = ['#e63946', '#ffd23e', '#3fae6a', '#e63946', '#ffd23e', '#3fae6a'];
  bunt.forEach((bc, i) => { const bx = 72 + i * 32, by = 262 + Math.sin(i * 1.1) * 5; P.poly(ctx, [[bx, by], [bx + 18, by + 2], [bx + 9, by + 17]], changed.has('fair-bunting') && i === 2 ? '#3b6fd4' : bc); });
  P.signText(ctx, changed.has('fair-sign') ? 'FA1R' : 'FAIR', 150, 240, 17, '#7a2e3e');
  ctx.fillStyle = '#a06a32'; ctx.fillRect(66, 300, 168, 44);
  for (let i = 0; i < 5; i++) pumpkin(ctx, 88 + i * 38, 322, 0.62);
  // pumpkin pile left
  pumpkin(ctx, 96, 352, changed.has('fair-pumpkin') ? 0.62 : 1.05); pumpkin(ctx, 138, 360, 0.7); pumpkin(ctx, 62, 366, 0.66);
  // carousel horse on a pole
  ctx.save(); ctx.translate(268, 330); if (changed.has('fair-horse')) ctx.scale(-1, 1);
  P.line(ctx, 0, -48, 0, 30, '#b08d4f', 4);
  ctx.fillStyle = '#f2ead8'; P.ellipse(ctx, 0, -8, 24, 12); P.circle(ctx, 26, -18, 8, '#f2ead8'); P.poly(ctx, [[20, -24], [16, -32], [24, -27]], '#f2ead8');
  ctx.fillStyle = '#c22f4a'; ctx.fillRect(-10, -16, 17, 10);
  ctx.strokeStyle = '#f2ead8'; ctx.lineWidth = 4.4; P.line(ctx, -14, 0, -20, 14, '#f2ead8', 4.4); P.line(ctx, 14, 0, 20, 14, '#f2ead8', 4.4);
  P.circle(ctx, 28, -19, 1.8, '#222'); ctx.restore();
  // apple stall right
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(548, 282, 62, 52);
  P.poly(ctx, [[542, 282], [616, 282], [600, 258], [558, 258]], '#3fae6a');
  const apples = [[562, 300, '#e63946'], [580, 306, '#e63946'], [596, 298, '#ffd23e'], [596, 268, '#e63946']];
  apples.forEach(([ax, ay, ac], i) => { const col = changed.has('fair-apple') && i === 3 ? '#7ac74f' : ac; P.circle(ctx, ax, ay, 7, col); P.line(ctx, ax, ay - 6, ax + 2, ay - 11, '#5d7a2e', 2); });
  // scarecrow
  ctx.save(); ctx.translate(520, 286);
  P.line(ctx, 0, -34, 0, 44, '#7a4a2b', 4); P.line(ctx, -26, -12, 26, -20, '#7a4a2b', 4);
  ctx.fillStyle = '#3b6fd4'; ctx.fillRect(-13, -30, 26, 34);
  P.circle(ctx, 0, -42, 12, '#f2c894'); P.circle(ctx, -4, -44, 1.8, '#222'); P.circle(ctx, 4, -44, 1.8, '#222');
  if (!changed.has('fair-scarecrow-hat')) { ctx.fillStyle = '#e6a23b'; ctx.fillRect(-15, -56, 30, 5); ctx.fillRect(-9, -66, 18, 11); }
  ctx.strokeStyle = '#e8c85a'; ctx.lineWidth = 3; P.line(ctx, -24, -14, -30, -4, '#e8c85a', 3); P.line(ctx, 24, -18, 30, -8, '#e8c85a', 3); ctx.restore();
  // pond edge + duck (added)
  P.ellipse(ctx, 566, 396, 52, 16, '#7fc4d8');
  if (changed.has('fair-duck')) { ctx.save(); ctx.translate(556, 388); ctx.fillStyle = '#fff'; P.ellipse(ctx, 0, 0, 13, 8); P.circle(ctx, 12, -6, 6, '#fff'); P.poly(ctx, [[17, -6], [24, -3.4], [17, -2]], '#f4842b'); P.circle(ctx, 13, -7, 1.4, '#222'); ctx.restore(); }
  // falling leaves
  const leaves = [[360, 288], [380, 300], [402, 292], [424, 306], [346, 312]];
  leaves.forEach(([lx, ly], i) => { if (changed.has('fair-leaf-count') && (i === 1 || i === 3)) return; P.drawLeaf(ctx, lx, ly, 0.9, i * 1.3, i % 2 ? '#e67e22' : '#c94f2e'); });
  for (let i = 0; i < 16; i++) P.drawLeaf(ctx, rng() * 620, 330 + rng() * 80, 0.7, rng() * 3, '#d98a3a');
}
