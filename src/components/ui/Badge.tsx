import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    error: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalized = status.toLowerCase();

  if (['delivered', 'paid', 'active', 'published', 'approved'].includes(normalized)) {
    return <Badge variant="success">● {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
  if (['shipped', 'processing', 'confirmed'].includes(normalized)) {
    return <Badge variant="info">● {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
  if (['pending', 'low stock', 'invited'].includes(normalized)) {
    return <Badge variant="warning">● {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
  if (['cancelled', 'failed', 'refunded', 'out of stock'].includes(normalized)) {
    return <Badge variant="error">● {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
  if (['draft', 'archived', 'disabled', 'expired'].includes(normalized)) {
    return <Badge variant="neutral">● {status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }

  return <Badge variant="neutral">{status}</Badge>;
};
