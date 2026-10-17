"use client";

import Link from 'next/link';

export default function Button({
  href,
  variant = 'primary',
  className = '',
  children,
  onClick,
  ...props
}) {
  const variantClass = variant === 'outline' ? 'btn--outline' : variant === 'brand' ? 'btn--brand' : 'btn--primary';
  const combinedClass = `btn ${variantClass} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
