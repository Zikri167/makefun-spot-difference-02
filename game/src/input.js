// Pointer handling: maps canvas clicks to panel space (620x430) so hit
// testing is identical at any display size, on either panel.
import { PANEL_W, PANEL_H } from './differences.js';

export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * PANEL_W;
  const y = (event.clientY - rect.top) / rect.height * PANEL_H;
  return { x, y };
}
export function attachPanelInput(canvases, onTap) {
  canvases.forEach((canvas, idx) => {
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const p = panelPoint(canvas, event);
      onTap(p.x, p.y, idx === 0 ? 'left' : 'right');
    });
  });
}
