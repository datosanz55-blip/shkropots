#!/bin/sh
# Предполётная проверка перед деплоем.
#
# Ловит класс ошибок «локально работает, на проде 404»: файл лежит в репозитории,
# разметка на него ссылается, но в образ он не попал — забыли дописать в COPY
# в Dockerfile или отсёк .dockerignore. Локально через file:// всё открывается,
# на проде — пустые места и битые картинки.
#
#   ./preflight.sh
#
# Код возврата: 0 — всё на месте, 1 — есть проблемы.
set -eu
cd "$(dirname "$0")"
FAIL=0
say() { printf '%s\n' "$*"; }
bad() { printf '  ОШИБКА: %s\n' "$*"; FAIL=1; }

PAGES="index.html catalog.html 404.html"
CATPAGES=$(ls catalog/*.html 2>/dev/null || true)
ASSETS="styles.css catalog-data.js catalog.js catalog-page.js robots.txt sitemap.xml"

say "1. Ссылки из разметки и стилей"
REFS=$( { grep -ohE '(href|src)="[^"#:]+"' $PAGES $CATPAGES 2>/dev/null | sed -E 's/.*="//; s/"$//'
          grep -ohE "url\('[^']+'\)" styles.css 2>/dev/null | sed -E "s/url\('//; s/'\)//"
          grep -ohE "'images/[^']+'" catalog.js catalog-data.js 2>/dev/null | tr -d "'"
        } | sort -u )
N=0; MISS=0
for r in $REFS; do
    case "$r" in http*|//*|mailto:*|tel:*|data:*|/) continue ;; esac
    N=$((N+1))
    [ -e "$(printf '%s' "$r" | sed 's|^/||')" ] || { bad "ссылка $r ведёт в никуда"; MISS=$((MISS+1)); }
done
[ "$MISS" -eq 0 ] && say "   проверено $N, все на месте"

say "2. Попадание в Docker-образ"
# Склеиваем переносы строк, берём только COPY, отбрасываем первый токен (COPY),
# последний (путь назначения в образе) и флаги вида --chown.
COPIED=$(awk '
    /^[[:space:]]*#/ { next }
    { line = line $0 }
    /\\[[:space:]]*$/ { sub(/\\[[:space:]]*$/, " ", line); next }
    {
        if (line ~ /^[[:space:]]*COPY[[:space:]]/) {
            n = split(line, t, /[[:space:]]+/)
            for (i = 1; i <= n; i++) {
                if (t[i] == "" || t[i] == "COPY" || i == n) continue
                if (t[i] ~ /^--/) continue
                print t[i]
            }
        }
        line = ""
    }
' Dockerfile)

for f in $PAGES $ASSETS; do
    printf '%s\n' "$COPIED" | grep -qx "$f" || bad "$f не попадает в образ — нет в COPY"
done
for d in images/ fonts/ catalog/; do
    printf '%s\n' "$COPIED" | grep -qx "$d" || bad "$d не попадает в образ — нет в COPY"
done
for f in $COPIED; do
    case "$f" in
        */) [ -d "${f%/}" ] || bad "в COPY указан каталог $f, которого нет в репозитории" ;;
        *)  [ -f "$f" ]     || bad "в COPY указан файл $f, которого нет в репозитории" ;;
    esac
done
[ "$FAIL" -eq 0 ] && say "   все файлы сайта перечислены в COPY"

say "3. .dockerignore"
if [ -f .dockerignore ]; then
    for pat in $(grep -vE '^[[:space:]]*(#|$)' .dockerignore); do
        for f in $PAGES $ASSETS images nginx.conf nginx-security.conf; do
            [ "$pat" = "$f" ] && bad ".dockerignore выбрасывает нужное: $pat"
        done
    done
    say "   нужное не отсекается"
fi

say "4. Под контролем git"
# Самая дорогая ошибка на проде: файл лежит на сервере, но не в репозитории.
# Dokploy при деплое делает git pull/clone — и файл просто исчезает.
# Так теряли Dockerfile: билд падал с "failed to read dockerfile", и его
# пересоздавали руками на сервере, теряя вместе с ним весь конфиг nginx.
if git rev-parse --git-dir >/dev/null 2>&1; then
    UNTRACKED=0
    for f in $PAGES $ASSETS Dockerfile nginx.conf nginx-security.conf .dockerignore; do
        git ls-files --error-unmatch "$f" >/dev/null 2>&1 \
            || { bad "$f есть на диске, но НЕ в git — при деплое исчезнет"; UNTRACKED=$((UNTRACKED+1)); }
    done
    for d in images fonts catalog; do
        git ls-files --error-unmatch "$d" >/dev/null 2>&1 || bad "$d/ не под контролем git"
    done
    [ "$UNTRACKED" -eq 0 ] && say "   все файлы сборки закоммичены"
    # Ранний сигнал: шаблон в .gitignore, накрывающий файлы сборки.
    # Отслеживаемый файл приедет при клоне в любом случае, но новый такой
    # файл уже не добавится — а именно так теряли Dockerfile в прошлый раз.
    for f in Dockerfile nginx.conf nginx-security.conf .dockerignore; do
        git check-ignore -q --no-index "$f" 2>/dev/null \
            && say "   ВНИМАНИЕ: .gitignore накрывает $f — уберите шаблон"
    done
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        say "   ВНИМАНИЕ: есть незакоммиченные правки — Dokploy их не увидит:"
        git status --porcelain | sed 's/^/     /' | head -10
    fi
else
    say "   не git-репозиторий — проверка пропущена"
fi

say "5. Страницы категорий"
# Страницы генерируются из catalog-data.js. Если данные поменяли,
# а ./build-pages.py не запустили — на проде будет старый состав.
if command -v python3 >/dev/null 2>&1; then
    ./build-pages.py --check >/dev/null 2>&1 \
        || { bad "страницы в catalog/ разошлись с данными — запустите ./build-pages.py"; }
    [ "$FAIL" -eq 0 ] && say "   $(ls catalog/*.html 2>/dev/null | wc -l | tr -d ' ') страниц, совпадают с данными"
else
    say "   python3 не найден — проверка пропущена"
fi

say "6. FAQ"
# Видимый текст и разметка FAQPage обязаны совпадать дословно:
# расхождение считается обманом разметки, за это снимают сниппет.
if command -v python3 >/dev/null 2>&1; then
    out=$(./build-faq.py --check 2>&1) || bad "$out"
    [ -n "${out##*разошёл*}" ] && say "   $out"
else
    say "   python3 не найден — проверка пропущена"
fi

say "7. Каталог"
if command -v node >/dev/null 2>&1; then
    node -e '
      const fs = require("fs");
      (0,eval)(fs.readFileSync("catalog-data.js","utf8")+";globalThis.C=CATALOG_CATEGORIES;globalThis.I=CATALOG_ITEMS;");
      const ids = new Set(C.map(c => c.id)); let n = 0;
      for (const it of I) {
        if (!ids.has(it.cat)) { console.log("  ОШИБКА: позиция ссылается на несуществующую категорию " + it.cat); n++; }
        for (const k of ["img","thumb"]) if (it[k] && !fs.existsSync(it[k])) { console.log("  ОШИБКА: нет файла " + it[k]); n++; }
      }
      console.log("   позиций " + I.length + ", категорий " + C.length + (n ? "" : ", битых ссылок нет"));
      process.exit(n ? 1 : 0);
    ' || FAIL=1
else
    say "   node не найден — проверка каталога пропущена"
fi

say "8. Домен"
if grep -q 'shkrobots\.ru' index.html 2>/dev/null; then
    say "   ВНИМАНИЕ: стоит заглушка shkrobots.ru — перед продом ./set-domain.sh <домен>"
else
    say "   заглушки нет"
fi

say ""
if [ "$FAIL" -eq 0 ]; then say "ИТОГ: можно деплоить."; else say "ИТОГ: есть проблемы, деплой остановить."; fi
exit "$FAIL"
