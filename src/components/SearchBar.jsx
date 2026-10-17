"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ placeholder = "Search books..." }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="searchbar">
      <span className="searchbar__icon">🔍</span>
      <input
        type="text"
        className="searchbar__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
