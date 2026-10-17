"use client";

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const { setActiveModal, showToast, user, t } = useStore();

  return (
    <footer className="bookoe-footer">
      <div className="bookoe-container">
        <div className="bookoe-footer__grid">
          {/* Col 1: Brand & About Bookoe */}
          <div>
            <Link href="/" className="bookoe-logo">
              <div className="bookoe-logo__icon" style={{ width: 36, height: 36, fontSize: '1.1rem' }}>
                <BookOpen size={20} />
              </div>
              <div className="bookoe-logo__text">
                <span className="bookoe-logo__title" style={{ fontSize: '1.25rem' }}>{t('brandTitle', 'Rithy Book Store')}</span>
                <span className="bookoe-logo__subtitle">{t('brandSubtitle', 'BOOK STORE WEBSITE')}</span>
              </div>
            </Link>

            <p className="bookoe-footer__desc">
              {t('footerDesc', 'Bookoe is your online bookstore where you can explore a wide range of books. Discover inspiring stories, learn new skills, and enjoy reading.')}
            </p>

            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.6rem' }}>
                {t('followUs', 'Follow Us')}
              </span>
              <div className="bookoe-socials">
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/ToroEmmSremm007/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bookoe-social-icon" 
                  title="Facebook - ToroEmmSremm007"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://www.youtube.com/channel/UCYHOh_ZZn1U5_vp0EiJV0_A" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bookoe-social-icon" 
                  title="YouTube Channel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bookoe-social-icon" 
                  title="TikTok"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.49v-7.1a8.16 8.16 0 0 0 4.91 1.63v-3.51z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/thy_biubiu/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bookoe-social-icon" 
                  title="Instagram - @thy_biubiu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/feed/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bookoe-social-icon" 
                  title="LinkedIn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Books Categories */}
          <div>
            <h4 className="bookoe-footer__heading">{t('bookCategories', 'Books Categories')}</h4>
            <ul className="bookoe-footer__links">
              <li><Link href="/?category=Fantasy" className="bookoe-footer__link">{t('cat_fantasy', 'Fantasy')}</Link></li>
              <li><Link href="/?category=Sci-fi" className="bookoe-footer__link">{t('cat_scifi', 'Technology & Sci-fi')}</Link></li>
              <li><Link href="/?category=Action" className="bookoe-footer__link">{t('cat_action', 'Action')}</Link></li>
              <li><Link href="/?category=Biography" className="bookoe-footer__link">{t('cat_biography', 'Biography')}</Link></li>
              <li><Link href="/?category=History" className="bookoe-footer__link">{t('cat_history', 'History')}</Link></li>
              <li><Link href="/?category=Adventure" className="bookoe-footer__link">{t('cat_adventure', 'Adventure')}</Link></li>
              <li><Link href="/?category=Romance" className="bookoe-footer__link">{t('cat_romance', 'Romance')}</Link></li>
              <li>
                <Link href="/categories" className="bookoe-footer__link" style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{t('allCategories', 'View All Categories')}</span>
                  <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="bookoe-footer__heading">{t('quickLinks', 'Quick Links')}</h4>
            <ul className="bookoe-footer__links">
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveModal('about')} 
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                  className="bookoe-footer__link"
                >
                  {t('aboutBookoe', 'About Bookoe')}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveModal('contact')} 
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                  className="bookoe-footer__link"
                >
                  {t('contactSupport', 'Contact Support')}
                </button>
              </li>
              <li><Link href="/" className="bookoe-footer__link">{t('books', 'All Books')}</Link></li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveModal(user ? 'profile' : 'auth')} 
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                  className="bookoe-footer__link"
                >
                  {user ? t('myProfile', 'My Account') : `${t('myProfile', 'My Account')} (${t('signIn', 'Login')})`}
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setActiveModal('faq')} 
                  style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                  className="bookoe-footer__link"
                >
                  {t('faqsHelp', 'FAQ & Help')}
                </button>
              </li>
              <li><Link href="/cart" className="bookoe-footer__link">{t('shoppingCart', 'Shopping Cart')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Our Store */}
          <div>
            <h4 className="bookoe-footer__heading">{t('paymentMethods', 'Our Store & Location')}</h4>
            <div 
              className="bookoe-store-map" 
              style={{ cursor: 'pointer' }}
              onClick={() => showToast('Opening location in Phnom Penh, Cambodia... 🗺️')}
            >
              <span>📍 Phnom Penh, Cambodia</span>
            </div>
            <div className="bookoe-store-info">
              <div className="bookoe-store-info-item">
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span>Phnom Penh,Stueng mean chey , Cambodia</span>
              </div>
              <div className="bookoe-store-info-item">
                <Phone size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <a href="tel:+85517916725" style={{ color: 'inherit' }}>+855 17 916 725</a>
              </div>
              <div className="bookoe-store-info-item">
                <Mail size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <a href="mailto:support@bookoe.com" style={{ color: 'inherit' }}>rithysupport@bookoe.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="bookoe-copyright">
          <span>&copy; 2026 Bookoe. {t('allRightsReserved', 'All Rights Reserved.')}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Phnom Penh, Cambodia &bull; ✉️ support@bookoe.com
          </span>
        </div>
      </div>
    </footer>
  );
}
