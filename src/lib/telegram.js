// src/lib/telegram.js

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatTelegramOrderHtml(order) {
  const itemsText = (order.items || [])
    .map(
      (item) =>
        `• <b>${escapeHtml(item.title)}</b> × ${item.quantity || 1} <i>($${(
          (Number(item.price) || 0) * (item.quantity || 1)
        ).toFixed(2)})</i>`
    )
    .join('\n');

  const paymentText =
    order.paymentMethod === 'aba'
      ? '📱 <b>ABA Pay / KHQR</b>'
      : order.paymentMethod === 'card'
      ? '💳 <b>Credit / Debit Card</b>'
      : '💵 <b>Cash on Delivery (COD)</b>';

  const dateStr = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `🛍️ <b>NEW ORDER RECEIVED! — Rithy Book Store</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Order Number:</b> <code>#${order.orderNumber}</code>
👤 <b>Customer:</b> <b>${escapeHtml(order.customerName)}</b>
📞 <b>Phone:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>
${order.customerTelegram ? `✈️ <b>Telegram:</b> ${escapeHtml(order.customerTelegram)}\n` : ''}📍 <b>Address:</b> ${escapeHtml(order.deliveryAddress)}
${order.orderNote ? `📝 <b>Note:</b> ${escapeHtml(order.orderNote)}\n` : ''}💳 <b>Payment:</b> ${paymentText}

📚 <b>ITEMS ORDERED (${order.items?.length || 0}):</b>
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 <b>Subtotal:</b> $${Number(order.subtotal || 0).toFixed(2)}
🚚 <b>Shipping:</b> $${Number(order.shipping || 0).toFixed(2)}
🏷️ <b>Discount:</b> -$${Number(order.discount || 0).toFixed(2)}
💵 <b>TOTAL AMOUNT:</b> <b>$${Number(order.total || 0).toFixed(2)}</b>
⏰ <b>Time:</b> ${dateStr} (Cambodia Time)
━━━━━━━━━━━━━━━━━━━━
✅ <i>Please contact customer to confirm delivery!</i>`;
}

export function formatTelegramOrderPlainText(order) {
  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.title} x ${item.quantity || 1} ($${(
          (Number(item.price) || 0) * (item.quantity || 1)
        ).toFixed(2)})`
    )
    .join('\n');

  return `*NEW ORDER — Rithy Book Store*
Order ID: #${order.orderNumber}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
${order.customerTelegram ? `Telegram: ${order.customerTelegram}\n` : ''}Address: ${order.deliveryAddress}
${order.orderNote ? `Note: ${order.orderNote}\n` : ''}Payment: ${order.paymentMethod === 'aba' ? 'ABA Pay / KHQR' : 'Cash on Delivery'}

Items:
${itemsText}

Total: $${Number(order.total || 0).toFixed(2)}`;
}

import fs from 'fs';
import path from 'path';

function getTelegramConfig() {
  let botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  let chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  let storeUser = process.env.TELEGRAM_STORE_USERNAME?.trim() || 'JangWuJi007';

  // If process.env not loaded yet (Next.js server not restarted), read .env.local directly
  if (!botToken || !chatId) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const tokenMatch = content.match(/TELEGRAM_BOT_TOKEN=["']?([^"'\r\n]+)["']?/);
        const chatMatch = content.match(/TELEGRAM_CHAT_ID=["']?([^"'\r\n]+)["']?/);
        const userMatch = content.match(/TELEGRAM_STORE_USERNAME=["']?([^"'\r\n]+)["']?/);
        if (tokenMatch && tokenMatch[1]) botToken = tokenMatch[1].trim();
        if (chatMatch && chatMatch[1]) chatId = chatMatch[1].trim();
        if (userMatch && userMatch[1]) storeUser = userMatch[1].trim();
      }
    } catch (e) {
      console.warn('Notice reading .env.local:', e.message);
    }
  }

  // Final fallback to user's registered Bot & Chat ID
  if (!botToken) botToken = "8911291412:AAHsXsqBXaW_axvbQhVaOQTAxz9RYNKXJWs";
  if (!chatId) chatId = "1116505751";

  return { botToken, chatId, storeUser };
}

/**
 * Send order notification via Telegram Bot API
 */
export async function sendTelegramOrderNotification(order) {
  const { botToken, chatId, storeUser } = getTelegramConfig();

  const directText = formatTelegramOrderPlainText(order);
  const directTelegramUrl = `https://t.me/${storeUser}?text=${encodeURIComponent(directText)}`;

  try {
    const htmlMessage = formatTelegramOrderHtml(order);
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return {
        sent: true,
        messageId: data.result?.message_id,
        directTelegramUrl,
      };
    } else {
      console.warn('Telegram API response error:', data.description);
      return {
        sent: false,
        error: data.description,
        directTelegramUrl,
      };
    }
  } catch (err) {
    console.error('Error sending Telegram message:', err.message);
    return {
      sent: false,
      error: err.message,
      directTelegramUrl,
    };
  }
}
