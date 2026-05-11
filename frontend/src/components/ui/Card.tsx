import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div 
      className={`bg-[var(--surface)] border border-solid border-[var(--border)] rounded-[var(--radius-lg)] p-3 mb-2 shadow-[var(--shadow-custom)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-[13px] font-semibold text-[var(--text)] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardSub({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-[11px] text-[var(--text3)] mt-0.5 leading-snug ${className}`} {...props}>
      {children}
    </div>
  );
}
