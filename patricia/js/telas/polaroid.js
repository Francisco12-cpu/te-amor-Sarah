"use strict";
// 3 ── Câmera antiga: tira a foto, a polaroid sai e só revela balançando o celular.
// Sem sensor (computador, ou permissão negada): esfregar o dedo/mouse na foto também revela.
(() => {
  const META = 1500; // "energia" de balanço para revelar 100%
  let energia = 0, revelada = false, ejetada = false, ultimaAcel = null, temSensor = false;
  let foto, barra, pct, dica, btnAjuda, btnFoto, ouvindo = false, tmSemSensor = 0;

  function aplicar() {
    const p = clamp(energia / META);
    // a química "assenta" devagar no começo e rápido no fim
    foto.style.setProperty("--p", (1 - Math.pow(1 - p, 1.6)).toFixed(3));
    barra.style.width = (p * 100).toFixed(1) + "%";
    const n = Math.floor(p * 100);
    pct.textContent = resolver(CONFIG.polaroid.revelando, { P: n });
    barra.parentElement.setAttribute("aria-valuenow", n);
    if (p >= 1 && !revelada) concluir();
  }

  function somar(v) {
    if (revelada || !ejetada) return;
    energia += v;
    aplicar();
  }

  function aoMover(ev) {
    const a = ev.accelerationIncludingGravity || ev.acceleration;
    if (!a || a.x === null) return;
    if (!temSensor) { temSensor = true; dica.textContent = resolver(CONFIG.polaroid.instrucao); }
    if (ultimaAcel) {
      const d = Math.abs(a.x - ultimaAcel.x) + Math.abs(a.y - ultimaAcel.y) + Math.abs(a.z - ultimaAcel.z);
      if (d > 7) somar(Math.min(30, d - 7));
    }
    ultimaAcel = { x: a.x, y: a.y, z: a.z };
    if (!revelada) foto.style.setProperty("--balanco", (clamp(a.x || 0, -10, 10) * .8).toFixed(1) + "deg");
  }

  function ouvir(sim) {
    if (sim === ouvindo) return;
    ouvindo = sim;
    if (sim) addEventListener("devicemotion", aoMover);
    else removeEventListener("devicemotion", aoMover);
  }

  // no iPhone, o sensor precisa de permissão pedida DENTRO do toque
  function pedirSensor() {
    const DM = window.DeviceMotionEvent;
    if (!DM) return Promise.resolve(false);
    if (typeof DM.requestPermission === "function") {
      return DM.requestPermission().then((r) => r === "granted").catch(() => false);
    }
    return Promise.resolve(true);
  }

  function semSensor() {
    if (temSensor || revelada) return;
    dica.textContent = resolver(CONFIG.polaroid.instrucaoSemSensor);
    btnAjuda.hidden = false;
  }

  async function tirarFoto(raiz) {
    btnFoto.disabled = true;
    const permissao = pedirSensor(); // chamado já, ainda dentro do toque
    vibrar(40);
    if (window.Som) Som.efeito("clique");
    raiz.classList.add("flash");
    Brilhos.explosao(...centro(raiz.querySelector(".lente")), 24);
    await espera(450);
    raiz.classList.add("ejetando");
    if (window.Som) Som.efeito("motor");
    await espera(1500);
    ejetada = true;
    raiz.classList.add("solta");
    btnFoto.hidden = true;
    raiz.querySelector(".revelacao").hidden = false;
    foto.scrollIntoView({ behavior: REDUZIDO ? "auto" : "smooth", block: "center" });
    dica.textContent = resolver(CONFIG.polaroid.instrucao);
    if (await permissao) ouvir(true);
    clearTimeout(tmSemSensor);
    tmSemSensor = setTimeout(semSensor, 2500);
    // sempre deixa um caminho sem balançar depois de um tempinho (acessibilidade)
    setTimeout(() => { if (!revelada) btnAjuda.hidden = false; }, 9000);
  }

  function concluir() {
    revelada = true;
    ouvir(false);
    foto.style.setProperty("--p", 1);
    foto.style.setProperty("--balanco", "-3deg");
    foto.classList.add("pronta");
    const raiz = foto.closest(".tela");
    raiz.classList.add("revelada");
    btnAjuda.hidden = true;
    vibrar([60, 40, 60]);
    Brilhos.explosao(...centro(foto), 30, "coracao");
    Brilhos.explosao(...centro(foto), 20, "estrela");
    Balao.mostrar(CONFIG.polaroid.revelada, 5000);
  }

  // revela sozinha, devagarinho (botão de acessibilidade)
  function revelarAuto() {
    btnAjuda.hidden = true;
    const ini = energia, t0 = performance.now(), dur = REDUZIDO ? 1 : 2400;
    const passo = (t) => {
      energia = ini + (META - ini) * clamp((t - t0) / dur);
      aplicar();
      if (!revelada) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  Telas.registrar("polaroid", {
    montar(el) {
      const c = CONFIG.polaroid;
      el.innerHTML = `
        <h2 id="polaroid-h">${resolver(c.titulo)} <span class="enfeite">📸</span></h2>
        <div class="estudio">
          <div class="camera" aria-hidden="true">${CAMERA_SVG}</div>
          <div class="flash-luz" aria-hidden="true"></div>
          <div class="saida">
            <figure class="foto-polaroid">
              <div class="foto-area">
                <img src="${c.foto}" alt="${resolver(c.alt)}" draggable="false" decoding="async">
                <div class="quimica" aria-hidden="true"></div>
                <div class="vinheta" aria-hidden="true"></div>
              </div>
              <figcaption>${resolver(c.legenda)}</figcaption>
            </figure>
          </div>
        </div>
        <p class="acao-foto"><button class="btn btn-grande" type="button">${resolver(c.botaoFoto)}</button></p>
        <div class="revelacao" hidden>
          <p class="dica"></p>
          <div class="progresso" role="progressbar" aria-label="Revelação da foto" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
          <p class="pct" aria-hidden="true"></p>
          <p><button class="btn btn-claro btn-ajuda" type="button" hidden>${resolver(c.botaoAjuda)}</button></p>
        </div>`;

      foto = el.querySelector(".foto-polaroid");
      barra = el.querySelector(".progresso i");
      pct = el.querySelector(".pct");
      dica = el.querySelector(".dica");
      btnAjuda = el.querySelector(".btn-ajuda");
      btnFoto = el.querySelector(".acao-foto .btn");
      aplicar();

      btnFoto.addEventListener("click", () => tirarFoto(el));
      btnAjuda.addEventListener("click", revelarAuto);

      // plano B: esfregar/chacoalhar a foto com o dedo ou o mouse
      let ult = null;
      foto.addEventListener("pointerdown", (ev) => { ult = [ev.clientX, ev.clientY]; foto.setPointerCapture(ev.pointerId); });
      foto.addEventListener("pointermove", (ev) => {
        if (!ult || revelada) return;
        const d = Math.hypot(ev.clientX - ult[0], ev.clientY - ult[1]);
        ult = [ev.clientX, ev.clientY];
        somar(d * .8);
        foto.style.setProperty("--balanco", (clamp(ev.movementX || 0, -12, 12) * .5).toFixed(1) + "deg");
      });
      const soltar = () => { ult = null; };
      foto.addEventListener("pointerup", soltar);
      foto.addEventListener("pointercancel", soltar);
    },
    entrar() { if (ejetada && !revelada) ouvir(true); },
    sair() { ouvir(false); },
  });

  // câmera instantânea antiga, toda em SVG
  const CAMERA_SVG = `<svg viewBox="0 0 240 170" width="100%" height="100%">
    <defs>
      <linearGradient id="cam-corpo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8F3"/><stop offset="1" stop-color="#EBD3C5"/></linearGradient>
      <radialGradient id="cam-lente" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#6B5A70"/><stop offset=".55" stop-color="#2A2230"/><stop offset="1" stop-color="#120E16"/></radialGradient>
    </defs>
    <rect x="10" y="38" width="220" height="122" rx="22" fill="url(#cam-corpo)" stroke="#C9A28C" stroke-width="2"/>
    <path d="M40 38 L60 12 H180 L200 38Z" fill="#F7E3D7" stroke="#C9A28C" stroke-width="2" stroke-linejoin="round"/>
    <rect x="74" y="18" width="40" height="16" rx="4" fill="#3A3140"/><rect x="78" y="21" width="14" height="6" rx="2" fill="#8E7E96" opacity=".7"/>
    <rect x="128" y="18" width="40" height="16" rx="4" fill="#FFF" stroke="#D4AF5A" stroke-width="2"/>
    <g opacity=".9"><rect x="10" y="66" width="220" height="7" fill="#F4B6C2"/><rect x="10" y="73" width="220" height="7" fill="#F3DFA6"/><rect x="10" y="80" width="220" height="7" fill="#EFD5C6"/></g>
    <circle class="lente" cx="120" cy="96" r="44" fill="#F7E3D7" stroke="#D4AF5A" stroke-width="3"/>
    <circle cx="120" cy="96" r="34" fill="url(#cam-lente)"/>
    <circle cx="120" cy="96" r="20" fill="none" stroke="#5B4C63" stroke-width="2"/>
    <circle cx="110" cy="85" r="7" fill="#fff" opacity=".55"/><circle cx="131" cy="106" r="3" fill="#fff" opacity=".35"/>
    <circle cx="200" cy="58" r="9" fill="#D9798F" stroke="#B9506B" stroke-width="2"/>
    <text x="24" y="58" font-family="Georgia, serif" font-size="10" font-weight="700" fill="#8A661C" letter-spacing="2">INSTANT</text>
    <rect x="44" y="146" width="152" height="8" rx="4" fill="#3A3140"/>
  </svg>`;
})();
