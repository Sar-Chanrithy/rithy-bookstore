// src/lib/subscriberDb.js
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from './postgres';

const SUBSCRIBERS_PATH = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

function readSubscribersFromFile() {
  try {
    if (fs.existsSync(SUBSCRIBERS_PATH)) {
      const data = fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading subscribers.json:', err);
  }
  return [];
}

function writeSubscribersToFile(subscribers) {
  try {
    const dir = path.dirname(SUBSCRIBERS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing subscribers.json:', err);
    return false;
  }
}

let tableSynced = false;

export async function ensureSubscribersTableSynced() {
  if (!isPostgresConfigured()) return;
  try {
    // 1. Create subscribers table in PostgreSQL if not exists
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);

    // 2. Ensure all file subscribers exist in PostgreSQL
    const fileSubs = readSubscribersFromFile();
    for (const sub of fileSubs) {
      await pgQuery(`
        INSERT INTO subscribers (email, subscribed_at, is_active)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
      `, [sub.email, sub.subscribedAt || new Date().toISOString(), sub.isActive ?? true]);
    }

    tableSynced = true;
  } catch (err) {
    console.warn('PostgreSQL subscribers table sync notice:', err.message);
  }
}

/**
 * Add a new subscriber to database (PostgreSQL + JSON fallback)
 */
export async function addSubscriber(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string') {
    throw new Error('Valid email address is required.');
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Please provide a valid email format.');
  }

  // Always keep JSON file in sync
  const fileSubs = readSubscribersFromFile();
  const existingInFile = fileSubs.find((s) => s.email.toLowerCase() === email);

  // If PostgreSQL is configured, attempt PostgreSQL insertion
  if (isPostgresConfigured()) {
    try {
      if (!tableSynced) {
        await ensureSubscribersTableSynced();
      }

      // Check if already in PostgreSQL
      const checkRes = await pgQuery('SELECT * FROM subscribers WHERE LOWER(email) = $1', [email]);
      if (checkRes.rows && checkRes.rows.length > 0) {
        // Also ensure present in JSON file
        if (!existingInFile) {
          fileSubs.push({
            id: checkRes.rows[0].id,
            email: checkRes.rows[0].email,
            subscribedAt: checkRes.rows[0].subscribed_at,
            isActive: true
          });
          writeSubscribersToFile(fileSubs);
        }
        return {
          success: true,
          alreadySubscribed: true,
          subscriber: checkRes.rows[0],
          message: 'You are already subscribed to our newsletter! 📚'
        };
      }

      // Insert new subscriber into PostgreSQL
      const insertRes = await pgQuery(`
        INSERT INTO subscribers (email, subscribed_at, is_active)
        VALUES ($1, CURRENT_TIMESTAMP, TRUE)
        RETURNING *
      `, [email]);

      const newPgSub = insertRes.rows[0];

      // Update JSON file as backup
      if (!existingInFile) {
        fileSubs.push({
          id: newPgSub.id,
          email: newPgSub.email,
          subscribedAt: newPgSub.subscribed_at,
          isActive: true
        });
        writeSubscribersToFile(fileSubs);
      }

      return {
        success: true,
        alreadySubscribed: false,
        subscriber: newPgSub,
        message: 'Thank you for subscribing! 📚'
      };
    } catch (pgErr) {
      console.warn('PostgreSQL insert error, falling back to local file:', pgErr.message);
    }
  }

  // File-based handling (when PostgreSQL is offline or fallback)
  if (existingInFile) {
    return {
      success: true,
      alreadySubscribed: true,
      subscriber: existingInFile,
      message: 'You are already subscribed to our newsletter! 📚'
    };
  }

  const nextId = fileSubs.length > 0 ? Math.max(...fileSubs.map((s) => s.id || 0)) + 1 : 1;
  const newSub = {
    id: nextId,
    email,
    subscribedAt: new Date().toISOString(),
    isActive: true
  };

  fileSubs.push(newSub);
  writeSubscribersToFile(fileSubs);

  return {
    success: true,
    alreadySubscribed: false,
    subscriber: newSub,
    message: 'Thank you for subscribing! 📚'
  };
}

/**
 * Get all subscribers
 */
export async function getSubscribers() {
  if (isPostgresConfigured()) {
    try {
      if (!tableSynced) {
        await ensureSubscribersTableSynced();
      }
      const res = await pgQuery('SELECT * FROM subscribers ORDER BY id DESC');
      if (res.rows) {
        return {
          total: res.rows.length,
          subscribers: res.rows
        };
      }
    } catch (err) {
      console.warn('PostgreSQL getSubscribers error, using file:', err.message);
    }
  }

  const fileSubs = readSubscribersFromFile();
  return {
    total: fileSubs.length,
    subscribers: fileSubs
  };
}
