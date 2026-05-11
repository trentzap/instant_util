'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface JobRequest {
  id: string;
  category: string;
  description: string;
  urgency: 'normal' | 'high' | 'urgent';
  status: 'open' | 'pending quotes' | 'dispatched';
  residentName: string;
  unit: string;
  timeAgo: string;
}

const MOCK_JOBS: JobRequest[] = [
  { id: 'job_1', category: 'Plumbing & Leaks', description: 'Water leaking from the ceiling in the bathroom.', urgency: 'urgent', status: 'open', residentName: 'John Doe', unit: '4B', timeAgo: '10m ago' },
  { id: 'job_2', category: 'Electrical Faults', description: 'Power outlet sparking in kitchen.', urgency: 'high', status: 'pending quotes', residentName: 'Jane Smith', unit: '2A', timeAgo: '1h ago' },
  { id: 'job_3', category: 'Apartment Cleaning', description: 'Need deep clean before end of lease.', urgency: 'normal', status: 'dispatched', residentName: 'Bob Lee', unit: '7C', timeAgo: '2h ago' },
];

export function JobManager({ onSelectJob }: { onSelectJob: (job: JobRequest) => void }) {
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateJobStatus = (jobId: string, newStatus: string) => {
    // Placeholder function for FastAPI integration
    console.log(`🔄 UPDATE JOB ${jobId} to status: ${newStatus}`);
  };

  const filteredJobs = MOCK_JOBS.filter(job => {
    if (filterUrgency !== 'all' && job.urgency !== filterUrgency) return false;
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[14px] font-bold text-[var(--text)]">Active Requests</div>
        <Badge color="gray">{MOCK_JOBS.length} Total</Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <select 
          value={filterUrgency} 
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="bg-[var(--surface)] border border-solid border-[var(--border)] text-[var(--text2)] text-[12px] p-2 rounded-[var(--radius-base)] outline-none"
        >
          <option value="all">All Urgencies</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[var(--surface)] border border-solid border-[var(--border)] text-[var(--text2)] text-[12px] p-2 rounded-[var(--radius-base)] outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending quotes">Pending Quotes</option>
          <option value="dispatched">Dispatched</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center p-6 text-[12px] text-[var(--text3)]">No jobs match your filters.</div>
        ) : (
          filteredJobs.map(job => (
            <Card key={job.id} className="cursor-pointer hover:bg-[var(--bg)] transition-colors" onClick={() => onSelectJob(job)}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-[13px] font-bold text-[var(--text)]">{job.category}</div>
                  <div className="text-[11px] text-[var(--text3)]">{job.residentName} — Unit {job.unit}</div>
                </div>
                <div className="text-[10px] text-[var(--text3)]">{job.timeAgo}</div>
              </div>
              
              <div className="text-[12px] text-[var(--text2)] mb-3 line-clamp-2">"{job.description}"</div>
              
              <div className="flex items-center gap-2">
                <Badge color={job.urgency === 'urgent' ? 'red' : job.urgency === 'high' ? 'amber' : 'gray'}>
                  {job.urgency.toUpperCase()}
                </Badge>
                <Badge color={job.status === 'open' ? 'blue' : job.status === 'pending quotes' ? 'amber' : 'green'}>
                  {job.status.toUpperCase()}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
