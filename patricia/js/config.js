"use strict";
// ─────────────────────────────────────────────────────────────
// ✏️  TODOS OS TEXTOS DO SITE MORAM AQUI.
// Edite à vontade: o resto do código só lê este objeto.
// Dica: {{NOME}} vira o nome e {{APELIDO}} vira o apelido.
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  nome: "Patrícia",
  apelido: "Loirinha",
  assinatura: "Francisco",

  // aparece no cartão de embarque
  data: "21 OUT 2026",

  tituloAba: "Feliz aniversário, {{APELIDO}} ✨",

  // botão de música (nunca toca sozinha)
  // arquivo: deixe "" para a caixinha de música feita no navegador,
  // ou coloque um mp3 na pasta musica/ e escreva o caminho, ex.: "musica/nossa.mp3"
  musica: {
    arquivo: "",
    tocar: "Tocar música",
    pausar: "Pausar música",
  },

  navegacao: {
    voltar: "‹ voltar",
    proxima: "Próxima parada ›",
  },

  // 1 ── cartão de embarque
  embarque: {
    companhia: "LOIRINHA AIRLINES",
    tipo: "Cartão de embarque · Boarding pass",
    passageira: "{{NOME_MAIUSCULO}} “{{APELIDO_MAIUSCULO}}”",
    origem: { codigo: "PAT", cidade: "Você" },
    destino: { codigo: "BDAY", cidade: "Seu dia" },
    voo: "LR 2026",
    portao: "♥",
    assento: "1A",
    classe: "Primeiríssima",
    rodape: "Embarque prioritário para a aniversariante mais linda do mundo.",
    botao: "Embarcar na surpresa ✈",
    carimbo: "EMBARCADO",
    // segredo: toque 3 vezes no aviãozinho do cartão
    segredo: "Psiu, {{APELIDO}}: este voo só existe porque você existe. ✨",
  },

  // 2 ── mapa de viagens
  // lat/lon são coordenadas reais (pegue no Google Maps: clique com o botão direito no lugar)
  mapa: {
    titulo: "Mapa de viagens",
    subtitulo: "Toque nos pins para ganhar os carimbos do seu passaporte.",
    carimbos: "carimbos: {{N}}/{{T}}",
    destinos: [
      {
        nome: "Carolina",
        uf: "MA",
        lat: -7.33, lon: -47.47,
        icone: "🌊",
        texto: "Carolina, no Maranhão: cachoeira, Chapada das Mesas e você deixando qualquer paisagem ainda mais bonita.",
      },
      {
        nome: "Bahia",
        uf: "BA",
        lat: -12.97, lon: -38.5,
        icone: "🌴",
        texto: "Bahia: mar azul, sol dourado e a {{APELIDO}} brilhando mais que o pôr do sol.",
      },
    ],
    proximos: {
      titulo: "Próximos destinos",
      lista: ["Paris 🗼", "Gramado ❄️", "Maldivas 🐚", "Onde você quiser ✨"],
    },
  },

  // 3 ── polaroid (balançar o celular para revelar)
  polaroid: {
    titulo: "Uma foto instantânea",
    foto: "fotos/patricia.jpg",
    alt: "Foto da {{NOME}} sorrindo, com cabelo longo e blusa vermelha",
    botaoFoto: "Tirar a foto 📸",
    instrucao: "Agora balance o celular para revelar! 📳",
    instrucaoSemSensor: "Sem sensor por aqui? Esfregue o dedo (ou o mouse) na foto para revelar.",
    revelando: "revelando… {{P}}%",
    botaoAjuda: "revelar sem balançar",
    legenda: "{{APELIDO}} ✨ 2026",
    revelada: "Revelada! A foto mais linda do rolo inteiro. 💛",
  },

  // 4 ── sacolas de compras
  sacolas: {
    titulo: "Sacolas de compras",
    subtitulo: "Cada sacolinha guarda um presente. Toque para abrir!",
    contador: "sacolas abertas: {{N}}/{{T}}",
    finalizado: "Compras finalizadas! Total: amor infinito, em 12x sem juros. 💳💖",
    fechar: "guardar na sacola",
    itens: [
      { loja: "Boutique Sorriso", cor: "#F4B6C2", texto: "O seu sorriso combina com tudo. É o acessório mais lindo que existe." },
      { loja: "Maison Brilho", cor: "#E8CFA8", texto: "Você entra num lugar e ele fica mais iluminado. Sério." },
      { loja: "Ateliê Memórias", cor: "#F7D9E3", texto: "Cada viagem com você vira uma lembrança favorita." },
      { loja: "Elegância & Cia", cor: "#D9B8C4", texto: "Elegante até de pijama, {{APELIDO}}. Não tem como." },
      { loja: "Loja do Coração", cor: "#F2C6B4", texto: "Você é generosa, carinhosa e faz todo mundo se sentir em casa." },
      { loja: "Outlet da Coragem", cor: "#EED9C4", texto: "Você corre atrás dos seus sonhos e ainda chega maravilhosa." },
    ],
  },

  // 5 ── penteadeira
  penteadeira: {
    titulo: "Penteadeira da {{APELIDO}}",
    subtitulo: "Toque no espelho e em cada item da penteadeira.",
    contador: "itens: {{N}}/{{T}}",
    itens: {
      espelho: "Espelho, espelho meu: existe alguém mais linda do que a {{APELIDO}}? Não existe.",
      batom: "Um beijo pra você! Que esse novo ano tenha muitos motivos pra sorrir. 💋",
      perfume: "Você deixa um perfume bom por onde passa: o da sua alegria.",
      blush: "Bochecha corada de tanto rir: é isso que eu te desejo todos os dias.",
      escova: "Cabelo de princesa, coração de ouro. Isso é ser {{APELIDO}}.",
      colar: "Você é a joia mais preciosa. Nunca esqueça do seu valor.",
    },
  },

  // 6 ── mensagem final
  final: {
    titulo: "Feliz aniversário, {{APELIDO}}!",
    velas: "Faça um pedido e toque nas velas 🕯️",
    abrirCarta: "abrir a cartinha 💌",
    carta: [
      { tipo: "forte", t: "{{NOME}}, minha {{APELIDO}}," },
      { t: "Hoje é o seu dia, e o mundo inteiro devia parar para comemorar." },
      { t: "Que esse novo ano venha cheio de viagens incríveis, sacolas cheias, looks perfeitos e muitos motivos para você sorrir." },
      { t: "Você é linda por fora e mais ainda por dentro. Obrigado por existir e deixar tudo mais bonito." },
      { tipo: "forte", t: "Feliz aniversário! ✨" },
      { tipo: "ass", t: "Com carinho, {{ASSINATURA}}." },
    ],
    denovo: "embarcar de novo ✈",
  },
};

// ── não precisa mexer daqui para baixo
function resolver(s, extra) {
  let r = String(s)
    .replaceAll("{{NOME}}", CONFIG.nome)
    .replaceAll("{{APELIDO}}", CONFIG.apelido)
    .replaceAll("{{NOME_MAIUSCULO}}", CONFIG.nome.toUpperCase())
    .replaceAll("{{APELIDO_MAIUSCULO}}", CONFIG.apelido.toUpperCase())
    .replaceAll("{{ASSINATURA}}", CONFIG.assinatura);
  if (extra) for (const k in extra) r = r.replaceAll("{{" + k + "}}", extra[k]);
  return r;
}
