"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const CATEGORIES_LIST = [
  'Action', 'Fantasy',
  'Adventure', 'History',
  'Animation', 'Horror',
  'Biography', 'Mystery',
  'Comedy', 'Romance',
  'Crime', 'Sci-fi',
  'Documentary', 'Sport'
];

export default function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useStore();

  // Selected categories from URL or state
  const currentCategory = searchParams.get('category') || '';
  const currentCategories = searchParams.get('categories') ? searchParams.get('categories').split(',') : (currentCategory ? [currentCategory] : []);

  const [selectedCats, setSelectedCats] = useState(currentCategories);
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '400');
  const [editorPicksOpen, setEditorPicksOpen] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [publisherOpen, setPublisherOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [viewMorePicks, setViewMorePicks] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const cats = searchParams.get('categories') ? searchParams.get('categories').split(',') : (cat ? [cat] : []);
    setSelectedCats(cats);
    setPriceMax(searchParams.get('maxPrice') || '400');
  }, [searchParams]);

  const handleCategoryToggle = (cat) => {
    let newCats;
    if (selectedCats.includes(cat)) {
      newCats = selectedCats.filter((c) => c !== cat);
    } else {
      newCats = [...selectedCats, cat];
    }
    setSelectedCats(newCats);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    params.delete('category');
    if (newCats.length > 0) {
      params.set('categories', newCats.join(','));
    } else {
      params.delete('categories');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleRefine = () => {
    const params = new URLSearchParams();
    if (selectedCats.length > 0) {
      params.set('categories', selectedCats.join(','));
    }
    if (priceMax && priceMax !== '400') {
      params.set('maxPrice', priceMax);
    }
    const currentQ = searchParams.get('search');
    if (currentQ) params.set('search', currentQ);

    router.push(`/?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedCats([]);
    setPriceMax('400');
    router.push('/');
  };

  return (
    <aside className="bookoe-sidebar">
      <h3 className="bookoe-sidebar__title">{t('filterOption', 'Filter Option')}</h3>

      {/* 1. Editor Picks */}
      <div className="bookoe-filter-group">
        <div 
          className="bookoe-filter-heading"
          onClick={() => setEditorPicksOpen(!editorPicksOpen)}
        >
          <span>{t('editorPicks', 'Editor Picks')}</span>
          {editorPicksOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {editorPicksOpen && (
          <ul className="bookoe-picks-list">
            <li>
              <div className="bookoe-pick-item is-active">
                <span>• {t('bestSales', 'Best Sales')} (105)</span>
              </div>
              <div className="bookoe-pick-nested">
                <span onClick={() => router.push('/?search=Harry+Potter')}>Harry Potter</span>
                <span onClick={() => router.push('/?search=Lord+of+the+Rings')}>Lord of the Rings</span>
                <span onClick={() => router.push('/?search=Charlie+and+the+Chocolate+Factory')}>Charlie & Chocolate Factory</span>
                <span onClick={() => router.push('/?search=Around+the+World+in+80+Days')}>Around the World in 80 Days</span>
                <span onClick={() => router.push('/?search=The+Hobbit')}>The Hobbit</span>
              </div>
            </li>
            <li className="bookoe-pick-item" onClick={() => router.push('/?sort=rating')}>
              <span>• {t('sortRating', 'Top Rated')} (21)</span>
            </li>
            <li className="bookoe-pick-item" onClick={() => router.push('/?sort=newest')}>
              <span>• {t('sortNewest', 'Newest Books')} (52)</span>
            </li>
            <li className="bookoe-pick-item" onClick={() => router.push('/?featured=true')}>
              <span>• {t('featuredBooks', 'Featured')} (129)</span>
            </li>
            <li className="bookoe-pick-item" onClick={() => router.push('/?sort=rating')}>
              <span>• {t('bestSellers', 'Best Sellers')} (44)</span>
            </li>

            {viewMorePicks && (
              <>
                <li className="bookoe-pick-item" onClick={() => router.push('/?onSale=true')}>
                  <span>• {t('specialOffers', 'Special Deals')} (38)</span>
                </li>
                <li className="bookoe-pick-item" onClick={() => router.push('/?category=Biography')}>
                  <span>• {t('cat_biography', 'Biography')} (15)</span>
                </li>
              </>
            )}

            <span 
              className="bookoe-view-more"
              onClick={() => setViewMorePicks(!viewMorePicks)}
            >
              {viewMorePicks ? 'View less ▴' : `${t('viewAllPicks', 'View more')} ▾`}
            </span>
          </ul>
        )}
      </div>

      {/* 2. Choose Publisher */}
      <div className="bookoe-filter-group">
        <div 
          className="bookoe-filter-heading"
          onClick={() => setPublisherOpen(!publisherOpen)}
        >
          <span>{t('publisher', 'Choose Publisher')}</span>
          {publisherOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {publisherOpen && (
          <div style={{ padding: '0.4rem 0', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-body)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=HarperCollins')}>• HarperCollins</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Scholastic')}>• Scholastic Press</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Puffin')}>• Puffin Books</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Crown')}>• Crown Publishing</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Simon')}>• Simon &amp; Schuster</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Warner')}>• Warner Books</span>
            <span style={{ cursor: 'pointer' }} onClick={() => router.push('/?search=Ghibli')}>• Studio Ghibli</span>
          </div>
        )}
      </div>

      {/* 3. Select Year */}
      <div className="bookoe-filter-group">
        <div 
          className="bookoe-filter-heading"
          onClick={() => setYearOpen(!yearOpen)}
        >
          <span>{t('year', 'Select Year')}</span>
          {yearOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {yearOpen && (
          <div style={{ padding: '0.4rem 0', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['2024', '2023', '2022', '2021', 'Classic'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => router.push(`/?search=${yr}`)}
                style={{ padding: '0.25rem 0.6rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-pill)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Shop by Category (2 columns checkboxes) */}
      <div className="bookoe-filter-group">
        <div 
          className="bookoe-filter-heading"
          onClick={() => setCategoriesOpen(!categoriesOpen)}
        >
          <span>{t('shopByCategory', 'Shop by Category')}</span>
          {categoriesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {categoriesOpen && (
          <div className="bookoe-categories-grid">
            {CATEGORIES_LIST.map((cat) => {
              const isChecked = selectedCats.includes(cat);
              const catKey = 'cat_' + cat.toLowerCase().replace(/[^a-z]/g, '');
              const translatedCat = t(catKey, cat);
              return (
                <label key={cat} className="bookoe-checkbox-label">
                  <input
                    type="checkbox"
                    className="bookoe-checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat)}
                  />
                  <span>{translatedCat}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Price Range */}
      <div className="bookoe-filter-group">
        <div 
          className="bookoe-filter-heading"
          onClick={() => setPriceOpen(!priceOpen)}
        >
          <span>{t('priceRange', 'Price Range')}</span>
          {priceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {priceOpen && (
          <div className="bookoe-price-range">
            <input
              type="range"
              min="10"
              max="400"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="bookoe-price-slider"
            />
            <div className="bookoe-price-pills">
              <span className="bookoe-price-pill">$10</span>
              <span className="bookoe-price-pill" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                ${priceMax}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <button 
        type="button" 
        className="bookoe-btn-refine"
        onClick={handleRefine}
      >
        {t('refineSearch', 'Refine Search')}
      </button>

      <button 
        type="button" 
        className="bookoe-btn-reset"
        onClick={handleReset}
      >
        {t('resetFilter', 'Reset Filter')}
      </button>
    </aside>
  );
}
