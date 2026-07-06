import React from 'react';
import formatPrice from '../utils/formatPrice';

export default function OrderSummaryLines({ subtotal, shipping, tax, total, variant = 'default' }) {
  const isCompact = variant === 'compact';
  const labelClass = isCompact ? 'text-[var(--nm-muted)] text-sm' : 'text-gray-400';
  const valueClass = isCompact ? 'text-white font-medium' : 'text-white font-medium';
  const totalLabelClass = isCompact
    ? 'text-[var(--nm-muted)] font-bold uppercase tracking-widest text-[10px]'
    : 'text-gray-400 font-bold uppercase tracking-widest text-xs';

  return (
    <div className="space-y-4">
      <div className={`flex justify-between ${labelClass}`}>
        <span>Subtotal</span>
        <span className={valueClass}>{formatPrice(subtotal)}</span>
      </div>
      <div className={`flex justify-between ${labelClass}`}>
        <span>Shipping</span>
        <span className={shipping === 0 ? 'text-[var(--nm-green)] font-bold' : valueClass}>
          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
        </span>
      </div>
      <div className={`flex justify-between ${labelClass}`}>
        <span>Estimated Tax</span>
        <span className={valueClass}>{formatPrice(tax)}</span>
      </div>
      <div className="pt-4 border-t border-white/5 flex justify-between items-end">
        <span className={totalLabelClass}>
          {isCompact ? 'Grand Total' : 'Total Amount'}
        </span>
        <span className="text-4xl font-black text-white leading-none">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
