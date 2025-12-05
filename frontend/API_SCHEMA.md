# API Schema для University Catalog

## Модель данных: University

### Описание
Модель представляет информацию об университете в каталоге.

### Поля таблицы

| Поле | Тип | Обязательное | Описание | Пример значения |
|------|-----|-------------|----------|-----------------|
| `id` | `string` (UUID или автоинкремент) | ✅ Да | Уникальный идентификатор университета | `"1"` или `"550e8400-e29b-41d4-a716-446655440000"` |
| `name` | `string` | ✅ Да | Название университета | `"KIMEP University"` |
| `description` | `string` (TEXT) | ✅ Да | Подробное описание университета | `"Ведущий университет Казахстана..."` |
| `city` | `string` | ✅ Да | Город расположения университета | `"Алматы"`, `"Нур-Султан"` |
| `price` | `number` (DECIMAL или INTEGER) | ✅ Да | Стоимость обучения в тенге | `4500000` |
| `minEntScore` | `number` (INTEGER) | ✅ Да | Минимальный проходной балл ЕНТ на грант | `110` (диапазон: 0-140) |
| `hasDormitory` | `boolean` | ✅ Да | Наличие общежития | `true`, `false` |
| `hasMilitaryDept` | `boolean` | ✅ Да | Наличие военной кафедры | `true`, `false` |
| `rating` | `number` (DECIMAL) | ✅ Да | Рейтинг университета (из 5) | `4.8` (диапазон: 0.0-5.0) |
| `hasTour` | `boolean` | ❌ Нет | Наличие виртуального тура | `true`, `false` |
| `tourUrl` | `string` (VARCHAR/TEXT) | ❌ Нет | URL виртуального тура (3D) | `"https://kaznpu.kz/VirtualTour/index_ru.html"` |
| `imageUrl` | `string` (VARCHAR/TEXT) | ❌ Нет | URL изображения университета | `"https://www.kimep.kz/..."` |

### Ограничения и валидация

1. **id**: 
   - Уникальный идентификатор
   - Рекомендуется использовать UUID или автоинкремент

2. **name**: 
   - Не пустая строка
   - Максимальная длина: 255 символов

3. **description**: 
   - Не пустая строка
   - Рекомендуется использовать тип TEXT в БД

4. **city**: 
   - Не пустая строка
   - Максимальная длина: 100 символов

5. **price**: 
   - Положительное число
   - Рекомендуется использовать DECIMAL(12, 2) или BIGINT

6. **minEntScore**: 
   - Целое число от 0 до 140
   - Рекомендуется использовать INTEGER с CHECK constraint

7. **hasDormitory**: 
   - Boolean значение
   - По умолчанию: `false`

8. **hasMilitaryDept**: 
   - Boolean значение
   - По умолчанию: `false`

9. **rating**: 
   - Десятичное число от 0.0 до 5.0
   - Рекомендуется использовать DECIMAL(3, 1) или FLOAT

10. **hasTour**: 
    - Boolean значение
    - По умолчанию: `false`
    - Если `true`, рекомендуется также указать `tourUrl`

11. **tourUrl**: 
    - Валидный URL
    - Максимальная длина: 500 символов
    - Может быть NULL

12. **imageUrl**: 
    - Валидный URL
    - Максимальная длина: 500 символов
    - Может быть NULL

### Пример SQL схемы (PostgreSQL)

```sql
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- или для автоинкремента:
    -- id SERIAL PRIMARY KEY,
    
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    min_ent_score INTEGER NOT NULL CHECK (min_ent_score >= 0 AND min_ent_score <= 140),
    has_dormitory BOOLEAN NOT NULL DEFAULT false,
    has_military_dept BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3, 1) NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    has_tour BOOLEAN DEFAULT false,
    tour_url VARCHAR(500),
    image_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации поиска
CREATE INDEX idx_universities_city ON universities(city);
CREATE INDEX idx_universities_min_ent_score ON universities(min_ent_score);
CREATE INDEX idx_universities_rating ON universities(rating);
```

### Пример SQL схемы (MySQL)

```sql
CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- или для UUID:
    -- id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    min_ent_score INT NOT NULL CHECK (min_ent_score >= 0 AND min_ent_score <= 140),
    has_dormitory BOOLEAN NOT NULL DEFAULT false,
    has_military_dept BOOLEAN NOT NULL DEFAULT false,
    rating DECIMAL(3, 1) NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    has_tour BOOLEAN DEFAULT false,
    tour_url VARCHAR(500),
    image_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Индексы для оптимизации поиска
CREATE INDEX idx_universities_city ON universities(city);
CREATE INDEX idx_universities_min_ent_score ON universities(min_ent_score);
CREATE INDEX idx_universities_rating ON universities(rating);
```

### Пример JSON для API

#### GET /api/universities (список)
```json
{
  "data": [
    {
      "id": "1",
      "name": "KIMEP University",
      "description": "Ведущий университет Казахстана...",
      "city": "Алматы",
      "price": 4500000,
      "minEntScore": 110,
      "hasDormitory": true,
      "hasMilitaryDept": false,
      "rating": 4.8,
      "hasTour": true,
      "tourUrl": "https://kaznpu.kz/VirtualTour/index_ru.html",
      "imageUrl": "https://www.kimep.kz/..."
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 9,
    "total": 20,
    "totalPages": 3
  }
}
```

#### GET /api/universities/:id (один университет)
```json
{
  "id": "1",
  "name": "KIMEP University",
  "description": "Ведущий университет Казахстана...",
  "city": "Алматы",
  "price": 4500000,
  "minEntScore": 110,
  "hasDormitory": true,
  "hasMilitaryDept": false,
  "rating": 4.8,
  "hasTour": true,
  "tourUrl": "https://kaznpu.kz/VirtualTour/index_ru.html",
  "imageUrl": "https://www.kimep.kz/..."
}
```

#### POST /api/universities (создание)
```json
{
  "name": "KIMEP University",
  "description": "Ведущий университет Казахстана...",
  "city": "Алматы",
  "price": 4500000,
  "minEntScore": 110,
  "hasDormitory": true,
  "hasMilitaryDept": false,
  "rating": 4.8,
  "hasTour": true,
  "tourUrl": "https://kaznpu.kz/VirtualTour/index_ru.html",
  "imageUrl": "https://www.kimep.kz/..."
}
```

### Рекомендуемые API endpoints

1. `GET /api/universities` - Получить список университетов с пагинацией и фильтрацией
   - Query params: `page`, `perPage`, `city`, `hasDormitory`, `hasMilitaryDept`, `search`, `minEntScore`
   
2. `GET /api/universities/:id` - Получить один университет по ID

3. `POST /api/universities` - Создать новый университет (требует авторизации)

4. `PUT /api/universities/:id` - Обновить университет (требует авторизации)

5. `DELETE /api/universities/:id` - Удалить университет (требует авторизации)

### Фильтрация и поиск

Поддерживаемые фильтры для `GET /api/universities`:

- `search` (string) - Поиск по названию университета
- `city` (string) - Фильтр по городу
- `hasDormitory` (boolean) - Фильтр по наличию общежития
- `hasMilitaryDept` (boolean) - Фильтр по наличию военной кафедры
- `minEntScore` (number) - Минимальный проходной балл (для сравнения с баллом пользователя)
- `page` (number) - Номер страницы (по умолчанию: 1)
- `perPage` (number) - Количество элементов на странице (по умолчанию: 9)

### Дополнительные поля (опционально)

Можно добавить в будущем:

- `created_at` - Дата создания записи
- `updated_at` - Дата последнего обновления
- `website` - Официальный сайт университета
- `email` - Email для связи
- `phone` - Телефон для связи
- `address` - Полный адрес
- `foundedYear` - Год основания
- `studentCount` - Количество студентов
- `facultyCount` - Количество факультетов

