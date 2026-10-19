// ─────────────────────────────────────────────────────────────
// Motor de cenas: relógio, cartões, transições, controles, modos
// ─────────────────────────────────────────────────────────────
const Q = new URLSearchParams(location.search);
const MODO_GRAVAR = Q.get("gravar") === "1";
const REDUZIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;

const E = {
  idx: -1, cena: null, inst: null, raiz: null,
  relogio: 0, tIni: 0, ult: 0, cue: 0, cartaoIdx: -1,
  trans: null, replay: false, cor: 0,
  gatos: new Set(), caixa: { x: 0, y: 0, w: 360, h: 640, k: 1 },
  fpsBaixo: false, dts: [], giro: { x: 0, y: 0 },
  reduzido: REDUZIDO, gravar: MODO_GRAVAR,
};

let palco, camada, grao, texturas;

function tCena() { return E.relogio - E.tIni; }

// ── caixa da arte (360x640, "meet") dentro do palco
function medir() {
  const W = palco.clientWidth, Hh = palco.clientHeight;
  const k = Math.min(W / 360, Hh / 640);
  E.caixa = { x: (W - 360 * k) / 2, y: (Hh - 640 * k) / 2, w: 360 * k, h: 640 * k, k, W, H: Hh };
  document.querySelectorAll(".sobre").forEach(posicionarSobre);
  if (E.inst && E.inst.redimensionar) E.inst.redimensionar();
}
function posicionarSobre(d) {
  const c = E.caixa;
  d.style.left = c.x + "px"; d.style.top = c.y + "px";
  d.style.width = c.w + "px"; d.style.height = c.h + "px";
  d.style.setProperty("--k", c.k);
}
function sobre(raiz) { const d = H("div", { class: "sobre" }, raiz); posicionarSobre(d); return d; }
// ponto da arte -> % do palco
function pctArte(x, y) {
  const c = E.caixa;
  return [((c.x + x * c.k) / c.W) * 100, ((c.y + y * c.k) / c.H) * 100];
}

// ── cor do mundo: 0 = cinza, 1 = cor (e o fio vira dourado)
function misturar(a, b, p) {
  const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], p))).join(",") + ")";
}
function setCor(v) {
  v = clamp(v);
  if (E.replay) v = 1;
  if (Math.abs(v - E.cor) < .001 && palco.style.getPropertyValue("--cor")) return;
  E.cor = v;
  palco.style.setProperty("--cor", v.toFixed(3));
  palco.style.setProperty("--fio", misturar(C.tinta, C.amarelo, v));
  palco.classList.toggle("colorido", v >= .999);
}

// ── cartão de mensagem (letra a letra, como tinta secando)
const Cartao = (() => {
  let el, letras = [], ini = 0, ativo = false, len = 0, vis = -1;
  const MS = 32;
  function criar(pai) { el = H("div", { id: "cartao", "aria-live": "polite" }, pai); }
  function mostrar(texto, inicio, bilhete) {
    el.innerHTML = "";
    el.classList.remove("on", "pronto");
    el.classList.toggle("bilhete", !!bilhete);
    el.style.setProperty("--rot", ((Math.random() - .5) * 2).toFixed(2) + "deg");
    const pal = texto.split(" ");
    letras = [];
    pal.forEach((p, i) => {
      const w = H("span", { class: i === pal.length - 1 ? "ult" : "" }, el);
      [...(p + (i < pal.length - 1 ? " " : ""))].forEach((ch) => letras.push(H("span", { class: "l", txt: ch }, w)));
    });
    el.setAttribute("aria-label", texto);
    len = letras.length; ini = inicio ?? E.relogio; vis = -1; ativo = true;
    void el.offsetWidth;
    el.classList.add("on");
  }
  function passo(agora) {
    if (!ativo) return;
    const n = clamp(Math.floor((agora - ini) / MS), 0, len);
    if (n === vis) return;
    for (let i = Math.max(0, vis); i < n; i++) letras[i].classList.add("v");
    vis = n;
    if (n >= len) el.classList.add("pronto");
  }
  return {
    criar, mostrar, passo,
    esconder() { ativo = false; el.classList.remove("on"); },
    digitando: () => ativo && vis < len,
    completar() { ini = E.relogio - len * MS; },
  };
})();

// escrita letra a letra em qualquer elemento (cena 14)
function escrita(el, texto) {
  el.innerHTML = "";
  const ls = [...texto].map((ch) => H("span", { class: "l", txt: ch }, el));
  const linha = H("span", { class: "linha-ouro" }, el);
  let vis = 0;
  return (tRel) => {
    const n = clamp(Math.floor(tRel / 45), 0, ls.length);
    for (let i = vis; i < n; i++) ls[i].classList.add("v");
    vis = Math.max(vis, n);
    linha.style.setProperty("--p", clamp(tRel / (ls.length * 45 + 300)).toFixed(3));
  };
}

// ── aviso curto no topo
let avisoEl, avisoAte = 0;
function aviso(texto, ms = 1800) {
  avisoEl.textContent = texto;
  avisoEl.classList.add("on");
  avisoAte = E.relogio + ms;
}

// ── easter egg: ache o gato (cenas 1, 3, 6, 9 e 10)
function marcarGato(id) {
  if (E.gatos.has(id)) return false;
  E.gatos.add(id);
  Som.miau();
  aviso(txt("aviso_gato", { G: E.gatos.size }));
  return true;
}
function gatoEspia(pai, x, y, rot, id, esc = 1, aoTocar) {
  const g = S("g", { class: "toque", transform: `translate(${x} ${y}) rotate(${rot}) scale(${esc})` }, pai);
  S("circle", { cx: 0, cy: 0, r: 34, fill: "transparent" }, g);
  const cab = S("g", {}, g);
  S("use", { href: "#gato", x: -30, y: -30, width: 60, height: 50 }, cab);
  g.addEventListener("pointerup", (ev) => {
    ev.stopPropagation();
    Som.iniciar();
    if (aoTocar) aoTocar();
    else marcarGato(id);
  });
  return {
    g,
    tocar(t) {
      const sai = 6 + 5 * (0.5 + 0.5 * Math.sin(t / 1300 + x));
      cab.setAttribute("transform", `translate(0 ${n1(sai)}) rotate(${n1(Math.sin(q12(t) / 900) * 4)})`);
    },
  };
}

// ── transições reutilizáveis (T1..T9)
const JAG = (() => { const r = rng(5); return Array.from({ length: 23 }, () => (r() - .5) * 7); })();

function passoTrans() {
  const tr = E.trans;
  const p = fase(E.relogio, tr.ini, tr.ini + tr.dur);
  const V = tr.velha.raiz.style, N = tr.nova.style;
  switch (tr.tipo) {
    case "furo": {
      const [x, y] = tr.pct;
      N.clipPath = N.webkitClipPath = `circle(${n1(ei(p) * 150)}% at ${n1(x)}% ${n1(y)}%)`;
      V.transformOrigin = `${x}% ${y}%`;
      V.transform = `scale(${1 + ei(p) * .6})`;
      break;
    }
    case "puxa": {
      const q = eio(p);
      V.transform = `translateX(${-q * 100}%)`;
      N.transform = `translateX(${(1 - q) * 100}%)`;
      tr.fio.style.opacity = Math.sin(p * Math.PI);
      tr.fio.style.transform = `translateX(${(1 - q) * 100 - 50}%)`;
      break;
    }
    case "sobe": {
      const q = eio(p);
      V.transform = `translateY(${-q * 100}%)`;
      N.transform = `translateY(${(1 - q) * 100}%)`;
      break;
    }
    case "queda": {
      const q = eio(p);
      V.transform = `translateY(${-q * 100}%)`;
      N.transform = `translateY(${(1 - q) * 100}%)`;
      tr.fio.style.opacity = Math.sin(p * Math.PI) * .8;
      break;
    }
    case "zoom":
      V.transform = `scale(${1 + ei(p) * 7})`;
      V.opacity = 1 - p;
      N.opacity = p;
      break;
    case "preto":
      V.opacity = clamp(1 - p * 2);
      N.opacity = clamp(p * 2 - 1);
      break;
    case "rasgo": {
      const X = (1 - eio(p)) * 112 - 6;
      const pts = ["0% 0%"];
      JAG.forEach((j, i) => pts.push(`${n1(X + j)}% ${n1((i / (JAG.length - 1)) * 100)}%`));
      pts.push("0% 100%");
      V.zIndex = 3;
      V.clipPath = V.webkitClipPath = `polygon(${pts.join(",")})`;
      V.transform = `translateX(${-p * 12}%) rotate(${-p * 2}deg)`;
      break;
    }
    default:
      N.opacity = p;
  }
  if (p >= 1) terminarTrans();
}

function terminarTrans() {
  const tr = E.trans;
  if (!tr) return;
  E.trans = null;
  ["clipPath", "webkitClipPath", "transform", "opacity", "transformOrigin", "zIndex"].forEach((k) => (tr.nova.style[k] = ""));
  if (tr.fio) tr.fio.remove();
  try { tr.velha.inst && tr.velha.inst.sair && tr.velha.inst.sair(); } catch (e) { console.error(e); }
  tr.velha.raiz.remove();
}

function normalizarTrans(t) {
  if (!t) return { tipo: "fade" };
  if (typeof t === "string") return { tipo: t };
  return t;
}

// ── navegação
function irPara(idx, trans) {
  if (idx < 0 || idx >= CENAS.length) return;
  if (E.trans) terminarTrans();
  const velha = { raiz: E.raiz, inst: E.inst, cena: E.cena };
  const cena = CENAS[idx];
  trans = normalizarTrans(trans);
  if (E.reduzido && !["corte", "continua"].includes(trans.tipo)) trans = { tipo: "fade", dur: 300 };

  const continua = trans.tipo === "continua" && velha.inst && velha.inst.mundo;
  let raiz;
  if (continua) raiz = velha.raiz;
  else {
    raiz = H("div", { class: "cena" + (cena.cinza ? " cinza" : "") }, camada);
    raiz.style.background = cena.fundo || "#000";
  }

  E.idx = idx; E.cena = cena; E.raiz = raiz;
  E.tIni = E.relogio; E.cue = 0; E.cartaoIdx = -1;
  Cartao.esconder();
  try {
    E.inst = cena.montar(raiz, continua ? velha.inst : null) || {};
  } catch (e) {
    console.error(e);
    E.inst = {};
  }
  if (!continua && !cena.semRuido) H("div", { class: "ruido" }, raiz);
  if (cena.musica) Som.musica(cena.musica);
  atualizarUI();

  if (velha.raiz && !continua) {
    if (trans.tipo === "corte") {
      try { velha.inst && velha.inst.sair && velha.inst.sair(); } catch (e) { console.error(e); }
      velha.raiz.remove();
    } else {
      const tr = { ...trans, ini: E.relogio, dur: trans.dur || 1100, velha, nova: raiz };
      if (trans.tipo === "furo") tr.pct = pctArte(trans.x ?? 180, trans.y ?? 320);
      if (trans.tipo === "puxa" || trans.tipo === "queda") {
        tr.fio = H("div", {}, camada);
        Object.assign(tr.fio.style, trans.tipo === "puxa"
          ? { position: "absolute", left: 0, right: 0, top: "50%", height: "2px", background: "var(--fio)", zIndex: 5, pointerEvents: "none" }
          : { position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none", opacity: 0,
              background: "repeating-linear-gradient(90deg, transparent 0 22px, rgba(20,17,15,.35) 22px 24px, transparent 24px 61px)" });
      }
      if (["furo", "fade", "preto", "zoom"].includes(trans.tipo)) raiz.style.opacity = trans.tipo === "furo" ? "" : 0;
      E.trans = tr;
      passoTrans();
    }
  }
  try { E.inst.tocar && E.inst.tocar(0, 0); } catch (e) { console.error(e); }
}

function proxima(trans) {
  if (E.idx + 1 >= CENAS.length) return;
  let t = trans || E.cena.saida;
  if (typeof t === "function") t = t(E.inst);
  irPara(E.idx + 1, t || "fade");
}

function recomecar() {
  // T9: cortina de botões
  const cort = H("div", { class: "cortina" }, palco);
  const r = rng(Date.now() % 1000);
  const W = palco.clientWidth, Hh = palco.clientHeight;
  const tam = Math.max(W, Hh) / 5;
  const bs = [];
  for (let y = -1; y < Hh / tam + 1; y++) for (let x = -1; x < W / tam + 1; x++) {
    const s = S("svg", { viewBox: "-50 -50 100 100", width: tam * 1.5, height: tam * 1.5 }, cort);
    const cores = [C.amarelo, C.azulVivo, C.rosa, C.lilas, C.laranja, "#151314"];
    S("circle", { r: 48, fill: cores[Math.floor(r() * cores.length)] }, s);
    S("circle", { r: 40, fill: "none", stroke: "rgba(0,0,0,.25)", "stroke-width": 2 }, s);
    [[-11, -11], [11, -11], [-11, 11], [11, 11]].forEach(([a, b]) => S("circle", { cx: a, cy: b, r: 7, fill: "rgba(0,0,0,.45)" }, s));
    s.style.left = (x * tam + (y % 2) * tam * .5 - tam * .25) + "px";
    s.style.top = (y * tam - tam * .25) + "px";
    s.style.transition = `transform .7s cubic-bezier(.3,1.3,.5,1) ${(r() * .35).toFixed(2)}s`;
    s.style.transform = `translateY(${-Hh - 200}px) rotate(${(r() - .5) * 180}deg)`;
    bs.push(s);
  }
  requestAnimationFrame(() => requestAnimationFrame(() => bs.forEach((s) => (s.style.transform = "translateY(0) rotate(0deg)"))));
  setTimeout(() => {
    E.replay = true;
    setCor(1);
    E.gatos.clear();
    irPara(1, "corte");
    bs.forEach((s) => {
      s.style.transition = `transform .8s cubic-bezier(.6,0,.8,.4) ${(r() * .3).toFixed(2)}s`;
      s.style.transform = `translateY(${Hh + 200}px) rotate(${(r() - .5) * 180}deg)`;
    });
    setTimeout(() => cort.remove(), 1400);
  }, 1300);
}

// ── toque
function aoTocar(ev) {
  if (ev.target.closest && ev.target.closest(".ui, button, .carta")) return;
  Som.iniciar();
  if (E.trans) return;
  const inst = E.inst;
  if (inst.tap && inst.tap(ev)) return;
  if (E.cena.interativa) return;
  if (Cartao.digitando()) { Cartao.completar(); return; }
  const t = tCena();
  const prox = (E.cena.textos || []).map((x) => x[0]).filter((b) => b > t + 250);
  if (prox.length) E.tIni -= prox[0] - t;
  else proxima();
}

// ── UI: controles e progresso
let ctrlEl, progEl, progFeito, progAgulha;
function montarUI() {
  ctrlEl = H("div", { id: "controles", class: "ui" }, palco);
  const bt = (label, svg, f) => {
    const b = H("button", { "aria-label": label, title: label }, ctrlEl);
    b.innerHTML = svg;
    b.addEventListener("click", (e) => { e.stopPropagation(); Som.iniciar(); f(b); });
    return b;
  };
  const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  bt("voltar cena", ic('<path d="M15 5l-7 7 7 7"/>'), () => irPara(Math.max(1, E.idx - 1), "fade"));
  bt("pular cena", ic('<path d="M6 5l7 7-7 7M13 5l7 7-7 7"/>'), () => proxima("fade"));
  const somOn = ic('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7"/>');
  const somOff = ic('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>');
  bt("som ligado ou mudo", somOn, (b) => { b.innerHTML = Som.alternarMudo() ? somOff : somOn; });

  progEl = H("div", { id: "progresso", class: "ui", "aria-hidden": "true" }, palco);
  const s = S("svg", { viewBox: "0 0 300 26", preserveAspectRatio: "none" }, progEl);
  S("line", { x1: 4, y1: 15, x2: 296, y2: 15, style: "stroke:var(--fio)", "stroke-width": 1.4, "stroke-dasharray": "3 4", opacity: .45 }, s);
  progFeito = S("line", { x1: 4, y1: 15, x2: 4, y2: 15, style: "stroke:var(--fio)", "stroke-width": 1.8, "stroke-linecap": "round" }, s);
  progAgulha = S("g", {}, s);
  S("path", { d: "M0,15 L-15,13.4 Q-19,15 -15,16.6 Z", style: "fill:var(--fio)" }, progAgulha);
  S("ellipse", { cx: -14, cy: 15, rx: 2.2, ry: .6, fill: "#EFE9DD" }, progAgulha);

  avisoEl = H("div", { id: "aviso", class: "ui" }, palco);
}

function atualizarUI() {
  const c = E.cena;
  ctrlEl.classList.toggle("oculto", E.idx === 0);
  progEl.classList.toggle("oculto", !!c.semProgresso);
}

const DUR_INTERATIVA = 30000;
function passoProgresso(t) {
  let tot = 0, feito = 0;
  CENAS.forEach((c, i) => {
    if (c.semProgresso) return;
    const d = c.dur || DUR_INTERATIVA;
    tot += d;
    if (i < E.idx) feito += d;
    else if (i === E.idx) feito += Math.min(t, d);
  });
  const x = 4 + 292 * (tot ? feito / tot : 0);
  progFeito.setAttribute("x2", n1(x));
  progAgulha.setAttribute("transform", `translate(${n1(x)} 0)`);
}

// ── laço principal
let ultGrao = 0, gIdx = 0;
function loop(ts) {
  requestAnimationFrame(loop);
  const dt = Math.min(100, ts - (E.ult || ts));
  E.ult = ts;
  passo(dt, ts);
}

function passo(dt, ts) {
  E.relogio += dt;

  // monitor de FPS (cai para versão leve abaixo de ~40 fps)
  if (dt > 0) {
    E.dts.push(dt);
    if (E.dts.length > 90) E.dts.shift();
    if (E.dts.length === 90 && !E.fpsBaixo) {
      const m = E.dts.reduce((a, b) => a + b) / 90;
      if (m > 25) E.fpsBaixo = true;
    }
  }

  const cena = E.cena;
  const t = tCena();

  if (cena.sons) {
    while (E.cue < cena.sons.length && cena.sons[E.cue][0] <= t) {
      const [ct, f, sfx] = cena.sons[E.cue];
      if (!sfx || t - ct < 450) try { f(); } catch (e) { console.error(e); }
      E.cue++;
    }
  }

  try { E.inst.tocar && E.inst.tocar(t, dt); } catch (e) { console.error(e); }
  if (E.trans) passoTrans();

  if (cena.textos) {
    let k = -1;
    cena.textos.forEach((x, i) => { if (t >= x[0]) k = i; });
    if (k !== E.cartaoIdx) {
      E.cartaoIdx = k;
      if (k >= 0) Cartao.mostrar(txt(cena.textos[k][1]), E.tIni + cena.textos[k][0]);
    }
    if (cena.esconderCartao && t > cena.esconderCartao) Cartao.esconder();
  }
  Cartao.passo(E.relogio);
  passoProgresso(t);

  if (avisoAte && E.relogio > avisoAte) { avisoEl.classList.remove("on"); avisoAte = 0; }

  if (ts - ultGrao > 125 && !E.reduzido) {
    ultGrao = ts;
    gIdx = (gIdx + 1) % 3;
    grao.style.backgroundImage = `url(${texturas.graos[gIdx]})`;
    grao.style.backgroundPosition = `${(gIdx * 53) % 160}px ${(gIdx * 97) % 160}px`;
  }

  if (!E.trans) {
    if (cena.dur && t >= cena.dur) proxima();
    else if (E.inst.terminou) { const tr = E.inst.terminou; E.inst.terminou = null; proxima(tr === true ? null : tr); }
  }
}

function boot() {
  palco = document.getElementById("palco");
  if (E.gravar) palco.classList.add("gravando");
  montarDefs();
  texturas = gerarTexturas();
  palco.style.setProperty("--ruido-papel", `url(${texturas.papel})`);
  document.documentElement.style.setProperty("--ruido-papel", `url(${texturas.papel})`);
  camada = H("div", { id: "cenas" }, palco);
  Cartao.criar(palco);
  grao = H("div", { id: "grao", "aria-hidden": "true" }, palco);
  H("div", { id: "vinheta", "aria-hidden": "true" }, palco);
  montarUI();
  setCor(0);
  medir();
  addEventListener("resize", medir);
  palco.addEventListener("pointerup", aoTocar);

  // giroscópio: só onde não precisa pedir permissão (Android); no iPhone não incomoda
  addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    E.giro.x = clamp(e.gamma / 30, -1, 1);
    E.giro.y = clamp((e.beta - 45) / 30, -1, 1);
  });

  const n = parseInt(Q.get("cena"), 10);
  if (!isNaN(n) && n > 0 && n < CENAS.length) {
    if (n >= 13 || Q.get("cor") === "1") setCor(1);
    irPara(n, "corte");
    const t0 = parseInt(Q.get("t"), 10);
    if (t0) E.tIni -= t0;
  } else irPara(0, "corte");

  if (Q.get("quadro") === "1") {
    // modo quadro a quadro: usado só para gerar o MP4 de backup
    let ts = 0;
    window.__quadro = (ms) => { ts += ms; passo(ms, ts); if (window.__comSom) Som.avancar(ms); };
    window.__audio = {
      iniciar(seg) { Som.iniciarOffline(seg); window.__comSom = true; },
      async renderizar() { window.__pcm = await Som.renderizar(); return window.__pcm.length; },
      pedaco(i, tam) {
        const b = window.__pcm.subarray(i, i + tam);
        let s = "";
        for (let k = 0; k < b.length; k += 32768) s += String.fromCharCode.apply(null, b.subarray(k, k + 32768));
        return btoa(s);
      },
    };
    window.__estado = () => ({ idx: E.idx, t: tCena() });
  } else requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", boot);
