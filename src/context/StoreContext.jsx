"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/data/translations';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'contact', 'faq', 'about', 'profile'
  const [currentLang, setCurrentLang] = useState('EN');
  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState('light');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('bookoe_lang');
      if (savedLang === 'KH' || savedLang === 'EN' || savedLang === 'ZH') {
        setCurrentLang(savedLang);
        document.documentElement.lang = savedLang === 'KH' ? 'km' : (savedLang === 'ZH' ? 'zh' : 'en');
        document.documentElement.setAttribute('data-lang', savedLang);
      }

      const savedTheme = localStorage.getItem('bookoe_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      const savedCart = localStorage.getItem('bookoe_cart');
      const savedWishlist = localStorage.getItem('bookoe_wishlist');
      const savedUser = localStorage.getItem('bookoe_user');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // If it was the old auto-generated dummy user, clear it so new visitors see 'Sign In'
        if (parsed?.id === 'usr_1') {
          localStorage.removeItem('bookoe_user');
          setUser(null);
        } else {
          setUser(parsed);
        }
      } else {
        // Brand new visitor starts as guest (not logged in)
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to load from storage:', e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('bookoe_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    } catch (e) {
      console.error(e);
    }
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
  };

  const switchTheme = (newTheme) => {
    if (newTheme !== 'dark' && newTheme !== 'light') return;
    setTheme(newTheme);
    try {
      localStorage.setItem('bookoe_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.error(e);
    }
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
  };

  const changeLanguage = (newLang) => {
    const code = (newLang === 'KH' || newLang === 'ZH') ? newLang : 'EN';
    setCurrentLang(code);
    try {
      localStorage.setItem('bookoe_lang', code);
      document.documentElement.lang = code === 'KH' ? 'km' : (code === 'ZH' ? 'zh' : 'en');
      document.documentElement.setAttribute('data-lang', code);
    } catch (e) {
      console.error(e);
    }
    const msg = code === 'KH' 
      ? 'បានប្តូរភាសាទៅជាភាសាខ្មែរជោគជ័យ! 🇰🇭' 
      : code === 'ZH'
      ? '已切换至中文语言！🇨🇳'
      : 'Language switched to English! 🇺🇸';
    showToast(msg);
  };

  const t = useCallback((key, fallback) => {
    if (!key) return '';
    const langDict = translations[currentLang] || translations.EN;
    return langDict[key] ?? translations.EN[key] ?? fallback ?? key;
  }, [currentLang]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: email.trim(), password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bookoe_user', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}! 👋`);
        setActiveModal(null);
        return { success: true, user: data.user };
      } else {
        showToast(data.error || 'Login failed. Please check credentials ⚠️');
        return { success: false, error: data.error };
      }
    } catch (err) {
      // Fallback in case of offline/network issue
      const namePart = email.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: email.trim(),
        role: 'VIP Member',
        initials: displayName.slice(0, 2).toUpperCase() || 'US',
      };
      setUser(fallbackUser);
      localStorage.setItem('bookoe_user', JSON.stringify(fallbackUser));
      showToast(`Welcome back, ${fallbackUser.name}! 👋`);
      setActiveModal(null);
      return { success: true, user: fallbackUser };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name: name.trim(), email: email.trim(), password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('bookoe_user', JSON.stringify(data.user));
        showToast(`Account created! Welcome to Bookoe, ${data.user.name}! 🎉`);
        setActiveModal(null);
        return { success: true, user: data.user };
      } else {
        showToast(data.error || 'Registration failed ⚠️');
        return { success: false, error: data.error };
      }
    } catch (err) {
      // Fallback
      const trimmedName = name.trim() || 'Bookoe Reader';
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        name: trimmedName,
        email: email.trim(),
        role: 'VIP Member',
        initials: trimmedName.slice(0, 2).toUpperCase() || 'BR',
      };
      setUser(fallbackUser);
      localStorage.setItem('bookoe_user', JSON.stringify(fallbackUser));
      showToast(`Account created! Welcome to Bookoe, ${fallbackUser.name}! 🎉`);
      setActiveModal(null);
      return { success: true, user: fallbackUser };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookoe_user');
    showToast('You have signed out of Bookoe account 👋');
    setActiveModal(null);
  };

  // Save cart
  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => String(item.id) === String(book.id));
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          String(item.id) === String(book.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...book, quantity: 1 }];
      }
      localStorage.setItem('bookoe_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added "${book.title}" to cart! 🛒`);
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => String(item.id) !== String(bookId));
      localStorage.setItem('bookoe_cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Removed item from cart');
  };

  const updateQuantity = (bookId, quantity) => {
    const q = parseInt(quantity, 10);
    if (isNaN(q) || q <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        String(item.id) === String(bookId) ? { ...item, quantity: q } : item
      );
      localStorage.setItem('bookoe_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('bookoe_cart');
  };

  // Toggle wishlist
  const toggleWishlist = (book) => {
    setWishlist((prev) => {
      const isLiked = prev.some((item) => String(item.id) === String(book.id));
      let updated;
      if (isLiked) {
        updated = prev.filter((item) => String(item.id) !== String(book.id));
        showToast(`Removed "${book.title}" from wishlist`);
      } else {
        updated = [...prev, book];
        showToast(`Added "${book.title}" to wishlist! ❤️`);
      }
      localStorage.setItem('bookoe_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookInWishlist = (bookId) => {
    return wishlist.some((item) => String(item.id) === String(bookId));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isBookInWishlist,
        toast,
        showToast,
        activeModal,
        setActiveModal,
        currentLang,
        setCurrentLang: changeLanguage,
        changeLanguage,
        t,
        translations,
        user,
        login,
        register,
        logout,
        theme,
        toggleTheme,
        switchTheme,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: 'var(--text-main)',
            color: 'var(--bg-card)',
            padding: '0.85rem 1.4rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '0.88rem',
            animation: 'fadeIn 0.2s ease-out',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span>{toast}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    return {
      cart: [],
      wishlist: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      toggleWishlist: () => {},
      isBookInWishlist: () => false,
      toast: null,
      showToast: () => {},
      activeModal: null,
      setActiveModal: () => {},
      currentLang: 'EN',
      setCurrentLang: () => {},
      changeLanguage: () => {},
      t: (k, fb) => fb || k,
      translations,
      user: null,
      login: () => {},
      register: () => {},
      logout: () => {},
      theme: 'light',
      toggleTheme: () => {},
      switchTheme: () => {},
    };
  }
  return context;
}
