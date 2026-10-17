"use client";

import React from 'react';
import Link from 'next/link';

export default function SaleCard({ book }) {
  if (!book) return null;

  const gradient = book.coverGradient || 'linear-gradient(135deg, #431407 0%, #ea580c 100%)';
  const price = Number(book.price || 0).toFixed(1);
  const originalPrice = Number(book.originalPrice || (book.price * 1.5)).toFixed(1);
  const discount = book.discount || Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <Link href={`/books/${book.id}`} className="bookoe-sale-card">
      <div 
        className="bookoe-sale-card__cover"
        style={{ 
          background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : gradient 
        }}
      >
        <span className="bookoe-sale-card__badge">
          {discount}%
        </span>
        {!book.coverImage && (
          <div style={{ zIndex: 2, color: '#fff' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>
              {book.coverEmoji || '📖'}
            </div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.2 }}>
              {book.title}
            </h4>
          </div>
        )}
      </div>

      <div className="bookoe-sale-card__info">
        <h4 className="bookoe-sale-card__title" title={book.title}>
          {book.title}
        </h4>
        <div className="bookoe-sale-card__cat">
          {book.subCategory || book.category}
        </div>
        
        <div className="bookoe-sale-card__bottom">
          <span className="bookoe-sale-card__rating">
            ★ {Number(book.rating || 4.7).toFixed(1)}
          </span>
          <div className="bookoe-sale-card__prices">
            <span>${Number(book.price || 0).toFixed(2)}</span>
            <span className="bookoe-sale-card__original">${Number(book.originalPrice || (book.price * 1.5)).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
