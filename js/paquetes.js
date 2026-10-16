/* Paquetes (home y páginas de evento): slider en móvil, comparativa y tabla */
(function () {
  var EN = document.documentElement.lang === 'en';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Sliders en móvil (paquetes y demos): puntos de navegación */
  window.initSlider = function initSlider(track, dots, itemSel, labelFn, startIndex) {
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
    function (c) { return (EN ? 'View package ' : 'Ver paquete ') + c.querySelector('.pkg__name').textContent; });

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
          (ok ? '<i class="fa-solid fa-check"></i><span class="sr-only">' + (EN ? 'Included' : 'Incluido') + '</span>' : no ? '<span aria-hidden="true">—</span><span class="sr-only">' + (EN ? 'Not included' : 'No incluido') + '</span>' : v) + '</b></li>';
      });
      html += '</ul><a class="btn btn--forest btn--block" target="_blank" rel="noopener noreferrer" href="' + ctas[i] + '">' + (EN ? 'I want this package' : 'Quiero este paquete') + '</a>';
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
    btn.textContent = show ? (EN ? 'Hide comparison' : 'Ocultar comparativa') : (EN ? 'See full comparison' : 'Ver comparativa completa');
    if (show) table.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  });

})();
