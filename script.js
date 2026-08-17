/* ════════════════════════════════════════════════════════════
   ZÉ REIS · 20.456 — interações da landing page
   JavaScript vanilla, sem dependências.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $  = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════ 1 · CURSOR PERSONALIZADO ═══════════ */
  (function cursor() {
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fino || semMovimento) return;

    const ponto = $('.cursor-dot');
    const anel  = $('.cursor-ring');
    let x = innerWidth / 2, y = innerHeight / 2, ax = x, ay = y;

    addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      ponto.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }, { passive: true });

    (function loop() {
      ax += (x - ax) * 0.16;
      ay += (y - ay) * 0.16;
      anel.style.transform = `translate(${ax}px, ${ay}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const clicaveis = 'a, button, input, textarea, .galeria-item, .proposta-card, .realizacao-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(clicaveis)) anel.classList.add('ativo');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(clicaveis)) anel.classList.remove('ativo');
    });
  })();

  /* ═══════════ 2 · HEADER + BARRA DE PROGRESSO ═══════════ */
  (function header() {
    const el = $('#header');
    const barra = $('#scrollProgress');

    const atualizar = () => {
      const y = scrollY;
      el.classList.toggle('scrolled', y > 40);
      const total = document.documentElement.scrollHeight - innerHeight;
      barra.style.width = (total > 0 ? (y / total) * 100 : 0) + '%';
    };

    let travado = false;
    addEventListener('scroll', () => {
      if (travado) return;
      travado = true;
      requestAnimationFrame(() => { atualizar(); travado = false; });
    }, { passive: true });
    atualizar();
  })();

  /* ═══════════ 3 · SMOOTH SCROLL + SEÇÃO ATIVA ═══════════ */
  (function navegacao() {
    const alturaHeader = () =>
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 76;

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const alvo = a.getAttribute('href');
        if (alvo === '#') return;
        const destino = document.querySelector(alvo);
        if (!destino) return;
        e.preventDefault();
        fecharMenu();
        const topo = destino.getBoundingClientRect().top + scrollY - alturaHeader() + 1;
        scrollTo({ top: topo, behavior: semMovimento ? 'auto' : 'smooth' });
        history.replaceState(null, '', alvo);
      });
    });

    const links = $$('.nav-link');
    const secoes = ['inicio', 'sobre', 'propostas', 'conquistas', 'contato']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('ativo', l.dataset.nav === en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoes.forEach((s) => obs.observe(s));
  })();

  /* ═══════════ 4 · MENU MOBILE ═══════════ */
  const menu = $('#menuMobile');
  const botaoMenu = $('#hamburguer');

  function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }
  function abrirMenu() {
    menu.classList.add('aberto');
    botaoMenu.setAttribute('aria-expanded', 'true');
    botaoMenu.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  }
  botaoMenu.addEventListener('click', () =>
    menu.classList.contains('aberto') ? fecharMenu() : abrirMenu());
  $('#menuFechar').addEventListener('click', fecharMenu);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

  /* ═══════════ 5 · ANIMAÇÕES DE SCROLL ═══════════ */
  (function animacoes() {
    const alvos = $$('.animate-on-scroll');
    if (semMovimento) { alvos.forEach((el) => el.classList.add('visible')); return; }

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });

    alvos.forEach((el) => obs.observe(el));
  })();

  /* ═══════════ 7 · URNA ELETRÔNICA INTERATIVA ═══════════ */
  (function urna() {
    const NUMERO = '20456';
    const raiz = $('#urna');
    if (!raiz) return;

    const caixas    = $$('.digito', raiz);
    const resultado = $('#urnaResultado');
    const rodape    = $('#urnaRodape');
    const fim       = $('#urnaFim');
    const dica      = $('#urnaDica');
    const confirma  = $('#btnConfirma');
    const teclado   = $('#urnaTeclado');

    let estado = 'ocioso';   // ocioso · digitando · aguardando · confirmado
    let digitos = [];
    let timers = [];
    let audioLiberado = false;
    let ctxAudio = null;

    // som só depois de alguma interação do usuário (política de autoplay)
    ['pointerdown', 'keydown', 'touchstart'].forEach((ev) =>
      addEventListener(ev, () => { audioLiberado = true; }, { once: true, passive: true }));

    function beep(freq, dur, vol) {
      if (!audioLiberado) return;
      try {
        ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
        if (ctxAudio.state === 'suspended') ctxAudio.resume();
        const osc = ctxAudio.createOscillator();
        const gain = ctxAudio.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctxAudio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + dur);
        osc.connect(gain).connect(ctxAudio.destination);
        osc.start();
        osc.stop(ctxAudio.currentTime + dur);
      } catch (_) { /* som é opcional */ }
    }

    function limparTimers() { timers.forEach(clearTimeout); timers = []; }

    function pintarCursor() {
      caixas.forEach((c, i) => c.classList.toggle('cursor', i === digitos.length && estado !== 'confirmado'));
    }

    function reiniciar() {
      limparTimers();
      estado = 'ocioso';
      digitos = [];
      caixas.forEach((c) => { c.textContent = ''; c.classList.remove('preenchido'); });
      resultado.classList.remove('visivel');
      rodape.classList.remove('visivel');
      fim.classList.remove('visivel');
      confirma.classList.remove('pulsando');
      dica.textContent = 'Passe o mouse ou toque para votar';
      dica.style.opacity = '1';
      pintarCursor();
    }

    function piscarTecla(valor) {
      const t = teclado.querySelector(`[data-tecla="${valor}"]`);
      if (!t) return;
      t.classList.add('pressionada');
      setTimeout(() => t.classList.remove('pressionada'), 160);
    }

    function digitar(valor) {
      if (digitos.length >= 5 || estado === 'confirmado') return;
      const i = digitos.length;
      digitos.push(valor);
      caixas[i].textContent = valor;
      caixas[i].classList.add('preenchido');
      piscarTecla(valor);
      beep(1180, 0.07, 0.05);
      pintarCursor();
      if (digitos.length === 5) timers.push(setTimeout(finalizarNumero, 260));
    }

    function finalizarNumero() {
      estado = 'aguardando';
      const acertou = digitos.join('') === NUMERO;
      resultado.classList.toggle('visivel', acertou);
      rodape.classList.add('visivel');
      dica.textContent = acertou
        ? 'Agora aperte CONFIRMA'
        : 'Número inexistente — aperte CORRIGE';
      if (acertou) confirma.classList.add('pulsando');
      pintarCursor();
    }

    function sequenciaAutomatica() {
      if (estado !== 'ocioso') return;
      estado = 'digitando';
      dica.textContent = 'Digitando 20456…';
      NUMERO.split('').forEach((d, i) => {
        timers.push(setTimeout(() => digitar(d), 420 * (i + 1)));
      });
    }

    function confirmar() {
      if (estado !== 'aguardando' || digitos.join('') !== NUMERO) return;
      estado = 'confirmado';
      confirma.classList.remove('pulsando');
      confirma.classList.add('pressionada');
      setTimeout(() => confirma.classList.remove('pressionada'), 180);
      beep(880, 0.16, 0.06);
      setTimeout(() => beep(1320, 0.36, 0.06), 170);
      resultado.classList.remove('visivel');
      rodape.classList.remove('visivel');
      fim.classList.add('visivel');
      dica.textContent = 'Trabalho que fica · 20.456';
      confete();
      timers.push(setTimeout(reiniciar, 5200));
    }

    // ── teclado da urna
    teclado.addEventListener('click', (e) => {
      const tecla = e.target.closest('[data-tecla], [data-acao]');
      if (!tecla) return;

      if (tecla.dataset.acao === 'corrige') { beep(420, 0.12, 0.05); reiniciar(); return; }
      if (tecla.dataset.acao === 'confirma') { confirmar(); return; }
      if (tecla.dataset.acao === 'branco') { beep(620, 0.1, 0.045); return; }

      if (tecla.dataset.tecla) {
        limparTimers();                       // digitação manual cancela a automática
        if (estado === 'ocioso' || estado === 'digitando') {
          estado = 'digitando';
          dica.style.opacity = '1';
          dica.textContent = 'Digite os 5 números';
          digitar(tecla.dataset.tecla);
        }
      }
    });

    // ── gatilhos: entrar na viewport, mouse ou toque
    raiz.addEventListener('mouseenter', sequenciaAutomatica);
    raiz.addEventListener('touchstart', sequenciaAutomatica, { passive: true });

    new IntersectionObserver((entradas, obs) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        setTimeout(sequenciaAutomatica, 900);
      });
    }, { threshold: 0.45 }).observe(raiz);

    pintarCursor();

    /* ── confetes ── */
    function confete() {
      const canvas = $('#confete');
      if (!canvas || semMovimento) return;
      const ctx = canvas.getContext('2d');
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cores = ['#2B62E8', '#FF4A00', '#D9E021', '#FFFFFF', '#4775FF'];
      const pecas = Array.from({ length: 130 }, () => ({
        x: r.width / 2 + (Math.random() - 0.5) * 90,
        y: r.height / 2,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -11 - 3,
        l: Math.random() * 8 + 5,
        e: Math.random() * 4 + 2,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        cor: cores[(Math.random() * cores.length) | 0],
      }));

      const inicio = performance.now();
      (function frame(t) {
        const passado = t - inicio;
        ctx.clearRect(0, 0, r.width, r.height);
        pecas.forEach((p) => {
          p.vy += 0.26;
          p.vx *= 0.992;
          p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - passado / 2600);
          ctx.fillStyle = p.cor;
          ctx.fillRect(-p.l / 2, -p.e / 2, p.l, p.e);
          ctx.restore();
        });
        if (passado < 2600) requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, r.width, r.height);
      })(inicio);
    }
  })();

  /* ═══════════ 8 · CONTADORES ═══════════ */
  (function contadores() {
    function animateCount(el, target, duration) {
      duration = duration || 2000;
      const startTime = performance.now();
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString('pt-BR');
      };
      requestAnimationFrame(update);
    }

    const alvos = $$('.contador');
    if (semMovimento) {
      alvos.forEach((el) => { el.textContent = Number(el.dataset.count).toLocaleString('pt-BR'); });
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        animateCount(en.target, Number(en.target.dataset.count), 1800);
      });
    }, { threshold: 0.4 });
    alvos.forEach((el) => obs.observe(el));
  })();

  /* ═══════════ 9 · GALERIA + LIGHTBOX ═══════════ */
  (function galeria() {
    const itens = $$('.galeria-item');
    const lb = $('#lightbox');
    const img = $('#lbImg');
    const contador = $('#lbContador');
    let atual = 0;
    let ultimoFoco = null;

    // currentSrc reaproveita o WebP já baixado pela miniatura
    const fontes = itens.map((it) => {
      const i = $('img', it);
      return { src: i.currentSrc || i.src, alt: i.getAttribute('alt') };
    });

    function mostrar(i) {
      atual = (i + fontes.length) % fontes.length;
      img.src = fontes[atual].src;
      img.alt = fontes[atual].alt;
      contador.textContent = `${atual + 1} / ${fontes.length}`;
    }
    function abrir(i) {
      ultimoFoco = document.activeElement;
      mostrar(i);
      lb.classList.add('aberto');
      document.body.style.overflow = 'hidden';
      $('#lbFechar').focus();
    }
    function fechar() {
      lb.classList.remove('aberto');
      document.body.style.overflow = '';
      if (ultimoFoco) ultimoFoco.focus();
    }

    itens.forEach((it, i) => it.addEventListener('click', () => abrir(i)));
    $('#lbFechar').addEventListener('click', fechar);
    $('#lbPrev').addEventListener('click', () => mostrar(atual - 1));
    $('#lbNext').addEventListener('click', () => mostrar(atual + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) fechar(); });

    addEventListener('keydown', (e) => {
      if (!lb.classList.contains('aberto')) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  })();

  /* ═══════════ 10 · FORMULÁRIO ═══════════ */
  (function formulario() {
    const form = $('#formContato');
    const sucesso = $('#formSucesso');
    if (!form) return;

    const regras = {
      nome:     (v) => v.trim().length >= 2 || 'Informe seu nome.',
      email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um e-mail válido.',
      telefone: (v) => v.replace(/\D/g, '').length >= 10 || 'Informe um telefone com DDD.',
      mensagem: (v) => v.trim().length >= 10 || 'Escreva uma mensagem com pelo menos 10 caracteres.',
    };

    function validarCampo(nome) {
      const input = form.elements[nome];
      const campo = input.closest('.campo');
      const erro = $(`[data-erro="${nome}"]`, form);
      const r = regras[nome](input.value);
      const ok = r === true;
      campo.classList.toggle('invalido', !ok);
      erro.textContent = ok ? '' : r;
      return ok;
    }

    Object.keys(regras).forEach((nome) => {
      form.elements[nome].addEventListener('blur', () => validarCampo(nome));
      form.elements[nome].addEventListener('input', () => {
        if (form.elements[nome].closest('.campo').classList.contains('invalido')) validarCampo(nome);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const valido = Object.keys(regras).map(validarCampo).every(Boolean);
      if (!valido) {
        const primeiro = $('.campo.invalido input, .campo.invalido textarea', form);
        if (primeiro) primeiro.focus();
        return;
      }
      // TODO: enviar para o endpoint da campanha (fetch/POST).
      sucesso.classList.add('visivel');
      form.reset();
      setTimeout(() => sucesso.classList.remove('visivel'), 6000);
    });

    // CTA "Quero ser voluntário"
    const btn = $('#btnVoluntario');
    if (btn) {
      btn.addEventListener('click', () => {
        const msg = form.elements.mensagem;
        msg.value = 'Quero ser voluntário!';
        const topo = form.getBoundingClientRect().top + scrollY - 110;
        scrollTo({ top: topo, behavior: semMovimento ? 'auto' : 'smooth' });
        setTimeout(() => msg.focus(), semMovimento ? 0 : 450);
      });
    }
  })();

  /* ═══════════ 11 · TICKER ═══════════ */
  (function ticker() {
    const mg = '<svg viewBox="0 0 90 80" aria-hidden="true"><path d="M 27,37.9 L 6.2,41 L 0.3,53.9 L 4.7,51.2 L 14.4,52.9 L 17.3,57.2 L 17.8,54.6 L 28.6,52.9 L 32.4,66.3 L 36.5,66.9 L 34.7,74.5 L 37.8,80 L 63.6,72.6 L 70.6,69 L 74.2,56 L 81,48.6 L 79.5,37.5 L 87.1,34.5 L 84.2,26.8 L 90,17.2 L 78.1,13.8 L 74.3,7.8 L 60.4,5.2 L 56.9,0.2 L 39.9,9.4 L 40.3,5.7 L 36.5,4.2 L 36.5,7.4 L 33.1,7.4 L 34.1,15 L 28.8,20.4 L 31.5,25.2 Z"/></svg>';
    const flor = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11.2a2 2 0 1 1 0 1.6 2 2 0 0 1 0-1.6zM12 2c1.9 0 3.1 1.9 2.5 3.6 1.6-1 3.7-.2 4.2 1.6.5 1.8-1 3.5-2.8 3.4 1.5 1 1.5 3.3 0 4.4 1.8-.1 3.3 1.6 2.8 3.4-.5 1.8-2.6 2.6-4.2 1.6.6 1.7-.6 3.6-2.5 3.6s-3.1-1.9-2.5-3.6c-1.6 1-3.7.2-4.2-1.6-.5-1.8 1-3.5 2.8-3.4-1.5-1.1-1.5-3.4 0-4.4-1.8.1-3.3-1.6-2.8-3.4.5-1.8 2.6-2.6 4.2-1.6C8.9 3.9 10.1 2 12 2z"/></svg>';

    const grupo =
      `<span class="ticker-bloco tb-azul">${mg} Minas</span>` +
      `<span class="ticker-bloco tb-laranja">Trabalho</span>` +
      `<span class="ticker-bloco tb-lima">${flor} que fica</span>` +
      `<span class="ticker-bloco tb-navy">20456</span>`;

    const sequencia = grupo.repeat(6);
    ['#tickerTrilhaHero', '#tickerTrilha', '#tickerTrilha2'].forEach((sel) => {
      const el = $(sel);
      if (el) el.innerHTML = sequencia + sequencia; // duplicado para o loop contínuo
    });
  })();

  /* ═══════════ 12 · VÍDEOS (lazy) ═══════════ */
  (function videos() {
    $$('.video-card').forEach((card) => {
      const iframe = $('iframe', card);
      const src = iframe && iframe.dataset.src;
      if (!src || src === 'URL_DO_VIDEO') return;   // ainda é placeholder
      card.removeAttribute('data-placeholder');
      const ph = $('.video-placeholder', card);
      if (ph) ph.remove();
      new IntersectionObserver((e, obs) => {
        if (!e[0].isIntersecting) return;
        iframe.src = src;
        obs.disconnect();
      }, { rootMargin: '200px' }).observe(card);
    });
  })();

})();
