import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantitySelector({ value, onChange, min = 1, size = 'md' }) {
  const btnSize = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const textSize = size === 'lg' ? 'w-12 text-lg' : 'w-8';
  const iconSize = size === 'lg' ? 16 : 14;

  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${btnSize} flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors`}
        aria-label="Decrease quantity"
      >
        <FiMinus size={iconSize} />
      </button>
      <span className={`${textSize} text-center font-bold`}>{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className={`${btnSize} flex items-center justify-center hover:text-[var(--nm-gold)] transition-colors`}
        aria-label="Increase quantity"
      >
        <FiPlus size={iconSize} />
      </button>
    </div>
  );
}
