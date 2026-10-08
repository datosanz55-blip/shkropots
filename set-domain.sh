#!/bin/sh
# Замена домена во всех файлах разом.
#
# Домен прописан в 11 местах: canonical и Open Graph на двух страницах,
# JSON-LD, robots.txt, sitemap.xml. Править руками — гарантированно
# где-нибудь забыть, а забытый canonical уводит поисковик на чужой адрес.
#
#   ./set-domain.sh shkrobots.ru
#   ./set-domain.sh www.example.com
#
# Запускать из корня репозитория. Идемпотентно: можно гонять повторно.
set -eu

NEW="${1:-}"
if [ -z "$NEW" ]; then
    echo "Укажите домен без схемы, например: ./set-domain.sh shkrobots.ru" >&2
    exit 1
fi
NEW=$(printf '%s' "$NEW" | sed -e 's|^https\?://||' -e 's|/$||')

FILES="index.html catalog.html robots.txt sitemap.xml"
OLD=$(grep -ohm1 'https://[a-z0-9.-]\+/' $FILES | head -1 | sed -e 's|^https://||' -e 's|/$||')

if [ -z "$OLD" ]; then
    echo "Текущий домен в файлах не найден — нечего менять." >&2
    exit 1
fi
if [ "$OLD" = "$NEW" ]; then
    echo "Домен уже $NEW, менять нечего."
    exit 0
fi

for f in $FILES; do
    sed -i.bak "s|https://$OLD|https://$NEW|g" "$f" && rm -f "$f.bak"
done

echo "Домен: $OLD -> $NEW"
echo "Вхождений осталось от старого: $(grep -c "$OLD" $FILES 2>/dev/null | awk -F: '{s+=$2} END{print s+0}')"
echo "Проверьте и закоммитьте: git diff --stat"
