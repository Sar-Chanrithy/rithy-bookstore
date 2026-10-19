// src/lib/contactDb.js
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from './postgres';

const CONTACTS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'contacts.json');
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function readContactsFromFile() {
  try {
    if (fs.existsSync(CONTACTS_FILE_PATH)) {
      const data = fs.readFileSync(CONTACTS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading contacts.json:', err);
  }
  return [];
}

function writeContactsToFile(contacts) {
  try {
    const dir = path.dirname(CONTACTS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTACTS_FILE_PATH, JSON.stringify(contacts, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing contacts.json:', err);
    return false;
  }
}

/**
 * Automatically delete support contact messages older than 30 days
 */
export async function autoDeleteExpiredContacts() {
  const now = Date.now();

  // 1. Delete from PostgreSQL (older than 30 days)
  if (isPostgresConfigured()) {
    try {
      const deleteRes = await pgQuery(`
        DELETE FROM contacts 
        WHERE created_at < (CURRENT_TIMESTAMP - INTERVAL '30 days')
      `);
      if (deleteRes?.rowCount > 0) {
        console.log(`[Auto-Clean] Pruned ${deleteRes.rowCount} expired contact message(s) older than 30 days from PostgreSQL.`);
      }
    } catch (err) {
      console.warn('Auto delete expired contacts DB notice:', err.message);
    }
  }

  // 2. Delete from local JSON file (older than 30 days)
  try {
    const fileContacts = readContactsFromFile();
    const activeContacts = fileContacts.filter((c) => {
      const contactTime = c.createdAt ? new Date(c.createdAt).getTime() : 0;
      return (now - contactTime) <= THIRTY_DAYS_MS;
    });

    if (activeContacts.length !== fileContacts.length) {
      writeContactsToFile(activeContacts);
      console.log(`[Auto-Clean] Pruned ${fileContacts.length - activeContacts.length} expired contact(s) older than 30 days from contacts.json.`);
    }
  } catch (err) {
    console.warn('Auto delete expired contacts File notice:', err.message);
  }
}

let contactsTableSynced = false;

/**
 * Ensure the contacts table exists in PostgreSQL and purge expired records
 */
export async function ensureContactsTableSynced() {
  if (contactsTableSynced || !isPostgresConfigured()) return;

  try {
    // 1. Create contacts table in PostgreSQL if it doesn't exist
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
    `);

    // 2. Auto-delete contacts older than 30 days
    await autoDeleteExpiredContacts();

    contactsTableSynced = true;
  } catch (err) {
    console.warn('PostgreSQL contacts table sync notice:', err.message);
  }
}

/**
 * Save a new contact support message and trigger 30-day auto-prune
 */
export async function createContactMessage({ name, email, message }) {
  if (!name || !email || !message) {
    throw new Error('Name, email, and message are required.');
  }

  const cleanName = String(name).trim();
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanMessage = String(message).trim();
  const createdAt = new Date().toISOString();

  // Run 30-day auto-cleaning
  await autoDeleteExpiredContacts();

  let contactRecord = {
    id: Date.now(),
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
    status: 'unread',
    createdAt,
  };

  // 1. Save to PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      await ensureContactsTableSynced();
      const insertRes = await pgQuery(`
        INSERT INTO contacts (name, email, message, status, created_at)
        VALUES ($1, $2, $3, 'unread', CURRENT_TIMESTAMP)
        RETURNING id, name, email, message, status, created_at
      `, [cleanName, cleanEmail, cleanMessage]);

      if (insertRes.rows && insertRes.rows.length > 0) {
        const row = insertRes.rows[0];
        contactRecord = {
          id: row.id,
          name: row.name,
          email: row.email,
          message: row.message,
          status: row.status,
          createdAt: row.created_at,
        };
      }
    } catch (err) {
      console.error('Error inserting contact into PostgreSQL:', err.message);
    }
  }

  // 2. Backup to local JSON file
  try {
    const fileContacts = readContactsFromFile();
    fileContacts.unshift(contactRecord);
    writeContactsToFile(fileContacts);
  } catch (err) {
    console.warn('Notice saving contact to file:', err.message);
  }

  return {
    success: true,
    contact: contactRecord,
  };
}

/**
 * Fetch all support contact messages (auto-pruned for < 30 days)
 */
export async function getContacts() {
  await autoDeleteExpiredContacts();

  if (isPostgresConfigured()) {
    try {
      await ensureContactsTableSynced();
      const res = await pgQuery(`
        SELECT id, name, email, message, status, created_at as "createdAt"
        FROM contacts
        ORDER BY created_at DESC
      `);
      return {
        contacts: res.rows || [],
        total: res.rowCount || 0,
        source: 'postgresql',
      };
    } catch (err) {
      console.warn('Notice querying contacts from PostgreSQL:', err.message);
    }
  }

  const fileContacts = readContactsFromFile();
  return {
    contacts: fileContacts,
    total: fileContacts.length,
    source: 'file',
  };
}

/**
 * Delete a specific contact message by ID
 */
export async function deleteContact(id) {
  if (isPostgresConfigured()) {
    try {
      await ensureContactsTableSynced();
      await pgQuery(`DELETE FROM contacts WHERE id = $1`, [id]);
    } catch (err) {
      console.error('Error deleting contact from PostgreSQL:', err.message);
    }
  }

  try {
    const fileContacts = readContactsFromFile();
    const updated = fileContacts.filter((c) => String(c.id) !== String(id));
    writeContactsToFile(updated);
  } catch (err) {
    console.warn('Notice deleting contact from file:', err.message);
  }

  return { success: true };
}
