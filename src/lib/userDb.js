// src/lib/userDb.js
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from './postgres';

const USERS_DB_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');

function readUsersFromFile() {
  try {
    if (fs.existsSync(USERS_DB_PATH)) {
      const data = fs.readFileSync(USERS_DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading users.json:', err);
  }
  return [];
}

function writeUsersToFile(users) {
  try {
    const dir = path.dirname(USERS_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err);
    return false;
  }
}

let usersSynced = false;
export async function ensureUsersTableSynced() {
  if (!isPostgresConfigured()) return;
  try {
    // 1. Create users table if not exists
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'VIP Member',
        initials VARCHAR(10) DEFAULT 'JD',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure all users from users.json exist in PostgreSQL
    const localUsers = readUsersFromFile();
    for (const u of localUsers) {
      await pgQuery(`
        INSERT INTO users (id, name, email, password_hash, role, initials)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          initials = EXCLUDED.initials
      `, [
        Number(u.id),
        u.name,
        u.email.toLowerCase().trim(),
        u.password || 'password123',
        u.role || 'VIP Member',
        u.initials || 'JD'
      ]);
    }

    // 3. Advance sequence to avoid duplicate key errors on SERIAL id
    await pgQuery(`
      SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
    `);

    usersSynced = true;
  } catch (err) {
    console.warn('ensureUsersTableSynced warning:', err.message);
  }
}

/**
 * Find user by email (checks PostgreSQL first, then JSON file)
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  if (isPostgresConfigured()) {
    try {
      await ensureUsersTableSynced();
      const res = await pgQuery('SELECT * FROM users WHERE LOWER(email) = $1', [cleanEmail]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password_hash,
          role: row.role,
          initials: row.initials,
          createdAt: row.created_at
        };
      }
    } catch (e) {
      console.warn('PG findUserByEmail error:', e.message);
    }
  }

  const localUsers = readUsersFromFile();
  return localUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail) || null;
}

/**
 * Register a new user in PostgreSQL and JSON file
 */
export async function registerUser({ name, email, password, role = 'VIP Member' }) {
  const cleanEmail = email.toLowerCase().trim();
  const trimmedName = name.trim();

  // Compute initials
  const initials = trimmedName
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'BR';

  // 1. Save to JSON file
  const localUsers = readUsersFromFile();
  const maxId = localUsers.reduce((max, u) => Math.max(max, parseInt(u.id, 10) || 0), 0);
  const newId = maxId + 1;

  const newUser = {
    id: newId,
    name: trimmedName,
    email: cleanEmail,
    password: password || 'password123',
    role,
    initials,
    createdAt: new Date().toISOString()
  };

  localUsers.push(newUser);
  writeUsersToFile(localUsers);

  // 2. Save to PostgreSQL if available
  if (isPostgresConfigured()) {
    try {
      const res = await pgQuery(`
        INSERT INTO users (id, name, email, password_hash, role, initials)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          initials = EXCLUDED.initials
        RETURNING id, name, email, role, initials, created_at
      `, [newId, trimmedName, cleanEmail, password || 'password123', role, initials]);

      await pgQuery(`SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));`);

      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          initials: row.initials,
          createdAt: row.created_at
        };
      }
    } catch (pgErr) {
      console.warn('PG registerUser warning:', pgErr.message);
    }
  }

  const { password: _, ...userSafe } = newUser;
  return userSafe;
}

/**
 * Authenticate login credentials
 */
export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'No account found with this email address.' };
  }

  // Check password
  if (user.password && password && user.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const { password: _, ...userSafe } = user;
  return { success: true, user: userSafe };
}
