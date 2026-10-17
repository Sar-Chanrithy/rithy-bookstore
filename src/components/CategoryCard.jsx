"use client";

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function CategoryCard({ category }) {
  const { t } = useStore();
  if (!category) return null;

  const catKey = 'cat_' + (category.id || category.name || '').toLowerCase().replace(/[^a-z]/g, '');
  const translatedName = t(catKey, category.name);

  return (
    <Link
      href={`/?category=${encodeURIComponent(category.name)}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s',
      }}
    >
      <div 
        style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          marginBottom: '0.85rem'
        }}
      >
        {category.icon || '📚'}
      </div>
      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
        {translatedName}
      </span>
      {category.bookCount !== undefined && (
        <span style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)' }}>
          {category.bookCount} {t('itemCount', 'books')}
        </span>
      )}
    </Link>
  );
}
