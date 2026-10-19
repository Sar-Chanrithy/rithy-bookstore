// src/lib/db.js
import fs from 'fs';
import path from 'path';
import { query as pgQuery, isPostgresConfigured } from './postgres';
import { ensureUsersTableSynced } from './userDb';
import { ensureSubscribersTableSynced } from './subscriberDb';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'books.json');

// Ensure cover images are copied to public/images/books/
export function ensureCoversCopied() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images', 'books');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const uploadDir = 'C:\\Users\\ASUS ROG\\.gemini\\antigravity-ide\\brain\\a7432110-7694-428c-9cc5-33c9ffc1a731\\.user_uploaded';

    const imageMap = [
      { src: path.join(uploadDir, 'media_1792040525377.png'), dest: path.join(destDir, 'the-dragon-king.png') },
      { src: path.join(uploadDir, 'media_1792040591751.png'), dest: path.join(destDir, 'the-haircut.png') },
      { src: path.join(uploadDir, 'media_1792040653418.png'), dest: path.join(destDir, 'all-alone-here.png') },
      { src: path.join(uploadDir, 'media_1792040697575.jpg'), dest: path.join(destDir, 'alice-in-madness.jpg') },
      { src: path.join(uploadDir, 'media_1792040714387.jpg'), dest: path.join(destDir, 'thunder-city.jpg') },
      { src: path.join(uploadDir, 'media_1792041958822.png'), dest: path.join(destDir, 'harry-potter.png') },
      { src: path.join(uploadDir, 'media_1792041993996.png'), dest: path.join(destDir, 'lord-of-the-rings.png') },
      { src: path.join(uploadDir, 'media_1792042395540.jpg'), dest: path.join(destDir, 'charlie-chocolate-factory.jpg') },
      { src: path.join(uploadDir, 'media_1792042415200.png'), dest: path.join(destDir, 'around-the-world-in-80-days.png') },
      { src: path.join(uploadDir, 'media_1792042439168.jpg'), dest: path.join(destDir, 'the-hobbit.jpg') },
      { src: path.join(uploadDir, 'media_1792046229468.png'), dest: path.join(destDir, 'the-bourne-identity.png') },
      { src: path.join(uploadDir, 'media_1792046269182.png'), dest: path.join(destDir, 'jurassic-park.png') },
      { src: path.join(uploadDir, 'media_1792050861682.png'), dest: path.join(destDir, 'romeo-and-juliet.png') },
      { src: path.join(uploadDir, 'media_1792050878426.png'), dest: path.join(destDir, 'titanic.png') },
    ];

    for (const item of imageMap) {
      if (fs.existsSync(item.src) && !fs.existsSync(item.dest)) {
        fs.copyFileSync(item.src, item.dest);
      }
    }
  } catch (err) {
    console.warn('Cover copy notice:', err.message);
  }
}

const ONLINE_COVERS = [
  { 
    file: 'the-notebook.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/8/86/Posternotebook.jpg',
      'https://covers.openlibrary.org/b/id/8231990-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780446605236-L.jpg'
    ] 
  },
  { 
    file: 'me-before-you.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/f/fd/Me_Before_You_%28film%29.jpg',
      'https://covers.openlibrary.org/b/id/7949318-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780143124541-L.jpg'
    ] 
  },
  { 
    file: 'messi.jpg', 
    urls: [
      'https://covers.openlibrary.org/b/id/9266155-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781409146599-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781409146605-L.jpg'
    ] 
  },
  { 
    file: 'the-mamba-mentality.jpg', 
    urls: [
      'https://covers.openlibrary.org/b/id/8885149-L.jpg',
      'https://covers.openlibrary.org/b/id/9082390-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780374201234-L.jpg'
    ] 
  },
  { 
    file: 'sherlock-holmes.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/b/b9/Adventures_of_sherlock_holmes.jpg',
      'https://covers.openlibrary.org/b/id/8315104-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781853260339-L.jpg'
    ] 
  },
  { 
    file: 'gone-girl.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/05/Gone_Girl_Poster.jpg',
      'https://covers.openlibrary.org/b/id/7269865-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg'
    ] 
  },
  { 
    file: 'sapiens.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/06/Sapiens_A_Brief_History_of_Humankind.jpg',
      'https://covers.openlibrary.org/b/id/8750831-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg'
    ] 
  },
  { 
    file: 'into-thin-air.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/46/Into_Thin_Air.jpg',
      'https://covers.openlibrary.org/b/id/240726-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780385494786-L.jpg'
    ] 
  },
  { 
    file: 'diary-of-a-young-girl.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/47/Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg',
      'https://covers.openlibrary.org/b/id/10541707-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg'
    ] 
  },
  { 
    file: 'the-book-thief.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg',
      'https://covers.openlibrary.org/b/id/6513444-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg'
    ] 
  },
  { 
    file: 'spirited-away.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/ms/3/30/Spirited_Away_poster.JPG',
      'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
      'https://covers.openlibrary.org/b/id/6890333-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781569317907-L.jpg'
    ] 
  },
  { 
    file: 'your-name.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png',
      'https://covers.openlibrary.org/b/id/8751540-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780316471862-L.jpg'
    ] 
  },
  { 
    file: 'steve-jobs.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/e/e0/Steve_Jobs_by_Walter_Isaacson.jpg',
      'https://covers.openlibrary.org/b/id/7168051-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg'
    ] 
  },
  { 
    file: 'becoming.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg',
      'https://covers.openlibrary.org/b/id/8643261-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg'
    ] 
  },
  { 
    file: 'diary-of-a-wimpy-kid.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/09/Diary_of_a_wimpy_kid_cover.jpg',
      'https://covers.openlibrary.org/b/id/6487843-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780810993136-L.jpg'
    ] 
  },
  { 
    file: 'hitchhikers-guide.jpg', 
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/b/bd/H2G2_UK_front_cover.jpg',
      'https://covers.openlibrary.org/b/id/6703562-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg'
    ] 
  },
];

let isDownloadingCovers = false;
export async function downloadOnlineCovers() {
  if (isDownloadingCovers) return;
  isDownloadingCovers = true;
  try {
    const destDir = path.join(process.cwd(), 'public', 'images', 'books');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    for (const item of ONLINE_COVERS) {
      const target = path.join(destDir, item.file);
      if (!fs.existsSync(target) || fs.statSync(target).size < 1200) {
        for (const url of item.urls) {
          try {
            const res = await fetch(url, { 
              headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Bookoe/1.0' 
              } 
            });
            if (res.ok) {
              const buf = Buffer.from(await res.arrayBuffer());
              if (buf.length > 1200) {
                fs.writeFileSync(target, buf);
                console.log(`[Cover Downloaded] ${item.file} (${buf.length} bytes)`);
                break;
              }
            }
          } catch (e) {
            // continue to next url
          }
        }
      }
    }
  } catch (err) {
    console.warn('Cover download note:', err.message);
  } finally {
    isDownloadingCovers = false;
  }
}

const DEFAULT_CATEGORIES = [
  { id: 'action', name: 'Action', icon: '⚡' },
  { id: 'adventure', name: 'Adventure', icon: '🧭' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
  { id: 'biography', name: 'Biography', icon: '👤' },
  { id: 'comedy', name: 'Comedy', icon: '🎭' },
  { id: 'crime', name: 'Crime', icon: '🔍' },
  { id: 'documentary', name: 'Documentary', icon: '📽️' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'mystery', name: 'Mystery', icon: '🕵️' },
  { id: 'romance', name: 'Romance', icon: '💖' },
  { id: 'sci-fi', name: 'Sci-fi', icon: '🚀' },
  { id: 'sport', name: 'Sport', icon: '🏆' },
];

/**
 * Map PostgreSQL row object to Book model
 */
function mapPgRowToBook(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title,
    author: row.author,
    price: parseFloat(Number(row.price || 0).toFixed(2)),
    originalPrice: row.original_price ? parseFloat(Number(row.original_price).toFixed(2)) : null,
    discount: Number(row.discount || 0),
    category: row.category,
    subCategory: row.sub_category,
    rating: Number(row.rating || 4.5),
    reviewsCount: Number(row.reviews_count || 0),
    featured: Boolean(row.featured),
    onSale: Boolean(row.on_sale),
    publishedYear: Number(row.published_year || 2024),
    publisher: row.publisher,
    pages: Number(row.pages || 300),
    coverColor: row.cover_color,
    coverGradient: row.cover_gradient,
    coverAccent: row.cover_accent,
    coverEmoji: row.cover_emoji,
    coverImage: row.cover_image,
    description: row.description,
  };
}

/**
 * Read books from JSON file safely (Fallback & Local store)
 */
function readBooksFromFile() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading books.json:', err);
  }
  return [];
}

/**
 * Write books to JSON file safely
 */
function writeBooksToFile(books) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing books.json:', err);
    return false;
  }
}

let pgSynced = false;
async function ensurePgSynced() {
  if (pgSynced || !isPostgresConfigured()) return;
  pgSynced = true;
  try {
    await ensureUsersTableSynced();
    await ensureSubscribersTableSynced();
    // 1. Ensure books table exists
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

    const res = await pgQuery('SELECT COUNT(*) as cnt FROM books');
    // ONLY seed initial books if the PostgreSQL table is completely empty (0 rows)
    if (res && res.rows && Number(res.rows[0]?.cnt) === 0) {
      const booksList = readBooksFromFile();
      for (const b of booksList) {
        await pgQuery(`
          INSERT INTO books (
            id, title, author, price, original_price, discount, category, sub_category,
            rating, reviews_count, featured, on_sale, published_year, publisher, pages,
            cover_color, cover_gradient, cover_accent, cover_emoji, cover_image, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO NOTHING
        `, [
          Number(b.id),
          b.title,
          b.author,
          b.price,
          b.originalPrice,
          b.discount,
          b.category,
          b.subCategory,
          b.rating,
          b.reviewsCount,
          b.featured,
          b.onSale,
          b.publishedYear,
          b.publisher,
          b.pages,
          b.coverColor,
          b.coverGradient,
          b.coverAccent,
          b.coverEmoji,
          b.coverImage,
          b.description
        ]);
      }
      await pgQuery(`SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 1));`);
    }
    pgSynced = true;
  } catch (err) {
    console.warn('ensurePgSynced error:', err.message);
  }
}

/**
 * Get all books with filtering, searching, price range and sorting
 * (Supports both PostgreSQL SQL Query and JSON file fallback)
 */
export async function getBooks(options = {}) {
  const {
    search,
    category,
    categories,
    minPrice,
    maxPrice,
    featured,
    onSale,
    sort = 'newest',
    limit,
    page,
    pageSize = 12,
  } = options;

  // 1. Try PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      await ensurePgSynced();
      let sql = 'SELECT * FROM books WHERE 1=1';
      const params = [];
      let paramIdx = 1;

      if (categories && Array.isArray(categories) && categories.length > 0) {
        sql += ` AND LOWER(category) = ANY($${paramIdx})`;
        params.push(categories.map((c) => c.toLowerCase()));
        paramIdx++;
      } else if (category && category.toLowerCase() !== 'all') {
        sql += ` AND LOWER(category) = LOWER($${paramIdx})`;
        params.push(category);
        paramIdx++;
      }

      if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        sql += ` AND price >= $${paramIdx}`;
        params.push(Number(minPrice));
        paramIdx++;
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        sql += ` AND price <= $${paramIdx}`;
        params.push(Number(maxPrice));
        paramIdx++;
      }

      if (search && search.trim() !== '') {
        sql += ` AND (LOWER(title) LIKE $${paramIdx} OR LOWER(author) LIKE $${paramIdx} OR LOWER(category) LIKE $${paramIdx} OR LOWER(publisher) LIKE $${paramIdx} OR LOWER(description) LIKE $${paramIdx})`;
        params.push(`%${search.toLowerCase().trim()}%`);
        paramIdx++;
      }

      if (typeof featured === 'boolean') {
        sql += ` AND featured = $${paramIdx}`;
        params.push(featured);
        paramIdx++;
      }

      if (typeof onSale === 'boolean') {
        sql += ` AND on_sale = $${paramIdx}`;
        params.push(onSale);
        paramIdx++;
      }

      // Sorting
      switch (sort) {
        case 'price-asc':
          sql += ' ORDER BY price ASC';
          break;
        case 'price-desc':
          sql += ' ORDER BY price DESC';
          break;
        case 'rating':
          sql += ' ORDER BY rating DESC';
          break;
        case 'title':
          sql += ' ORDER BY title ASC';
          break;
        case 'newest':
        default:
          sql += ' ORDER BY id DESC';
          break;
      }

      // Pagination
      if (page && Number(page) > 0) {
        const countRes = await pgQuery(`SELECT COUNT(*) FROM (${sql}) as sub`, params);
        const total = parseInt(countRes.rows[0].count, 10);
        const p = Number(page);
        const size = Number(pageSize);
        const offset = (p - 1) * size;

        sql += ` LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
        params.push(size, offset);

        const dataRes = await pgQuery(sql, params);
        const pgMapped = dataRes.rows.map(mapPgRowToBook);
        if (total > 0 && pgMapped.length > 0) {
          return {
            books: pgMapped,
            total,
            page: p,
            pageSize: size,
            totalPages: Math.ceil(total / size),
          };
        }

        // If user specifically filtered and got 0 results, return empty
        const hasFilters = Boolean(search || category || (categories && categories.length > 0) || minPrice || maxPrice || typeof featured === 'boolean' || typeof onSale === 'boolean');
        if (hasFilters) {
          return {
            books: [],
            total: 0,
            page: p,
            pageSize: size,
            totalPages: 1,
          };
        }
        // Otherwise, table might be unpopulated, drop through to JSON fallback!
      } else {
        if (limit && Number(limit) > 0) {
          sql += ` LIMIT $${paramIdx}`;
          params.push(Number(limit));
        }

        const res = await pgQuery(sql, params);
        const pgMapped = res.rows.map(mapPgRowToBook);
        if (pgMapped.length > 0) {
          return pgMapped;
        }
      }
    } catch (pgErr) {
      console.warn('PostgreSQL query note (using JSON fallback):', pgErr.message);
    }
  }

  // 2. Local JSON File-based DB Fallback
  let result = readBooksFromFile();

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const lowerCats = categories.map((c) => c.toLowerCase());
    result = result.filter((b) =>
      lowerCats.includes((b.category || '').toLowerCase())
    );
  } else if (category && category.toLowerCase() !== 'all') {
    result = result.filter(
      (b) => (b.category || '').toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    result = result.filter((b) => Number(b.price) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    result = result.filter((b) => Number(b.price) <= Number(maxPrice));
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (b) =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.subCategory || '').toLowerCase().includes(q) ||
        (b.publisher || '').toLowerCase().includes(q) ||
        String(b.publishedYear || '').includes(q) ||
        (b.description || '').toLowerCase().includes(q)
    );
  }

  if (typeof featured === 'boolean') {
    result = result.filter((b) => b.featured === featured);
  }

  if (typeof onSale === 'boolean') {
    result = result.filter((b) => Boolean(b.onSale) === onSale);
  }

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'rating':
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case 'title':
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      break;
    case 'newest':
    default:
      result.sort((a, b) => Number(b.id) - Number(a.id));
      break;
  }

  const total = result.length;

  if (page && Number(page) > 0) {
    const p = Number(page);
    const size = Number(pageSize);
    const start = (p - 1) * size;
    result = result.slice(start, start + size);
    return {
      books: result,
      total,
      page: p,
      pageSize: size,
      totalPages: Math.ceil(total / size),
    };
  }

  if (limit && Number(limit) > 0) {
    result = result.slice(0, Number(limit));
  }

  return result;
}

/**
 * Get a single book by ID
 */
export async function getBookById(id) {
  if (!id) return null;

  if (isPostgresConfigured()) {
    try {
      const parsedId = parseInt(id, 10);
      const res = isNaN(parsedId)
        ? await pgQuery('SELECT * FROM books WHERE id::text = $1', [String(id)])
        : await pgQuery('SELECT * FROM books WHERE id = $1', [parsedId]);

      if (res.rows.length > 0) {
        return mapPgRowToBook(res.rows[0]);
      }
    } catch (pgErr) {
      console.warn('PostgreSQL getBookById note:', pgErr.message);
    }
  }

  const books = readBooksFromFile();
  return books.find((b) => String(b.id) === String(id)) || null;
}

/**
 * Get featured books
 */
export async function getFeaturedBooks(limit = 8) {
  return getBooks({ featured: true, limit });
}

/**
 * Get books on sale
 */
export async function getSaleBooks(limit = 6) {
  return getBooks({ onSale: true, limit });
}

/**
 * Get categories with dynamic book count
 */
export async function getCategories() {
  const books = await getBooks({ limit: 500 });
  const bookList = Array.isArray(books) ? books : (books.books || []);

  return DEFAULT_CATEGORIES.map((cat) => {
    const count = bookList.filter(
      (b) => (b.category || '').toLowerCase() === cat.name.toLowerCase()
    ).length;
    return {
      ...cat,
      bookCount: count,
    };
  });
}

/**
 * CRUD: CREATE a new book (Dual sync: JSON file and PostgreSQL)
 */
export async function createBook(bookData) {
  const price = Number(bookData.price) || 0;
  const originalPrice = Number(bookData.originalPrice) || (price * 1.3);
  const discount = bookData.discount !== undefined
    ? Number(bookData.discount)
    : Math.round(((originalPrice - price) / originalPrice) * 100);

  const books = readBooksFromFile();
  const maxId = books.reduce((max, b) => {
    const num = parseInt(b.id, 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const newId = String(maxId + 1);

  const newBook = {
    id: newId,
    title: bookData.title?.trim() || 'Untitled Book',
    author: bookData.author?.trim() || 'Anonymous Author',
    price: parseFloat(price.toFixed(2)),
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    discount: Math.max(0, discount),
    category: bookData.category || 'Action',
    subCategory: bookData.subCategory || `${(bookData.category || 'General').toUpperCase()}, FICTION`,
    rating: Number(bookData.rating) || 4.5,
    reviewsCount: Number(bookData.reviewsCount) || 1,
    featured: Boolean(bookData.featured),
    onSale: Boolean(bookData.onSale),
    publishedYear: Number(bookData.publishedYear) || new Date().getFullYear(),
    publisher: bookData.publisher || 'Bookoe House',
    pages: Number(bookData.pages) || 280,
    coverColor: bookData.coverColor || '#1e293b',
    coverGradient: bookData.coverGradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    coverAccent: bookData.coverAccent || '#38bdf8',
    coverEmoji: bookData.coverEmoji || '📖',
    coverImage: bookData.coverImage || null,
    description: bookData.description || 'An extraordinary book from Bookoe collection.',
  };

  // 1. Always save to local JSON file store
  books.unshift(newBook);
  writeBooksToFile(books);

  // 2. Also save to PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      const sql = `
        INSERT INTO books (
          id, title, author, price, original_price, discount, category, sub_category,
          rating, reviews_count, featured, on_sale, published_year, publisher, pages,
          cover_color, cover_gradient, cover_accent, cover_emoji, cover_image, description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          discount = EXCLUDED.discount,
          category = EXCLUDED.category,
          sub_category = EXCLUDED.sub_category,
          rating = EXCLUDED.rating,
          featured = EXCLUDED.featured,
          on_sale = EXCLUDED.on_sale,
          cover_image = EXCLUDED.cover_image,
          description = EXCLUDED.description
      `;
      await pgQuery(sql, [
        Number(newBook.id),
        newBook.title,
        newBook.author,
        newBook.price,
        newBook.originalPrice,
        newBook.discount,
        newBook.category,
        newBook.subCategory,
        newBook.rating,
        newBook.reviewsCount,
        newBook.featured,
        newBook.onSale,
        newBook.publishedYear,
        newBook.publisher,
        newBook.pages,
        newBook.coverColor,
        newBook.coverGradient,
        newBook.coverAccent,
        newBook.coverEmoji,
        newBook.coverImage,
        newBook.description,
      ]);
    } catch (pgErr) {
      console.warn('PostgreSQL createBook note:', pgErr.message);
    }
  }

  return newBook;
}

/**
 * CRUD: UPDATE an existing book (Dual sync: JSON file and PostgreSQL)
 */
export async function updateBook(id, bookData) {
  if (!id) return null;

  // 1. Always update local JSON file store
  const books = readBooksFromFile();
  const index = books.findIndex((b) => String(b.id) === String(id));
  let current = index !== -1 ? books[index] : null;

  if (!current && isPostgresConfigured()) {
    try {
      const parsedId = parseInt(id, 10);
      const res = isNaN(parsedId)
        ? await pgQuery('SELECT * FROM books WHERE id::text = $1', [String(id)])
        : await pgQuery('SELECT * FROM books WHERE id = $1', [parsedId]);
      if (res.rows.length > 0) {
        current = mapPgRowToBook(res.rows[0]);
      }
    } catch (e) {
      console.warn('PG lookup in updateBook:', e.message);
    }
  }

  if (!current) return null;

  const updatedPrice = bookData.price !== undefined ? Number(bookData.price) : current.price;
  const updatedOriginalPrice = bookData.originalPrice !== undefined ? Number(bookData.originalPrice) : current.originalPrice;

  const updated = {
    ...current,
    ...bookData,
    id: current.id,
    title: bookData.title !== undefined ? bookData.title.trim() : current.title,
    author: bookData.author !== undefined ? bookData.author.trim() : current.author,
    price: parseFloat(Number(updatedPrice).toFixed(2)),
    originalPrice: parseFloat(Number(updatedOriginalPrice).toFixed(2)),
    discount: bookData.discount !== undefined ? Number(bookData.discount) : current.discount,
    category: bookData.category || current.category,
    subCategory: bookData.subCategory !== undefined ? bookData.subCategory : current.subCategory,
    rating: bookData.rating !== undefined ? Number(bookData.rating) : current.rating,
    featured: bookData.featured !== undefined ? Boolean(bookData.featured) : current.featured,
    onSale: bookData.onSale !== undefined ? Boolean(bookData.onSale) : current.onSale,
    coverImage: bookData.coverImage !== undefined ? bookData.coverImage : current.coverImage,
    description: bookData.description !== undefined ? bookData.description : current.description,
  };

  if (index !== -1) {
    books[index] = updated;
  } else {
    books.unshift(updated);
  }
  writeBooksToFile(books);

  // 2. Also update PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      const parsedId = parseInt(id, 10);
      const fields = [];
      const params = [];
      let idx = 1;

      if (bookData.title !== undefined) { fields.push(`title = $${idx++}`); params.push(bookData.title.trim()); }
      if (bookData.author !== undefined) { fields.push(`author = $${idx++}`); params.push(bookData.author.trim()); }
      if (bookData.price !== undefined) { fields.push(`price = $${idx++}`); params.push(Number(bookData.price)); }
      if (bookData.originalPrice !== undefined) { fields.push(`original_price = $${idx++}`); params.push(Number(bookData.originalPrice)); }
      if (bookData.discount !== undefined) { fields.push(`discount = $${idx++}`); params.push(Number(bookData.discount)); }
      if (bookData.category !== undefined) { fields.push(`category = $${idx++}`); params.push(bookData.category); }
      if (bookData.subCategory !== undefined) { fields.push(`sub_category = $${idx++}`); params.push(bookData.subCategory); }
      if (bookData.rating !== undefined) { fields.push(`rating = $${idx++}`); params.push(Number(bookData.rating)); }
      if (bookData.featured !== undefined) { fields.push(`featured = $${idx++}`); params.push(Boolean(bookData.featured)); }
      if (bookData.onSale !== undefined) { fields.push(`on_sale = $${idx++}`); params.push(Boolean(bookData.onSale)); }
      if (bookData.description !== undefined) { fields.push(`description = $${idx++}`); params.push(bookData.description); }
      if (bookData.coverImage !== undefined) { fields.push(`cover_image = $${idx++}`); params.push(bookData.coverImage); }

      if (fields.length > 0) {
        params.push(isNaN(parsedId) ? String(id) : parsedId);
        const sql = `UPDATE books SET ${fields.join(', ')} WHERE id = $${idx}`;
        await pgQuery(sql, params);
      }
    } catch (pgErr) {
      console.warn('PostgreSQL updateBook note:', pgErr.message);
    }
  }

  return updated;
}

/**
 * CRUD: DELETE a book (Dual sync: JSON file and PostgreSQL)
 */
export async function deleteBook(id) {
  if (!id) return false;

  // 1. Delete from local JSON file store
  const books = readBooksFromFile();
  const filtered = books.filter((b) => String(b.id) !== String(id));
  const changed = filtered.length !== books.length;
  if (changed) {
    writeBooksToFile(filtered);
  }

  // 2. Delete from PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      const parsedId = parseInt(id, 10);
      const sql = isNaN(parsedId) ? 'DELETE FROM books WHERE id::text = $1' : 'DELETE FROM books WHERE id = $1';
      await pgQuery(sql, [isNaN(parsedId) ? String(id) : parsedId]);
    } catch (pgErr) {
      console.warn('PostgreSQL deleteBook note:', pgErr.message);
    }
  }

  return changed;
}

/**
 * Get Database summary statistics for Admin dashboard
 */
export async function getDbStats() {
  if (isPostgresConfigured()) {
    try {
      const res = await pgQuery(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE on_sale = TRUE) as on_sale_count,
          COUNT(*) FILTER (WHERE featured = TRUE) as featured_count,
          COALESCE(AVG(rating), 0) as avg_rating,
          COALESCE(SUM(price), 0) as total_inventory
        FROM books
      `);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          totalBooks: parseInt(row.total, 10),
          onSaleCount: parseInt(row.on_sale_count, 10),
          featuredCount: parseInt(row.featured_count, 10),
          avgRating: parseFloat(Number(row.avg_rating).toFixed(1)),
          totalInventory: parseFloat(Number(row.total_inventory).toFixed(2)),
          categoriesCount: DEFAULT_CATEGORIES.length,
          databaseType: 'PostgreSQL',
        };
      }
    } catch (pgErr) {
      console.warn('PostgreSQL getDbStats note:', pgErr.message);
    }
  }

  // File fallback
  const books = readBooksFromFile();
  const total = books.length;
  const onSaleCount = books.filter((b) => b.onSale).length;
  const featuredCount = books.filter((b) => b.featured).length;
  const avgRating = total > 0
    ? (books.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / total).toFixed(1)
    : '0.0';
  const totalInventory = books.reduce((acc, b) => acc + (Number(b.price) || 0), 0).toFixed(2);

  return {
    totalBooks: total,
    onSaleCount,
    featuredCount,
    avgRating,
    totalInventory,
    categoriesCount: DEFAULT_CATEGORIES.length,
    databaseType: 'JSON File System (Fallback)',
  };
}
