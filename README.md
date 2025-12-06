# ZeroHub

## Backend

```bash
cd backend

# Активируйте виртуальное окружение
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Установите зависимости (если нужно)
pip install -r requirements.txt

# Создайте .env файл с API ключом Groq (опционально)
# API_KEY=your_groq_api_key_here

# Запустите сервер
uvicorn main:app --reload
```

Сервер: http://127.0.0.1:8000  
Документация: http://127.0.0.1:8000/docs

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение: http://localhost:5173
