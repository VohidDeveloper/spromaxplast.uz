import { Router } from 'express'
import { body, param } from 'express-validator'

import auth                          from '../middleware/auth.js'
import { upload, handleUploadError } from '../middleware/upload.js'
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnersController.js'

const router = Router()

const partnerBody = [
  body('name')
    .trim()
    .notEmpty().withMessage('name majburiy'),
  body('industry')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('industry 200 belgidan oshmasligi kerak'),
  body('website')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: true }).withMessage('website to\'liq URL bo\'lishi kerak (https://...)'),
  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order musbat son bo\'lishi kerak'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active true yoki false bo\'lishi kerak')
]

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/partners  (faqat is_active=true qaytaradi)
router.get('/', getPartners)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// POST /api/partners
router.post(
  '/',
  auth,
  upload.single('logo'),
  handleUploadError,
  partnerBody,
  createPartner
)

// PUT /api/partners/:id
router.put(
  '/:id',
  auth,
  upload.single('logo'),
  handleUploadError,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  partnerBody,
  updatePartner
)

// DELETE /api/partners/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deletePartner
)

export default router
