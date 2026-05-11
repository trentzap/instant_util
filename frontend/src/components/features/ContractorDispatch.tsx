'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { JobRequest } from './JobManager';
import { API_URL } from '@/lib/config';

interface Quote {
  id: number;
  contractor_id: number;
  price: number;
  eta: string;
  note: string;
  status: string;
}

export function ContractorDispatch({ job, onBack, getAuthHeaders }: { job: JobRequest, onBack: () => void, getAuthHeaders: () => Record<string, string> }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`${API_URL}/quotes/job/${job.id}`, {
          headers: getAuthHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setQuotes(data);
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [job.id, getAuthHeaders]);

  const awardJobToContractor = async (jobId: number, quoteId: number) => {
    try {
      const response = await fetch(`${API_URL}/quotes/${quoteId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert("Contractor Dispatched Successfully!");
        onBack(); // Go back to the job list which will refresh and show it dispatched
      } else {
        console.error("Failed to award job");
        alert("Failed to award job");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        
        {loading ? (
          <div className="text-center p-6 text-[12px] text-[var(--text3)]">Loading quotes...</div>
        ) : quotes.length === 0 ? (
          <div className="text-center p-6 text-[12px] text-[var(--text3)]">Waiting for contractors to submit quotes...</div>
        ) : (
          quotes.map(quote => (
            <Card key={quote.id} className="mb-3">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Avatar initials="CO" className="w-6 h-6 text-[10px] bg-[var(--bg)] border-[var(--border2)]" />
                  <div className="text-[13px] font-bold text-[var(--text)]">Contractor #{quote.contractor_id}</div>
                </div>
                <div className="text-[14px] font-bold text-[var(--brand-green)]">${quote.price}</div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge color="blue">🕐 {quote.eta}</Badge>
                {quote.status === 'accepted' && <Badge color="green">ACCEPTED</Badge>}
              </div>
              
              <div className="text-[11px] text-[var(--text2)] italic mb-4">"{quote.note}"</div>
              
              {quote.status === 'pending' && (
                <Button variant="full-dark" onClick={() => awardJobToContractor(job.id!, quote.id)}>
                  Award Job to Contractor
                </Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
