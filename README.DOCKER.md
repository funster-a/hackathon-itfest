# Docker инструкции

## Быстрый старт

### Запуск всех сервисов:
```bash
docker-compose up -d
```

### Остановка:
```bash
docker-compose down
```

### Пересборка после изменений:
```bash
docker-compose up -d --build
```

## Доступ к сервисам

- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:8000
- **API документация**: http://localhost:8000/docs

## Структура

### Backend
- **Dockerfile**: `backend/dockerfile`
- **Порт**: 8000
- **База данных**: SQLite (монтируется как volume)

### Frontend
- **Dockerfile**: `frontend/Dockerfile`
- **Порт**: 3000 (nginx на 80 внутри контейнера)
- **Сборка**: Vite + TypeScript
- **Статика**: Nginx

## Переменные окружения

### Frontend
- `VITE_API_URL` - URL бэкенда (устанавливается при сборке через ARG)

### Backend
- `PYTHONUNBUFFERED=1` - для корректного вывода логов

## Production

Для production окружения:

1. Измените `VITE_API_URL` в `docker-compose.yml` на реальный URL бэкенда
2. Настройте CORS в `backend/main.py` для вашего домена
3. Используйте переменные окружения для секретов (API ключи и т.д.)

## Логи

Просмотр логов:
```bash
docker-compose logs -f
```

Логи конкретного сервиса:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

