# ShkrobotS — лендинг

Одностраничный сайт для ShkrobotS (уличная мебель на заказ, Челябинск).

## Структура

```
index.html            — вся разметка, стили и JS в одном файле
images/
  terrace-pool.jpg    — комплект для террасы, 185 000 ₽
  gazebo-tent.jpg     — комплект для беседки, 250 000 ₽
  terrace-balcony.jpg — уличный комплект на заказ, от 173 000 ₽
Dockerfile            — образ nginx со статикой
nginx.conf            — конфиг nginx (gzip, кеш, security-заголовки)
docker-compose.yml    — вариант запуска через Compose
```

## Локальный запуск

Просто открой `index.html` в браузере — сборка не нужна.

Проверить именно в контейнере (как на проде):

```bash
docker build -t shkropots-web .
docker run --rm -p 8080:80 shkropots-web
# открыть http://localhost:8080
```

Или через Compose:

```bash
docker compose up --build
# открыть http://localhost:8080
```

## Деплой через Dokploy

Сервер (по SSH через Termius) должен иметь установленный Dokploy.

Вариант A — **Application (Dockerfile)** (рекомендуется):

1. В Dokploy создай проект → **Create Service** → **Application**.
2. Source: подключи этот Git-репозиторий и ветку.
3. Build Type: **Dockerfile**, путь — `Dockerfile`.
4. В разделе **Domains** добавь домен, Container Port — `80`, включи HTTPS (Let's Encrypt).
5. **Deploy**. Dokploy соберёт образ по `Dockerfile` и поднимет контейнер за встроенным Traefik.

Вариант B — **Compose**:

1. Create Service → **Compose**, подключи репозиторий.
2. Compose Path — `docker-compose.yml`.
3. Домен вешается на сервис `web`, порт `80`.

## Стек

Чистый HTML/CSS/JS, без зависимостей и фреймворков. Шрифты — Google Fonts
(Manrope, Unbounded) через CDN.

## Что внутри

- Hero-карусель из трёх товарных фото (стрелки, точки, свайп, автоплей)
- Калькулятор примерной стоимости комплекта
- Лайтбокс для просмотра фото
- Scroll-reveal анимации, параллакс на hero
- Форма заявки (сейчас без бэкенда — только визуальный отклик)

## Заметки на будущее

- Форма заявки пока без бэкенда — нужен обработчик (Telegram-бот / почта / CRM).
- Шрифты грузятся с Google Fonts CDN. Если на сервере будут перебои с доступом
  к CDN — стоит перейти на self-hosted шрифты.
- Иконки соцсетей/карт в футере ведут на `#` — заменить на реальные ссылки.
