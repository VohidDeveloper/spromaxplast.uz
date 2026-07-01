-- S PROMAX PLAST — PostgreSQL Database Schema

-- =============================================
-- 1. KATEGORIYALAR
-- =============================================
CREATE TABLE categories (
  id         SERIAL        PRIMARY KEY,
  name_uz    VARCHAR(100)  NOT NULL,
  name_ru    VARCHAR(100)  NOT NULL,
  name_en    VARCHAR(100)  NOT NULL,
  slug       VARCHAR(100)  NOT NULL UNIQUE,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. MAHSULOTLAR
-- =============================================
CREATE TABLE products (
  id             SERIAL        PRIMARY KEY,
  category_id    INTEGER       REFERENCES categories(id) ON DELETE SET NULL,
  name_uz        VARCHAR(200)  NOT NULL,
  name_ru        VARCHAR(200)  NOT NULL,
  name_en        VARCHAR(200)  NOT NULL,
  description_uz TEXT,
  description_ru TEXT,
  description_en TEXT,
  specs          JSONB,
  image_url      VARCHAR(500),
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order     INTEGER       NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);

-- =============================================
-- 3. MUROJAAT FORMALARI
-- =============================================
CREATE TABLE contacts (
  id         SERIAL        PRIMARY KEY,
  name       VARCHAR(150)  NOT NULL,
  phone      VARCHAR(30)   NOT NULL,
  email      VARCHAR(200),
  subject    VARCHAR(100),
  message    TEXT          NOT NULL,
  is_read    BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_is_read    ON contacts(is_read);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- =============================================
-- 4. YANGILIKLAR
-- =============================================
CREATE TABLE news (
  id           SERIAL        PRIMARY KEY,
  title_uz     VARCHAR(300)  NOT NULL,
  title_ru     VARCHAR(300)  NOT NULL,
  title_en     VARCHAR(300)  NOT NULL,
  content_uz   TEXT,
  content_ru   TEXT,
  content_en   TEXT,
  image_url    VARCHAR(500),
  is_published BOOLEAN       NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_is_published ON news(is_published);
CREATE INDEX idx_news_published_at ON news(published_at DESC);

-- =============================================
-- 5. SERTIFIKATLAR
-- =============================================
CREATE TABLE certificates (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  code        VARCHAR(100)  NOT NULL,
  issued_by   VARCHAR(200),
  valid_until DATE,
  file_url    VARCHAR(500),
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================
-- 6. HAMKORLAR
-- =============================================
CREATE TABLE partners (
  id         SERIAL        PRIMARY KEY,
  name       VARCHAR(200)  NOT NULL,
  industry   VARCHAR(200),
  logo_url   VARCHAR(500),
  website    VARCHAR(500),
  is_active  BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order INTEGER       NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partners_is_active ON partners(is_active);

-- =============================================
-- 7. ADMINLAR
-- =============================================
CREATE TABLE admins (
  id            SERIAL        PRIMARY KEY,
  email         VARCHAR(200)  NOT NULL UNIQUE,
  password_hash VARCHAR(100)  NOT NULL,
  full_name     VARCHAR(150),
  role          VARCHAR(50)   NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================
-- BOSHLANG'ICH MA'LUMOTLAR (seed)
-- =============================================
INSERT INTO categories (name_uz, name_ru, name_en, slug) VALUES
  ('Shift panellari',   'Потолочные панели',  'Ceiling Panels', 'ceiling'),
  ('Devoriy panellar',  'Настенные панели',   'Wall Panels',    'wall'),
  ('Eshik qoplamalar',  'Дверные накладки',   'Door Panels',    'door'),
  ('Pol qoplamalar',    'Напольные панели',   'Floor Panels',   'floor');

INSERT INTO certificates (name, code, issued_by, valid_until, is_active) VALUES
  ('ISO 9001',    'ISO 9001:2015',  'ISO',         '2026-12-31', TRUE),
  ('CE Marking',  'EN 15102',       'EU',          '2027-06-30', TRUE),
  ('GOST R',      'GOST 56810-2015','Rosstandart', '2025-12-31', TRUE),
  ('O''z DSt',    'O''Z DST 1240',  'UzStandard',  '2026-09-30', TRUE);

-- =============================================
-- 8. SOZLAMALAR (settings)
-- =============================================
CREATE TABLE settings (
  key        VARCHAR(100) PRIMARY KEY,
  value_uz   TEXT,
  value_ru   TEXT,
  value_en   TEXT,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO settings (key, value_uz, value_ru, value_en) VALUES
  ('hero_title',
   'PVC Dekorativ Panel Ishlab Chiqarish',
   'Производство ПВХ Декоративных Панелей',
   'PVC Decorative Panel Manufacturing'),
  ('hero_subtitle',
   'O''zbekistonda zamonaviy texnologiya bilan sifatli mahsulot',
   'Качественная продукция с современными технологиями в Узбекистане',
   'Quality products with modern technology in Uzbekistan');

-- Default admin (parol: Admin1234!)
-- Haqiqiy bcrypt hash ishga tushirishdan oldin generate qiling:
--   node -e "const b=require('bcryptjs'); b.hash('Admin1234!',10).then(console.log)"
INSERT INTO admins (email, password_hash, full_name, role) VALUES
  ('admin@spromax.uz',
   '$2a$10$D.HNUuUlXWLINOePxSbba.n3HBBLq8v5ilgeyPZLoc.Ndwcv3gz5m',
   'Super Admin',
   'superadmin');
