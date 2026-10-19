/* =========================================================
   AUDIO — musique d'ambiance + effets sonores
   Tout est synthétisé avec la Web Audio API : aucun fichier son requis.
   (Tu pourras remplacer par de vrais fichiers plus tard.)
   ========================================================= */

const SFX = (function () {
  let ctx = null, master = null, musicBus = null, sfxBus = null, noise = null;
  let muted = false, started = false, lastHover = 0;

  function init() {
    if (started) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    started = true;

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.75;
    sfxBus.connect(master);

    musicBus = ctx.createGain();
    musicBus.gain.setValueAtTime(0, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 5);
    musicBus.connect(master);

    const len = ctx.sampleRate * 2;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    startMusic();
  }

  /* ---------- Musique : nappe sombre + notes éparses + tic-tac ---------- */
  function startMusic() {
    const t = ctx.currentTime;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 2;
    lp.connect(musicBus);

    [[55, 'sawtooth', 0.16], [55.35, 'sawtooth', 0.16], [110.2, 'sine', 0.35], [82.4, 'triangle', 0.18]]
      .forEach(([f, type, v]) => {
        const o = ctx.createOscillator();
        o.type = type; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = v;
        o.connect(g); g.connect(lp); o.start(t);
      });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain(); lg.gain.value = 90;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t);

    const dl = ctx.createDelay(1.5); dl.delayTime.value = 0.52;
    const fb = ctx.createGain(); fb.gain.value = 0.5;
    const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 1600;
    dl.connect(dlp); dlp.connect(fb); fb.connect(dl); dlp.connect(musicBus);

    const notes = [220, 261.63, 293.66, 329.63, 392, 440];
    (function note() {
      const n = ctx.currentTime + 0.05;
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)] * (Math.random() < 0.2 ? 0.5 : 1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, n);
      g.gain.linearRampToValueAtTime(0.16, n + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, n + 2.6);
      o.connect(g); g.connect(musicBus); g.connect(dl);
      o.start(n); o.stop(n + 2.8);
      setTimeout(note, 2600 + Math.random() * 4200);
    })();

    setInterval(() => {
      if (!ctx || ctx.state !== 'running') return;
      burst(0.025, 'highpass', 4500, 0.05, musicBus);
    }, 1000);
  }

  /* ---------- Petits outils ---------- */
  function burst(dur, type, freq, vol, bus, when) {
    if (!ctx) return;
    const t = ctx.currentTime + (when || 0);
    const s = ctx.createBufferSource(); s.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus || sfxBus);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }

  function tone(freq, dur, type, vol, when, bus) {
    if (!ctx) return;
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + 0.05);
  }

  /* ---------- Effets ---------- */
  function hover() {
    if (!ctx || muted) return;
    const n = performance.now();
    if (n - lastHover < 80) return;
    lastHover = n;
    tone(760 + Math.random() * 120, 0.07, 'sine', 0.06);
    burst(0.03, 'bandpass', 2400, 0.04);
  }

  function swoosh() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const s = ctx.createBufferSource(); s.buffer = noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(3600, t + 0.45);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
    s.connect(bp); bp.connect(g); g.connect(sfxBus);
    s.start(t); s.stop(t + 0.7);
  }

  function paper() {
    if (!ctx) return;
    for (let i = 0; i < 6; i++) {
      burst(0.05 + Math.random() * 0.05, 'highpass', 1800 + Math.random() * 1500, 0.12 + Math.random() * 0.08, sfxBus, i * 0.045 + Math.random() * 0.03);
    }
  }

  function keys() {
    if (!ctx) return;
    for (let i = 0; i < 9; i++) {
      const w = i * 0.035 + Math.random() * 0.03;
      tone(2200 + Math.random() * 3200, 0.3, 'triangle', 0.1, w);
      burst(0.04, 'bandpass', 4200, 0.07, sfxBus, w);
    }
  }

  function camera() {
    if (!ctx) return;
    burst(0.05, 'bandpass', 1800, 0.5, sfxBus, 0);
    burst(0.06, 'bandpass', 1100, 0.45, sfxBus, 0.08);
    tone(140, 0.12, 'square', 0.05, 0.02);
  }

  function typewriter() {
    if (!ctx) return;
    for (let i = 0; i < 6; i++) {
      burst(0.03, 'bandpass', 2600 + Math.random() * 900, 0.3, sfxBus, i * 0.075 + Math.random() * 0.02);
    }
    tone(1300, 0.15, 'sine', 0.05, 0.5);
  }

  function stamp() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.connect(g); g.connect(sfxBus);
    o.start(t); o.stop(t + 0.3);
    burst(0.06, 'lowpass', 900, 0.4);
  }

  function unlock() {
    if (!ctx) return;
    [440, 554.37, 659.25, 880].forEach((f, i) => tone(f, 1.2, 'triangle', 0.16, i * 0.12));
    tone(220, 1.6, 'sine', 0.16, 0);
  }

  function toggleMute() {
    muted = !muted;
    if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
    return muted;
  }

  return { init, hover, swoosh, paper, keys, camera, typewriter, stamp, unlock, toggleMute };
})();
