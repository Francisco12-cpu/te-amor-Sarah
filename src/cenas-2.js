// ═════════════════════════════════════════════════════════════
// ATO 2 — A TRAVESSIA (cenas 4 a 6)
// ═════════════════════════════════════════════════════════════

// CENA 4 — O poço
CENAS.push({
  nome: "poco", dur: 11500, cinza: true, fundo: "#0E0E10",
  textos: [[3000, "c4"]],
  musica: { oit: -1, eco: 1, desaf: 5 },
  sons: [[1500, () => Som.queda(), true]],
  saida: { tipo: "preto", dur: 900 },
  montar(raiz) {
    const svg = arte(raiz);
    // fase B: caindo, olhando para cima
    const B = S("g", {}, svg);
    S("rect", { x: -400, y: -400, width: 1160, height: 1440, fill: "#0E0E10" }, B);
    const rodar = S("g", {}, B);
    const N = 16;
    const aneis = [];
    for (let i = 0; i < N; i++) {
      const pts = anelIrregular(170, 170, 300 + i, { amp: .07, quad: .05, voltas: 1.02, n: 72 });
      const g = S("g", {}, rodar);
      S("path", { d: suave(pts), fill: "none", stroke: "#77716a", "stroke-width": 12, "stroke-dasharray": "18 5" }, g);
      S("path", { d: suave(pts), fill: "none", stroke: "#2b2825", "stroke-width": 1.6, transform: "scale(.94)" }, g);
      aneis.push(g);
    }
    const luzG = S("circle", { cx: 180, cy: 300, r: 60, fill: "url(#brilho)" }, B);
    const luz = S("circle", { cx: 180, cy: 300, r: 20, fill: "#FFF6DA" }, B);

    // fase A: vista de cima
    const A = S("g", {}, svg);
    S("rect", { x: -400, y: -400, width: 1160, height: 1440, fill: "#D3CBBB" }, A);
    S("circle", { cx: 180, cy: 300, r: 96, fill: "url(#bocaPoco)" }, A);
    const r = rng(41);
    [108, 134].forEach((R, k) => {
      const n = Math.round((Math.PI * 2 * R) / 27);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + k * .12;
        const x = 180 + Math.cos(a) * R, y = 300 + Math.sin(a) * R;
        const pts = [];
        for (let j = 0; j < 7; j++) {
          const b = (j / 7) * Math.PI * 2, rr = 11 + r() * 4;
          pts.push([x + Math.cos(b) * rr * (1 + .25 * Math.cos(a - b)), y + Math.sin(b) * rr]);
        }
        forma(A, suave(pts.concat([pts[0]])), k ? "#bdb6a8" : "#a9a295", { w: 1.6, seed: 50 + i + k * 40, hachura: "hFina", hop: .35, passo: 4 });
      }
    });
    const tampa = S("g", { transform: "translate(286 470) rotate(24)" }, A);
    forma(tampa, "M-50,-36 L50,-36 L50,36 L-50,36 Z", "#A8957A", { w: 2, seed: 61 });
    [-18, 0, 18].forEach((y) => traco(tampa, `M-48,${y} L48,${y + 1}`, { w: 1.1, duplo: false, seed: 62 + y }));

    return {
      tocar(t) {
        const pa = fase(t, 900, 2500);
        A.setAttribute("transform", `translate(180 300) scale(${n1((1 + ei(pa) * 5) * 100) / 100}) rotate(${n1(pa * 40)}) translate(-180 -300)`);
        A.setAttribute("opacity", 1 - fase(t, 2000, 2500));
        const tb = Math.max(0, t - 2000);
        rodar.setAttribute("transform", `rotate(${n1(tb * .012)} 180 300)`);
        const fim = 1 - fase(t, 9600, 11000);
        aneis.forEach((g, i) => {
          const u = (tb * .00018 + i / N) % 1;
          const s = 2.8 * Math.pow(1 - u, 2.3) + .03;
          g.setAttribute("transform", `translate(180 300) scale(${s.toFixed(3)})`);
          g.setAttribute("opacity", (clamp(s * 1.6) * fim).toFixed(3));
        });
        const lr = lerp(22, 1.5, eo(fase(t, 2400, 9600)));
        luz.setAttribute("r", n1(lr));
        luzG.setAttribute("r", n1(lr * 3.2));
        luz.setAttribute("opacity", fim);
        luzG.setAttribute("opacity", fim * .8);
      },
    };
  },
});

// ── mão esquelética com hachura (cenas 5 e 15)
function maoEsqueleto(pai, seed = 1) {
  const g = S("g", {}, pai);
  const BRACO = "M392,250 C360,262 330,280 290,300";
  S("path", { d: tuboD(BRACO, 48, 34, seed, 1, 1), fill: "#ECE8E0", stroke: C.tinta, "stroke-width": 1.6 }, g);
  S("path", { d: tuboD(BRACO, 48, 34, seed, 1, 1), fill: "url(#hA)", opacity: .75 }, g);
  S("path", { d: tuboD("M392,262 C360,274 330,290 292,306", 22, 14, seed + 1, .6, 1), fill: "url(#hB)", opacity: .7 }, g);
  const palma = "M304,276 C282,258 250,260 238,280 C228,300 232,332 248,350 C266,362 294,352 306,330 Z";
  forma(g, palma, "#ECE8E0", { w: 1.8, seed: seed + 2, hachura: "hA", hop: .65 });
  S("path", { d: rabisco("M300,300 C282,312 262,320 246,330", .6, seed + 3), fill: "url(#hB)", stroke: "none" }, g);

  const DEDOS = [
    { b: [262, 270], L: [60, 58, 44], fechado: [-165, -180, 150], abre: [28, 40, 52], cima: 1, unha: 40 },
    { b: [268, 286], L: [56, 52, 40], fechado: [-172, 172, 140], abre: [30, 44, 56], cima: 1, unha: 34 },
    { b: [264, 330], L: [56, 52, 40], fechado: [176, 150, 118], abre: [-24, -36, -46], cima: 0, unha: 36 },
    { b: [252, 348], L: [58, 54, 40], fechado: [122, 165, -168], abre: [-20, -38, -48], cima: 0, unha: 44 },
  ];
  const els = DEDOS.map(() => {
    const d = S("g", {}, g);
    return {
      base: S("path", { fill: "#ECE8E0", stroke: C.tinta, "stroke-width": 1.5 }, d),
      hach: S("path", { fill: "url(#hA)", opacity: .7 }, d),
      js: [0, 1, 2].map((i) => S("circle", { r: [6.6, 5.6, 4.4][i], fill: "#E2DDD3", stroke: C.tinta, "stroke-width": 1.3 }, d)),
      unha: S("path", { fill: C.tinta }, d),
    };
  });
  let ult = -1;
  function atualizar(abertura) {
    const k = Math.round(abertura * 40);
    if (k === ult) return;
    ult = k;
    const a = k / 40;
    DEDOS.forEach((D, i) => {
      let [x, y] = D.b, ang = 0;
      const pts = [[x, y]], juntas = [];
      D.L.forEach((len, j) => {
        ang = D.fechado[j] + D.abre[j] * a;
        const nx = x + Math.cos(rad(ang)) * len, ny = y + Math.sin(rad(ang)) * len;
        for (let s = 1; s <= 6; s++) pts.push([lerp(x, nx, s / 6), lerp(y, ny, s / 6)]);
        x = nx; y = ny;
        juntas.push([x, y]);
      });
      const e = els[i];
      const d = tubo(pts, 13, 4.6, seed * 10 + i, .7, .9);
      e.base.setAttribute("d", d);
      e.hach.setAttribute("d", d);
      [[D.b[0], D.b[1]], juntas[0], juntas[1]].forEach((p, j) => { e.js[j].setAttribute("cx", n1(p[0])); e.js[j].setAttribute("cy", n1(p[1])); });
      const dx = Math.cos(rad(ang)), dy = Math.sin(rad(ang));
      const ponta = [x + dx * D.unha, y + dy * D.unha];
      e.unha.setAttribute("d", `M${n1(x - dy * 2.6)},${n1(y + dx * 2.6)} L${fp(ponta)} L${n1(x + dy * 2.6)},${n1(y - dx * 2.6)} Z`);
    });
  }
  return { g, atualizar };
}

// CENA 5 — A mão e o botão
CENAS.push({
  nome: "mao", dur: 11500, cinza: true, fundo: "#F2EFE8",
  textos: [[3600, "c5"]],
  musica: { oit: 0, eco: 0 },
  sons: [[1000, () => Som.ossos(), true], [2100, () => Som.ossos(), true]],
  saida(inst) { return { tipo: "furo", x: inst.furo[0], y: inst.furo[1], dur: 1200 }; },
  montar(raiz) {
    const svg = arte(raiz);
    S("rect", { x: -200, y: -200, width: 760, height: 1040, fill: "url(#hFina)", opacity: .05 }, svg);
    const bg = S("g", {}, svg);
    useBotao(bg, 140, 330, 72, "#F2EFE8");
    const mao = maoEsqueleto(svg, 3);
    const preto = S("rect", { x: -400, y: -400, width: 1160, height: 1440, fill: "#0E0E10" }, svg);
    const glow = S("circle", { cx: 140, cy: 330, r: 120, fill: "url(#brilho)", opacity: 0 }, svg);
    const inst = {
      furo: [156, 346],
      tocar(t) {
        const tq = q12(t);
        mao.atualizar(1 - eio(fase(tq, 900, 3400)));
        mao.g.setAttribute("transform", `translate(${n1(lerp(120, 0, eo(fase(t, 300, 1500))))} 0)`);
        const ang = t * .008;
        bg.setAttribute("transform", `rotate(${n1(ang)} 140 330)`);
        const a = rad(ang + 45), r = 16.5 * Math.SQRT2;
        inst.furo = [140 + Math.cos(a) * r, 330 + Math.sin(a) * r];
        preto.setAttribute("opacity", 1 - eio(fase(t, 500, 1900)));
        glow.setAttribute("opacity", (Math.sin(fase(t, 0, 2000) * Math.PI) * .55).toFixed(3));
      },
    };
    return inst;
  },
});

// CENA 6 — A chave
CENAS.push({
  nome: "chave", dur: 12600, cinza: true, fundo: "#CFAE8A",
  textos: [[5000, "c6"]],
  sons: [[1700, () => Som.fio(), true], [3400, () => Som.fio(), true], [4300, () => Som.chave(), true], [5300, () => Som.chave(), true], [11200, () => Som.giro(), true]],
  saida(inst) { return { tipo: "furo", x: inst.cabeca[0], y: inst.cabeca[1], dur: 1200 }; },
  montar(raiz) {
    const svg = arte(raiz);
    const A = [222, -10], K = [222, 252];
    const mao = S("g", {}, svg);
    const DEDOS = [
      ["M392,40 C300,18 210,60 190,140 C182,175 178,205 184,234", 24, 3],
      ["M392,82 C330,80 280,100 262,150 C252,180 256,205 263,228", 19, 3],
      ["M392,122 C352,150 332,176 320,218", 17, 3],
      ["M330,8 C250,-14 150,10 122,72 C104,106 107,150 120,186", 19, 3],
    ];
    const amostras = [];
    DEDOS.forEach(([d, w0, w1], i) => {
      S("path", { d: tuboD(d, w0, w1, 80 + i, 1.4, .8), fill: C.tinta }, mao);
      S("path", { d: rabisco(d, 1.3, 90 + i, 6), fill: "none", stroke: "#7a6650", "stroke-width": 1.1, opacity: .6, transform: "translate(-2 2)" }, mao);
      amostrar(d, 22)[0].forEach((p) => amostras.push(p));
    });
    // partículas de tinta (T8)
    const r = rng(17);
    const parts = E.reduzido ? [] : amostras.slice(0, 28).map((p) => ({
      p, v: [(r() - .5) * .09, (r() - .3) * .08], rr: 2 + r() * 4.5,
      el: S("circle", { cx: p[0], cy: p[1], r: 0, fill: C.tinta }, svg),
    }));

    const balanco = S("g", {}, svg);
    const fio = S("path", { d: `M${A[0]},${A[1]} L${K[0]},${K[1] - 24}`, fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.4 }, balanco);
    const LF = K[1] - 24 - A[1];
    fio.style.strokeDasharray = LF; fio.style.strokeDashoffset = LF;
    const giroY = S("g", {}, balanco);
    useChave(giroY, K[0], K[1], 1, "#CFAE8A");
    const nó = S("path", { d: `M${K[0] - 5},${K[1] - 26} q5,-6 10,0 q-5,6 -10,0`, fill: "none", style: "stroke:var(--fio)", "stroke-width": 1.4 }, balanco);

    const gato = gatoEspia(svg, 352, 430, -90, "c6");
    const solta = 3600;
    const inst = {
      cabeca: K,
      tocar(t) {
        const desce = lerp(-330, 0, eo(fase(t, 0, 1800)));
        const ps = fase(t, 3000, 4400);
        mao.setAttribute("transform", `translate(${n1(desce * -.25)} ${n1(desce)})`);
        mao.setAttribute("opacity", (1 - ps).toFixed(3));
        parts.forEach((q) => {
          const u = Math.max(0, t - 3000);
          if (ps <= 0 || ps >= 1) { q.el.setAttribute("r", 0); return; }
          q.el.setAttribute("cx", n1(q.p[0] + q.v[0] * u));
          q.el.setAttribute("cy", n1(q.p[1] + desce + q.v[1] * u + u * u * .00002));
          q.el.setAttribute("r", n1(q.rr * (1 - ps)));
        });
        if (t < 2800) {
          fio.style.strokeDasharray = LF;
          fio.style.strokeDashoffset = LF * (1 - eio(fase(t, 1500, 2800)));
        } else fio.style.strokeDasharray = "none";
        nó.setAttribute("opacity", fase(t, 2600, 2900));
        const u = t - solta;
        let dy = 0, ang = 0, sx = 1, giro90 = 0;
        if (u > 0) {
          dy = 70 * (1 - Math.exp(-u / 380) * Math.cos(u / 110));
          ang = 7 * Math.exp(-u / 1900) * Math.sin(u / 420);
          sx = Math.cos(.6 * Math.sin(u / 700));
        }
        giro90 = eio(fase(t, 11000, 12300)) * 90;
        const y0 = u > 0 ? 0 : desce;
        balanco.setAttribute("transform", `translate(0 ${n1(y0)}) rotate(${n1(ang)} ${A[0]} ${A[1]})`);
        fio.setAttribute("d", `M${A[0]},${A[1]} L${K[0]},${n1(K[1] - 24 + dy)}`);
        nó.setAttribute("transform", `translate(0 ${n1(dy)})`);
        giroY.setAttribute("transform", `translate(${K[0]} ${n1(K[1] + dy)}) rotate(${n1(giro90)}) scale(${sx.toFixed(3)} 1) translate(${-K[0]} ${-K[1]})`);
        const a = rad(ang);
        const cx = A[0] - Math.sin(a) * (K[1] + dy - A[1]), cy = A[1] + Math.cos(a) * (K[1] + dy - A[1]) + y0;
        inst.cabeca = [cx, cy];
        gato.tocar(t);
      },
    };
    return inst;
  },
});
