// Campaign state: unlocked scenes, stars, best scores, mute setting.
// Kept in memory; a guarded localStorage mirror persists it when allowed.
const STORAGE_KEY = 'twin-atlas-campaign-v1';
export function createCampaignState(sceneCount) {
  const state = {
    unlocked: 1,
    stars: new Array(sceneCount).fill(0),
    bestScores: new Array(sceneCount).fill(0),
    completed: new Array(sceneCount).fill(false),
    muted: false,
    campaignDone: false,
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Number.isFinite(saved.unlocked)) state.unlocked = Math.max(1, Math.min(sceneCount, saved.unlocked));
      if (Array.isArray(saved.stars)) saved.stars.forEach((v, i) => { if (i < sceneCount) state.stars[i] = v | 0; });
      if (Array.isArray(saved.bestScores)) saved.bestScores.forEach((v, i) => { if (i < sceneCount) state.bestScores[i] = v | 0; });
      if (Array.isArray(saved.completed)) saved.completed.forEach((v, i) => { if (i < sceneCount) state.completed[i] = !!v; });
      state.muted = !!saved.muted; state.campaignDone = !!saved.campaignDone;
    }
  } catch (e) { /* storage unavailable: play in-memory */ }
  return state;
}
export function saveCampaign(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      unlocked: state.unlocked, stars: state.stars, bestScores: state.bestScores,
      completed: state.completed, muted: state.muted, campaignDone: state.campaignDone,
    }));
  } catch (e) { /* ignore */ }
}
export function recordCompletion(state, index, stars, score) {
  state.completed[index] = true;
  state.stars[index] = Math.max(state.stars[index], stars);
  state.bestScores[index] = Math.max(state.bestScores[index], score);
  state.unlocked = Math.max(state.unlocked, Math.min(state.stars.length, index + 2));
  if (index === state.stars.length - 1) state.campaignDone = true;
  saveCampaign(state);
}
export function starsForScore(found, total, accuracy, timeLeft, timeLimit) {
  if (found < total) return 0;
  let stars = 1;
  if (accuracy >= 0.6 && timeLeft > 0) stars = 2;
  if (accuracy >= 0.82 && timeLeft >= timeLimit * 0.18) stars = 3;
  return stars;
}
