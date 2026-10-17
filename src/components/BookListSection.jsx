"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BookCard from '@/components/BookCard';
import Link from 'next/link';
import { LayoutGrid, List, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function BookListSection({ initialBooks, totalBooks, currentPage, totalPages, currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, t } = useStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'week' | 'month'

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Optional filter by tab
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', tab);
    router.push(`/?${params.toString()}`);
  };

  return (
    <main className="bookoe-content">
      {/* Content Header Bar */}
      <div className="bookoe-content-header">
        <div className="bookoe-title-group">
          <h1 className="bookoe-main-title">{t('books', 'Books')}</h1>

          {/* Time Tabs */}
          <div className="bookoe-time-tabs">
            {[
              { id: 'today', label: t('today', 'Today') },
              { id: 'week', label: t('thisWeek', 'This Week') },
              { id: 'month', label: t('thisMonth', 'This Month') }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`bookoe-time-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Controls & Sort */}
        <div className="bookoe-view-controls">
          <button
            type="button"
            className={`bookoe-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            title="Grid View"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            className={`bookoe-view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            title="List View"
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>

          {/* Working Sort Dropdown */}
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="bookoe-sort-select"
          >
            <option value="newest">{t('sortNewest', 'Newest ▾')}</option>
            <option value="price-asc">{t('sortPriceAsc', 'Price: Low to High')}</option>
            <option value="price-desc">{t('sortPriceDesc', 'Price: High to Low')}</option>
            <option value="rating">{t('sortRating', 'Top Rated')}</option>
            <option value="title">{t('sortAlpha', 'A - Z')}</option>
          </select>
        </div>
      </div>

      {/* Books Display: Grid vs List */}
      {initialBooks.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="bookoe-grid-books">
            {initialBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {initialBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Link href={`/books/${book.id}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                    <div
                      style={{
                        width: 65,
                        height: 85,
                        borderRadius: 'var(--radius-xs)',
                        background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : (book.coverGradient || '#1e293b'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        flexShrink: 0,
                      }}
                    >
                      {!book.coverImage && (book.coverEmoji || '📖')}
                    </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }}>
                      {book.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      By {book.author} &bull; <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{book.category}</span>
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {book.description}
                    </p>
                  </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      ${Number(book.price).toFixed(2)}
                    </div>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700 }}>
                      ★ {book.rating || 4.8}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="bookoe-btn-cart"
                    onClick={() => addToCart(book)}
                    style={{ padding: '0.65rem 1.25rem' }}
                  >
                    <ShoppingBag size={15} />
                    <span>{t('addToCart', 'Add to Cart')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('noBooksFound', 'No books found')}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {t('noBooksFoundDesc', "We couldn't find any books matching your criteria.")}
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            <Link
              href="/"
              className="bookoe-btn-refine"
              style={{ display: 'inline-block', width: 'auto', padding: '0.65rem 1.5rem' }}
            >
              {t('clearAll', 'Clear All Filters')}
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bookoe-pagination">
        <span className="bookoe-pagination__info">
          Showing {initialBooks.length} from {totalBooks} data
        </span>

        <div className="bookoe-pagination__buttons">
          <Link
            href={`/?page=${Math.max(1, currentPage - 1)}`}
            className="bookoe-page-btn"
            style={{ opacity: currentPage <= 1 ? 0.5 : 1, pointerEvents: currentPage <= 1 ? 'none' : 'auto' }}
          >
            &lsaquo; Previous
          </Link>
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((pNum) => (
            <Link
              key={pNum}
              href={`/?page=${pNum}`}
              className={`bookoe-page-btn ${currentPage === pNum ? 'is-active' : ''}`}
            >
              {pNum}
            </Link>
          ))}
          <Link
            href={`/?page=${currentPage + 1}`}
            className="bookoe-page-btn"
            style={{ opacity: currentPage >= totalPages ? 0.5 : 1, pointerEvents: currentPage >= totalPages ? 'none' : 'auto' }}
          >
            Next &rsaquo;
          </Link>
        </div>
      </div>
    </main>
  );
}
