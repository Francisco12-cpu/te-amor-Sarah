"use strict";
// ─────────────────────────────────────────────────────────────
// App: navegação entre as paradas (com #endereço), topo e rodapé.
// Atalho: abra com #mapa, #polaroid, #sacolas, #penteadeira ou #final.
// ─────────────────────────────────────────────────────────────
const App = (() => {
  const ICONES = { embarque: "🎫", mapa: "📍", polaroid: "📸", sacolas: "🛍", penteadeira: "💄", final: "🎂" };
  const ROTULOS = { embarque: "Embarque", mapa: "Mapa de viagens", polaroid: "Foto", sacolas: "Sacolas", penteadeira: "Penteadeira", final: "Mensagem final" };
  const montadas = new Set(), vistas = new Set();
  let atual = null;
  const itin = document.getElementById("itinerario");
  const rodape = document.getElementById("rodape");
  const btnVoltar = document.getElementById("btn-voltar");
  const btnProx = document.getElementById("btn-proxima");

  function iniciar() {
    document.title = resolver(CONFIG.tituloAba);
    document.getElementById("marca-nome").textContent = CONFIG.apelido;
    btnVoltar.textContent = CONFIG.navegacao.voltar;
    btnProx.textContent = CONFIG.navegacao.proxima;

    Telas.ordem.forEach((id, i) => {
      const li = H("li", {}, itin);
      const b = H("button", { type: "button", "data-id": id, "aria-label": `Parada ${i + 1}: ${ROTULOS[id]}`, txt: ICONES[id] }, li);
      b.addEventListener("click", () => ir(id));
    });
    btnVoltar.addEventListener("click", () => passo(-1));
    btnProx.addEventListener("click", () => passo(1));
    addEventListener("hashchange", () => ir(location.hash.slice(1), true));

    const inicio = location.hash.slice(1);
    ir(Telas.ordem.includes(inicio) ? inicio : "embarque", true);
  }

  function passo(d) {
    const i = Telas.ordem.indexOf(atual) + d;
    if (i >= 0 && i < Telas.ordem.length) ir(Telas.ordem[i]);
  }

  function ir(id, doEndereco) {
    if (!Telas.ordem.includes(id) || id === atual) return;
    if (!doEndereco) history.pushState(null, "", "#" + id);
    const velha = atual && document.getElementById(atual);
    if (velha) {
      const d = Telas.def(atual);
      if (d.sair) d.sair(velha);
      velha.classList.remove("ativa");
      if (!REDUZIDO) {
        velha.classList.add("saindo");
        setTimeout(() => velha.classList.remove("saindo"), 350);
      }
    }
    Balao.esconder();
    atual = id; vistas.add(id);
    const el = document.getElementById(id);
    const def = Telas.def(id);
    if (!montadas.has(id) && def.montar) { def.montar(el); montadas.add(id); }
    el.classList.add("ativa");
    scrollTo(0, 0);
    if (def.entrar) def.entrar(el);

    const i = Telas.ordem.indexOf(id);
    itin.querySelectorAll("button").forEach((b) => {
      const bid = b.dataset.id;
      if (bid === id) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("visto", vistas.has(bid));
    });
    rodape.classList.toggle("escondido", def.rodape === false);
    btnVoltar.hidden = i === 0;
    btnProx.hidden = i === Telas.ordem.length - 1;

    // o foco vai para o título da tela (bom para leitor de tela)
    const h = el.querySelector("h1, h2");
    if (h && doEndereco !== true) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  return { iniciar, ir, passo, atual: () => atual };
})();

App.iniciar();
