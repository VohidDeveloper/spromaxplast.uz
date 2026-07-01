import { validationResult } from 'express-validator'
import db from '../database/db.js'

// name_uz dan slug generatsiya: kichik harf, bo'shliq → -
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

// GET /api/categories
export async function getCategories(_req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT
        c.id, c.name_uz, c.name_ru, c.name_en, c.slug, c.created_at,
        COUNT(p.id) FILTER (WHERE p.is_active = TRUE) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id
       ORDER BY c.id ASC`
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
}

// POST /api/categories
export async function createCategory(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name_uz, name_ru, name_en } = req.body
    // Slug: requestdan kelgan bo'lsa ishlatamiz, yo'q bo'lsa name_uz dan
    const slug = req.body.slug ? req.body.slug.trim() : generateSlug(name_uz)

    // Slug takrorlanmasin
    const existing = await db.query('SELECT id FROM categories WHERE slug = $1', [slug])
    if (existing.rows[0]) {
      return res.status(409).json({ success: false, message: `"${slug}" slug allaqachon mavjud` })
    }

    const { rows } = await db.query(
      `INSERT INTO categories (name_uz, name_ru, name_en, slug)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name_uz, name_ru, name_en, slug]
    )

    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// PUT /api/categories/:id
export async function updateCategory(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' })
    }

    const { name_uz, name_ru, name_en } = req.body
    const slug = req.body.slug ? req.body.slug.trim() : generateSlug(name_uz)

    // Slug boshqa kategoriyada mavjudligini tekshirish
    const slugCheck = await db.query(
      'SELECT id FROM categories WHERE slug = $1 AND id != $2',
      [slug, req.params.id]
    )
    if (slugCheck.rows[0]) {
      return res.status(409).json({ success: false, message: `"${slug}" slug allaqachon mavjud` })
    }

    const { rows } = await db.query(
      `UPDATE categories SET name_uz = $1, name_ru = $2, name_en = $3, slug = $4
       WHERE id = $5
       RETURNING *`,
      [name_uz, name_ru, name_en, slug, req.params.id]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/categories/:id
export async function deleteCategory(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT id FROM categories WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Kategoriya topilmadi' })
    }

    const productCount = await db.query(
      'SELECT COUNT(*) FROM products WHERE category_id = $1',
      [req.params.id]
    )
    if (parseInt(productCount.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: `Bu kategoriyada ${productCount.rows[0].count} ta mahsulot mavjud. Avval mahsulotlarni o'chiring yoki boshqa kategoriyaga o'tkazing.`
      })
    }

    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id])

    res.json({ success: true, message: 'Kategoriya o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
