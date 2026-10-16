/* Teléfono del hero (home y páginas de evento): cada evento con su propio diseño y su propia función */
(function () {
  var invPhone = document.getElementById('hero-phone');
  if (!invPhone) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BASE = invPhone.dataset.base || '';
  var START = invPhone.dataset.start || 'boda';
  var EN = document.documentElement.lang === 'en';
  function t(es, en) { return EN ? en : es; }
  function pad(n) { return String(n).padStart(2, '0'); }

  /* Mockup del hero: cada evento con su propio diseño y su propia función */
  function cnt(cls) {
    return '<div class="inv__count ' + cls + '" aria-hidden="true">' +
      '<div><b data-u="d">00</b><small>' + t('días', 'days') + '</small></div><div><b data-u="h">00</b><small>' + t('horas', 'hours') + '</small></div>' +
      '<div><b data-u="m">00</b><small>min</small></div><div><b data-u="s">00</b><small>' + t('seg', 'sec') + '</small></div></div>';
  }
  var EVENTS = {
    boda: {
      acc: '#C8A97E', left: [42, 6, 18, 27], ok: function (s) { return EN ? (s.guests === 1 ? '1 spot confirmed! ✓' : s.guests + ' spots confirmed! ✓') : (s.guests === 1 ? '¡1 lugar confirmado! ✓' : '¡' + s.guests + ' lugares confirmados! ✓'); },
      html: function () {
        return '<div class="inv__photo inv__photo--banner"><img src="' + BASE + 'assets/demo/boda.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">' + t('Nos casamos', 'We\'re getting married') + '</p>' +
          '<p class="inv__names">Sofía <span>&amp;</span> Mateo</p><p class="inv__date">' + t('Sábado 14 de marzo · 6:00 pm', 'Saturday, March 14 · 6:00 pm') + '</p>' + cnt('') +
          '<ul class="inv__tl"><li><b>6:00 pm</b> ' + t('Ceremonia', 'Ceremony') + '</li><li><b>8:00 pm</b> ' + t('Recepción', 'Reception') + '</li><li><b>11:00 pm</b> ' + t('Baile', 'Dancing') + '</li></ul>' +
          '<div class="inv__step"><span>' + t('Lugares', 'Guests') + '</span><div><button type="button" data-d="-1" aria-label="' + t('Quitar un lugar', 'Remove a guest') + '">−</button><b id="inv-n">1</b><button type="button" data-d="1" aria-label="' + t('Agregar un lugar', 'Add a guest') + '">+</button></div></div>';
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
      acc: '#D4577A', left: [67, 3, 41, 9], ok: function () { return t('¡Nos vemos en mi fiesta! ✓', 'See you at my party! ✓'); },
      html: function () {
        return '<div class="inv__photo inv__photo--round"><img src="' + BASE + 'assets/demo/xv.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">' + t('Mis XV años', 'My quinceañera') + '</p><p class="inv__names">Valentina</p>' +
          '<p class="inv__date">' + t('Sábado 22 de agosto · 7:00 pm', 'Saturday, August 22 · 7:00 pm') + '</p>' + cnt('inv__count--round') +
          '<div class="inv__song"><p class="inv__h">' + t('Pide tu canción', 'Request your song') + '</p><form class="inv__form"><input type="text" maxlength="26" placeholder="' + t('Escribe una canción…', 'Type a song…') + '" aria-label="' + t('Canción', 'Song') + '" /><button type="submit" aria-label="' + t('Agregar canción', 'Add song') + '"><i class="fa-solid fa-plus"></i></button></form>' +
          '<ul class="inv__songs"><li><i class="fa-solid fa-music"></i> ' + t('Vals de los XV', 'Quinceañera waltz') + '</li></ul></div>';
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
      acc: '#E8643C', left: [23, 11, 5, 52], ok: function () { return t('¡Nos vemos en la fiesta! ✓', 'See you at the party! ✓'); },
      html: function () {
        return '<div class="inv__photo inv__photo--wide"><img src="' + BASE + 'assets/demo/cumple.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">' + t('¡Mi cumple!', 'My birthday!') + '</p>' +
          '<p class="inv__names">Santi <span>5</span></p><p class="inv__date">' + t('Sábado 6 de junio · 4:00 pm', 'Saturday, June 6 · 4:00 pm') + '</p>' + cnt('inv__count--plain') +
          '<p class="inv__h">' + t('Alergias de tu peque', 'Your little one\'s allergies') + '</p><div class="inv__chips inv__chips--multi">' +
          (EN ? ['None', 'Nuts', 'Dairy', 'Gluten'] : ['Ninguna', 'Nueces', 'Lácteos', 'Gluten']).map(function (t) { return '<button type="button" aria-pressed="false">' + t + '</button>'; }).join('') + '</div>';
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
    comunion: {
      acc: '#C8A97E', left: [34, 8, 21, 40], ok: function () { return t('¡Ahí estaremos! ✓', 'We\'ll be there! ✓'); },
      html: function () {
        return '<div class="inv__photo inv__photo--wide"><img src="' + BASE + 'assets/demo/comunion.jpg" alt="" width="380" height="380" decoding="async" /></div><p class="inv__kicker">' + t('Mi primera comunión', 'My First Communion') + '</p>' +
          '<p class="inv__names">Ana Sofía</p><p class="inv__date">' + t('Domingo 17 de mayo · 12:00 pm', 'Sunday, May 17 · 12:00 pm') + '</p>' + cnt('inv__count--plain') +
          '<p class="inv__h">' + t('Misa a las 12:00 pm · comida 2:30 pm', 'Mass at 12:00 pm · lunch at 2:30 pm') + '</p><div class="inv__chips">' +
          (EN ? ['Mass and lunch', 'Lunch only'] : ['La misa y la comida', 'Solo la comida']).map(function (t) { return '<button type="button">' + t + '</button>'; }).join('') +
          '</div><p class="inv__sent" aria-live="polite"></p>';
      },
      bind: function (root) {
        var sent = root.querySelector('.inv__sent');
        root.querySelectorAll('.inv__chips button').forEach(function (b) {
          b.addEventListener('click', function () {
            root.querySelectorAll('.inv__chips button').forEach(function (o) { o.classList.toggle('is-on', o === b); });
            sent.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + t('Anotado: ', 'Noted: ') + b.textContent.toLowerCase();
            sent.classList.remove('pop'); void sent.offsetWidth; sent.classList.add('pop');
          });
        });
      }
    },
    bautizo: {
      acc: '#6F93B5', left: [88, 1, 30, 14], ok: function () { return t('¡Con gusto asistiré! ✓', 'I\'d love to be there! ✓'); },
      html: function () {
        return '<div class="inv__arch" aria-hidden="true"><img src="' + BASE + 'assets/demo/bautizo.jpg" alt="" width="640" height="427" decoding="async" /></div><p class="inv__kicker">' + t('Mi bautizo', 'My baptism') + '</p><p class="inv__names">Emma</p>' +
          '<p class="inv__date">' + t('Domingo 12 de abril · 1:00 pm', 'Sunday, April 12 · 1:00 pm') + '</p>' + cnt('inv__count--plain') +
          '<p class="inv__h">' + t('Deja una bendición', 'Leave a blessing') + '</p><div class="inv__chips">' +
          (EN ? ['God bless you', 'Congratulations', 'With lots of love'] : ['Dios te bendiga', 'Felicidades', 'Con mucho cariño']).map(function (t) { return '<button type="button">' + t + '</button>'; }).join('') +
          '</div><p class="inv__sent" aria-live="polite"></p>';
      },
      bind: function (root) {
        var sent = root.querySelector('.inv__sent');
        root.querySelectorAll('.inv__chips button').forEach(function (b) {
          b.addEventListener('click', function () {
            root.querySelectorAll('.inv__chips button').forEach(function (o) { o.classList.toggle('is-on', o === b); });
            sent.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ' + t('Enviado: ', 'Sent: ') + '“' + b.textContent + '”';
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
    var invEls = {}, invTarget = 0, invLast = {}, state = { guests: 1, ev: START };
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
      invBtn.querySelector('.inv__btn-text').textContent = t('Confirmar asistencia', 'RSVP');
    }
    function applyEvent(key, first) {
      var ev = EVENTS[key];
      state.ev = key; state.guests = 1;
      if (!(first && invBody.dataset.ssr)) invBody.innerHTML = ev.html();
      ev.bind(invBody, state);
      invEls = {}; invLast = {};
      invBody.querySelectorAll('[data-u]').forEach(function (el) { invEls[el.dataset.u] = el; });
      invPhone.style.setProperty('--acc', ev.acc);
      invPhone.dataset.theme = key;
      setTarget(ev.left);
      invTick(true);
      resetConfirm();
    }
    applyEvent(START, true);
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
      invBtn.querySelector('.inv__btn-text').textContent = on ? EVENTS[state.ev].ok(state) : t('Confirmar asistencia', 'RSVP');
      invBtn.setAttribute('aria-pressed', on);
      if (on) (window.dataLayer = window.dataLayer || []).push({ event: 'phone_confirm', event_type: state.ev, page_path: location.pathname, language: EN ? 'en' : 'es' });
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

})();
