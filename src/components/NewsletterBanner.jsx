"use client";

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function NewsletterBanner() {
  const { t, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();

      if (data.success) {
        setSubscribed(true);
        showToast(data.message || t('newsletterSubscribedToast', 'Thank you for subscribing! 📚'));
        setTimeout(() => {
          setEmail('');
          setSubscribed(false);
        }, 4000);
      } else {
        showToast(data.error || 'Subscription failed. Please check your email.');
      }
    } catch (err) {
      setSubscribed(true);
      showToast(t('newsletterSubscribedToast', 'Thank you for subscribing! 📚'));
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bookoe-newsletter">
      <h2 className="bookoe-newsletter__title">
        {t('newsletterTitle', 'Subscribe to our newsletter for newest book updates')}
      </h2>

      <form onSubmit={handleSubmit} className="bookoe-newsletter__form">
        <input
          type="email"
          className="bookoe-newsletter__input"
          placeholder={t('newsletterPlaceholder', 'Type your email here...')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          className="bookoe-newsletter__btn"
          disabled={loading}
          style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? t('loading', 'Loading...') : (subscribed ? t('newsletterThanks', 'THANK YOU!') : t('newsletterBtn', 'SUBSCRIBE'))}
        </button>
      </form>
    </section>
  );
}
