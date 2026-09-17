/* Логика каталога: фильтр по категориям, отрисовка карточек, лайтбокс.
   Данные берутся из catalog-data.js — этот файл трогать при наполнении не нужно. */
(function () {
  'use strict';

  var filterEl = document.getElementById('catFilter');
  var countEl  = document.getElementById('catCount');
  var listEl   = document.getElementById('catResults');
  if (!filterEl || !listEl) return;

  /* Позиции + заглушки: пока фото не пришли, показываем каркас категории,
     чтобы страница не выглядела пустой. */
  function itemsFor(catId) {
    var real = CATALOG_ITEMS.filter(function (i) { return i.cat === catId; });
    if (real.length) return real;
    var stub = [];
    for (var k = 0; k < CATALOG_PLACEHOLDERS_PER_CATEGORY; k++) stub.push({ cat: catId, name: '', img: null });
    return stub;
  }

  function plural(n, one, few, many) {
    var n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
    return many;
  }

  function buildCard(item, catName) {
    var a = document.createElement('a');
    a.className = 'item';
    a.href = 'index.html#calc';
    if (item.img) {
      a.className += ' lightbox-trigger';
      a.setAttribute('data-full', item.img);
      a.innerHTML =
        '<span class="item-photo"><img src="' + item.img + '" alt="' +
        (item.name || catName) + '" loading="lazy" decoding="async"></span>' +
        '<span class="item-name">' + (item.name || catName) + '</span>';
    } else {
      a.innerHTML =
        '<span class="item-photo is-empty" aria-hidden="true"></span>' +
        '<span class="item-name">' + catName + '</span>';
    }
    return a;
  }

  function render(activeId) {
    var cats = activeId === 'all'
      ? CATALOG_CATEGORIES
      : CATALOG_CATEGORIES.filter(function (c) { return c.id === activeId; });

    var frag = document.createDocumentFragment();
    var shown = 0;

    cats.forEach(function (c) {
      var items = itemsFor(c.id);
      var real = CATALOG_ITEMS.filter(function (i) { return i.cat === c.id; }).length;
      shown += real;

      var group = document.createElement('section');
      group.className = 'cat-group';

      var h = document.createElement('h2');
      h.textContent = c.name;
      if (real) {
        var n = document.createElement('span');
        n.className = 'n';
        n.textContent = real + ' ' + plural(real, 'изделие', 'изделия', 'изделий');
        h.appendChild(n);
      }
      group.appendChild(h);

      var grid = document.createElement('div');
      grid.className = 'item-grid';
      items.forEach(function (i) { grid.appendChild(buildCard(i, c.name)); });
      group.appendChild(grid);
      frag.appendChild(group);
    });

    listEl.innerHTML = '';
    listEl.appendChild(frag);

    var total = CATALOG_ITEMS.length;
    countEl.textContent = activeId === 'all'
      ? (total
          ? 'В каталоге ' + total + ' ' + plural(total, 'изделие', 'изделия', 'изделий') +
            ' в ' + CATALOG_CATEGORIES.length + ' категориях'
          : 'Каталог наполняется — ' + CATALOG_CATEGORIES.length + ' категорий, фото добавляем')
      : (shown
          ? shown + ' ' + plural(shown, 'изделие', 'изделия', 'изделий') + ' в категории'
          : 'В этой категории фото пока добавляем');

    bindLightbox();
  }

  /* Фильтр */
  function buildFilter() {
    var all = [{ id: 'all', name: 'Все' }].concat(CATALOG_CATEGORIES);
    all.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-id', c.id);
      b.setAttribute('aria-pressed', 'false');
      b.textContent = c.name;
      if (c.id !== 'all') {
        var n = CATALOG_ITEMS.filter(function (i) { return i.cat === c.id; }).length;
        if (n) {
          var s = document.createElement('span');
          s.className = 'n';
          s.textContent = n;
          b.appendChild(s);
        }
      }
      b.addEventListener('click', function () { select(c.id, true); });
      filterEl.appendChild(b);
    });
  }

  function select(id, pushHash) {
    filterEl.querySelectorAll('.chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-id') === id));
    });
    render(id);
    if (pushHash) {
      history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* Лайтбокс — те же классы, что на главной */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function bindLightbox() {
    listEl.querySelectorAll('.lightbox-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImg.src = el.getAttribute('data-full');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }
  if (lightbox) {
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }

  /* Мобильное меню и шапка — как на главной */
  var header = document.getElementById('siteHeader');
  document.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', document.documentElement.scrollTop > 20);
  }, { passive: true });

  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeLightbox();
    if (menu) setMenu(false);
  });

  /* Форма — как на главной, бэкенда пока нет */
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = document.getElementById('leadBtn');
      b.textContent = 'Отправлено ✓';
      b.classList.add('sent');
      b.disabled = true;
    });
  }

  /* Старт: категория может прийти адресом catalog.html#beds */
  buildFilter();
  var fromHash = location.hash.replace('#', '');
  var valid = CATALOG_CATEGORIES.some(function (c) { return c.id === fromHash; });
  select(valid ? fromHash : 'all', false);
  window.addEventListener('hashchange', function () {
    var id = location.hash.replace('#', '');
    select(CATALOG_CATEGORIES.some(function (c) { return c.id === id; }) ? id : 'all', false);
  });
})();
