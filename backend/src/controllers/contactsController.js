import { validationResult } from 'express-validator'
import db from '../database/db.js'

// POST /api/contacts
export async function createContact(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, phone, email, subject, message } = req.body

    const { rows } = await db.query(
      `INSERT INTO contacts (name, phone, email, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [name, phone, email || null, subject || null, message]
    )

    res.status(201).json({
      success: true,
      message: 'Xabaringiz qabul qilindi',
      data:    { id: rows[0].id, created_at: rows[0].created_at }
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/contacts?is_read=&limit=&offset=
export async function getContacts(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const limit  = Math.min(parseInt(req.query.limit)  || 20, 100)
    const offset = parseInt(req.query.offset) || 0

    const conditions = []
    const params     = []

    if (req.query.is_read !== undefined) {
      params.push(req.query.is_read === 'true')
      conditions.push(`is_read = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    params.push(limit, offset)
    const dataSql = `
      SELECT id, name, phone, email, subject, message, is_read, created_at
      FROM contacts
      ${where}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `

    const countParams = params.slice(0, -2)
    const countSql    = `SELECT COUNT(*) FROM contacts ${where}`

    const [data, count] = await Promise.all([
      db.query(dataSql, params),
      db.query(countSql, countParams)
    ])

    // O'qilmagan xabarlar sonini ham qaytarish
    const unread = await db.query('SELECT COUNT(*) FROM contacts WHERE is_read = FALSE')

    res.json({
      success:        true,
      total:          parseInt(count.rows[0].count),
      unread_count:   parseInt(unread.rows[0].count),
      limit,
      offset,
      data:           data.rows
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/contacts/:id/read
export async function markAsRead(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { rows } = await db.query(
      `UPDATE contacts SET is_read = TRUE
       WHERE id = $1
       RETURNING id, name, is_read`,
      [req.params.id]
    )

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Murojaat topilmadi' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/contacts/:id
export async function deleteContact(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { rows } = await db.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING id',
      [req.params.id]
    )

    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Murojaat topilmadi' })
    }

    res.json({ success: true, message: 'Murojaat o\'chirildi' })
  } catch (err) {
    next(err)
  }
}
