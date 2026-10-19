// src/app/categories/page.js
import Link from 'next/link';
import { getCategories } from '@/lib/db';
import CategoryCard from '@/components/CategoryCard';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bookoe-container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <nav className="bookoe-breadcrumb">
        <Link href="/" style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
          🏠 Home
        </Link>
        <span className="bookoe-breadcrumb__sep">/</span>
        <span className="bookoe-breadcrumb__active">Categories</span>
      </nav>

      <div style={{ marginBottom: '2.5rem', marginTop: '0.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore Genres &amp; Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          Discover our curated collection spanning fiction, non-fiction, arts, science, and history.
        </p>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
