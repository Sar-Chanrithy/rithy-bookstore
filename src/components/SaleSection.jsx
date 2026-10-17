"use client";

import React, { useRef } from 'react';
import SaleCard from '@/components/SaleCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useStore } from '@/context/StoreContext';

export default function SaleSection({ saleBooks }) {
  const { t } = useStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bookoe-sale-section">
      <div className="bookoe-section-header">
        <h2 className="bookoe-section-title">{t('booksOnSale', 'Books on Sale')}</h2>
        <div className="bookoe-nav-arrows">
          <button 
            type="button" 
            className="bookoe-arrow-btn" 
            title="Scroll left"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            type="button" 
            className="bookoe-arrow-btn" 
            title="Scroll right"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '1.25rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingBottom: '0.75rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {saleBooks.map((saleBook) => (
          <div key={saleBook.id} style={{ width: 185, minWidth: 185, maxWidth: 185, flex: '0 0 185px', display: 'flex' }}>
            <SaleCard book={saleBook} />
          </div>
        ))}
      </div>
    </section>
  );
}
