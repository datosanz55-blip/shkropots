#!/usr/bin/env python3
"""Генерация страниц категорий каталога в catalog/.

ЗАЧЕМ. Каталог — одна страница, категории живут за решёткой
(catalog.html#kitchens). Фрагмент после # поисковик отдельной страницей
не считает, поэтому по запросам вроде «кухни на заказ Челябинск»
заходить было некуда. Эти страницы — посадочные под такие запросы.

ЗАПУСК.  ./build-pages.py          — сгенерировать
         ./build-pages.py --check  — проверить, что файлы совпадают
                                     с данными (для preflight)

Страницы делаются ТОЛЬКО под категории, где хватает позиций: страница
с парой товаров считается «тонкой» и тянет вниз весь сайт.
Тексты правятся в tools/pages_content.py.
"""
import json, pathlib, re, subprocess, sys, html

ROOT = pathlib.Path(__file__).parent
sys.path.insert(0, str(ROOT / 'tools'))
from pages_content import CONTENT

MIN_ITEMS = 4
OUT = ROOT / 'catalog'
DOMAIN = 'https://shkrobots.ru'


def data():
    js = ('const fs=require("fs");'
          '(0,eval)(fs.readFileSync("catalog-data.js","utf8")+'
          '";process.stdout.write(JSON.stringify({c:CATALOG_CATEGORIES,i:CATALOG_ITEMS,'
          'stubs:CATALOG_PLACEHOLDERS_PER_CATEGORY}))")')
    r = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def size(path):
    """Ширина и высота JPEG из заголовка — без Pillow, чтобы preflight
    работал на любой машине с голым Python."""
    b = (ROOT / path).read_bytes()
    k = 2
    while k < len(b):
        if b[k] != 0xFF:
            k += 1
            continue
        m = b[k + 1]
        if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            return int.from_bytes(b[k + 7:k + 9], 'big'), int.from_bytes(b[k + 5:k + 7], 'big')
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7 or m == 0xFF:
            k += 2 if m != 0xFF else 1
            continue
        k += 2 + int.from_bytes(b[k + 2:k + 4], 'big')
    raise ValueError(f'не JPEG или нет SOF: {path}')


def chunk(path, start, end):
    t = (ROOT / path).read_text(encoding='utf-8')
    return t[t.index(start):t.index(end)]


def build(cat, items, siblings):
    c = CONTENT[cat['id']]
    e = html.escape
    n = len(items)
    url = f"{DOMAIN}/catalog/{cat['id']}.html"

    # У старых позиций превью нет — показываем крупное.
    # href обязателен: <a> без него поисковик ссылкой не считает (Lighthouse:
    # «Links are not crawlable»), а без JS фото просто откроется целиком.
    # width/height — чтобы браузер заранее знал пропорции и сетка не прыгала.
    def card(i):
        src = i.get("thumb") or i["img"]
        w, h = size(src)
        return (f'      <a class="item lightbox-trigger" href="/{i["img"]}" data-full="/{i["img"]}">\n'
                f'        <span class="item-photo"><img src="/{src}"'
                f' alt="{e(i["name"])} — ShkrobotS, Челябинск" width="{w}" height="{h}"'
                f' loading="lazy" decoding="async"></span>\n'
                f'        <span class="item-name">{e(i["name"])}</span>\n'
                f'      </a>')
    cards = '\n'.join(card(i) for i in items)

    others = '\n'.join(
        f'        <a href="/catalog/{s["id"]}.html">{e(s["name"])}</a>'
        for s in siblings if s['id'] != cat['id'])

    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Главная", "item": f"{DOMAIN}/"},
            {"@type": "ListItem", "position": 2, "name": "Каталог", "item": f"{DOMAIN}/catalog.html"},
            {"@type": "ListItem", "position": 3, "name": cat['name'], "item": url}]},
        {"@type": "CollectionPage", "name": c['h1'], "description": c['desc'],
         "url": url, "inLanguage": "ru-RU",
         "isPartOf": {"@type": "WebSite", "name": "ShkrobotS Loft Studio", "url": f"{DOMAIN}/"},
         "about": {"@type": "FurnitureStore", "name": "ShkrobotS Loft Studio",
                   "telephone": "+7-922-738-16-42", "areaServed": "Челябинск и Челябинская область",
                   "address": {"@type": "PostalAddress",
                               "streetAddress": "Северная ул., 52Г, офис 302, п. Шершни",
                               "addressLocality": "Челябинск", "postalCode": "454902",
                               "addressCountry": "RU"}},
         "mainEntity": {"@type": "ItemList", "numberOfItems": n, "itemListElement": [
             {"@type": "ListItem", "position": k + 1, "name": it['name'],
              "image": f"{DOMAIN}/{it['img']}"} for k, it in enumerate(items)]}}]}

    head, body = chunk('catalog.html', '<header id="siteHeader">', '</header>') + '</header>', \
                 chunk('catalog.html', '<footer', '</footer>') + '</footer>'
    # ссылки шапки и подвала у вложенной страницы должны быть от корня
    head = re.sub(r'(href|src)="(?!https?:|/|#|tel:|mailto:)', r'\1="/', head)
    body = re.sub(r'(href|src)="(?!https?:|/|#|tel:|mailto:)', r'\1="/', body)

    paras = '\n'.join(f'      <p class="about-text">{e(p)}</p>' for p in c['intro'])

    return f'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(c['title'])}</title>
<meta name="description" content="{e(c['desc'])}">
<meta name="theme-color" content="#15120f">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ShkrobotS Loft Studio">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="{e(c['title'])}">
<meta property="og:description" content="{e(c['desc'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{DOMAIN}/{items[0]['img']}">
<meta property="og:image:alt" content="{e(items[0]['name'])}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
</script>
<link rel="stylesheet" href="/styles.css">
</head>
<body>

<div class="page-bg" aria-hidden="true"></div>

{head}

<nav class="crumbs" aria-label="Хлебные крошки">
  <div class="wrap">
    <a href="/">Главная</a> <span>/</span>
    <a href="/catalog.html">Каталог</a> <span>/</span>
    <span aria-current="page">{e(cat['name'])}</span>
  </div>
</nav>

<main class="cat-page">
  <div class="wrap">
    <div class="cat-intro">
      <h1>{e(c['h1'])}</h1>
{paras}
      <p class="cat-count">В каталоге {n} {plural(n)} этого направления</p>
    </div>

    <div class="item-grid">
{cards}
    </div>

    <div class="cat-cta">
      <h2>Нужно изделие по своим размерам?</h2>
      <p>Позвоните или напишите в МАКС — обсудим размеры, материалы и посчитаем стоимость.</p>
      <div class="foot-actions">
        <a class="btn" href="tel:+79227381642">Позвонить</a>
        <a class="btn light" href="https://web.max.ru/194365828" target="_blank" rel="noopener">Написать в МАКС</a>
      </div>
    </div>

    <div class="cat-others">
      <h2>Другие направления</h2>
      <div class="cat-others-links">
{others}
        <a href="/catalog.html">Весь каталог</a>
      </div>
    </div>
  </div>
</main>

{body}

<a class="fab-call" href="tel:+79227381642" aria-label="Позвонить">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
</a>

<div class="lightbox" id="lightbox">
  <div class="lightbox-close" id="lightboxClose">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>
  </div>
  <img id="lightboxImg" src="" alt="Просмотр фото">
</div>

<script src="/catalog-page.js"></script>
</body>
</html>
'''


def catalog_html(d, by, chosen):
    """Сетка, фильтр и счётчик catalog.html — сразу в разметке.

    Раньше всё это рисовал catalog.js после загрузки catalog-data.js:
    поисковик видел пустую страницу (118 слов), а когда сетка появлялась,
    вёрстка уезжала вниз (CLS 0,58 в Lighthouse). Теперь здесь та же
    разметка, что строит catalog.js для «Все», и скрипт её только оживляет.
    Меняется catalog-data.js — перезапустить ./build-pages.py."""
    e = html.escape
    t = (ROOT / 'catalog.html').read_text(encoding='utf-8')

    chips = ['    <button type="button" class="chip" data-id="all" aria-pressed="true">Все</button>']
    for c in d['c']:
        n = len(by.get(c['id'], []))
        cnt = f'<span class="n">{n}</span>' if n else ''
        chips.append(f'    <button type="button" class="chip" data-id="{c["id"]}"'
                     f' aria-pressed="false">{e(c["name"])}{cnt}</button>')

    groups = []
    for c in d['c']:
        items = by.get(c['id'], [])
        n = len(items)
        cnt = f'<span class="n">{n} {plural(n)}</span>' if n else ''
        if items:
            cards = []
            for i in items:
                src = i.get('thumb') or i['img']
                w, h = size(src)
                name = e(i.get('name') or c['name'])
                cards.append(
                    f'          <a class="item lightbox-trigger" href="{i["img"]}" data-full="{i["img"]}">'
                    f'<span class="item-photo"><img src="{src}" alt="{name} — ShkrobotS, Челябинск"'
                    f' width="{w}" height="{h}" loading="lazy" decoding="async"></span>'
                    f'<span class="item-name">{name}</span></a>')
        else:
            cards = [f'          <a class="item" href="/#calc"><span class="item-photo is-empty"'
                     f' aria-hidden="true"></span><span class="item-name">{e(c["name"])}</span></a>'] * d['stubs']
        groups.append(f'      <section class="cat-group">\n'
                      f'        <h2>{e(c["name"])}{cnt}</h2>\n'
                      f'        <div class="item-grid">\n' + '\n'.join(cards) + '\n'
                      f'        </div>\n      </section>')

    total = len(d['i'])
    count = (f'В каталоге {total} {plural(total)} в {len(d["c"])} категориях' if total
             else f'Каталог наполняется — {len(d["c"])} категорий, фото добавляем')

    def put(t, begin, end, inner):
        i, j = t.index(begin) + len(begin), t.index(end)
        return t[:i] + inner + t[j:]

    t = put(t, '<!-- FILTER:BEGIN -->', '<!-- FILTER:END -->', '\n' + '\n'.join(chips) + '\n  ')
    t = put(t, '<!-- COUNT:BEGIN -->', '<!-- COUNT:END -->', count)
    t = put(t, '<!-- GRID:BEGIN -->', '<!-- GRID:END -->', '\n' + '\n'.join(groups) + '\n    ')

    # Разметка: список ведёт на настоящие страницы категорий, а не на
    # catalog.html#id — адрес с решёткой поисковик отдельной страницей не считает.
    a, b = '<script type="application/ld+json">\n', '\n</script>'
    i = t.index(a) + len(a); j = t.index(b, i)
    ld = json.loads(t[i:j])
    page = next(g for g in ld['@graph'] if g['@type'] == 'CollectionPage')
    page['mainEntity'] = {"@type": "ItemList", "numberOfItems": len(chosen), "itemListElement": [
        {"@type": "ListItem", "position": k + 1, "name": c['name'],
         "url": f"{DOMAIN}/catalog/{c['id']}.html"} for k, c in enumerate(chosen)]}
    return t[:i] + json.dumps(ld, ensure_ascii=False, indent=2) + t[j:]


def plural(n):
    if 11 <= n % 100 <= 14: return 'изделий'
    return {1: 'изделие', 2: 'изделия', 3: 'изделия', 4: 'изделия'}.get(n % 10, 'изделий')


def main():
    check = '--check' in sys.argv
    d = data()
    by = {}
    for it in d['i']:
        by.setdefault(it['cat'], []).append(it)

    chosen = [c for c in d['c'] if len(by.get(c['id'], [])) >= MIN_ITEMS]
    missing = [c['id'] for c in chosen if c['id'] not in CONTENT]
    if missing:
        sys.exit(f'нет текста в tools/pages_content.py для: {missing}')

    OUT.mkdir(exist_ok=True)
    stale, written = [], 0
    for cat in chosen:
        page = build(cat, by[cat['id']], chosen)
        f = OUT / f"{cat['id']}.html"
        if check:
            if not f.exists() or f.read_text(encoding='utf-8') != page:
                stale.append(f.name)
        else:
            f.write_text(page, encoding='utf-8'); written += 1

    cat_page = catalog_html(d, by, chosen)
    cat_file = ROOT / 'catalog.html'
    if check:
        if cat_file.read_text(encoding='utf-8') != cat_page:
            stale.append('catalog.html')
    else:
        cat_file.write_text(cat_page, encoding='utf-8')

    extra = [p.name for p in OUT.glob('*.html')
             if p.stem not in {c['id'] for c in chosen}]
    if check:
        if stale or extra:
            print('страницы разошлись с данными:', ', '.join(stale + extra))
            return 1
        print(f'страницы категорий и catalog.html актуальны ({len(chosen)})')
        return 0

    for p in extra:
        (OUT / p).unlink(); print('удалена лишняя:', p)
    skipped = [f"{c['name']} ({len(by.get(c['id'], []))})"
               for c in d['c'] if c not in chosen]
    print(f'сгенерировано страниц: {written}')
    print(f'пропущено (меньше {MIN_ITEMS} позиций): ' + '; '.join(skipped))
    return 0


if __name__ == '__main__':
    sys.exit(main())
