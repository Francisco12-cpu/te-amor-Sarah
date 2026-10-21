"use strict";
// 4 ── Sacolas de compras: cada sacolinha abre e revela um elogio/memória
(() => {
  const abertas = new Set();

  // escurece uma cor #RRGGBB (para sombras e alças)
  function tom(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(clamp(v * f, 0, 255)));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function sacola(cor, i) {
    const esc = tom(cor, .78), cl = tom(cor, 1.08);
    return `<svg viewBox="0 0 120 140" width="100%" height="100%" aria-hidden="true">
      <g class="papel-seda">
        <path d="M34 52 L44 14 L58 50Z" fill="#fff" stroke="#F4B6C2"/>
        <path d="M52 50 L64 6 L74 50Z" fill="#FBE4EA" stroke="#F4B6C2"/>
        <path d="M68 52 L84 18 L88 52Z" fill="#fff" stroke="#F3DFA6"/>
      </g>
      <g class="alcas" fill="none" stroke="${esc}" stroke-width="4" stroke-linecap="round">
        <path d="M40 46 C40 18 58 18 58 46"/><path d="M62 46 C62 18 80 18 80 46"/>
      </g>
      <path d="M20 44 H100 L108 132 Q108 136 104 136 H16 Q12 136 12 132Z" fill="${cor}"/>
      <path d="M100 44 L108 132 Q108 136 104 136 H92Z" fill="${esc}" opacity=".35"/>
      <rect x="20" y="44" width="80" height="10" fill="${cl}"/>
      <rect x="20" y="52" width="80" height="2" fill="${esc}" opacity=".35"/>
      <circle cx="40" cy="50" r="3" fill="#fff"/><circle cx="80" cy="50" r="3" fill="#fff"/>
      <g transform="translate(60 92)">
        <path d="M0 0 C-14-12-24-2-16 6 C-10 10-4 4 0 0 C4 4 10 10 16 6 C24-2 14-12 0 0Z" fill="#D4AF5A" opacity=".9"/>
        <circle r="3.5" fill="#F3DFA6"/>
      </g>
      <text x="60" y="122" text-anchor="middle" font-family="Georgia, serif" font-size="9" letter-spacing="1.5" fill="#4A2C33">Nº ${i + 1}</text>
    </svg>`;
  }

  Telas.registrar("sacolas", {
    montar(el) {
      const c = CONFIG.sacolas, itens = c.itens;
      el.innerHTML = `
        <h2 id="sacolas-h">${resolver(c.titulo)} <span class="enfeite">🛍</span></h2>
        <p class="sub">${resolver(c.subtitulo)}</p>
        <ul class="vitrine"></ul>
        <p class="contador" aria-live="polite"></p>
        <p class="total" aria-live="polite"></p>`;
      const vitrine = el.querySelector(".vitrine");
      const contador = el.querySelector(".contador");
      const total = el.querySelector(".total");
      const atualizar = () => {
        contador.textContent = resolver(c.contador, { N: abertas.size, T: itens.length });
        if (abertas.size === itens.length && !total.textContent) {
          total.textContent = resolver(c.finalizado);
          Brilhos.explosao(...centro(total), 30, "misto");
        }
      };
      atualizar();

      itens.forEach((item, i) => {
        const li = H("li", {}, vitrine);
        const b = H("button", { class: "sacola pulsa", type: "button", "aria-label": `Sacola ${i + 1}: ${resolver(item.loja)}` }, li);
        b.style.setProperty("--atraso", (i * .08) + "s");
        b.innerHTML = `<span class="sacola-arte">${sacola(item.cor, i)}</span><span class="etiqueta">${resolver(item.loja)}</span>`;
        b.addEventListener("click", async () => {
          b.classList.remove("pulsa");
          b.classList.add("abrindo");
          vibrar(25);
          if (window.Som) Som.efeito("plim");
          Brilhos.explosao(...centro(b), 18, "misto");
          await espera(550);
          b.classList.add("aberta");
          const primeira = !abertas.has(i);
          abertas.add(i);
          const recibo = H("div", { class: "recibo" });
          H("p", { class: "recibo-loja", txt: resolver(item.loja) }, recibo);
          H("hr", { class: "recibo-linha" }, recibo);
          H("p", { class: "recibo-texto", txt: resolver(item.texto) }, recibo);
          H("hr", { class: "recibo-linha" }, recibo);
          H("p", { class: "recibo-preco", html: `<span>valor</span><b>inestimável ♥</b>` }, recibo);
          await janela(recibo, resolver(c.fechar), "janela-recibo");
          b.classList.remove("abrindo");
          if (primeira) atualizar();
        });
      });
    },
  });
})();
