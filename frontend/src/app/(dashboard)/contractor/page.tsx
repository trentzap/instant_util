'use client';

import React from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Marketplace } from '@/components/features/Marketplace';
import { Avatar } from '@/components/ui/Avatar';

export default function ContractorDashboard() {
  return (
    <div className="flex flex-col h-full relative z-10 w-full overflow-x-hidden">
      <Topbar 
        title="Contractor Portal" 
        subtitle="Marketplace Leads"
        rightElement={<Avatar initials="CT" className="bg-[var(--green-bg)] text-[var(--brand-green)] border-[var(--green-border)]" />}
      />

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border2)] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="mb-6 mt-2">
          <div className="text-[20px] font-bold text-[var(--text)] tracking-tight">
            Available Jobs
          </div>
          <div className="text-[13px] text-[var(--text3)] mt-1">
            Browse and bid on open maintenance requests across your registered facilities.
          </div>
        </div>

        <Marketplace />
      </div>
    </div>
  );
}
