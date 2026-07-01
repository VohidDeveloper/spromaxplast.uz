import { validationResult } from 'express-validator'
import fs                   from 'fs'
import path                 from 'path'

import db from '../database/db.js'

// Diskdan fayl o'chirish (mavjud bo'lsa)
function removeFile(imageUrl) {
  if (!imageUrl) return
  const uploadDir = process.env.UPLOAD_PATH || 'uploads/'
  const filename  = path.basename(imageUrl)
  const filepath  = path.join(uploadDir, filename)
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

// GET /api/products
export async function getProducts(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { category, search } = req.query
    const limit  = Math.min(parseInt(req.query.limit)  || 20, 100)
    const offset = parseInt(req.query.offset) || 0

    const conditions = ['p.is_active = TRUE']
    const params     = []

    if (category) {
      params.push(category)
      conditions.push(`c.slug = $${params.length}`)
    }

    if (search) {
      params.push(`%${search}%`)
      const n = params.length
      conditions.push(`(p.name_uz ILIKE $${n} OR p.name_ru ILIKE $${n} OR p.name_en ILIKE $${n})`)
    }

    const where = conditions.join(' AND ')

    params.push(limit, offset)
    const dataSql = `
      SELECT
        p.id, p.name_uz, p.name_ru, p.name_en,
        p.description_uz, p.description_ru, p.description_en,
        p.specs, p.image_url, p.sort_order, p.created_at,
        c.id   AS category_id,
        c.slug AS category_slug,
        c.name_uz AS category_name_uz,
        c.name_ru AS category_name_ru,
        c.name_en AS category_name_en
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where}
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `

    const countSql = `
      SELECT COUNT(*) FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where}
    `
    const countParams = params.slice(0, -2)

    const [data, count] = await Promise.all([
      db.query(dataSql, params),
      db.query(countSql, countParams)
    ])

    res.json({
      success: true,
      total:   parseInt(count.rows[0].count),
      limit,
      offset,
      data:    data.rows
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id
export async function getProductById(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { rows } = await db.query(
      `SELECT
        p.*,
        c.slug AS category_slug,
        c.name_uz AS category_name_uz,
        c.name_ru AS category_name_ru,
        c.name_en AS category_name_en
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.id = $1`,
      [req.params.id]
    )

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// POST /api/products
export async function createProduct(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const {
      name_uz, name_ru, name_en,
      description_uz, description_ru, description_en,
      category_id, specs, sort_order, is_active
    } = req.body

    const imageUrl = req.file
      ? `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
      : null

    const { rows } = await db.query(
      `INSERT INTO products
        (name_uz, name_ru, name_en,
         description_uz, description_ru, description_en,
         category_id, specs, image_url, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name_uz, name_ru, name_en,
        description_uz || null, description_ru || null, description_en || null,
        category_id    || null,
        specs ? JSON.stringify(specs) : null,
        imageUrl,
        sort_order || 0,
        is_active !== undefined ? is_active : true
      ]
    )

    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    // Mavjud mahsulotni tekshirish
    const existing = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      if (req.file) removeFile(req.file.filename)
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' })
    }

    const old = existing.rows[0]

    const {
      name_uz, name_ru, name_en,
      description_uz, description_ru, description_en,
      category_id, specs, sort_order, is_active
    } = req.body

    // Yangi rasm yuklangan bo'lsa eskisini o'chirish
    let imageUrl = old.image_url
    if (req.file) {
      removeFile(old.image_url)
      imageUrl = `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
    }

    const { rows } = await db.query(
      `UPDATE products SET
        name_uz        = $1,  name_ru        = $2,  name_en        = $3,
        description_uz = $4,  description_ru = $5,  description_en = $6,
        category_id    = $7,  specs          = $8,  image_url      = $9,
        sort_order     = $10, is_active      = $11
       WHERE id = $12
       RETURNING *`,
      [
        name_uz, name_ru, name_en,
        description_uz || null, description_ru || null, description_en || null,
        category_id    || null,
        specs ? JSON.stringify(specs) : old.specs,
        imageUrl,
        sort_order !== undefined ? sort_order : old.sort_order,
        is_active  !== undefined ? is_active  : old.is_active,
        req.params.id
      ]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT image_url FROM products WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' })
    }

    // Rasmni diskdan o'chirish
    removeFile(existing.rows[0].image_url)

    await db.query('DELETE FROM products WHERE id = $1', [req.params.id])

    res.json({ success: true, message: 'Mahsulot o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
