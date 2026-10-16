(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menú */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');

  /* Menú "Invitaciones" */
  var dd = document.querySelector('.nav__dd');
  if (dd) {
    var ddb = dd.querySelector('.nav__ddbtn');
    ddb.addEventListener('click', function (e) {
      e.stopPropagation();
      ddb.setAttribute('aria-expanded', dd.classList.toggle('open'));
    });
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { dd.classList.remove('open'); ddb.setAttribute('aria-expanded', 'false'); }
    });
  }
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', document.documentElement.lang === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? 'Cerrar menú' : 'Abrir menú'));
  });
  document.querySelectorAll('#nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  function pad(n) { return String(n).padStart(2, '0'); }

  var initSlider = window.initSlider;
  initSlider(document.querySelector('.demos'), document.getElementById('demo-dots'), '.demo',
    function (c) { return c.dataset.label; }, 2);

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
