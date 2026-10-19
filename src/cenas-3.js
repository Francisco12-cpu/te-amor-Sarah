// ═════════════════════════════════════════════════════════════
// A PORTA E O TÚNEL (cenas 7 e 8) — mesmo mundo, plano-sequência
// Folha da porta em CSS 3D (rotateY na dobradiça). Túnel projetado em
// perspectiva num canvas: nítido em qualquer escala e leve no celular.
// ═════════════════════════════════════════════════════════════
function criarMundoPorta(raiz) {
  const P = 600, VC = [180, 331];
  const cv = H("canvas", { class: "tela", "aria-hidden": "true" }, raiz);
  const g = cv.getContext("2d");
  const vista = sobre(raiz);
  vista.style.pointerEvents = "none";
  const plano = H("div", {}, vista);
  Object.assign(plano.style, {
    position: "absolute", left: 0, top: 0, width: "360px", height: "640px",
    transformOrigin: "0 0", perspective: P + "px", perspectiveOrigin: `${VC[0]}px ${VC[1]}px`,
  });
  const folha = H("div", {}, plano);
  Object.assign(folha.style, {
    position: "absolute", left: "120px", top: "210px", width: "120px", height: "242px",
    transformOrigin: "100% 50%", transformStyle: "preserve-3d", webkitTransformStyle: "preserve-3d",
  });
  const face = (espelho) => {
    const f = H("div", {}, folha);
    Object.assign(f.style, { position: "absolute", inset: 0, backfaceVisibility: "hidden", webkitBackfaceVisibility: "hidden", transform: espelho ? "rotateY(180deg)" : "" });
    const s = S("svg", { viewBox: "0 0 120 242", width: 120, height: 242, style: "display:block" }, f);
    const gg = S("g", { transform: espelho ? "translate(120 0) scale(-1 1)" : "" }, s);
    S("rect", { x: 0, y: 0, width: 120, height: 242, fill: "#F4F2EE" }, gg);
    traco(gg, "M1.5,1.5 L118.5,1.5 L118.5,240.5 L1.5,240.5 Z", { w: 3, seed: espelho ? 11 : 12, amp: .7 });
    traco(gg, "M32,214 L32,74 C32,38 90,38 90,74 L90,214 Z", { w: 2.3, seed: espelho ? 13 : 14, amp: .7 });
    for (let x = 108; x < 118; x += 2.2) S("path", { d: `M${x},6 L${x + .3},236`, stroke: C.tinta, "stroke-width": .7, opacity: .7 }, gg);
    S("rect", { x: 8, y: 140, width: 15, height: 24, rx: 5, fill: "#e6e3dc", stroke: C.tinta, "stroke-width": 1.5 }, gg);
    S("circle", { cx: 15.5, cy: 132, r: 7.5, fill: "#d6d3cc", stroke: C.tinta, "stroke-width": 2 }, gg);
    S("circle", { cx: 15.5, cy: 152, r: 1.6, fill: C.tinta }, gg);
  };
  face(false); face(true);
  const borda = H("div", {}, folha);
  Object.assign(borda.style, {
    position: "absolute", left: 0, top: 0, width: "9px", height: "242px", transformOrigin: "0 50%", transform: "rotateY(90deg)",
    background: "repeating-linear-gradient(90deg, #14110F 0 1px, #E8E5DE 1px 2.5px)", border: "1.5px solid #14110F",
  });

  let dpr = 1;
  function tamanho() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(raiz.clientWidth * dpr);
    cv.height = Math.round(raiz.clientHeight * dpr);
    posicionarSobre(vista);
  }
  tamanho();

  const N = E.fpsBaixo ? 30 : 44, DELTA = 55;
  const r = rng(505);
  const aneis = [];
  for (let i = 0; i < N; i++) {
    const pts = anelIrregular(54 + r() * 5, 112 + r() * 6, 500 + i, { amp: .065, quad: .3, voltas: 1.08, n: 90, cresce: .05 });
    aneis.push({
      p: new Path2D(suave(pts)),
      p2: new Path2D(suave(tremer(pts, 1.2, 900 + i))),
      d: 24 + i * DELTA, dir: i % 2 ? 1 : -1,
    });
  }
  const PR = 24 + N * DELTA + 20;
  const moldura = [
    new Path2D(rabisco("M112,202 L248,202 L248,453 L112,453 Z", 1, 3, 6)),
    new Path2D(rabisco("M120,210 L240,210 L240,453 L120,453 Z", .8, 5, 6)),
  ];
  const moldura2 = new Path2D(rabisco("M112,202 L248,202 L248,453 L112,453 Z", 1.3, 33, 6));
  let tk = "";
  for (let y = 214; y < 450; y += 4.5) tk += `M232,${y} L240,${y + .4}`;
  const marcas = new Path2D(tk);
  const chao = new Path2D(rabisco("M-260,453 L620,453", 1.2, 7, 12));

  function base(s, camX, camY) {
    const c = E.caixa, k = c.k;
    g.setTransform(dpr * k * s, 0, 0, dpr * k * s,
      dpr * (c.x + k * (VC[0] - s * (VC[0] + camX))),
      dpr * (c.y + k * (VC[1] - s * (VC[1] + camY))));
  }
  function proj(d, X, Y, travel, camX, camY) {
    const s = P / (P + d - travel), c = E.caixa;
    return [c.x + c.k * (VC[0] + (X - VC[0] - camX) * s), c.y + c.k * (VC[1] + (Y - VC[1] - camY) * s)];
  }

  function desenhar(o) {
    const { travel, camX = 0, camY = 0, rot = 0, porta = 0, fio = 0, preto = 0 } = o;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    g.fillStyle = "#EEEBE4";
    g.fillRect(0, 0, cv.width, cv.height);
    const s0 = P / (P - travel);
    const dentro = travel > P - 20;
    g.lineCap = "round"; g.lineJoin = "round";

    if (!dentro) {
      g.save();
      base(s0, camX, camY);
      g.beginPath(); g.rect(120, 210, 120, 243); g.clip();
      g.fillStyle = "#F5F3EE"; g.fillRect(120, 210, 120, 243);
    }
    // ponto de fuga: retângulo preto
    const dr = P + PR - travel;
    if (dr > 4) {
      base(P / dr, camX, camY);
      g.globalAlpha = 1; g.fillStyle = C.tinta;
      g.fillRect(VC[0] - 13, VC[1] - 21, 26, 42);
    } else {
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.tinta; g.fillRect(0, 0, cv.width, cv.height);
    }
    for (let i = aneis.length - 1; i >= 0; i--) {
      const a = aneis[i];
      const dist = P + a.d - travel;
      if (dist < 6) continue;
      const alpha = clamp(1.3 - a.d / 2700) * clamp((dist - 6) / 90);
      if (alpha < .01) continue;
      base(P / dist, camX, camY);
      g.translate(VC[0], VC[1]);
      // espiral: cada anel um pouco mais girado; vizinhos alternam um leve contra-giro
      g.rotate(rad(i * .9 + rot * .35 + a.dir * 1.6));
      g.strokeStyle = C.tinta;
      g.globalAlpha = alpha; g.lineWidth = 2.3; g.stroke(a.p);
      if (!E.fpsBaixo) { g.globalAlpha = alpha * .45; g.lineWidth = 1; g.stroke(a.p2); }
    }
    // o fio atravessa o centro
    if (fio > 0) {
      const d0 = dentro ? Math.max(0, travel - P + 30) : 0;
      const a = proj(d0, VC[0] + 6, VC[1] + 70, travel, camX, camY);
      const b = proj(PR - 10, VC[0] + 6, VC[1] + 70, travel, camX, camY);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalAlpha = fio;
      g.strokeStyle = getComputedStyle(palco).getPropertyValue("--fio") || C.tinta;
      g.lineWidth = 1.8;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    if (!dentro) {
      g.restore();
      base(s0, camX, camY);
      g.globalAlpha = 1; g.strokeStyle = C.tinta;
      g.lineWidth = 1.2; g.globalAlpha = .45; g.stroke(chao);
      g.globalAlpha = 1;
      g.lineWidth = 4.2; g.stroke(moldura[0]);
      g.lineWidth = 1.6; g.stroke(moldura[1]);
      g.globalAlpha = .5; g.lineWidth = 1.4; g.stroke(moldura2);
      g.globalAlpha = .9; g.lineWidth = .8; g.stroke(marcas);
    }
    if (preto > 0) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = preto; g.fillStyle = "#0E0E10";
      g.fillRect(0, 0, cv.width, cv.height);
    }
    g.globalAlpha = 1;
    // folha da porta (CSS 3D)
    if (dentro || s0 > 7) plano.style.display = "none";
    else {
      plano.style.display = "";
      plano.style.transform = `scale(${E.caixa.k}) translate(${VC[0]}px,${VC[1]}px) scale(${s0}) translate(${-VC[0] - camX}px,${-VC[1] - camY}px)`;
      folha.style.transform = `rotateY(${porta.toFixed(2)}deg)`;
      plano.style.opacity = clamp(1 - (s0 - 3) / 4);
    }
  }
  return { desenhar, redimensionar: tamanho };
}

// CENA 7 — A porta (3D)
CENAS.push({
  nome: "porta", dur: 14000, cinza: true, fundo: "#EEEBE4",
  textos: [[1300, "c7"]],
  saida: { tipo: "continua" },
  montar(raiz) {
    const m = criarMundoPorta(raiz);
    let abre = null, tt = 0;
    const abrir = (t) => { abre = t; Som.giro(); setTimeout(() => Som.porta(), 320); };
    return {
      mundo: m,
      redimensionar: m.redimensionar,
      tocar(t) {
        tt = t;
        if (abre === null && t >= 5200) abrir(t);
        const pa = abre === null ? 0 : fase(t, abre, abre + 3000);
        const tremor = pa > 0 && pa < 1 ? Math.sin(t / 22) * 2.2 * (1 - pa) : 0;
        const ang = 100 * voltaOut(eo(pa) * .85 + pa * .15) + tremor;
        const orb = E.reduzido ? 0 : 1;
        m.desenhar({
          travel: 565 * eio(fase(t, 9000, 14000)),
          camX: orb * (12 * Math.sin(t / 1500) + E.giro.x * 14),
          camY: orb * (5 * Math.sin(t / 2100) + E.giro.y * 8),
          rot: orb * t * .004, porta: ang, fio: fase(t, 9600, 10800),
        });
      },
      tap() {
        if (abre === null) { abrir(tt); return true; }
        return false;
      },
    };
  },
});

// CENA 8 — O túnel
CENAS.push({
  nome: "tunel", dur: 14500, cinza: true, fundo: "#EEEBE4",
  textos: [[2600, "c8"]],
  musica: { tempo: .72, drone: 1 },
  sons: [[13300, () => Som.musica({ vol: 0, rampa: .7 })]],
  saida: { tipo: "preto", dur: 800 },
  montar(raiz, ant) {
    const m = ant && ant.mundo ? ant.mundo : criarMundoPorta(raiz);
    return {
      mundo: m,
      redimensionar: m.redimensionar,
      tocar(t) {
        const orb = E.reduzido ? 0 : 1;
        const p = fase(t, 0, 13200);
        m.desenhar({
          travel: 565 + 2560 * Math.pow(p, 1.75),
          camX: orb * (12 * Math.sin((t + 14000) / 1500) * (1 - p) + E.giro.x * 14),
          camY: orb * (5 * Math.sin((t + 14000) / 2100) * (1 - p) + E.giro.y * 8),
          rot: orb * (56 + t * .014 + p * p * 40), porta: 100, fio: 1,
          preto: fase(t, 12500, 13700),
        });
      },
    };
  },
});

// ═════════════════════════════════════════════════════════════
// ATO 3 — O OUTRO MUNDO (cenas 9 a 11)
// ═════════════════════════════════════════════════════════════

function coralineDeitada(pai) {
  const g = S("g", {}, pai);
  const giz = "#E9E3D6";
  const oct = [];
  for (let i = 0; i < 8; i++) { const a = rad(22.5 + i * 45); oct.push([Math.cos(a) * 46, -70 + Math.sin(a) * 46]); }
  forma(g, poli(oct), "url(#cabeca9)", { stroke: giz, w: 1.5, seed: 91 });
  S("ellipse", { cx: 14, cy: -60, rx: 26, ry: 30, fill: "#E9CFA8", stroke: giz, "stroke-width": 1.2 }, g);
  S("path", { d: "M16,-66 q6,5 12,0", fill: "none", stroke: "#3a2a1a", "stroke-width": 1.6, "stroke-linecap": "round" }, g);
  S("circle", { cx: 32, cy: -44, r: 3, fill: "#5a2a2a" }, g);
  const r = rng(92);
  for (let i = 0; i < 9; i++) S("circle", { cx: 14 + r() * 18, cy: -56 + r() * 8, r: .8, fill: "#9b6b45" }, g);
  forma(g, "M-30,-26 L30,-26 L44,72 L-44,72 Z", C.amarelo, { stroke: giz, w: 1.5, seed: 93 });
  traco(g, "M-30,-26 L-10,-8 L0,-26 L10,-8 L30,-26", { cor: C.laranja, w: 2, duplo: false, seed: 94 });
  [6, 26, 46].forEach((y) => S("circle", { cx: -4, cy: y, r: 3, fill: C.laranja }, g));
  traco(g, "M-40,58 L40,58", { cor: C.laranja, w: 1.6, duplo: false, seed: 95 });
  S("rect", { x: -18, y: 72, width: 11, height: 34, fill: "#3a3a4a" }, g);
  S("rect", { x: 7, y: 72, width: 11, height: 34, fill: "#3a3a4a" }, g);
  S("ellipse", { cx: -12, cy: 108, rx: 10, ry: 6, fill: C.laranja }, g);
  S("ellipse", { cx: 13, cy: 108, rx: 10, ry: 6, fill: C.laranja }, g);
  return g;
}

function gatoAndando(pai, olho) {
  const g = S("g", { class: "toque" }, pai);
  S("circle", { r: 40, fill: "transparent" }, g);
  const pernas = S("path", { stroke: "#111", "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" }, g);
  S("path", { d: "M-26,0 C-26,-15 20,-17 26,-5 C30,6 20,12 0,12 C-20,12 -26,8 -26,0Z", fill: "#111", stroke: "#bdb6a8", "stroke-width": .9 }, g);
  S("path", { d: "M-24,-3 C-40,-10 -44,-30 -34,-38", stroke: "#111", "stroke-width": 4.5, fill: "none", "stroke-linecap": "round" }, g);
  S("path", { d: "M22,-14 L24,-28 L30,-18 L36,-28 L38,-14 C42,-4 36,4 30,4 C22,4 18,-4 22,-14Z", fill: "#111", stroke: "#bdb6a8", "stroke-width": .9 }, g);
  S("ellipse", { cx: 34, cy: -10, rx: 2.2, ry: 1.8, fill: olho }, g);
  return {
    g,
    passo(t) {
      const f = Math.sin(q12(t) / 120) * 6;
      pernas.setAttribute("d", `M-16,8 L${n1(-16 + f)},22 M-6,8 L${n1(-6 - f)},22 M12,8 L${n1(12 + f)},22 M20,6 L${n1(20 - f)},20`);
    },
  };
}

// CENA 9 — O pano estrelado
CENAS.push({
  nome: "pano", dur: 13800, cinza: true, fundo: "#0E0E10",
  textos: [[2000, "c9a"], [7600, "c9b"]],
  musica: { vol: 1, tempo: 1, drone: 0, oit: 0, eco: 0 },
  saida: { tipo: "corte" },
  montar(raiz) {
    H("div", { class: "trama" }, raiz);
    const svg = arte(raiz);
    const r = rng(909);
    const cores = ["#EDE8DE", "#8FA8F0", "#B6A9EE", "#EDE8DE"];
    const camadas = [{ v: .004, e: .6, op: .45 }, { v: .009, e: .85, op: .75 }, { v: .015, e: 1.1, op: 1 }];
    const estrelas = [], botoes = [];
    // fantasma da boneca
    const fant = S("g", { opacity: .035, transform: "translate(60 60) scale(.42)" }, svg);
    S("path", { d: "M60,0 L60,120 M10,40 L60,120 L110,40 M60,120 C20,120 10,160 20,200 L100,200 C110,160 100,120 60,120 Z M30,200 L10,360 L110,360 L90,200 Z", fill: "#fff", stroke: "#fff", "stroke-width": 6 }, fant);

    const grupos = camadas.map((cm, ci) => {
      const g = S("g", { opacity: cm.op }, svg);
      for (let k = 0; k < 10; k++) {
        const x = r() * 420 - 30, y = 30 + r() * 560, tipo = r(), cor = cores[Math.floor(r() * cores.length)];
        if (tipo < .6) {
          const e = S("g", { class: ci ? "toque" : "" }, g);
          if (ci) S("circle", { r: 20, fill: "transparent" }, e);
          const inner = S("g", {}, e);
          S("use", { href: "#estrela", x: -10, y: -10, width: 20, height: 20, color: cor }, inner);
          const st = { e, inner, x, y, s: (.45 + r() * .55) * cm.e, nasc: 150 + estrelas.length * 100, fas: r() * 6, tap: -1e9 };
          if (ci) e.addEventListener("pointerup", (ev) => { ev.stopPropagation(); st.tap = E.relogio; Som.brilho(); });
          estrelas.push(st);
        } else if (tipo < .85) {
          const b = S("g", {}, g);
          const rr = (8 + r() * 10) * cm.e;
          S("circle", { r: rr, fill: "none", stroke: cor, "stroke-width": 1.3 }, b);
          [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, c]) => S("circle", { cx: a * rr * .28, cy: c * rr * .28, r: rr * .12, fill: cor }, b));
          botoes.push({ b, x, y, v: (r() - .5) * .02 });
        } else {
          let d = `M${n1(x)},${n1(y)}`;
          for (let j = 1; j <= 8; j++) d += ` Q${n1(x + j * 9 - 4.5)},${n1(y + (j % 2 ? -8 : 8))} ${n1(x + j * 9)},${n1(y)}`;
          S("path", { d, fill: "none", stroke: cor, "stroke-width": 1.1, opacity: .7 }, g);
        }
      }
      return g;
    });
    // olho no alto
    const olho = S("g", { transform: "translate(180 70)", opacity: .8 }, svg);
    S("path", { d: "M-22,0 Q0,-14 22,0 Q0,14 -22,0Z", fill: "none", stroke: "#EDE8DE", "stroke-width": 1.3 }, olho);
    const pupila = S("circle", { r: 5, fill: "#EDE8DE" }, olho);

    const cora = coralineDeitada(svg);
    const gato = gatoAndando(svg, "#6FA8FF");
    gato.g.addEventListener("pointerup", (ev) => { ev.stopPropagation(); marcarGato("c9"); });

    return {
      tocar(t) {
        const tq = q12(t);
        grupos.forEach((g, i) => g.setAttribute("transform", `translate(${n1(-t * camadas[i].v + E.giro.x * (i + 1) * 6)} ${n1(E.giro.y * (i + 1) * 4)})`));
        estrelas.forEach((s) => {
          const nasce = eo(fase(t, s.nasc, s.nasc + 500));
          const pisca = Math.sin(tq / 300 + s.fas) > .2 ? 1 : .55;
          const pt = fase(E.relogio, s.tap, s.tap + 800);
          const giro = pt > 0 && pt < 1 ? eio(pt) * 360 : 0;
          const extra = pt > 0 && pt < 1 ? 1 + Math.sin(pt * Math.PI) * .9 : 1;
          s.e.setAttribute("transform", `translate(${n1(s.x)} ${n1(s.y)}) scale(${(s.s * nasce * extra).toFixed(3)})`);
          s.inner.setAttribute("transform", `rotate(${n1(giro)})`);
          s.e.setAttribute("opacity", nasce * pisca);
        });
        botoes.forEach((b) => b.b.setAttribute("transform", `translate(${n1(b.x)} ${n1(b.y)}) rotate(${n1(t * b.v)})`));
        pupila.setAttribute("cx", n1(Math.sin(t / 1800) * 9));
        olho.setAttribute("transform", `translate(180 70) scale(1 ${Math.sin(tq / 2600) > .97 ? .1 : 1})`);
        const bob = Math.sin(t / 1400) * 8;
        cora.setAttribute("transform", `translate(${n1(190 + Math.sin(t / 2300) * 6)} ${n1(300 + bob)}) rotate(${n1(-80 + Math.sin(t / 1900) * 3)}) scale(.95)`);
        let gx = -60 + Math.max(0, t - 1200) * .03, gy = 520;
        const pj = fase(t, 12000, 12900);
        if (pj > 0) { gx += pj * 160; gy -= Math.sin(pj * Math.PI) * 90 + pj * pj * 280; }
        gato.g.setAttribute("transform", `translate(${n1(gx)} ${n1(gy)}) rotate(${n1(-pj * 30)})`);
        gato.passo(t);
      },
    };
  },
});

// CENA 10 — O gato e a lua-botão
CENAS.push({
  nome: "lua", dur: 12800, cinza: true, fundo: "#E6E3DE",
  textos: [[2600, "c10"]],
  sons: [[7600, () => Som.miau(), true], [11200, () => Som.chave(), true]],
  saida: { tipo: "furo", x: 180, y: 190, dur: 900 },
  montar(raiz) {
    const svg = arte(raiz);
    const ondas = S("g", {}, svg);
    for (let i = 0; i < 11; i++) {
      const R = 122 + i * 25;
      S("circle", { cx: 180, cy: 190, r: R, fill: "none", stroke: "#6b6b6b", "stroke-width": 14, opacity: (.1 - i * .007).toFixed(3) }, ondas);
      S("path", { d: suave(anelIrregular(R, R, 700 + i, { amp: .02, quad: 0, voltas: 1.02 })), transform: "translate(180 190)", fill: "none", stroke: "#555", "stroke-width": .8, opacity: .35 }, ondas);
    }
    const lua = S("g", {}, svg);
    S("circle", { cx: 180, cy: 190, r: 108, fill: "url(#lua)", stroke: "#8a8a8a", "stroke-width": 2 }, lua);
    traco(lua, "M180,92 A98,98 0 1 1 179.9,92", { cor: "#a5a29c", w: 1.2, seed: 77 });
    [[140, 150], [220, 150], [140, 230], [220, 230]].forEach(([x, y]) => S("circle", { cx: x, cy: y, r: 23, fill: "url(#furoLua)", stroke: "#3a3a3a", "stroke-width": 1.4 }, lua));

    // árvore e galho
    const arv = S("g", {}, svg);
    const TRONCO = "M372,660 C352,520 366,380 344,240 C338,200 348,160 334,110";
    S("path", { d: tuboD(TRONCO, 34, 8, 71, 1.4, 1), fill: "#2f2f2f" }, arv);
    S("path", { d: tuboD(TRONCO, 34, 8, 71, 1.4, 1), fill: "url(#hA)", opacity: .5 }, arv);
    [["M350,300 C320,270 300,240 296,200", 9, 1.5], ["M346,210 C370,180 384,150 382,120", 8, 1.5], ["M356,420 C380,400 392,370 400,350", 9, 1.5]].forEach(([d, a, b], i) =>
      S("path", { d: tuboD(d, a, b, 72 + i, .8, 1), fill: "#2f2f2f" }, arv));
    const galho = S("g", {}, svg);
    const GALHO = "M372,404 C320,418 260,440 200,446 C150,450 90,444 24,470";
    S("path", { d: tuboD(GALHO, 30, 6, 74, 1.5, .9), fill: "#2f2f2f" }, galho);
    S("path", { d: tuboD(GALHO, 30, 6, 74, 1.5, .9), fill: "url(#hB)", opacity: .45 }, galho);
    [["M110,450 C96,430 92,410 98,392", 6, 1], ["M64,460 C52,476 46,492 48,510", 5, 1], ["M250,436 C262,420 270,404 268,388", 6, 1]].forEach(([d, a, b], i) =>
      S("path", { d: tuboD(d, a, b, 76 + i, .6, 1), fill: "#2f2f2f" }, galho));

    // gato de costas
    const gato = S("g", { class: "toque" }, galho);
    S("circle", { cx: 178, cy: 400, r: 50, fill: "transparent" }, gato);
    const rabo = S("path", { fill: "#111" }, gato);
    S("path", { d: "M178,366 C200,366 208,392 206,412 C204,432 196,442 178,442 C160,442 152,432 150,412 C148,392 156,366 178,366Z", fill: "#111" }, gato);
    S("circle", { cx: 178, cy: 352, r: 19, fill: "#111" }, gato);
    S("path", { d: "M163,346 L160,322 L174,338Z", fill: "#111" }, gato);
    const orelha = S("path", { d: "M193,346 L196,322 L182,338Z", fill: "#111" }, gato);
    gato.addEventListener("pointerup", (ev) => { ev.stopPropagation(); marcarGato("c10"); });

    // chaves que nascem da lua (transição para a cena 11)
    const chaves = [];
    const rk = rng(1010);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const g = S("g", { opacity: 0 }, svg);
      useChave(g, 0, 0, .42, "#E6E3DE");
      chaves.push({ g, a, rr: 40 + rk() * 50, v: 120 + rk() * 200, rot: (rk() - .5) * 120 });
    }

    // olhos acesos (fora do filtro cinza: a primeira pista de cor)
    const cor = arte(raiz, false);
    const olhos = S("g", { opacity: 0 }, cor);
    [[170, 350], [186, 350]].forEach(([x, y]) => {
      S("circle", { cx: x, cy: y, r: 11, fill: "url(#brilhoOuro)" }, olhos);
      S("ellipse", { cx: x, cy: y, rx: 3.8, ry: 2.6, fill: C.amarelo }, olhos);
    });

    const baseRabo = [[192, 436], [202, 462], [196, 488], [186, 506], [190, 526], [202, 532], [208, 522]];
    return {
      tocar(t) {
        const tq = q12(t);
        const resp = 1 + .03 * (.5 + .5 * Math.sin(t / 1100));
        ondas.setAttribute("transform", `translate(180 190) scale(${resp.toFixed(4)}) translate(-180 -190)`);
        const sai = fase(t, 10600, 11400);
        lua.setAttribute("opacity", 1 - sai);
        ondas.setAttribute("opacity", 1 - sai * .7);
        galho.setAttribute("transform", `rotate(${n1(Math.sin(t / 1700) * .6)} 372 404)`);
        const pts = baseRabo.map(([x, y], i) => [x + Math.sin(tq / 520) * Math.pow(i / 6, 2) * 12, y]);
        rabo.setAttribute("d", tubo(amostrar(suave(pts), 4)[0], 8, 5, 9, .3, 1));
        const tw = (tq % 3200) < 180 ? 14 : 0;
        orelha.setAttribute("transform", `rotate(${tw} 190 340)`);
        const o = 2600 + 1400;
        const po = fase(t, o, o + 160) * (1 - fase(t, o + 1000, o + 1250));
        olhos.setAttribute("opacity", po.toFixed(3));
        chaves.forEach((c) => {
          const p = fase(t, 10800, 12800);
          c.g.setAttribute("opacity", p > 0 ? 1 : 0);
          const x = 180 + Math.cos(c.a) * c.rr * eo(p) * 1.6, y = 190 + Math.sin(c.a) * c.rr * eo(p) - p * c.v;
          c.g.setAttribute("transform", `translate(${n1(x)} ${n1(y)}) rotate(${n1(c.rot * p)}) scale(${n1(.3 + p * .7)})`);
        });
      },
    };
  },
});

// CENA 11 — As doze chaves (interativa)
CENAS.push({
  nome: "chaves", dur: null, interativa: true, cinza: true, fundo: "#D9CDB8",
  musica: { vol: .65 },
  montar(raiz) {
    const svg = arte(raiz);
    // fumaça
    const fumaca = S("g", {}, svg);
    for (let i = 0; i < 7; i++) {
      let d = `M-40,${80 + i * 80}`;
      for (let j = 1; j <= 6; j++) d += ` Q${-40 + j * 75 - 37},${80 + i * 80 + (j % 2 ? -30 : 30)} ${-40 + j * 75},${80 + i * 80}`;
      S("path", { d, fill: "none", stroke: "#5a5650", "stroke-width": 16, opacity: .06, "stroke-linecap": "round" }, fumaca);
    }
    // mãos de fumaça nos 4 cantos
    const cantos = [[0, 0], [360, 0], [0, 640], [360, 640]].map(([cx, cy], k) => {
      const g = S("g", {}, svg);
      const phi = Math.atan2(320 - cy, 180 - cx);
      [-26, -9, 8, 25].forEach((da, j) => {
        const a = phi + rad(da), L = 120 + (j % 2) * 30;
        const m = [cx + Math.cos(a) * L * .55 + Math.cos(a + 1.2) * 18, cy + Math.sin(a) * L * .55 + Math.sin(a + 1.2) * 18];
        const f = [cx + Math.cos(a) * L, cy + Math.sin(a) * L];
        const d = `M${cx},${cy} Q${n1(m[0])},${n1(m[1])} ${n1(f[0])},${n1(f[1])}`;
        S("path", { d: tuboD(d, 30, 2, 200 + k * 5 + j, 1.5, .8), fill: "#2E2E2E", opacity: .1 }, g);
        S("path", { d: tuboD(d, 18, 1, 220 + k * 5 + j, 1, .8), fill: "#2E2E2E", opacity: .2 }, g);
      });
      return { g, dx: Math.cos(phi), dy: Math.sin(phi) };
    });

    // Sarah-Coraline simplificada
    const fig = S("g", {}, svg);
    forma(fig, "M140,350 C150,342 210,342 220,350 L236,462 C210,470 150,470 124,462 Z", "#8b857c", { w: 2, seed: 301, hachura: "hFina", hop: .35 });
    S("path", { d: "M168,348 L180,374 L192,348", fill: "none", stroke: C.tinta, "stroke-width": 1.5 }, fig);
    [384, 408, 432].forEach((y) => S("circle", { cx: 180, cy: y, r: 3.2, fill: C.tinta }, fig));
    forma(fig, "M138,300 C130,250 160,236 184,238 C214,240 232,262 224,300 C222,316 220,328 216,338 L208,300 C204,284 196,276 184,276 C170,280 158,272 150,262 C146,282 148,316 152,338 L142,330 C138,320 136,310 138,300Z", "#1b1b1b", { w: 1.5, seed: 302 });
    S("ellipse", { cx: 181, cy: 304, rx: 37, ry: 40, fill: "#EADBC6", stroke: C.tinta, "stroke-width": 2 }, fig);
    forma(fig, "M146,292 C150,262 176,250 200,256 C214,260 222,272 222,290 C206,276 186,272 166,282 C158,286 150,290 146,292Z", "#1b1b1b", { w: 1.5, seed: 303 });
    const flor = S("g", { transform: "translate(208 262)" }, fig);
    for (let i = 0; i < 5; i++) S("circle", { cx: Math.cos(rad(i * 72)) * 4.6, cy: Math.sin(rad(i * 72)) * 4.6, r: 3.6, fill: "#f4f0e8", stroke: C.tinta, "stroke-width": .9 }, flor);
    S("circle", { r: 2.4, fill: "#9a948a" }, flor);
    useBotao(fig, 166, 306, 11.5, "#EADBC6");
    useBotao(fig, 197, 306, 11.5, "#EADBC6");
    const rs = rng(304);
    for (let i = 0; i < 14; i++) S("circle", { cx: 160 + rs() * 42, cy: 318 + rs() * 10, r: .9, fill: "#8a6a4a" }, fig);
    S("path", { d: "M174,332 q7,4 14,0", fill: "none", stroke: C.tinta, "stroke-width": 1.5, "stroke-linecap": "round" }, fig);

    // as 12 chaves
    const rk = rng(1111);
    const chaves = TEXTOS.verdades.map((_, i) => {
      const th = rad(-75 + i * 30);
      const x = 180 + Math.cos(th) * 142, y = 320 + Math.sin(th) * 175;
      const g = S("g", { class: "toque" }, svg);
      const inner = S("g", {}, g);
      const brilho = S("circle", { r: 34, fill: "url(#brilho)", opacity: 0 }, inner);
      useChave(inner, 0, 0, .5, "#D9CDB8");
      const marca = S("circle", { r: 15, fill: "none", stroke: C.tinta, "stroke-width": 1.4, "stroke-dasharray": "3 3", opacity: 0 }, inner);
      S("circle", { r: 30, cy: 14, fill: "transparent" }, g);
      const k = { g, inner, brilho, marca, x, y, rot: (rk() - .5) * 70, fas: rk() * 6, tap: -1e9, achada: false, i };
      g.addEventListener("pointerup", (ev) => { ev.stopPropagation(); tocarChave(k); });
      return k;
    });

    const sob = sobre(raiz);
    const tit = H("div", { class: "t11-titulo" }, sob);
    H("span", { txt: txt("c11_titulo") }, tit);
    const linha = H("div", { class: "t11-linha" }, sob);
    const cont = H("div", { class: "t11-cont", txt: "0/12" }, linha);
    const seguir = H("button", { class: "t11-seguir", txt: txt("c11_seguir") }, linha);
    seguir.addEventListener("pointerup", (ev) => { ev.stopPropagation(); if (fim === null) fim = tt; });

    // camada de cor (fora do filtro): o ponto amarelo
    const cor = arte(raiz, false);
    const escuro = S("rect", { x: -400, y: -400, width: 1160, height: 1440, fill: "#0E0E10", opacity: 0 }, cor);
    const ponto = S("circle", { cx: 180, cy: 320, r: 0, fill: C.amarelo }, cor);
    const pontoG = S("circle", { cx: 180, cy: 320, r: 0, fill: "url(#brilhoOuro)" }, cor);

    let tt = 0, ult = 0, achadas = 0, fim = null, todasEm = null, autoProx = 2200;
    function tocarChave(k) {
      if (fim !== null) return;
      Som.iniciar();
      k.tap = E.relogio;
      ult = tt;
      if (!k.achada) {
        k.achada = true;
        achadas++;
        cont.textContent = achadas + "/12";
        if (achadas >= 3) seguir.classList.add("on");
        if (achadas === 12) todasEm = tt;
      }
      Som.ding(k.i);
      Cartao.mostrar(TEXTOS.verdades[k.i]);
    }

    return {
      tocar(t) {
        tt = t;
        const tq = q12(t);
        tit.style.opacity = fase(t, 200, 1200);
        if (E.gravar && fim === null && achadas < 12 && t > autoProx) {
          tocarChave(chaves.find((c) => !c.achada));
          autoProx = t + 2900;
        }
        if (todasEm !== null && fim === null && t > todasEm + 4200) fim = t;
        fumaca.setAttribute("transform", `translate(${n1(Math.sin(t / 3000) * 20)} 0)`);
        const adv = (.6 + .4 * Math.sin(t / 2200)) * 46 * (1 - achadas / 12) - (achadas / 12) * 30;
        cantos.forEach((c) => c.g.setAttribute("transform", `translate(${n1(c.dx * adv)} ${n1(c.dy * adv)})`));
        const pf = fim === null ? 0 : fase(t, fim, fim + 900);
        const ociosa = fim === null && t - ult > 6000 && (Math.floor((t - ult) / 2000) % 2 === 0);
        const chamando = ociosa ? chaves.find((c) => !c.achada) : null;
        chaves.forEach((k) => {
          const bob = Math.sin(tq / 900 + k.fas) * 6;
          const pt = fase(E.relogio, k.tap, k.tap + 700);
          const giro = pt > 0 && pt < 1 ? eio(pt) * 360 : 0;
          const chama = k === chamando ? Math.sin(t / 55) * 14 : 0;
          const x = lerp(k.x, 180, eio(pf)), y = lerp(k.y + bob, 320, eio(pf));
          k.g.setAttribute("transform", `translate(${n1(x)} ${n1(y)}) scale(${n1((1 - pf * .9) * 100) / 100})`);
          k.inner.setAttribute("transform", `rotate(${n1(k.rot * (1 - pf) + giro + chama)})`);
          k.brilho.setAttribute("opacity", pt > 0 && pt < 1 ? Math.sin(pt * Math.PI) : 0);
          k.marca.setAttribute("opacity", k.achada ? .8 : 0);
          k.g.setAttribute("opacity", 1 - fase(t, fim ?? 1e12, (fim ?? 1e12) + 1000));
        });
        fig.setAttribute("opacity", 1 - pf);
        if (fim !== null) {
          Cartao.esconder();
          seguir.classList.remove("on");
          tit.style.opacity = 1 - pf;
          linha.style.opacity = 1 - pf;
          escuro.setAttribute("opacity", fase(t, fim + 500, fim + 1300));
          const pr = eo(fase(t, fim + 700, fim + 1300)) * 9;
          ponto.setAttribute("r", n1(pr));
          pontoG.setAttribute("r", n1(pr * 4));
          if (t > fim + 1600 && !this.feito) { this.feito = true; this.terminou = { tipo: "corte" }; }
        }
      },
    };
  },
});
