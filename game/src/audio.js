// WebAudio synth: every sound is generated, no audio files. Starts lazily
// on the first user gesture. A gentle pad loop hums under play when unmuted.
export function createAudio(state) {
  let ctx = null; let master = null; let padNodes = null;
  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = state.muted ? 0 : 0.5;
    master.connect(ctx.destination); return ctx;
  }
  function tone(freq, dur, type, vol, when, slideTo) {
    if (state.muted) return; const c = ensure(); if (!c) return;
    const t0 = c.currentTime + (when || 0);
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noiseBurst(dur, vol, freq) {
    if (state.muted) return; const c = ensure(); if (!c) return;
    const len = Math.floor(c.sampleRate * dur); const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.sin(i * 12.9898) * 43758.5453 % 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq || 800;
    const g = c.createGain(); g.gain.value = vol || 0.2;
    src.connect(f); f.connect(g); g.connect(master); src.start();
  }
  return {
    unlock() { ensure(); },
    setMuted() { if (master) master.gain.value = state.muted ? 0 : 0.5; if (state.muted) this.stopPad(); },
    clickBlip() { tone(660, 0.07, 'triangle', 0.15); },
    findChime(streak) { const base = 523 * Math.pow(1.059, Math.min(streak, 8)); tone(base, 0.22, 'sine', 0.25); tone(base * 1.5, 0.3, 'sine', 0.2, 0.06); tone(base * 2, 0.34, 'triangle', 0.12, 0.12); },
    missBuzz() { tone(140, 0.25, 'sawtooth', 0.18, 0, 90); noiseBurst(0.12, 0.08, 500); },
    hintShimmer() { tone(880, 0.3, 'sine', 0.16); tone(1174, 0.4, 'sine', 0.14, 0.09); tone(1568, 0.5, 'sine', 0.1, 0.18); },
    tick() { tone(1050, 0.045, 'square', 0.07); },
    fanfare() { const n = [523, 659, 784, 1046, 784, 1046, 1318]; n.forEach((f, i) => tone(f, 0.32, 'triangle', 0.22, i * 0.11)); },
    startPad() {
      if (state.muted || padNodes) return; const c = ensure(); if (!c) return;
      const g = c.createGain(); g.gain.value = 0.035; g.connect(master);
      const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 196;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 294;
      o1.connect(g); o2.connect(g); o1.start(); o2.start(); padNodes = { o1, o2, g };
    },
    stopPad() { if (!padNodes) return; try { padNodes.o1.stop(); padNodes.o2.stop(); } catch (e) {} padNodes = null; },
  };
}
