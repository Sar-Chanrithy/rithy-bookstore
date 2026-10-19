// src/app/api/sync-books/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from '@/lib/postgres';

export async function GET() {
  if (!isPostgresConfigured()) {
    return NextResponse.json({
      success: false,
      error: 'PostgreSQL database is not configured. Check DATABASE_URL in environment.',
    }, { status: 400 });
  }

  try {
    // 1. Create books table if not exists
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        original_price NUMERIC(10, 2),
        discount INT DEFAULT 0,
        category VARCHAR(100) NOT NULL DEFAULT 'Fantasy',
        sub_category VARCHAR(255),
        rating NUMERIC(2, 1) DEFAULT 4.5,
        reviews_count INT DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        on_sale BOOLEAN DEFAULT FALSE,
        published_year INT DEFAULT 2024,
        publisher VARCHAR(255) DEFAULT 'Bookoe House',
        pages INT DEFAULT 300,
        cover_color VARCHAR(50) DEFAULT '#1e293b',
        cover_gradient TEXT,
        cover_accent VARCHAR(50) DEFAULT '#38bdf8',
        cover_emoji VARCHAR(10) DEFAULT '📖',
        cover_image TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Read all books from src/data/books.json
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'books.json');
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({
        success: false,
        error: 'books.json not found in src/data/',
      }, { status: 404 });
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const books = JSON.parse(fileContent);

    let inserted = 0;
    for (const b of books) {
      const bookId = parseInt(b.id, 10);
      if (isNaN(bookId)) continue;

      await pgQuery(`
        INSERT INTO books (
          id, title, author, price, original_price, discount, category, sub_category,
          rating, reviews_count, featured, on_sale, published_year, publisher, pages,
          cover_color, cover_gradient, cover_accent, cover_emoji, cover_image, description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          discount = EXCLUDED.discount,
          category = EXCLUDED.category,
          sub_category = EXCLUDED.sub_category,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          featured = EXCLUDED.featured,
          on_sale = EXCLUDED.on_sale,
          published_year = EXCLUDED.published_year,
          publisher = EXCLUDED.publisher,
          pages = EXCLUDED.pages,
          cover_color = EXCLUDED.cover_color,
          cover_gradient = EXCLUDED.cover_gradient,
          cover_accent = EXCLUDED.cover_accent,
          cover_emoji = EXCLUDED.cover_emoji,
          cover_image = EXCLUDED.cover_image,
          description = EXCLUDED.description;
      `, [
        bookId,
        b.title || 'Untitled',
        b.author || 'Unknown',
        parseFloat(b.price || 0),
        b.originalPrice ? parseFloat(b.originalPrice) : null,
        parseInt(b.discount || 0, 10),
        b.category || 'General',
        b.subCategory || '',
        parseFloat(b.rating || 4.5),
        parseInt(b.reviewsCount || 0, 10),
        Boolean(b.featured),
        Boolean(b.onSale),
        parseInt(b.publishedYear || 2024, 10),
        b.publisher || 'Bookoe Press',
        parseInt(b.pages || 300, 10),
        b.coverColor || '#1e293b',
        b.coverGradient || '',
        b.coverAccent || '#38bdf8',
        b.coverEmoji || '📖',
        b.coverImage || '',
        b.description || ''
      ]);
      inserted++;
    }

    // 3. Reset serial sequence to max id
    await pgQuery(`
      SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 1));
    `);

    return NextResponse.json({
      success: true,
      message: `🎉 Successfully imported all ${inserted} books into Neon Cloud Database!`,
      totalImported: inserted
    });

  } catch (err) {
    console.error('Import books error:', err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
