import { validationResult } from 'express-validator'
import fs   from 'fs'
import path from 'path'
import db   from '../database/db.js'

function removeFile(imageUrl) {
  if (!imageUrl) return
  const uploadDir = process.env.UPLOAD_PATH || 'uploads/'
  const filepath  = path.join(uploadDir, path.basename(imageUrl))
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

// GET /api/news?is_published=&limit=&offset=
export async function getNews(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const limit  = Math.min(parseInt(req.query.limit)  || 10, 100)
    const offset = parseInt(req.query.offset) || 0
    const isAdmin = !!req.headers.authorization

    const conditions = []
    const params     = []

    // Admin bo'lmasa faqat chop etilganlarni ko'rsatish
    if (!isAdmin) {
      conditions.push('is_published = TRUE')
    } else if (req.query.is_published !== undefined) {
      params.push(req.query.is_published === 'true')
      conditions.push(`is_published = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    params.push(limit, offset)
    const dataSql = `
      SELECT id, title_uz, title_ru, title_en,
             image_url, is_published, published_at, created_at
      FROM news
      ${where}
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `

    const countParams = params.slice(0, -2)
    const countSql    = `SELECT COUNT(*) FROM news ${where}`

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

// GET /api/news/:id
export async function getNewsById(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const isAdmin = !!req.headers.authorization
    const extra   = isAdmin ? '' : 'AND is_published = TRUE'

    const { rows } = await db.query(
      `SELECT * FROM news WHERE id = $1 ${extra}`,
      [req.params.id]
    )

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Yangilik topilmadi' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// POST /api/news
export async function createNews(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const {
      title_uz, title_ru, title_en,
      content_uz, content_ru, content_en,
      is_published
    } = req.body

    const published  = is_published === 'true' || is_published === true
    const publishedAt = published ? new Date() : null

    const imageUrl = req.file
      ? `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
      : null

    const { rows } = await db.query(
      `INSERT INTO news
        (title_uz, title_ru, title_en,
         content_uz, content_ru, content_en,
         image_url, is_published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        title_uz, title_ru, title_en,
        content_uz || null, content_ru || null, content_en || null,
        imageUrl, published, publishedAt
      ]
    )

    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// PUT /api/news/:id
export async function updateNews(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT * FROM news WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      if (req.file) removeFile(req.file.filename)
      return res.status(404).json({ success: false, message: 'Yangilik topilmadi' })
    }

    const old = existing.rows[0]

    const {
      title_uz, title_ru, title_en,
      content_uz, content_ru, content_en,
      is_published
    } = req.body

    const published = is_published !== undefined
      ? (is_published === 'true' || is_published === true)
      : old.is_published

    // Endi chop etilsa va oldin chop etilmagan bo'lsa — published_at ni set qilamiz
    const publishedAt = published && !old.is_published
      ? new Date()
      : old.published_at

    let imageUrl = old.image_url
    if (req.file) {
      removeFile(old.image_url)
      imageUrl = `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
    }

    const { rows } = await db.query(
      `UPDATE news SET
        title_uz     = $1,  title_ru     = $2,  title_en     = $3,
        content_uz   = $4,  content_ru   = $5,  content_en   = $6,
        image_url    = $7,  is_published = $8,  published_at = $9
       WHERE id = $10
       RETURNING *`,
      [
        title_uz, title_ru, title_en,
        content_uz || null, content_ru || null, content_en || null,
        imageUrl, published, publishedAt,
        req.params.id
      ]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// DELETE /api/news/:id
export async function deleteNews(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT image_url FROM news WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Yangilik topilmadi' })
    }

    removeFile(existing.rows[0].image_url)
    await db.query('DELETE FROM news WHERE id = $1', [req.params.id])

    res.json({ success: true, message: 'Yangilik o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
