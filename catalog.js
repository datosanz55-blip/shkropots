/* Логика каталога: фильтр по категориям, отрисовка карточек, лайтбокс.
   Данные берутся из catalog-data.js — этот файл трогать при наполнении не нужно. */
(function () {
  'use strict';

  var filterEl = document.getElementById('catFilter');
  var countEl  = document.getElementById('catCount');
  var listEl   = document.getElementById('catResults');
  if (!filterEl || !listEl) return;

  function plural(n, one, few, many) {
    var n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
    return many;
  }

  function buildCard(item, catName) {
    var a = document.createElement('a');
    a.className = 'item';
    a.href = '/' + item.img;
    a.setAttribute('data-product', '');
    a.dataset.photos = JSON.stringify((item.photos || []).map(function (photo) { return '/' + photo; }));
    if (item.description) a.dataset.description = item.description;

    var photo = document.createElement('span');
    photo.className = 'item-photo';
    var img = document.createElement('img');
    img.src = item.thumb || item.img;
    img.alt = (item.name || catName) + ' — ShkrobotS, Челябинск';
    img.loading = 'lazy';
    img.decoding = 'async';
    photo.appendChild(img);

    var name = document.createElement('span');
    name.className = 'item-name';
    name.textContent = item.name || catName;
    a.append(photo, name);
    return a;
  }

  function render(activeId) {
    var cats = activeId === 'all'
      ? CATALOG_CATEGORIES
      : CATALOG_CATEGORIES.filter(function (c) { return c.id === activeId; });

    var frag = document.createDocumentFragment();
    var shown = 0;

    cats.forEach(function (c) {
      var items = CATALOG_ITEMS.filter(function (i) { return i.cat === c.id; });
      var real = items.length;
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

      if (real) {
        var grid = document.createElement('div');
        grid.className = 'item-grid';
        items.forEach(function (i) { grid.appendChild(buildCard(i, c.name)); });
        group.appendChild(grid);
      } else {
        var empty = document.createElement('p');
        empty.className = 'cat-empty';
        var contact = document.createElement('a');
        contact.href = '#contacts';
        contact.textContent = 'Обсудить проект';
        empty.append('Фото пока добавляем. ', contact);
        group.appendChild(empty);
      }
      frag.appendChild(group);
    });

    listEl.innerHTML = '';
    listEl.appendChild(frag);

    var total = CATALOG_ITEMS.length;
    countEl.textContent = activeId === 'all'
      ? (total
          ? 'В каталоге ' + total + ' ' + plural(total, 'изделие', 'изделия', 'изделий') +
            ' в ' + CATALOG_CATEGORIES.filter(function (c) { return CATALOG_ITEMS.some(function (i) { return i.cat === c.id; }); }).length + ' категориях'
          : 'Каталог наполняется — ' + CATALOG_CATEGORIES.length + ' категорий, фото добавляем')
      : (shown
          ? shown + ' ' + plural(shown, 'изделие', 'изделия', 'изделий') + ' в категории'
          : 'В этой категории фото пока добавляем');

  }

  /* Фильтр */
  function buildFilter() {
    // Кнопки уже в разметке (их собирает build-pages.py) — только оживляем
    var ready = filterEl.querySelectorAll('.chip');
    if (ready.length) {
      ready.forEach(function (b) {
        b.addEventListener('click', function () { select(b.getAttribute('data-id'), true); });
      });
      return;
    }
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

  /* Старт: категория может прийти адресом catalog.html#beds */
  buildFilter();
  var fromHash = location.hash.replace('#', '');
  var valid = CATALOG_CATEGORIES.some(function (c) { return c.id === fromHash; });
  // Вид «Все» уже собран в catalog.html: перерисовка ничего не изменит,
  // только лишняя работа. Рисуем сами, лишь если пришли по адресу категории
  // или разметки почему-то нет.
  if (valid) select(fromHash, false);
  else if (!listEl.querySelector('.cat-group')) select('all', false);
  window.addEventListener('hashchange', function () {
    var id = location.hash.replace('#', '');
    select(CATALOG_CATEGORIES.some(function (c) { return c.id === id; }) ? id : 'all', false);
  });
})();
