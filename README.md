# S PROMAX PLAST — Korporativ Veb Sayt

PVC dekorativ panel ishlab chiqaruvchi **S PROMAX PLAST** kompaniyasining korporativ veb sayti.

## Texnologiyalar

| Qism | Stack |
|------|-------|
| Frontend | Vue 3, Vite 5, Tailwind CSS v3, Vue Router 4, Pinia 2, vue-i18n |
| Admin panel | Vue 3, Vite 5, Tailwind CSS v3 |
| Backend | Node.js, Express.js, PostgreSQL, JWT, multer |
| Deployment | Docker, Docker Compose, Nginx |

## Loyiha tuzilmasi

```
spromaxplast.uz/
├── frontend/        # Asosiy sayt (Vue 3)
├── admin/           # Admin panel (Vue 3)
├── backend/         # REST API (Express.js)
├── nginx/           # Reverse proxy konfiguratsiya
├── docker-compose.yml
├── .env.example     # Environment o'zgaruvchilar namunasi
└── README.md
```

---

## Production deployment (server)

### Talablar

- Docker 24+
- Docker Compose v2+

### 1. Reponi clone qilish

```bash
git clone https://github.com/VohidDeveloper/spromaxplast.uz.git
cd spromaxplast.uz
```

### 2. Environment sozlash

```bash
cp .env.example .env
nano .env
```

`.env` fayli:

```env
DB_NAME=spromax_db
DB_USER=spromax_user
DB_PASSWORD=kuchli_parol_yozing

JWT_SECRET=kamida_32_belgili_uzun_tasodifiy_kalit

CORS_ORIGIN=https://spromaxplast.uz

PORT=8934
```

### 3. Ishga tushirish

```bash
docker compose up -d --build
```

Shu bitta command bilan hammasi ishga tushadi:
- PostgreSQL (ichki, port 5432)
- Backend API (ichki, port 3000)
- Frontend (ichki, port 80)
- Admin panel (ichki, port 80)
- Nginx (tashqariga ochiq, port 8934)

### Sayt manzillari

| Xizmat | URL |
|--------|-----|
| Asosiy sayt | `http://spromaxplast.uz:8934` |
| Admin panel | `http://spromaxplast.uz:8934/admin/` |
| API | `http://spromaxplast.uz:8934/api/` |

### Foydali Docker commandlar

```bash
# Loglarni ko'rish
docker compose logs -f

# Faqat backend logi
docker compose logs -f backend

# To'xtatish
docker compose down

# Ma'lumotlar bilan birga o'chirish (ehtiyot bo'l!)
docker compose down -v

# Qayta build (kod yangilanganda)
git pull && docker compose up -d --build
```

---

## Local development

### Talablar

- Node.js 18+
- PostgreSQL 14+

### 1. PostgreSQL bazasini yaratish

```bash
createdb spromax_db
psql spromax_db < backend/src/database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # DB va JWT sozlamalarini to'ldiring
npm install
node server.js         # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

### 4. Admin panel

```bash
cd admin
npm install
npm run dev            # http://localhost:5174
```

### Admin kirish

| | |
|--|--|
| Email | `admin@spromax.uz` |
| Parol | `Admin1234!` |

---

## API endpointlar

```
GET  /api/products        — Mahsulotlar ro'yxati
GET  /api/products/:id    — Mahsulot detali
GET  /api/categories      — Kategoriyalar
GET  /api/news            — Yangiliklar
GET  /api/news/:id        — Yangilik detali
GET  /api/certificates    — Sertifikatlar
GET  /api/partners        — Hamkorlar
GET  /api/settings        — Sayt sozlamalari
POST /api/contacts        — Murojaat yuborish
POST /api/auth/login      — Admin login

# JWT token talab qiladiganlar:
POST /api/upload/image    — Rasm yuklash
PUT  /api/settings/:key   — Sozlamani yangilash
GET  /api/contacts        — Murojaatlar (admin)
```

---

## Tillar

Sayt 3 tilda ishlaydi: **O'zbek**, **Русский**, **English**

## Litsenziya

© 2025 S PROMAX PLAST. Barcha huquqlar himoyalangan.
