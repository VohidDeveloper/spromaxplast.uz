import { Router } from 'express'
import auth from '../middleware/auth.js'
import { upload, handleUploadError } from '../middleware/upload.js'

const router = Router()

// POST /api/upload/image — auth kerak
router.post(
  '/image',
  auth,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next)
      next()
    })
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Fayl yuklanmadi' })
    }
    const url = `/uploads/${req.file.filename}`
    res.json({ success: true, url })
  }
)

export default router
