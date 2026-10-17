"use client";

import React from 'react';
import { Zap, ShieldCheck, ThumbsUp, RotateCcw } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function FeaturesStrip() {
  const { t } = useStore();

  const features = [
    {
      icon: <Zap size={22} />,
      title: t('quickDeliveryTitle', 'Quick Delivery'),
      desc: t('quickDeliveryDesc', 'Fast delivery straight to your doorstep within 24-48 hours'),
    },
    {
      icon: <ShieldCheck size={22} />,
      title: t('securePaymentTitle', 'Secure Payment'),
      desc: t('securePaymentDesc', '100% secure payment gateway with ABA & Card support'),
    },
    {
      icon: <ThumbsUp size={22} />,
      title: t('bestQualityTitle', 'Best Quality'),
      desc: t('bestQualityDesc', 'Guaranteed authentic original publisher editions'),
    },
    {
      icon: <RotateCcw size={22} />,
      title: t('returnGuaranteeTitle', 'Return Guarantee'),
      desc: t('returnGuaranteeDesc', 'Hassle-free 30-day money-back guarantee policy'),
    },
  ];

  return (
    <section className="bookoe-features-strip">
      {features.map((item, idx) => (
        <div key={idx} className="bookoe-feature-item">
          <div className="bookoe-feature-icon">
            {item.icon}
          </div>
          <div>
            <h4 className="bookoe-feature-title">{item.title}</h4>
            <p className="bookoe-feature-desc">{item.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
