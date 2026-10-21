"use strict";
// 6 ── Mensagem final: bolo com velas, confete dourado, corações, cartinha e música (só com play)
(() => {
  let apagadas = 0;

  const BOLO = `<svg viewBox="0 0 240 210" width="100%" height="100%">
    <ellipse cx="120" cy="198" rx="104" ry="10" fill="rgba(140,80,95,.18)"/>
    <ellipse cx="120" cy="190" rx="100" ry="12" fill="#F3DFA6" stroke="#D4AF5A" stroke-width="2"/>
    <rect x="34" y="128" width="172" height="60" rx="10" fill="#FFF7F4"/>
    <path d="M34 138 Q34 128 44 128 H196 Q206 128 206 138 V146 q-8 10-14 0 t-14 2 -14 -2 -14 6 -14 -4 -14 2 -14 -2 -14 6 -14 -6 -14 4 -14 -2 -14 6 -14-6 q-4 8-10 0Z" fill="#F4B6C2"/>
    <g fill="#D4AF5A">${[52, 76, 100, 124, 148, 172, 192].map((x) => `<circle cx="${x}" cy="172" r="3"/>`).join("")}</g>
    <rect x="62" y="80" width="116" height="52" rx="10" fill="#FFF7F4"/>
    <path d="M62 90 Q62 80 72 80 H168 Q178 80 178 90 V96 q-7 9-13 0 t-13 3 -13 -2 -13 5 -13 -4 -13 2 -13 -3 -13 5 q-4 6-10-2Z" fill="#F4B6C2"/>
    <path d="M70 116 h100" stroke="#D4AF5A" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>
    ${[94, 120, 146].map((x, i) => `
      <g class="vela" data-i="${i}" role="button" tabindex="0" aria-label="Vela ${i + 1}">
        <rect x="${x - 16}" y="20" width="32" height="64" fill="transparent"/>
        <rect x="${x - 4}" y="48" width="8" height="34" rx="2" fill="${["#F4B6C2", "#F3DFA6", "#F4B6C2"][i]}"/>
        <path d="M${x - 4} 56 l8 -5 M${x - 4} 66 l8 -5 M${x - 4} 76 l8 -5" stroke="#fff" stroke-width="2"/>
        <path d="M${x} 48 v-5" stroke="#4A2C33" stroke-width="1.5"/>
        <g class="chama"><path d="M${x} 24 C${x + 8} 34 ${x + 6} 44 ${x} 44 C${x - 6} 44 ${x - 8} 34 ${x} 24Z" fill="#F7B54A"/><path d="M${x} 32 C${x + 4} 38 ${x + 3} 43 ${x} 43 C${x - 3} 43 ${x - 4} 38 ${x} 32Z" fill="#FFF1C9"/></g>
        <g class="fumaca" fill="none" stroke="#C9B8BE" stroke-width="2" stroke-linecap="round"><path d="M${x} 40 q-6 -8 0 -14 t0 -14"/></g>
      </g>`).join("")}
  </svg>`;

  Telas.registrar("final", {
    montar(el) {
      const c = CONFIG.final;
      el.innerHTML = `
        <div class="coracoes" aria-hidden="true">${"<i>♥</i>".repeat(10)}</div>
        <h2 id="final-h" class="titulo-final">${resolver(c.titulo)}</h2>
        <div class="bolo">${BOLO}</div>
        <p class="dica-velas">${resolver(c.velas)}</p>
        <p class="acoes-final">
          <button class="btn btn-ouro btn-musica" type="button"></button>
        </p>
        <div class="envelope" hidden>
          <button class="btn btn-grande btn-carta" type="button">${resolver(c.abrirCarta)}</button>
          <article class="carta" aria-label="Cartinha" hidden>
            ${c.carta.map((p, i) => `<p class="${p.tipo || ""}" style="--i:${i}">${resolver(p.t)}</p>`).join("")}
          </article>
        </div>
        <p class="acoes-final"><button class="btn btn-claro btn-denovo" type="button" hidden>${resolver(c.denovo)}</button></p>`;

      // botão de música (o mesmo controle do topo)
      const bm = el.querySelector(".btn-musica");
      Som.aoMudar((on) => {
        bm.textContent = on ? "❚❚ " + CONFIG.musica.pausar : "▶ " + CONFIG.musica.tocar;
        bm.setAttribute("aria-pressed", on);
      });
      bm.addEventListener("click", () => Som.alternar());

      const dica = el.querySelector(".dica-velas");
      const env = el.querySelector(".envelope");
      el.querySelectorAll(".vela").forEach((v) => {
        const apagar = () => {
          if (v.classList.contains("apagada")) return;
          v.classList.add("apagada");
          vibrar(15);
          Som.efeito("sopro");
          apagadas++;
          if (apagadas === 3) {
            Som.efeito("festa");
            vibrar([80, 50, 80, 50, 120]);
            const [x, y] = centro(el.querySelector(".bolo"));
            Brilhos.explosao(x, y, 60, "misto");
            setTimeout(() => Brilhos.explosao(x - 80, y - 40, 30, "coracao"), 250);
            setTimeout(() => Brilhos.explosao(x + 80, y - 40, 30, "estrela"), 450);
            dica.textContent = resolver("Pedido feito! Que tudo se realize, {{APELIDO}}. ✨");
            env.hidden = false;
            setTimeout(() => env.querySelector(".btn-carta").focus({ preventScroll: true }), 400);
          }
        };
        v.addEventListener("click", apagar);
        v.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); apagar(); } });
      });

      env.querySelector(".btn-carta").addEventListener("click", (ev) => {
        ev.currentTarget.hidden = true;
        const carta = env.querySelector(".carta");
        carta.hidden = false;
        carta.setAttribute("tabindex", "-1");
        carta.focus({ preventScroll: true });
        carta.scrollIntoView({ behavior: REDUZIDO ? "auto" : "smooth", block: "start" });
        Brilhos.explosao(...centro(carta), 24, "coracao");
        Brilhos.chuva(.06); // menos confete por cima da leitura
        el.querySelector(".btn-denovo").hidden = false;
      });
      el.querySelector(".btn-denovo").addEventListener("click", () => App.ir("embarque"));
    },
    entrar() { Brilhos.chuva(.22); },
    sair() { Brilhos.chuva(0); },
  });
})();
