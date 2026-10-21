"use strict";
// ─────────────────────────────────────────────────────────────
// Base: atalhos de DOM/SVG, brilhos e confete, balão, janela e
// o registro das telas (cada tela vive em js/telas/*.js)
// ─────────────────────────────────────────────────────────────
const REDUZIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SVGNS = "http://www.w3.org/2000/svg";

function H(tag, attrs, pai) {
  const el = document.createElement(tag);
  for (const k in attrs || {}) {
    if (k === "txt") el.textContent = attrs[k];
    else if (k === "html") el.innerHTML = attrs[k];
    else el.setAttribute(k, attrs[k]);
  }
  if (pai) pai.appendChild(el);
  return el;
}
function S(tag, attrs, pai) {
  const el = document.createElementNS(SVGNS, tag);
  for (const k in attrs || {}) el.setAttribute(k, attrs[k]);
  if (pai) pai.appendChild(el);
  return el;
}
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const espera = (ms) => new Promise((r) => setTimeout(r, REDUZIDO ? 0 : ms));
const vibrar = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { /* opcional */ } };

// centro de um elemento na tela (para soltar brilhos de lá)
function centro(el) {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

// ── partículas: brilhos, corações, confete e névoa num canvas só
const Brilhos = (() => {
  const cv = document.getElementById("brilhos");
  const ctx = cv.getContext("2d");
  const CORES_OURO = ["#D4AF5A", "#F3DFA6", "#E9C46A", "#FFF1C9", "#C9A44C"];
  const CORES_ROSA = ["#F4B6C2", "#D9798F", "#FBE4EA", "#EFD5C6"];
  let ps = [], rodando = false, dpr = 1, chuva = 0, ultimo = 0;

  function medir() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  }
  medir();
  addEventListener("resize", medir);

  function add(p) {
    if (ps.length > 400) return;
    ps.push(Object.assign({ vida: 0, max: 1000, rot: 0, vr: 0, g: 0, ar: .99 }, p));
    if (!rodando) { rodando = true; ultimo = performance.now(); requestAnimationFrame(passo); }
  }

  function estrela(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4, rr = i % 2 ? r * .32 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }
  function coracao(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y + r * .9);
    ctx.bezierCurveTo(x - r * 1.6, y - r * .2, x - r * .7, y - r * 1.3, x, y - r * .45);
    ctx.bezierCurveTo(x + r * .7, y - r * 1.3, x + r * 1.6, y - r * .2, x, y + r * .9);
    ctx.fill();
  }

  function passo(agora) {
    const dt = Math.min(50, agora - ultimo); ultimo = agora;
    if (chuva > 0 && Math.random() < chuva) confeteCaindo();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps = ps.filter((p) => (p.vida += dt) < p.max && p.y < innerHeight + 40);
    for (const p of ps) {
      p.vy += p.g * dt; p.vx *= p.ar; p.vy *= p.ar;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      const t = p.vida / p.max;
      ctx.globalAlpha = p.tipo === "confete" ? Math.min(1, (1 - t) * 3) : Math.sin(Math.PI * Math.min(1, t * 1.2 + .1));
      ctx.fillStyle = p.cor;
      if (p.tipo === "estrela") estrela(p.x, p.y, p.r * (1 - t * .5));
      else if (p.tipo === "coracao") coracao(p.x, p.y, p.r);
      else if (p.tipo === "nevoa") { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + t * 2), 0, 7); ctx.fill(); }
      else {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.rot * 2.3));
        ctx.fillRect(-p.r, -p.r * .45, p.r * 2, p.r * .9);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    if (ps.length || chuva > 0) requestAnimationFrame(passo);
    else { rodando = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  const sorte = (l) => l[(Math.random() * l.length) | 0];

  function confeteCaindo() {
    add({
      tipo: Math.random() < .15 ? "coracao" : "confete",
      x: Math.random() * innerWidth, y: -12,
      vx: (Math.random() - .5) * .05, vy: .08 + Math.random() * .08, g: 0, ar: 1,
      vr: (Math.random() - .5) * .01, r: 4 + Math.random() * 4,
      cor: Math.random() < .7 ? sorte(CORES_OURO) : sorte(CORES_ROSA), max: 9000,
    });
  }

  return {
    // rastro suave atrás do dedo/mouse
    rastro(x, y) {
      if (REDUZIDO) return;
      add({ tipo: "estrela", x, y, vx: (Math.random() - .5) * .04, vy: -.02 - Math.random() * .03, r: 3 + Math.random() * 4, cor: sorte(CORES_OURO), max: 700 });
    },
    explosao(x, y, n = 14, tipo = "estrela") {
      if (REDUZIDO) n = Math.min(n, 4);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = .08 + Math.random() * .22;
        add({
          tipo: tipo === "misto" ? sorte(["estrela", "coracao", "confete"]) : tipo,
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .1, g: .0003, ar: .985,
          vr: (Math.random() - .5) * .02, r: 3 + Math.random() * 5,
          cor: tipo === "coracao" ? sorte(CORES_ROSA) : sorte(CORES_OURO.concat(tipo === "misto" ? CORES_ROSA : [])),
          max: 900 + Math.random() * 700,
        });
      }
    },
    nevoa(x, y, dir = -1) {
      const n = REDUZIDO ? 4 : 26;
      for (let i = 0; i < n; i++) {
        const a = (dir < 0 ? Math.PI : 0) + (Math.random() - .5) * .9, v = .05 + Math.random() * .15;
        add({ tipo: Math.random() < .2 ? "coracao" : "nevoa", x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .02, ar: .975, r: 2 + Math.random() * 4, cor: sorte(CORES_ROSA), max: 1400 });
      }
    },
    // confete dourado caindo sem parar (0 = desliga)
    chuva(intensidade) {
      chuva = REDUZIDO ? 0 : intensidade;
      if (chuva > 0 && !rodando) { rodando = true; ultimo = performance.now(); requestAnimationFrame(passo); }
    },
  };
})();

// brilhinhos onde o dedo/mouse passa
(() => {
  let ult = 0;
  addEventListener("pointermove", (ev) => {
    const agora = performance.now();
    if (agora - ult < (ev.pointerType === "mouse" ? 35 : 60)) return;
    ult = agora;
    Brilhos.rastro(ev.clientX, ev.clientY);
  }, { passive: true });
  addEventListener("pointerdown", (ev) => Brilhos.explosao(ev.clientX, ev.clientY, 5), { passive: true });
})();

// ── balão: mensagem curta que também é lida por leitores de tela
const Balao = (() => {
  const el = document.getElementById("balao");
  let tm = 0;
  return {
    mostrar(texto, ms = 4200) {
      clearTimeout(tm);
      el.textContent = resolver(texto);
      requestAnimationFrame(() => el.classList.add("on"));
      tm = setTimeout(() => Balao.esconder(), ms);
    },
    esconder() { el.classList.remove("on"); },
  };
})();

// ── janela (modal) acessível: foco preso, Esc fecha, devolve o foco
function janela(conteudo, rotuloFechar, classe = "") {
  return new Promise((ok) => {
    const antes = document.activeElement;
    const fundo = H("div", { class: "janela " + classe, role: "dialog", "aria-modal": "true" }, document.body);
    const caixa = H("div", { class: "janela-caixa" }, fundo);
    caixa.appendChild(conteudo);
    const fechar = H("button", { class: "btn", type: "button", txt: rotuloFechar }, caixa);
    const sair = () => {
      fundo.remove(); removeEventListener("keydown", tecla);
      if (antes && antes.focus) antes.focus({ preventScroll: true });
      ok();
    };
    const tecla = (ev) => {
      if (ev.key === "Escape") sair();
      if (ev.key === "Tab") { ev.preventDefault(); fechar.focus(); }
    };
    fechar.addEventListener("click", sair);
    fundo.addEventListener("click", (ev) => { if (ev.target === fundo) sair(); });
    addEventListener("keydown", tecla);
    fechar.focus({ preventScroll: true });
  });
}

// ── registro das telas
// cada tela: { titulo, icone, montar(el), entrar(el), sair(el), rodape: false }
const Telas = (() => {
  const ordem = ["embarque", "mapa", "polaroid", "sacolas", "penteadeira", "final"];
  const defs = {};
  return {
    ordem,
    registrar(id, def) { defs[id] = def; },
    def: (id) => defs[id] || {},
  };
})();
