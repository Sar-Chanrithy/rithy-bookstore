"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function BookCard({ book }) {
  const { addToCart, toggleWishlist, isBookInWishlist, t } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  if (!book) return null;

  const isLiked = isBookInWishlist(book.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const gradient = book.coverGradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
  const price = Number(book.price || 0).toFixed(2);
  const originalPrice = book.originalPrice ? Number(book.originalPrice).toFixed(2) : null;
  const rating = Number(book.rating || 4.5);
  const stars = Math.round(rating);

  return (
    <div className="bookoe-card">
      <Link href={`/books/${book.id}`} style={{ display: 'contents' }}>
        {/* Book Cover with artistic gradient or real cover image */}
        <div 
          className="bookoe-card__cover"
          style={{ 
            background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : gradient 
          }}
        >
          {/* Sale Discount Badge */}
          {book.onSale && originalPrice && (
            <span 
              className="bookoe-card__sale-badge"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              -${(Number(originalPrice) - Number(price)).toFixed(0)} {t('off', 'OFF')}
            </span>
          )}

          {/* Wishlist Button */}
          <button 
            type="button"
            className={`bookoe-card__wishlist ${isLiked ? 'is-liked' : ''}`}
            onClick={handleWishlist}
            title={isLiked ? t('removedFromWishlist', 'Remove from wishlist') : t('addedToWishlist', 'Add to wishlist')}
          >
            <Heart size={16} fill={isLiked ? '#ffffff' : 'none'} color={isLiked ? '#ffffff' : 'currentColor'} />
          </button>

          {/* Book Cover Content (shown only if no real cover image) */}
          {!book.coverImage && (
            <div className="bookoe-card__cover-content">
              <div className="bookoe-card__emoji">
                {book.coverEmoji || '📖'}
              </div>
              <h4 className="bookoe-card__cover-title">{book.title}</h4>
              <span className="bookoe-card__cover-author">{book.author}</span>
            </div>
          )}

          {/* Hover Overlay with Price & Add to Cart button */}
          <div className="bookoe-card__overlay">
            <div className="bookoe-card__overlay-price">
              ${price}
              {originalPrice && (
                <span className="bookoe-card__overlay-original">${originalPrice}</span>
              )}
            </div>
            <button 
              type="button" 
              className="bookoe-btn-cart"
              onClick={handleCart}
            >
              {justAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
              <span>{justAdded ? t('addedToCart', 'Added to Cart!') : t('addToCart', 'Add to cart')}</span>
            </button>
          </div>
        </div>

        {/* Card Info */}
        <div className="bookoe-card__info">
          <h3 className="bookoe-card__title" title={book.title}>
            {book.title}
          </h3>
          <span className="bookoe-card__category">
            {book.subCategory || book.category || 'General'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.35rem' }}>
            <div className="bookoe-card__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: star <= stars ? '#f59e0b' : '#d1d5db' }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary, #0ea5e9)' }}>${price}</span>
              {originalPrice && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
