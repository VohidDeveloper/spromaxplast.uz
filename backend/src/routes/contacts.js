import { Router } from 'express'
import { body, param, query } from 'express-validator'

import auth from '../middleware/auth.js'
import {
  getContacts,
  createContact,
  markAsRead,
  deleteContact
} from '../controllers/contactsController.js'

const router = Router()

// Kiruvchi forma validation
const contactBody = [
  body('name')
    .trim()
    .notEmpty().withMessage('Ism majburiy')
    .isLength({ min: 2 }).withMessage('Ism kamida 2 ta belgi bo\'lishi kerak'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Telefon majburiy')
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage('Telefon raqam noto\'g\'ri formatda'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Email noto\'g\'ri formatda')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('Xabar majburiy')
    .isLength({ min: 10 }).withMessage('Xabar kamida 10 ta belgi bo\'lishi kerak')
    .isLength({ max: 2000 }).withMessage('Xabar 2000 belgidan oshmasligi kerak'),
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Mavzu 100 belgidan oshmasligi kerak')
]

// ─── PUBLIC ───────────────────────────────────────────────
// POST /api/contacts
router.post('/', contactBody, createContact)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// GET /api/contacts?is_read=&limit=&offset=
router.get(
  '/',
  auth,
  [
    query('is_read').optional().isBoolean().withMessage('is_read true yoki false bo\'lishi kerak'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  getContacts
)

// PUT /api/contacts/:id/read
router.put(
  '/:id/read',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  markAsRead
)

// DELETE /api/contacts/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deleteContact
)

export default router
