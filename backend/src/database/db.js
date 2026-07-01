import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'spromax_plast',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max:                    10,
  idleTimeoutMillis:   30000,
  connectionTimeoutMillis: 2000
})

// Pool darajasidagi xatolarni log qilish
pool.on('error', (err) => {
  console.error('[DB] Pool xatosi:', err.message)
})

// Oddiy query helper — har safar pool dan client olish shart emas
async function query(sql, params = []) {
  const start = Date.now()
  try {
    const result = await pool.query(sql, params)
    const ms = Date.now() - start
    if (ms > 500) {
      console.warn(`[DB] Sekin so'rov (${ms}ms):`, sql.slice(0, 80))
    }
    return result
  } catch (err) {
    console.error('[DB] Query xatosi:', err.message, '\nSQL:', sql.slice(0, 120))
    throw err
  }
}

// Server ishga tushganda ulanishni tekshirish
async function testConnection() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query('SELECT version()')
    console.log('[DB] PostgreSQL:', rows[0].version.split(',')[0])
  } finally {
    client.release()
  }
}

export default { query, testConnection, pool }
