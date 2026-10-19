// Gera o MP4 de backup (720x1280, 30 fps, com som) a partir do modo ?gravar=1.
// Uso: node tools/video.mjs [saida.mp4]
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const saida = resolve(process.argv[2] || "coraline-para-sarah.mp4");
const FPS = 30, DT = 1000 / FPS;
const tmp = join(tmpdir(), "quadros-sarah");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.error("erro:", e.message));
await page.goto("file://" + resolve("index.html") + "?quadro=1&gravar=1");
await page.waitForFunction(() => typeof window.__quadro === "function");
await page.evaluate(() => window.__audio.iniciar(330));

let i = 0, fimEm = null;
for (;;) {
  await page.evaluate((dt) => window.__quadro(dt), DT);
  await page.screenshot({ path: join(tmp, `q${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 88 });
  i++;
  const est = await page.evaluate(() => window.__estado());
  if (est.idx === 15 && fimEm === null) fimEm = i;
  if (fimEm !== null && i - fimEm > FPS * 26) break;
  if (i % 300 === 0) console.log(`${(i / FPS).toFixed(0)} s — cena ${est.idx}`);
  if (i > FPS * 320) break;
}
const seg = i / FPS;
console.log(`quadros: ${i} (${seg.toFixed(1)} s); renderizando áudio...`);
const total = await page.evaluate(() => window.__audio.renderizar());
const partes = [];
for (let k = 0; k < total; k += 4 << 20) partes.push(Buffer.from(await page.evaluate(([a, b]) => window.__audio.pedaco(a, b), [k, 4 << 20]), "base64"));
writeFileSync(join(tmp, "audio.raw"), Buffer.concat(partes));
await browser.close();

execFileSync("ffmpeg", ["-y", "-loglevel", "error",
  "-framerate", String(FPS), "-i", join(tmp, "q%05d.jpg"),
  "-f", "s16le", "-ar", "44100", "-ac", "2", "-i", join(tmp, "audio.raw"),
  "-t", seg.toFixed(2), "-af", `afade=t=out:st=${(seg - 3).toFixed(2)}:d=3`,
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "160k", saida]);
console.log("pronto:", saida);
