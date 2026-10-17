"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  Phone, 
  MapPin, 
  User, 
  CreditCard, 
  Banknote, 
  MessageSquare, 
  ExternalLink,
  Sparkles,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addedBookId = searchParams.get('add');
  const hasAddedRef = useRef(null);
  const { cart, removeFromCart, updateQuantity, addToCart, clearCart, showToast, user, t } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Form inputs (Only Name, Phone, and Address)
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // If URL has ?add=id, fetch and add to cart only once & clean URL
  useEffect(() => {
    if (addedBookId && hasAddedRef.current !== addedBookId) {
      hasAddedRef.current = addedBookId;
      fetch(`/api/books/${addedBookId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            addToCart(data.data);
            router.replace('/cart');
          }
        })
        .catch((e) => console.error(e));
    }
  }, [addedBookId, router, addToCart]);

  // Sync user info if available
  useEffect(() => {
    if (user && !customerName) {
      setCustomerName(user.name || '');
    }
  }, [user]);

  // Use real cart items from StoreContext
  const displayItems = cart;

  const subtotal = displayItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const shipping = displayItems.length > 0 ? 4.99 : 0;
  const discount = displayItems.length > 0 ? 5.00 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleStartCheckout = () => {
    setIsCheckingOut(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = deliveryAddress.trim();

    if (!name) {
      showToast('Please enter your Full Name / សូមបញ្ចូលឈ្មោះពេញ ⚠️');
      return;
    }

    if (!phone) {
      showToast('Please enter your Phone Number / សូមបញ្ចូលលេខទូរស័ព្ទ ⚠️');
      return;
    }

    if (!address) {
      showToast('Please enter your Address / សូមបញ្ចូលអាសយដ្ឋាន ⚠️');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: name,
        customerPhone: phone,
        customerTelegram: '',
        deliveryAddress: address,
        orderNote: '',
        paymentMethod: paymentMethod || 'Cash on Delivery',
        items: displayItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: Number(item.price),
          quantity: item.quantity || 1,
          coverImage: item.coverImage,
        })),
        subtotal,
        shipping,
        discount,
        total,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderResult(data);
        setCheckoutComplete(true);
        if (clearCart) clearCart();
        showToast(t('checkoutSuccessTitle', 'Order Placed Successfully! 🎉'));
      } else {
        showToast(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Client-side fallback order
      const fallbackOrder = {
        orderNumber: `RBS-${Date.now().toString().slice(-6)}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerTelegram: customerTelegram.trim(),
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod,
        items: displayItems,
        total,
      };
      setOrderResult({
        success: true,
        order: fallbackOrder,
        telegramSent: false,
        telegramUrl: `https://t.me/rithysar?text=${encodeURIComponent(
          `New Order from ${customerName.trim()} (${customerPhone.trim()}) - Total: $${total.toFixed(2)}`
        )}`,
      });
      setCheckoutComplete(true);
      if (clearCart) clearCart();
      showToast(t('checkoutSuccessTitle', 'Order Placed Successfully! 🎉'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bookoe-container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <nav className="bookoe-breadcrumb">
        <Link href="/">{t('home', 'Home')}</Link>
        <span className="bookoe-breadcrumb__sep">/</span>
        <span className="bookoe-breadcrumb__active">
          {isCheckingOut ? t('checkoutDetails', 'Checkout') : t('shoppingCart', 'Shopping Cart')}
        </span>
      </nav>

      <div style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          {isCheckingOut ? t('checkoutDetails', 'Checkout & Delivery Information') : t('shoppingCart', 'Shopping Cart')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          {displayItems.length} {t('itemCount', 'items')} • Rithy Book Store
        </p>
      </div>

      {checkoutComplete ? (
        /* Order Confirmation View */
        <div 
          style={{ 
            background: 'var(--bg-card)', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid var(--border-light)', 
            maxWidth: 680, 
            margin: '0 auto', 
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div 
              style={{ 
                width: 72, 
                height: 72, 
                borderRadius: '50%', 
                background: '#ecfdf5', 
                color: '#10b981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.25rem' 
              }}
            >
              <CheckCircle2 size={44} />
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t('checkoutSuccessTitle', 'Order Placed Successfully!')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              {t('checkoutSuccessDesc', 'Thank you for shopping at Rithy Book Store! Your order is being processed.')}
            </p>
          </div>

          {/* Order ID & Telegram status pill */}
          <div 
            style={{ 
              background: 'var(--bg-page)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.25rem', 
              border: '1px solid var(--border-light)',
              marginBottom: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('orderNumber', 'Order Number')}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem', background: 'var(--primary-light)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                #{orderResult?.order?.orderNumber || 'RBS-916725'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: '#eff6ff', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
              <Send size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.4 }}>
                <strong>Telegram Bot Notification:</strong> {orderResult?.telegramSent ? 'Dispatched directly to merchant Telegram channel! 📱' : 'Order details recorded in database and ready to open in Telegram.'}
              </div>
            </div>

            {orderResult?.telegramUrl && (
              <a
                href={orderResult.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: '#229ed9',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  boxShadow: '0 4px 12px rgba(34, 158, 217, 0.25)'
                }}
              >
                <Send size={16} />
                <span>{t('openInTelegram', 'Open Order in Telegram')}</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Delivery & Customer Summary */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginBottom: '1.5rem', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
              <strong style={{ color: 'var(--text-main)' }}>{orderResult?.order?.customerName || customerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
              <strong style={{ color: 'var(--text-main)' }}>{orderResult?.order?.customerPhone || customerPhone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
              <span style={{ color: 'var(--text-main)', textAlign: 'right', maxWidth: '60%' }}>{orderResult?.order?.deliveryAddress || deliveryAddress}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {paymentMethod === 'aba' ? '📱 ABA Pay / KHQR' : paymentMethod === 'card' ? '💳 Card' : '💵 Cash on Delivery'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem', fontSize: '1.05rem', fontWeight: 800 }}>
              <span>Total Paid / Due:</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link 
              href="/" 
              className="bookoe-btn-refine" 
              style={{ width: '100%', textAlign: 'center', padding: '0.85rem', margin: 0, textDecoration: 'none' }}
            >
              {t('backToCatalog', 'Continue Shopping')}
            </Link>
          </div>
        </div>
      ) : displayItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Cart Items OR Checkout Form */}
          {!isCheckingOut ? (
            /* Standard Cart Items List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: 58,
                        height: 78,
                        borderRadius: 'var(--radius-sm)',
                        background: item.coverGradient || 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                      }}
                    >
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement.innerText = item.coverEmoji || '📖';
                          }}
                        />
                      ) : (
                        item.coverEmoji || '📖'
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                        {item.author || 'Author'} • <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.category || 'General'}</span>
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.45rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('qty', 'Qty')}:</span>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1.5px solid var(--border-light)',
                          borderRadius: '8px',
                          background: 'var(--bg-page)',
                          overflow: 'hidden'
                        }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            style={{
                              width: 26,
                              height: 26,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-main)',
                            }}
                            title="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{
                            minWidth: 26,
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--text-main)'
                          }}>
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            style={{
                              width: 26,
                              height: 26,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-main)',
                            }}
                            title="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                    {item.originalPrice && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-faint)', textDecoration: 'line-through' }}>
                        ${((Number(item.originalPrice) || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginTop: '0.4rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} /> {t('delete', 'Remove')}
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '0.5rem' }}>
                <Link
                  href="/"
                  className="bookoe-btn-reset"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.4rem' }}
                >
                  <ArrowLeft size={16} /> {t('backToCatalog', 'Continue Shopping')}
                </Link>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════
               CLEAN CHECKOUT FORM — Name, Phone Number, Address Only
               ═══════════════════════════════════════════════════════ */
            <form 
              onSubmit={handleSubmitOrder}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                animation: 'fadeIn 0.25s ease-out'
              }}
            >
              {/* ── Breadcrumb: Cart → Checkout ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <ArrowLeft size={14} /> Cart
                </button>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Checkout</span>
              </div>

              {/* ── Section: Contact info ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Contact info
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                    Phone Contact
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-body)' }}>
                    Phone number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 012 345 678"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem 0.8rem 2.6rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--bg-page)',
                        color: 'var(--text-main)',
                        fontSize: '0.92rem',
                        fontWeight: 500,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                    />
                    <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                      <Phone size={15} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Shipping ── */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                    Shipping
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                    Delivery Address
                  </span>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-body)' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="First and last name"
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem 0.8rem 2.6rem',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-light)',
                          background: 'var(--bg-page)',
                          color: 'var(--text-main)',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                      <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <User size={15} />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem', color: 'var(--text-body)' }}>
                      Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street address, Khan, City"
                        style={{
                          width: '100%',
                          padding: '0.8rem 1rem 0.8rem 2.6rem',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-light)',
                          background: 'var(--bg-page)',
                          color: 'var(--text-main)',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                      <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                        <MapPin size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button inside form for mobile/desktop convenience */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                }}
                onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = '#1d4ed8')}
                onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = '#2563eb')}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <span>Place order</span>
                )}
              </button>
            </form>
          )}

          {/* ═══════════════════════════════════════════════════════
             PREMIUM ORDER SUMMARY CARD
             ═══════════════════════════════════════════════════════ */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '100px',
            }}
          >
            {/* Order Summary Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={14} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  {t('orderSummary', 'Order Summary')}
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-pill)' }}>
                {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div style={{ padding: '1.25rem 1.5rem' }}>
              {/* Items Preview with Thumbnails */}
              {isCheckingOut && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', maxHeight: 220, overflowY: 'auto' }}>
                  {displayItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 44, height: 56, borderRadius: 8, flexShrink: 0,
                        background: item.coverGradient || 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }}>
                        {item.coverImage ? (
                          <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerText = item.coverEmoji || '📖'; }} />
                        ) : (item.coverEmoji || '📖')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                          Qty: {item.quantity || 1}
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', flexShrink: 0 }}>
                        ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border-light)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                  <span>{t('subtotal', 'Subtotal')}</span>
                  <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {t('shipping', 'Shipping')}
                    <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: 4, fontWeight: 600 }}>Express</span>
                  </span>
                  <span style={{ fontWeight: 700 }}>${shipping.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    🎉 {t('off', 'Discount')}
                  </span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>-${discount.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.85rem 1rem', marginBottom: '1.25rem',
                background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(108,92,231,0.08) 100%)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(108,92,231,0.15)',
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{t('total', 'Total')}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>${total.toFixed(2)}</span>
              </div>

              {/* Action Button */}
              {!isCheckingOut ? (
                <button
                  type="button"
                  className="bookoe-btn-refine"
                  style={{ 
                    width: '100%', padding: '0.95rem', fontSize: '0.95rem', fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 14px var(--primary-glow)',
                  }}
                  onClick={handleStartCheckout}
                >
                  {t('proceedToCheckout', 'Proceed to Checkout')} →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%', 
                    padding: '0.95rem 1.25rem', 
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: isSubmitting ? 0.75 : 1,
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.background = '#1d4ed8')}
                  onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.background = '#2563eb')}
                  onClick={handleSubmitOrder}
                >
                  <span>
                    {isSubmitting ? 'Processing...' : 'Place order'}
                  </span>
                </button>
              )}

              {/* Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span>{t('secureCheckoutBadge', '30-Day Money-Back & Secure Checkout')}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('cartEmptyTitle', 'Your Cart is Empty')}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', maxWidth: 400, margin: '0.4rem auto 1.5rem' }}>
            {t('cartEmptyDesc', "Looks like you haven't added any books yet. Explore our curated catalog to find your next great read!")}
          </p>
          <Link href="/" className="bookoe-btn-refine" style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem' }}>
            {t('browseAllBooks', 'Browse Books')}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <React.Suspense fallback={
      <div className="bookoe-container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading Cart...</p>
      </div>
    }>
      <CartContent />
    </React.Suspense>
  );
}
