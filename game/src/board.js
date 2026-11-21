// Board rendering: both panels, found markers, sparkles, hint pulse,
// miss X marks and the brief shake after a wrong click.
import { PANEL_W, PANEL_H, markerRadius } from './differences.js';

export function createBoard(leftCanvas, rightCanvas) {
  const leftCtx = leftCanvas.getContext('2d');
  const rightCtx = rightCanvas.getContext('2d');
  const allIdsCache = new Map();
  function allIds(scene) {
    if (!allIdsCache.has(scene.id)) allIdsCache.set(scene.id, new Set(scene.differences.map(d => d.id)));
    return allIdsCache.get(scene.id);
  }
  function drawPanel(ctx, scene, changedSet) {
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);
    scene.draw(ctx, changedSet);
  }
  function drawMarker(ctx, d, index, ageMs) {
    const t = Math.min(1, ageMs / 320);
    const r = markerRadius(d, t);
    ctx.save();
    ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 4.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x, d.y, r + 4.4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(90,50,0,0.85)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(d.x + r * 0.72, d.y - r * 0.72, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb703'; ctx.fill(); ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.fillStyle = '#3a2400'; ctx.font = '700 11px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(index + 1), d.x + r * 0.72, d.y - r * 0.72 + 0.5);
    ctx.restore();
  }
  function drawSparkles(ctx, particles, now) {
    for (const p of particles) {
      const life = 1 - (now - p.born) / 620; if (life <= 0) continue;
      ctx.globalAlpha = life;
      ctx.fillStyle = '#ffd94d';
      ctx.beginPath(); ctx.arc(p.x + p.vx * (now - p.born) / 16, p.y + p.vy * (now - p.born) / 16, 2.4 * life + 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawHintPulse(ctx, hint, now) {
    if (!hint) return;
    const age = now - hint.start; if (age < 0 || age > 2000) return;
    const pulse = 0.5 + 0.5 * Math.sin(age / 140);
    ctx.save();
    ctx.beginPath(); ctx.arc(hint.x, hint.y, 52 + pulse * 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,240,160,' + (0.55 + pulse * 0.4) + ')'; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(hint.x, hint.y, 70 + pulse * 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,240,160,0.3)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }
  function drawMiss(ctx, miss, now) {
    if (!miss) return;
    const age = now - miss.start; if (age > 480) return;
    ctx.save(); ctx.globalAlpha = 1 - age / 480;
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 4.6; ctx.lineCap = 'round';
    const s = 11;
    ctx.beginPath(); ctx.moveTo(miss.x - s, miss.y - s); ctx.lineTo(miss.x + s, miss.y + s);
    ctx.moveTo(miss.x + s, miss.y - s); ctx.lineTo(miss.x - s, miss.y + s); ctx.stroke();
    ctx.restore();
  }
  return {
    render(scene, view, now) {
      const shake = view.shakeUntil > now ? Math.sin(now / 28) * 4 : 0;
      for (const [ctx, changedSet, panelName] of [[leftCtx, new Set(), 'left'], [rightCtx, allIds(scene), 'right']]) {
        ctx.save(); ctx.translate(shake, 0);
        drawPanel(ctx, scene, changedSet);
        scene.differences.forEach((d, i) => { if (view.foundIds.has(d.id)) drawMarker(ctx, d, i, now - (view.foundAt.get(d.id) || now)); });
        drawSparkles(ctx, view.particles, now);
        drawHintPulse(ctx, view.hintPulse, now);
        drawMiss(ctx, view.missPanel === panelName ? view.missMark : null, now);
        ctx.restore();
      }
    },
  };
}
