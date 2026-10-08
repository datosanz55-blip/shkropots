# ShkrobotS — статический сайт. Сборки нет: кладём готовые файлы в nginx.

FROM nginx:1.27-alpine

# Свой конфиг вместо дефолтного.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf          /etc/nginx/conf.d/default.conf
COPY nginx-security.conf /etc/nginx/snippets/security.conf

# Статика сайта. ВАЖНО: при добавлении файла в корень репозитория
# не забыть добавить его сюда — иначе на проде будет 404,
# а локально в браузере всё работает.
COPY index.html catalog.html 404.html \
     styles.css catalog-data.js catalog.js \
     robots.txt sitemap.xml \
     /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Проверка конфига на этапе сборки: кривой nginx.conf роняет образ здесь,
# а не на проде в крэш-луп после деплоя.
RUN nginx -t

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
