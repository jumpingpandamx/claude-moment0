/* Eventos para Google Tag Manager (dataLayer): clics en WhatsApp, demo en vivo y comparativa */
(function () {
  var dl = window.dataLayer = window.dataLayer || [];
  var lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  function where(a) {
    if (a.classList.contains('wa-float')) return 'boton_flotante';
    if (a.closest('.nav')) return 'menu';
    if (a.closest('.footer')) return 'footer';
    if (a.closest('.hero')) return 'hero';
    if (a.closest('.cmp-m')) return 'comparativa';
    if (a.closest('.pkg')) return 'paquete';
    if (a.closest('.closing')) return 'cierre';
    var s = a.closest('section[id]');
    return s ? s.id : 'otro';
  }
  function pkg(a) {
    var p = a.closest('.pkg');
    if (p) return p.querySelector('.pkg__name').textContent.trim();
    var t = a.closest('.cmp-m');
    if (t) { var on = t.querySelector('.cmp-m__tabs .is-active'); return on ? on.textContent.trim() : ''; }
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a) {
      var h = a.getAttribute('href');
      if (h.indexOf('wa.me') > -1) {
        dl.push({ event: 'whatsapp_click', click_location: where(a), package_name: pkg(a), page_path: location.pathname, language: lang, link_text: a.textContent.trim().slice(0, 40) });
      } else if (h.indexOf('renata15.com') > -1) {
        dl.push({ event: 'demo_click', demo_name: 'Destello', page_path: location.pathname, language: lang });
      }
    }
    if (e.target.closest && e.target.closest('#compare-btn')) {
      dl.push({ event: 'compare_toggle', page_path: location.pathname, language: lang });
    }
  });
})();
