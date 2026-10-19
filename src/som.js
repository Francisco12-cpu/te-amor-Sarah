// ─────────────────────────────────────────────────────────────
// Áudio 100% sintetizado (Web Audio). Melodia ORIGINAL de caixinha de música.
// ─────────────────────────────────────────────────────────────
const Som = (() => {
  let c = null, mestre, musBus, fxBus, revIn, ecoWet, ecoDelay, ruido;
  let mudo = false, prox = 0, idx = 0, batida = 0, zeroEm = 0;
  let droneNos = null;
  const est = { vol: 0, tom: "menor", oit: 0, desaf: 5, tempo: 1, glock: false, pad: false, eco: 0, drone: 0 };

  // compasso 3/4, ~84 bpm, lá menor
  const MEL = [
    ["A4", 1], ["C5", 1], ["E5", 1],
    ["A5", 2], ["E5", 1],
    ["D5", 1], ["F5", 1], ["A5", 1],
    ["G5", 2], ["E5", 1],
    ["F5", 1], ["E5", 1], ["D5", 1],
    ["C5", 2], ["A4", 1],
    ["B4", 1], ["D5", 1], ["E5", 1],
    ["A4", 3],
  ];
  const BAIXO = { menor: ["A2", "E2", "D3", "E2", "F2", "A2", "E2", "A2"], maior: ["A2", "E2", "D3", "E2", "D3", "A2", "E2", "A2"] };

  function hz(n, maior) {
    const m = n.match(/^([A-G])(#?)(\d)$/);
    let st = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
    if (maior && !m[2] && "CFG".includes(m[1])) st += 1; // lá maior: C#, F#, G#
    const midi = (+m[3] + 1) * 12 + st;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function impulso(seg) {
    const len = Math.floor(c.sampleRate * seg);
    const b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return b;
  }

  function sessaoIOS() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { /* opcional */ }
    // um <audio> silencioso em loop tira o iPhone do modo "silencioso" para o Web Audio
    try {
      const sr = 8000, n = sr / 2, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
      const w = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
      w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt ");
      v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
      w(36, "data"); v.setUint32(40, n * 2, true);
      const a = new Audio(URL.createObjectURL(new Blob([buf], { type: "audio/wav" })));
      a.loop = true;
      a.setAttribute("playsinline", "");
      a.play().catch(() => {});
    } catch (e) { /* opcional */ }
  }

  function iniciar() {
    if (c) { if (c.state !== "running") c.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    c = new AC();
    sessaoIOS();
    mestre = c.createGain(); mestre.gain.value = mudo ? 0 : .5; mestre.connect(c.destination);
    const conv = c.createConvolver(); conv.buffer = impulso(1.8);
    revIn = c.createGain(); revIn.gain.value = .3; revIn.connect(conv); conv.connect(mestre);
    musBus = c.createGain(); musBus.gain.value = 0; musBus.connect(mestre); musBus.connect(revIn);
    fxBus = c.createGain(); fxBus.gain.value = .9; fxBus.connect(mestre); fxBus.connect(revIn);
    ecoDelay = c.createDelay(1); ecoDelay.delayTime.value = .38;
    const fb = c.createGain(); fb.gain.value = .38;
    ecoWet = c.createGain(); ecoWet.gain.value = 0;
    musBus.connect(ecoDelay); ecoDelay.connect(fb); fb.connect(ecoDelay); ecoDelay.connect(ecoWet); ecoWet.connect(mestre);
    ruido = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const rd = ruido.getChannelData(0);
    for (let i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1;
    const sb = c.createBufferSource(); sb.buffer = c.createBuffer(1, 1, 22050); sb.connect(c.destination); sb.start(0);
    c.resume();
    aplicar({ reiniciar: true });
    setInterval(agendar, 80);
    document.addEventListener("visibilitychange", () => {
      if (!c) return;
      if (document.hidden) c.suspend(); else c.resume();
    });
  }

  function rampa(param, v, seg) {
    const t = c.currentTime;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(v, t + seg);
  }

  function aplicar(o = {}) {
    if (!c) return;
    const seg = o.rampa ?? 1.2;
    rampa(musBus.gain, est.vol * .9, seg);
    if (est.vol <= 0) zeroEm = c.currentTime + seg;
    rampa(ecoWet.gain, est.eco ? .55 : 0, 1);
    if (o.reiniciar) { idx = 0; batida = 0; prox = c.currentTime + .12; }
    if (est.drone && !droneNos) {
      const o1 = c.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = 55;
      const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = 82.4;
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 180;
      const g = c.createGain(); g.gain.value = 0;
      o1.connect(lp); o2.connect(lp); lp.connect(g); g.connect(mestre);
      o1.start(); o2.start();
      rampa(g.gain, .16, 2.5);
      droneNos = { o1, o2, g };
    } else if (!est.drone && droneNos) {
      const d = droneNos; droneNos = null;
      rampa(d.g.gain, 0, 1.2);
      d.o1.stop(c.currentTime + 1.3); d.o2.stop(c.currentTime + 1.3);
    }
  }

  function musica(o) {
    for (const k in o) if (k in est) est[k] = o[k];
    aplicar(o);
  }

  function env(g, t, pico, dec) {
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(pico, t + .008);
    g.gain.exponentialRampToValueAtTime(.0001, t + dec);
  }

  function nota(f, t, dur, ganho = .2, bus = musBus) {
    const d = (Math.random() * 2 - 1) * est.desaf;
    const o1 = c.createOscillator(); o1.type = "triangle"; o1.frequency.value = f; o1.detune.value = d;
    const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2; o2.detune.value = d;
    const g = c.createGain(), g2 = c.createGain(); g2.gain.value = .35;
    const dec = .6 + Math.min(dur, 1.6) * .45;
    env(g, t, ganho, dec);
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(bus);
    o1.start(t); o2.start(t); o1.stop(t + dec + .05); o2.stop(t + dec + .05);
  }

  function glock(f, t, ganho = .07, bus = musBus) {
    [[1, 1], [2.76, .35], [5.4, .12]].forEach(([m, a]) => {
      const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
      const g = c.createGain(); env(g, t, ganho * a, .9 / m + .25);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + 1.3);
    });
  }

  function baixo(f, t, dur) {
    const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f;
    const g = c.createGain(); env(g, t, .1, Math.min(2.2, dur + .6));
    o.connect(g); g.connect(musBus); o.start(t); o.stop(t + 2.4);
  }

  function pad(t, dur) {
    ["A3", "C#4", "E4"].forEach((n) => {
      const o = c.createOscillator(); o.type = "sine"; o.frequency.value = hz(n);
      const g = c.createGain();
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(.028, t + 1);
      g.gain.setValueAtTime(.028, t + dur - 1);
      g.gain.linearRampToValueAtTime(.0001, t + dur + .6);
      o.connect(g); g.connect(musBus); o.start(t); o.stop(t + dur + .7);
    });
  }

  function agendar() {
    if (!c || c.state !== "running") return;
    if (est.vol <= 0 && c.currentTime > zeroEm) { prox = c.currentTime + .1; return; }
    const beat = 60 / 84 / est.tempo;
    const maior = est.tom === "maior";
    while (prox < c.currentTime + .3) {
      const [n, d] = MEL[idx];
      const f = hz(n, maior) * Math.pow(2, est.oit);
      nota(f, prox, d * beat);
      if (est.glock) glock(f * 2, prox);
      if (batida % 3 === 0) {
        const comp = Math.floor(batida / 3) % 8;
        baixo(hz(BAIXO[maior ? "maior" : "menor"][comp]) * Math.pow(2, est.oit), prox, beat * 3);
        if (comp === 0 && est.pad && maior) pad(prox, beat * 24);
      }
      prox += d * beat;
      batida += d;
      idx = (idx + 1) % MEL.length;
    }
  }

  // ── efeitos
  function ruidoFx(t, dur, filtro, f0, f1, ganho, q = 1) {
    const s = c.createBufferSource(); s.buffer = ruido; s.loop = true;
    const fl = c.createBiquadFilter(); fl.type = filtro; fl.Q.value = q;
    fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain(); env(g, t, ganho, dur);
    s.connect(fl); fl.connect(g); g.connect(fxBus);
    s.start(t, Math.random() * .5); s.stop(t + dur + .05);
  }
  const ok = () => c && c.state === "running";
  const T = () => c.currentTime + .01;

  const fx = {
    tick() { if (ok()) ruidoFx(T(), .03, "highpass", 3200, 3000, .3); },
    fio() { if (ok()) ruidoFx(T(), .42, "bandpass", 2000, 6000, .14, 4); },
    chave() {
      if (!ok()) return;
      const t = T();
      [1800, 2620, 4100].forEach((f, i) => {
        const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f * (1 + (Math.random() - .5) * .01);
        const g = c.createGain(); env(g, t, [.14, .1, .04][i], .18 + i * .05);
        o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + .4);
      });
    },
    giro() { if (ok()) [0, .07, .15].forEach((d) => ruidoFx(T() + d, .03, "bandpass", 1400, 1300, .25, 6)); },
    porta() {
      if (!ok()) return;
      const t = T();
      const o = c.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(62, t); o.frequency.linearRampToValueAtTime(92, t + .8); o.frequency.linearRampToValueAtTime(70, t + 1.5);
      const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 300; lp.Q.value = 6;
      const trem = c.createOscillator(); trem.frequency.value = 7;
      const tg = c.createGain(); tg.gain.value = .1;
      const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.24, t + .15); g.gain.linearRampToValueAtTime(.0001, t + 1.55);
      trem.connect(tg); tg.connect(g.gain);
      o.connect(lp); lp.connect(g); g.connect(fxBus);
      o.start(t); trem.start(t); o.stop(t + 1.6); trem.stop(t + 1.6);
    },
    ding(i) {
      if (!ok()) return;
      const esc = ["A4", "C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6", "G6", "A6", "C7"];
      const f = hz(esc[i % esc.length]);
      nota(f, T(), 1.4, .22, fxBus);
      glock(f, T(), .08, fxBus);
    },
    carimbo() {
      if (!ok()) return;
      const t = T();
      const o = c.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(70, t + .2);
      const g = c.createGain(); env(g, t, .55, .3);
      o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + .35);
      ruidoFx(t, .03, "lowpass", 2500, 2000, .3);
    },
    miau() {
      if (!ok()) return;
      const t = T();
      const o = c.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(820, t + .16); o.frequency.linearRampToValueAtTime(430, t + .5);
      const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 3;
      bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(1600, t + .18); bp.frequency.linearRampToValueAtTime(800, t + .5);
      const g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.12, t + .06); g.gain.linearRampToValueAtTime(.0001, t + .55);
      o.connect(bp); bp.connect(g); g.connect(fxBus); o.start(t); o.stop(t + .6);
    },
    ossos() { if (ok()) for (let i = 0; i < 6; i++) ruidoFx(T() + i * (.04 + Math.random() * .05), .025, "bandpass", 1500, 1200, .16, 5); },
    brilho() {
      if (!ok()) return;
      const t = T(), o = c.createOscillator(); o.type = "sine"; o.frequency.value = 2400 + Math.random() * 900;
      const g = c.createGain(); env(g, t, .06, .3); o.connect(g); g.connect(fxBus); o.start(t); o.stop(t + .35);
    },
    rasgo() { if (ok()) ruidoFx(T(), .75, "bandpass", 1800, 600, .22, 1.5); },
    queda() { if (ok()) ruidoFx(T(), 1.6, "lowpass", 1400, 200, .1); },
    sinos() {
      if (!ok()) return;
      ["A5", "E6", "C#6", "A6"].forEach((n, i) => glock(hz(n), T() + i * .18, .13, fxBus));
    },
    acorde() {
      if (!ok()) return;
      ["A4", "C5", "E5", "A5"].forEach((n, i) => nota(hz(n), T() + i * .06, 1.6, .16, fxBus));
    },
    costura() { if (ok()) for (let i = 0; i < 5; i++) ruidoFx(T() + i * .12, .03, "highpass", 3200, 3000, .25); },
  };

  return {
    iniciar, musica, ...fx,
    pronto: () => !!c,
    mudo: () => mudo,
    alternarMudo() {
      mudo = !mudo;
      if (c) rampa(mestre.gain, mudo ? 0 : .5, .3);
      return mudo;
    },
  };
})();
