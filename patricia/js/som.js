"use strict";
// ─────────────────────────────────────────────────────────────
// Som: só toca quando ela aperta o play (nunca automático).
// Sem arquivo no config, a música é uma caixinha de música feita no
// próprio navegador (Web Audio) tocando "Parabéns a você" (melodia em
// domínio público). Os efeitos curtinhos também só tocam com o som ligado.
// ─────────────────────────────────────────────────────────────
const Som = (() => {
  let c = null, mestre, eco, ligado = false, audio = null, tm = 0, prox = 0, idx = 0, volta = 0;
  const btn = document.getElementById("btn-som");
  const ouvintes = [];

  // "Parabéns a você" em dó maior: [nota, tempos]
  const MEL = [
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
    ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3], [null, 2],
  ];
  // baixo: um acorde por compasso (começa depois da anacruse)
  const BAIXO = ["C3", "G2", "G2", "C3", "C3", "F2", "G2", "C3"];
  const BATIDA = 60 / 104;

  function hz(n) {
    const m = n.match(/^([A-G])(\d)$/);
    const st = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
    return 440 * Math.pow(2, ((+m[2] + 1) * 12 + st - 69) / 12);
  }

  // o iPhone no modo silencioso só deixa o Web Audio tocar como "playback"
  function sessaoIOS() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { /* opcional */ }
  }

  function contexto() {
    if (c) { if (c.state !== "running") c.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    sessaoIOS();
    c = new AC();
    mestre = c.createGain(); mestre.gain.value = .55; mestre.connect(c.destination);
    // eco suave
    eco = c.createDelay(); eco.delayTime.value = .28;
    const fb = c.createGain(); fb.gain.value = .25;
    const molhado = c.createGain(); molhado.gain.value = .22;
    eco.connect(fb); fb.connect(eco); eco.connect(molhado); molhado.connect(mestre);
    document.addEventListener("visibilitychange", () => {
      if (!c) return;
      if (document.hidden) c.suspend(); else if (ligado) c.resume();
      if (audio) { if (document.hidden) audio.pause(); else if (ligado) audio.play().catch(() => {}); }
    });
    return true;
  }

  function saida(g) { g.connect(mestre); g.connect(eco); }

  // caixinha de música: senoides com harmônicos e decaimento longo
  function nota(f, t, vol = .22, dur = 1.4) {
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .006);
    g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    saida(g);
    [[1, 1], [2, .28], [3.01, .08], [4.2, .04]].forEach(([k, a]) => {
      const o = c.createOscillator(), ga = c.createGain();
      o.type = "sine"; o.frequency.value = f * k; ga.gain.value = a;
      o.connect(ga); ga.connect(g); o.start(t); o.stop(t + dur + .05);
    });
  }
  function baixo(f, t, dur) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "triangle"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.09, t + .04);
    g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(mestre); o.start(t); o.stop(t + dur + .05);
  }

  // agenda as próximas notas um pouquinho à frente (sem engasgar)
  function agendar() {
    if (!ligado || !c) return;
    while (prox < c.currentTime + .6) {
      const [n, b] = MEL[idx];
      const oit = volta % 2 ? 2 : 1; // na segunda volta, uma oitava acima
      if (n) nota(hz(n) * oit, prox, oit > 1 ? .14 : .22);
      // baixo no começo de cada compasso: a anacruse ocupa 1 tempo
      const tempo = MEL.slice(0, idx).reduce((s, x) => s + x[1], 0);
      if (tempo >= 1 && Math.abs(((tempo - 1) % 3)) < .01) {
        const k = Math.round((tempo - 1) / 3);
        if (BAIXO[k]) baixo(hz(BAIXO[k]), prox, BATIDA * 3);
      }
      prox += b * BATIDA;
      if (++idx >= MEL.length) { idx = 0; volta++; }
    }
  }

  function ligar() {
    ligado = true;
    if (CONFIG.musica.arquivo) {
      if (!audio) { audio = new Audio(CONFIG.musica.arquivo); audio.loop = true; audio.setAttribute("playsinline", ""); }
      audio.play().catch(() => { ligado = false; avisar(); });
      contexto();
    } else if (contexto()) {
      prox = c.currentTime + .15; idx = 0; volta = 0;
      clearInterval(tm); tm = setInterval(agendar, 120); agendar();
    }
    avisar();
  }
  function desligar() {
    ligado = false;
    clearInterval(tm);
    if (audio) audio.pause();
    if (c) c.suspend();
    avisar();
  }

  function avisar() {
    const r = ligado ? CONFIG.musica.pausar : CONFIG.musica.tocar;
    btn.setAttribute("aria-pressed", ligado);
    btn.setAttribute("aria-label", r);
    btn.title = r;
    btn.textContent = ligado ? "❚❚" : "♪";
    ouvintes.forEach((f) => f(ligado));
  }

  btn.hidden = false;
  btn.addEventListener("click", () => Som.alternar());
  avisar();

  // efeitos curtinhos (só com o som ligado)
  function ruido(t, dur, freq, vol) {
    const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(mestre); s.start(t);
  }

  return {
    alternar() { if (ligado) desligar(); else ligar(); },
    ligado: () => ligado,
    aoMudar(f) { ouvintes.push(f); f(ligado); },
    efeito(nome) {
      if (!ligado || !c || c.state !== "running") return;
      const t = c.currentTime + .01;
      if (nome === "clique") { ruido(t, .05, 3000, .5); ruido(t + .09, .08, 1500, .35); }
      else if (nome === "motor") {
        const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
        o.type = "sawtooth"; o.frequency.value = 110; lfo.frequency.value = 22; lg.gain.value = .03;
        lfo.connect(lg); lg.connect(g.gain);
        g.gain.setValueAtTime(.04, t); g.gain.setValueAtTime(.04, t + 1.2); g.gain.linearRampToValueAtTime(0, t + 1.4);
        o.connect(g); g.connect(mestre); o.start(t); lfo.start(t); o.stop(t + 1.45); lfo.stop(t + 1.45);
      }
      else if (nome === "plim") { nota(1568, t, .12, .8); nota(2093, t + .08, .1, .9); }
      else if (nome === "spray") ruido(t, .5, 6000, .25);
      else if (nome === "sopro") ruido(t, .6, 800, .3);
      else if (nome === "festa") [0, .1, .2, .3].forEach((d, i) => nota(hz(["C5", "E5", "G5", "C5"][i]) * (i === 3 ? 2 : 1), t + d, .14, 1.2));
    },
  };
})();
