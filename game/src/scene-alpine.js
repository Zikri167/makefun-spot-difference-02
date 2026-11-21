// Scene 2 — Alpine Postcard: snowy village drawn from seed 2202.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const alpineDifferences = [
  makeDifference('alp-window', 148, 236, 20, 'detail', 'chalet window goes dark'),
  makeDifference('alp-smoke', 268, 148, 22, 'removed', 'chimney smoke vanishes'),
  makeDifference('alp-snowman-hat', 452, 316, 20, 'color', 'snowman hat turns blue'),
  makeDifference('alp-cablecar', 392, 118, 24, 'color', 'cable car turns green'),
  makeDifference('alp-skier', 540, 262, 22, 'removed', 'a skier disappears'),
  makeDifference('alp-pine-count', 52, 210, 26, 'count', 'one pine tree fewer'),
  makeDifference('alp-flag', 330, 196, 18, 'detail', 'lodge flag loses a stripe'),
  makeDifference('alp-deer', 96, 330, 22, 'added', 'a deer appears by the trees'),
  makeDifference('alp-peak-flag', 556, 74, 18, 'removed', 'summit flag is gone'),
  makeDifference('alp-lamp', 238, 292, 17, 'color', 'street lamp glows pink'),
  makeDifference('alp-sled', 368, 352, 22, 'moved', 'sled slides downhill'),
  makeDifference('alp-moon', 64, 58, 20, 'resized', 'moon grows larger'),
];

function chalet(ctx, x, y, s, wall, litSeed) {
  ctx.fillStyle = wall; ctx.fillRect(x, y, 84 * s, 58 * s);
  P.poly(ctx, [[x - 10 * s, y], [x + 94 * s, y], [x + 42 * s, y - 38 * s]], '#7a4a2b');
  ctx.fillStyle = '#fff'; P.poly(ctx, [[x - 10 * s, y], [x + 94 * s, y], [x + 42 * s, y - 38 * s]], 'rgba(255,255,255,0.55)');
  ctx.fillStyle = '#5d3a17'; ctx.fillRect(x + 34 * s, y + 26 * s, 16 * s, 32 * s);
  return { wx: x + 14 * s, wy: y + 14 * s, s };
}
function windowLight(ctx, x, y, s, lit, color) {
  ctx.fillStyle = lit ? (color || '#ffd76a') : '#33404f'; ctx.fillRect(x, y, 15 * s, 15 * s);
  ctx.strokeStyle = '#5d3a17'; ctx.lineWidth = 1.6; ctx.strokeRect(x, y, 15 * s, 15 * s);
  P.line(ctx, x + 7.5 * s, y, x + 7.5 * s, y + 15 * s, '#5d3a17', 1.2);
}

export function drawAlpine(ctx, changed) {
  const rng = makeRng(2202);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#a8cdf0'], [0.55, '#dceefb'], [1, '#ffffff']]);
  P.circle(ctx, 64, 58, changed.has('alp-moon') ? 27 : 19, '#fdf6d8'); P.circle(ctx, 56, 52, changed.has('alp-moon') ? 22 : 15, '#e8eef7');
  // peaks
  P.poly(ctx, [[380, 190], [556, 30], [620, 130], [620, 210]], '#8fa8c4');
  P.poly(ctx, [[556, 30], [520, 84], [556, 74], [578, 96], [596, 66]], '#ffffff');
  P.poly(ctx, [[180, 200], [330, 74], [470, 200]], '#a9bed6');
  P.poly(ctx, [[330, 74], [296, 122], [330, 112], [356, 132], [378, 104]], '#ffffff');
  if (!changed.has('alp-peak-flag')) { P.line(ctx, 556, 32, 556, 14, '#7a4a2b', 2.4); P.poly(ctx, [[556, 14], [574, 18], [556, 23]], '#e63946'); }
  // cable car line
  P.line(ctx, 180, 60, 610, 150, '#44566b', 2);
  const carX = 392, carY = 118;
  P.line(ctx, carX, 96, carX, carY - 14, '#44566b', 3);
  P.roundRect(ctx, carX - 22, carY - 14, 44, 30, 5, changed.has('alp-cablecar') ? '#3fae6a' : '#e63946', '#5d2330');
  ctx.fillStyle = '#cfeaf7'; ctx.fillRect(carX - 15, carY - 8, 30, 11);
  // snowy ground
  P.vGrad(ctx, 0, 286, 620, 144, [[0, '#ffffff'], [1, '#d7e7f5']]);
  P.ellipse(ctx, 140, 300, 240, 26, '#eef6fd'); P.ellipse(ctx, 500, 312, 260, 24, '#eef6fd');
  // pine forest left and right
  const pines = [[30, 236], [52, 210], [76, 238], [566, 226], [596, 244], [540, 204]];
  pines.forEach(([px, py], i) => { if (changed.has('alp-pine-count') && i === 1) return; P.drawPine(ctx, px, py + 34, 62, '#5d3a17', '#2e6b46'); ctx.fillStyle = 'rgba(255,255,255,0.75)'; P.poly(ctx, [[px - 8, py + 2], [px + 8, py + 2], [px, py - 16]], 'rgba(255,255,255,0.75)'); });
  // chalets
  const c1 = chalet(ctx, 106, 208, 1, '#b07a45'); windowLight(ctx, c1.wx, c1.wy, 1, !changed.has('alp-window')); windowLight(ctx, c1.wx + 48, c1.wy, 1, true);
  const c2 = chalet(ctx, 226, 190, 0.9, '#9c6a3e'); windowLight(ctx, c2.wx, c2.wy, 0.9, true); windowLight(ctx, c2.wx + 42, c2.wy, 0.9, false);
  // chimney smoke on second chalet
  ctx.fillStyle = '#6b4a26'; ctx.fillRect(262, 140, 13, 22);
  if (!changed.has('alp-smoke')) { ctx.fillStyle = 'rgba(240,244,248,0.9)'; P.circle(ctx, 268, 128, 8, 'rgba(240,244,248,0.9)'); P.circle(ctx, 276, 112, 11, 'rgba(240,244,248,0.8)'); P.circle(ctx, 288, 94, 14, 'rgba(240,244,248,0.65)'); }
  // lodge with flag
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(306, 214, 96, 54);
  P.poly(ctx, [[298, 214], [402, 214], [354, 182]], '#633d1f');
  P.line(ctx, 354, 182, 354, 158, '#4a2f16', 2.4);
  ctx.fillStyle = '#e63946'; ctx.fillRect(354, 158, 24, 13);
  if (!changed.has('alp-flag')) { ctx.fillStyle = '#fff'; ctx.fillRect(354, 162.5, 24, 4); }
  P.signText(ctx, 'LODGE', 354, 240, 13, '#ffe9b0');
  // street lamp
  P.line(ctx, 238, 292, 238, 250, '#33404f', 3.4); P.glowCircle(ctx, 238, 246, 20, changed.has('alp-lamp') ? 'rgba(255,120,200,0.55)' : 'rgba(255,214,106,0.55)');
  P.circle(ctx, 238, 246, 6, changed.has('alp-lamp') ? '#ff78c8' : '#ffd76a');
  // snowman
  ctx.save(); ctx.translate(452, 330);
  P.circle(ctx, 0, 8, 20, '#ffffff'); P.circle(ctx, 0, -20, 14, '#ffffff');
  P.circle(ctx, -5, -23, 2, '#222'); P.circle(ctx, 5, -23, 2, '#222'); P.poly(ctx, [[0, -19], [12, -16], [0, -14]], '#f4842b');
  ctx.fillStyle = changed.has('alp-snowman-hat') ? '#3b6fd4' : '#222831'; ctx.fillRect(-11, -40, 22, 6); ctx.fillRect(-7, -52, 14, 13);
  ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 3; P.line(ctx, -16, -14, -30, -24, '#7a4a2b', 3); P.line(ctx, 16, -14, 30, -22, '#7a4a2b', 3); ctx.restore();
  // skiers
  function skier(x, y, color) { ctx.strokeStyle = color; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; P.line(ctx, x, y, x + 8, y + 12, color, 3.4); P.line(ctx, x + 8, y + 12, x - 6, y + 18, color, 3); P.line(ctx, x + 8, y + 12, x + 18, y + 16, color, 3); P.circle(ctx, x, y - 6, 4.6, color); P.line(ctx, x - 14, y + 23, x + 22, y + 19, '#33404f', 2.4); }
  skier(500, 238, '#3b6fd4'); if (!changed.has('alp-skier')) skier(540, 262, '#e63946');
  // sled (moved in changed panel)
  const sledX = changed.has('alp-sled') ? 398 : 368, sledY = changed.has('alp-sled') ? 372 : 352;
  ctx.strokeStyle = '#a03b2a'; ctx.lineWidth = 3; P.line(ctx, sledX - 18, sledY + 10, sledX + 20, sledY + 10, '#a03b2a', 3); P.line(ctx, sledX - 12, sledY + 10, sledX - 12, sledY, '#a03b2a', 2.4); P.line(ctx, sledX + 12, sledY + 10, sledX + 12, sledY, '#a03b2a', 2.4);
  ctx.fillStyle = '#e0a32e'; ctx.fillRect(sledX - 14, sledY - 6, 30, 7);
  // deer (added)
  if (changed.has('alp-deer')) { ctx.save(); ctx.translate(96, 336); ctx.fillStyle = '#a9743f'; P.ellipse(ctx, 0, 0, 17, 10); P.circle(ctx, 18, -12, 7, '#a9743f'); ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 2; P.line(ctx, 15, -18, 11, -26, '#7a4a2b', 2); P.line(ctx, 20, -18, 24, -26, '#7a4a2b', 2); ctx.fillStyle = '#a9743f'; ctx.fillRect(-12, 6, 4, 12); ctx.fillRect(9, 6, 4, 12); ctx.restore(); }
  // falling snow
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 70; i++) P.circle(ctx, rng() * 620, rng() * 300, 1 + rng() * 1.8, 'rgba(255,255,255,0.9)');
}
