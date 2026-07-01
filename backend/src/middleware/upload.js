import multer from 'multer'
import path   from 'path'
import fs     from 'fs'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const MAX_SIZE_MB   = Number(process.env.MAX_FILE_SIZE_MB) || 5

// uploads/ papkasi yo'q bo'lsa yaratish
const uploadDir = process.env.UPLOAD_PATH || 'uploads/'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase()
    const filename = `${Date.now()}${ext}`
    cb(null, filename)
  }
})

function fileFilter(_req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 }
})

// Multer xatolarini aniq xabarga aylantiruvchi wrapper
function handleUploadError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `Fayl hajmi ${MAX_SIZE_MB}MB dan oshmasligi kerak`
      })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Faqat JPEG, JPG, PNG, WEBP formatlar ruxsat etiladi'
      })
    }
  }
  next(err)
}

export { upload, handleUploadError }
