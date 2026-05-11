import React from 'react';

type ButtonVariant = 'default' | 'primary' | 'blue' | 'green' | 'red' | 'amber' | 'full-dark' | 'full-red' | 'full-outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({ variant = 'default', fullWidth, className = '', children, ...props }: ButtonProps) {
  let baseClasses = '';
  
  if (variant.startsWith('full-')) {
    baseClasses = 'w-full p-2.5 text-sm font-semibold border-none rounded-[var(--radius-base)] cursor-pointer transition-all duration-150 font-sans ';
    
    switch (variant) {
      case 'full-dark':
        baseClasses += 'bg-[var(--text)] text-white hover:opacity-90';
        break;
      case 'full-red':
        baseClasses += 'bg-[var(--brand-red)] text-white hover:bg-[#b91c1c]';
        break;
      case 'full-outline':
        baseClasses += 'bg-transparent border border-solid border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg)]';
        break;
    }
  } else {
    baseClasses = 'text-[11px] font-semibold py-1 px-3 rounded-full border border-solid cursor-pointer whitespace-nowrap transition-all duration-150 ';
    
    switch (variant) {
      case 'default':
        baseClasses += 'border-[var(--border)] bg-[var(--surface)] text-[var(--text2)] hover:bg-[var(--bg)]';
        break;
      case 'primary':
        baseClasses += 'bg-[var(--text)] text-white border-[var(--text)] hover:opacity-90';
        break;
      case 'blue':
        baseClasses += 'border-[var(--blue-border)] text-[var(--brand-blue)] bg-[var(--blue-bg)] hover:bg-[#dbeafe]';
        break;
      case 'green':
        baseClasses += 'border-[var(--green-border)] text-[var(--brand-green)] bg-[var(--green-bg)]';
        break;
      case 'red':
        baseClasses += 'border-[var(--red-border)] text-[var(--brand-red)] bg-[var(--red-bg)]';
        break;
      case 'amber':
        baseClasses += 'border-[var(--amber-border)] text-[var(--brand-amber)] bg-[var(--amber-bg)]';
        break;
    }
    
    if (fullWidth) baseClasses += ' w-full';
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
