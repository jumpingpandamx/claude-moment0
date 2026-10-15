(function () {
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
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.querySelectorAll('[data-pending]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
