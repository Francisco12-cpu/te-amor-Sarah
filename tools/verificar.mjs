// Checklist da seção 13: nome com H, frases F1–F11, campos pendentes, rede.
// Uso: node tools/verificar.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const falhas = [];
const html = readFileSync("index.html", "utf8");

// 1. o nome sem o H final não pode aparecer em nenhum arquivo
const andar = (d) => readdirSync(d).flatMap((f) => {
  if (["node_modules", ".git", "fotos"].includes(f)) return [];
  const p = join(d, f);
  return statSync(p).isDirectory() ? andar(p) : [p];
});
for (const f of andar(".")) {
  if (!/\.(html|js|mjs|css|md|json)$/.test(f)) continue;
  if (/\bsara\b/i.test(readFileSync(f, "utf8").replace(/\\bsara\\b/g, ""))) falhas.push(`nome sem H em ${f}`);
}

// 2. frases obrigatórias (comparação sem acentos/pontuação)
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
const textos = norm(readFileSync("src/textos.js", "utf8").replaceAll("{{NOME}}", "Sarah"));
const F = {
  F1: "Eu te amo.", F2: "Eu sempre quero estar com você.", F3: "Você é tão especial.",
  F5: "Eu nunca vou te abandonar.", F6: "Você é uma pessoa que esconde a sua dor para ajudar os outros.",
  F7: "Você é uma pessoa importante para o mundo. Você é incrível.", F8: "Sarah, eu te amo acima de tudo.",
  F9: "Sempre estarei com você.", F10: "Feliz aniversário, minha Coraline.", F11: "No mundo cinza você é a cor da minha vida.",
};
for (const [k, v] of Object.entries(F)) if (!textos.includes(norm(v))) falhas.push(`${k} ausente: ${v}`);
for (const w of ["incrivel", "forte", "importante", "cuid"]) if (!textos.includes(w)) falhas.push(`F4: elogio "${w}" ausente`);

// 3. campos pendentes
if (/\[(PERSONALIZAR|ASSINATURA)/.test(html)) falhas.push("há campos [PERSONALIZAR]/[ASSINATURA] no index.html");

// 4. zero requisições externas
const urls = (html.match(/https?:\/\/[^\s"'`)]+/g) || []).filter((u) => !u.startsWith("http://www.w3.org/"));
if (urls.length) falhas.push("referências externas: " + urls.join(", "));

// 5. peso
const kb = Buffer.byteLength(html) / 1024;
if (kb > 1500) falhas.push(`index.html pesado: ${kb.toFixed(0)} KB`);

console.log(falhas.length ? "FALHOU:\n- " + falhas.join("\n- ") : `OK — Sarah com H, F1–F11 presentes, offline, ${kb.toFixed(0)} KB`);
process.exit(falhas.length ? 1 : 0);
