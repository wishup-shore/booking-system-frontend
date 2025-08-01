# Итеративный план разработки системы букинга

## Архитектурные решения

**Стек:** FastAPI + Streamlit + SQLAlchemy + Alembic

- **Backend:** FastAPI (REST API)
- **Frontend:** Streamlit (административный интерфейс)
- **Database:** SQLAlchemy ORM + PostgreSQL
- **Migrations:** Alembic
- **Authentication:** FastAPI security с JWT

## Итерация 1: Основа системы (2-3 недели)

### 1.1 Базовая архитектура

```bash
# Структура проекта
booking_system/
├── app/
│   ├── models/
│   ├── schemas/
│   ├── api/
│   ├── core/
│   ├── services/
│   └── streamlit_pages/
├── alembic/
├── requirements.txt
└── docker-compose.yml
```

### 1.2 Базовые модели данных

```python
# models/accommodation.py
class AccommodationType(Base):
    id: int
    name: str                # "Палатка", "Домик", "Шелтер", "Коттедж"
    description: str
    default_capacity: int    # Дефолтная вместимость
    is_active: bool
    created_at: DateTime

class Accommodation(Base):
    id: int
    number: str              # Номер палатки/домика
    type_id: int             # FK на AccommodationType
    capacity: int            # Может отличаться от дефолтной
    status: AccommodationStatus
    condition: AccommodationCondition
    comments: Text
    created_at: DateTime

class AccommodationStatus(Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"
    OUT_OF_ORDER = "out_of_order"

class AccommodationCondition(Enum):
    OK = "ok"
    MINOR_ISSUE = "minor"
    CRITICAL = "critical"
```

### 1.3 Система пользователей

```python
# models/user.py
class UserRole(Enum):
    STAFF = "staff"          # Полный доступ
    VIEWER = "viewer"        # Только чтение

class User(Base):
    id: int
    username: str
    email: str
    role: UserRole
    is_active: bool
```

### 1.4 Базовое API

```python
# Endpoints для первой итерации
POST   /api/accommodation-types/    # Создание типа размещения
GET    /api/accommodation-types/    # Список типов
PUT    /api/accommodation-types/{id}# Обновление типа
POST   /api/accommodations/         # Создание размещения
GET    /api/accommodations/         # Список размещений
PUT    /api/accommodations/{id}     # Обновление
DELETE /api/accommodations/{id}     # Удаление
POST   /api/auth/login             # Авторизация
```

### 1.5 Простой Streamlit интерфейс

- Страница входа
- Управление типами размещений (создание новых типов)
- Список размещений с возможностью CRUD
- Базовая навигация

## Итерация 2: Клиентская база

### 2.1 Модель клиентов

```python
# models/client.py
class Client(Base):
    id: int
    first_name: str
    last_name: str
    phone: str
    email: str
    social_links: JSON        # Ссылки на соцсети
    car_numbers: JSON         # Номера машин
    photo_url: str
    rating: Float            # Оценка клиента
    comments: Text
    created_at: DateTime

class ClientGroup(Base):
    id: int
    name: str               # Название группы (семья)
    clients: relationship   # Связь с клиентами
```

### 2.2 API для клиентов

```python
# Endpoints
GET    /api/clients/           # Список клиентов
POST   /api/clients/           # Создание клиента
PUT    /api/clients/{id}       # Обновление
GET    /api/clients/{id}/stats # Статистика по клиенту
POST   /api/client-groups/     # Создание группы
```

### 2.3 Интерфейс управления клиентами

- Страница списка клиентов с поиском и фильтрами
- Форма создания/редактирования клиента
- Загрузка фото клиентов
- Управление группами клиентов
- Статистика по посещениям

## Итерация 3: Система бронирования

### 3.1 Модели бронирования

```python
# models/booking.py
class BookingStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"

class PaymentStatus(Enum):
    NOT_PAID = "not_paid"
    PARTIAL = "partial"
    PAID = "paid"

class Booking(Base):
    id: int
    client_id: int
    accommodation_id: int
    check_in_date: Date              # Nullable для открытых дат
    check_out_date: Date             # Nullable для открытых дат
    is_open_dates: bool              # Флаг открытых дат
    actual_check_in: DateTime        # Фактический чекин
    actual_check_out: DateTime       # Фактический чекаут
    guests_count: int
    status: BookingStatus
    payment_status: PaymentStatus
    total_amount: Decimal
    paid_amount: Decimal
    comments: Text
    created_at: DateTime
```

### 3.2 Простая система цен

```python
# models/pricing.py
class Accommodation(Base):
    # ... другие поля
    price_per_night: Decimal     # Простая фиксированная цена за ночь
```

### 3.3 API бронирования

```python
# Endpoints
POST   /api/bookings/              # Создание бронирования
POST   /api/bookings/open-dates    # Создание бронирования с открытыми датами
GET    /api/bookings/              # Список бронирований
GET    /api/bookings/open          # Список открытых бронирований
PUT    /api/bookings/{id}          # Обновление
PUT    /api/bookings/{id}/set-dates# Установка дат для открытого бронирования
POST   /api/bookings/{id}/checkin  # Чекин
POST   /api/bookings/{id}/checkout # Чекаут
GET    /api/bookings/calendar      # Календарь занятости
POST   /api/bookings/{id}/payment  # Простое добавление суммы к оплате
```

### 3.4 Интерфейс бронирования

- Календарь с визуализацией занятости
- Форма создания бронирования (с опцией "Открытые даты")
- Отдельный список открытых бронирований для планирования
- Возможность установки дат для открытых бронирований
- Управление статусами и платежами
- Страница деталей бронирования

## Итерация 4: Инвентарь и кастомные позиции

### 4.1 Система инвентаря

```python
# models/inventory.py
class InventoryType(Base):
    id: int
    name: str                        # "Спальник", "Коремат", etc
    is_active: bool
    created_at: DateTime

class InventoryItem(Base):
    id: int
    number: str                      # Номер спальника
    type_id: int                     # FK на InventoryType
    condition: InventoryCondition
    comments: Text
    created_at: DateTime

class InventoryCondition(Enum):
    OK = "ok"
    MINOR_ISSUE = "minor"
    CRITICAL = "critical"

# Связь инвентаря с бронированием (конструктор при создании)
class BookingInventory(Base):
    id: int
    booking_id: int
    inventory_item_id: int
    created_at: DateTime
```

### 4.2 Кастомные позиции (facilities)

```python
# models/custom_item.py
class CustomItem(Base):
    id: int
    name: str                        # "Баня", "Мангал", "Экскурсия"
    description: Text
    price: Decimal
    is_active: bool

class BookingCustomItem(Base):
    booking_id: int
    custom_item_id: int
    quantity: int
    price_at_booking: Decimal
```

### 4.3 Конструктор бронирования

- При создании/редактировании бронирования добавление инвентаря (спальники, корематы)
- Добавление кастомных позиций с количеством
- Поле комментариев для изначальных запросов клиента
- Автоматический пересчет общей суммы

## Итерация 5: Базовая статистика клиентов

### 5.1 Простая статистика клиентов

```python
# services/client_stats.py
class ClientStatsService:
    def get_client_visits_count(self, client_id: int) -> int:
        # Количество посещений
        pass

    def get_client_bookings_history(self, client_id: int):
        # История бронирований
        pass
```

### 5.2 Интерфейс статистики

- Просмотр истории бронирований клиента
- Количество визитов и общая потраченная сумма
- Комментарии и рейтинг клиента

## Техническая реализация

### Структура баз данных

```sql
-- Основные таблицы
accommodation_types, accommodations, clients, client_groups, bookings
inventory_types, inventory_items, booking_inventory
custom_items, booking_custom_items, users
```

### FastAPI структура

```python
# app/main.py - основное приложение
# app/api/v1/ - версионирование API
# app/models/ - SQLAlchemy модели
# app/schemas/ - Pydantic схемы
# app/services/ - бизнес логика
# app/core/ - конфигурация, безопасность
```

### Streamlit архитектура

```python
# streamlit_pages/01_Dashboard.py - главная страница
# streamlit_pages/02_Accommodations.py - управление размещениями
# streamlit_pages/03_Clients.py - клиентская база
# streamlit_pages/04_Bookings.py - бронирования
# streamlit_pages/05_Inventory.py - инвентарь
# components/ - переиспользуемые компоненты
```

## План развертывания

### Development

```bash
# Запуск локально
docker-compose up -d postgres
uvicorn app.main:app --reload &
streamlit run app/streamlit_pages/01_Dashboard.py
```

### Production

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://...
  frontend:
    build: ./frontend
    depends_on:
      - backend
  nginx:
    image: nginx
    ports:
      - '80:80'
```

## Критерии готовности по итерациям

**Итерация 1:** Можно создавать типы размещений и управлять объектами
**Итерация 2:** Ведется полноценная клиентская база  
**Итерация 3:** Работает система бронирования с календарем и простыми платежами
**Итерация 4:** Есть конструктор бронирования с инвентарем и кастомными позициями
**Итерация 5:** Базовая статистика по клиентам

## Технические риски и решения

1. **Конфликты бронирования** - блокировки на уровне БД
2. **Производительность** - индексы, пагинация календаря
3. **Backup данных** - автоматические резервные копии
4. **Мониторинг** - логирование критичных операций

Каждая итерация заканчивается работающим MVP с возможностью тестирования в боевых условиях.
