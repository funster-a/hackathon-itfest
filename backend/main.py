from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import universities

app = FastAPI()

# Настройка CORS
# Разрешаем запросы от фронтенда (локально и в Docker)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",   # Docker frontend
        "http://127.0.0.1:5173",
        "http://frontend:80",      # Docker internal network
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(universities.router, prefix="/api")




