import React from 'react';

export function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div className={`w-8 h-8 rounded-full bg-[var(--surface)] border border-solid border-[var(--border)] flex items-center justify-center text-[11px] font-bold text-[var(--text)] flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}
