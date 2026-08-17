# Zé Reis · 20.456 — Landing page da campanha

Single-page em HTML/CSS/JS puro, sem framework e sem build. Para publicar, basta
subir a pasta inteira para qualquer hospedagem estática.

```
ze-reis-site/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── foto-candidato-sem-fundo.png / .webp   ← recorte da IMG_5364.jpg
    ├── foto-1..6 .jpg / .webp                 ← galeria (1100px, comprimidas)
    └── favicon.svg
```

Rodando localmente:

```bash
node .claude/static-server.js
```

## Pendências para preencher

Todos os pontos abaixo estão marcados com `TODO` no código.

| Onde | O que falta |
|---|---|
| `index.html` · Vídeos | 3 iframes com `data-src="URL_DO_VIDEO"` — trocar pela URL de embed. O carregamento lazy já está pronto no `script.js`. |
| `index.html` · Apoios | 3 cards de depoimento com nome, cargo e texto de exemplo. |
| `index.html` · Conquistas | Iluminação do Brejo do Amparo, Asfalto até Moradeiras, Energia Elétrica para a Praia e Tomógrafo estão com descrição e valor genéricos. |
| `index.html` · Redes sociais | 8 links com `href="#"` (4 no contato + 4 no rodapé). |
| `index.html` · Rodapé | CNPJ da campanha. |
| `script.js` · formulário | O envio é só validado no front e mostra confirmação. Falta apontar para o endpoint da campanha. |

## Detalhes de implementação

- **Recorte do candidato**: gerado localmente (o conector Higgsfield estava sem
  créditos). Flood fill a partir das bordas por luminância, com rampa de alpha
  no contorno; bolsões de fundo presos entre braço e tronco são detectados por
  serem neutros/azulados (B ≥ R), o que os separa da pele.
- **Urna eletrônica**: 100% CSS/SVG, sem imagem. Digita `20456` sozinha ao
  entrar na viewport, no hover ou no toque; aceita digitação manual pelo teclado
  numérico; `CONFIRMA` dispara confetes e `CORRIGE` reinicia. O som (beeps via
  `AudioContext`) só toca depois da primeira interação do usuário na página,
  para respeitar as políticas de autoplay.
- **Peso inicial**: ~200 KB (foto da hero em WebP + CSS + JS). As fotos da
  galeria carregam sob demanda com `loading="lazy"`, e há fallback `.jpg` para
  navegadores sem WebP.
- **Acessibilidade**: navegação por teclado no lightbox (setas e `Esc`), foco
  visível, contraste conferido para WCAG AA e respeito a
  `prefers-reduced-motion`. Com JS desativado o conteúdo continua visível.
