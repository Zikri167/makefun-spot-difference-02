// Scene 1 — Coral Kingdom: underwater reef drawn from seed 1101.
import { makeRng } from './rng.js';
import { makeDifference } from './differences.js';
import * as P from './painter.js';

export const reefDifferences = [
  makeDifference('reef-shell', 84, 356, 22, 'color', 'shell turns purple'),
  makeDifference('reef-fish-count', 300, 120, 30, 'count', 'one fish leaves the school'),
  makeDifference('reef-turtle-spot', 452, 268, 24, 'detail', 'turtle shell spot vanishes'),
  makeDifference('reef-chest-gem', 528, 352, 20, 'removed', 'gem missing from chest'),
  makeDifference('reef-bubble', 196, 128, 18, 'removed', 'diver bubble gone'),
  makeDifference('reef-coral-color', 120, 238, 26, 'color', 'coral turns orange'),
  makeDifference('reef-starfish', 356, 378, 20, 'added', 'extra starfish appears'),
  makeDifference('reef-anemone', 556, 210, 22, 'resized', 'anemone grows bigger'),
  makeDifference('reef-seahorse', 250, 300, 20, 'mirrored', 'seahorse faces the other way'),
  makeDifference('reef-ray', 398, 62, 24, 'removed', 'a light ray is missing'),
  makeDifference('reef-pearl', 84, 356, 0, 'detail', 'placeholder'),
  makeDifference('reef-weed', 602, 330, 18, 'count', 'seaweed loses a frond'),
];
// Fix the pearl entry: it shares the shell spot, give it its own clam.
reefDifferences[10] = makeDifference('reef-pearl', 168, 384, 18, 'removed', 'pearl missing from clam');

function coralBranch(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  ctx.lineWidth = 7 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4 * s, y - 34 * s, x - 6 * s, y - 58 * s); ctx.stroke();
  ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x, y - 26 * s); ctx.quadraticCurveTo(x + 18 * s, y - 40 * s, x + 24 * s, y - 62 * s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - 14 * s); ctx.quadraticCurveTo(x - 16 * s, y - 24 * s, x - 22 * s, y - 44 * s); ctx.stroke();
  P.circle(ctx, x - 6 * s, y - 60 * s, 5 * s, color); P.circle(ctx, x + 24 * s, y - 64 * s, 4 * s, color); P.circle(ctx, x - 22 * s, y - 46 * s, 4 * s, color);
}
function anemone(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 4 * s;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + i * 6 * s, y - 16 * s, x + i * 8 * s, y - 24 * s - Math.abs(i)); ctx.stroke(); P.circle(ctx, x + i * 8 * s, y - 25 * s, 2.6 * s, '#ffd9ec'); }
  P.ellipse(ctx, x, y + 2, 16 * s, 6 * s, '#7a4a8c');
}
function seaweed(ctx, x, y, h, fronds, color) {
  ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 5;
  for (let i = 0; i < fronds; i++) { const xx = x + i * 9; ctx.beginPath(); ctx.moveTo(xx, y); ctx.quadraticCurveTo(xx + 8, y - h * 0.5, xx - 4, y - h); ctx.stroke(); }
}

export function drawReef(ctx, changed) {
  const rng = makeRng(1101);
  P.vGrad(ctx, 0, 0, 620, 430, [[0, '#7fd4e8'], [0.45, '#2e8fb8'], [1, '#14506e']]);
  // light rays
  ctx.fillStyle = 'rgba(255,255,210,0.13)';
  const rays = [70, 210, 398, 520];
  for (const rx of rays) { if (changed.has('reef-ray') && rx === 398) continue; P.poly(ctx, [[rx, 0], [rx + 34, 0], [rx + 74, 300], [rx + 28, 300]]); }
  // distant rocks and sand
  P.ellipse(ctx, 120, 436, 260, 42, '#0d4258'); P.ellipse(ctx, 520, 440, 240, 48, '#0d4258');
  P.vGrad(ctx, 0, 372, 620, 58, [[0, '#e8d193'], [1, '#c9a86a']]);
  P.speckle(ctx, rng, 0, 380, 620, 46, 90, '#8a6f3e', 1.8);
  // coral garden
  coralBranch(ctx, 60, 380, 1.05, '#ff6b9d'); coralBranch(ctx, 470, 386, 0.9, '#ff8fab');
  coralBranch(ctx, 120, 300, 0.85, changed.has('reef-coral-color') ? '#ffa53b' : '#ff6b9d');
  coralBranch(ctx, 330, 392, 0.75, '#c86bfa'); coralBranch(ctx, 580, 300, 0.7, '#ff6b9d');
  anemone(ctx, 210, 368, 1, '#ff9de2'); anemone(ctx, 556, 222, changed.has('reef-anemone') ? 1.45 : 0.95, '#b388ff');
  anemone(ctx, 410, 356, 0.85, '#ff9de2');
  seaweed(ctx, 20, 400, 74, 3, '#2fae5f'); seaweed(ctx, 596, 398, 84, changed.has('reef-weed') ? 2 : 3, '#2fae5f'); seaweed(ctx, 286, 404, 60, 2, '#57c46a');
  // school of fish
  const school = [[268, 104], [300, 120], [332, 102], [286, 138], [318, 140], [352, 124]];
  school.forEach(([fx, fy], i) => { if (changed.has('reef-fish-count') && i === 5) return; P.drawFish(ctx, fx, fy, 0.85, i % 2 ? '#ffb340' : '#ffd23e', false); });
  P.drawFish(ctx, 90, 170, 1.05, '#4dd0e1', false); P.drawFish(ctx, 520, 96, 0.9, '#ff8a65', true);
  // sea turtle
  ctx.save(); ctx.translate(452, 276);
  P.ellipse(ctx, 0, 0, 52, 32, '#3e9c5f'); P.ellipse(ctx, 0, -3, 42, 24, '#57b877');
  ctx.fillStyle = '#2e7d4f';
  if (!changed.has('reef-turtle-spot')) { P.circle(ctx, -12, -8, 8); ctx.fillStyle = '#2e7d4f'; P.circle(ctx, 14, 4, 6); }
  P.circle(ctx, 12, -12, 5, '#2e7d4f');
  P.ellipse(ctx, 58, -10, 14, 10, '#8bc98b'); P.circle(ctx, 62, -12, 2, '#123');
  P.ellipse(ctx, -48, 20, 16, 7, '#8bc98b'); P.ellipse(ctx, 40, 24, 16, 7, '#8bc98b'); ctx.restore();
  // diver with bubbles
  ctx.save(); ctx.translate(196, 190); ctx.rotate(0.25);
  P.ellipse(ctx, 0, 0, 30, 12, '#24425e'); P.circle(ctx, -34, -6, 10, '#ffd9a0');
  ctx.fillStyle = 'rgba(160,220,255,0.7)'; ctx.fillRect(-42, -12, 15, 7);
  P.poly(ctx, [[24, 4], [48, 16], [30, 12]], '#f4b63f'); P.poly(ctx, [[24, -4], [48, -16], [30, -12]], '#f4b63f');
  ctx.fillStyle = '#f4b63f'; ctx.fillRect(-8, -20, 16, 10); ctx.restore();
  const bubbles = [[196, 128], [182, 104], [206, 82]];
  bubbles.forEach(([bx, by], i) => { if (changed.has('reef-bubble') && i === 0) return; P.drawBubble(ctx, bx, by, 6 - i); });
  // treasure chest
  ctx.save(); ctx.translate(528, 356);
  P.roundRect(ctx, -34, -8, 68, 30, 5, '#8a5a2b', '#5d3a17');
  ctx.beginPath(); ctx.arc(0, -8, 34, Math.PI, 0); ctx.fillStyle = '#a06a32'; ctx.fill(); ctx.strokeStyle = '#5d3a17'; ctx.stroke();
  ctx.fillStyle = '#ffd23e'; ctx.fillRect(-4, -12, 8, 14);
  P.circle(ctx, -18, -16, 5, '#ffd23e'); P.circle(ctx, 16, -18, 5, '#ffd23e');
  if (!changed.has('reef-chest-gem')) P.drawStar(ctx, 0, -22, 7, '#ff4d6d');
  ctx.restore();
  // shells, clam with pearl, starfish
  P.ellipse(ctx, 84, 360, 20, 13, changed.has('reef-shell') ? '#9b7bff' : '#ffb3c8'); ctx.strokeStyle = '#d17a97'; for (let i = -2; i <= 2; i++) P.line(ctx, 84, 372, 84 + i * 8, 350, '#d17a97', 1.4);
  ctx.save(); ctx.translate(168, 388); ctx.beginPath(); ctx.arc(0, 0, 17, Math.PI, 0); ctx.fillStyle = '#c9a0dc'; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 2, 17, 0, Math.PI); ctx.fillStyle = '#a87cc0'; ctx.fill();
  if (!changed.has('reef-pearl')) P.circle(ctx, 0, -2, 5.5, '#fff6ea'); ctx.restore();
  P.drawStar(ctx, 250, 392, 11, '#ffa53b');
  if (changed.has('reef-starfish')) P.drawStar(ctx, 356, 378, 10, '#ff7b54');
  // seahorse
  ctx.save(); ctx.translate(250, 300); if (changed.has('reef-seahorse')) ctx.scale(-1, 1);
  ctx.strokeStyle = '#ffd23e'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 15, -0.6, 2.4); ctx.stroke();
  P.circle(ctx, -13, -16, 7, '#ffd23e'); P.poly(ctx, [[-18, -20], [-26, -14], [-17, -11]], '#ffd23e'); ctx.restore();
  // drifting motes
  P.speckle(ctx, rng, 0, 0, 620, 360, 60, '#dff6ff', 1.3);
  // soft vignette so the reef edges feel deep
  const vg = ctx.createRadialGradient(310, 205, 190, 310, 215, 430);
  vg.addColorStop(0, 'rgba(0,20,40,0)'); vg.addColorStop(1, 'rgba(0,20,40,0.28)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, 620, 430);
}
