'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { AlertReceiver } from '@/components/features/AlertReceiver';
import { JobManager, JobRequest } from '@/components/features/JobManager';
import { ContractorDispatch } from '@/components/features/ContractorDispatch';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';

export default function ManagerDashboard() {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  // A quick helper to simulate receiving a WebSocket SOS alert for demonstration purposes.
  // In a real app, the WebSocket connection handles this in the background.
  const triggerMockAlert = () => {
    if (typeof window !== 'undefined' && (window as any).mockReceiveWebSocketMessage) {
      (window as any).mockReceiveWebSocketMessage({
        tap_count: 5,
        message: 'Suspicious activity near the south entrance.',
        facility_id: 'facility_123',
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 w-full overflow-x-hidden">
      <AlertReceiver />
      
      <Topbar 
        title="Harborview Apartments" 
        subtitle="Facility Manager"
        rightElement={<Avatar initials="FM" className="bg-[var(--blue-bg)] text-[var(--brand-blue)] border-[var(--blue-border)]" />}
      />

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border2)] [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Welcome Section */}
        <div className="mb-6 mt-2 flex justify-between items-start">
          <div>
            <div className="text-[20px] font-bold text-[var(--text)] tracking-tight">
              Manager Dispatch
            </div>
            <div className="text-[13px] text-[var(--text3)] mt-1">
              Active facility operations overview.
            </div>
          </div>
          
          <button 
            onClick={triggerMockAlert}
            className="text-[10px] font-bold text-[var(--brand-red)] border border-solid border-[var(--brand-red)] bg-transparent px-2 py-1 rounded cursor-pointer hover:bg-[var(--red-bg)] transition-colors uppercase font-sans"
            title="Click to simulate an incoming SOS tap-alert"
          >
            Simulate SOS
          </button>
        </div>

        {/* Global Facility Status */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="!mb-0 flex flex-col justify-center items-center text-center py-4">
            <div className="text-[24px] font-bold text-[var(--text)]">3</div>
            <div className="text-[11px] font-semibold text-[var(--text3)] uppercase tracking-widest mt-1">Active Jobs</div>
          </Card>
          <Card className="!mb-0 flex flex-col justify-center items-center text-center py-4 border-[var(--amber-border)] bg-[var(--amber-bg)]">
            <div className="text-[24px] font-bold text-[var(--brand-amber)]">2</div>
            <div className="text-[11px] font-semibold text-[var(--brand-amber)] uppercase tracking-widest mt-1">Quotes</div>
          </Card>
        </div>

        {/* Dynamic Dispatch Area */}
        <div className="bg-[var(--bg)] p-1 rounded-[var(--radius-lg)]">
          {selectedJob ? (
            <ContractorDispatch 
              job={selectedJob} 
              onBack={() => setSelectedJob(null)} 
              getAuthHeaders={() => ({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              })}
            />
          ) : (
            <JobManager onSelectJob={setSelectedJob} />
          )}
        </div>
      </div>
    </div>
  );
}
