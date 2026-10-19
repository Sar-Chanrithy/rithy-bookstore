// src/lib/postgres.js

let pool = null;
let pgModule = null;

async function getPgModule() {
  if (!pgModule) {
    try {
      pgModule = await import('pg');
    } catch (e) {
      // 'pg' is not installed yet
      return null;
    }
  }
  return pgModule;
}

/**
 * Check if PostgreSQL connection variables are present in environment
 */
export function isPostgresConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
    (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  );
}

/**
 * Get or initialize the PostgreSQL connection pool (Singleton)
 */
export async function getPool() {
  if (!pool && isPostgresConfigured()) {
    const pg = await getPgModule();
    if (!pg || !pg.Pool) {
      return null;
    }

    try {
      const connStr = process.env.DATABASE_URL;
      if (connStr) {
        pool = new pg.Pool({
          connectionString: connStr,
          ssl: (connStr.includes('localhost') || connStr.includes('127.0.0.1'))
            ? false
            : { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });
      } else {
        pool = new pg.Pool({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'bookstore',
        });
      }

      pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client:', err);
        pool = null;
      });
    } catch (err) {
      console.warn('PostgreSQL Pool initialization notice:', err.message);
      pool = null;
    }
  }
  return pool;
}

/**
 * Execute a SQL query with parameter binding
 * Example: query('SELECT * FROM books WHERE category = $1', ['Sci-fi'])
 */
export async function query(text, params = []) {
  const p = await getPool();
  if (!p) {
    throw new Error('PostgreSQL driver (pg) is not installed or database is not configured.');
  }
  const start = Date.now();
  try {
    const res = await p.query(text, params);
    return res;
  } catch (err) {
    // If authentication or connection failure, invalidate pool so it re-attempts with updated credentials
    if (err.code === '28P01' || err.code === 'ECONNREFUSED' || err.message?.includes('authentication failed')) {
      if (pool) {
        try { await pool.end(); } catch (e) {}
        pool = null;
      }
    }
    throw err;
  }
}

/**
 * Test PostgreSQL connectivity
 */
export async function testConnection() {
  try {
    const res = await query('SELECT NOW() as current_time');
    return { ok: true, time: res.rows[0].current_time };
  } catch (err) {
    if (pool) {
      try { await pool.end(); } catch (e) {}
      pool = null;
    }
    return { ok: false, error: err.message };
  }
}
