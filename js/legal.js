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

  /* Teléfono animado de las páginas de evento: cuenta regresiva en vivo y botón que confirma */
  var mini = document.querySelector('.ev-hero .mini');
  if (mini && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cnt = mini.querySelector('.mini__count'), btn = mini.querySelector('.mini__btn');
    var vals = Array.prototype.map.call(cnt.querySelectorAll('b'), function (b) { return parseInt(b.textContent, 10); });
    var end = Date.now() + ((vals[0] * 24 + vals[1]) * 60 + vals[2]) * 60000;
    cnt.innerHTML = '<i><b></b><u>días</u></i><i><b></b><u>hrs</u></i><i><b></b><u>min</u></i><i><b></b><u>seg</u></i>';
    var bs = cnt.querySelectorAll('b'), is = cnt.querySelectorAll('i');
    var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    var last = [];
    var paint = function () {
      var s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      v.forEach(function (x, k) {
        if (last[k] !== x) {
          bs[k].textContent = p2(x);
          if (last[k] !== undefined) { is[k].classList.remove('tick'); void is[k].offsetWidth; is[k].classList.add('tick'); }
          last[k] = x;
        }
      });
    };
    paint(); setInterval(paint, 1000);
    var label = btn.textContent, conf = document.createElement('span');
    conf.className = 'mini__conf'; mini.appendChild(conf);
    var cols = ['#E8643C', '#C8A97E', '#D4577A', '#6F93B5', '#9CAF88'];
    setInterval(function () {
      btn.classList.add('ok'); btn.textContent = '¡Confirmado! ✓';
      for (var k = 0; k < 14; k++) {
        var s = document.createElement('s');
        s.style.left = (30 + Math.random() * 40) + '%';
        s.style.background = cols[k % cols.length];
        s.style.setProperty('--x', (Math.random() * 90 - 45) + 'px');
        s.style.animationDelay = (Math.random() * .15) + 's';
        conf.appendChild(s);
      }
      setTimeout(function () { btn.classList.remove('ok'); btn.textContent = label; conf.innerHTML = ''; }, 2200);
    }, 6000);
  }
})();
