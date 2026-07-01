import db from '../database/db.js'

// GET /api/settings — barcha sozlamalar
export async function getSettings(_req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT key, value_uz, value_ru, value_en, updated_at
       FROM settings
       ORDER BY key ASC`
    )
    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
}

// PUT /api/settings/:key — yangilash (faqat auth bilan)
export async function updateSetting(req, res, next) {
  try {
    const { key } = req.params
    const { value_uz, value_ru, value_en } = req.body

    const existing = await db.query(
      'SELECT key FROM settings WHERE key = $1',
      [key]
    )
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Sozlama topilmadi' })
    }

    const { rows } = await db.query(
      `UPDATE settings
       SET value_uz = $1, value_ru = $2, value_en = $3, updated_at = NOW()
       WHERE key = $4
       RETURNING *`,
      [value_uz, value_ru, value_en, key]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}
