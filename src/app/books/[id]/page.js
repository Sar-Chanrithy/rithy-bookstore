// src/app/books/[id]/page.js
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookById, getBooksByCategory, getBooks } from '@/lib/db';
import BookCard from '@/components/BookCard';
import { ArrowLeft, ShoppingBag, Star, Share2, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default async function BookDetailsPage({ params }) {
  const resolvedParams = await params;
  const bookId = resolvedParams?.id;
  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }

  // Get related books from same category
  const allRelated = await getBooks({ category: book.category });
  const relatedBooks = allRelated.filter((b) => String(b.id) !== String(book.id)).slice(0, 4);

  const price = Number(book.price || 0).toFixed(2);
  const originalPrice = book.originalPrice ? Number(book.originalPrice).toFixed(2) : null;
  const gradient = book.coverGradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';

  return (
    <div className="bookoe-container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Breadcrumb */}
      <nav className="bookoe-breadcrumb">
        <Link href="/">Home</Link>
        <span className="bookoe-breadcrumb__sep">/</span>
        <Link href={`/?category=${encodeURIComponent(book.category)}`}>{book.category}</Link>
        <span className="bookoe-breadcrumb__sep">/</span>
        <span className="bookoe-breadcrumb__active">{book.title}</span>
      </nav>

      {/* Main Details Presentation */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginTop: '1rem',
          marginBottom: '4rem',
        }}
      >
        {/* Left: Book Cover Presentation */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 380,
              aspectRatio: '3/4',
              borderRadius: 'var(--radius-lg)',
              background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : gradient,
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Book Spine Texture */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 20,
                height: '100%',
                background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 40%, rgba(0,0,0,0.2) 100%)',
              }}
            />

            {!book.coverImage && (
              <>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                  {book.coverEmoji || '📖'}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  {book.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  By {book.author}
                </p>
              </>
            )}

            {book.onSale && (
              <span
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 24,
                  background: '#ff6b6b',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {book.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Book Details & Purchase Card */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
              {book.category}
            </span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 3 }}>
              ★ {book.rating || 4.8} ({book.reviewsCount || 100}+ reviews)
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {book.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem', marginBottom: '1.5rem' }}>
            Written by <strong style={{ color: 'var(--text-main)' }}>{book.author}</strong> &bull; Published by {book.publisher || 'Bookoe Press'}
          </p>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
              ${price}
            </span>
            {originalPrice && (
              <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${originalPrice}
              </span>
            )}
            {book.onSale && (
              <span style={{ background: '#ffeaa7', color: '#d63031', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>
                Save ${(Number(originalPrice) - Number(price)).toFixed(2)}
              </span>
            )}
          </div>

          {/* Synopsis */}
          <div style={{ background: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Book Synopsis
            </h4>
            <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {book.description ||
                'An extraordinary literary work thoughtfully curated by Bookoe editors. Offers deep insights, captivating character development, and memorable narrative prose.'}
            </p>
          </div>

          {/* Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pages</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>{book.pages || 320}</div>
            </div>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Year</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>{book.publishedYear || 2024}</div>
            </div>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Format</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 2 }}>Hardcover</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={`/cart?add=${book.id}`}
              className="bookoe-btn-refine"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: 'auto', padding: '0.85rem 2rem', margin: 0 }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart &bull; ${price}</span>
            </Link>

            <Link
              href="/"
              className="bookoe-btn-reset"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'auto', padding: '0.85rem 1.5rem' }}
            >
              <ArrowLeft size={16} style={{ marginRight: 6 }} />
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section style={{ marginTop: '3rem' }}>
          <div className="bookoe-section-header">
            <h2 className="bookoe-section-title">More in {book.category}</h2>
            <Link href={`/?category=${encodeURIComponent(book.category)}`} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem' }}>
              View all &rsaquo;
            </Link>
          </div>

          <div className="bookoe-grid-books">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
