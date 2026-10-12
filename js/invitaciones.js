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

  /* Paquetes: puntos del slider en móvil */
  var track = document.querySelector('.packages');
  var dots = document.getElementById('pkg-dots');
  var cards = track.querySelectorAll('.pkg');
  cards.forEach(function (card, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ver paquete ' + card.querySelector('.pkg__name').textContent);
    b.addEventListener('click', function () {
      track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    });
    dots.appendChild(b);
  });
  function syncDots() {
    var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
    cards.forEach(function (card, i) {
      var d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    dots.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('is-active', i === best); });
  }
  track.addEventListener('scroll', syncDots, { passive: true });
  window.addEventListener('resize', syncDots);
  syncDots();

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
