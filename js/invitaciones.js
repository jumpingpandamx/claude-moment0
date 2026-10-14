(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menú */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.querySelectorAll('#nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  function pad(n) { return String(n).padStart(2, '0'); }

  /* Sliders en móvil (paquetes y demos): puntos de navegación */
  function initSlider(track, dots, itemSel, labelFn, startIndex) {
    var cards = track.querySelectorAll(itemSel);
    function centerOn(card, smooth) {
      track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    }
    cards.forEach(function (card) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', labelFn(card));
      b.addEventListener('click', function () { centerOn(card, true); });
      dots.appendChild(b);
    });
    function sync() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      cards.forEach(function (card, i) {
        var d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (d < bd) { bd = d; best = i; }
      });
      dots.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('is-active', i === best); });
    }
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { sync(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', sync);
    if (startIndex && window.matchMedia('(max-width: 820px)').matches) centerOn(cards[startIndex], false);
    sync();
  }
  initSlider(document.querySelector('.packages'), document.getElementById('pkg-dots'), '.pkg',
    function (c) { return 'Ver paquete ' + c.querySelector('.pkg__name').textContent; });
  initSlider(document.querySelector('.demos'), document.getElementById('demo-dots'), '.demo',
    function (c) { return 'Ver demo ' + c.querySelector('.demo__link b').textContent; }, 2);

  /* Comparativa en móvil: un paquete a la vez, armado desde la misma tabla */
  (function () {
    var table = document.querySelector('#compare table');
    if (!table) return;
    var names = [].map.call(table.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); }).slice(1);
    var rows = [].map.call(table.querySelectorAll('tbody tr'), function (tr) {
      return {
        price: tr.classList.contains('row-price'),
        label: tr.querySelector('th').textContent.trim(),
        vals: [].map.call(tr.querySelectorAll('td'), function (td) { return td.textContent.trim(); })
      };
    });
    var ctas = [].map.call(document.querySelectorAll('.pkg .btn'), function (a) { return a.href; });
    var wrap = document.createElement('div');
    wrap.className = 'cmp-m';
    var tabs = document.createElement('div');
    tabs.className = 'cmp-m__tabs';
    tabs.setAttribute('role', 'tablist');
    var panel = document.createElement('div');
    panel.className = 'cmp-m__panel';
    panel.setAttribute('role', 'tabpanel');
    function show(i) {
      tabs.querySelectorAll('button').forEach(function (b, k) {
        b.setAttribute('aria-selected', k === i);
        b.classList.toggle('is-active', k === i);
      });
      var priceRow = rows.filter(function (r) { return r.price; })[0];
      var html = '<p class="cmp-m__price">' + priceRow.vals[i] + '</p><ul>';
      rows.forEach(function (r) {
        if (r.price) return;
        var v = r.vals[i], no = v === '—', ok = v === '✓';
        html += '<li class="' + (no ? 'is-no' : '') + '"><span>' + r.label + '</span><b>' +
          (ok ? '<i class="fa-solid fa-check"></i><span class="sr-only">Incluido</span>' : no ? '<span aria-hidden="true">—</span><span class="sr-only">No incluido</span>' : v) + '</b></li>';
      });
      html += '</ul><a class="btn btn--forest btn--block" target="_blank" rel="noopener noreferrer" href="' + ctas[i] + '">Quiero este paquete</a>';
      panel.innerHTML = html;
    }
    names.forEach(function (n, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.textContent = n;
      b.addEventListener('click', function () { show(i); });
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(panel);
    document.getElementById('compare').appendChild(wrap);
    show(0);
  })();

  /* Comparativa de paquetes */
  var btn = document.getElementById('compare-btn');
  var table = document.getElementById('compare');
  btn.addEventListener('click', function () {
    var show = table.hidden;
    table.hidden = !show;
    btn.setAttribute('aria-expanded', show);
    btn.textContent = show ? 'Ocultar comparativa' : 'Ver comparativa completa';
    if (show) table.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  });

  /* Mockup del hero: cuenta regresiva en vivo, selector de evento y confirmación */
  var EVENTS = {
    boda:    { kicker: 'Nos casamos',    names: 'Sofía <span>&amp;</span> Mateo', date: 'Sábado 14 de marzo · 6:00 pm',   acc: '#C8A97E', left: [42, 6, 18, 27] },
    xv:      { kicker: 'Mis XV años',    names: 'Valentina',                       date: 'Sábado 22 de agosto · 7:00 pm', acc: '#D4577A', left: [67, 3, 41, 9] },
    cumple:  { kicker: 'Celebramos',     names: 'Diego <span>30</span>',           date: 'Viernes 5 de junio · 8:00 pm',  acc: '#9CAF88', left: [23, 11, 5, 52] },
    bautizo: { kicker: 'Mi bautizo',     names: 'Emma',                            date: 'Domingo 12 de abril · 1:00 pm', acc: '#8FA9C4', left: [88, 1, 30, 14] }
  };
  var invCount = document.getElementById('inv-count');
  var invBtn = document.getElementById('inv-btn');
  var invBody = document.getElementById('inv-body');
  var invScreen = document.getElementById('inv-screen');
  var invPhone = document.getElementById('hero-phone');
  if (invCount) {
    var invEls = {};
    invCount.querySelectorAll('[data-u]').forEach(function (el) { invEls[el.dataset.u] = el; });
    var invTarget = 0, invLast = {};
    function setTarget(l) { invTarget = Date.now() + (l[0] * 86400 + l[1] * 3600 + l[2] * 60 + l[3]) * 1000; }
    function invTick(force) {
      var left = Math.max(0, Math.floor((invTarget - Date.now()) / 1000));
      var v = { d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60 };
      Object.keys(v).forEach(function (k) {
        var txt = pad(v[k]);
        if (!force && invLast[k] === txt) return;
        invLast[k] = txt;
        invEls[k].textContent = txt;
        if (!reduce && !force) { invEls[k].classList.remove('tick'); void invEls[k].offsetWidth; invEls[k].classList.add('tick'); }
      });
    }
    setTarget(EVENTS.boda.left);
    invTick(true);
    setInterval(function () { invTick(false); }, 1000);

    function resetConfirm() {
      invBtn.classList.remove('is-confirmed');
      invBtn.setAttribute('aria-pressed', 'false');
      invBtn.querySelector('.inv__btn-text').textContent = 'Confirmar asistencia';
    }
    function applyEvent(key) {
      var ev = EVENTS[key];
      document.getElementById('inv-kicker').textContent = ev.kicker;
      document.getElementById('inv-names').innerHTML = ev.names;
      document.getElementById('inv-date').textContent = ev.date;
      invPhone.style.setProperty('--acc', ev.acc);
      setTarget(ev.left);
      invTick(true);
      resetConfirm();
    }
    document.querySelectorAll('#evsw button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('is-active')) return;
        document.querySelectorAll('#evsw button').forEach(function (o) {
          var on = o === b;
          o.classList.toggle('is-active', on);
          o.setAttribute('aria-pressed', on);
        });
        if (reduce) { applyEvent(b.dataset.ev); return; }
        invBody.classList.add('is-swap');
        setTimeout(function () { applyEvent(b.dataset.ev); invBody.classList.remove('is-swap'); }, 220);
      });
    });
  }
  if (invBtn) {
    invBtn.addEventListener('click', function () {
      var on = invBtn.classList.toggle('is-confirmed');
      invBtn.querySelector('.inv__btn-text').textContent = on ? '¡Asistencia confirmada! ✓' : 'Confirmar asistencia';
      invBtn.setAttribute('aria-pressed', on);
      if (on && !reduce) {
        var colors = ['#9CAF88', '#C8A97E', '#2F3A33', getComputedStyle(invPhone).getPropertyValue('--acc').trim() || '#C8A97E'];
        for (var i = 0; i < 18; i++) {
          var p = document.createElement('span');
          p.className = 'confetti';
          p.style.background = colors[i % colors.length];
          p.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
          p.style.setProperty('--y', -(80 + Math.random() * 170) + 'px');
          p.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
          p.style.animationDelay = (Math.random() * 0.1) + 's';
          invScreen.appendChild(p);
          setTimeout(function (el) { el.remove(); }.bind(null, p), 1400);
        }
      }
    });
  }

  /* Demos y legales pendientes: no navegan */
  document.querySelectorAll('.demo__link.is-soon, [data-pending]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* Aparición al hacer scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
