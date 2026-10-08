/* Страницы категорий: лайтбокс, шапка, мобильное меню.
   Карточки здесь уже в разметке — рисовать нечего, фильтра нет.
   Отдельный файл, а не catalog.js: тот тянет весь catalog-data.js
   ради фильтра, которого на этих страницах не существует. */
(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    document.querySelectorAll('.lightbox-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImg.src = el.getAttribute('data-full');
        var img = el.querySelector('img');
        lightboxImg.alt = img ? img.alt : 'Просмотр фото';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }

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
    closeLightbox();
    if (menu) setMenu(false);
  });
})();
