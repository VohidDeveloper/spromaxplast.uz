import { validationResult } from 'express-validator'
import fs   from 'fs'
import path from 'path'
import db   from '../database/db.js'

function removeFile(fileUrl) {
  if (!fileUrl) return
  const uploadDir = process.env.UPLOAD_PATH || 'uploads/'
  const filepath  = path.join(uploadDir, path.basename(fileUrl))
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

// GET /api/certificates
export async function getCertificates(_req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, name, code, issued_by, valid_until, file_url, is_active, created_at
       FROM certificates
       WHERE is_active = TRUE
       ORDER BY valid_until DESC NULLS LAST, created_at DESC`
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
}

// POST /api/certificates
export async function createCertificate(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, code, issued_by, valid_until, is_active } = req.body

    const fileUrl = req.file
      ? `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
      : null

    const { rows } = await db.query(
      `INSERT INTO certificates (name, code, issued_by, valid_until, file_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        code,
        issued_by   || null,
        valid_until || null,
        fileUrl,
        is_active !== undefined ? is_active : true
      ]
    )

    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// PUT /api/certificates/:id
export async function updateCertificate(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      if (req.file) removeFile(req.file.filename)
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT * FROM certificates WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      if (req.file) removeFile(req.file.filename)
      return res.status(404).json({ success: false, message: 'Sertifikat topilmadi' })
    }

    const old = existing.rows[0]
    const { name, code, issued_by, valid_until, is_active } = req.body

    let fileUrl = old.file_url
    if (req.file) {
      removeFile(old.file_url)
      fileUrl = `/${process.env.UPLOAD_PATH || 'uploads/'}${req.file.filename}`
    }

    const { rows } = await db.query(
      `UPDATE certificates SET
        name        = $1, code        = $2, issued_by   = $3,
        valid_until = $4, file_url    = $5, is_active   = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        code,
        issued_by   || null,
        valid_until || null,
        fileUrl,
        is_active !== undefined ? is_active : old.is_active,
        req.params.id
      ]
    )

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    if (req.file) removeFile(req.file.filename)
    next(err)
  }
}

// DELETE /api/certificates/:id
export async function deleteCertificate(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const existing = await db.query('SELECT file_url FROM certificates WHERE id = $1', [req.params.id])
    if (!existing.rows[0]) {
      return res.status(404).json({ success: false, message: 'Sertifikat topilmadi' })
    }

    removeFile(existing.rows[0].file_url)
    await db.query('DELETE FROM certificates WHERE id = $1', [req.params.id])

    res.json({ success: true, message: 'Sertifikat o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
