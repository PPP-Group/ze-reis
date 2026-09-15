# Zé Reis · 20.456 — Landing page da campanha

Single-page em HTML/CSS/JS puro, sem framework e sem build. Para publicar, basta
subir a pasta inteira para qualquer hospedagem estática.

```
ze-reis-site/
├── index.html
├── style.css
├── script.js
├── docs/
│   └── apps-script-formulario.gs          ← backend do formulário (Google Apps Script)
└── assets/
    ├── foto-candidato-sem-fundo.png / .webp   ← recorte da IMG_5364.jpg
    ├── foto-1..6 .jpg / .webp                 ← galeria (1100px, comprimidas)
    └── favicon.svg
```

Rodando localmente:

```bash
node .claude/static-server.js
```

## Importante: cache-busting em toda publicação

`index.html` referencia `style.css?v=N` e `script.js?v=N`. **Sempre que
`style.css` ou `script.js` forem alterados, incremente o `v=N` correspondente
em `index.html` antes de publicar.**

Sem isso, quem já visitou o site antes continua rodando a versão antiga em
cache — já aconteceu duas vezes neste projeto (a imagem do hero sumiu depois
de um deploy, e o formulário de contato ficou travado em "Enviando..." porque
o navegador reusou um `script.js` de antes da URL do Apps Script ser
configurada). Mudar a query string força o navegador a buscar o arquivo de
novo, mesmo em cache antigo.

## Pendências para preencher

Todos os pontos abaixo estão marcados com `TODO` no código.

| Onde | O que falta |
|---|---|
| `index.html` · Vídeos | 3 iframes com `data-src="URL_DO_VIDEO"` — trocar pela URL de embed. O carregamento lazy já está pronto no `script.js`. |
| `index.html` · Apoios | 3 cards de depoimento com nome, cargo e texto de exemplo. |
| `index.html` · Conquistas | Iluminação do Brejo do Amparo, Asfalto até Moradeiras, Energia Elétrica para a Praia e Tomógrafo estão com descrição e valor genéricos. |
| `index.html` · Redes sociais | 8 links com `href="#"` (4 no contato + 4 no rodapé). |
| `script.js` · formulário | Falta colar a URL do Apps Script na constante `APPS_SCRIPT_URL`. Ver seção **Configurar o formulário de contato** abaixo. |

## Configurar o formulário de contato (Google Sheets, sem backend próprio)

O formulário grava cada envio como uma linha numa planilha do Google Sheets,
usando um Google Apps Script "App da Web" como backend gratuito. O script já
está pronto em [`docs/apps-script-formulario.gs`](docs/apps-script-formulario.gs) —
só falta implantar e colar a URL gerada no site.

**Importante:** esta planilha e essa implantação são exclusivas deste site.
Nunca reaproveite a URL de outra campanha (ex.: Igor Eto) aqui, nem o
contrário — cada site tem sua própria planilha isolada.

1. Crie uma planilha nova no [Google Sheets](https://sheets.google.com).
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão do editor e cole o conteúdo inteiro de
   `docs/apps-script-formulario.gs`.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Você mesmo**.
   - Quem pode acessar: **Qualquer pessoa**.
5. Clique em **Implantar** e autorize as permissões pedidas (só acesso à
   própria planilha — o script não envia e-mail nem acessa mais nada).
6. Copie a URL gerada (termina em `/exec`).
7. Abra [`script.js`](script.js), procure por `APPS_SCRIPT_URL` (seção
   **10 · FORMULÁRIO**) e cole a URL no lugar de `'URL_DO_APPS_SCRIPT'`.
8. Publique o site. Teste enviando o formulário e confira se a linha
   apareceu na planilha.

**Sobre a confirmação de envio:** o `fetch` usa `mode: 'no-cors'` porque o
Apps Script Web App não responde com cabeçalhos CORS, então o site não
consegue ler a resposta real do servidor. A mensagem de sucesso aparece
assim que o `fetch` não lança erro de rede — não é uma confirmação vinda do
Google. Essa é uma limitação conhecida e aceita dessa técnica (mesmo padrão
usado no site do Igor Eto).

Se quiser atualizar o esquema de colunas da planilha (adicionar campo,
mudar ordem), edite tanto o `.gs` (a linha do `appendRow`) quanto os
`name`/`id` dos campos em `index.html` — os nomes precisam bater com as
chaves lidas em `dados.nome`, `dados.email` etc. no `.gs`.

## Detalhes de implementação

- **Recorte do candidato**: gerado localmente (o conector Higgsfield estava sem
  créditos). Flood fill a partir das bordas por luminância, com rampa de alpha
  no contorno; bolsões de fundo presos entre braço e tronco são detectados por
  serem neutros/azulados (B ≥ R), o que os separa da pele.
- **Formulário de contato**: sem backend próprio — grava numa planilha do
  Google Sheets via Apps Script Web App. Ver seção **Configurar o formulário
  de contato** acima.
- **Peso inicial**: ~200 KB (foto da hero em WebP + CSS + JS). As fotos da
  galeria carregam sob demanda com `loading="lazy"`, e há fallback `.jpg` para
  navegadores sem WebP.
- **Acessibilidade**: navegação por teclado no lightbox (setas e `Esc`), foco
  visível, contraste conferido para WCAG AA e respeito a
  `prefers-reduced-motion`. Com JS desativado o conteúdo continua visível.
