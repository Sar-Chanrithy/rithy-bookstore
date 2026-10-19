"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Sparkles, 
  Tag, 
  Star, 
  BookOpen,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Clock
} from 'lucide-react';

const CATEGORIES = [
  'Action', 'Adventure', 'Animation', 'Biography',
  'Comedy', 'Crime', 'Documentary', 'Fantasy',
  'History', 'Horror', 'Mystery', 'Romance',
  'Sci-fi', 'Sport'
];

const GRADIENT_PRESETS = [
  { name: 'Dark Slate', grad: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', color: '#1e293b', accent: '#38bdf8' },
  { name: 'Ocean Cyan', grad: 'linear-gradient(135deg, #0c2b3e 0%, #155e75 60%, #0e7490 100%)', color: '#0f3a52', accent: '#38bdf8' },
  { name: 'Obsidian Crimson', grad: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)', color: '#18181b', accent: '#f43f5e' },
  { name: 'Warm Amber', grad: 'linear-gradient(135deg, #271406 0%, #78350f 60%, #b45309 100%)', color: '#451a03', accent: '#fbbf24' },
  { name: 'Midnight Violet', grad: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #6366f1 100%)', color: '#1e1b4b', accent: '#c7d2fe' },
  { name: 'Forest Emerald', grad: 'linear-gradient(135deg, #022c22 0%, #065f46 60%, #059669 100%)', color: '#064e3b', accent: '#6ee7b7' },
  { name: 'Sunset Rose', grad: 'linear-gradient(135deg, #500724 0%, #9d174d 60%, #be185d 100%)', color: '#831843', accent: '#f472b6' }
];

export default function AdminPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Support Messages Modal State
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    category: 'Action',
    subCategory: '',
    price: 39.99,
    originalPrice: 59.99,
    discount: 30,
    rating: 4.8,
    reviewsCount: 120,
    publishedYear: 2024,
    publisher: 'Bookoe Press',
    pages: 320,
    coverEmoji: '📖',
    coverImage: '',
    coverGradient: GRADIENT_PRESETS[0].grad,
    coverColor: GRADIENT_PRESETS[0].color,
    coverAccent: GRADIENT_PRESETS[0].accent,
    description: '',
    featured: false,
    onSale: false,
  });

  const [dbType, setDbType] = useState('JSON File System (Fallback)');

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const [resBooks, resStats] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/stats')
      ]);
      const dataBooks = await resBooks.json();
      if (dataBooks.success) {
        setBooks(dataBooks.data || []);
      }
      const dataStats = await resStats.json();
      if (dataStats.success && dataStats.data?.databaseType) {
        setDbType(dataStats.data.databaseType);
      }
    } catch (err) {
      console.error('Failed to load books:', err);
      showToast('Failed to load database books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [syncing, setSyncing] = useState(false);

  // Sync / Import all 43 books to Neon Cloud PostgreSQL
  const handleSyncBooks = async () => {
    try {
      setSyncing(true);
      showToast('Importing all 43 books into Neon Cloud Database... ⏳');
      const res = await fetch('/api/sync-books');
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Successfully synced all books to Neon!');
        await fetchBooks();
      } else {
        showToast(data.error || 'Sync failed', 'error');
      }
    } catch (err) {
      showToast('Error syncing books: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      title: '',
      author: '',
      category: 'Action',
      subCategory: 'ADVENTURE, SCIENCE, FICTION',
      price: 39.99,
      originalPrice: 59.99,
      discount: 33,
      rating: 4.8,
      reviewsCount: 45,
      publishedYear: 2024,
      publisher: 'Bookoe Press',
      pages: 320,
      coverEmoji: '📖',
      coverImage: '',
      coverGradient: GRADIENT_PRESETS[0].grad,
      coverColor: GRADIENT_PRESETS[0].color,
      coverAccent: GRADIENT_PRESETS[0].accent,
      description: 'An exceptional new title added to Bookoe library.',
      featured: false,
      onSale: false,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (book) => {
    setIsEditing(true);
    setFormData({
      id: book.id,
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Action',
      subCategory: book.subCategory || '',
      price: book.price || 0,
      originalPrice: book.originalPrice || (book.price * 1.3),
      discount: book.discount || 0,
      rating: book.rating || 4.5,
      reviewsCount: book.reviewsCount || 10,
      publishedYear: book.publishedYear || 2024,
      publisher: book.publisher || 'Bookoe Press',
      pages: book.pages || 300,
      coverEmoji: book.coverEmoji || '📖',
      coverImage: book.coverImage || '',
      coverGradient: book.coverGradient || GRADIENT_PRESETS[0].grad,
      coverColor: book.coverColor || GRADIENT_PRESETS[0].color,
      coverAccent: book.coverAccent || GRADIENT_PRESETS[0].accent,
      description: book.description || '',
      featured: Boolean(book.featured),
      onSale: Boolean(book.onSale),
    });
    setIsModalOpen(true);
  };

  // Smart image compression: Resizes large images to max 600x900 & compresses to lightweight JPEG (~40-60KB)
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const maxWidth = 600;
          const maxHeight = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Quality 0.82 produces sharp covers under 60KB
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed);
        };
        img.onerror = () => reject(new Error('Failed to load image file'));
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
    });
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size must be under 15MB', 'error');
      return;
    }

    try {
      setIsCompressing(true);
      showToast('Optimizing cover picture... ⚡');
      const compressedDataUrl = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        coverImage: compressedDataUrl,
      }));
      showToast('Cover picture optimized & ready! 🖼️');
    } catch (err) {
      console.error('Image compression error:', err);
      showToast('Could not process image: ' + err.message, 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit Add or Edit (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      showToast('Please fill in title and price', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing) {
        // UPDATE (PUT)
        const res = await fetch(`/api/books/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await res.json();
        if (resData.success) {
          showToast(`Book "${formData.title}" updated successfully!`);
          setIsModalOpen(false);
          await fetchBooks();
        } else {
          showToast(resData.error || 'Update failed', 'error');
        }
      } else {
        // CREATE (POST)
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resData = await res.json();
        if (resData.success) {
          showToast(`Book "${formData.title}" added to database!`);
          setIsModalOpen(false);
          await fetchBooks();
        } else {
          showToast(resData.error || 'Creation failed', 'error');
        }
      }
    } catch (err) {
      showToast('Network error while saving book', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Book (DELETE)
  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the database?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Book "${title}" deleted successfully!`);
        setBooks(books.filter((b) => String(b.id) !== String(id)));
      } else {
        showToast(data.error || 'Failed to delete book', 'error');
      }
    } catch (err) {
      showToast('Error deleting book', 'error');
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.contacts || []);
      }
    } catch (err) {
      console.error('Error fetching support messages:', err);
      showToast('Failed to load support messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleOpenMessages = () => {
    setIsMessagesOpen(true);
    fetchMessages();
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => String(m.id) !== String(id)));
        showToast('Support message deleted successfully!');
      } else {
        showToast(data.error || 'Failed to delete message', 'error');
      }
    } catch (err) {
      showToast('Error deleting message', 'error');
    }
  };

  // Filtered books for table
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      filterCategory === 'All' ||
      book.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Database Stats
  const totalBooks = books.length;
  const onSaleCount = books.filter((b) => b.onSale).length;
  const featuredCount = books.filter((b) => b.featured).length;
  const totalValue = books.reduce((acc, b) => acc + (Number(b.price) || 0), 0).toFixed(2);

  return (
    <div className="bookoe-container bookoe-admin-page">
      {/* Toast Notification */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            background: toast.type === 'error' ? '#ef4444' : '#10b981',
            color: '#fff',
            padding: '0.8rem 1.4rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bookoe-admin-header">
        <div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Backend Database CRUD</h1>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              background: dbType.toLowerCase().includes('postgres') ? '#dbeafe' : '#dcfce7', 
              color: dbType.toLowerCase().includes('postgres') ? '#1d4ed8' : '#15803d', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              padding: '0.25rem 0.65rem', 
              borderRadius: 'var(--radius-pill)' 
            }}>
              <Database size={13} /> {dbType}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Full CRUD operations connected with PostgreSQL and automatic JSON file persistence fallback.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={handleSyncBooks}
            disabled={syncing}
            style={{ 
              width: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.3rem', 
              margin: 0,
              background: syncing ? '#94a3b8' : '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: syncing ? 'not-allowed' : 'pointer',
              fontSize: '0.88rem'
            }}
          >
            <Sparkles size={18} />
            <span>{syncing ? 'Importing...' : 'Sync 43 Books to Cloud ☁️'}</span>
          </button>

          <button 
            type="button" 
            onClick={handleOpenMessages}
            style={{ 
              width: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.3rem', 
              margin: 0,
              background: '#f8fafc',
              color: '#0f172a',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            <Mail size={18} color="var(--primary)" />
            <span>Support Inquiries 📩</span>
          </button>

          <button 
            type="button" 
            className="bookoe-btn-refine"
            onClick={handleOpenAdd}
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem', margin: 0 }}
          >
            <Plus size={18} />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Metrics / Stats Cards */}
      <div className="bookoe-admin-stats">
        <div className="bookoe-stat-card">
          <span className="bookoe-stat-card__label">Total Books</span>
          <div className="bookoe-stat-card__value">{totalBooks}</div>
          <span className="bookoe-stat-card__sub">Stored in books.json</span>
        </div>

        <div className="bookoe-stat-card">
          <span className="bookoe-stat-card__label">Books on Sale</span>
          <div className="bookoe-stat-card__value" style={{ color: '#ff7675' }}>{onSaleCount}</div>
          <span className="bookoe-stat-card__sub">Special discount active</span>
        </div>

        <div className="bookoe-stat-card">
          <span className="bookoe-stat-card__label">Featured Picks</span>
          <div className="bookoe-stat-card__value" style={{ color: 'var(--primary)' }}>{featuredCount}</div>
          <span className="bookoe-stat-card__sub">Highlighted in storefront</span>
        </div>

        <div className="bookoe-stat-card">
          <span className="bookoe-stat-card__label">Inventory Value</span>
          <div className="bookoe-stat-card__value">${totalValue}</div>
          <span className="bookoe-stat-card__sub">Across all {CATEGORIES.length} genres</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bookoe-table-card">
        {/* Search & Filter Toolbar */}
        <div className="bookoe-table-header">
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search books, author, genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.4rem',
                border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Genre:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bookoe-sort-select"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Database Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="bookoe-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book & Author</th>
                <th>Category</th>
                <th>Price / Discount</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading database records...
                  </td>
                </tr>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      #{book.id}
                    </td>
                    <td>
                      <div className="bookoe-table-book">
                        <div 
                          className="bookoe-table-thumb"
                          style={{ 
                            background: book.coverImage ? `url(${book.coverImage}) center/cover no-repeat` : (book.coverGradient || '#1e293b') 
                          }}
                        >
                          {!book.coverImage && (book.coverEmoji || '📖')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{book.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ background: 'var(--bg-muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {book.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800 }}>${Number(book.price).toFixed(2)}</div>
                      {book.onSale && (
                        <div style={{ fontSize: '0.72rem', color: '#ff7675', fontWeight: 700 }}>
                          {book.discount}% OFF (${Number(book.originalPrice).toFixed(2)})
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>★ {book.rating}</span>
                      <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginLeft: 4 }}>({book.reviewsCount})</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {book.featured && (
                          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>
                            ⭐ Featured
                          </span>
                        )}
                        {book.onSale && (
                          <span style={{ background: '#ffeaa7', color: '#d63031', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>
                            🏷️ Sale
                          </span>
                        )}
                        {!book.featured && !book.onSale && (
                          <span style={{ color: 'var(--text-faint)', fontSize: '0.75rem' }}>Regular</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="bookoe-action-btn bookoe-action-btn--edit"
                        onClick={() => handleOpenEdit(book)}
                        title="Edit book"
                      >
                        <Edit3 size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="bookoe-action-btn bookoe-action-btn--delete"
                        onClick={() => handleDelete(book.id, book.title)}
                        title="Delete book"
                      >
                        <Trash2 size={13} style={{ display: 'inline', marginRight: 4 }} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No books found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL */}
      {isModalOpen && (
        <div className="bookoe-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="bookoe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bookoe-modal__header">
              <h2 className="bookoe-modal__title">
                {isEditing ? `Edit Book (#${formData.id})` : 'Create New Book'}
              </h2>
              <button 
                type="button" 
                className="bookoe-modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bookoe-form-grid">
                {/* Title */}
                <div className="bookoe-form-group bookoe-form-full">
                  <label className="bookoe-form-label">Book Title *</label>
                  <input
                    type="text"
                    required
                    className="bookoe-form-input"
                    placeholder="e.g. Thunder Stunt"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Author */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Author Name *</label>
                  <input
                    type="text"
                    required
                    className="bookoe-form-input"
                    placeholder="e.g. Marcus Vance"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Primary Category *</label>
                  <select
                    className="bookoe-form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* SubCategory */}
                <div className="bookoe-form-group bookoe-form-full">
                  <label className="bookoe-form-label">Sub-Categories / Tags</label>
                  <input
                    type="text"
                    className="bookoe-form-input"
                    placeholder="e.g. ADVENTURE, SCIENCE, COMEDY"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  />
                </div>

                {/* Price */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Sale Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="bookoe-form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {/* Original Price */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="bookoe-form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>

                {/* Rating */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    className="bookoe-form-input"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>

                {/* Emoji Icon */}
                <div className="bookoe-form-group">
                  <label className="bookoe-form-label">Cover Emoji Icon</label>
                  <input
                    type="text"
                    className="bookoe-form-input"
                    value={formData.coverEmoji}
                    onChange={(e) => setFormData({ ...formData, coverEmoji: e.target.value })}
                  />
                </div>

                {/* Book Cover Picture (File Upload or URL) */}
                <div className="bookoe-form-group bookoe-form-full">
                  <label className="bookoe-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Book Cover Picture (Upload File or Paste Link)</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Supports JPG, PNG, WebP or Web URL</span>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {/* Paste URL */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="bookoe-form-input"
                        placeholder="Paste image URL (e.g. https://... or /images/books/...)"
                        value={formData.coverImage || ''}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        style={{ paddingLeft: '2.3rem' }}
                      />
                      <LinkIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    </div>

                    {/* Upload File button & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          border: '1px dashed var(--primary)',
                          transition: 'all 0.15s ease',
                          opacity: isCompressing ? 0.6 : 1,
                          pointerEvents: isCompressing ? 'none' : 'auto',
                        }}
                      >
                        <Upload size={15} />
                        <span>{isCompressing ? 'Compressing Picture... ⏳' : 'Upload Picture from Computer'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isCompressing}
                          onChange={handleImageFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: '#fee2e2',
                            color: '#ef4444',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove Picture</span>
                        </button>
                      )}
                    </div>

                    {/* Live Thumbnail Preview */}
                    {formData.coverImage && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 72,
                            borderRadius: 4,
                            background: `url(${formData.coverImage}) center/cover no-repeat`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            flexShrink: 0,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            ✓ Picture Active for Book Cover
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {formData.coverImage.startsWith('data:') ? 'Uploaded local image file (Base64 ready)' : formData.coverImage}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Theme Preset */}
                <div className="bookoe-form-group bookoe-form-full">
                  <label className="bookoe-form-label">Cover Art Color Gradient Preset</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.2rem' }}>
                    {GRADIENT_PRESETS.map((preset) => {
                      const isSelected = formData.coverGradient === preset.grad;
                      return (
                        <div
                          key={preset.name}
                          onClick={() => setFormData({
                            ...formData,
                            coverGradient: preset.grad,
                            coverColor: preset.color,
                            coverAccent: preset.accent,
                          })}
                          style={{
                            background: preset.grad,
                            height: 38,
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            boxShadow: isSelected ? '0 0 0 2px #fff' : 'none',
                          }}
                        >
                          {preset.name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="bookoe-form-group bookoe-form-full">
                  <label className="bookoe-form-label">Description</label>
                  <textarea
                    className="bookoe-form-textarea"
                    placeholder="Synopsis and editorial review..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Checkboxes: Featured & On Sale */}
                <div className="bookoe-form-group bookoe-form-full" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label className="bookoe-checkbox-label">
                    <input
                      type="checkbox"
                      className="bookoe-checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span style={{ fontWeight: 700 }}>Featured in Editor Picks</span>
                  </label>

                  <label className="bookoe-checkbox-label">
                    <input
                      type="checkbox"
                      className="bookoe-checkbox"
                      checked={formData.onSale}
                      onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                    />
                    <span style={{ fontWeight: 700, color: '#ff7675' }}>🏷️ Put On Sale Section</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="bookoe-modal__actions">
                <button
                  type="button"
                  className="bookoe-btn-reset"
                  style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="bookoe-btn-refine"
                  style={{ 
                    width: 'auto', 
                    padding: '0.65rem 1.5rem', 
                    margin: 0,
                    opacity: (isSubmitting || isCompressing) ? 0.6 : 1,
                    cursor: (isSubmitting || isCompressing) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting 
                    ? 'Saving Book... ⏳' 
                    : isCompressing 
                    ? 'Compressing... ⏳' 
                    : (isEditing ? 'Save Changes' : 'Create Book')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Support Messages Modal (Auto 30-Day Purge) */}
      {isMessagesOpen && (
        <div className="bookoe-modal-backdrop" onClick={() => setIsMessagesOpen(false)}>
          <div 
            className="bookoe-modal" 
            style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bookoe-modal__header">
              <div>
                <h3 className="bookoe-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Mail size={22} color="var(--primary)" />
                  <span>Customer Support Messages</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  <Clock size={13} />
                  <span>Auto-delete: Messages are automatically removed after 30 days</span>
                </div>
              </div>
              <button 
                type="button" 
                className="bookoe-modal__close"
                onClick={() => setIsMessagesOpen(false)}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '1rem 0' }}>
              {loadingMessages ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Loading support inquiries... ⏳
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={44} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>No Inquiries Yet</h4>
                  <p style={{ fontSize: '0.85rem' }}>Messages sent through &quot;Contact Bookoe Support&quot; will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.1rem',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{msg.name}</strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>&bull; {msg.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-pill)' }}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete message"
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              padding: '0.35rem 0.6rem',
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', margin: 0, lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-xs)' }}>
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bookoe-modal__actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                className="bookoe-btn-reset"
                style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
                onClick={() => setIsMessagesOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
