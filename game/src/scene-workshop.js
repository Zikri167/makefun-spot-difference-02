// Scene 4 — Clockwork Workshop: inventor's workshop drawn from seed 4404.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const workshopDifferences = [
  makeDifference('work-clock-hands', 118, 108, 24, 'detail', 'wall clock shows a different time'),
  makeDifference('work-gear-color', 300, 96, 26, 'color', 'big gear turns copper'),
  makeDifference('work-robot-eye', 474, 238, 20, 'color', 'robot eye glows red'),
  makeDifference('work-bottle-count', 540, 176, 26, 'count', 'one bottle fewer on the shelf'),
  makeDifference('work-blueprint', 168, 268, 24, 'detail', 'blueprint gear sketch vanishes'),
  makeDifference('work-candle', 356, 246, 17, 'removed', 'candle flame goes out'),
  makeDifference('work-wrench', 236, 298, 20, 'moved', 'wrench slides along the bench'),
  makeDifference('work-moon', 556, 66, 20, 'removed', 'moon missing from window'),
  makeDifference('work-key', 84, 330, 20, 'added', 'a brass key appears on the floor'),
  makeDifference('work-pendulum', 118, 176, 18, 'mirrored', 'pendulum swings the other way'),
  makeDifference('work-book', 420, 168, 18, 'color', 'book spine turns green'),
  makeDifference('work-bulb', 310, 40, 18, 'resized', 'hanging bulb grows bigger'),
];

function clockFace(ctx, x, y, r, hourAng, minAng) {
  P.circle(ctx, x, y, r, '#f7ecd2'); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 4; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; P.line(ctx, x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92, '#7a4a2b', 2); }
  P.line(ctx, x, y, x + Math.cos(hourAng) * r * 0.5, y + Math.sin(hourAng) * r * 0.5, '#333', 3.6);
  P.line(ctx, x, y, x + Math.cos(minAng) * r * 0.74, y + Math.sin(minAng) * r * 0.74, '#333', 2.4);
  P.circle(ctx, x, y, 3, '#c22f4a');
}
function bottle(ctx, x, y, color, h) {
  ctx.fillStyle = color; ctx.fillRect(x - 7, y - h, 14, h); ctx.fillRect(x - 3, y - h - 7, 6, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x - 4.6, y - h + 4, 3.4, h - 10);
}

export function drawWorkshop(ctx, changed) {
  const rng = makeRng(4404);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#4a3421'], [1, '#2b1d12']]);
  ctx.fillStyle = '#5d422a'; for (let i = 0; i < 7; i++) ctx.fillRect(0, 60 + i * 54, 620, 3);
  P.speckle(ctx, rng, 0, 0, 620, 430, 50, '#1d1208', 2);
  // window with moonlight (right)
  ctx.fillStyle = '#1d2f4a'; ctx.fillRect(500, 22, 104, 116);
  ctx.strokeStyle = '#7a4a2b'; ctx.lineWidth = 5; ctx.strokeRect(500, 22, 104, 116);
  P.line(ctx, 552, 22, 552, 138, '#7a4a2b', 4); P.line(ctx, 500, 80, 604, 80, '#7a4a2b', 4);
  if (!changed.has('work-moon')) { P.circle(ctx, 556, 52, 15, '#f4ecd8'); P.circle(ctx, 550, 48, 12, '#1d2f4a'); }
  ctx.fillStyle = '#dfe9f5'; for (let i = 0; i < 14; i++) P.circle(ctx, 508 + rng() * 88, 28 + rng() * 100, 1.2, '#dfe9f5');
  ctx.fillStyle = 'rgba(190,215,255,0.10)'; P.poly(ctx, [[500, 138], [604, 138], [580, 300], [470, 300]]);
  // hanging bulb
  P.line(ctx, 310, 0, 310, 26, '#191008', 3);
  P.glowCircle(ctx, 310, 44, changed.has('work-bulb') ? 52 : 38, 'rgba(255,205,100,0.5)');
  P.circle(ctx, 310, 42, changed.has('work-bulb') ? 13 : 9, '#ffd76a');
  // wall clock with pendulum
  clockFace(ctx, 118, 108, 40, changed.has('work-clock-hands') ? 2.4 : -1.1, changed.has('work-clock-hands') ? 0.6 : 2.8);
  ctx.fillStyle = '#7a4a2b'; ctx.fillRect(102, 148, 32, 58);
  const pendX = 118 + (changed.has('work-pendulum') ? 10 : -10);
  P.line(ctx, 118, 152, pendX, 192, '#d9a441', 3); P.circle(ctx, pendX, 196, 8, '#d9a441');
  // second small clock
  clockFace(ctx, 212, 84, 24, 0.8, -2.0);
  // gears cluster
  P.drawGear(ctx, 300, 96, 30, 9, changed.has('work-gear-color') ? '#c47b3b' : '#9aa5b1', '#2b2118');
  P.drawGear(ctx, 346, 124, 20, 8, '#b08d4f', '#2b2118');
  P.drawGear(ctx, 268, 132, 16, 7, '#7d8a99', '#2b2118');
  P.drawGear(ctx, 392, 84, 14, 7, '#b08d4f', '#2b2118');
  // shelf with bottles and books
  ctx.fillStyle = '#7a4a2b'; ctx.fillRect(420, 186, 180, 8);
  const bottles = [[446, '#3fae6a'], [472, '#3b8ea5'], [498, '#c94f6d'], [524, '#3fae6a'], [550, '#e6a23b'], [576, '#3b8ea5']];
  bottles.forEach(([bx, bc], i) => { if (changed.has('work-bottle-count') && i === 4) return; bottle(ctx, bx, 186, bc, 30 + (i % 3) * 6); });
  ctx.fillStyle = '#7a4a2b'; ctx.fillRect(404, 128, 92, 7);
  const books = [[416, '#c22f4a'], [434, '#3b6fd4'], [452, '#e6a23b'], [470, '#8a4b8f']];
  books.forEach(([bx, bc], i) => { ctx.fillStyle = changed.has('work-book') && i === 1 ? '#3fae6a' : bc; ctx.fillRect(bx, 96, 15, 32); });
  // blueprint on wall
  ctx.fillStyle = '#274b73'; ctx.fillRect(128, 232, 96, 66);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.2; for (let i = 1; i < 4; i++) P.line(ctx, 128 + i * 24, 232, 128 + i * 24, 298, 'rgba(255,255,255,0.3)', 1);
  if (!changed.has('work-blueprint')) { ctx.beginPath(); ctx.arc(168, 268, 16, 0, Math.PI * 2); ctx.strokeStyle = '#cfe6ff'; ctx.lineWidth = 2.4; ctx.stroke(); ctx.beginPath(); ctx.arc(168, 268, 6, 0, Math.PI * 2); ctx.stroke(); }
  P.line(ctx, 196, 248, 214, 248, '#cfe6ff', 2); P.line(ctx, 196, 258, 208, 258, '#cfe6ff', 2);
  // workbench
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(60, 300, 380, 16);
  ctx.fillStyle = '#6e4525'; ctx.fillRect(76, 316, 14, 74); ctx.fillRect(410, 316, 14, 74);
  ctx.fillStyle = '#54371d'; ctx.fillRect(60, 390, 380, 10);
  // tools on bench: hammer, screwdriver, wrench (moved)
  ctx.save(); ctx.translate(150, 296); ctx.rotate(-0.5); ctx.fillStyle = '#9aa5b1'; ctx.fillRect(-4, -22, 9, 24); ctx.fillStyle = '#7a4a2b'; ctx.fillRect(-2.4, 0, 5, 20); ctx.restore();
  P.line(ctx, 320, 298, 348, 282, '#c22f4a', 5); P.circle(ctx, 350, 281, 4, '#9aa5b1');
  const wrenchX = changed.has('work-wrench') ? 262 : 236;
  ctx.save(); ctx.translate(wrenchX, 296); ctx.rotate(0.35); ctx.strokeStyle = '#c8d2dc'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, -8, 7, 0.8, 5.6); ctx.stroke(); P.line(ctx, 0, -2, 0, 14, '#c8d2dc', 5); ctx.restore();
  // candle
  ctx.fillStyle = '#e8e0cc'; ctx.fillRect(350, 262, 12, 34);
  if (!changed.has('work-candle')) { P.glowCircle(ctx, 356, 248, 20, 'rgba(255,180,60,0.55)'); P.ellipse(ctx, 356, 250, 4.6, 8, '#ffb340'); P.ellipse(ctx, 356, 253, 2.2, 4, '#fff2b0'); }
  // small robot
  ctx.save(); ctx.translate(474, 268);
  ctx.fillStyle = '#8fa3b8'; P.roundRect(ctx, -24, -22, 48, 46, 8, '#8fa3b8', '#5d6d7e');
  ctx.fillStyle = '#aebfd2'; ctx.fillRect(-30, -34, 60, 18);
  P.circle(ctx, -11, -25, 5.4, changed.has('work-robot-eye') ? '#ff4d4d' : '#54e0c0'); P.circle(ctx, 11, -25, 5.4, changed.has('work-robot-eye') ? '#ff4d4d' : '#54e0c0');
  P.line(ctx, 0, -34, 0, -46, '#5d6d7e', 2.6); P.circle(ctx, 0, -49, 4, '#ffd76a');
  ctx.fillStyle = '#5d6d7e'; ctx.fillRect(-16, 2, 32, 5);
  ctx.fillStyle = '#ffd76a'; ctx.fillRect(-7, -12, 14, 8);
  ctx.fillRect(-36, -12, 9, 26); ctx.fillRect(27, -12, 9, 26); ctx.restore();
  // floor, rug, key (added)
  P.vGrad(ctx, 0, 400, 620, 30, [[0, '#3a2716'], [1, '#241708']]);
  ctx.fillStyle = '#7a2e3e'; P.ellipse(ctx, 280, 412, 150, 13, '#7a2e3e');
  if (changed.has('work-key')) { ctx.save(); ctx.translate(84, 332); ctx.strokeStyle = '#e8b93e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke(); P.line(ctx, 7, 4, 24, 16, '#e8b93e', 4); P.line(ctx, 19, 11, 24, 6, '#e8b93e', 3.4); ctx.restore(); }
  // scattered screws
  ctx.fillStyle = '#c8d2dc'; [[520, 380], [548, 392], [96, 356], [180, 372]].forEach(([sx, sy]) => P.circle(ctx, sx, sy, 2.6, '#c8d2dc'));
}
