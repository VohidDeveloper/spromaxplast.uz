import { Router } from 'express'
import { body, param } from 'express-validator'

import auth                          from '../middleware/auth.js'
import { upload, handleUploadError } from '../middleware/upload.js'
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificatesController.js'

const router = Router()

const certBody = [
  body('name').trim().notEmpty().withMessage('name majburiy'),
  body('code').trim().notEmpty().withMessage('code majburiy'),
  body('issued_by').optional({ checkFalsy: true }).trim(),
  body('valid_until')
    .optional({ checkFalsy: true })
    .isDate().withMessage('valid_until YYYY-MM-DD formatida bo\'lishi kerak'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active true yoki false bo\'lishi kerak')
]

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/certificates
router.get('/', getCertificates)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// POST /api/certificates  (fayl: PDF yoki rasm)
router.post(
  '/',
  auth,
  upload.single('file'),
  handleUploadError,
  certBody,
  createCertificate
)

// PUT /api/certificates/:id
router.put(
  '/:id',
  auth,
  upload.single('file'),
  handleUploadError,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  certBody,
  updateCertificate
)

// DELETE /api/certificates/:id
router.delete(
  '/:id',
  auth,
  param('id').isInt({ min: 1 }).withMessage('id musbat son bo\'lishi kerak'),
  deleteCertificate
)

export default router
