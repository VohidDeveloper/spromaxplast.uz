import { Router } from 'express'
import { body, param, query } from 'express-validator'

import auth                          from '../middleware/auth.js'
import { upload, handleUploadError } from '../middleware/upload.js'
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js'

const router = Router()

const newsBody = [
  body('title_uz').trim().notEmpty().withMessage('title_uz majburiy'),
  body('title_ru').trim().notEmpty().withMessage('title_ru majburiy'),
  body('title_en').trim().notEmpty().withMessage('title_en majburiy'),
  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published true yoki false bo\'lishi kerak')
]

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/news?is_published=&limit=&offset=
router.get(
  '/',
  [
    query('is_published').optional().isBoolean().withMessage('is_published true yoki false bo\'lishi kerak'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  getNews
)

// GET /api/news/:id
router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  getNewsById
)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// POST /api/news
router.post(
  '/',
  auth,
  upload.single('image'),
  handleUploadError,
  newsBody,
  createNews
)

// PUT /api/news/:id
router.put(
  '/:id',
  auth,
  upload.single('image'),
  handleUploadError,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  newsBody,
  updateNews
)

// DELETE /api/news/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deleteNews
)

export default router
