# ZeroHub

## Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Создайте .env файл с API ключом Groq
# API_KEY=your_groq_api_key_here

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