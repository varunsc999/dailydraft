// Sound effects, music and rain, all synthesised with Web Audio.

// ─── SOUND ───
// Everything is synthesised with the Web Audio API, so there are no sound files to load.
const Sound = (() => {
  let ctx, master, musicOut, humNodes = null, rainNodes = null, muted = false, musicOff = false;
  try { muted = localStorage.getItem('dd-muted') === '1'; musicOff = localStorage.getItem('dd-music-off') === '1'; } catch {}
  const VOL = .55;
  function init() {
    if (ctx) return ctx.state === 'suspended' && ctx.resume();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : VOL;
    master.connect(ctx.destination);
    musicOut = ctx.createGain();
    musicOut.gain.value = musicOff ? 0 : VOL;
    musicOut.connect(ctx.destination);
  }
  function noise(sec) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }
  function gainEnv(t, peak, attack, decay) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    g.connect(master);
    return g;
  }
  function tone(freq, type, peak, decay, delay = 0) {
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.connect(gainEnv(t, peak, .005, decay));
    o.start(t);
    o.stop(t + decay + .05);
  }
  // filtered noise whose band sweeps from f0 to f1
  function sweep(dur, f0, f1, peak, q = 1.2) {
    const t = ctx.currentTime;
    const n = noise(dur + .05);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t);
    bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    n.connect(bp).connect(gainEnv(t, peak, dur * .3, dur * .7));
    n.start(t);
  }

  // ── background music ──
  // A slow, quiet loop for soft felt piano over a warm pad, washed in a long reverb.
  // Four chords falling step by step (Fmaj7, Em7, Dm7, Cadd9) at 66 bpm, played twice with a different melody each time.
  const BEAT = 60 / 66;
  const CHORDS = [
    { bass: 41, pad: [57, 60, 64] },   // Fmaj7
    { bass: 40, pad: [55, 59, 62] },   // Em7
    { bass: 38, pad: [53, 57, 60] },   // Dm7
    { bass: 36, pad: [52, 55, 62] },   // Cadd9
  ];
  // [beat, midi note, how long it rings in beats] for each chord, first pass then second pass
  const MELODY = [
    [[0, 69, 3], [1.5, 72, 3], [3, 76, 4], [5, 74, 2], [6, 72, 4]],
    [[0, 71, 3], [1.5, 74, 3], [3, 79, 4], [4.5, 76, 3], [6, 74, 4]],
    [[0, 69, 3], [1.5, 72, 3], [3, 77, 4], [5, 76, 2], [6, 72, 4]],
    [[0, 67, 3], [2, 74, 3], [3, 76, 3], [4.5, 79, 3], [6, 76, 6]],
    [[0, 81, 4], [2, 79, 2], [3, 76, 4], [6, 72, 4]],
    [[0, 79, 4], [2, 74, 3], [4, 71, 5]],
    [[0, 77, 3], [2, 76, 2], [3, 72, 3], [5, 69, 4]],
    [[0, 76, 3], [2, 74, 2], [3, 67, 3], [4, 72, 8]],
  ];
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  let bus, verb, nextAt = 0, step = 0, musicTimer = null;
  function makeReverb() {
    const len = ctx.sampleRate * 3.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    const cv = ctx.createConvolver();
    cv.buffer = ir;
    return cv;
  }
  // felt piano: a soft sine with a little triangle and octave for body, dulled by a low-pass
  function piano(m, t, ring, vel) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1500 + vel * 1600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel * .16, t + .012);
    g.gain.exponentialRampToValueAtTime(vel * .07, t + .35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + .35 + ring * BEAT * 1.4);
    lp.connect(g);
    g.connect(bus);
    g.connect(verb);
    for (const [mul, type, amt] of [[1, 'sine', 1], [1, 'triangle', .28], [2, 'sine', .12], [3, 'sine', .04]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type;
      o.frequency.value = hz(m) * mul;
      o.detune.value = (Math.random() - .5) * 6;
      og.gain.value = amt;
      o.connect(og).connect(lp);
      o.start(t);
      o.stop(t + .4 + ring * BEAT * 1.4);
    }
  }
  // pad: two slightly detuned sines per note that swell in and fade out under the chord
  function pad(notes, t, dur) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(.035, t + 1.8);
    g.gain.setValueAtTime(.035, t + dur - .6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.6);
    lp.connect(g);
    g.connect(bus);
    g.connect(verb);
    for (const m of notes) for (const d of [-5, 5]) {
      const o = ctx.createOscillator();
      o.frequency.value = hz(m);
      o.detune.value = d;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 1.8);
    }
  }
  function scheduleChord(t) {
    const c = CHORDS[step % 4];
    const len = 8 * BEAT;
    pad(c.pad, t, len);
    piano(c.bass, t, 7, .55);
    piano(c.bass + 7, t + 4 * BEAT, 4, .35);
    for (const [b, m, r] of MELODY[step % 8]) piano(m, t + b * BEAT, r, .5 + Math.random() * .25);
    step++;
    return len;
  }
  function musicOn() {
    if (!ctx || musicTimer) return;
    bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    bus.gain.exponentialRampToValueAtTime(.7, ctx.currentTime + 4);
    bus.connect(musicOut);
    verb = makeReverb();
    const wet = ctx.createGain();
    wet.gain.value = .55;
    verb.connect(wet).connect(bus);
    nextAt = ctx.currentTime + .3;
    // schedule a little ahead so timing stays steady even when the page is busy
    const tick = () => { if (nextAt < ctx.currentTime) nextAt = ctx.currentTime + .1; // after a long pause, don't pile up missed chords
      while (nextAt < ctx.currentTime + 2) nextAt += scheduleChord(nextAt); };
    tick();
    musicTimer = setInterval(tick, 400);
  }

  const ok = () => ctx && !muted;
  return {
    init,
    musicOn,
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      try { localStorage.setItem('dd-muted', m ? '1' : '0'); } catch {}
      if (master) master.gain.setTargetAtTime(m ? 0 : VOL, ctx.currentTime, .05);
    },
    get musicOff() { return musicOff; },
    setMusicOff(m) {
      musicOff = m;
      try { localStorage.setItem('dd-music-off', m ? '1' : '0'); } catch {}
      if (musicOut) musicOut.gain.setTargetAtTime(m ? 0 : VOL, ctx.currentTime, .3);
    },
    // a low rumble of the belt motor while you're seated
    humOn() {
      if (!ctx || humNodes) return;
      const n = noise(2);
      n.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 160;
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(.12, ctx.currentTime, .4);
      const o = ctx.createOscillator();
      o.frequency.value = 52;
      const og = ctx.createGain();
      og.gain.value = .025;
      n.connect(lp).connect(g).connect(master);
      o.connect(og).connect(g);
      n.start();
      o.start();
      humNodes = { n, o, g };
    },
    humOff() {
      if (!humNodes) return;
      const { n, o, g } = humNodes;
      g.gain.setTargetAtTime(0, ctx.currentTime, .2);
      setTimeout(() => { n.stop(); o.stop(); }, 900);
      humNodes = null;
    },
    unroll() { if (ok()) sweep(.85, 500, 3200, .35, .9); },            // paper swish
    take() { if (ok()) { tone(520, 'triangle', .5, .12); tone(1300, 'sine', .18, .08); } },   // wooden tok
    clink() { if (ok()) { tone(2400, 'sine', .12, .25); tone(3150, 'sine', .07, .3, .01); } }, // plate on the stack
    pass() { if (ok()) sweep(.35, 1400, 380, .22, .8); },              // soft whoosh
    tick(last) { if (ok()) tone(last ? 1900 : 1500, 'square', .05, .04); },
    chime() { if (ok()) [660, 880, 1320].forEach((f, i) => tone(f, 'sine', .22, .9, i * .12)); },
    // steady soft rain: hiss on top, a low patter underneath
    rainOn() {
      if (!ctx || rainNodes) return;
      const n = noise(3);
      n.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 700;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
      const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 700;
      const g = ctx.createGain(), gl = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.05, ctx.currentTime + 3);
      gl.gain.value = .6;
      n.connect(hp).connect(lp).connect(g);
      n.connect(low).connect(gl).connect(g);
      g.connect(musicOut);
      n.start();
      rainNodes = n;
    },
    lantern() { if (ok()) { tone(1568, 'sine', .1, 1.4, .15); tone(2093, 'sine', .07, 1.6, .3); tone(784, 'triangle', .05, 1.2, .15); } }, // a soft bell as a lantern lights
  };
})();
addEventListener('pointerdown', function firstTap() {
  removeEventListener('pointerdown', firstTap);
  Sound.init();
  Sound.musicOn();
  if (rainy) Sound.rainOn();
});
function syncMute() {
  $('muteIco').src = `assets/icons/game/${Sound.muted ? 'sound-off' : 'sound'}.svg`;
  $('mute').setAttribute('aria-label', Sound.muted ? 'Sound effects off' : 'Sound effects on');
  $('musicIco').src = `assets/icons/game/${Sound.musicOff ? 'music-off' : 'music'}.svg`;
  $('musicBtn').setAttribute('aria-label', Sound.musicOff ? 'Music off' : 'Music on');
}
