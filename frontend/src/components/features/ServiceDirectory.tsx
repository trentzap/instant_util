'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const CATEGORIES = [
  { id: 'maintenance', label: 'Maintenance & Repairs', icon: '🔧' },
  { id: 'lifestyle', label: 'Lifestyle & Amenities', icon: '✨' },
];

const SERVICES = [
  { id: 'plumbing', categoryId: 'maintenance', name: 'Plumbing & Leaks', desc: 'Burst pipes, blocked drains, hot water issues' },
  { id: 'electrical', categoryId: 'maintenance', name: 'Electrical Faults', desc: 'Power outages, sparking, faulty wiring' },
  { id: 'cleaning', categoryId: 'lifestyle', name: 'Apartment Cleaning', desc: 'Standard or deep clean services' },
];

export function ServiceDirectory() {
  const [expandedCat, setExpandedCat] = useState<string | null>('maintenance');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [urgency, setUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [description, setDescription] = useState('');

  const submitJobRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      service_id: selectedService.id,
      category: selectedService.name,
      urgency,
      description,
      facility_id: 'facility_123_placeholder',
      resident_id: 'user_123_placeholder',
      status: 'open',
      timestamp: new Date().toISOString()
    };
    
    console.log('🛠️ JOB REQUEST SUBMITTED:', payload);
    alert(`Job Request Sent for ${selectedService.name}!`);
    
    setSelectedService(null);
    setDescription('');
    setUrgency('normal');
  };

  if (selectedService) {
    return (
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setSelectedService(null)}
          className="text-[12px] font-semibold text-[var(--brand-blue)] bg-transparent border-none cursor-pointer flex items-center w-fit p-0 hover:underline"
        >
          ← Back to Directory
        </button>
        
        <Card>
          <div className="text-[16px] font-bold text-[var(--text)] mb-1">
            {selectedService.name}
          </div>
          <div className="text-[12px] text-[var(--text3)] mb-4">{selectedService.desc}</div>
          
          <form onSubmit={submitJobRequest} className="flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-2">Urgency</div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setUrgency('normal')} className={`flex-1 py-2 rounded-[var(--radius-base)] border border-solid text-[12px] font-semibold transition-colors cursor-pointer ${urgency === 'normal' ? 'bg-[var(--surface)] border-[var(--text)] text-[var(--text)]' : 'bg-transparent border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg)]'}`}>Normal</button>
                <button type="button" onClick={() => setUrgency('high')} className={`flex-1 py-2 rounded-[var(--radius-base)] border border-solid text-[12px] font-semibold transition-colors cursor-pointer ${urgency === 'high' ? 'bg-[var(--amber-bg)] border-[var(--amber-border)] text-[var(--brand-amber)]' : 'bg-transparent border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg)]'}`}>High</button>
                <button type="button" onClick={() => setUrgency('urgent')} className={`flex-1 py-2 rounded-[var(--radius-base)] border border-solid text-[12px] font-semibold transition-colors cursor-pointer ${urgency === 'urgent' ? 'bg-[var(--red-bg)] border-[var(--red-border)] text-[var(--brand-red)]' : 'bg-transparent border-[var(--border)] text-[var(--text2)] hover:bg-[var(--bg)]'}`}>Urgent</button>
              </div>
            </div>
            
            <div>
              <div className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-2">Description</div>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-lg)] p-3 text-[var(--text)] text-[13px] resize-none min-h-[100px] outline-none focus:border-[var(--brand-blue)] transition-colors font-sans"
              />
            </div>
            
            <Button type="submit" variant={urgency === 'urgent' ? 'full-red' : 'full-dark'}>
              Submit Request
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest mb-1 mt-2">
        Service Directory
      </div>
      
      {CATEGORIES.map(cat => (
        <Card key={cat.id} className="!p-0 overflow-hidden !mb-0">
          <div 
            onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
            className="flex items-center gap-3 p-3 cursor-pointer bg-[var(--surface)] hover:bg-[var(--bg)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--bg)] flex items-center justify-center text-[16px] shrink-0">
              {cat.icon}
            </div>
            <div className="font-semibold text-[13px] text-[var(--text)] flex-1">{cat.label}</div>
            <div className="text-[var(--text3)] font-bold text-[18px]">{expandedCat === cat.id ? '−' : '+'}</div>
          </div>
          
          {expandedCat === cat.id && (
            <div className="border-t border-solid border-[var(--border)] p-2 bg-[var(--bg)] flex flex-col gap-1">
              {SERVICES.filter(s => s.categoryId === cat.id).map(svc => (
                <div 
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  className="flex justify-between items-center p-2 rounded-[var(--radius-base)] cursor-pointer hover:bg-[var(--surface)] transition-colors"
                >
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--text)]">{svc.name}</div>
                    <div className="text-[11px] text-[var(--text3)] line-clamp-1">{svc.desc}</div>
                  </div>
                  <div className="text-[var(--brand-blue)] text-[20px] font-light leading-none ml-2">›</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
