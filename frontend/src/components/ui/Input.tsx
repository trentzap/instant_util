import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] p-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--brand-blue)] transition-colors placeholder-[var(--text3)] ${className}`}
      {...props}
    />
  );
}
