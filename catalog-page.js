/* Карточка изделия, шапка и мобильное меню каталога. */
(function () {
  'use strict';

  var dialog;
  var trigger;
  document.addEventListener('click', function (event) {
    var card = event.target.closest('[data-product]');
    if (!card || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'product-dialog';
      dialog.setAttribute('aria-labelledby', 'product-title');
      if (typeof dialog.showModal !== 'function') return;

      dialog.innerHTML =
        '<form method="dialog" class="product-dialog-close"><button type="submit" aria-label="Закрыть карточку" autofocus>×</button></form>' +
        '<div class="product-detail">' +
          '<div><img class="product-photo" alt=""><div class="product-thumbs" aria-label="Фотографии изделия"></div></div>' +
          '<div><h2 id="product-title"></h2><p class="product-description"></p>' +
          '<a class="btn" href="tel:+79227381642">Обсудить изделие</a></div>' +
        '</div>';
      document.body.appendChild(dialog);
      dialog.addEventListener('close', function () {
        document.body.classList.remove('product-dialog-open');
        if (trigger.isConnected) trigger.focus();
      });
    }
    if (typeof dialog.showModal !== 'function') return;

    event.preventDefault();
    trigger = card;
    var title = card.querySelector('.item-name').textContent;
    var description = dialog.querySelector('.product-description');
    var photo = dialog.querySelector('.product-photo');
    var thumbs = dialog.querySelector('.product-thumbs');
    var photos = [card.href].concat(JSON.parse(card.dataset.photos || '[]'));

    dialog.querySelector('#product-title').textContent = title;
    description.textContent = card.dataset.description || '';
    description.hidden = !description.textContent;
    thumbs.replaceChildren();
    thumbs.hidden = photos.length === 1;

    function showPhoto(index) {
      photo.src = photos[index];
      photo.alt = title + (photos.length > 1 ? ' — фото ' + (index + 1) : '');
      Array.from(thumbs.children).forEach(function (button, i) {
        button.setAttribute('aria-pressed', String(i === index));
      });
    }

    if (photos.length > 1) {
      photos.forEach(function (src, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', 'Показать фото ' + (index + 1));
        var preview = document.createElement('img');
        preview.src = src;
        preview.alt = '';
        button.appendChild(preview);
        button.addEventListener('click', function () { showPhoto(index); });
        thumbs.appendChild(button);
      });
    }
    showPhoto(0);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('product-dialog-open');
  });

  var header = document.getElementById('siteHeader');
  if (header) {
    document.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', document.documentElement.scrollTop > 20);
    }, { passive: true });
  }

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
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (burger && menu && !(dialog && dialog.open)) setMenu(false);
  });
})();
