// ═════════════════════════════════════════════════════════════
// ATO 4 — A COR (cenas 12 a 15)
// ═════════════════════════════════════════════════════════════

function rostoAdesivo(pai) {
  const g = S("g", { filter: "url(#adesivo)" }, pai);
  const k = { stroke: "#111", "stroke-width": 3.5, "stroke-linejoin": "round" };
  S("path", { d: "M-64,10 C-72,-52 -30,-80 6,-78 C52,-76 74,-42 66,10 C64,42 56,60 48,68 L-52,68 C-62,54 -64,34 -64,10Z", fill: C.azulCabelo, ...k }, g);
  S("ellipse", { cx: 0, cy: 16, rx: 45, ry: 47, fill: "#F6E1C8", ...k }, g);
  S("path", { d: "M-50,-6 C-42,-52 22,-64 54,-20 C32,-30 2,-30 -20,-12 C-30,-20 -40,-14 -50,-6Z", fill: C.azulCabelo, ...k }, g);
  const flor = S("g", { transform: "translate(40 -38)" }, g);
  for (let i = 0; i < 5; i++) S("circle", { cx: Math.cos(rad(i * 72)) * 7, cy: Math.sin(rad(i * 72)) * 7, r: 6, fill: "#DDE2EC", stroke: "#111", "stroke-width": 1.8 }, flor);
  S("circle", { r: 4, fill: "#A3ABBD", stroke: "#111", "stroke-width": 1.5 }, flor);
  S("circle", { cx: -26, cy: 34, r: 8, fill: C.rosa, opacity: .7 }, g);
  S("circle", { cx: 26, cy: 34, r: 8, fill: C.rosa, opacity: .7 }, g);
  const r = rng(121);
  for (let i = 0; i < 12; i++) S("circle", { cx: (r() - .5) * 50, cy: 24 + r() * 10, r: 1, fill: "#b07850" }, g);
  const olhos = S("g", {}, g);
  [-17, 17].forEach((x) => {
    S("ellipse", { cx: x, cy: 14, rx: 10, ry: 12, fill: "#fff", stroke: "#111", "stroke-width": 2.5 }, olhos);
    S("circle", { cx: x + 4, cy: 16, r: 6.5, fill: "#1a1a2e" }, olhos);
    S("circle", { cx: x + 6, cy: 13, r: 2, fill: "#fff" }, olhos);
  });
  S("path", { d: "M-24,-4 q7,-4 14,0 M10,-4 q7,-4 14,0", fill: "none", stroke: "#111", "stroke-width": 2.2, "stroke-linecap": "round" }, g);
  S("path", { d: "M-6,44 Q2,48 8,43", fill: "none", stroke: "#111", "stroke-width": 2.2, "stroke-linecap": "round" }, g);
  return { g, olhos };
}

function corpoAdesivo(pai) {
  const g = S("g", { filter: "url(#adesivo)" }, pai);
  const k = { stroke: "#111", "stroke-width": 3.2, "stroke-linejoin": "round" };
  S("path", { d: "M-44,-60 C-48,-118 48,-118 44,-60 Z", fill: C.amarelo, ...k }, g);
  S("rect", { x: -20, y: 78, width: 13, height: 40, fill: "#6B6B6B", ...k }, g);
  S("rect", { x: 7, y: 78, width: 13, height: 40, fill: "#6B6B6B", ...k }, g);
  S("path", { d: "M-26,114 L-4,114 L-3,132 L-28,132 Z", fill: C.amarelo, ...k }, g);
  S("path", { d: "M4,114 L26,114 L28,132 L3,132 Z", fill: C.amarelo, ...k }, g);
  S("rect", { x: -30, y: 130, width: 28, height: 6, rx: 2, fill: "#111" }, g);
  S("rect", { x: 2, y: 130, width: 28, height: 6, rx: 2, fill: "#111" }, g);
  S("path", { d: "M-42,56 L42,56 L48,82 L-48,82 Z", fill: "#22305A", ...k }, g);
  S("path", { d: "M-34,-46 L34,-46 L50,62 L-50,62 Z", fill: C.amarelo, ...k }, g);
  S("path", { d: "M-34,-44 C-44,-10 -50,20 -52,42 L-40,44 C-38,20 -32,-6 -26,-28 Z", fill: "#E8B520", ...k }, g);
  S("path", { d: "M34,-44 C44,-10 50,20 52,42 L40,44 C38,20 32,-6 26,-28 Z", fill: "#E8B520", ...k }, g);
  S("circle", { cx: -46, cy: 48, r: 6, fill: "#F6E1C8", ...k }, g);
  S("circle", { cx: 46, cy: 48, r: 6, fill: "#F6E1C8", ...k }, g);
  S("path", { d: "M30,-44 L-30,28", stroke: C.vinho, "stroke-width": 6, "stroke-linecap": "round" }, g);
  S("rect", { x: -44, y: 18, width: 30, height: 24, rx: 4, fill: C.vinho, ...k }, g);
  [-24, -6, 12, 30].forEach((y) => S("circle", { cx: 6, cy: y, r: 3, fill: "#7a5a10" }, g));
  S("path", { d: "M-40,-74 C-46,-118 46,-118 40,-74 C40,-60 30,-50 20,-48 L-20,-48 C-32,-50 -40,-60 -40,-74Z", fill: C.azulCabelo, ...k }, g);
  S("ellipse", { cx: 0, cy: -70, rx: 26, ry: 27, fill: "#F6E1C8", ...k }, g);
  S("path", { d: "M-30,-84 C-24,-108 16,-112 32,-86 C16,-94 -4,-94 -14,-84 Z", fill: C.azulCabelo, ...k }, g);
  const olhos = S("g", {}, g);
  [-10, 10].forEach((x) => {
    S("ellipse", { cx: x, cy: -70, rx: 5.5, ry: 6.5, fill: "#fff", stroke: "#111", "stroke-width": 1.8 }, olhos);
    S("circle", { cx: x - 2, cy: -69, r: 3.4, fill: "#1a1a2e" }, olhos);
  });
  S("path", { d: "M-4,-54 q4,3 8,0", fill: "none", stroke: "#111", "stroke-width": 1.8, "stroke-linecap": "round" }, g);
  const flor = S("g", { transform: "translate(22 -94)" }, g);
  for (let i = 0; i < 5; i++) S("circle", { cx: Math.cos(rad(i * 72)) * 4, cy: Math.sin(rad(i * 72)) * 4, r: 3.4, fill: "#DDE2EC", stroke: "#111", "stroke-width": 1.2 }, flor);
  return { g, olhos };
}

function doce(pai, tipo) {
  const g = S("g", {}, pai);
  if (tipo === 0) {
    S("path", { d: "M-11,12 L11,12 L0,-14 Z", fill: "#F7F3EA", stroke: "#111", "stroke-width": 1.8, "stroke-linejoin": "round" }, g);
    S("path", { d: "M-11,12 L11,12 L6.5,1.5 L-6.5,1.5 Z", fill: C.laranja }, g);
    S("path", { d: "M-11,12 L11,12 L9,7 L-9,7 Z", fill: C.amarelo }, g);
    S("path", { d: "M-11,12 L11,12 L0,-14 Z", fill: "none", stroke: "#111", "stroke-width": 1.8, "stroke-linejoin": "round" }, g);
  } else {
    S("path", { d: "M-10,0 L-22,-9 L-22,9 Z M10,0 L22,-9 L22,9 Z", fill: "rgba(255,255,255,.6)", stroke: "#111", "stroke-width": 1.4, "stroke-linejoin": "round" }, g);
    S("ellipse", { rx: 11, ry: 9, fill: "#EE7FA0", stroke: "#111", "stroke-width": 1.8 }, g);
    S("path", { d: "M-5,-4 q3,-3 7,-2", fill: "none", stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round" }, g);
  }
  return g;
}

// CENA 12 — A cor chega
CENAS.push({
  nome: "cor", dur: 15000, fundo: "#0E0E10",
  textos: [[4300, "c12"]],
  musica: { vol: 0, rampa: .4 },
  sons: [
    [2000, () => Som.musica({ vol: 1, tom: "maior", glock: true, pad: true, desaf: 4, oit: 0, eco: 0, tempo: 1, reiniciar: true, rampa: .3 })],
    [2000, () => Som.sinos(), true],
    [8400, () => Som.carimbo(), true],
    [13200, () => Som.costura(), true],
  ],
  saida: { tipo: "furo", x: 92, y: 104, dur: 1200 },
  montar(raiz) {
    const svg = arte(raiz, false);
    const id = "clip12";
    const cp = S("clipPath", { id }, S("defs", {}, svg));
    const circ = S("circle", { cx: 180, cy: 320, r: 0 }, cp);
    const cont = S("g", { "clip-path": `url(#${id})` }, svg);
    S("rect", { x: -400, y: -400, width: 1160, height: 1440, fill: "url(#rosaFundo)" }, cont);
    const r = rng(1212);
    for (let i = 0; i < 46; i++) S("circle", { cx: r() * 400 - 20, cy: r() * 680 - 20, r: 3 + r() * 16, fill: r() > .5 ? "#E98CA4" : "#FAD0DA", opacity: .45 }, cont);
    const doces = [];
    for (let i = 0; i < 14; i++) {
      const d = doce(cont, i % 2);
      doces.push({ d, x: r() * 360, y: r() * 640, v: .006 + r() * .01, rv: (r() - .5) * .08, s: .8 + r() * .5 });
    }
    const corpo = corpoAdesivo(cont);
    corpo.g.setAttribute("transform", "translate(128 412) scale(1.02)");
    const rosto = rostoAdesivo(cont);
    rosto.g.setAttribute("transform", "translate(242 228) scale(.98)");
    // carimbo de correio
    const car = S("g", { opacity: 0 }, cont);
    const carIn = S("g", {}, car);
    S("circle", { r: 44, fill: "none", stroke: C.vinho, "stroke-width": 3 }, carIn);
    S("circle", { r: 37, fill: "none", stroke: C.vinho, "stroke-width": 1.4 }, carIn);
    for (let i = 0; i < 4; i++) S("path", { d: `M48,${-18 + i * 12} q12,-6 24,0 q12,6 24,0 q12,-6 24,0`, fill: "none", stroke: C.vinho, "stroke-width": 2.4 }, carIn);
    S("text", { y: -8, "text-anchor": "middle", fill: C.vinho, style: "font:bold 13px 'Courier New',monospace;letter-spacing:3px", txt: txt("c12_carimbo_a") }, carIn);
    S("text", { y: 14, "text-anchor": "middle", fill: C.vinho, style: "font:bold 17px 'Courier New',monospace;letter-spacing:2px", txt: txt("c12_carimbo_b") }, carIn);
    const costura = S("circle", { r: 52, fill: "none", stroke: C.amarelo, "stroke-width": 3, "stroke-dasharray": "6 5", "stroke-linecap": "round" }, car);
    const Lc = 2 * Math.PI * 52;

    // escuro + ponto amarelo (pausa dramática)
    const ponto = S("circle", { cx: 180, cy: 320, r: 9, fill: C.amarelo }, svg);
    const pontoG = S("circle", { cx: 180, cy: 320, r: 36, fill: "url(#brilhoOuro)" }, svg);

    return {
      tocar(t) {
        const pb = fase(t, 2000, 3800);
        circ.setAttribute("r", n1(eo(pb) * 760));
        setCor(fase(t, 2000, 4200));
        const pul = 1 + Math.sin(t / 260) * .12;
        ponto.setAttribute("r", n1(9 * pul * (1 - pb)));
        pontoG.setAttribute("r", n1(36 * pul * (1 - pb * .5)));
        pontoG.setAttribute("opacity", 1 - pb);
        const tq = q12(t);
        doces.forEach((d) => {
          const y = ((d.y + t * d.v) % 700) - 30;
          d.d.setAttribute("transform", `translate(${n1(d.x)} ${n1(y)}) rotate(${n1(tq * d.rv)}) scale(${d.s.toFixed(2)})`);
        });
        const pisca = [6400, 11000].some((b) => tq >= b && tq < b + 170);
        [rosto, corpo].forEach((o) => o.olhos.setAttribute("transform", pisca ? "translate(0 14) scale(1 .12) translate(0 -14)" : ""));
        if (!pisca) corpo.olhos.setAttribute("transform", "");
        const pc = fase(t, 8400, 8680);
        car.setAttribute("opacity", pc > 0 ? 1 : 0);
        car.setAttribute("transform", `translate(92 104) rotate(${n1(-14 + pc * 4)}) scale(${n1(lerp(1.5, 1, eo(pc)) * 100) / 100})`);
        const ps = fase(t, 13000, 14400);
        const np = Math.floor((Lc * ps) / 11);
        costura.setAttribute("opacity", ps > 0 ? 1 : 0);
        costura.style.strokeDasharray = np > 0 ? "6 5 ".repeat(np) + `0 ${n1(Lc + 10)}` : `0 ${n1(Lc + 10)}`;
        const bob = Math.sin(t / 900) * 3;
        corpo.g.setAttribute("transform", `translate(128 ${n1(412 + bob)}) rotate(${n1(Math.sin(tq / 1200) * 2)}) scale(1.02)`);
        rosto.g.setAttribute("transform", `translate(242 ${n1(228 - bob)}) rotate(${n1(Math.sin(tq / 1500 + 1) * 3)}) scale(.98)`);
      },
    };
  },
});

// CENA 13 — O nome (S, A, R, A, H — o H por último, em destaque)
CENAS.push({
  nome: "nome", dur: 13200, fundo: "linear-gradient(170deg, #F8DC7A 0%, #F6C9A0 55%, #F2A6B8 100%)",
  textos: [[8300, "c13"]],
  sons: [[7700, () => Som.sinos(), true]],
  saida: { tipo: "sobe", dur: 1300 },
  montar(raiz) {
    const svg = arte(raiz, false);
    const ouro = C.amareloEsc;
    // botão-lua que se desfaz em fio
    const lua = S("g", {}, svg);
    S("circle", { cx: 180, cy: 175, r: 120, fill: "url(#brilhoOuro)", opacity: .5 }, lua);
    useBotao(lua, 180, 175, 70, "#F8DC7A");
    const esp = [];
    for (let i = 0; i <= 120; i++) { const a = i * .24, rr = 6 + i * .62; esp.push([180 + Math.cos(a) * rr, 175 + Math.sin(a) * rr]); }
    esp.push([140, 280], [60, 300]);
    const espiral = S("path", { d: suave(esp), fill: "none", stroke: ouro, "stroke-width": 2.2, "stroke-linecap": "butt" }, svg);
    const Le = espiral.getTotalLength();
    espiral.style.strokeDasharray = Le; espiral.style.strokeDashoffset = Le;

    // as letras
    const nome = NOME.toUpperCase();
    const esc = .9, gap = 10;
    const larg = [...nome].reduce((s, ch) => s + GLIFOS[ch].w + gap, -gap) * esc;
    let x = 180 - larg / 2;
    const letras = [...nome].map((ch, i) => {
      const g = S("g", { transform: `translate(${n1(x)} 300) scale(${esc})` }, svg);
      const d = rabisco(GLIFOS[ch].d, .7, 500 + i * 9, 3);
      const sombra = S("path", { d, fill: "none", stroke: "rgba(122,46,62,.18)", "stroke-width": 9, "stroke-linecap": "round", transform: "translate(2 3)" }, g);
      const base = S("path", { d, fill: "none", stroke: ouro, "stroke-width": 2.2, opacity: .55, "stroke-linecap": "round" }, g);
      const ponto = S("path", { d, fill: "none", stroke: "#B5770A", "stroke-width": 7.5, "stroke-linecap": "round" }, g);
      const brilho = S("path", { d, fill: "none", stroke: "#FFE58A", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
      const L = ponto.getTotalLength();
      const cx = x + (GLIFOS[ch].w * esc) / 2;
      x += (GLIFOS[ch].w + gap) * esc;
      return { g, sombra, base, ponto, brilho, L, cx, ini: 2600 + i * 1000 };
    });
    const ultima = letras[letras.length - 1];
    const halo = S("circle", { cx: ultima.cx, cy: 345, r: 0, fill: "url(#brilhoOuro)" }, svg);
    svg.insertBefore(halo, ultima.g);
    const r = rng(1313);
    const parts = E.reduzido ? [] : Array.from({ length: 30 }, () => ({
      a: r() * Math.PI * 2, v: .04 + r() * .09, rr: 1.5 + r() * 2.5,
      el: S("circle", { r: 0, fill: r() > .5 ? C.amarelo : "#FFF3B8" }, svg),
    }));
    const pontos = (L, p) => {
      const n = Math.floor((L * p) / 14);
      return n > 0 ? "9 5 ".repeat(n) + `0 ${n1(L + 20)}` : `0 ${n1(L + 20)}`;
    };
    let ticks = 0;
    return {
      tocar(t) {
        const pd = fase(t, 300, 2600);
        lua.setAttribute("opacity", 1 - eio(fase(t, 900, 2500)));
        lua.setAttribute("transform", `rotate(${n1(pd * 200)} 180 175)`);
        espiral.style.strokeDashoffset = Le * (1 - eio(pd));
        espiral.setAttribute("opacity", 1 - fase(t, 2600, 3600));
        letras.forEach((l, i) => {
          const p = fase(t, l.ini, l.ini + 900);
          l.g.style.visibility = p > 0 ? "visible" : "hidden";
          l.base.style.strokeDasharray = `${n1(l.L * p)} ${n1(l.L + 20)}`;
          l.sombra.style.strokeDasharray = `${n1(l.L * p)} ${n1(l.L + 20)}`;
          const dash = pontos(l.L, p);
          l.ponto.style.strokeDasharray = dash;
          l.brilho.style.strokeDasharray = dash;
          l.brilho.style.strokeDashoffset = 1.5;
          const nt = Math.floor(p * 6);
          if (p > 0 && p < 1 && i * 6 + nt > ticks) { ticks = i * 6 + nt; Som.tick(); }
        });
        // o H: brilha e pulsa duas vezes
        const ph = fase(t, ultima.ini + 900, ultima.ini + 2500);
        const pulso = Math.sin(ph * Math.PI * 2) ** 2;
        ultima.g.setAttribute("transform", `translate(${n1(ultima.cx)} 345) scale(${(1 + pulso * .16).toFixed(3)}) translate(${n1(-ultima.cx)} -345) ` + `translate(${n1(ultima.cx - (GLIFOS[nome[nome.length - 1]].w * esc) / 2)} 300) scale(${esc})`);
        halo.setAttribute("r", n1(ph > 0 ? 40 + pulso * 50 : 0));
        halo.setAttribute("opacity", (ph > 0 ? .5 + pulso * .5 : 0) * (1 - fase(t, 11500, 12500) * .6));
        parts.forEach((q) => {
          const u = Math.max(0, t - ultima.ini - 900);
          const pp = clamp(u / 2200);
          if (pp <= 0 || pp >= 1) { q.el.setAttribute("r", 0); return; }
          q.el.setAttribute("cx", n1(ultima.cx + Math.cos(q.a) * q.v * u));
          q.el.setAttribute("cy", n1(345 + Math.sin(q.a) * q.v * u + u * u * .00002));
          q.el.setAttribute("r", n1(q.rr * (1 - pp)));
        });
      },
    };
  },
});

// CENA 14 — Final
CENAS.push({
  nome: "final", dur: 21000, fundo: "radial-gradient(circle at 50% 38%, #FBE38E 0%, #F2C230 70%, #E3A91C 100%)",
  sons: [[3800, () => Som.fio(), true], [8400, () => Som.fio(), true], [12400, () => Som.sinos(), true], [17600, () => Som.musica({ vol: 0, rampa: 3.2 })]],
  saida: { tipo: "rasgo", dur: 1500 },
  montar(raiz) {
    const svg = arte(raiz, false);
    const poster = S("g", {}, svg);
    // fios dourados em S
    const fios = [
      "M172,196 C130,250 116,300 146,346 C170,384 120,420 92,470 C70,512 84,566 126,606",
      "M190,196 C232,252 246,300 214,346 C188,384 242,426 270,470 C292,508 280,562 246,612",
    ].map((d) => {
      const p = S("path", { d: rabisco(d, .5, 19, 6), fill: "none", stroke: C.amareloEsc, "stroke-width": 1.7, opacity: .9 }, poster);
      const L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      return { p, L };
    });
    // a mesma mão do pôster, agora aberta e suave (pontas arredondadas, sem garras)
    const mao = S("g", {}, poster);
    [
      ["M372,22 C262,0 120,14 76,82 C58,112 62,150 76,180", 22, 9],
      ["M372,56 C280,40 170,58 136,104 C118,130 122,160 134,184", 17, 8],
      ["M372,88 C330,84 296,100 286,136 C280,160 286,180 298,196", 16, 8],
      ["M372,108 C384,140 372,176 350,206", 18, 8],
    ].forEach(([d, w0, w1], i) => {
      S("path", { d: tuboD(d, w0, w1, 140 + i, .7, .8), fill: "#2A1D17" }, mao);
      S("path", { d: rabisco(d, .9, 150 + i, 6), fill: "none", stroke: "#C98F12", "stroke-width": 1, opacity: .55, transform: "translate(-2 2)" }, mao);
      const fim = amostrar(d, 8)[0].slice(-1)[0];
      S("circle", { cx: n1(fim[0]), cy: n1(fim[1]), r: w1 / 2, fill: "#2A1D17" }, mao);
    });
    const chave = S("g", {}, poster);
    useChave(chave, 181, 172, .95, "#F7D36A");
    const escrever = tituloCoraline(poster, 180, 372, .78, C.tinta, "#F7D36A");

    const sob = sobre(raiz);
    const a = H("div", { class: "t14 t14-a" }, sob);
    const b = H("div", { class: "t14 t14-b" }, sob);
    const c = H("div", { class: "t14 t14-c" }, sob);
    const ea = escrita(a, txt("c14a")), eb = escrita(b, txt("c14b")), ec = escrita(c, txt("c14c"));

    // botões que viram confete
    const r = rng(1414);
    const cores = [C.azulVivo, C.rosa, C.lilas, C.laranja, C.vinho, "#151314", "#fff"];
    const conf = E.reduzido ? [] : Array.from({ length: 18 }, () => {
      const g = S("g", {}, svg);
      const rr = 6 + r() * 7, cor = cores[Math.floor(r() * cores.length)];
      S("circle", { r: rr, fill: cor, stroke: "#111", "stroke-width": 1.2 }, g);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([p, q]) => S("circle", { cx: p * rr * .3, cy: q * rr * .3, r: rr * .14, fill: "rgba(0,0,0,.45)" }, g));
      return { g, x: r() * 360, v: .05 + r() * .07, d: r() * 1800, rot: (r() - .5) * .3, sw: r() * 6 };
    });

    return {
      tocar(t) {
        const tq = q12(t);
        const desce = lerp(-200, 0, eo(fase(t, 0, 1600)));
        mao.setAttribute("transform", `translate(0 ${n1(desce)})`);
        chave.setAttribute("transform", `translate(0 ${n1(desce)}) rotate(${n1(Math.sin(tq / 900) * 3)} 181 150)`);
        escrever(fase(t, 1000, 3400));
        fios.forEach(({ p, L }) => (p.style.strokeDashoffset = L * (1 - eio(fase(t, 1200, 4000)))));
        ea(t - 3800);
        eb(t - 8400);
        ec(t - 12600);
        const fp = fase(t, 12000, 12900);
        poster.setAttribute("opacity", (1 - fp * .9).toFixed(3));
        a.style.opacity = b.style.opacity = (1 - fp * .85).toFixed(3);
        conf.forEach((k) => {
          const u = t - 13200 - k.d;
          if (u < 0) { k.g.setAttribute("opacity", 0); return; }
          k.g.setAttribute("opacity", 1 - fase(t, 19500, 20800));
          k.g.setAttribute("transform", `translate(${n1(k.x + Math.sin(u / 500 + k.sw) * 14)} ${n1(-20 + u * k.v)}) rotate(${n1(u * k.rot)})`);
        });
      },
    };
  },
});

// CENA 15 — Depois do fim (aberta)
CENAS.push({
  nome: "depois", dur: null, interativa: true, semProgresso: true, fundo: "#0E0E10",
  musica: { vol: .5, tom: "maior", glock: false, pad: true, reiniciar: true, rampa: 3 },
  sons: [[200, () => Som.rasgo(), true]],
  montar(raiz) {
    H("div", { class: "trama" }, raiz);
    const svg = arte(raiz, false);
    const r = rng(1515);
    const cores = [C.amarelo, "#8FA8F0", "#B6A9EE", C.rosa, "#F7F1E4"];
    const estrelas = Array.from({ length: 34 }, () => {
      const e = S("use", { href: "#estrela", x: -10, y: -10, width: 20, height: 20, color: cores[Math.floor(r() * cores.length)] }, svg);
      return { e, x: r() * 380 - 10, y: r() * 600 + 10, s: .3 + r() * .7, f: r() * 6 };
    });
    // a mão solta o botão e recua
    const livre = S("g", {}, svg);
    useBotao(livre, 140, 330, 72, "#0E0E10");
    const maoG = S("g", {}, svg);
    const mao = maoEsqueleto(maoG, 5);
    const gato = gatoEspia(svg, 344, 380, -90, "c15", 1.35, () => {
      Som.miau();
      if (E.gatos.size >= 5) Cartao.mostrar(txt("c15_gato"), undefined, true);
      else aviso(txt("aviso_gato", { G: E.gatos.size }));
    });
    gato.g.style.setProperty("--olho", C.amarelo);

    // 10 botões escondidos
    // longe do envelope, do rodapé e do cartão (que aparece embaixo)
    const POS = [[46, 96], [180, 118], [314, 92], [56, 196], [304, 186], [40, 312], [320, 304], [96, 432], [264, 446], [180, 488]];
    const achados = new Set();
    const bts = POS.map(([x, y], i) => {
      const g = S("g", { class: "toque" }, svg);
      S("circle", { r: 32, fill: "transparent" }, g);
      const halo = S("circle", { r: 24, fill: "url(#brilhoOuro)", opacity: .5 }, g);
      const anel = S("circle", { r: 19, fill: "none", stroke: C.amarelo, "stroke-width": 2, "stroke-dasharray": "3 3", opacity: 0 }, g);
      useBotao(g, 0, 0, 12 + (i % 3) * 2, "#9a8a64");
      g.addEventListener("pointerup", (ev) => {
        ev.stopPropagation();
        Som.ding(i + 2);
        Cartao.mostrar(TEXTOS.botoes[i], undefined, true);
        if (!achados.has(i)) { achados.add(i); anel.setAttribute("opacity", 1); contar(); }
      });
      return { g, halo, x, y, f: i * .7, i };
    });

    const sob = sobre(raiz);
    const topo = H("div", { class: "t15-topo" }, sob);
    function contar() { topo.textContent = txt("c15_contador", { B: achados.size, G: E.gatos.size }); }
    contar();
    const env = H("button", { class: "t15-envelope", "aria-label": txt("c15_abrir") }, sob);
    const selo = S("svg", { class: "selo", viewBox: "-50 -50 100 100" }, env);
    S("circle", { r: 48, fill: C.vinho }, selo);
    [[-11, -11], [11, -11], [-11, 11], [11, 11]].forEach(([x, y]) => S("circle", { cx: x, cy: y, r: 7, fill: "#3d141d" }, selo));
    H("span", { class: "rotulo", txt: txt("c15_abrir") }, env);
    const rod = H("div", { class: "t15-rodape" }, sob);
    const denovo = H("button", { txt: txt("c15_denovo") }, rod);
    const gravar = H("button", { txt: txt("c15_gravar") }, rod);
    H("div", { class: "t15-credito", txt: txt("c15_credito") }, sob);

    // a carta
    const carta = H("div", { class: "carta", role: "dialog", "aria-label": "carta" }, raiz);
    const rolar = H("div", { class: "rolar" }, carta);
    const pars = TEXTOS.carta.map((p) => H("p", { class: p.tipo || "", txt: resolver(p.t) }, rolar));
    const fechar = H("button", { class: "fechar", "aria-label": txt("c15_fechar"), txt: "×" }, carta);
    const fecharFim = H("button", { class: "fechar-fim", txt: txt("c15_fechar") }, rolar);
    let abertaEm = null;
    const abrir = () => { palco.classList.add("lendo"); carta.classList.add("on"); abertaEm = E.relogio; rolar.scrollTop = 0; pars.forEach((p) => p.classList.remove("v")); fecharFim.classList.remove("v"); Som.fio(); Cartao.esconder(); };
    env.addEventListener("click", (e) => { e.stopPropagation(); abrir(); });
    const fecharCarta = (e) => {
      e.stopPropagation();
      carta.classList.remove("on");
      palco.classList.remove("lendo");
      abertaEm = null;
      if (achados.size < 10) aviso(txt("c15_dica"), 3200);
    };
    fechar.addEventListener("click", fecharCarta);
    fecharFim.addEventListener("click", fecharCarta);
    denovo.addEventListener("click", (e) => { e.stopPropagation(); recomecar(); });
    gravar.addEventListener("click", (e) => { e.stopPropagation(); location.href = location.pathname + "?gravar=1"; });

    let gatoDito = false;
    return {
      tocar(t) {
        const tq = q12(t);
        estrelas.forEach((s) => {
          const nasce = fase(t, 400 + s.f * 300, 900 + s.f * 300);
          s.e.setAttribute("transform", `translate(${n1(s.x)} ${n1(s.y)}) scale(${(s.s * nasce * (Math.sin(tq / 400 + s.f) > .3 ? 1 : .6)).toFixed(3)})`);
        });
        mao.atualizar(eio(fase(tq, 400, 1800)));
        maoG.setAttribute("transform", `translate(${n1(eio(fase(t, 1600, 3600)) * 340)} 0)`);
        livre.setAttribute("transform", `translate(${n1(Math.sin(t / 2600) * 10)} ${n1(Math.sin(t / 1900) * 12 - fase(t, 1600, 5000) * 40)}) rotate(${n1(t * .006)} 140 330)`);
        livre.setAttribute("opacity", 1 - fase(t, 4000, 6000) * .55);
        bts.forEach((b) => {
          b.g.setAttribute("transform", `translate(${b.x} ${n1(b.y + Math.sin(t / 1300 + b.f) * 4)})`);
          const pul = achados.has(b.i) ? .8 : .45 + .55 * Math.max(0, Math.sin(t / 700 + b.f * 2));
          b.halo.setAttribute("opacity", pul.toFixed(2));
          b.halo.setAttribute("r", n1(20 + pul * 10));
        });
        env.style.setProperty("--s", eo(fase(t, 2600, 3400)).toFixed(3));
        topo.style.opacity = rod.style.opacity = fase(t, 3200, 4200);
        gato.tocar(t);
        if (t % 1000 < 20) contar();
        if (!gatoDito && E.gatos.size >= 5 && t > 4500) {
          gatoDito = true;
          Som.miau();
          Cartao.mostrar(txt("c15_gato"), undefined, true);
        }
        if (abertaEm !== null) {
          const u = E.relogio - abertaEm;
          pars.forEach((p, i) => { if (u > 600 + i * 900) p.classList.add("v"); });
          if (u > 600 + pars.length * 900) fecharFim.classList.add("v");
          if (E.gravar && u > 3000) rolar.scrollTop += .6;
        }
        if (E.gravar && abertaEm === null && t > 5200 && !this.abriu) { this.abriu = true; abrir(); }
      },
      sair() { palco.classList.remove("lendo"); },
    };
  },
});
