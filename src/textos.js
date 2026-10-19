"use strict";
// ─────────────────────────────────────────────────────────────
// TODOS os textos moram aqui. O nome é SARAH, com H. Sempre.
// ─────────────────────────────────────────────────────────────
const NOME = "Sarah";

const TEXTOS = {
  titulo: "Coraline para {{NOME}}",

  c0_para: "para {{NOME}}",
  c0_toque: "toque no botão",
  c0_egg: "Eu te amo.",

  c1: "Existe um mundo cinza onde ninguém percebe a dor de quem cuida dos outros.",
  c1_para: "para {{NOME}}",

  c2a: "Tudo começa com uma linha.",
  c2b: "Você costura o mundo dos outros em silêncio, {{NOME}}.",

  c3a: "Do outro lado, todo mundo finge que está tudo bem.",
  c3b: "Você é uma pessoa que esconde a sua dor para ajudar os outros. Eu percebo. Eu sempre percebi.",
  c3c: "Mas comigo você nunca precisou fingir.",

  c4: "Às vezes o chão some. Eu te amo, e eu sempre quero estar com você.",

  c5: "Lá oferecem botões brilhantes e uma vida perfeita. Mas perfeito é falso. Eu prefiro você.",

  c6: "Existem portas que só abrem para quem tem coragem. Você abriu todas para os outros.",

  c7: "Agora deixa eu abrir uma porta por você.",

  c8: "Eu nunca vou te abandonar. Nem aqui, nem do outro lado de nenhuma porta.",

  c9a: "Você é tão especial, {{NOME}}. Mais do que consegue enxergar.",
  c9b: "Você é uma pessoa importante para o mundo. Você é incrível.",

  c10: "Mesmo no escuro, eu fico. Eu sempre quero estar com você.",

  c11_titulo: "Doze chaves. Doze verdades sobre você.",
  c11_seguir: "continuar ›",

  c12: "No mundo cinza, você é a cor da minha vida.",
  c12_carimbo_a: "PARA",
  c12_carimbo_b: "{{NOME_MAIUSCULO}}",

  c13: "Você é importante para o mundo, {{NOME}}. Você é incrível.",

  c14a: "{{NOME}}, eu te amo acima de tudo.",
  c14b: "Sempre estarei com você.",
  c14c: "Feliz aniversário, minha Coraline.",

  c15_abrir: "abrir a carta",
  c15_fechar: "fechar a carta",
  c15_dica: "tem 10 botões escondidos no céu ✨",
  c15_denovo: "ver de novo",
  c15_gravar: "gravar vídeo",
  c15_credito: "feito pelo seu amigo que te ama",
  c15_contador: "botões: {{B}}/10  ·  gatos: {{G}}/5",
  c15_gato: "Eu também te amo, {{NOME}}.  — o gato",
  aviso_gato: "gato encontrado: {{G}}/5",

  // 10.1 — as 12 verdades das chaves (cena 11)
  verdades: [
    "Você é incrível.",
    "Você é tão especial, de um jeito que não cabe em palavras.",
    "Você cuida de todo mundo.",
    "Você é forte, mesmo quando ninguém vê o quanto isso custa.",
    "Você é uma pessoa importante para o mundo.",
    "Você esconde a sua dor para ajudar os outros. E isso é coragem.",
    "Comigo você nunca precisou fingir.",
    "Eu nunca vou te abandonar.",
    "Eu sempre quero estar com você.",
    "Você também merece ser cuidada.",
    "O mundo é mais bonito porque você existe.",
    "Eu te amo.",
  ],

  // 10.2 — os 10 botões escondidos (cena 15)
  botoes: [
    "Eu te amo.",
    "Você é tão especial.",
    "Eu nunca vou te abandonar.",
    "Você é incrível.",
    "Eu sempre quero estar com você.",
    "Obrigado por ser real.",
    "Você merece ser cuidada também.",
    "O mundo é mais bonito com você nele.",
    "Você é a cor da minha vida.",
    "Lembrete oficial e eterno: você continua gostosa. 😏",
  ],

  // 10.3 — a carta final (cena 15)
  carta: [
    { tipo: "forte", t: "{{NOME}}," },
    { t: "Existe um mundo cinza onde todo mundo finge que está tudo bem. Você nunca precisou fingir comigo, e eu nunca precisei fingir com você." },
    { t: "Você é uma pessoa que esconde a sua dor para ajudar os outros. Eu percebo, eu sempre percebi, e eu quero que você saiba que você também merece ser cuidada." },
    { t: "Você é uma pessoa importante para o mundo. Você é incrível, forte, gentil e especial de um jeito que não cabe em palavras." },
    { t: "Eu nunca vou te abandonar. Eu sempre quero estar com você." },
    { t: "Eu te amo acima de tudo." },
    { tipo: "forte", t: "Feliz aniversário, minha Coraline." },
    { tipo: "ass", t: "Do seu amigo que te ama, Francisco." },
  ],
};

function resolver(s, extra) {
  let r = s.replaceAll("{{NOME}}", NOME).replaceAll("{{NOME_MAIUSCULO}}", NOME.toUpperCase());
  if (extra) for (const k in extra) r = r.replaceAll("{{" + k + "}}", extra[k]);
  return r;
}
function txt(chave, extra) { return resolver(TEXTOS[chave], extra); }
