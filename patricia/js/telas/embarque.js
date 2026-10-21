"use strict";
// 1 ── Cartão de embarque
Telas.registrar("embarque", {
  rodape: false,
  montar(el) {
    const c = CONFIG.embarque;
    el.innerHTML = `
      <div class="nuvens" aria-hidden="true"><i></i><i></i><i></i></div>
      <h1 id="embarque-h" class="so-leitor">${resolver("Feliz aniversário, {{APELIDO}}! Seu cartão de embarque.")}</h1>
      <article class="passe" aria-label="Cartão de embarque">
        <div class="passe-corpo">
          <header class="passe-topo">
            <button class="passe-aviao" type="button" aria-label="aviãozinho">${AVIAO_SVG}</button>
            <div>
              <p class="passe-cia">${resolver(c.companhia)}</p>
              <p class="passe-tipo">${resolver(c.tipo)}</p>
            </div>
          </header>
          <p class="rotulo">Passageira</p>
          <p class="passe-nome">${resolver(c.passageira)}</p>
          <div class="passe-rota">
            <div><b>${c.origem.codigo}</b><span>${resolver(c.origem.cidade)}</span></div>
            <div class="passe-linha" aria-hidden="true"><span>✈</span></div>
            <div><b>${c.destino.codigo}</b><span>${resolver(c.destino.cidade)}</span></div>
          </div>
          <dl class="passe-dados">
            <div><dt>Voo</dt><dd>${c.voo}</dd></div>
            <div><dt>Data</dt><dd>${resolver(CONFIG.data)}</dd></div>
            <div><dt>Portão</dt><dd>${c.portao}</dd></div>
            <div><dt>Assento</dt><dd>${c.assento}</dd></div>
            <div class="largo"><dt>Classe</dt><dd>${resolver(c.classe)}</dd></div>
          </dl>
          <div class="carimbo" aria-hidden="true">${resolver(c.carimbo)}</div>
        </div>
        <div class="passe-canhoto">
          <div class="codigo" aria-hidden="true"></div>
          <p>${resolver(c.rodape)}</p>
        </div>
      </article>
      <p class="passe-acao"><button class="btn btn-grande" type="button">${resolver(c.botao)}</button></p>
      <div class="decolagem" aria-hidden="true">${AVIAO_SVG}</div>`;

    // código de barras com larguras sorteadas
    const cod = el.querySelector(".codigo");
    for (let i = 0; i < 46; i++) H("i", { style: `flex:${1 + ((Math.random() * 4) | 0)}` }, cod);

    // segredo: 3 toques no aviãozinho
    let toques = 0;
    el.querySelector(".passe-aviao").addEventListener("click", (ev) => {
      ev.currentTarget.classList.remove("gira"); void ev.currentTarget.offsetWidth; ev.currentTarget.classList.add("gira");
      if (++toques === 3) { Balao.mostrar(c.segredo, 5000); Brilhos.explosao(...centro(ev.currentTarget), 20, "coracao"); }
    });

    const btn = el.querySelector(".passe-acao .btn");
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      vibrar(30);
      el.classList.add("carimbado");
      Brilhos.explosao(...centro(el.querySelector(".carimbo")), 18);
      await espera(700);
      el.classList.add("destaca");
      await espera(650);
      el.classList.add("decola");
      await espera(1100);
      App.ir("mapa");
    });
  },
  entrar(el) {
    el.classList.remove("carimbado", "destaca", "decola");
    el.querySelector(".passe-acao .btn").disabled = false;
  },
});

const AVIAO_SVG = `<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
  <path d="M60 30c0-3-3-4-6-4H40L26 6h-6l7 20H14l-5-7H4l3 13-3 13h5l5-7h13l-7 20h6l14-20h14c3 0 6-1 6-4z" fill="currentColor"/>
  <path d="M44 29h3M49 29h3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>`;
