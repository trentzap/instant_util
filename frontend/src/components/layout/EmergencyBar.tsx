import React from 'react';

export function EmergencyBar({ onSosClick }: { onSosClick?: () => void }) {
  return (
    <div className="bg-[var(--red-bg)] border-b border-solid border-[var(--red-border)] py-1.5 px-4 flex items-center gap-2 text-[11px] font-semibold text-[var(--brand-red)] shrink-0 sticky top-0 z-[100]">
      <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-red)] shrink-0 animate-pulse" />
      <span>Emergency Network Active</span>
      <div className="flex gap-1.5 ml-auto">
        <button 
          onClick={onSosClick}
          className="text-[10px] font-semibold py-0.5 px-2 rounded-full border border-solid border-[var(--red-border)] text-[var(--brand-red)] bg-[var(--red-bg)] cursor-pointer transition-colors duration-150 hover:bg-[var(--red-border)]"
        >
          SOS Tap-Alert
        </button>
      </div>
    </div>
  );
}
