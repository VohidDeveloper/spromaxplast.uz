import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token taqdim etilmagan' })
  }

  const token = header.slice(7)

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token muddati tugagan'
      : 'Token noto\'g\'ri'
    res.status(401).json({ success: false, message })
  }
}
