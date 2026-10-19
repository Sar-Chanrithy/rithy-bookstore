"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { 
  BookOpen, 
  Search, 
  Heart, 
  ShoppingBag, 
  ChevronDown, 
  LayoutGrid, 
  Settings,
  User,
  Check,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { FlagUS, FlagKH, FlagCN } from '@/components/FlagIcons';

const LANGUAGES = [
  { code: 'EN', name: 'English (US)', FlagComponent: FlagUS },
  { code: 'KH', name: 'ភាសាខ្មែរ (Khmer)', FlagComponent: FlagKH },
  { code: 'ZH', name: '中文 (Chinese)', FlagComponent: FlagCN },
];

export default function Navbar() {
  const router = useRouter();
  const { 
    cart, 
    wishlist, 
    setActiveModal, 
    currentLang, 
    setCurrentLang, 
    showToast, 
    user, 
    theme, 
    toggleTheme,
    t
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const cartTotalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistTotalItems = wishlist.length;

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const ActiveFlag = activeLangObj.FlagComponent;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleMenuNavigate = (href) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  const selectLanguage = (lang) => {
    setCurrentLang(lang.code);
    setIsLangOpen(false);
  };

  return (
    <header className="bookoe-navbar">
      <div className="bookoe-navbar__inner">
        {/* Left: Brand Logo */}
        <Link href="/" className="bookoe-logo">
          <div className="bookoe-logo__icon">
            <BookOpen size={24} />
          </div>
          <div className="bookoe-logo__text">
            <span className="bookoe-logo__title">{t('brandTitle', 'Rithy Book Store')}</span>
            <span className="bookoe-logo__subtitle">{t('brandSubtitle', 'BOOK STORE WEBSITE')}</span>
          </div>
        </Link>

        {/* Menus Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="bookoe-menu-btn"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLangOpen(false);
            }}
          >
            <LayoutGrid size={16} />
            <span>{t('menus', 'Menus')}</span>
            <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {isMenuOpen && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 190 }} 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: 240,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.5rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                <Link 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuNavigate('/');
                  }}
                  style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', cursor: 'pointer' }}
                >
                  🏠 {t('home', 'Home')} / {t('books', 'All Books')}
                </Link>
                <Link 
                  href="/categories" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuNavigate('/categories');
                  }}
                  style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', cursor: 'pointer' }}
                >
                  📚 {t('allCategories', 'Browse Categories')}
                </Link>
                <Link 
                  href="/?onSale=true" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuNavigate('/?onSale=true');
                  }}
                  style={{ padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', fontWeight: 600, color: '#ff6b6b', display: 'block', cursor: 'pointer' }}
                >
                  🏷️ {t('booksOnSale', 'Books on Sale')}
                </Link>
                {user?.role === 'Administrator' && (
                  <Link
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuNavigate('/admin');
                    }}
                    style={{
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#1d4ed8',
                      background: 'var(--primary-light)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Shield size={15} color="#1d4ed8" />
                    <span>{t('adminDashboard', 'Admin Dashboard (CRUD)')}</span>
                  </Link>
                )}
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? t('switchToLight', 'Light Mode') : t('switchToDark', 'Dark Mode')}</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-pill)' }}>
                  {theme === 'dark' ? `🌙 ${t('dark', 'Dark')}` : `☀️ ${t('light', 'Light')}`}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveModal('faq');
                }}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.55rem 0.85rem', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
              >
                ❓ {t('faqsHelp', 'FAQs & Help')}
              </button>
            </div>
          </>
        )}
        </div>

        {/* Center: Wide Search Bar */}
        <form onSubmit={handleSearch} className="bookoe-search">
          <input
            type="text"
            className="bookoe-search__input"
            placeholder={t('searchPlaceholder', 'Search over 30 million book titles...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bookoe-search__submit" title={t('search', 'Search')}>
            <Search size={18} />
          </button>
        </form>

        {/* Right: Actions */}
        <div className="bookoe-nav-actions">
          {/* Wishlist Button -> Opens Wishlist Drawer */}
          <button 
            type="button"
            className="bookoe-action-icon"
            onClick={() => setActiveModal('wishlist')}
            title={`${t('wishlist', 'Wishlist')} (${wishlistTotalItems})`}
          >
            <Heart size={19} fill={wishlistTotalItems > 0 ? '#ff7675' : 'none'} color={wishlistTotalItems > 0 ? '#ff7675' : 'currentColor'} />
            {wishlistTotalItems > 0 && (
              <span className="bookoe-badge-count">
                {wishlistTotalItems < 10 ? `0${wishlistTotalItems}` : wishlistTotalItems}
              </span>
            )}
          </button>

          {/* Cart Button -> Navigates to Cart */}
          <Link href="/cart" className="bookoe-action-icon" title={`${t('cart', 'Cart')} (${cartTotalItems})`}>
            <ShoppingBag size={19} />
            {cartTotalItems > 0 && (
              <span className="bookoe-badge-count">
                {cartTotalItems < 10 ? `0${cartTotalItems}` : cartTotalItems}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button (Light / Dark) */}
          <button 
            type="button"
            className="bookoe-action-icon bookoe-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('switchToLight', 'Switch to Light Mode ☀️') : t('switchToDark', 'Switch to Dark Mode 🌙')}
            aria-label={theme === 'dark' ? t('switchToLight', 'Switch to Light Mode') : t('switchToDark', 'Switch to Dark Mode')}
          >
            {theme === 'dark' ? (
              <Sun size={19} className="bookoe-theme-icon-sun" color="#fbbf24" />
            ) : (
              <Moon size={19} className="bookoe-theme-icon-moon" color="currentColor" />
            )}
          </button>

          {/* Admin CRUD Direct Link if Administrator */}
          {user?.role === 'Administrator' && (
            <Link
              href="/admin"
              title="Open Admin CRUD Dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              <Shield size={14} color="#1d4ed8" />
              <span>{t('admin', 'Admin CRUD')}</span>
            </Link>
          )}

          {/* User Profile Avatar / Sign In Button */}
          {user ? (
            <button 
              type="button"
              className="bookoe-user-avatar"
              onClick={() => setActiveModal('profile')}
              title={`${t('myProfile', 'Account')}: ${user.name}`}
              style={{ border: 'none' }}
            >
              <span>{user.initials || 'JD'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="bookoe-signin-btn"
              onClick={() => setActiveModal('auth')}
              title={t('signIn', 'Sign In')}
            >
              <User size={16} />
              <span>{t('signIn', 'Sign In')}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              className="bookoe-lang-select"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsMenuOpen(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}
            >
              <ActiveFlag size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{currentLang}</span>
              <ChevronDown size={13} style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isLangOpen && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 190 }} 
                  onClick={() => setIsLangOpen(false)} 
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                  right: 0,
                  width: 205,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.4rem',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                {LANGUAGES.map((lang) => {
                  const Flag = lang.FlagComponent;
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => selectLanguage(lang)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        background: isSelected ? 'var(--primary-light)' : 'transparent',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        border: 'none',
                        fontSize: '0.84rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        gap: '0.5rem',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Flag size={20} />
                        <span>{lang.name}</span>
                      </span>
                      {isSelected && <Check size={14} color="var(--primary)" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}