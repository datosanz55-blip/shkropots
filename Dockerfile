# ShkrobotS — статический лендинг уличной мебели.
# Сборка не требуется: копируем готовые файлы в nginx-образ.

FROM nginx:1.27-alpine

# Своя конфигурация nginx (gzip, кеширование статики, security-заголовки).
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Статика сайта.
COPY index.html /usr/share/nginx/html/index.html
COPY images/ /usr/share/nginx/html/images/

EXPOSE 80

# Проверка живости для Dokploy / оркестратора.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
