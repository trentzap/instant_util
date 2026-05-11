import React from 'react';

type BadgeColor = 'blue' | 'green' | 'red' | 'amber' | 'gray' | 'purple';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  isMinor?: boolean;
}

export function Badge({ color = 'blue', isMinor, className = '', children, ...props }: BadgeProps) {
  let baseClasses = 'text-[10px] font-semibold py-0.5 px-2 rounded-full inline-block whitespace-nowrap border border-solid ';
  
  if (isMinor) {
    baseClasses += 'bg-[var(--purple-bg)] text-[var(--brand-purple)] border-[var(--purple-border)]';
  } else {
    switch (color) {
      case 'blue':
        baseClasses += 'bg-[var(--blue-bg)] text-[var(--brand-blue)] border-[var(--blue-border)]';
        break;
      case 'green':
        baseClasses += 'bg-[var(--green-bg)] text-[var(--brand-green)] border-[var(--green-border)]';
        break;
      case 'red':
        baseClasses += 'bg-[var(--red-bg)] text-[var(--brand-red)] border-[var(--red-border)]';
        break;
      case 'amber':
        baseClasses += 'bg-[var(--amber-bg)] text-[var(--brand-amber)] border-[var(--amber-border)]';
        break;
      case 'gray':
        baseClasses += 'bg-[var(--bg)] text-[var(--text3)] border-[var(--border)]';
        break;
      case 'purple':
        baseClasses += 'bg-[var(--purple-bg)] text-[var(--brand-purple)] border-[var(--purple-border)]';
        break;
    }
  }

  return (
    <span className={`${baseClasses} ${className}`} {...props}>
      {children}
    </span>
  );
}
