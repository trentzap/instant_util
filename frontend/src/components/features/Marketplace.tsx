'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getAuthHeaders } from '@/lib/auth';
import { API_URL } from '@/lib/config';

interface APIJobRequest {
  id: number;
  category: string;
  description: string;
  urgency: string;
  status: string;
  facility_id: number;
  resident_id: number;
  created_at: string;
}

export function Marketplace() {
  const [jobs, setJobs] = useState<APIJobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [selectedJob, setSelectedJob] = useState<APIJobRequest | null>(null);
  const [price, setPrice] = useState('');
  const [eta, setEta] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/quotes/marketplace/jobs`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch marketplace jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const res = await fetch(`${API_URL}/quotes/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          job_request_id: selectedJob.id,
          price: parseFloat(price),
          eta,
          note
        })
      });

      if (!res.ok) throw new Error('Failed to submit quote');

      alert('Quote submitted successfully!');
      setSelectedJob(null);
      setPrice('');
      setEta('');
      setNote('');
      fetchJobs(); // Refresh the list
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center text-[12px] text-[var(--text3)]">Loading marketplace...</div>;
  if (error) return <div className="p-4 text-center text-[12px] text-[var(--brand-red)]">{error}</div>;

  return (
    <div className="flex flex-col gap-3">
      {jobs.length === 0 ? (
        <div className="text-center p-6 text-[12px] text-[var(--text3)]">No open jobs available at the moment.</div>
      ) : (
        jobs.map(job => (
          <Card key={job.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[14px] font-bold text-[var(--text)]">{job.category}</div>
                <div className="text-[11px] text-[var(--text3)]">Facility ID: {job.facility_id}</div>
              </div>
              <Badge color={job.urgency === 'urgent' ? 'red' : job.urgency === 'high' ? 'amber' : 'gray'}>
                {job.urgency.toUpperCase()}
              </Badge>
            </div>
            <div className="text-[12px] text-[var(--text2)] mt-1">"{job.description}"</div>
            
            <Button variant="full-dark" className="mt-2" onClick={() => setSelectedJob(job)}>
              Submit Estimate
            </Button>
          </Card>
        ))
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 z-[600] flex items-center justify-center p-4">
          <Card className="w-full max-w-[400px] !m-0">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[16px] font-bold text-[var(--text)]">Submit Estimate</div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="bg-transparent border-none text-[20px] cursor-pointer text-[var(--text3)] font-sans leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="text-[13px] font-bold text-[var(--brand-blue)] mb-4 pb-3 border-b border-solid border-[var(--border)]">
              {selectedJob.category}
            </div>

            <form onSubmit={submitEstimate} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-1 block">Estimated Price ($)</label>
                <input 
                  type="number" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-base)] p-2 text-[var(--text)] text-[13px] outline-none font-sans"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-1 block">ETA</label>
                <input 
                  type="text" 
                  required
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-base)] p-2 text-[var(--text)] text-[13px] outline-none font-sans"
                  placeholder="Today, 2:00 PM"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-1 block">Notes</label>
                <textarea 
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-base)] p-2 text-[var(--text)] text-[13px] outline-none resize-none min-h-[60px] font-sans"
                  placeholder="I can fix this quickly..."
                />
              </div>
              <Button type="submit" variant="full-dark" className="mt-2">Send Quote to Manager</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
