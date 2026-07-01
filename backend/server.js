import 'dotenv/config'
import express from 'express'
import helmet  from 'helmet'
import cors    from 'cors'
import path    from 'path'
import { fileURLToPath } from 'url'

import db from './src/database/db.js'

import productsRouter     from './src/routes/products.js'
import categoriesRouter   from './src/routes/categories.js'
import contactsRouter     from './src/routes/contacts.js'
import newsRouter         from './src/routes/news.js'
import certificatesRouter from './src/routes/certificates.js'
import partnersRouter     from './src/routes/partners.js'
import authRouter         from './src/routes/auth.js'
import settingsRouter     from './src/routes/settings.js'
import uploadRouter      from './src/routes/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app       = express()
const PORT      = process.env.PORT || 3000

// ===== MIDDLEWARELAR =====
app.use(helmet())

app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ===== STATIC FAYLLAR (yuklangan rasmlar) =====
// Cross-Origin-Resource-Policy: cross-origin — helmet blokini ochadi
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads')))

// ===== HEALTH CHECK =====
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ===== ROUTES =====
app.use('/api/products',     productsRouter)
app.use('/api/categories',   categoriesRouter)
app.use('/api/contacts',     contactsRouter)
app.use('/api/news',         newsRouter)
app.use('/api/certificates', certificatesRouter)
app.use('/api/partners',     partnersRouter)
app.use('/api/auth',         authRouter)
app.use('/api/settings',     settingsRouter)
app.use('/api/upload',       uploadRouter)

// ===== 404 HANDLER =====
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route topilmadi' })
})

// ===== GLOBAL ERROR HANDLER =====
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Server xatosi' : err.message
  })
})

// ===== ISHGA TUSHIRISH =====
async function start() {
  try {
    await db.testConnection()
    console.log('✅ PostgreSQL ulanish muvaffaqiyatli')
  } catch (err) {
    console.error('❌ PostgreSQL ulanishda xato:', err.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`)
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`)
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`)
  })
}

start()
