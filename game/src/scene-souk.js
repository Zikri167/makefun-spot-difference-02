// Scene 3 — Souk at Dusk: desert market drawn from seed 3303.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const soukDifferences = [
  makeDifference('souk-awning', 118, 196, 26, 'color', 'awning stripes turn teal'),
  makeDifference('souk-lantern-count', 330, 128, 28, 'count', 'one lantern fewer on the wire'),
  makeDifference('souk-camel-saddle', 492, 262, 24, 'color', 'camel saddle turns purple'),
  makeDifference('souk-pot', 210, 330, 20, 'removed', 'a clay pot is missing'),
  makeDifference('souk-carpet', 392, 330, 24, 'detail', 'carpet pattern loses its diamond'),
  makeDifference('souk-spice', 84, 302, 20, 'color', 'spice pile turns green'),
  makeDifference('souk-sun', 540, 74, 24, 'resized', 'sun shrinks at dusk'),
  makeDifference('souk-cat', 286, 366, 18, 'added', 'a cat naps by the stall'),
  makeDifference('souk-sign', 452, 190, 20, 'detail', 'sign letter changes'),
  makeDifference('souk-jug', 556, 318, 18, 'mirrored', 'jug handle flips side'),
  makeDifference('souk-bird', 150, 84, 20, 'count', 'one bird leaves the flock'),
  makeDifference('souk-dates', 160, 268, 18, 'removed', 'hanging dates vanish'),
];

function stall(ctx, x, y, awnA, awnB, label) {
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(x, y, 118, 86);
  ctx.fillStyle = '#6e4525'; ctx.fillRect(x, y, 8, 86); ctx.fillRect(x + 110, y, 8, 86);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? awnB : awnA; P.poly(ctx, [[x - 8 + i * 23, y], [x + 15 + i * 23, y], [x + 24 + i * 23, y - 26], [x + 1 + i * 23, y - 26]]); }
  if (label) P.signText(ctx, label, x + 59, y + 18, 12, '#ffe9b0');
}
function pot(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, 11 * s, 13 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - 6 * s, y - 16 * s, 12 * s, 5 * s);
}
function lantern(ctx, x, y, color) {
  P.line(ctx, x, y - 14, x, y - 6, '#4a2f16', 1.6);
  P.glowCircle(ctx, x, y + 4, 16, 'rgba(255,190,80,0.5)');
  ctx.fillStyle = color; ctx.fillRect(x - 6, y - 6, 12, 17);
  ctx.fillStyle = '#ffe9a0'; ctx.fillRect(x - 3.4, y - 3, 6.8, 10);
  ctx.fillStyle = '#4a2f16'; ctx.fillRect(x - 7, y - 9, 14, 3.4);
}

export function drawSouk(ctx, changed) {
  const rng = makeRng(3303);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#ff9e5e'], [0.5, '#ffc98a'], [0.78, '#f7e3b0'], [1, '#e8c890']]);
  P.glowCircle(ctx, 540, 74, 90, 'rgba(255,220,130,0.65)');
  P.circle(ctx, 540, 74, changed.has('souk-sun') ? 21 : 30, '#ffdf6b');
  // birds
  ctx.strokeStyle = '#6b4a3a'; ctx.lineWidth = 2;
  const birds = [[120, 70], [150, 84], [182, 66]];
  birds.forEach(([bx, by], i) => { if (changed.has('souk-bird') && i === 1) return; ctx.beginPath(); ctx.arc(bx - 7, by, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.beginPath(); ctx.arc(bx + 7, by, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
  // dunes and skyline
  P.ellipse(ctx, 90, 250, 260, 60, '#eebd7f'); P.ellipse(ctx, 540, 262, 280, 66, '#e5ae68');
  ctx.fillStyle = '#c98d54'; ctx.fillRect(240, 148, 60, 62); ctx.fillRect(316, 162, 44, 48);
  P.circle(ctx, 270, 148, 30, '#c98d54'); ctx.fillStyle = '#a06a32'; ctx.fillRect(262, 182, 16, 28);
  // lantern wire
  ctx.beginPath(); ctx.moveTo(20, 96); ctx.quadraticCurveTo(310, 150, 600, 92); ctx.strokeStyle = '#5d3a17'; ctx.lineWidth = 2; ctx.stroke();
  const lanterns = [[110, 116, '#e63946'], [205, 130, '#3fae6a'], [330, 128, '#3b6fd4'], [452, 124, '#e6a23b'], [548, 108, '#9b59d0']];
  lanterns.forEach(([lx, ly, lc], i) => { if (changed.has('souk-lantern-count') && i === 2) return; lantern(ctx, lx, ly, lc); });
  // ground
  P.vGrad(ctx, 0, 336, 620, 94, [[0, '#dcb078'], [1, '#b98a4e']]);
  P.speckle(ctx, rng, 0, 344, 620, 80, 80, '#8a6234', 1.7);
  // left stall: spices
  stall(ctx, 34, 222, changed.has('souk-awning') ? '#1f9e8f' : '#e63946', '#fff3d6', 'SPICES');
  const spicePiles = [[64, '#e63946'], [96, '#f4842b'], [128, '#ffd23e']];
  spicePiles.forEach(([sx, sc], i) => { const col = changed.has('souk-spice') && i === 0 ? '#3fae6a' : sc; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(20 + sx - 34, 302, 17, Math.PI, 0); ctx.fill(); P.ellipse(ctx, 20 + sx - 34, 302, 20, 6, '#8a5a33'); });
  if (!changed.has('souk-dates')) { ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 2; P.line(ctx, 160, 226, 160, 252, '#7a4a2b', 2); ctx.fillStyle = '#8a4b8f'; for (let i = 0; i < 4; i++) P.circle(ctx, 160 + (i % 2 ? 5 : -5), 248 + i * 6, 4.4, '#8a4b8f'); }
  // middle stall: pottery and carpets
  stall(ctx, 196, 222, '#3b6fd4', '#fff3d6', 'POTS');
  pot(ctx, 222, 322, 1, '#c96f3b'); if (!changed.has('souk-pot')) pot(ctx, 210, 330, 0.8, '#a8562e');
  pot(ctx, 246, 330, 0.85, '#d98a4a'); pot(ctx, 272, 320, 1.05, '#b85c30');
  // rolled carpets
  ctx.save(); ctx.translate(392, 330);
  ctx.fillStyle = '#9b2c4a'; ctx.fillRect(-30, -34, 60, 68);
  ctx.fillStyle = '#c94f6d'; ctx.fillRect(-30, -34, 60, 9); ctx.fillRect(-30, 25, 60, 9);
  if (!changed.has('souk-carpet')) { ctx.save(); ctx.translate(0, 0); ctx.rotate(Math.PI / 4); ctx.fillStyle = '#ffd23e'; ctx.fillRect(-9, -9, 18, 18); ctx.restore(); }
  P.circle(ctx, 0, 0, 4.6, '#ffd23e'); ctx.restore();
  ctx.fillStyle = '#2c7a8c'; ctx.fillRect(338, 292, 12, 44); ctx.fillStyle = '#e6a23b'; ctx.fillRect(356, 300, 12, 36);
  // right stall: sign and jugs
  stall(ctx, 430, 222, '#e6a23b', '#fff3d6', changed.has('souk-sign') ? 'TE4' : 'TEA');
  ctx.save(); ctx.translate(556, 318); if (changed.has('souk-jug')) ctx.scale(-1, 1);
  ctx.fillStyle = '#3b8ea5'; ctx.beginPath(); ctx.ellipse(0, 4, 13, 17, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(16, -2, 8, -1.2, 1.6); ctx.strokeStyle = '#3b8ea5'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillRect(-5, -18, 10, 6); ctx.restore();
  pot(ctx, 470, 336, 0.9, '#c96f3b'); pot(ctx, 500, 342, 0.7, '#d98a4a');
  // camel
  ctx.save(); ctx.translate(492, 268);
  ctx.fillStyle = '#c98d54'; P.ellipse(ctx, 0, 0, 42, 20); P.circle(ctx, -16, -22, 13, '#c98d54'); P.ellipse(ctx, 44, -14, 15, 10, '#c98d54'); P.circle(ctx, 56, -18, 2.2, '#332211');
  ctx.fillRect(-30, 12, 6, 30); ctx.fillRect(22, 12, 6, 30); ctx.fillRect(-6, 14, 6, 28);
  ctx.fillStyle = changed.has('souk-camel-saddle') ? '#8a4bff' : '#c22f4a'; ctx.fillRect(-24, -16, 34, 15);
  ctx.fillStyle = '#ffd23e'; ctx.fillRect(-24, -4, 34, 4); ctx.restore();
  // cat (added)
  if (changed.has('souk-cat')) { ctx.save(); ctx.translate(286, 372); ctx.fillStyle = '#4a4a55'; P.ellipse(ctx, 0, 0, 15, 7); P.circle(ctx, 14, -4, 6, '#4a4a55'); P.poly(ctx, [[10, -9], [12, -15], [15, -9]], '#4a4a55'); ctx.strokeStyle = '#4a4a55'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-16, -2, 7, 0.4, 2.4); ctx.stroke(); ctx.restore(); }
  // spice sacks front
  ctx.fillStyle = '#a9743f'; P.ellipse(ctx, 70, 396, 30, 14); ctx.fillStyle = '#f4842b'; P.ellipse(ctx, 70, 390, 22, 8);
  ctx.fillStyle = '#8a5a33'; P.ellipse(ctx, 540, 398, 32, 14); ctx.fillStyle = '#e63946'; P.ellipse(ctx, 540, 392, 23, 8);
  P.speckle(ctx, rng, 0, 200, 620, 130, 36, '#fff2cf', 1.2);
}
