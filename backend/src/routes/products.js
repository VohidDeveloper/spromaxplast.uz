import { Router } from 'express'
import { body, query, param } from 'express-validator'

import auth                       from '../middleware/auth.js'
import { upload, handleUploadError } from '../middleware/upload.js'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productsController.js'

const router = Router()

// Validation qoidalari
const productBody = [
  body('name_uz').trim().notEmpty().withMessage('name_uz majburiy'),
  body('name_ru').trim().notEmpty().withMessage('name_ru majburiy'),
  body('name_en').trim().notEmpty().withMessage('name_en majburiy'),
  body('category_id').optional().isInt({ min: 1 }).withMessage('category_id musbat son bo\'lishi kerak')
]

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/products?category=&search=&limit=&offset=
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit 1–100 oralig\'ida bo\'lishi kerak'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset manfiy bo\'lishi mumkin emas')
  ],
  getProducts
)

// GET /api/products/:id
router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  getProductById
)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// POST /api/products
router.post(
  '/',
  auth,
  upload.single('image'),
  handleUploadError,
  productBody,
  createProduct
)

// PUT /api/products/:id
router.put(
  '/:id',
  auth,
  upload.single('image'),
  handleUploadError,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  productBody,
  updateProduct
)

// DELETE /api/products/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deleteProduct
)

export default router
