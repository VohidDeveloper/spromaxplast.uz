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

// PUT /api/settings/:key — yangilash yoki yaratish (UPSERT)
export async function updateSetting(req, res, next) {
  try {
    const { key } = req.params
    const { value_uz, value_ru, value_en } = req.body

    const { rows } = await db.query(
      `INSERT INTO settings (key, value_uz, value_ru, value_en, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (key) DO UPDATE
         SET value_uz   = EXCLUDED.value_uz,
             value_ru   = EXCLUDED.value_ru,
             value_en   = EXCLUDED.value_en,
             updated_at = NOW()
       RETURNING *`,
      [key, value_uz, value_ru, value_en]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}
