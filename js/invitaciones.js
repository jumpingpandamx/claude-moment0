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
    function (c) { return c.dataset.label; }, 2);

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

  /* Mockup del hero: cada evento con su propio diseño y su propia función */
  function cnt(cls) {
    return '<div class="inv__count ' + cls + '" aria-hidden="true">' +
      '<div><b data-u="d">00</b><small>días</small></div><div><b data-u="h">00</b><small>horas</small></div>' +
      '<div><b data-u="m">00</b><small>min</small></div><div><b data-u="s">00</b><small>seg</small></div></div>';
  }
  var EVENTS = {
    boda: {
      acc: '#C8A97E', left: [42, 6, 18, 27], ok: function (s) { return s.guests === 1 ? '¡1 lugar confirmado! ✓' : '¡' + s.guests + ' lugares confirmados! ✓'; },
      html: function () {
        return '<div class="inv__photo inv__photo--banner"><img src="assets/demo/boda.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">Nos casamos</p>' +
          '<p class="inv__names">Sofía <span>&amp;</span> Mateo</p><p class="inv__date">Sábado 14 de marzo · 6:00 pm</p>' + cnt('') +
          '<ul class="inv__tl"><li><b>6:00 pm</b> Ceremonia</li><li><b>8:00 pm</b> Recepción</li><li><b>11:00 pm</b> Baile</li></ul>' +
          '<div class="inv__step"><span>Lugares</span><div><button type="button" data-d="-1" aria-label="Quitar un lugar">−</button><b id="inv-n">1</b><button type="button" data-d="1" aria-label="Agregar un lugar">+</button></div></div>';
      },
      bind: function (root, s) {
        var n = root.querySelector('#inv-n');
        root.querySelectorAll('.inv__step button').forEach(function (b) {
          b.addEventListener('click', function () {
            s.guests = Math.min(6, Math.max(1, s.guests + Number(b.dataset.d)));
            n.textContent = s.guests;
            if (invBtn.classList.contains('is-confirmed')) invBtn.querySelector('.inv__btn-text').textContent = EVENTS.boda.ok(s);
          });
        });
      }
    },
    xv: {
      acc: '#D4577A', left: [67, 3, 41, 9], ok: function () { return '¡Nos vemos en mi fiesta! ✓'; },
      html: function () {
        return '<div class="inv__photo inv__photo--round"><img src="assets/demo/xv.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">Mis XV años</p><p class="inv__names">Valentina</p>' +
          '<p class="inv__date">Sábado 22 de agosto · 7:00 pm</p>' + cnt('inv__count--round') +
          '<div class="inv__song"><p class="inv__h">Pide tu canción</p><form class="inv__form"><input type="text" maxlength="26" placeholder="Escribe una canción…" aria-label="Canción" /><button type="submit" aria-label="Agregar canción"><i class="fa-solid fa-plus"></i></button></form>' +
          '<ul class="inv__songs"><li><i class="fa-solid fa-music"></i> Vals de los XV</li></ul></div>';
      },
      bind: function (root) {
        var form = root.querySelector('.inv__form'), list = root.querySelector('.inv__songs');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var inp = form.querySelector('input'), v = inp.value.trim();
          if (!v) return;
          var li = document.createElement('li');
          li.innerHTML = '<i class="fa-solid fa-music"></i> ';
          li.appendChild(document.createTextNode(v));
          li.className = 'is-new';
          list.appendChild(li);
          while (list.children.length > 3) list.removeChild(list.firstChild);
          inp.value = '';
        });
      }
    },
    cumple: {
      acc: '#E8643C', left: [23, 11, 5, 52], ok: function () { return '¡Nos vemos en la fiesta! ✓'; },
      html: function () {
        return '<div class="inv__photo inv__photo--wide"><img src="assets/demo/cumple.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">¡Mi cumple!</p>' +
          '<p class="inv__names">Santi <span>5</span></p><p class="inv__date">Sábado 6 de junio · 4:00 pm</p>' + cnt('inv__count--plain') +
          '<p class="inv__h">Alergias de tu peque</p><div class="inv__chips inv__chips--multi">' +
          ['Ninguna', 'Nueces', 'Lácteos', 'Gluten'].map(function (t) { return '<button type="button" aria-pressed="false">' + t + '</button>'; }).join('') + '</div>';
      },
      bind: function (root) {
        var chips = root.querySelectorAll('.inv__chips button');
        chips.forEach(function (b, i) {
          b.addEventListener('click', function () {
            var on = !b.classList.contains('is-on');
            if (i === 0 && on) chips.forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false'); });
            if (i !== 0 && on) { chips[0].classList.remove('is-on'); chips[0].setAttribute('aria-pressed', 'false'); }
            b.classList.toggle('is-on', on);
            b.setAttribute('aria-pressed', on);
          });
        });
      }
    },
    bautizo: {
      acc: '#6F93B5', left: [88, 1, 30, 14], ok: function () { return '¡Con gusto asistiré! ✓'; },
      html: function () {
        return '<div class="inv__arch" aria-hidden="true"><img src="assets/demo/bautizo.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">Mi bautizo</p><p class="inv__names">Emma</p>' +
          '<p class="inv__date">Domingo 12 de abril · 1:00 pm</p>' + cnt('inv__count--plain') +
          '<p class="inv__h">Deja una bendición</p><div class="inv__chips">' +
          ['Dios te bendiga', 'Felicidades', 'Con mucho cariño'].map(function (t) { return '<button type="button">' + t + '</button>'; }).join('') +
          '</div><p class="inv__sent" aria-live="polite"></p>';
      },
      bind: function (root) {
        var sent = root.querySelector('.inv__sent');
        root.querySelectorAll('.inv__chips button').forEach(function (b) {
          b.addEventListener('click', function () {
            root.querySelectorAll('.inv__chips button').forEach(function (o) { o.classList.toggle('is-on', o === b); });
            sent.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviado: “' + b.textContent + '”';
            sent.classList.remove('pop'); void sent.offsetWidth; sent.classList.add('pop');
          });
        });
      }
    }
  };
  var invBtn = document.getElementById('inv-btn');
  var invBody = document.getElementById('inv-body');
  var invScreen = document.getElementById('inv-screen');
  var invPhone = document.getElementById('hero-phone');
  if (invBody) {
    var invEls = {}, invTarget = 0, invLast = {}, state = { guests: 1, ev: 'boda' };
    function setTarget(l) { invTarget = Date.now() + (l[0] * 86400 + l[1] * 3600 + l[2] * 60 + l[3]) * 1000; }
    function invTick(force) {
      var left = Math.max(0, Math.floor((invTarget - Date.now()) / 1000));
      var v = { d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60 };
      Object.keys(v).forEach(function (k) {
        if (!invEls[k]) return;
        var txt = pad(v[k]);
        if (!force && invLast[k] === txt) return;
        invLast[k] = txt;
        invEls[k].textContent = txt;
        if (!reduce && !force) { invEls[k].classList.remove('tick'); void invEls[k].offsetWidth; invEls[k].classList.add('tick'); }
      });
    }
    function resetConfirm() {
      invBtn.classList.remove('is-confirmed');
      invBtn.setAttribute('aria-pressed', 'false');
      invBtn.querySelector('.inv__btn-text').textContent = 'Confirmar asistencia';
    }
    function applyEvent(key) {
      var ev = EVENTS[key];
      state.ev = key; state.guests = 1;
      invBody.innerHTML = ev.html();
      ev.bind(invBody, state);
      invEls = {}; invLast = {};
      invBody.querySelectorAll('[data-u]').forEach(function (el) { invEls[el.dataset.u] = el; });
      invPhone.style.setProperty('--acc', ev.acc);
      invPhone.dataset.theme = key;
      setTarget(ev.left);
      invTick(true);
      resetConfirm();
    }
    applyEvent('boda');
    setInterval(function () { invTick(false); }, 1000);
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
      invBtn.querySelector('.inv__btn-text').textContent = on ? EVENTS[state.ev].ok(state) : 'Confirmar asistencia';
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
