// ═════════════════════════════════════════════════════════════
// ATO 1 — O MUNDO CINZA (cenas 0 a 3)
// ═════════════════════════════════════════════════════════════

// CENA 0 — Portal de entrada
CENAS.push({
  nome: "portal", dur: null, cinza: true, semProgresso: true,
  fundo: "radial-gradient(circle at 50% 42%, #8E7656 0%, #5A4730 55%, #2B2117 100%)",
  montar(raiz) {
    const svg = arte(raiz);
    const cx = 180, cy = 285;
    const anel = S("circle", { cx, cy, r: 118, fill: "none", stroke: C.claro, "stroke-width": 2.2, "stroke-dasharray": "7 8", "stroke-linecap": "round", opacity: .75 }, svg);
    const anel2 = S("circle", { cx, cy, r: 131, fill: "none", stroke: C.claro, "stroke-width": 1.1, "stroke-dasharray": "2 10", opacity: .4 }, svg);
    S("circle", { cx, cy, r: 150, fill: "url(#brilho)", opacity: .12 }, svg);
    const g = S("g", {}, svg);
    useBotao(g, cx, cy, 92, "#6E5A3E");
    const hit = S("circle", { cx, cy, r: 120, fill: "transparent", class: "toque" }, svg);

    const sob = sobre(raiz);
    H("div", { class: "t0-para", txt: txt("c0_para") }, sob);
    const dica = H("div", { class: "t0-dica", txt: txt("c0_toque") }, sob);
    const egg = H("div", { class: "t0-egg", txt: txt("c0_egg") }, sob);

    let tt = 0, apertou = null, ovo = false, saindo = null, rot = 0;
    hit.addEventListener("pointerdown", () => { apertou = tt; Som.iniciar(); });

    return {
      tocar(t) {
        tt = t;
        const resp = 1 + .04 * (.5 + .5 * Math.sin(t / 650));
        if (saindo !== null) rot = eio(fase(t, saindo, saindo + 650)) * 240;
        g.setAttribute("transform", `translate(${cx} ${cy}) scale(${resp.toFixed(4)}) rotate(${n1(rot)}) translate(${-cx} ${-cy})`);
        anel.setAttribute("transform", `rotate(${n1(t * .012 + rot * 2)} ${cx} ${cy})`);
        anel2.setAttribute("transform", `rotate(${n1(-t * .006)} ${cx} ${cy})`);
        if (apertou !== null && !ovo && t - apertou > 3000) {
          ovo = true;
          egg.classList.add("on");
          Som.costura();
        }
        if (E.gravar && saindo === null && Som.pronto() && t > 1200) this.tap();
        if (saindo !== null && t > saindo + 680 && !this.feito) {
          this.feito = true;
          const a = rad(rot + 45), r = 20.7 * resp * Math.SQRT2;
          this.terminou = { tipo: "furo", x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, dur: 1300 };
        }
      },
      tap() {
        Som.iniciar();
        if (saindo !== null) return true;
        const segurou = apertou !== null ? tt - apertou : 0;
        apertou = null;
        if (ovo && segurou >= 3000) return true;
        saindo = tt;
        Som.acorde();
        dica.classList.add("off");
        return true;
      },
    };
  },
});

// CENA 1 — Título
CENAS.push({
  nome: "titulo", dur: 11500, cinza: true, fundo: "#D8C3A0",
  textos: [[3900, "c1"]],
  musica: { vol: 1, tom: "menor", oit: 0, desaf: 5, tempo: 1, glock: false, pad: false, eco: 0, drone: 0, reiniciar: true },
  sons: [[1200, () => Som.fio(), true]],
  saida: { tipo: "puxa", dur: 1200 },
  montar(raiz) {
    const svg = arte(raiz);
    // fios em S saindo do botão da chave
    const fios = [
      "M172,196 C130,250 116,300 146,346 C170,384 120,420 92,470 C70,512 84,566 126,606",
      "M190,196 C232,252 246,300 214,346 C188,384 242,426 270,470 C292,508 280,562 246,612",
    ].map((d) => {
      const p = S("path", { d: rabisco(d, .6, 9, 6), fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.1, opacity: .85 }, svg);
      const L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      return { p, L };
    });

    const mao = S("g", {}, svg);
    const dedos = [
      ["M372,28 C250,-2 90,8 40,90 C20,130 30,190 54,240", 24, 2],
      ["M372,60 C270,40 150,55 110,110 C85,145 95,190 113,228", 18, 2],
      ["M372,92 C320,85 280,100 268,140 C258,175 270,205 287,234", 17, 2],
      ["M372,110 C386,150 366,200 332,252", 20, 2],
    ];
    dedos.forEach(([d, w0, w1], i) => {
      S("path", { d: tuboD(d, w0, w1, 10 + i, 1.3, .8), fill: C.tinta }, mao);
      S("path", { d: rabisco(d, 1.4, 60 + i, 6), fill: "none", stroke: "#8a7a62", "stroke-width": 1, opacity: .55, transform: "translate(-2 3)" }, mao);
    });
    useChave(mao, 181, 172, .95, "#D8C3A0");

    const escrever = tituloCoraline(svg, 180, 372, .78, C.tinta, "#D8C3A0");
    const para = S("text", { x: 180, y: 492, "text-anchor": "middle", style: "font-family:var(--mao);font-size:22px", fill: C.tinta, opacity: 0, txt: txt("c1_para") }, svg);
    const gato = gatoEspia(svg, 340, 296, -90, "c1");

    return {
      tocar(t) {
        const y = lerp(-300, 0, eo(fase(t, 0, 1700))) + Math.sin(q12(t) / 1300) * 3;
        mao.setAttribute("transform", `translate(0 ${n1(y)})`);
        escrever(fase(t, 1000, 3800));
        fios.forEach(({ p, L }) => (p.style.strokeDashoffset = L * (1 - eio(fase(t, 1200, 4200)))));
        para.setAttribute("opacity", fase(t, 3200, 4200));
        gato.tocar(t);
      },
    };
  },
});

// CENA 2 — A linha (caixa de costura)
CENAS.push({
  nome: "linha", dur: 13500, cinza: true, fundo: "#DCDAD6",
  textos: [[2300, "c2a"], [7200, "c2b"]],
  sons: [[2700, () => Som.fio(), true], [5300, () => Som.tick(), true], [5450, () => Som.tick(), true]],
  saida: { tipo: "furo", x: 166, y: 236, dur: 1200 },
  montar(raiz) {
    const svg = arte(raiz);
    const cam = S("g", {}, svg);
    const ext = [[180, 46], [324, 140], [324, 500], [180, 594], [36, 500], [36, 140]];
    const int = [[180, 80], [298, 157], [298, 483], [180, 560], [62, 483], [62, 157]];
    S("path", { d: poli(ext), fill: "url(#listras)" }, cam);
    traco(cam, poli(ext), { w: 3, seed: 4 });
    forma(cam, poli(int), "#F3F1EC", { w: 2, seed: 8 });
    S("path", { d: poli(int), fill: "url(#hFina)", opacity: .12 }, cam);

    [[180, 222], [180, 418]].forEach(([x, y], i) => {
      S("circle", { cx: x + 5, cy: y + 6, r: 60, fill: "rgba(0,0,0,.14)" }, cam);
      useBotao(cam, x, y, 60, "#F3F1EC");
      S("circle", { cx: x, cy: y, r: 52, fill: "none", stroke: "#F3F1EC", "stroke-width": 1.5, "stroke-dasharray": "6 6", opacity: .8, transform: `rotate(${i * 20} ${x} ${y})` }, cam);
    });

    // carretel
    const carr = S("g", {}, cam);
    S("circle", { cx: 276, cy: 322, r: 30, fill: "#cfcdc8", stroke: C.tinta, "stroke-width": 2 }, carr);
    S("circle", { cx: 268, cy: 322, r: 30, fill: "#F3F1EC", stroke: C.tinta, "stroke-width": 2.2 }, carr);
    const giro = S("g", {}, carr);
    S("circle", { cx: 268, cy: 322, r: 22, fill: "none", stroke: "#555", "stroke-width": .9, "stroke-dasharray": "5 3" }, giro);
    S("circle", { cx: 268, cy: 322, r: 15, fill: "none", stroke: "#555", "stroke-width": .9, "stroke-dasharray": "3 4" }, giro);
    S("circle", { cx: 268, cy: 322, r: 4.2, fill: C.tinta }, carr);

    const fio = S("path", { fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.4, "stroke-linecap": "round" }, cam);
    const laco = S("path", { fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.3, opacity: 0 }, cam);

    // agulha (ponta na origem, apontando para +x)
    const ag = S("g", { class: "toque" }, cam);
    S("rect", { x: -130, y: -14, width: 140, height: 28, fill: "transparent" }, ag);
    S("path", { d: "M0,0 L-104,-3.4 Q-123,-3.2 -125,0 Q-123,3.2 -104,3.4 Z", fill: "#D4D4D4", stroke: C.tinta, "stroke-width": 1.3 }, ag);
    S("ellipse", { cx: -114, cy: 0, rx: 6.5, ry: 1.4, fill: "#F3F1EC", stroke: C.tinta, "stroke-width": .8 }, ag);
    S("path", { d: "M-96,-1.4 L-20,-.6", stroke: "#fff", "stroke-width": .8, opacity: .8 }, ag);
    let lacoIni = -9999;
    ag.addEventListener("pointerup", (e) => { e.stopPropagation(); lacoIni = E.relogio; Som.fio(); });

    return {
      tocar(t) {
        const pc = eo(fase(t, 0, 2300));
        cam.setAttribute("transform", `translate(180 320) scale(${n1((1.5 - .5 * pc) * 1000) / 1000}) rotate(${n1(-6 * (1 - pc))}) translate(-180 ${-320 - 70 * (1 - pc)})`);
        const tq = q12(t);
        const p = eio(fase(tq, 2600, 5400));
        const tx = lerp(214, 166, p), ty = lerp(320, 236, p), a = lerp(0, -52, p);
        ag.setAttribute("transform", `translate(${n1(tx)} ${n1(ty)}) rotate(${n1(a)})`);
        const ex = tx + Math.cos(rad(a)) * -114, ey = ty + Math.sin(rad(a)) * -114;
        fio.setAttribute("d", `M268,292 C262,236 ${n1(ex + 40)},${n1(ey + 120)} ${n1(ex - 30)},${n1(ey + 20)} C${n1(ex - 60)},${n1(ey - 10)} ${n1(ex - 20)},${n1(ey - 26)} ${n1(ex)},${n1(ey)}`);
        const L = fio.getTotalLength();
        const pd = eio(fase(t, 900, 2600));
        fio.style.strokeDasharray = L;
        fio.style.strokeDashoffset = L * (1 - pd);
        giro.setAttribute("transform", `rotate(${n1(tq * .05)} 268 322)`);
        const pl = fase(E.relogio, lacoIni, lacoIni + 1300);
        if (pl > 0 && pl < 1) {
          laco.setAttribute("d", `M${n1(ex)},${n1(ey)} c-40,-50 -80,10 -40,30 c30,15 50,-30 20,-40`);
          laco.setAttribute("opacity", Math.sin(pl * Math.PI));
        } else laco.setAttribute("opacity", 0);
      },
    };
  },
});

// CENA 3 — A boneca costurada
CENAS.push({
  nome: "boneca", dur: 16800, cinza: true, fundo: "#CBC3B3",
  textos: [[2400, "c3a"], [6400, "c3b"], [12000, "c3c"]],
  sons: [
    [2400, () => Som.musica({ desaf: 38 })],
    [12000, () => Som.musica({ desaf: 5 })],
    [14900, () => Som.queda(), true],
  ],
  saida: { tipo: "queda", dur: 1300 },
  montar(raiz) {
    const svg = arte(raiz);
    const corpo = S("g", {}, svg);

    // armação articulada (braços de compasso)
    const J = { top: [196, 34], a: [110, 66], b: [70, 156], c: [252, 74], d: [302, 172], eL: [132, 268], eR: [230, 268] };
    const barras = [["top", "a"], ["a", "b"], ["b", "eL"], ["top", "c"], ["c", "d"], ["d", "eR"], ["a", "d"], ["b", "c"]];
    const arm = S("g", {}, corpo);
    S("path", { d: "M196,-60 L196,34", stroke: "#7d7d7d", "stroke-width": 6 }, arm);
    const barEls = barras.map(() => S("path", { fill: "#8F8F8F", stroke: C.tinta, "stroke-width": 1.4 }, arm));
    const jEls = Object.keys(J).map(() => {
      const g = S("g", {}, arm);
      S("circle", { r: 6, fill: "#9a9a9a", stroke: C.tinta, "stroke-width": 1.4 }, g);
      S("path", { d: "M-2.6,0 L2.6,0", stroke: C.tinta, "stroke-width": 1.2 }, g);
      return g;
    });

    const bon = S("g", {}, corpo);
    // pernas e botas
    [[166, 0], [194, 1]].forEach(([x, i]) => {
      S("path", { d: `M${x},468 L${x + (i ? 2 : -2)},520`, stroke: "#4a4a4a", "stroke-width": 7, "stroke-linecap": "round" }, bon);
      forma(bon, `M${x - 11},516 L${x + 9},516 L${x + 12},540 L${x - 13},540 Z`, "#D49A1E", { w: 1.8, seed: 70 + i });
      traco(bon, `M${x - 6},522 L${x + 4},532 M${x + 4},522 L${x - 6},532`, { w: 1.3, duplo: false, amp: .3, seed: 72 + i });
    });
    // saia
    forma(bon, "M142,440 L218,440 L226,474 L134,474 Z", "#6f6f6f", { w: 1.8, seed: 21, hachura: "hFina", hop: .4 });
    // casaco
    forma(bon, "M140,322 C150,314 210,314 220,322 L240,452 C210,460 150,460 120,452 Z", "#D49A1E", { w: 2.2, seed: 22 });
    S("path", { d: "M168,322 L180,372 L192,322 Z", fill: "#3a3a3a", stroke: C.tinta, "stroke-width": 1.4 }, bon);
    [0, 1, 2].forEach((i) => S("circle", { cx: 176 + i * 2, cy: 345 + i * 6, r: 1.6, fill: "#bdbdbd" }, bon));
    traco(bon, "M180,374 L178,452", { w: 1.4, duplo: false, seed: 23 });
    [384, 404, 424].forEach((y) => S("circle", { cx: 170, cy: y, r: 3.2, fill: "#5a3d0a", stroke: C.tinta, "stroke-width": 1 }, bon));
    forma(bon, "M134,402 L160,402 L160,416 L134,416 Z", "#C08917", { w: 1.4, seed: 24 });
    forma(bon, "M198,402 L224,402 L225,416 L199,416 Z", "#C08917", { w: 1.4, seed: 25 });
    // remendo com pontos em cruz
    forma(bon, "M206,360 L226,358 L228,380 L208,382 Z", "#B98316", { w: 1.2, seed: 26 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = 211 + i * 6, y = 364 + j * 6;
      S("path", { d: `M${x - 2},${y - 2} L${x + 2},${y + 2} M${x + 2},${y - 2} L${x - 2},${y + 2}`, stroke: C.tinta, "stroke-width": .8 }, bon);
    }
    // braços / mangas dobradas
    forma(bon, "M140,326 C128,360 122,400 120,430 L134,432 C138,404 144,370 150,340 Z", "#C99318", { w: 1.8, seed: 27 });
    forma(bon, "M220,326 C232,360 238,400 240,430 L226,432 C222,404 216,370 210,340 Z", "#C99318", { w: 1.8, seed: 28 });
    forma(bon, "M118,428 L136,430 L135,440 L117,438 Z", "#B98316", { w: 1.4, seed: 29 });
    forma(bon, "M224,430 L242,428 L243,438 L225,440 Z", "#B98316", { w: 1.4, seed: 30 });

    // cabeça
    const cab = S("g", {}, bon);
    forma(cab, "M118,262 C110,200 150,180 182,182 C220,182 250,205 244,262 C246,300 240,318 236,330 L224,312 C226,290 222,270 214,262 L150,250 C138,262 136,290 138,318 L126,330 C120,310 116,290 118,262Z", "#1F6F78", { w: 2, seed: 31 });
    S("ellipse", { cx: 181, cy: 270, rx: 45, ry: 50, fill: "#C9B27A", stroke: C.tinta, "stroke-width": 2 }, cab);
    const r = rng(33);
    for (let i = 0; i < 22; i++) S("circle", { cx: 150 + r() * 62, cy: 268 + r() * 22, r: .9, fill: "#7b6435", opacity: .7 }, cab);
    forma(cab, "M148,212 C172,196 210,204 226,236 C206,228 182,226 158,242 C162,230 156,220 148,212Z", "#1F6F78", { w: 1.8, seed: 34 });
    for (let i = 0; i < 13; i++) {
      const a = -150 + i * 10;
      const x0 = 182 + Math.cos(rad(a)) * 18, y0 = 196 + Math.sin(rad(a)) * 8;
      const x1 = 182 + Math.cos(rad(a + 180 - (i * 3))) * 0 + (i - 6) * 9.5, y1 = 300 + Math.abs(i - 6) * 4;
      if (i > 3 && i < 9) continue;
      S("path", { d: rabisco(`M${n1(x0)},${n1(y0)} Q${n1((x0 + x1) / 2 + (i - 6) * 3)},${n1(y0 + 40)} ${n1(x1)},${n1(y1)}`, .5, 40 + i, 6), fill: "none", stroke: "#134B5C", "stroke-width": 1, opacity: .8 }, cab);
    }
    [[132, 272], [230, 272]].forEach(([x, y]) => {
      S("circle", { cx: x, cy: y, r: 9, fill: "#8f8f8f", stroke: C.tinta, "stroke-width": 1.6 }, cab);
      S("path", { d: `M${x - 3},${y} L${x + 3},${y}`, stroke: C.tinta, "stroke-width": 1.2 }, cab);
    });
    // olhos de botão com X
    const xs = [[162, 262], [201, 262]].map(([x, y]) => {
      S("circle", { cx: x, cy: y, r: 15.5, fill: "#121112", stroke: "#000", "stroke-width": 1.6 }, cab);
      S("circle", { cx: x, cy: y, r: 11.5, fill: "none", stroke: "#333", "stroke-width": 1 }, cab);
      const g = S("g", {}, cab);
      S("path", { d: `M${x - 7},${y - 7} L${x + 7},${y + 7} M${x + 7},${y - 7} L${x - 7},${y + 7}`, stroke: "#f2efe8", "stroke-width": 2.6, "stroke-linecap": "round" }, g);
      return { g, x, y };
    });
    traco(cab, "M182,272 L176,287 L184,288", { w: 1.4, duplo: false, seed: 36 });
    // boca costurada (14 pontos)
    traco(cab, "M150,301 Q181,306 212,301", { w: 1.2, duplo: false, seed: 37 });
    const pontos = [];
    for (let i = 0; i < 14; i++) {
      const x = 152 + i * 4.5, y = 302 + Math.sin((i / 13) * Math.PI) * 2.4;
      pontos.push(S("path", { d: `M${n1(x)},${n1(y - 6)} L${n1(x + .4)},${n1(y + 6)}`, stroke: C.tinta, "stroke-width": 1.5, "stroke-linecap": "round" }, cab));
    }
    const abre = pontos.map((_, i) => (i < 4 ? 2700 + i * 220 : i < 9 ? 6800 + (i - 4) * 260 : 12300 + (i - 9) * 230));
    const linhaSolta = S("path", { fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.3 }, cab);

    const gato = gatoEspia(svg, 44, 30, 172, "c3");

    return {
      tocar(t) {
        const tq = q12(t);
        const desce = lerp(-560, 0, voltaOut(fase(t, 0, 2000)));
        const ang = Math.sin(t / 900) * 2;
        corpo.setAttribute("transform", `translate(0 ${n1(desce)}) rotate(${n1(ang)} 196 -60)`);
        // juntas tremem em "twos"
        const jj = {};
        Object.keys(J).forEach((k, i) => {
          const [x, y] = J[k];
          const m = k === "eL" || k === "eR" || k === "top" ? 0 : 1;
          jj[k] = [x + m * Math.sin(tq / 400 + i) * 4, y + m * Math.cos(tq / 520 + i * 2) * 3];
          jEls[i].setAttribute("transform", `translate(${n1(jj[k][0])} ${n1(jj[k][1])})`);
        });
        barras.forEach(([a, b], i) => barEls[i].setAttribute("d", tubo([jj[a], jj[b]], 7, 6, i, 0)));
        // piscada: o X gira 90°
        [4300, 9000, 13600].forEach((pt) => {
          const p = fase(tq, pt, pt + 250);
          if (p > 0 && p < 1) xs.forEach(({ g, x, y }) => g.setAttribute("transform", `rotate(${n1(eio(p) * 90)} ${x} ${y})`));
        });
        pontos.forEach((p, i) => {
          const q = fase(t, abre[i], abre[i] + 320);
          p.setAttribute("opacity", 1 - q);
          if (q > 0) p.setAttribute("transform", `rotate(${n1(q * 35)} ${152 + i * 4.5} 302)`);
        });
        const ls = fase(t, 14600, 16800);
        if (ls > 0) linhaSolta.setAttribute("d", `M212,302 C214,${n1(330 + ls * 40)} 206,${n1(360 + ls * 220)} 214,${n1(380 + ls * 420)}`);
        gato.tocar(t);
      },
    };
  },
});
