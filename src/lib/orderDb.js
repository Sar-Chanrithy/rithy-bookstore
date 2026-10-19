// src/lib/orderDb.js
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from './postgres';
import { sendTelegramOrderNotification } from './telegram';

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

function readOrdersFromFile() {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading orders.json:', err);
  }
  return [];
}

function writeOrdersToFile(orders) {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders.json:', err);
    return false;
  }
}

let ordersTableSynced = false;

export async function ensureOrdersTableSynced() {
  if (!isPostgresConfigured()) return;
  try {
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_telegram VARCHAR(100),
        delivery_address TEXT NOT NULL,
        order_note TEXT,
        payment_method VARCHAR(50) DEFAULT 'cod',
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        shipping NUMERIC(10, 2) DEFAULT 0.00,
        discount NUMERIC(10, 2) DEFAULT 0.00,
        total NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        telegram_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    ordersTableSynced = true;
  } catch (err) {
    console.warn('PostgreSQL orders table sync notice:', err.message);
  }
}

/**
 * Create a new customer order, persist to database, and trigger Telegram notification
 */
export async function createOrder(data) {
  const {
    customerName,
    customerPhone,
    customerTelegram,
    deliveryAddress,
    orderNote,
    paymentMethod = 'cod',
    items = [],
    subtotal = 0,
    shipping = 4.99,
    discount = 5.00,
    total = 0,
  } = data || {};

  if (!customerName || !customerPhone || !deliveryAddress) {
    throw new Error('Please fill in Customer Name, Phone, and Delivery Address.');
  }

  if (!items || items.length === 0) {
    throw new Error('Your cart is empty. Please add books before checkout.');
  }

  const orderNumber = `RBS-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  let orderRecord = {
    id: Date.now(),
    orderNumber,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerTelegram: customerTelegram ? customerTelegram.trim() : '',
    deliveryAddress: deliveryAddress.trim(),
    orderNote: orderNote ? orderNote.trim() : '',
    paymentMethod: paymentMethod || 'cod',
    items,
    subtotal: Number(subtotal),
    shipping: Number(shipping),
    discount: Number(discount),
    total: Number(total),
    status: 'Pending',
    telegramSent: false,
    createdAt: now,
  };

  // 1. Send Telegram Notification (Orders are dispatched directly to Telegram only)
  const telegramRes = await sendTelegramOrderNotification(orderRecord);
  orderRecord.telegramSent = Boolean(telegramRes.sent);

  // Note: Orders are NOT stored in PostgreSQL or JSON database as requested (Show only on Telegram)

  return {
    success: true,
    order: orderRecord,
    telegramSent: orderRecord.telegramSent,
    telegramUrl: telegramRes.directTelegramUrl,
  };
}

/**
 * Retrieve all orders
 */
export async function getAllOrders() {
  if (isPostgresConfigured()) {
    try {
      if (!ordersTableSynced) {
        await ensureOrdersTableSynced();
      }
      const res = await pgQuery('SELECT * FROM orders ORDER BY id DESC');
      if (res.rows) {
        return res.rows;
      }
    } catch (err) {
      console.warn('PostgreSQL getAllOrders error:', err.message);
    }
  }
  return readOrdersFromFile();
}
