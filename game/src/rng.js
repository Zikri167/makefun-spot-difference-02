// Seeded RNG (mulberry32) and small helpers. Scene drawing uses only this,
// never Math.random or Date.now, so every load renders identically.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function range(rng, lo, hi) { return lo + rng() * (hi - lo); }
export function rangeInt(rng, lo, hi) { return Math.floor(range(rng, lo, hi + 1)); }
export function pick(rng, list) { return list[Math.floor(rng() * list.length) % list.length]; }
export function shuffleFromSeed(seed, list) {
  const rng = makeRng(seed); const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = out[i]; out[i] = out[j]; out[j] = t; }
  return out;
}
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
export function lerp(a, b, t) { return a + (b - a) * t; }
