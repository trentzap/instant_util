'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { JobRequest } from './JobManager';

interface Quote {
  id: string;
  contractorName: string;
  price: number;
  eta: string;
  note: string;
}

const MOCK_QUOTES: Quote[] = [
  { id: 'quote_1', contractorName: 'ABC Plumbing', price: 150, eta: 'Today, 2:00 PM', note: 'Can fix the leak within an hour.' },
  { id: 'quote_2', contractorName: 'Express Pipes', price: 120, eta: 'Tomorrow Morning', note: 'Includes replacement parts if needed.' },
];

export function ContractorDispatch({ job, onBack }: { job: JobRequest, onBack: () => void }) {
  const awardJobToContractor = (jobId: string, quoteId: string) => {
    // Placeholder function for FastAPI integration
    console.log(`🏆 AWARDED JOB ${jobId} TO QUOTE ${quoteId}`);
    alert(`Job awarded successfully!`);
    onBack();
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={onBack}
        className="text-[12px] font-semibold text-[var(--brand-blue)] bg-transparent border-none cursor-pointer flex items-center w-fit p-0 hover:underline"
      >
        ← Back to Job List
      </button>

      <Card className="border-[var(--brand-blue)] bg-[var(--blue-bg)]">
        <div className="flex justify-between items-start mb-2">
          <div className="text-[14px] font-bold text-[var(--brand-blue)]">{job.category}</div>
          <Badge color={job.urgency === 'urgent' ? 'red' : job.urgency === 'high' ? 'amber' : 'gray'}>
            {job.urgency.toUpperCase()}
          </Badge>
        </div>
        <div className="text-[12px] text-[var(--text)] mb-1">Unit {job.unit} — {job.residentName}</div>
        <div className="text-[11px] text-[var(--brand-blue)] font-medium">"{job.description}"</div>
      </Card>

      <div className="mt-2">
        <div className="text-[12px] font-bold text-[var(--text3)] uppercase tracking-wide mb-3">Received Quotes</div>
        
        {MOCK_QUOTES.length === 0 ? (
          <div className="text-center p-6 text-[12px] text-[var(--text3)]">Waiting for contractors to submit quotes...</div>
        ) : (
          MOCK_QUOTES.map(quote => (
            <Card key={quote.id} className="mb-3">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Avatar initials={quote.contractorName.substring(0, 2).toUpperCase()} className="w-6 h-6 text-[10px] bg-[var(--bg)] border-[var(--border2)]" />
                  <div className="text-[13px] font-bold text-[var(--text)]">{quote.contractorName}</div>
                </div>
                <div className="text-[14px] font-bold text-[var(--brand-green)]">${quote.price}</div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge color="blue">🕐 {quote.eta}</Badge>
              </div>
              
              <div className="text-[11px] text-[var(--text2)] italic mb-4">"{quote.note}"</div>
              
              <Button variant="full-dark" onClick={() => awardJobToContractor(job.id, quote.id)}>
                Award Job to {quote.contractorName}
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
