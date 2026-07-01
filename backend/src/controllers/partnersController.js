import { validationResult } from 'express-validator'
import fs   from 'fs'
import path from 'path'
import db   from '../database/db.js'

function removeFile(logoUrl) {
  if (!logoUrl) return
  const uploadDir = process.env.UPLOAD_PATH || 'uploads/'
  const filepath  = path.join(uploadDir, path.basename(logoUrl))
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

// GET /api/partners
export async function getPartners(_req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, name, industry, logo_url, website, sort_order, created_at
       FROM partners
       WHERE is_active = TRUE
       ORDER BY sort_order ASC, created_at ASC`
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
}

// POST /api/partners
export async function createPartner(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, industry, website, is_active } = req.body

    // sort_order: mavjud maksimum + 1
    const maxOrder = await db.query('SELECT COALESCE(MAX(sort_order), 0) AS max FROM partners')
    const sortOrder = req.body.sort_order !== undefined
      ? parseInt(req.body.sort_order)
      : parseInt(maxOrder.rows[0].max) + 1

    const logoUrl = req.file
      ? `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
      : null

    const { rows } = await db.query(
      `INSERT INTO partners (name, industry, logo_url, website, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        industry  || null,
        logoUrl,
        website   || null,
        is_active !== undefined ? is_active : true,
        sortOrder
      ]
    )

    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// PUT /api/partners/:id
export async function updatePartner(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT * FROM partners WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      if (req.file) removeFile(req.file.filename)
      return res.status(404).json({ success: false, message: 'Hamkor topilmadi' })
    }

    const old = existing.rows[0]
    const { name, industry, website, is_active, sort_order } = req.body

    let logoUrl = old.logo_url
    if (req.file) {
      removeFile(old.logo_url)
      logoUrl = `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
    }

    const { rows } = await db.query(
      `UPDATE partners SET
        name       = $1, industry   = $2, logo_url   = $3,
        website    = $4, is_active  = $5, sort_order = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        industry   || null,
        logoUrl,
        website    || null,
        is_active  !== undefined ? is_active  : old.is_active,
        sort_order !== undefined ? parseInt(sort_order) : old.sort_order,
        req.params.id
      ]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// DELETE /api/partners/:id
export async function deletePartner(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT logo_url FROM partners WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Hamkor topilmadi' })
    }

    removeFile(existing.rows[0].logo_url)
    await db.query('DELETE FROM partners WHERE id = $1', [req.params.id])

    res.json({ success: true, message: 'Hamkor o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
