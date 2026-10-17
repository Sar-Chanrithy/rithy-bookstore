// src/app/page.js
import React from 'react';
import Link from 'next/link';
import { getBooks, getSaleBooks } from '@/lib/db';
import SidebarFilter from '@/components/SidebarFilter';
import BookListSection from '@/components/BookListSection';
import SaleSection from '@/components/SaleSection';
import FeaturesStrip from '@/components/FeaturesStrip';
import NewsletterBanner from '@/components/NewsletterBanner';

export default async function HomePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || resolvedParams?.q || '';
  const category = resolvedParams?.category || '';
  const categoriesParam = resolvedParams?.categories || '';
  const categories = categoriesParam ? categoriesParam.split(',') : (category ? [category] : undefined);
  const minPrice = resolvedParams?.minPrice;
  const maxPrice = resolvedParams?.maxPrice;
  const sort = resolvedParams?.sort || 'newest';
  const onSale = resolvedParams?.onSale === 'true' ? true : undefined;
  const featured = resolvedParams?.featured === 'true' ? true : undefined;
  const page = Number(resolvedParams?.page || 1);

  // Fetch filtered books from persistent database
  const booksData = await getBooks({
    search,
    category,
    categories,
    minPrice,
    maxPrice,
    sort,
    onSale,
    featured,
    page,
    pageSize: 12,
  });

  const books = booksData.books || [];
  const totalBooks = booksData.total || books.length;
  const totalPages = booksData.totalPages || 1;

  // Fetch sale books for the "Books on Sale" section
  const saleBooks = await getSaleBooks(8);

  return (
    <div className="bookoe-container">
      {/* Breadcrumb Bar */}
      <nav className="bookoe-breadcrumb">
        <Link href="/">Home</Link>
        <span className="bookoe-breadcrumb__sep">/</span>
        <span className="bookoe-breadcrumb__active">Books</span>
        {search && (
          <>
            <span className="bookoe-breadcrumb__sep">/</span>
            <span>Search: &ldquo;{search}&rdquo;</span>
          </>
        )}
      </nav>

      {/* Main 2-Column Layout */}
      <div className="bookoe-main-layout">
        {/* Left Column: Filter Option Sidebar */}
        <SidebarFilter />

        {/* Right Column: Interactive Books Section */}
        <BookListSection
          initialBooks={books}
          totalBooks={totalBooks}
          currentPage={page}
          totalPages={totalPages}
          currentSort={sort}
        />
      </div>

      {/* "Books on Sale" Carousel Section */}
      <SaleSection saleBooks={saleBooks} />

      {/* 4 Feature Value Proposition Cards */}
      <FeaturesStrip />

      {/* Newsletter Subscription Banner */}
      <NewsletterBanner />
    </div>
  );
}
