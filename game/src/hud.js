// HUD updates: timer bar, counters, pips, score, streak, hint bulbs,
// and overlay show/hide helpers for every screen of the game.
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
export function createHud(root) {
  const el = (id) => root.querySelector('#' + id);
  const hud = {
    sceneName: el('scene-name'), timerText: el('timer-text'), timerFill: el('timer-fill'),
    timerBar: el('timer-bar'), foundText: el('found-text'), togoText: el('togo-text'),
    pips: el('pips'), scoreText: el('score-text'), streakText: el('streak-text'),
    hintPips: el('hint-pips'),
    show(id) { root.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden')); if (id) { const o = el(id); if (o) o.classList.remove('hidden'); } },
    hideOverlays() { this.show(null); },
    setScene(scene, index) { this.sceneName.textContent = 'Scene ' + (index + 1) + ' · ' + scene.title; },
    setTimer(left, limit) {
      this.timerText.textContent = formatTime(left);
      const frac = Math.max(0, left / limit);
      this.timerFill.style.width = (frac * 100).toFixed(1) + '%';
      this.timerBar.classList.toggle('danger', left <= 30 && left > 0);
      this.timerText.classList.toggle('danger-text', left <= 30 && left > 0);
    },
    setFound(found, total) {
      this.foundText.textContent = 'FOUND ' + found + ' / ' + total;
      this.togoText.textContent = (total - found) + ' TO GO';
      this.pips.innerHTML = '';
      for (let i = 0; i < total; i++) { const s = document.createElement('span'); s.className = 'pip' + (i < found ? ' filled' : ''); this.pips.appendChild(s); }
    },
    setScore(score) { this.scoreText.textContent = 'SCORE ' + score; },
    setStreak(streak, mult) {
      this.streakText.textContent = streak >= 2 ? 'STREAK x' + mult : 'STREAK —';
      this.streakText.classList.toggle('hot', streak >= 3);
    },
    setHints(left, total) {
      this.hintPips.innerHTML = '';
      for (let i = 0; i < total; i++) { const s = document.createElement('span'); s.className = 'bulb' + (i < left ? ' lit' : ''); s.textContent = '●'; this.hintPips.appendChild(s); }
    },
  };
  return hud;
}
export function starString(n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); }
