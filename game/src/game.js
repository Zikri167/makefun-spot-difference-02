// Game controller: scene lifecycle, tick loop, find/miss/hint logic,
// scoring and streaks, completion and star rating, all screens' wiring.
import { SCENES } from './scenes.js';
import { hitTest, nearestUnfound } from './differences.js';
import { createBoard } from './board.js';
import { createHud, starString } from './hud.js';
import { attachPanelInput } from './input.js';
import { createCampaignState, recordCompletion, starsForScore, saveCampaign } from './state.js';
import { createAudio } from './audio.js';

export function streakMultiplier(streak) { return Math.min(4, 1 + Math.floor(streak / 3)); }

export function createGame(root) {
  const campaign = createCampaignState(SCENES.length);
  const audio = createAudio(campaign);
  const hud = createHud(root);
  const board = createBoard(root.querySelector('#panel-left'), root.querySelector('#panel-right'));
  const view = { foundIds: new Set(), foundAt: new Map(), particles: [], hintPulse: null, missMark: null, missPanel: null, shakeUntil: 0 };
  const run = {
    sceneIndex: 0, scene: SCENES[0], playing: false, paused: false, over: false,
    timeLeft: 0, lastTickSecond: -1, score: 0, streak: 0, bestStreak: 0,
    clicks: 0, hits: 0, hintsLeft: 0, hintReadyAt: 0, startedAt: 0,
  };
  let rafId = 0; let lastFrame = 0;

  function el(id) { return root.querySelector('#' + id); }
  function syncHud() {
    hud.setTimer(run.timeLeft, run.scene.timeLimit);
    hud.setFound(view.foundIds.size, run.scene.differences.length);
    hud.setScore(run.score); hud.setStreak(run.streak, streakMultiplier(run.streak));
    hud.setHints(run.hintsLeft, run.scene.hints);
  }
  function renderLevelCards() {
    const wrap = el('level-cards'); wrap.innerHTML = '';
    SCENES.forEach((scene, i) => {
      const locked = i >= campaign.unlocked;
      const card = document.createElement('button');
      card.className = 'level-card' + (locked ? ' locked' : '');
      card.disabled = locked;
      card.innerHTML = '<span class="lc-num">SCENE ' + (i + 1) + '</span>' +
        '<span class="lc-title">' + scene.title + '</span>' +
        '<span class="lc-sub">' + scene.subtitle + '</span>' +
        '<span class="lc-meta">12 differences · ' + Math.round(scene.timeLimit / 60 * 10) / 10 + ' min</span>' +
        '<span class="lc-stars">' + (locked ? 'LOCKED' : starString(campaign.stars[i])) + '</span>' +
        '<span class="lc-best">' + (campaign.bestScores[i] ? 'Best ' + campaign.bestScores[i] : '') + '</span>';
      card.addEventListener('click', () => { audio.unlock(); audio.clickBlip(); showIntro(i); });
      wrap.appendChild(card);
    });
  }
  function showTitle() { stopLoop(); hud.show('screen-title'); }
  function showLevels() { stopLoop(); renderLevelCards(); hud.show('screen-levels'); }
  function showIntro(index) {
    run.sceneIndex = index; run.scene = SCENES[index];
    el('intro-title').textContent = 'Scene ' + (index + 1) + ' — ' + run.scene.title;
    el('intro-sub').textContent = run.scene.subtitle + '. Find all 12 differences before the timer runs out.';
    hud.show('screen-intro');
  }
  function startScene(index) {
    run.sceneIndex = index; run.scene = SCENES[index];
    view.foundIds = new Set(); view.foundAt = new Map(); view.particles = []; view.hintPulse = null; view.missMark = null;
    run.playing = true; run.paused = false; run.over = false;
    run.timeLeft = run.scene.timeLimit; run.lastTickSecond = -1;
    run.score = 0; run.streak = 0; run.bestStreak = 0; run.clicks = 0; run.hits = 0;
    run.hintsLeft = run.scene.hints; run.hintReadyAt = 0; run.startedAt = performance.now();
    hud.setScene(run.scene, index); hud.hideOverlays(); syncHud();
    audio.startPad(); startLoop();
  }
  function startLoop() { cancelAnimationFrame(rafId); lastFrame = performance.now(); rafId = requestAnimationFrame(frame); }
  function stopLoop() { cancelAnimationFrame(rafId); }
  function frame(now) {
    if (!run.playing) return;
    const dt = Math.min(0.1, (now - lastFrame) / 1000); lastFrame = now;
    if (!run.paused && !run.over) {
      run.timeLeft -= dt;
      const whole = Math.ceil(run.timeLeft);
      if (whole !== run.lastTickSecond) { run.lastTickSecond = whole; hud.setTimer(run.timeLeft, run.scene.timeLimit); if (whole <= 10 && whole > 0) audio.tick(); }
      if (run.timeLeft <= 0) { run.timeLeft = 0; timeUp(); }
    }
    view.particles = view.particles.filter(p => now - p.born < 650);
    board.render(run.scene, view, now);
    rafId = requestAnimationFrame(frame);
  }
  function burst(x, y, now) {
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; view.particles.push({ x, y, vx: Math.cos(a) * 1.7, vy: Math.sin(a) * 1.7 - 0.5, born: now }); }
  }
  function onTap(px, py, panel) {
    audio.unlock();
    if (!run.playing || run.paused || run.over) return;
    run.clicks++;
    const now = performance.now();
    const hit = hitTest(run.scene.differences, view.foundIds, px, py);
    if (hit) {
      run.hits++; run.streak++; run.bestStreak = Math.max(run.bestStreak, run.streak);
      const gained = 150 * streakMultiplier(run.streak - 1);
      run.score += gained;
      view.foundIds.add(hit.id); view.foundAt.set(hit.id, now);
      burst(hit.x, hit.y, now);
      audio.findChime(run.streak);
      syncHud();
      if (view.foundIds.size >= run.scene.differences.length) completeScene();
    } else {
      run.streak = 0; run.score = Math.max(0, run.score - 25); run.timeLeft = Math.max(0, run.timeLeft - 5);
      view.missMark = { x: px, y: py, start: now }; view.missPanel = panel; view.shakeUntil = now + 260;
      audio.missBuzz(); syncHud();
      if (run.timeLeft <= 0) timeUp();
    }
  }
  function useHint() {
    if (!run.playing || run.paused || run.over) return;
    const now = performance.now();
    if (run.hintsLeft <= 0 || now < run.hintReadyAt) return;
    const target = nearestUnfound(run.scene.differences, view.foundIds);
    if (!target) return;
    run.hintsLeft--; run.hintReadyAt = now + 15000;
    view.hintPulse = { x: target.x, y: target.y, start: now };
    audio.hintShimmer(); syncHud();
  }
  function completeScene() {
    run.over = true;
    const timeBonus = Math.floor(run.timeLeft) * 5;
    run.score += timeBonus;
    const accuracy = run.clicks ? run.hits / run.clicks : 1;
    const stars = starsForScore(view.foundIds.size, run.scene.differences.length, accuracy, run.timeLeft, run.scene.timeLimit);
    recordCompletion(campaign, run.sceneIndex, stars, run.score);
    audio.fanfare(); audio.stopPad();
    el('complete-title').textContent = run.scene.title + ' — Complete!';
    el('complete-stars').textContent = starString(stars);
    el('complete-breakdown').innerHTML =
      '<div>Finds: ' + view.foundIds.size + ' / 12</div>' +
      '<div>Best streak: ' + run.bestStreak + '</div>' +
      '<div>Time bonus: +' + timeBonus + ' (' + Math.floor(run.timeLeft) + 's left)</div>' +
      '<div>Accuracy: ' + Math.round(accuracy * 100) + '%</div>' +
      '<div class="total-line">Score: ' + run.score + '</div>' +
      (campaign.campaignDone && run.sceneIndex === SCENES.length - 1 ? '<div class="campaign-note">Campaign complete — you finished the whole Twin Atlas!</div>' : '');
    el('btn-next').textContent = run.sceneIndex < SCENES.length - 1 ? 'Next Scene' : 'Back to Levels';
    hud.show('screen-complete'); syncHud();
  }
  function timeUp() {
    if (run.over) return;
    run.over = true; audio.missBuzz(); audio.stopPad();
    el('timeup-text').textContent = 'Time ran out on ' + run.scene.title + ' with ' + view.foundIds.size + ' of 12 found.';
    hud.show('screen-timeup');
  }
  function togglePause(force) {
    if (!run.playing || run.over) return;
    run.paused = force !== undefined ? force : !run.paused;
    if (run.paused) { hud.show('screen-pause'); audio.stopPad(); } else { hud.hideOverlays(); audio.startPad(); lastFrame = performance.now(); }
  }
  function toggleMute() {
    campaign.muted = !campaign.muted; saveCampaign(campaign); audio.setMuted();
    el('btn-mute').textContent = campaign.muted ? 'Unmute (M)' : 'Mute (M)';
    if (!campaign.muted) audio.clickBlip();
  }

  attachPanelInput([el('panel-left'), el('panel-right')], onTap);
  el('btn-play').addEventListener('click', () => { audio.unlock(); audio.clickBlip(); showLevels(); });
  el('btn-how').addEventListener('click', () => { audio.unlock(); hud.show('screen-how'); });
  el('btn-how-back').addEventListener('click', () => showTitle());
  el('btn-levels-back').addEventListener('click', () => showTitle());
  el('btn-start-scene').addEventListener('click', () => { audio.clickBlip(); startScene(run.sceneIndex); });
  el('btn-intro-back').addEventListener('click', () => showLevels());
  el('btn-hint').addEventListener('click', useHint);
  el('btn-pause').addEventListener('click', () => togglePause());
  el('btn-restart').addEventListener('click', () => startScene(run.sceneIndex));
  el('btn-mute').addEventListener('click', toggleMute);
  el('btn-resume').addEventListener('click', () => togglePause(false));
  el('btn-pause-restart').addEventListener('click', () => startScene(run.sceneIndex));
  el('btn-pause-levels').addEventListener('click', () => { run.playing = false; showLevels(); });
  el('btn-retry').addEventListener('click', () => startScene(run.sceneIndex));
  el('btn-timeup-levels').addEventListener('click', () => { run.playing = false; showLevels(); });
  el('btn-next').addEventListener('click', () => { if (run.sceneIndex < SCENES.length - 1) showIntro(run.sceneIndex + 1); else { run.playing = false; showLevels(); } });
  el('btn-complete-levels').addEventListener('click', () => { run.playing = false; showLevels(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') togglePause();
    else if (event.key === 'h' || event.key === 'H') useHint();
    else if (event.key === 'm' || event.key === 'M') toggleMute();
  });
  el('btn-mute').textContent = campaign.muted ? 'Unmute (M)' : 'Mute (M)';
  hud.setScene(run.scene, 0); syncHud();
  board.render(run.scene, view, performance.now());
  showTitle();
  // Test hooks: harmless handles the maker's own playtest drives.
  window.__twinAtlas = { startScene, showLevels, showIntro, run, view, campaign, onTap, useHint, togglePause };
  return { startScene, showLevels, run, view, campaign };
}
