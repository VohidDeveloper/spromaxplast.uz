import { Router }           from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt                from 'bcryptjs'
import jwt                   from 'jsonwebtoken'

import auth from '../middleware/auth.js'
import db   from '../database/db.js'

const router = Router()

const loginBody = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email majburiy')
    .isEmail().withMessage('Email noto\'g\'ri formatda')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Parol majburiy')
    .isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgi bo\'lishi kerak')
]

// ─────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────
router.post('/login', loginBody, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    // Admini DB dan topish (admins jadvali keyinchalik qo'shiladi)
    const { rows } = await db.query(
      'SELECT id, email, password_hash, full_name, role FROM admins WHERE email = $1 LIMIT 1',
      [email]
    )

    // Xavfsizlik: foydalanuvchi mavjud yoki yo'qligini bildirib qo'ymaslik
    const admin        = rows[0]
    const dummyHash    = '$2a$10$abcdefghijklmnopqrstuvwxyz123456789012345678901'
    const hashToCheck  = admin?.password_hash || dummyHash
    const isMatch      = await bcrypt.compare(password, hashToCheck)

    if (!admin || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email yoki parol noto\'g\'ri'
      })
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      admin: {
        id:        admin.id,
        email:     admin.email,
        full_name: admin.full_name,
        role:      admin.role
      }
    })
  } catch (err) {
    next(err)
  }
})

// ─────────────────────────────────────────────────────────
// POST /api/auth/logout
// Stateless JWT da server tomonda logout qilish mumkin emas.
// Frontend token ni localStoragedan o'chiradi.
// Kelajakda token blacklist (Redis) qo'shish mumkin.
// ─────────────────────────────────────────────────────────
router.post('/logout', auth, (_req, res) => {
  res.json({ success: true, message: 'Tizimdan chiqildi' })
})

// ─────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, full_name, role, created_at FROM admins WHERE id = $1 LIMIT 1',
      [req.user.id]
    )

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Admin topilmadi' })
    }

    res.json({ success: true, admin: rows[0] })
  } catch (err) {
    next(err)
  }
})

export default router
