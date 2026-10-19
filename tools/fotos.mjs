// Tira fotos de cada cena em tempos-chave (modo quadro a quadro) e lista erros do console.
// Uso: node tools/fotos.mjs [pastaSaida] [larguraxaltura]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const saida = resolve(process.argv[2] || "fotos");
const [W, H] = (process.argv[3] || "360x800").split("x").map(Number);
mkdirSync(saida, { recursive: true });
const url = "file://" + resolve("index.html");

const PLANO = {
  0: [500, 3500], 1: [1500, 3200, 9000], 2: [1500, 4500, 10000], 3: [1200, 4000, 13000, 16000],
  4: [1500, 5000, 10000], 5: [1000, 3500, 9000], 6: [1500, 4000, 8000, 12000], 7: [3000, 7000, 11000, 13500],
  8: [2000, 7000, 12000], 9: [2500, 9000, 12500], 10: [2000, 4300, 11800], 11: [1500, 9000],
  12: [1000, 3000, 6000, 9500, 14000], 13: [1500, 5000, 9800, 12000], 14: [2500, 6500, 11000, 15000, 18500], 15: [2000, 6000],
};

const browser = await chromium.launch();
const erros = [];
for (const [cena, tempos] of Object.entries(PLANO)) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  page.on("console", (m) => { if (m.type() === "error") erros.push(`cena ${cena}: ${m.text()}`); });
  page.on("pageerror", (e) => erros.push(`cena ${cena}: ${e.message}`));
  await page.goto(`${url}?quadro=1&cena=${cena}`);
  await page.waitForFunction(() => typeof window.__quadro === "function");
  let t = 0;
  for (const alvo of tempos) {
    await page.evaluate(([de, ate]) => { for (let x = de; x < ate; x += 33) window.__quadro(Math.min(33, ate - x)); }, [t, alvo]);
    t = alvo;
    const est = await page.evaluate(() => window.__estado());
    await page.screenshot({ path: join(saida, `c${String(cena).padStart(2, "0")}_${alvo}.png`) });
    if (est.idx !== Number(cena)) erros.push(`cena ${cena}: em t=${alvo} já estava na cena ${est.idx}`);
  }
  await page.close();
}
await browser.close();
console.log(erros.length ? erros.join("\n") : "sem erros no console");
