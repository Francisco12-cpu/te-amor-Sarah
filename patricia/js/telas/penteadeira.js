"use strict";
// 5 ── Penteadeira da Loirinha: espelho, batom, perfume, blush, escova e colar
(() => {
  const vistos = new Set();
  const NOMES = { espelho: "Espelho", batom: "Batom", perfume: "Perfume", blush: "Blush", escova: "Escova de cabelo", colar: "Colar de pérolas" };
  const ICONES = { espelho: "🪞", batom: "💋", perfume: "🌸", blush: "🌷", escova: "✨", colar: "🤍" };

  // lâmpadas em volta do espelho
  const lampadas = Array.from({ length: 12 }, (_, i) => {
    const a = (-128 + i * (256 / 11)) * Math.PI / 180, rx = 106, ry = 124;
    return [180 + Math.sin(a) * rx, 136 - Math.cos(a) * ry];
  });

  const ARTE = `
    <defs>
      <linearGradient id="vidro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#F3E6EC"/><stop offset="1" stop-color="#E6D3DD"/></linearGradient>
      <linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3DFA6"/><stop offset=".5" stop-color="#D4AF5A"/><stop offset="1" stop-color="#B8913A"/></linearGradient>
      <linearGradient id="frasco" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F9C9D4"/><stop offset=".4" stop-color="#FDE7EC"/><stop offset="1" stop-color="#EFA9B9"/></linearGradient>
      <pattern id="listras" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#FBE4EA"/><rect x="12" width="12" height="24" fill="#FDF0F3"/></pattern>
      <clipPath id="clip-espelho"><ellipse cx="180" cy="136" rx="84" ry="102"/></clipPath>
    </defs>
    <rect width="360" height="420" fill="url(#listras)"/>
    <g class="item" data-id="espelho">
      <ellipse cx="180" cy="136" rx="96" ry="114" fill="url(#ouro)"/>
      <ellipse cx="180" cy="136" rx="88" ry="106" fill="#FFF6F2"/>
      <ellipse cx="180" cy="136" rx="84" ry="102" fill="url(#vidro)"/>
      <g clip-path="url(#clip-espelho)">
        <rect class="reflexo" x="60" y="20" width="40" height="260" fill="#fff" opacity=".7" transform="rotate(25 180 136)"/>
        <path class="beijo" d="M206 186c6-6 14-6 18-1 4-5 12-5 18 1-6 2-10 9-18 9s-12-7-18-9zm2 1c8 2 12 4 16 4s8-2 16-4c-6 6-10 10-16 10s-10-4-16-10z" fill="#C9677F"/>
      </g>
      ${lampadas.map(([x, y]) => `<circle class="lampada" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5"/>`).join("")}
      <path d="M180 8l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="url(#ouro)"/>
    </g>
    <rect x="16" y="266" width="328" height="14" rx="5" fill="#FFFDFB" stroke="#D4AF5A" stroke-width="2"/>
    <path d="M30 280 H330 V372 Q330 378 324 378 H36 Q30 378 30 372Z" fill="#FFF7F4" stroke="#EFD5C6" stroke-width="2"/>
    <rect x="44" y="292" width="122" height="34" rx="6" fill="#FFFDFB" stroke="#EFD5C6"/><rect x="194" y="292" width="122" height="34" rx="6" fill="#FFFDFB" stroke="#EFD5C6"/>
    <rect x="44" y="334" width="122" height="34" rx="6" fill="#FFFDFB" stroke="#EFD5C6"/><rect x="194" y="334" width="122" height="34" rx="6" fill="#FFFDFB" stroke="#EFD5C6"/>
    <g fill="url(#ouro)"><circle cx="105" cy="309" r="4"/><circle cx="255" cy="309" r="4"/><circle cx="105" cy="351" r="4"/><circle cx="255" cy="351" r="4"/></g>
    <path d="M40 378 L36 414 M320 378 L324 414" stroke="#D4AF5A" stroke-width="5" stroke-linecap="round"/>

    <g class="item" data-id="perfume" transform="translate(58 266)">
      <rect class="item-alvo" x="-30" y="-92" width="60" height="96" fill="transparent"/>
      <g class="frasco-perfume">
        <rect x="-20" y="-50" width="40" height="50" rx="10" fill="url(#frasco)" stroke="#D9798F" stroke-width="1.5"/>
        <rect x="-11" y="-34" width="22" height="16" rx="3" fill="#fff" opacity=".8"/>
        <path d="M-6 -27 h12" stroke="#D4AF5A" stroke-width="2"/>
        <rect x="-6" y="-60" width="12" height="11" rx="2" fill="url(#ouro)"/>
        <path d="M6 -56 C18 -56 20 -66 26 -70" stroke="#D4AF5A" stroke-width="2" fill="none"/>
        <circle cx="28" cy="-72" r="7" fill="#F4B6C2" stroke="#D9798F"/>
      </g>
    </g>

    <g class="item" data-id="batom" transform="translate(116 266)">
      <rect class="item-alvo" x="-22" y="-80" width="44" height="84" fill="transparent"/>
      <path class="bala" d="M-7 -30 V-52 Q-7 -60 7 -64 V-30Z" fill="#C9677F"/>
      <rect x="-9" y="-34" width="18" height="10" fill="url(#ouro)"/>
      <rect x="-11" y="-26" width="22" height="26" rx="2" fill="#4A2C33"/>
      <rect x="-11" y="-26" width="22" height="4" fill="url(#ouro)"/>
    </g>

    <g class="item" data-id="colar" transform="translate(180 266)">
      <rect class="item-alvo" x="-36" y="-34" width="72" height="38" fill="transparent"/>
      <ellipse cx="0" cy="-4" rx="30" ry="7" fill="url(#ouro)"/>
      <ellipse cx="0" cy="-7" rx="25" ry="5" fill="#FFF6F2"/>
      <g class="perolas" fill="#FFFDFB" stroke="#E2D4D8" stroke-width=".8">
        ${Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (i / 10); return `<circle cx="${(-20 * Math.cos(a)).toFixed(1)}" cy="${(-10 - 14 * Math.sin(a)).toFixed(1)}" r="3.6"/>`; }).join("")}
      </g>
      <path d="M0 -6 l4 6 -4 5 -4 -5z" fill="#F4B6C2" stroke="#D9798F"/>
    </g>

    <g class="item" data-id="blush" transform="translate(248 266)">
      <rect class="item-alvo" x="-30" y="-64" width="60" height="68" fill="transparent"/>
      <g class="tampa"><ellipse cx="0" cy="-30" rx="24" ry="22" fill="url(#ouro)"/><ellipse cx="0" cy="-30" rx="19" ry="17" fill="#E6D3DD"/><ellipse cx="-6" cy="-36" rx="6" ry="4" fill="#fff" opacity=".7"/></g>
      <ellipse cx="0" cy="-5" rx="26" ry="8" fill="url(#ouro)"/>
      <ellipse cx="0" cy="-7" rx="20" ry="5.5" fill="#F2A7B5"/>
      <path d="M-10 -8 q10 -4 20 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".6"/>
    </g>

    <g class="item" data-id="escova" transform="translate(306 266)">
      <rect class="item-alvo" x="-30" y="-94" width="54" height="98" fill="transparent"/>
      <g class="escova-arte" transform="rotate(14)">
        <rect x="-4" y="-40" width="8" height="40" rx="4" fill="url(#ouro)"/>
        <ellipse cx="0" cy="-62" rx="16" ry="24" fill="#F4B6C2" stroke="#D9798F" stroke-width="1.5"/>
        <ellipse cx="0" cy="-62" rx="11" ry="18" fill="#FFF6F2"/>
        <g fill="#D4AF5A">${[-70, -62, -54].flatMap((y) => [-5, 0, 5].map((x) => `<circle cx="${x}" cy="${y}" r="1.6"/>`)).join("")}</g>
        <path d="M-8 -80 q10 -14 22 -4" stroke="#E9C46A" stroke-width="2" fill="none" class="fio-loiro"/>
      </g>
    </g>`;

  Telas.registrar("penteadeira", {
    montar(el) {
      const c = CONFIG.penteadeira, ids = Object.keys(c.itens);
      el.innerHTML = `
        <h2 id="penteadeira-h">${resolver(c.titulo)} <span class="enfeite">💄</span></h2>
        <p class="sub">${resolver(c.subtitulo)}</p>
        <div class="cena-penteadeira"></div>
        <div class="bilhete" aria-live="polite"><span class="bilhete-ic" aria-hidden="true">💌</span><p>${resolver("Escolha um item, {{APELIDO}}…")}</p></div>
        <p class="contador" aria-live="polite"></p>`;
      const svg = S("svg", { viewBox: "0 0 360 420", class: "penteadeira-svg", role: "group", "aria-label": "Penteadeira com espelho e maquiagens" }, el.querySelector(".cena-penteadeira"));
      svg.innerHTML = ARTE;
      const bilhete = el.querySelector(".bilhete");
      const contador = el.querySelector(".contador");
      const atualizar = () => {
        contador.textContent = resolver(c.contador, { N: vistos.size, T: ids.length });
        // cada item achado acende duas lâmpadas
        svg.querySelectorAll(".lampada").forEach((l, i) => l.classList.toggle("acesa", i < vistos.size * 2));
        el.classList.toggle("completa", vistos.size === ids.length);
      };
      atualizar();

      svg.querySelectorAll(".item").forEach((g) => {
        const id = g.dataset.id;
        if (!c.itens[id]) { g.remove(); return; }
        g.setAttribute("tabindex", 0);
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", NOMES[id]);
        g.classList.add("pulsa");
        const tocar = () => {
          g.classList.remove("pulsa", "agindo"); void g.getBoundingClientRect(); g.classList.add("agindo");
          vibrar(20);
          const [x, y] = centro(g);
          if (id === "perfume") { const r = g.querySelector("circle").getBoundingClientRect(); Brilhos.nevoa(r.left, r.top + 4, 1); if (window.Som) Som.efeito("spray"); }
          else if (id === "blush") Brilhos.nevoa(x, y - 10, Math.random() < .5 ? -1 : 1);
          else if (id === "batom") { svg.querySelector(".beijo").classList.add("on"); if (window.Som) Som.efeito("plim"); }
          else { Brilhos.explosao(x, y, 18); if (window.Som) Som.efeito("plim"); }
          bilhete.classList.remove("novo"); void bilhete.offsetWidth; bilhete.classList.add("novo");
          bilhete.querySelector(".bilhete-ic").textContent = ICONES[id] || "💌";
          bilhete.querySelector("p").textContent = resolver(c.itens[id]);
          const novo = !vistos.has(id);
          vistos.add(id);
          if (novo) {
            atualizar();
            if (vistos.size === ids.length) setTimeout(() => Brilhos.explosao(...centro(svg.querySelector('[data-id="espelho"]')), 40, "misto"), 400);
          }
        };
        g.addEventListener("click", tocar);
        g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); tocar(); } });
      });
    },
  });
})();
