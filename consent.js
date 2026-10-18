/* Уведомление о cookie и Яндекс Метрика — только с согласия.

   Почему не «вставить код счётчика в <head>», как советует Метрика:
   Метрика ставит cookie и собирает IP, а это персональные данные. По 152-ФЗ
   на их обработку нужно согласие — конкретное и сознательное. «Продолжая
   пользоваться сайтом, вы соглашаетесь» таким не считается. Поэтому счётчик
   не загружается вообще, пока посетитель не нажал «Принять».
   Цена: Метрика видит только тех, кто согласился, — посещаемость в ней
   будет ниже реальной. Это нормально и одинаково для всех сайтов,
   которые делают это по закону.

   Выбор хранится в localStorage (не в cookie): версия текста, ответ и дата.
   Согласие живёт год — так написано в consent.html. Поменялся текст
   документов — поднимите VERSION, и сайт спросит всех заново. */
(function () {
  'use strict';

  var METRIKA_ID = 113665910;
  var VERSION = '2026-10-18';
  var KEY = 'cookie-consent';
  var YEAR = 365 * 24 * 3600 * 1000;
  var memory = null;  // если localStorage недоступен (приватный режим и т. п.)

  function read() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = memory; }
    try {
      var c = JSON.parse(raw);
      if (c && c.v === VERSION && Date.now() - c.at < YEAR) return c.choice;
    } catch (e) { /* битая запись — спросим заново */ }
    return null;
  }

  function save(choice) {
    var raw = JSON.stringify({ v: VERSION, choice: choice, at: Date.now() });
    memory = raw;
    try { localStorage.setItem(KEY, raw); } catch (e) { /* остаётся в памяти до перехода */ }
  }

  var loaded = false;
  function loadMetrika() {
    if (loaded || !METRIKA_ID) return;
    loaded = true;
    /* Код Яндекса без изменений, кроме одного: убран <noscript>-пиксель —
       он срабатывал бы без согласия у посетителей без JavaScript. */
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');
    window.ym(METRIKA_ID, 'init', {
      ssr: true, webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true
    });
  }

  /* Отзыв согласия: Метрику из уже открытой страницы не выгрузить, поэтому
     стираем её cookie и перезагружаем страницу — после этого её нет. */
  function forgetMetrika() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ym') !== 0) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  var banner = null;
  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookieTitle');
    banner.setAttribute('aria-describedby', 'cookieText');
    banner.innerHTML =
      '<div class="cookie-body">' +
        '<p class="cookie-title" id="cookieTitle">Cookie и статистика</p>' +
        '<p class="cookie-text" id="cookieText">Хотим понимать, какие изделия и разделы вам интересны, ' +
        'чтобы делать сайт удобнее. Для этого нужна Яндекс Метрика — она использует cookie. ' +
        'Включим её, только если вы согласны. Сайт работает одинаково при любом ответе.</p>' +
        '<p class="cookie-links"><a href="/consent.html">Текст согласия</a>' +
        '<a href="/privacy.html">Политика обработки данных</a></p>' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="btn" data-choice="all">Принять</button>' +
        '<button type="button" class="btn light" data-choice="necessary">Отказаться</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-choice]');
      if (!b) return;
      var before = read();
      var choice = b.getAttribute('data-choice');
      save(choice);
      hide();
      if (choice === 'all') loadMetrika();
      else if (loaded || before === 'all') { forgetMetrika(); location.reload(); }
    });
    document.body.appendChild(banner);
  }

  function show() {
    if (!banner) build();
    banner.hidden = false;
    // кадр на отрисовку, затем класс — иначе не будет плавного появления
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function hide() {
    if (!banner) return;
    banner.classList.remove('is-open');
    banner.hidden = true;
  }

  function init() {
    var choice = read();
    if (choice === 'all') loadMetrika();
    else if (choice === null) show();
    document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
      b.addEventListener('click', function () {
        show();
        var first = banner.querySelector('[data-choice]');
        if (first) first.focus();
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
