// ─────────────────────────────────────────────────────────────
// Base: paleta, utilidades, gerador de traço "jeito Coraline"
// ─────────────────────────────────────────────────────────────
const C = {
  kraft: "#CDB48F", claro: "#EFE9DD", velho: "#D9CDB8", tinta: "#14110F",
  g1: "#2E2E2E", g2: "#6B6B6B", g3: "#A8A8A8", g4: "#D9D9D9", preto: "#0E0E10",
  amarelo: "#F2C230", amareloEsc: "#C98F12", azulCabelo: "#1E3A6E", azulVivo: "#2F5BD6",
  rosa: "#F2A6B8", laranja: "#F08A24", vinho: "#7A2E3E", lilas: "#7C6BC4",
};

const CENAS = [];
const NS = "http://www.w3.org/2000/svg";

function S(tag, at, pai) {
  const e = document.createElementNS(NS, tag);
  if (at) for (const k in at) {
    if (k === "txt") e.textContent = at[k];
    else e.setAttribute(k, at[k]);
  }
  if (pai) pai.appendChild(e);
  return e;
}

function H(tag, at, pai) {
  const e = document.createElement(tag);
  if (at) for (const k in at) {
    if (k === "txt") e.textContent = at[k];
    else if (k === "class") e.className = at[k];
    else e.setAttribute(k, at[k]);
  }
  if (pai) pai.appendChild(e);
  return e;
}

const lerp = (a, b, p) => a + (b - a) * p;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const fase = (t, a, b) => clamp((t - a) / (b - a));
const eio = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const eo = (p) => 1 - Math.pow(1 - p, 3);
const ei = (p) => p * p * p;
const voltaOut = (p) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const sino = (t, per, fas = 0) => Math.sin((t / per) * Math.PI * 2 + fas);
// "animação em twos": personagens a 12 fps
const q12 = (t) => Math.floor(t / 83.333) * 83.333;
const rad = (g) => (g * Math.PI) / 180;

function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const n1 = (n) => Math.round(n * 10) / 10;
const fp = (p) => n1(p[0]) + "," + n1(p[1]);

let _medidor = null;
function medidor() {
  if (!_medidor) {
    const s = S("svg", { width: 0, height: 0, "aria-hidden": "true", style: "position:absolute;width:0;height:0;overflow:hidden" });
    document.body.appendChild(s);
    _medidor = S("path", {}, s);
  }
  return _medidor;
}

// amostra um path (só comandos absolutos) em subcaminhos de pontos
function amostrar(d, passo = 4) {
  const subs = d.match(/M[^M]*/g) || [];
  const p = medidor();
  const out = [];
  for (const sd of subs) {
    p.setAttribute("d", sd);
    const L = p.getTotalLength();
    const n = Math.max(2, Math.ceil(L / passo));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const q = p.getPointAtLength((L * i) / n);
      pts.push([q.x, q.y]);
    }
    out.push(pts);
  }
  return out;
}

// jitter determinístico: soma de 2 senos + ruído pequeno, ao longo da normal
function tremer(pts, amp, seed) {
  const r = rng(seed);
  const f1 = r() * 6.28, f2 = r() * 6.28, k1 = .035 + r() * .04, k2 = .11 + r() * .08;
  let s = 0;
  return pts.map((p, i) => {
    if (i > 0) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const a = pts[Math.min(i + 1, pts.length - 1)], b = pts[Math.max(i - 1, 0)];
    let nx = -(a[1] - b[1]), ny = a[0] - b[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    const o = amp * (Math.sin(s * k1 + f1) * .65 + Math.sin(s * k2 + f2) * .35 + (r() - .5) * .4);
    return [p[0] + nx * o, p[1] + ny * o];
  });
}

function suave(pts, fechar) {
  if (pts.length < 3) return "M" + pts.map(fp).join("L");
  let d = "M" + fp(pts[0]);
  for (let i = 1; i < pts.length - 1; i++) {
    const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
    d += "Q" + fp(pts[i]) + " " + fp(m);
  }
  d += "L" + fp(pts[pts.length - 1]);
  return fechar ? d + "Z" : d;
}

function rabisco(d, amp = 1.1, seed = 1, passo = 5) {
  return amostrar(d, passo).map((pts, i) => suave(tremer(pts, amp, seed + i * 31))).join("");
}

// contorno de um "tubo" com espessura variável (taper): dedos, galhos, unhas
function tubo(pts, w0, w1, seed = 1, amp = .6, curva = 1) {
  const n = pts.length, L = [], R = [];
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const a = pts[Math.min(i + 1, n - 1)], b = pts[Math.max(i - 1, 0)];
    let nx = -(a[1] - b[1]), ny = a[0] - b[0];
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    const u = i / (n - 1);
    const w = Math.max(.3, lerp(w0, w1, Math.pow(u, curva)) / 2 + (r() - .5) * amp);
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
    R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  return suave(L.concat(R.reverse()), true);
}
function tuboD(d, w0, w1, seed, amp, curva, passo = 4) {
  return tubo(amostrar(d, passo)[0], w0, w1, seed, amp, curva);
}

// linha de nanquim com traço duplo
function traco(pai, d, o = {}) {
  const g = S("g", {}, pai);
  const cor = o.cor || C.tinta, w = o.w || 2, amp = o.amp ?? 1.1, seed = o.seed || 1;
  const base = { fill: "none", stroke: cor, "stroke-linecap": "round", "stroke-linejoin": "round" };
  S("path", { ...base, d: rabisco(d, amp, seed, o.passo), "stroke-width": w }, g);
  if (o.duplo !== false) {
    S("path", { ...base, d: rabisco(d, amp * 1.15, seed + 7, o.passo), "stroke-width": w * .5, opacity: .55, transform: `translate(${o.dx ?? .9},${o.dy ?? .7})` }, g);
  }
  return g;
}

// forma preenchida com contorno tremido
function forma(pai, d, fill, o = {}) {
  const dd = rabisco(d, o.amp ?? .9, o.seed || 3, o.passo || 5);
  const p = S("path", { d: dd, fill, stroke: o.stroke || C.tinta, "stroke-width": o.w ?? 2, "stroke-linejoin": "round" }, pai);
  if (o.hachura) S("path", { d: dd, fill: `url(#${o.hachura})`, opacity: o.hop ?? .8 }, pai);
  return p;
}

function poli(pts) { return "M" + pts.map(fp).join("L") + "Z"; }

function arte(raiz, filtro = true) {
  const s = S("svg", { viewBox: "0 0 360 640", preserveAspectRatio: "xMidYMid meet", class: "arte" + (filtro ? " filtro" : "") });
  raiz.appendChild(s);
  return s;
}

function useBotao(pai, cx, cy, r, furo) {
  const u = S("use", { href: "#botao", x: cx - r, y: cy - r, width: 2 * r, height: 2 * r }, pai);
  if (furo) u.style.setProperty("--furo", furo);
  return u;
}
function useChave(pai, cx, cy, s, furo) {
  const u = S("use", { href: "#chave", x: cx - 30 * s, y: cy - 30 * s, width: 60 * s, height: 200 * s }, pai);
  if (furo) u.style.setProperty("--furo", furo);
  return u;
}

// anel irregular (túnel, poço, ondas da lua): nunca redondo, nunca concêntrico
function anelIrregular(rx, ry, seed, o = {}) {
  const r = rng(seed);
  const n = o.n || 84, amp = o.amp ?? .05, quad = o.quad ?? .3, voltas = o.voltas ?? 1.07;
  const f0 = r() * 6.28, f1 = r() * 6.28, f2 = r() * 6.28;
  const k1 = 2 + Math.floor(r() * 3), k2 = 5 + Math.floor(r() * 4);
  const p = 2 + quad * 6;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const th = f0 + Math.PI * 2 * voltas * u;
    const c = Math.cos(th), s = Math.sin(th);
    const sq = 1 / Math.pow(Math.pow(Math.abs(c), p) + Math.pow(Math.abs(s), p), 1 / p);
    const m = 1 + amp * (Math.sin(th * k1 + f1) * .6 + Math.sin(th * k2 + f2) * .4) + (r() - .5) * amp * .5;
    const g = 1 + (o.cresce ?? .045) * u;
    pts.push([rx * c * sq * m * g, ry * s * sq * m * g]);
  }
  return pts;
}

// ── letras desenhadas à mão (paths de traço único, caixa de 100 de altura)
const GLIFOS = {
  C: { w: 64, d: "M58,24 C48,8 18,8 9,40 C1,70 14,100 38,100 C50,100 58,92 62,84" },
  r: { w: 36, d: "M5,52 L5,100 M5,74 C9,58 20,50 33,55" },
  a: { w: 44, d: "M36,60 C30,50 9,50 5,72 C1,94 21,104 34,88 M37,52 L37,100" },
  l: { w: 26, d: "M10,8 C8,40 8,70 10,92 C12,100 20,100 24,94" },
  i: { w: 16, d: "M8,56 L8,100 M8,36 L8.3,36.4" },
  n: { w: 44, d: "M5,52 L5,100 M5,72 C11,54 33,50 35,68 L35,100" },
  e: { w: 42, d: "M5,76 L37,76 C39,56 23,48 13,54 C1,62 1,92 15,99 C25,104 35,98 39,90" },
  S: { w: 62, d: "M54,22 C46,8 14,6 10,28 C6,50 56,50 56,76 C56,100 18,104 6,86" },
  A: { w: 64, d: "M4,100 L32,8 L60,100 M15,66 L49,66" },
  R: { w: 62, d: "M8,100 L8,10 C40,6 56,18 54,36 C52,54 30,56 8,54 M28,56 L58,100" },
  H: { w: 60, d: "M8,10 L8,100 M52,10 L52,100 M8,56 L52,56" },
};

// escreve "Coraline" com o "o" sendo um botão; devolve função de progresso
function tituloCoraline(pai, cx, topo, esc, cor = C.tinta, furo) {
  const letras = ["C", "o", "r", "a", "l", "i", "n", "e"];
  const esp = 5;
  const larg = letras.reduce((s, l) => s + (l === "o" ? 40 : GLIFOS[l].w) + esp, -esp) * esc;
  let x = cx - larg / 2;
  const itens = [];
  letras.forEach((l, i) => {
    const g = S("g", { transform: `translate(${n1(x)},${topo}) scale(${esc})` }, pai);
    if (l === "o") {
      const b = useBotao(g, 20, 76, 22, furo);
      itens.push({ tipo: "b", el: b, g });
      x += (40 + esp) * esc;
      return;
    }
    const d = rabisco(GLIFOS[l].d, .9, 40 + i * 13, 3);
    const p = S("path", { d, fill: "none", stroke: cor, "stroke-width": 6.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    const p2 = S("path", { d: rabisco(GLIFOS[l].d, 1.1, 90 + i * 7, 3), fill: "none", stroke: cor, "stroke-width": 2.6, opacity: .5, "stroke-linecap": "round", transform: "translate(1.4,1)" }, g);
    const L = p.getTotalLength();
    [p, p2].forEach((q) => { q.style.strokeDasharray = L + 2; q.style.strokeDashoffset = L + 2; });
    itens.push({ tipo: "p", els: [p, p2], L });
    x += (GLIFOS[l].w + esp) * esc;
  });
  return (prog) => {
    const n = itens.length;
    itens.forEach((it, i) => {
      const p = clamp(prog * n - i);
      if (it.tipo === "b") {
        it.g.style.opacity = p > 0 ? 1 : 0;
        it.el.setAttribute("transform", `translate(20 76) scale(${n1(eo(p) * 100) / 100}) rotate(${n1((1 - p) * -200)}) translate(-20 -76)`);
      } else {
        it.els.forEach((q) => (q.style.strokeDashoffset = (it.L + 2) * (1 - p)));
      }
    });
  };
}

// ── <defs> globais: hachuras, listras, filtros e os símbolos reutilizáveis
function montarDefs() {
  const s = S("svg", { width: 0, height: 0, "aria-hidden": "true", style: "position:absolute;width:0;height:0;overflow:hidden" });
  document.body.appendChild(s);
  const d = S("defs", {}, s);

  const hach = (id, ang, gap, w, op) => {
    const p = S("pattern", { id, patternUnits: "userSpaceOnUse", width: gap, height: gap, patternTransform: `rotate(${ang})` }, d);
    S("line", { x1: .5, y1: 0, x2: .5, y2: gap, stroke: C.tinta, "stroke-width": w, opacity: op }, p);
  };
  hach("hA", 35, 4.2, .9, .85);
  hach("hB", -35, 4.8, .8, .7);
  hach("hFina", 35, 3, .55, .55);

  const l = S("pattern", { id: "listras", patternUnits: "userSpaceOnUse", width: 18, height: 18, patternTransform: "rotate(40)" }, d);
  S("rect", { width: 18, height: 18, fill: "#EDEBE6" }, l);
  S("rect", { width: 9, height: 18, fill: "#4C4A48" }, l);
  S("line", { x1: 2, y1: 0, x2: 2, y2: 18, stroke: "#2c2a28", "stroke-width": .6, opacity: .6 }, l);

  // borda de adesivo (contorno branco + sombra) — só em grupos pequenos
  const f = S("filter", { id: "adesivo", x: "-25%", y: "-25%", width: "150%", height: "150%" }, d);
  S("feMorphology", { in: "SourceAlpha", operator: "dilate", radius: 5, result: "dil" }, f);
  S("feFlood", { "flood-color": "#ffffff", result: "br" }, f);
  S("feComposite", { in: "br", in2: "dil", operator: "in", result: "borda" }, f);
  S("feOffset", { in: "dil", dx: 2, dy: 4, result: "off" }, f);
  S("feFlood", { "flood-color": "#5a1a2a", "flood-opacity": .25, result: "sc" }, f);
  S("feComposite", { in: "sc", in2: "off", operator: "in", result: "sombra" }, f);
  const m = S("feMerge", {}, f);
  ["sombra", "borda", "SourceGraphic"].forEach((x) => S("feMergeNode", { in: x }, m));

  const rg = (id, stops, at = {}) => {
    const g = S("radialGradient", { id, ...at }, d);
    stops.forEach(([o, c, op]) => S("stop", { offset: o, "stop-color": c, "stop-opacity": op ?? 1 }, g));
  };
  rg("brilho", [[0, "#fff", .95], [.35, "#fff", .4], [1, "#fff", 0]]);
  rg("brilhoOuro", [[0, "#FFF4C2", 1], [.4, "#F2C230", .55], [1, "#F2C230", 0]]);
  rg("lua", [[0, "#f6f5f2"], [.7, "#dcdad6"], [1, "#b9b6b0"]], { cx: "45%", cy: "40%" });
  rg("furoLua", [[0, "#3c3c3c"], [1, "#6d6d6d"]], { cx: "40%", cy: "35%" });
  rg("bocaPoco", [[0, "#000"], [.75, "#0E0E10"], [1, "#2a2724"]]);
  rg("rosaFundo", [[0, "#F7C3CF"], [1, "#EE97AC"]], { cx: "50%", cy: "40%", r: "80%" });
  const lg = S("linearGradient", { id: "cabeca9", x1: 0, y1: 0, x2: 1, y2: 1 }, d);
  S("stop", { offset: 0, "stop-color": "#2F4FB5" }, lg);
  S("stop", { offset: 1, "stop-color": "#6A4FB0" }, lg);

  // botão de 4 furos (sulcos de vinil + reflexo)
  const b = S("symbol", { id: "botao", viewBox: "-50 -50 100 100", overflow: "visible" }, d);
  S("circle", { r: 48, fill: "#151314" }, b);
  [43, 38, 33, 28, 23].forEach((r, i) => S("circle", { r, fill: "none", stroke: i % 2 ? "#2a2728" : "#3b3738", "stroke-width": 1.3 }, b));
  S("circle", { r: 47, fill: "none", stroke: "#000", "stroke-width": 2.5 }, b);
  S("path", { d: "M-34,-22 A41,41 0 0 1 -4,-41", fill: "none", stroke: "#fff", "stroke-opacity": .34, "stroke-width": 4, "stroke-linecap": "round" }, b);
  S("path", { d: "M31,27 A41,41 0 0 1 17,38", fill: "none", stroke: "#fff", "stroke-opacity": .16, "stroke-width": 3, "stroke-linecap": "round" }, b);
  [[-11, -11], [11, -11], [-11, 11], [11, 11]].forEach(([x, y]) =>
    S("circle", { cx: x, cy: y, r: 7, style: "fill:var(--furo,#EFE9DD)", stroke: "#000", "stroke-width": 1.2 }, b));

  // chave com cabeça de botão (cabeça em 0,0)
  const k = S("symbol", { id: "chave", viewBox: "-30 -30 60 200", overflow: "visible" }, d);
  S("circle", { r: 24, fill: C.tinta }, k);
  S("circle", { r: 18.5, fill: "none", stroke: "#4a4440", "stroke-width": 2 }, k);
  [[-7, -7], [7, -7], [-7, 7], [7, 7]].forEach(([x, y]) =>
    S("circle", { cx: x, cy: y, r: 3.6, style: "fill:var(--furo,#CDB48F)" }, k));
  S("path", { d: "M-14,-13 A19,19 0 0 1 3,-19", fill: "none", stroke: "#fff", "stroke-opacity": .28, "stroke-width": 2.4, "stroke-linecap": "round" }, k);
  S("path", { d: "M-6,22 L6,22 L5,31 L-5,31 Z", fill: C.tinta }, k);
  S("rect", { x: -7.5, y: 31, width: 15, height: 4.5, rx: 1.8, fill: C.tinta }, k);
  S("rect", { x: -7.5, y: 38.5, width: 15, height: 4.5, rx: 1.8, fill: C.tinta }, k);
  S("rect", { x: -3.6, y: 30, width: 7.2, height: 132, rx: 3, fill: C.tinta }, k);
  S("path", { d: "M3,126 h15 v9 h-6 v5 h6 v9 h-15 z", fill: C.tinta }, k);

  // estrela de 4 pontas
  const e = S("symbol", { id: "estrela", viewBox: "-10 -10 20 20", overflow: "visible" }, d);
  S("path", { d: "M0,-10 Q1.6,-1.6 10,0 Q1.6,1.6 0,10 Q-1.6,1.6 -10,0 Q-1.6,-1.6 0,-10Z", fill: "currentColor" }, e);

  // cabeça de gato espiando
  const g = S("symbol", { id: "gato", viewBox: "-30 -30 60 50", overflow: "visible" }, d);
  S("path", { d: "M-22,20 C-25,3 -21,-7 -16,-12 L-19,-28 L-6,-17 C-2,-18 2,-18 6,-17 L19,-28 L16,-12 C21,-7 25,3 22,20 Z", fill: "#111" }, g);
  S("ellipse", { cx: -8, cy: 2, rx: 4.4, ry: 5.2, style: "fill:var(--olho,#E6DFC4)" }, g);
  S("ellipse", { cx: 8, cy: 2, rx: 4.4, ry: 5.2, style: "fill:var(--olho,#E6DFC4)" }, g);
  S("ellipse", { cx: -8, cy: 2.3, rx: 1.2, ry: 4, fill: "#111" }, g);
  S("ellipse", { cx: 8, cy: 2.3, rx: 1.2, ry: 4, fill: "#111" }, g);
}

// ── tile de ruído de papel e grão (gerados em canvas na hora; nenhum arquivo)
function gerarTexturas() {
  const tile = (tam, f) => {
    const c = document.createElement("canvas");
    c.width = c.height = tam;
    const g = c.getContext("2d");
    const im = g.createImageData(tam, tam);
    f(im.data, tam);
    g.putImageData(im, 0, 0);
    return c.toDataURL("image/png");
  };
  const r = rng(77);
  const papel = tile(256, (px, t) => {
    for (let i = 0; i < t * t; i++) {
      const x = i % t, y = (i / t) | 0;
      const fibra = Math.sin(x * .09 + Math.sin(y * .05) * 2) * 10 + Math.sin(y * .31 + x * .02) * 6;
      const v = 200 + fibra + (r() - .5) * 70;
      px[i * 4] = v; px[i * 4 + 1] = v * .97; px[i * 4 + 2] = v * .92; px[i * 4 + 3] = 255;
    }
  });
  const graos = [1, 2, 3].map((k) => tile(160, (px, t) => {
    const rr = rng(k * 991);
    for (let i = 0; i < t * t; i++) {
      const v = rr() > .5 ? 255 : 0;
      px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
      px[i * 4 + 3] = rr() * 255;
    }
  }));
  return { papel, graos };
}
