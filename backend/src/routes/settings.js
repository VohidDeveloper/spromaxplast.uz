import { Router } from 'express'
import { body } from 'express-validator'

import auth from '../middleware/auth.js'
import { getSettings, updateSetting } from '../controllers/settingsController.js'

const router = Router()

// ─── PUBLIC ───────────────────────────────────────────────
// GET /api/settings
router.get('/', getSettings)

// ─── PROTECTED (auth kerak) ───────────────────────────────
// PUT /api/settings/:key
router.put(
  '/:key',
  auth,
  [
    body('value_uz').notEmpty().withMessage('value_uz majburiy'),
    body('value_ru').notEmpty().withMessage('value_ru majburiy'),
    body('value_en').notEmpty().withMessage('value_en majburiy')
  ],
  updateSetting
)

export default router
