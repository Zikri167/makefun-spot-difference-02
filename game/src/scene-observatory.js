// Scene 6 — Starlight Observatory: night hilltop drawn from seed 6606.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const observatoryDifferences = [
  makeDifference('obs-planet', 128, 92, 24, 'color', 'ringed planet turns red'),
  makeDifference('obs-star-count', 420, 70, 28, 'count', 'constellation loses a star'),
  makeDifference('obs-shooting', 250, 60, 22, 'removed', 'shooting star is gone'),
  makeDifference('obs-telescope', 356, 196, 24, 'moved', 'telescope tilts the other way'),
  makeDifference('obs-dome-light', 310, 148, 18, 'detail', 'dome window goes dark'),
  makeDifference('obs-rocket-window', 520, 236, 18, 'color', 'rocket window glows orange'),
  makeDifference('obs-campfire', 96, 356, 22, 'resized', 'campfire burns bigger'),
  makeDifference('obs-owl', 566, 300, 18, 'added', 'an owl lands on the signpost'),
  makeDifference('obs-moon-crater', 64, 300, 18, 'detail', 'moon crater vanishes'),
  makeDifference('obs-flag', 452, 286, 18, 'mirrored', 'tent flag flips direction'),
  makeDifference('obs-lantern', 196, 368, 16, 'removed', 'path lantern goes missing'),
  makeDifference('obs-comet', 480, 120, 20, 'color', 'comet tail turns green'),
];

export function drawObservatory(ctx, changed) {
  const rng = makeRng(6606);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#0b1030'], [0.6, '#1b2a52'], [1, '#2c3a63']]);
  // starfield (seeded, stable)
  ctx.fillStyle = '#eef2ff';
  for (let i = 0; i < 110; i++) { const sx = rng() * 620, sy = rng() * 240, sr = rng() * 1.5 + 0.4; ctx.globalAlpha = 0.4 + rng() * 0.6; P.circle(ctx, sx, sy, sr, '#eef2ff'); }
  ctx.globalAlpha = 1;
  // constellation (count difference)
  const cons = [[392, 52], [420, 70], [448, 60], [472, 84], [446, 104]];
  ctx.strokeStyle = 'rgba(190,210,255,0.5)'; ctx.lineWidth = 1.2; ctx.beginPath();
  cons.forEach(([cx, cy], i) => { if (changed.has('obs-star-count') && i === 1) return; i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy); }); ctx.stroke();
  cons.forEach(([cx, cy], i) => { if (changed.has('obs-star-count') && i === 1) return; P.drawStar(ctx, cx, cy, 5.4, '#ffe9a0'); });
  // shooting star
  if (!changed.has('obs-shooting')) { ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2.2; P.line(ctx, 250, 60, 214, 84, 'rgba(255,255,255,0.25)', 2.2); P.line(ctx, 250, 60, 226, 78, 'rgba(255,255,255,0.55)', 2.2); P.circle(ctx, 252, 59, 3, '#fff'); }
  // comet (color difference on tail)
  ctx.save(); ctx.translate(480, 120); ctx.rotate(-0.6);
  const tailCol = changed.has('obs-comet') ? 'rgba(90,255,170,0.55)' : 'rgba(140,190,255,0.55)';
  ctx.fillStyle = tailCol; P.poly(ctx, [[0, -5], [-58, -13], [-58, 9], [0, 5]]);
  P.circle(ctx, 0, 0, 8, '#eaf3ff'); ctx.restore();
  // ringed planet
  ctx.save(); ctx.translate(128, 92);
  P.circle(ctx, 0, 0, 21, changed.has('obs-planet') ? '#e05a4e' : '#c99ae0');
  ctx.strokeStyle = '#ffd98a'; ctx.lineWidth = 4.4; ctx.beginPath(); ctx.ellipse(0, 3, 36, 10, -0.25, 0, Math.PI * 2); ctx.stroke();
  P.circle(ctx, -7, -7, 5, 'rgba(255,255,255,0.35)'); ctx.restore();
  P.circle(ctx, 216, 150, 9, '#e0a35a'); P.circle(ctx, 556, 168, 6.4, '#9adbe8');
  // big moon low left with crater detail
  P.circle(ctx, 64, 300, 30, '#f4ecd8'); P.circle(ctx, 52, 292, 6, '#ddd2b8');
  if (!changed.has('obs-moon-crater')) P.circle(ctx, 76, 310, 5, '#ddd2b8');
  P.circle(ctx, 66, 284, 3.4, '#ddd2b8');
  // hill
  P.vGrad(ctx, 0, 286, 620, 144, [[0, '#24351f'], [1, '#141f10']]);
  P.ellipse(ctx, 310, 300, 380, 42, '#2c4423');
  // observatory dome
  ctx.fillStyle = '#c8cfdd'; ctx.fillRect(238, 196, 150, 74);
  ctx.beginPath(); ctx.arc(313, 196, 75, Math.PI, 0); ctx.fillStyle = '#9fb0cc'; ctx.fill();
  ctx.fillStyle = '#5d6d8a'; ctx.fillRect(300, 128, 26, 42);
  ctx.fillStyle = changed.has('obs-dome-light') ? '#2c3a55' : '#ffd76a'; ctx.fillRect(266, 214, 18, 20);
  ctx.fillStyle = '#3d4a63'; ctx.fillRect(330, 226, 24, 44);
  // telescope: tilts in changed panel
  ctx.save(); ctx.translate(356, 196); ctx.rotate(changed.has('obs-telescope') ? -0.95 : -0.45);
  ctx.fillStyle = '#e8b93e'; ctx.fillRect(0, -8, 66, 16);
  ctx.fillStyle = '#b8892e'; ctx.fillRect(58, -10.4, 12, 21); ctx.restore();
  P.line(ctx, 356, 200, 340, 238, '#8a93a5', 4); P.line(ctx, 356, 200, 374, 238, '#8a93a5', 4);
  // rocket
  ctx.save(); ctx.translate(520, 262);
  ctx.fillStyle = '#eef2f7'; ctx.beginPath(); ctx.ellipse(0, -18, 17, 42, 0, 0, Math.PI * 2); ctx.fill();
  P.poly(ctx, [[-17, 8], [-30, 34], [-6, 24]], '#e63946'); P.poly(ctx, [[17, 8], [30, 34], [6, 24]], '#e63946');
  P.circle(ctx, 0, -26, 7.4, changed.has('obs-rocket-window') ? '#ff9e3b' : '#7fd4ff');
  ctx.strokeStyle = '#9aa5b1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -26, 7.4, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffd23e'; P.poly(ctx, [[-6, 26], [6, 26], [0, 42]], '#ff9e3b'); ctx.restore();
  // tent with flag
  ctx.save(); ctx.translate(452, 316);
  P.poly(ctx, [[-34, 26], [34, 26], [0, -22]], '#3fae6a'); P.poly(ctx, [[0, -22], [34, 26], [6, 26]], '#2f8a52');
  P.line(ctx, 0, -22, 0, -40, '#d9d9d9', 2.2);
  ctx.save(); if (changed.has('obs-flag')) ctx.scale(-1, 1); P.poly(ctx, [[0, -40], [18, -36], [0, -31]], '#e63946'); ctx.restore(); ctx.restore();
  // signpost + owl (added)
  P.line(ctx, 566, 262, 566, 316, '#7a4a2b', 5);
  ctx.fillStyle = '#a9743f'; ctx.fillRect(538, 268, 56, 14); P.signText(ctx, 'STARS', 566, 275.4, 9.6, '#ffe9b0');
  if (changed.has('obs-owl')) { ctx.save(); ctx.translate(566, 254); ctx.fillStyle = '#8a6a45'; P.ellipse(ctx, 0, 0, 8.4, 10.4); P.circle(ctx, -3.4, -2, 2.2, '#fff'); P.circle(ctx, 3.4, -2, 2.2, '#fff'); P.circle(ctx, -3.4, -2, 1.1, '#222'); P.circle(ctx, 3.4, -2, 1.1, '#222'); ctx.restore(); }
  // campfire (resized)
  const fireS = changed.has('obs-campfire') ? 1.5 : 1;
  ctx.save(); ctx.translate(96, 362); ctx.scale(fireS, fireS);
  P.glowCircle(ctx, 0, -8, 34, 'rgba(255,160,60,0.4)');
  ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 5; P.line(ctx, -16, 8, 16, 2, '#7a4a2b', 5); P.line(ctx, 16, 8, -16, 2, '#7a4a2b', 5);
  P.ellipse(ctx, 0, -6, 8, 15, '#f4842b'); P.ellipse(ctx, 0, -2, 4.6, 9, '#ffd23e'); ctx.restore();
  // logs bench and path lanterns
  ctx.fillStyle = '#7a4a2b'; ctx.fillRect(140, 366, 52, 9);
  const lanternSpots = [[196, 368], [262, 384], [404, 380]];
  lanternSpots.forEach(([lx, ly], i) => { if (changed.has('obs-lantern') && i === 0) return; P.line(ctx, lx, ly, lx, ly - 16, '#4a3a20', 3); P.glowCircle(ctx, lx, ly - 21, 13, 'rgba(255,200,90,0.55)'); P.circle(ctx, lx, ly - 21, 4.4, '#ffd76a'); });
  // grass tufts
  ctx.strokeStyle = '#3d5c2e'; ctx.lineWidth = 2;
  for (let i = 0; i < 26; i++) { const gx = rng() * 620, gy = 330 + rng() * 84; P.line(ctx, gx, gy, gx + 3, gy - 9, '#3d5c2e', 2); }
}
