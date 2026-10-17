"use client";

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  HelpCircle, 
  Mail, 
  Info, 
  CheckCircle2, 
  User, 
  Settings, 
  LogOut, 
  Package,
  LogIn,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Database,
  Sun,
  Moon
} from 'lucide-react';

export default function GlobalModals() {
  const { 
    activeModal, 
    setActiveModal, 
    wishlist, 
    removeFromCart, 
    addToCart, 
    toggleWishlist,
    showToast,
    user,
    login,
    register,
    logout,
    theme,
    toggleTheme,
    switchTheme,
    t,
  } = useStore();

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  // Auth modal state
  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sync auth modal tab & reset inputs when modal opens
  React.useEffect(() => {
    if (activeModal === 'auth' || activeModal === 'signin') {
      setAuthTab('signin');
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setShowPassword(false);
    } else if (activeModal === 'signup') {
      setAuthTab('signup');
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setShowPassword(false);
    }
  }, [activeModal]);

  const switchAuthTab = (tab) => {
    setAuthTab(tab);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setShowPassword(false);
  };

  if (!activeModal) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      showToast('Please enter your email address ⚠️');
      return;
    }
    const res = await login(authEmail.trim(), authPassword);
    if (res?.success) {
      setAuthEmail('');
      setAuthPassword('');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!authName.trim()) {
      showToast('Please enter your full name ⚠️');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      showToast('Please enter a valid email address ⚠️');
      return;
    }
    const res = await register(authName.trim(), authEmail.trim(), authPassword);
    if (res?.success) {
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
    }
  };

  const faqs = [
    {
      q: 'How does delivery work and when will I get my books?',
      a: 'Delivery takes 1 to 2 days in Phnom Penh / major cities, and 3 to 5 days to other provinces. Delivery is free for all orders over $35!',
    },
    {
      q: 'Can I return a book and get my money back?',
      a: 'Yes! You have 30 days to return any book if it is still in good, clean condition. We will give you a 100% full refund.',
    },
    {
      q: 'Are all books original and real copies?',
      a: 'Yes, 100%! Every book on Bookoe is an authentic, original print directly from official publishers.',
    },
    {
      q: 'How do I check my order status?',
      a: 'We send a tracking link to your email. You can also open your Profile and click "My Active Orders & Cart" to see your order status anytime.',
    },
    {
      q: 'How can I pay for my books?',
      a: 'We accept Cash on Delivery (pay when you receive your book), ABA Pay, Wing, and Credit Cards (Visa / Mastercard).',
    },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    showToast('Your message has been sent to Bookoe support team! ✉️');
    setTimeout(() => {
      setContactSent(false);
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div 
      className="bookoe-modal-backdrop"
      onClick={() => setActiveModal(null)}
    >
      <div 
        className="bookoe-modal"
        style={{ maxWidth: activeModal === 'wishlist' ? 580 : 490 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bookoe-modal__header">
          <h3 className="bookoe-modal__title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {activeModal === 'wishlist' && <><Heart size={20} color="#ff7675" fill="#ff7675" /> {t('mySavedWishlist', 'My Wishlist')} ({wishlist.length})</>}
            {activeModal === 'contact' && <><Mail size={20} color="var(--primary)" /> {t('contactSupportTitle', 'Contact Bookoe Support')}</>}
            {activeModal === 'faq' && <><HelpCircle size={20} color="var(--primary)" /> {t('faqsTitle', 'Frequently Asked Questions')}</>}
            {activeModal === 'about' && <><Info size={20} color="var(--primary)" /> {t('aboutBookoe', 'About Bookoe')}</>}
            {activeModal === 'profile' && <><User size={20} color="var(--primary)" /> {t('myProfile', 'User Account Profile')}</>}
            {activeModal === 'auth' && (
              authTab === 'signin' ? (
                <><LogIn size={20} color="var(--primary)" /> {t('signIntoBookoe', 'Sign In to Your Account')}</>
              ) : (
                <><UserPlus size={20} color="var(--primary)" /> {t('createFreeAccount', 'Create Free Account')}</>
              )
            )}
          </h3>
          <button 
            type="button" 
            className="bookoe-modal__close"
            onClick={() => setActiveModal(null)}
          >
            &times;
          </button>
        </div>

        {/* 1. Auth Modal (Sign In / Sign Up) */}
        {activeModal === 'auth' && (
          <div>
            {/* Segmented Tabs */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                background: 'var(--bg-subtle)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => switchAuthTab('signin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: authTab === 'signin' ? 'var(--bg-card)' : 'transparent',
                  color: authTab === 'signin' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: authTab === 'signin' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <LogIn size={15} />
                <span>{t('signIn', 'Sign In')}</span>
              </button>
              <button
                type="button"
                onClick={() => switchAuthTab('signup')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  background: authTab === 'signup' ? 'var(--bg-card)' : 'transparent',
                  color: authTab === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: authTab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <UserPlus size={15} />
                <span>{t('createFreeAccount', 'Create Account')}</span>
              </button>
            </div>

            {/* Sign In Form */}
            {authTab === 'signin' ? (
              <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="bookoe_signin_email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {t('emailAddress', 'Email Address')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="bookoe_signin_email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      placeholder="reader@bookoe.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-input)',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label htmlFor="bookoe_signin_password" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {t('password', 'Password')}
                    </label>
                    <span 
                      onClick={() => showToast('Hint: You can use any test password, or click the Demo Login button below! 💡')}
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {t('forgotPassword', 'Forgot?')}
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="bookoe_signin_password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-input)',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="remember_me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="remember_me" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {t('rememberMe', 'Remember my login on this device')}
                  </label>
                </div>

                <button
                  type="submit"
                  className="bookoe-btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', fontWeight: 800, marginTop: '0.25rem' }}
                >
                  {t('signIntoBookoe', 'Sign In to Bookoe')}
                </button>

                {/* 1-Click Quick Demo Login (Admin & User) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => login('admin@bookoe.com', 'admin123')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: '#fef2f2',
                      border: '1px dashed #ef4444',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>🛡️ {t('administrator', 'Admin')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => login('reader.john@bookoe.com', 'password123')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary-light)',
                      border: '1px dashed var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>⚡ {t('guestCustomer', 'User')}</span>
                  </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Don&apos;t have an account?{' '}
                  <span 
                    onClick={() => switchAuthTab('signup')} 
                    style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('createFreeAccount', 'Create one here')}
                  </span>
                </p>
              </form>
            ) : (
              /* Create Account Form */
              <form onSubmit={handleSignUpSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="bookoe_signup_fullname" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {t('fullName', 'Your Full Name')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="bookoe_signup_fullname"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Sok San or Jane Smith"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-input)',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="bookoe_signup_email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {t('emailAddress', 'Email Address')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="bookoe_signup_email"
                      name="signup_email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-input)',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="bookoe_signup_password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {t('password', 'Create Password')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="bookoe_signup_password"
                      name="signup_newpassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Minimum 6 characters"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-input)',
                        fontSize: '0.88rem',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Your password &amp; personal information are safely encrypted.
                  </span>
                </div>

                <button
                  type="submit"
                  className="bookoe-btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', fontWeight: 800, marginTop: '0.25rem' }}
                >
                  {t('createFreeAccount', 'Create Free Account')}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Already have an account?{' '}
                  <span 
                    onClick={() => switchAuthTab('signin')} 
                    style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {t('signIn', 'Sign In')}
                  </span>
                </p>
              </form>
            )}
          </div>
        )}

        {/* 2. Wishlist Modal */}
        {activeModal === 'wishlist' && (
          <div>
            {wishlist.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 380, overflowY: 'auto', paddingRight: '0.4rem' }}>
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: 44,
                          height: 58,
                          borderRadius: '4px',
                          background: item.coverImage ? `url(${item.coverImage}) center/cover no-repeat` : (item.coverGradient || 'var(--primary)'),
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.author} &bull; <strong>${Number(item.price || 0).toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="bookoe-btn-cart"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <ShoppingBag size={13} />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item)}
                        style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', padding: '0.4rem' }}
                        title="Remove from wishlist"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <Heart size={44} color="#d1d5db" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Your wishlist is empty</h4>
                <p style={{ fontSize: '0.85rem' }}>Click the heart icon on any book to save it for later!</p>
              </div>
            )}
          </div>
        )}

        {/* 3. Contact Support Modal */}
        {activeModal === 'contact' && (
          <div>
            {contactSent ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Message Received!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Our support team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    defaultValue={user?.name || ''}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    defaultValue={user?.email || ''}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                    How can we help?
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your order or question..."
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="bookoe-btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 800, marginTop: '0.25rem' }}
                >
                  Send Message
                </button>

                <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span>📍 <strong>Location:</strong> Phnom Penh, Cambodia</span>
                  <span>📞 <strong>Phone:</strong> +855 12 345 678</span>
                  <span>✉️ <strong>Email:</strong> <a href="mailto:support@bookoe.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>support@bookoe.com</a></span>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. FAQs Modal */}
        {activeModal === 'faq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 380, overflowY: 'auto' }}>
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div 
                  key={faq.q}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: isOpen ? 'var(--primary-light)' : 'var(--bg-card)',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: isOpen ? 'var(--primary)' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-body)', background: 'var(--bg-card)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. About Us Modal */}
        {activeModal === 'about' && (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '1rem' }}>
              Welcome to <strong>Bookoe</strong>! We are an online book store made for book lovers everywhere.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Our goal is simple: make reading easy and affordable for everyone. We bring you great books including famous Khmer literature, global bestsellers, adventure, romance, and history.
            </p>
            <div style={{ background: 'var(--primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-glow)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
              ✨ <strong>100% Genuine Books</strong> &bull; Fast Delivery &bull; 30-Day Money-Back Guarantee.
            </div>
          </div>
        )}

        {/* 6. User Profile Modal */}
        {activeModal === 'profile' && (
          <div>
            {user ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#2d3748',
                    }}
                  >
                    {user.initials || 'JD'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      {user.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>
                      {user.email}
                    </p>
                    <span style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-pill)', marginTop: 4 }}>
                      {user.role || 'VIP Member'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Theme Mode Selector in Profile */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--radius-sm)', 
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {theme === 'dark' ? <Moon size={16} color="var(--primary)" /> : <Sun size={16} color="#f59e0b" />}
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {t('appearance', 'Appearance')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-muted)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
                      <button
                        type="button"
                        onClick={() => switchTheme('light')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-pill)',
                          border: 'none',
                          background: theme === 'light' ? 'var(--bg-card)' : 'transparent',
                          color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none',
                        }}
                      >
                        <Sun size={13} color="#f59e0b" />
                        <span>{t('light', 'Light')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => switchTheme('dark')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-pill)',
                          border: 'none',
                          background: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
                          color: theme === 'dark' ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none',
                        }}
                      >
                        <Moon size={13} color="var(--primary)" />
                        <span>{t('dark', 'Dark')}</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => { setActiveModal('wishlist'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-subtle)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}
                  >
                    <Heart size={16} color="#ff7675" />
                    <span>{t('mySavedWishlist', 'My Saved Wishlist')} ({wishlist.length})</span>
                  </button>

                  {user.role === 'Administrator' && (
                    <Link
                      href="/admin"
                      onClick={() => setActiveModal(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border-light)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: 'var(--primary)'
                      }}
                    >
                      <Database size={16} color="var(--primary)" />
                      <span>{t('adminCRUD', '🛡️ Admin Dashboard (CRUD)')}</span>
                    </Link>
                  )}

                  <Link
                    href="/cart"
                    onClick={() => setActiveModal(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-subtle)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}
                  >
                    <Package size={16} color="var(--primary)" />
                    <span>{t('myActiveOrders', 'My Active Orders & Cart')}</span>
                  </Link>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    type="button"
                    className="bookoe-btn-reset"
                    onClick={() => {
                      logout();
                    }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#fee2e2' }}
                  >
                    <LogOut size={16} />
                    <span>{t('signOut', 'Sign Out')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <User size={48} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {t('notSignedIn', 'You are not signed in')}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {t('notSignedInDesc', 'Sign in or create a free account to track orders and save your wishlist.')}
                </p>
                <button
                  type="button"
                  className="bookoe-btn-primary"
                  onClick={() => setActiveModal('auth')}
                  style={{ width: '100%', padding: '0.75rem', fontWeight: 800, marginBottom: '1.25rem' }}
                >
                  {t('signInOrCreate', 'Sign In / Create Account')}
                </button>

                {/* Appearance toggle for guest */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {theme === 'dark' ? <Moon size={16} color="var(--primary)" /> : <Sun size={16} color="#f59e0b" />}
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {t('appearance', 'Appearance')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-muted)', padding: '0.2rem', borderRadius: 'var(--radius-pill)' }}>
                    <button
                      type="button"
                      onClick={() => switchTheme('light')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: theme === 'light' ? 'var(--bg-card)' : 'transparent',
                        color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: theme === 'light' ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      <Sun size={13} color="#f59e0b" />
                      <span>{t('light', 'Light')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchTheme('dark')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: theme === 'dark' ? 'var(--bg-card)' : 'transparent',
                        color: theme === 'dark' ? 'var(--text-main)' : 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: theme === 'dark' ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      <Moon size={13} color="var(--primary)" />
                      <span>{t('dark', 'Dark')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
