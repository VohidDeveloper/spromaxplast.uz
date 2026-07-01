import { Router } from 'express'
import { body, param } from 'express-validator'

import auth from '../middleware/auth.js'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController.js'

const router = Router()

const categoryBody = [
  body('name_uz').trim().notEmpty().withMessage('name_uz majburiy'),
  body('name_ru').trim().notEmpty().withMessage('name_ru majburiy'),
  body('name_en').trim().notEmpty().withMessage('name_en majburiy'),
  body('slug')
    .trim()
    .notEmpty().withMessage('slug majburiy')
    .matches(/^[a-z0-9-]+$/).withMessage('slug faqat kichik harf, raqam va "-" bo\'lishi mumkin')
]

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/categories
router.get('/', getCategories)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// POST /api/categories
router.post('/', auth, categoryBody, createCategory)

// PUT /api/categories/:id
router.put(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  categoryBody,
  updateCategory
)

// DELETE /api/categories/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deleteCategory
)

export default router
