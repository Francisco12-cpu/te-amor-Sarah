// Junta src/ num único index.html (sem dependências, funciona offline).
// Uso: node tools/montar.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (f) => readFileSync(join(raiz, "src", f), "utf8");

const scripts = ["textos.js", "base.js", "som.js", "motor.js", "cenas-1.js", "cenas-2.js", "cenas-3.js", "cenas-4.js"];
const html = ler("modelo.html")
  .replace("/*ESTILO*/", () => ler("estilo.css"))
  .replace("/*SCRIPT*/", () => scripts.map((f) => `// ── ${f}\n${ler(f)}`).join("\n"));

writeFileSync(join(raiz, "index.html"), html);
console.log(`index.html: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
