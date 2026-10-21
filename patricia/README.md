# ✈️ Feliz aniversário, Loirinha!

Site-surpresa de aniversário para a **Patrícia**, com tema de viagem, compras e maquiagem.
Feito só com HTML, CSS e JS, sem build e sem dependências. Toda a arte é desenhada em código (SVG e CSS) e a música é gerada no próprio navegador.
Pensado para celular.

## O roteiro
| # | Parada | O que acontece |
|---|---|---|
| 1 | 🎫 Cartão de embarque | "Embarcar na surpresa" carimba o cartão e o avião decola. Segredo: 3 toques no aviãozinho |
| 2 | 📍 Mapa de viagens | Pins de Carolina-MA e Bahia, rota com aviãozinho, carimbos no passaporte |
| 3 | 📸 Câmera antiga | Tira a foto, a polaroid sai e **só revela balançando o celular** (ou esfregando a foto) |
| 4 | 🛍 Sacolas | 6 sacolinhas que abrem e mostram um recibo com um elogio |
| 5 | 💄 Penteadeira | Espelho, batom, perfume, blush, escova e colar, cada um com uma mensagem |
| 6 | 🎂 Final | Apagar as velas, confete dourado, cartinha e música (só com play) |

Para abrir direto numa parada, use o endereço com `#mapa`, `#polaroid`, `#sacolas`, `#penteadeira` ou `#final`.

## Onde editar
- **Textos:** todos ficam em [`js/config.js`](js/config.js), incluindo nome, apelido, data, mensagens, destinos, sacolas, penteadeira e a cartinha.
- **Foto:** troque `fotos/patricia.jpg` (de preferência quadrada, até uns 800 px) ou mude `polaroid.foto` no config.
- **Destinos:** em `mapa.destinos`, use `lat`/`lon` reais (no Google Maps, clique com o botão direito no lugar e copie as coordenadas). Destinos fora do Brasil vão em `mapa.proximos.lista`.
- **Música:** por padrão toca "Parabéns a você" numa caixinha de música. Para usar outra, coloque um `.mp3` em `musica/` e preencha `musica.arquivo` (ex.: `"musica/nossa.mp3"`).
- **Cores:** ficam no topo de `css/base.css` (`:root`).

## Sobre o sensor (balançar para revelar)
- **Android:** funciona direto.
- **iPhone:** na hora de "Tirar a foto", o Safari pergunta se o site pode usar o movimento. É preciso tocar em **Permitir**. Isso só funciona em **https**, e o GitHub Pages já usa https.
- **Sem sensor** (computador, ou permissão negada): dá para esfregar o dedo ou o mouse na foto. Depois de alguns segundos também aparece o botão "revelar sem balançar".

## Publicar no GitHub Pages
Repositório → *Settings → Pages → Build and deployment → Deploy from a branch* → escolha o branch e a pasta onde está este `index.html` → Save.
