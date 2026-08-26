# PROMPT PARA CLAUDE CODE — Site de Campanha Zé Reis

---

## CONTEXTO GERAL

Você vai construir uma landing page completa de campanha eleitoral para **Zé Reis**, candidato a **Deputado Estadual por Minas Gerais**, partido **Podemos**, número na urna **20.456**, slogan **"Trabalho que fica"**.

É uma **single-page application** em HTML/CSS/JavaScript puro (sem framework), com navegação suave por âncoras. O site deve ser moderno, com alto impacto visual, animações bem executadas e fiel à identidade visual da campanha.

---

## PASSO 1 — PREPARAÇÃO DOS ASSETS COM HIGGSFIELD (obrigatório antes de codar)

Antes de escrever qualquer linha de HTML, use o **conector Higgsfield** (MCP tools com prefixo `mcp__101124eb-...`) para preparar os assets visuais. Isso é crítico para o impacto do site.

### 1.1 — Foto principal sem fundo (para a Hero)

Use a ferramenta `remove_background` do Higgsfield na foto `ZÉ REIS/FOTOS/IMG_5364.jpg` (foto de estúdio com fundo claro, camisa polo azul marinho). O resultado será a imagem principal do candidato usada na hero section.

Se a ferramenta precisar de upload primeiro, use `media_upload` para fazer o upload do arquivo, pegue o ID retornado e use no `remove_background`.

### 1.2 — Upscale da foto principal

Após remover o fundo, use `upscale_image` na imagem resultante para garantir máxima qualidade visual na hero.

### 1.3 — Geração de imagem da urna eletrônica brasileira (para a Hero)

Use `generate_image` com o seguinte prompt:

```
Brazilian electronic voting machine (urna eletrônica) displayed frontally, clean vector art style, dark blue background, the screen shows the number "20456" in bright yellow-green, the machine has glowing buttons, high contrast, campaign poster aesthetic, bold graphic design, no text except the number on screen, ultra sharp, stylized illustration
```

Modelo sugerido: verifique com `models_explore` qual modelo de imagem é mais adequado para ilustração estilizada (estilo vetorial/poster).

### 1.4 — Geração opcional de imagem de fundo para a Hero

Use `generate_image` para criar um fundo atmosférico:

```
Abstract topographic map of the Norte de Minas Gerais region, Brazil, dark navy blue background (#00003F), glowing blue contour lines (#2B62E8), subtle orange (#FF4A00) and yellow-green (#D9E021) accents, minimalist, high-tech political campaign aesthetic, wide panoramic format
```

### 1.5 — Salvar todos os assets gerados

Aguarde os jobs com `jobs_wait`, exiba os resultados com `show_generation_by_ids` e salve os arquivos gerados na pasta `assets/` do projeto.

---

## PASSO 2 — ESTRUTURA DO PROJETO

```
ze-reis-site/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── foto-candidato-sem-fundo.png   (gerado no passo 1.1/1.2)
│   ├── urna-illustration.png           (gerado no passo 1.3)
│   ├── hero-bg.png                    (gerado no passo 1.4, opcional)
│   ├── foto-1.jpg                     (ZÉ REIS/FOTOS/IMG_5364.jpg)
│   ├── foto-2.jpg                     (ZÉ REIS/FOTOS/IMG_5458.jpg)
│   ├── foto-3.jpg                     (ZÉ REIS/FOTOS/IMG_5372.jpg)
│   ├── foto-4.jpg                     (ZÉ REIS/FOTOS/IMG_5483.jpg)
│   ├── foto-5.jpg                     (ZÉ REIS/FOTOS/IMG_5498.jpg)
│   └── foto-6.jpg                     (ZÉ REIS/FOTOS/IMG_5548.jpg)
```

Copie as fotos JPG listadas acima para `assets/`.

---

## PASSO 3 — IDENTIDADE VISUAL (aplicar com rigor total)

### Paleta de cores

```css
:root {
  --azul-principal:  #2B62E8;  /* cor dominante — fundos de seção */
  --azul-claro:      #4775FF;
  --azul-navy:       #00003F;  /* headers, textos escuros */
  --azul-escuro:     #000081;
  --azul-medio:      #0000CC;
  --roxo:            #3711C0;
  --laranja-vivo:    #FF4A00;  /* CTAs principais, destaques */
  --laranja-claro:   #FF9B0D;
  --verde-lima:      #D9E021;  /* número urna, destaques, acento */
  --branco:          #FFFFFF;
  --texto-escuro:    #0A0A2A;
}
```

### Tipografia

- **Títulos/Display**: `Barlow Condensed` (Bold/ExtraBold/Black) — via Google Fonts. Importar via `<link>`.
- **Corpo**: `Inter` ou `DM Sans` (Regular/Medium) — via Google Fonts.
- **Slogan decorativo**: `Bebas Neue` ou `Anton` para o estilo bold da campanha.
- Todos os títulos em `uppercase` onde indicado.

### Logotipo

O logotipo da campanha é tipográfico: **"ZÉ REIS"** em bold branco + **"DEPUTADO ESTADUAL"** em itálico amarelo-lima, com um elemento gráfico (silhueta do Norte de Minas) integrado ao "Z". Como o arquivo-fonte é `.ai` (Adobe Illustrator), recrie o logo como **SVG inline** no HTML, respeitando o visual que aparece na identidade:

```
ZÉ REIS          → Barlow Condensed Black, uppercase, branco
DEPUTADO ESTADUAL → Barlow Condensed Bold Italic, uppercase, #D9E021
```

Há também uma versão alternativa com a flor estilizada (macaúba/planta regional) em azul. Use a versão principal (sem a flor) no header fixo por ser mais limpa em tamanho reduzido.

### Elemento decorativo: ticker

A identidade visual tem um ticker horizontal com blocos coloridos alternados (azul-principal, laranja, verde-lima) contendo: ícone MG, "MINAS", "Trabalho", flor estilizada, "20456". Use isso como **marquee/ticker animado** em alguma seção do site (por exemplo, separando seções ou no rodapé).

---

## PASSO 4 — SEÇÕES DO SITE (seguir estrutura a risca)

### HEADER FIXO (sticky)

```
[Logo SVG: ZÉ REIS / DEPUTADO ESTADUAL]   [Nav: INÍCIO · SOBRE · PROPOSTAS · CONQUISTAS · CONTATO]   [Botão: 20.456 ▶]
```

- Fundo: `#2B62E8` com leve blur/glassmorphism quando scrollado
- Nav com smooth scroll para as âncoras `#inicio`, `#sobre`, `#propostas`, `#conquistas`, `#contato`
- Botão "20.456" em destaque: fundo `#D9E021`, texto `#00003F`, bold — ao clicar rola para `#contato`
- Menu mobile: hamburguer que abre overlay fullscreen na cor `#00003F`
- Indicador de seção ativa no nav (highlight automático com IntersectionObserver)

---

### SEÇÃO 01 — INÍCIO / HERO

**Conceito visual**: Hero dividido em duas colunas em desktop. À esquerda, o copy e a urna interativa. À direita, a foto do candidato recortada (sem fundo), em pose confiante.

**Layout desktop (dois painéis)**:
```
[Painel esquerdo — ~55% largura]          [Painel direito — ~45%]
Fundo: #00003F com partículas/gradiente   Fundo: #2B62E8
                                          Foto candidato sem fundo
TRABALHO                                  (posicionada como se estivesse
que fica                                   emergindo do painel)
─────────────────
Candidato a Deputado Estadual por Minas Gerais

[URNA INTERATIVA — veja abaixo]

[Botão: "Conheça as Propostas" →]
[Botão WhatsApp: "Fale com a gente"]
```

**URNA INTERATIVA — elemento principal da hero**:

Construa uma urna eletrônica brasileira estilizada em CSS/SVG puro (sem imagem, para garantir qualidade e interatividade). A urna deve:

1. Ter o visual de uma urna eletrônica: corpo retangular com teclado numérico (12 botões: 0–9, Corrige, Confirma) e tela acima
2. A **tela começa vazia** ou mostrando um cursor piscando
3. Ao **mouseover ou toque no mobile**, inicia automaticamente uma animação de digitação: os números `2`, `0`, `4`, `5`, `6` vão aparecendo um a um na tela (como se o usuário estivesse digitando)
4. Após digitar todos os 5 dígitos, a tela mostra: **"ZÉ REIS"** + a foto do candidato (miniatura) + botão "CONFIRMA" pulsando em verde
5. Ao clicar em "CONFIRMA", dispara uma animação de confetes/partículas nas cores da campanha (azul, laranja, verde-lima) e um som sutil (beep de urna, opcional com `AudioContext`)
6. O número `20.456` aparece em destaque enorme abaixo/ao lado da urna em `#D9E021`
7. Em mobile, a urna é o elemento central, acima do copy

Código de referência para a estrutura da urna:
```html
<div class="urna-container">
  <div class="urna-tela">
    <div class="urna-display">
      <span class="display-candidato"></span>
      <span class="display-numero"></span>
    </div>
  </div>
  <div class="urna-teclado">
    <!-- botões 1-9, 0, Corrige, Confirma -->
  </div>
</div>
```

Animar com `requestAnimationFrame` e `setTimeout` para a digitação sequencial. Usar `IntersectionObserver` para triggerar quando a seção entrar na viewport.

**Partículas de fundo**: Adicione um canvas de partículas flutuantes atrás do hero (estrelinhas/pontos nas cores da paleta), implementado com JavaScript vanilla, leve e performático.

**Texto da Hero**:
```
[Acima do slogan, pequeno]: Candidato a Deputado Estadual · Minas Gerais

[Slogan principal — tipografia display grande]:
TRABALHO
que fica

[Sub]:
"Do Norte de Minas para toda Minas. 
Um trabalho que o eleitor pode ver, tocar e sentir."

[Número em destaque]:
20.456  PODEMOS

[Dois botões]:
→ "Conheça as Propostas"  (rola para #propostas)
→ WhatsApp: (38) 99851-8582  (abre link wa.me)
```

**Animações de entrada**: Usar `IntersectionObserver` + classes CSS. Copy da esquerda entra deslizando da esquerda; foto entra deslizando da direita; urna faz scale-in.

---

### SEÇÃO 02 — SOBRE

**Subseção A: Quem é Zé Reis**
```
Fundo: branco / #F5F7FF
Layout: texto à esquerda (60%), foto à direita (40%)

Título: QUEM É ZÉ REIS
(acento colorido em #FF4A00 abaixo do título)

Texto:
Zé Reis nasceu em Januária, mas foi criado na roça na comunidade de 
Flexeira, onde a família plantava feijão e arroz e cuidava do gado até 
ele completar nove anos. Filho de Diaquino e Francisca, aprendeu cedo 
o que significa servir: viu o pai abrir estrada, apoiar escola e socorrer 
vizinho sem nunca ter ocupado um cargo público para isso.

Formado em Direito, com mestrado concluído e doutorado em andamento 
pela UFMG/Unimontes, Zé Reis construiu a carreira pública inteira dentro 
do Norte de Minas: foi vereador e prefeito por dois mandatos em Bonito 
de Minas, presidiu a AMAMS, foi deputado estadual e hoje é vice-prefeito 
de Januária. Uma trajetória de quem já ocupou a função e sabe fazer — 
não de quem está começando agora.
```

**Subseção B: Linha do Tempo (Trajetória)**

Implementar uma timeline horizontal (desktop) / vertical (mobile) com os seguintes marcos. Cada item tem um ícone, ano em destaque e descrição curta:

| Ano | Marco |
|---|---|
| 2008 | Início na política — candidato a vereador em Bonito de Minas |
| 2009–2012 | Vereador de Bonito de Minas |
| 2013–2020 | Dois mandatos como Prefeito de Bonito de Minas |
| 2017–2018 | Presidente da AMAMS |
| 2019–2022 | Deputado Estadual de Minas Gerais |
| 2023–2024 | Secretário Municipal de Meio Ambiente de Belo Horizonte |
| 2025 | Mestrado concluído · Doutorado em Sociedade, Ambiente e Território (UFMG/Unimontes) |
| Hoje | Vice-prefeito de Januária · Candidato a Deputado Estadual |

Estilo da timeline: linha central em `#2B62E8`, pontos nos nós em `#FF4A00`, anos em `#D9E021` bold, fundo da seção `#00003F`.

Cada nó da timeline deve ter uma **animação de entrada** quando scrollar (slide + fade com IntersectionObserver).

**Subseção C: Galeria de Fotos**

Grid de fotos em 3 colunas (desktop) / 2 colunas (mobile) / 1 coluna (sm). Usar as fotos da pasta `assets/`. Implementar **lightbox** ao clicar: overlay fullscreen com navegação anterior/próximo. Animação: zoom suave na abertura.

Fotos a usar: foto-1.jpg até foto-6.jpg (das que foram copiadas para assets/).

**Subseção D: Vídeos**

Seção de vídeos incorporados do YouTube/Instagram. Como os links não estão definidos, criar **placeholders visuais** elegantes: cards escuros com ícone play centralizado, texto "Em breve" e um slot para URL em comentário HTML:
```html
<!-- TODO: substituir src pelo link do vídeo -->
<iframe data-src="URL_DO_VIDEO" ...></iframe>
```
Usar lazy loading nos iframes.

**Subseção E: Apoios**

Cards de depoimentos/apoios com avatar placeholder, nome do apoiador, cargo e citação. Usar 3 cards em grid. Adicionar comentário HTML indicando onde substituir o conteúdo:
```html
<!-- APOIO 1: substituir com nome, cargo e texto real -->
```

---

### SEÇÃO 03 — PROPOSTAS

```
Fundo: #2B62E8 (azul principal)
Título da seção: MEUS COMPROMISSOS COM VOCÊ
Sub: em branco, menor
```

6 cards de propostas em grid 3×2 (desktop) / 2×3 (tablet) / 1×6 (mobile). Cada card:
- Ícone SVG temático (criar ícones inline simples e elegantes)
- Título do eixo em bold
- Texto da proposta
- Fundo: `rgba(255,255,255,0.1)` com border `rgba(255,255,255,0.2)` — efeito glassmorphism
- Hover: escala 1.05 + fundo `rgba(255,255,255,0.18)` + sombra suave
- Borda superior colorida por tema (usar variação da paleta)

| Eixo | Ícone | Texto |
|---|---|---|
| 🏥 Saúde | ícone coração/cruz | Levar mais estrutura de saúde para perto de quem precisa, equipamento, atendimento e menos gente tendo que sair da própria cidade pra ser atendida. |
| 🛣️ Infraestrutura e Estradas | ícone estrada | Estrada boa é economia, é saúde, é gente conseguindo ir e vir. Seguir destravando as vias que ligam o Norte de Minas ao resto do estado. |
| 🌾 Agricultura e Geração de Renda | ícone espiga | Apoio técnico, equipamento e crédito pra quem produz: do pequeno agricultor à associação, fortalecendo quem sustenta a economia da região. |
| 🏛️ Municipalismo | ícone prédio | Prefeitura forte é cidade que funciona. Articulação direta com cada município do Norte de Minas, não só com a capital. |
| 🌿 Meio Ambiente e Defesa Animal | ícone folha | Um Norte de Minas que cuida do seu território e de quem não tem voz para pedir isso. |
| 👨‍👩‍👧 Famílias e Juventude | ícone família | Oportunidade para quem quer ficar e crescer na própria terra, sem precisar ir embora para ter sucesso no futuro. |

---

### SEÇÃO 04 — CONQUISTAS

```
Fundo: #F5F7FF (quase branco)
Título: UM POUQUINHO DO QUE A GENTE JÁ FEZ
Cor do título: #00003F
Linha decorativa: #FF4A00
```

**Subseção A: Números de Impacto**

3–4 blocos visuais grandes (contador animado ao entrar na viewport com `CountUp.js` ou implementação manual):

| Ícone | Número | Label |
|---|---|---|
| 🛣️ | R$ 90 Mi | Destinados para pavimentação da MGC-479 |
| 🏥 | R$ 1 Mi | Para o Hospital Municipal de Januária |
| 📅 | 2 | Mandatos como Prefeito de Bonito de Minas |
| 🏛️ | 15+ | Anos de serviço público no Norte de Minas |

Estilo: número grande em `#FF4A00` bold (Barlow Condensed Black), ícone acima, texto abaixo. Fundo de cada bloco: `#00003F`. Grid de 4 colunas. Animação de contagem ao entrar na viewport.

**Subseção B: Cards de Realizações**

Cards com flip animation ou expansão ao hover. Cada card: título da conquista, descrição, valor quando disponível. Cards com borda esquerda colorida em `#2B62E8`.

Conquistas a incluir:

1. **MGC-479 até Bom Jantar** — Pavimentação que liga Januária ao asfalto do Brasil, reduzindo poeira, risco de doença respiratória e tempo de acesso à sede do município. Obra com origem em emenda do mandato de deputado estadual. Valor: ~R$ 90 milhões.

2. **Usina de Oxigênio no Hospital Municipal** — Recurso do Fundo Municipal de Saúde de Januária para enfrentamento da Covid-19. R$ 250 mil + R$ 750 mil, ambos pagos. O investimento levou o hospital a realizar cirurgias eletivas que antes exigiam encaminhamento a outros municípios.

3. **Iluminação para o Brejo do Amparo** — [DADOS PENDENTES — manter placeholder visual com tag comentada `<!-- TODO: preencher dados -->`]

4. **Asfalto até o Bairro Moradeiras** — [DADOS PENDENTES]

5. **Energia Elétrica para a Praia** — [DADOS PENDENTES]

6. **Tomógrafo** — [DADOS PENDENTES]

Grid: 3 colunas desktop, 2 tablet, 1 mobile. Cards com hover lift (box-shadow + translateY).

---

### SEÇÃO 05 — CONTATO / PARTICIPE

```
Fundo: gradiente diagonal de #00003F para #2B62E8
Título: FALE COM A GENTE
Cor do título: branco
```

**Layout dois painéis**:

Esquerda — Formulário de contato:
```
Campos: Nome · E-mail · Telefone · Mensagem
Botão: "Enviar mensagem" (fundo #FF4A00, hover: escurece 10%)
```
O formulário deve ter validação JS básica (campos obrigatórios, formato email). Sem backend por ora — ao submeter, mostrar mensagem de sucesso com animação.

Direita — Calls to action:

```
[Card WhatsApp — fundo verde escuro]
  ícone WhatsApp grande
  "Conversa direta"
  Botão: "Chamar no WhatsApp"
  Link: https://wa.me/5538998518582

[Card Voluntário — fundo #FF4A00]
  ícone pessoa+
  "Quer ajudar a levar essa campanha pra cada canto do Norte de Minas?"
  Botão: "Quero ser voluntário"
  (ao clicar, foca no formulário e preenche campo mensagem com "Quero ser voluntário!")
```

**Redes sociais**:

Linha de ícones das redes (Instagram, Facebook, YouTube, TikTok) em tamanho generoso. Usar SVG inline para os ícones. Links com `href="#"` e comentário `<!-- TODO: substituir com URL real -->`.

---

### RODAPÉ

```
Fundo: #00003F
```

Layout em 3 colunas:
1. Logo (versão branca) + "Trabalho que fica"
2. **20.456 · PODEMOS** em destaque grande (verde-lima)
3. Info legal + redes

Conteúdo:
```
ZÉ REIS · DEPUTADO ESTADUAL
20.456 · PODEMOS

CNPJ da Campanha: [PENDENTE — comentar no HTML]
Material produzido e pago pelo Comitê Financeiro da Campanha de Zé Reis.

© 2026 Zé Reis · Deputado Estadual · Todos os direitos reservados.
```

**Ticker animado** antes do rodapé: linha horizontal com blocos coloridos em movimento contínuo, alternando: [🗺️ MINAS] [Trabalho] [🌿] [20456] — como visto na identidade visual. Implementar com CSS `animation: marquee` e `translateX`.

---

## PASSO 5 — ANIMAÇÕES E INTERAÇÕES (implementar todas)

### Animações de scroll (obrigatório)

Usar `IntersectionObserver` com `threshold: 0.15` para triggerar animações quando elementos entram na viewport:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

Classes CSS:
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
.slide-from-left { transform: translateX(-60px); }
.slide-from-right { transform: translateX(60px); }
```

### Cursor personalizado (opcional mas impactante)

Cursor personalizado nas cores da campanha (círculo azul-principal que segue o mouse com leve delay, expandindo em elementos clicáveis).

### Smooth scroll nativo

```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
  });
});
```

### Progress bar de scroll

Linha no topo da página (abaixo do header ou no próprio header) que cresce de 0% a 100% conforme o usuário scrolla, na cor `#FF4A00`.

### Contador de números (CountUp)

Para a seção Conquistas, implementar animação de contagem:
```javascript
function animateCount(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
```

### Botão flutuante WhatsApp

Botão fixo no canto inferior direito em todas as telas:
```
Ícone WhatsApp circular, fundo verde, com pulso animado
Link: https://wa.me/5538998518582
Tooltip ao hover: "Fale com o Zé Reis"
```

---

## PASSO 6 — RESPONSIVIDADE

Breakpoints:
```css
/* Mobile first */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
```

Prioridades mobile:
- Hero em coluna única: copy acima, urna no centro, foto abaixo (ou ao fundo com opacity)
- Nav vira hamburguer com overlay fullscreen
- Timeline vertical
- Grid de propostas 1 coluna
- Galeria 2 colunas

---

## PASSO 7 — PERFORMANCE E QUALIDADE

- Lazy loading em todas as imagens: `loading="lazy"`
- Fontes do Google Fonts com `display=swap`
- CSS custom properties para toda a paleta (já definidas acima)
- Sem jQuery, sem frameworks — JS vanilla apenas
- Minificar inline onde possível
- Meta tags SEO:
  ```html
  <title>Zé Reis 20.456 · Deputado Estadual · Minas Gerais</title>
  <meta name="description" content="Zé Reis, candidato a Deputado Estadual por Minas Gerais, número 20.456 Podemos. Trabalho que fica. Norte de Minas.">
  <meta property="og:title" content="Zé Reis 20456 · Deputado Estadual MG">
  <meta property="og:image" content="assets/foto-1.jpg">
  ```
- Favicon: quadrado azul `#2B62E8` com "ZR" em branco bold (gerar como SVG)

---

## PASSO 8 — VERIFICAÇÃO FINAL

Após construir o site:

1. Abra `index.html` no browser e faça screenshot de cada seção (use `mcp__computer-use__screenshot` se disponível)
2. Verifique: urna interativa funciona corretamente na hero?
3. Verifique: smooth scroll funciona em todos os links do menu?
4. Verifique: todas as animações de scroll disparam corretamente?
5. Verifique: site funciona em mobile (redimensionar viewport para 375px)?
6. Verifique: botão WhatsApp flutuante está visível e correto?
7. Verifique: assets gerados pelo Higgsfield foram corretamente integrados?

---

## RESUMO RÁPIDO DOS DADOS

| Campo | Valor |
|---|---|
| Candidato | Zé Reis |
| Cargo | Deputado Estadual — Minas Gerais |
| Partido | Podemos |
| Número | 20.456 |
| Slogan | "Trabalho que fica" |
| WhatsApp | (38) 99851-8582 |
| Cor principal | #2B62E8 (azul) |
| Cor destaque | #FF4A00 (laranja) e #D9E021 (verde-lima) |
| Cor escura | #00003F (navy) |
| Tipografia | Barlow Condensed + Inter |
| Região | Norte de Minas Gerais |
| Foto principal | ZÉ REIS/FOTOS/IMG_5364.jpg (polo azul, fundo claro) |
| Foto alternativa | ZÉ REIS/FOTOS/IMG_5458.jpg (camisa social azul, mais formal) |

---

## REFERÊNCIAS VISUAIS A SEGUIR

Sites de campanha modernos usam estas convenções — aplique todas:

- **Hero full-height (100vh)** com foto do candidato em destaque absoluto
- **Seções alternando fundo escuro/claro** para criar ritmo visual
- **CTAs sempre visíveis**: mínimo 2 botões de ação na hero
- **Social proof**: depoimentos, números de conquistas visíveis cedo na página
- **Urgência visual**: o número da urna deve aparecer pelo menos 3 vezes no site (hero, header, rodapé)
- **Mobile-first**: mais de 70% dos acessos serão mobile no contexto brasileiro eleitoral
- **Velocidade**: hero deve carregar em menos de 3s em 4G — use imagens comprimidas
- **Cores com contraste**: sempre respeitar WCAG AA (texto branco sobre azul-principal: ✓)

---

*Prompt gerado com base em análise completa dos arquivos de identidade visual, texto de campanha e estrutura aprovada pelo cliente. Siga à risca — cada detalhe foi pensado.*
