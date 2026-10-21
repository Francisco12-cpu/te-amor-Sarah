"use strict";
// 2 ── Mapa de viagens: pins, rota tracejada e um aviãozinho voando entre eles
(() => {
  const W = 360, ALT = 400;
  // lat/lon -> ponto do desenho (mesma conta para o contorno e para os pins)
  const proj = (lat, lon) => [(lon + 74) / 39.2 * 300 + 30, (5.3 - lat) * 8.8 + 22];

  // contorno simplificado do Brasil (lon, lat)
  const CONTORNO = [[-60.7,5.2],[-56.5,1.9],[-54,2.2],[-51.6,4.2],[-50,1.8],[-50.3,0],[-48.3,-1],[-44.3,-2.5],[-41.5,-2.9],[-38.5,-3.7],[-35.2,-5.4],[-34.8,-7.5],[-35.3,-9.4],[-37.1,-11],[-38.5,-13],[-39,-15.5],[-39.2,-18],[-40.3,-20.3],[-41,-22],[-43.2,-23],[-45.4,-23.8],[-48,-25.5],[-48.6,-27.8],[-49.8,-29.3],[-51.2,-31.2],[-53.4,-33.7],[-53.5,-32.5],[-55.6,-30.9],[-57.6,-30.2],[-55.4,-28],[-53.8,-27.1],[-54.6,-25.6],[-54.3,-24],[-55.8,-22.3],[-58,-22],[-57.7,-19.5],[-58.2,-17.4],[-60.1,-16.2],[-60.3,-13.6],[-65,-11.8],[-65.4,-9.7],[-68.7,-11],[-70.6,-11],[-73.5,-9.4],[-73.9,-7.4],[-72.9,-5.2],[-70,-4.3],[-69.4,-1],[-70,0.6],[-69.3,1.7],[-67,2],[-66,1],[-64,2],[-63.4,3.8]];

  // curva suave fechada passando pelos pontos (Catmull-Rom -> Bézier)
  function suave(pts) {
    const n = pts.length, P = (i) => pts[(i + n) % n];
    let d = `M${P(0)[0].toFixed(1)},${P(0)[1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const [a, b, c, e] = [P(i - 1), P(i), P(i + 1), P(i + 2)];
      d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
    }
    return d + "Z";
  }

  let aviao, rota, comp = 0, raf = 0, t0 = 0;
  const vistos = new Set();

  function voar(agora) {
    if (!t0) t0 = agora;
    const DUR = 6500, PAUSA = 1200;
    const t = ((agora - t0) % (DUR + PAUSA)) / DUR;
    const p = Math.min(1, t), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    const L = e * comp, a = rota.getPointAtLength(L), b = rota.getPointAtLength(Math.min(comp, L + 1));
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    aviao.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    aviao.style.opacity = p >= 1 ? 0 : 1;
    raf = requestAnimationFrame(voar);
  }

  Telas.registrar("mapa", {
    montar(el) {
      const c = CONFIG.mapa, D = c.destinos;
      el.innerHTML = `
        <h2 id="mapa-h">${resolver(c.titulo)} <span class="enfeite">✈</span></h2>
        <p class="sub">${resolver(c.subtitulo)}</p>
        <div class="mapa-moldura"></div>
        <p class="contador" aria-live="polite"></p>
        <ul class="passaporte" aria-label="Carimbos do passaporte"></ul>
        <div class="proximos">
          <h3>${resolver(c.proximos.titulo)}</h3>
          <ul>${c.proximos.lista.map((s) => `<li>${resolver(s)}</li>`).join("")}</ul>
        </div>`;

      const svg = S("svg", { viewBox: `0 0 ${W} ${ALT}`, class: "mapa-svg", role: "group", "aria-label": "Mapa do Brasil com os destinos" }, el.querySelector(".mapa-moldura"));
      const defs = S("defs", {}, svg);
      defs.innerHTML = `
        <pattern id="pontinhos" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#C9A28C" opacity=".45"/></pattern>
        <pattern id="ondas" width="40" height="16" patternUnits="userSpaceOnUse"><path d="M0 8q10-6 20 0t20 0" fill="none" stroke="#E7B9C4" stroke-width="1.2" opacity=".6"/></pattern>
        <radialGradient id="terra" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#F7E3D7"/><stop offset="1" stop-color="#EBCBB9"/></radialGradient>
        <symbol id="aviaozinho" viewBox="0 0 64 64">${AVIAO_SVG.replace(/<\/?svg[^>]*>/g, "")}</symbol>`;
      S("rect", { width: W, height: ALT, fill: "#FDF0F3" }, svg);
      S("rect", { width: W, height: ALT, fill: "url(#ondas)" }, svg);
      const terra = suave(CONTORNO.map(([lon, lat]) => proj(lat, lon)));
      S("path", { d: terra, fill: "url(#terra)", stroke: "#D4AF5A", "stroke-width": 2, "stroke-linejoin": "round" }, svg);
      S("path", { d: terra, fill: "url(#pontinhos)" }, svg);

      // rosa dos ventos
      const rv = S("g", { transform: "translate(48 350)", class: "rosa-ventos" }, svg);
      rv.innerHTML = `<circle r="24" fill="#fff" stroke="#D4AF5A" stroke-width="1.5"/>
        <path d="M0-20L5 0 0 20-5 0Z" fill="#D4AF5A"/><path d="M-20 0L0-5 20 0 0 5Z" fill="#F3DFA6"/>
        <text y="-27" text-anchor="middle" font-size="10" fill="#8A661C" font-weight="700">N</text>`;

      // rota: destinos em ordem + um ponto "próxima viagem" no mar
      const pts = D.map((d) => proj(d.lat, d.lon));
      const fim = [Math.min(W - 24, pts[pts.length - 1][0] + 30), pts[pts.length - 1][1] + 70];
      const todos = pts.concat([fim]);
      let d = `M${todos[0][0]},${todos[0][1]}`;
      for (let i = 1; i < todos.length; i++) {
        const [x0, y0] = todos[i - 1], [x1, y1] = todos[i];
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0;
        d += ` Q${(mx - dy * .35).toFixed(1)},${(my + dx * .35).toFixed(1)} ${x1},${y1}`;
      }
      rota = S("path", { d, fill: "none", stroke: "#B9506B", "stroke-width": 2, "stroke-dasharray": "6 6", "stroke-linecap": "round", class: "rota" }, svg);
      comp = rota.getTotalLength();

      const interrog = S("g", { transform: `translate(${fim[0]} ${fim[1]})`, class: "proxima-viagem" }, svg);
      interrog.innerHTML = `<circle r="13" fill="#fff" stroke="#D4AF5A" stroke-width="2" stroke-dasharray="3 3"/><text y="5" text-anchor="middle" font-size="15" fill="#8A661C" font-weight="700">?</text>`;

      aviao = S("g", { class: "aviao-mapa" }, svg);
      S("use", { href: "#aviaozinho", x: -14, y: -14, width: 28, height: 28, color: "#B9506B" }, aviao);

      // pins
      const contador = el.querySelector(".contador");
      const passaporte = el.querySelector(".passaporte");
      const selos = D.map((dest) => H("li", { class: "selo", "aria-label": `${dest.nome}: ainda sem carimbo`, html: `<span>?</span>` }, passaporte));
      const atualizar = () => { contador.textContent = resolver(c.carimbos, { N: vistos.size, T: D.length }); };
      atualizar();

      D.forEach((dest, i) => {
        const [x, y] = pts[i];
        const g = S("g", { class: "pin pulsa", transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": `${dest.nome} – ${dest.uf}` }, svg);
        g.style.setProperty("--atraso", (.3 + i * .25) + "s");
        const corpo = S("g", { class: "pin-corpo" }, g);
        S("ellipse", { cx: 0, cy: 1, rx: 7, ry: 2.5, fill: "rgba(74,44,51,.25)" }, corpo);
        S("path", { d: "M0 0C-4-8-14-14-14-24a14 14 0 0 1 28 0C14-14 4-8 0 0Z", fill: "#D9798F", stroke: "#fff", "stroke-width": 2 }, corpo);
        S("circle", { cx: 0, cy: -24, r: 9, fill: "#fff" }, corpo);
        const ic = S("text", { x: 0, y: -20, "text-anchor": "middle", "font-size": 11 }, corpo); ic.textContent = dest.icone;
        S("circle", { r: 30, cy: -18, fill: "transparent" }, g); // área de toque maior
        const nome = S("text", { x: 0, y: 16, "text-anchor": "middle", class: "pin-nome" }, g);
        nome.textContent = `${dest.nome} · ${dest.uf}`;

        const abrir = () => {
          g.classList.remove("pulsa", "pula"); void g.getBoundingClientRect(); g.classList.add("pula");
          Brilhos.explosao(...centro(corpo), 16, "misto");
          vibrar(20);
          if (!vistos.has(i)) {
            vistos.add(i);
            selos[i].classList.add("carimbado");
            selos[i].innerHTML = `<span class="selo-ic">${dest.icone}</span><b>${dest.nome}</b><small>${dest.uf}</small>`;
            selos[i].setAttribute("aria-label", `${dest.nome}: carimbado`);
            atualizar();
          }
          const conteudo = H("div", { class: "cartao-destino" });
          H("div", { class: "selo grande carimbado", html: `<span class="selo-ic">${dest.icone}</span><b>${dest.nome}</b><small>${dest.uf}</small>` }, conteudo);
          H("h3", { txt: `${dest.nome} – ${dest.uf}` }, conteudo);
          H("p", { txt: resolver(dest.texto) }, conteudo);
          janela(conteudo, "continuar viagem ✈");
        };
        g.addEventListener("click", abrir);
        g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); abrir(); } });
      });
    },
    entrar() {
      if (!REDUZIDO) { cancelAnimationFrame(raf); t0 = 0; raf = requestAnimationFrame(voar); }
      else aviao.style.opacity = 0;
    },
    sair() { cancelAnimationFrame(raf); },
  });
})();
