# Руководство по развертыванию Frontend (`tarih-client`)

Архитектура:

- **Фронтенд (`tarih-client`)**: Next.js в Docker на `127.0.0.1:3000` (домен `yourdomain.com`)
- **Nginx на хосте**: проксирует запросы с домена `yourdomain.com` в локальный контейнер и отдает статику

_(Конфигурация бэкенда хранится отдельно в репозитории `tarih-api`)._

---

## 1. Первичная настройка сервера (если сервер новый)

Подключитесь к серверу по SSH:

```bash
# 1.1 Обновление системы
sudo apt update && sudo apt upgrade -y

# 1.2 Установка Docker и Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 1.3 Установка Nginx и Certbot
sudo apt install -y nginx certbot python3-certbot-nginx git
```

_(После добавления пользователя в группу docker перезайдите в SSH-сессию)._

---

## 2. Развертывание фронтенда

Склонируйте репозиторий на сервер (например, в `~/tarih-client`):

```bash
cd ~/tarih-client

# Настройте боевые переменные в .env:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1

# Запуск контейнера в фоне
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 3. Настройка Nginx для фронтенда

```bash
# 3.1 Копируем конфиг фронтенда
sudo cp ~/tarih-client/deploy/nginx/client.conf /etc/nginx/sites-available/client.conf

# 3.2 Указываем ваш домен
sudo nano /etc/nginx/sites-available/client.conf
# (замените yourdomain.com на реальный домен фронтенда)

# 3.3 Активируем конфиг
sudo ln -s /etc/nginx/sites-available/client.conf /etc/nginx/sites-enabled/

# 3.4 Удаляем дефолтный сайт (если еще не удален)
sudo rm -f /etc/nginx/sites-enabled/default

# 3.5 Проверяем синтаксис и перезагружаем Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Выпуск SSL-сертификата (HTTPS)

Убедитесь, что DNS-запись вашего домена указывает на IP сервера, затем выполните:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot автоматически настроит HTTPS и автопродление.

---

## 5. Обновление фронтенда при новых релизах

```bash
cd ~/tarih-client
git pull
docker compose -f docker-compose.prod.yml up -d --build
```
