import React from 'react';

export default function FormAlert({ message, variant = 'error' }) {
  if (!message) return null;

  const styles =
    variant === 'success'
      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
      : 'bg-red-500/10 border-red-500/50 text-red-400';

  return (
    <div className={`border px-4 py-3 rounded-xl mb-6 text-sm ${styles}`}>
      {message}
    </div>
  );
}
