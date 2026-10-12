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

  /* Hero: la cuenta baja hasta 00:00:00:00 y aparece el logo */
  var stage = document.getElementById('hero-stage');
  var units = {};
  stage.querySelectorAll('[data-unit]').forEach(function (el) { units[el.dataset.unit] = el; });
  function pad(n) { return String(n).padStart(2, '0'); }
  function render(total) {
    units.d.textContent = pad(Math.floor(total / 86400));
    units.h.textContent = pad(Math.floor(total % 86400 / 3600));
    units.m.textContent = pad(Math.floor(total % 3600 / 60));
    units.s.textContent = pad(Math.floor(total % 60));
  }
  if (reduce) {
    render(0);
    stage.classList.add('is-done');
  } else {
    var START = 45 * 86400 + 6 * 3600 + 18 * 60 + 27; // 45:06:18:27
    var DURATION = 3600; // ms
    var t0 = null;
    render(START);
    (function tick(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / DURATION, 1);
      var eased = 1 - Math.pow(p, 2.2);
      render(Math.round(START * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(function () { stage.classList.add('is-done'); }, 350);
    })(performance.now());
  }

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

  /* Mockup "Nos casamos": cuenta regresiva en vivo y botón de confirmar */
  var invCount = document.getElementById('inv-count');
  if (invCount) {
    var invEls = {};
    invCount.querySelectorAll('[data-u]').forEach(function (el) { invEls[el.dataset.u] = el; });
    var invTarget = Date.now() + ((42 * 86400) + (6 * 3600) + (18 * 60) + 27) * 1000;
    var invLast = {};
    function invTick() {
      var left = Math.max(0, Math.floor((invTarget - Date.now()) / 1000));
      var v = { d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60 };
      Object.keys(v).forEach(function (k) {
        var txt = pad(v[k]);
        if (invLast[k] === txt) return;
        invLast[k] = txt;
        invEls[k].textContent = txt;
        if (!reduce) { invEls[k].classList.remove('tick'); void invEls[k].offsetWidth; invEls[k].classList.add('tick'); }
      });
    }
    invTick();
    setInterval(invTick, 1000);
  }
  var invBtn = document.getElementById('inv-btn');
  if (invBtn) {
    invBtn.addEventListener('click', function () {
      var on = invBtn.classList.toggle('is-confirmed');
      invBtn.querySelector('.inv__btn-text').textContent = on ? '¡Asistencia confirmada! ✓' : 'Confirmar asistencia';
      invBtn.setAttribute('aria-pressed', on);
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
