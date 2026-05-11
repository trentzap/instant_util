'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { EmergencyBar } from '@/components/layout/EmergencyBar';
import { SosTapAlert } from '@/components/features/SosTapAlert';
import { ServiceDirectory } from '@/components/features/ServiceDirectory';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ResidentDashboard() {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <div className="flex flex-col h-full relative z-10 w-full overflow-x-hidden">
      <EmergencyBar onSosClick={() => setIsSosOpen(true)} />
      
      <Topbar 
        title="Harborview Apartments" 
        subtitle="Unit 4B — John Doe"
        rightElement={<Avatar initials="JD" />}
      />

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border2)] [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Welcome Section */}
        <div className="mb-6 mt-2">
          <div className="text-[20px] font-bold text-[var(--text)] tracking-tight">
            Welcome back, John.
          </div>
          <div className="text-[13px] text-[var(--text3)] mt-1">
            Everything is running smoothly at your facility.
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-6 bg-gradient-to-br from-[var(--surface)] to-[#1a1a1a]">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[12px] font-bold text-[var(--text)] uppercase tracking-wide">Account Status</div>
            <div className="text-[10px] font-semibold text-[var(--brand-green)] bg-[var(--green-bg)] px-2 py-0.5 rounded-full border border-solid border-[var(--green-border)]">
              Active Resident
            </div>
          </div>
          <div className="text-[11px] text-[var(--text2)] leading-relaxed">
            Your rent and utilities for this month are fully paid. No outstanding actions required.
          </div>
        </Card>

        {/* Service Directory Module */}
        <ServiceDirectory />
        
        {/* Help / Contact Support */}
        <div className="mt-8 mb-4 flex flex-col gap-2 items-center text-center">
          <div className="text-[11px] text-[var(--text3)]">Need assistance with the app?</div>
          <Button variant="default">Contact Platform Support</Button>
        </div>
      </div>

      <SosTapAlert isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
}
