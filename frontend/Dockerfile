# Многоэтапная сборка для оптимизации размера образа

# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей (package.json и package-lock.json)
# Это позволяет Docker кэшировать установку зависимостей
COPY package*.json ./

# Установка зависимостей проекта
RUN npm ci

# Копирование всех исходных файлов проекта
COPY . .

# Переменная окружения для API (можно переопределить при сборке)
# VITE_API_URL должен указывать на URL бэкенда
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL

# Компиляция TypeScript и сборка проекта через Vite
# Команда: tsc -b (проверка типов) && vite build (сборка)
RUN npm run build

# Этап 2: Production образ с nginx для раздачи статики
FROM nginx:alpine

# Копирование собранных файлов из этапа сборки
# dist/ - это директория, куда Vite собирает готовое приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx для SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта 80 для веб-сервера
EXPOSE 80

# Запуск nginx в foreground режиме
CMD ["nginx", "-g", "daemon off;"]

