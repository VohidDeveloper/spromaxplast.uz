# S PROMAX PLAST — Korporativ Veb Sayt

PVC dekorativ panel ishlab chiqaruvchi **S PROMAX PLAST** kompaniyasining korporativ veb sayti.

## Texnologiyalar

| Qism | Stack |
|------|-------|
| Frontend | Vue 3, Vite 5, Tailwind CSS v3, Vue Router 4, Pinia 2, vue-i18n |
| Admin panel | Vue 3, Vite 5, Tailwind CSS v3 |
| Backend | Node.js, Express.js, PostgreSQL, JWT, multer |

## Loyiha tuzilmasi

```
site/
├── frontend/   # Asosiy sayt (port 5173)
├── admin/      # Admin panel (port 5174)
└── backend/    # REST API (port 3000)
```

---

## Local ishga tushirish

### Talablar

- Node.js 18+
- PostgreSQL 14+
- npm

### 1. PostgreSQL bazasini yaratish

```bash
createdb spromax_db
psql spromax_db < backend/src/database/schema.sql
```

### 2. Backend sozlash

```bash
cd backend
cp .env.example .env
# .env faylini to'ldiring:
# DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET
npm install
node server.js
```

Backend `http://localhost:3000` da ishga tushadi.

### 3. Frontend ishga tushirish

```bash
cd frontend
npm install
npm run dev
```

Sayt `http://localhost:5173` da ochiladi.

### 4. Admin panel ishga tushirish

```bash
cd admin
npm install
npm run dev
```

Admin panel `http://localhost:5174` da ochiladi.

### Admin kirish ma'lumotlari

| | |
|--|--|
| Email | `admin@spromax.uz` |
| Parol | `Admin1234!` |

---

## API Endpointlar

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

# Auth talab qiladigan endpointlar (Bearer token):
POST /api/upload/image    — Rasm yuklash
PUT  /api/settings/:key   — Sozlamani yangilash
GET  /api/contacts        — Murojaatlar ro'yxati
```

---

## Deployment

### 1. Build qilish

```bash
# Frontend
cd frontend && npm run build
# Natija: frontend/dist/

# Admin
cd admin && npm run build
# Natija: admin/dist/
```

### 2. Nginx konfiguratsiya

```nginx
# /etc/nginx/sites-available/spromax

server {
    listen 80;
    server_name spromax.uz www.spromax.uz;

    # Asosiy sayt
    root /var/www/spromax/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Admin panel
    location /admin {
        alias /var/www/spromax/admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Yuklangan fayllar
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

### 3. Backend production rejimda

```bash
cd backend
NODE_ENV=production node server.js

# Yoki PM2 bilan:
npm install -g pm2
pm2 start server.js --name spromax-backend
pm2 save
pm2 startup
```

### 4. .env production sozlamalari

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=spromax_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_very_long_secret_key
JWT_EXPIRES_IN=24h

CORS_ORIGIN=https://spromax.uz,https://www.spromax.uz
UPLOAD_PATH=uploads
```

---

## Tillar

Sayt 3 tilda ishlaydi: **O'zbek**, **Русский**, **English**

## Litsenziya

© 2025 S PROMAX PLAST. Barcha huquqlar himoyalangan.
