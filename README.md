# 🗝️ Coraline para Sarah

Um curta interativo de aniversário para a **Sarah** (com H), no estilo Coraline.
É um único arquivo, `index.html`, que funciona offline e não depende de nada externo: toda a arte é desenhada em código (SVG, Canvas e CSS) e a música é sintetizada no navegador.

## Como abrir
- **No GitHub Pages:** *Settings → Pages → Branch: `main` / (root)* → Save. Em ~1 minuto o link fica pronto, no formato `https://<usuario>.github.io/te-amor-Sarah/`.
- **Local:** é só abrir o `index.html` no navegador.

Para ver com som, toque no botão da primeira tela. No iPhone, o som toca mesmo com a chave de silencioso ligada; se não tocar, aumente o volume.

## Modos
| URL | O que faz |
|---|---|
| `?gravar=1` | Toca tudo sozinho, sem botões, para gravar a tela em vídeo |
| `?cena=N` | Abre direto na cena N (0–15) |

## Segredos
- Segure o botão da primeira tela por 3 segundos.
- Ache o gato: ele aparece em 5 cenas.
- Na última cena há 10 botões escondidos no céu.

## Para quem for mexer
O código-fonte fica em `src/`. Todos os textos estão em `src/textos.js`. Depois de editar, rode:
```
node tools/montar.mjs     # gera o index.html
node tools/verificar.mjs  # nome com H, 11 frases obrigatórias, offline
```
