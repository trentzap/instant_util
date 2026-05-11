import React from 'react';

interface TopbarProps {
  title: React.ReactNode;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function Topbar({ title, subtitle, rightElement }: TopbarProps) {
  return (
    <div className="bg-[var(--surface)] border-b border-solid border-[var(--border)] py-2.5 px-4 flex items-center justify-between gap-2 shrink-0">
      <div>
        <div className="text-[15px] font-semibold text-[var(--text)]">{title}</div>
        {subtitle && <div className="text-[11px] text-[var(--text3)] mt-px">{subtitle}</div>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
