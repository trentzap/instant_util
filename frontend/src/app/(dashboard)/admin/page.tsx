'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/config';

export default function AdminDashboard() {
  const [facilityData, setFacilityData] = useState({ name: '', type: 'residential', subscription_plan: 'premium' });
  const [managerData, setManagerData] = useState({ first_name: '', last_name: '', email: '', password: '', facility_id: '' });
  
  const [facilityLoading, setFacilityLoading] = useState(false);
  const [managerLoading, setManagerLoading] = useState(false);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacilityLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/facilities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(facilityData)
      });
      if (response.ok) {
        alert("Facility created successfully!");
        setFacilityData({ name: '', type: 'residential', subscription_plan: 'premium' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to create facility"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    } finally {
      setFacilityLoading(false);
    }
  };

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setManagerLoading(true);
    try {
      const payload = {
        ...managerData,
        facility_id: parseInt(managerData.facility_id, 10)
      };
      
      const response = await fetch(`${API_URL}/admin/managers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Manager registered successfully!");
        setManagerData({ first_name: '', last_name: '', email: '', password: '', facility_id: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || "Failed to register manager"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    } finally {
      setManagerLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative z-10 w-full overflow-x-hidden">
      <Topbar 
        title="God Mode" 
        subtitle="Global Admin Dashboard"
      />

      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--border2)] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="mb-6 mt-2">
          <div className="text-[20px] font-bold text-[var(--text)] tracking-tight">
            System Provisioning
          </div>
          <div className="text-[13px] text-[var(--text3)] mt-1">
            Create and manage globally deployed instances.
          </div>
        </div>

        {/* Create Facility Form */}
        <Card className="mb-6">
          <div className="text-[14px] font-bold text-[var(--text)] mb-4">Create New Facility</div>
          <form onSubmit={handleCreateFacility} className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Facility Name</label>
              <Input 
                value={facilityData.name} 
                onChange={(e) => setFacilityData({...facilityData, name: e.target.value})} 
                placeholder="e.g. Sunrise Towers" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Type</label>
                <select 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] p-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--brand-blue)] transition-colors"
                  value={facilityData.type}
                  onChange={(e) => setFacilityData({...facilityData, type: e.target.value})}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Plan</label>
                <select 
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] p-[10px] text-[13px] text-[var(--text)] outline-none focus:border-[var(--brand-blue)] transition-colors"
                  value={facilityData.subscription_plan}
                  onChange={(e) => setFacilityData({...facilityData, subscription_plan: e.target.value})}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
            <Button type="submit" variant="full-dark" className="mt-2" disabled={facilityLoading}>
              {facilityLoading ? 'Provisioning...' : 'Provision Facility'}
            </Button>
          </form>
        </Card>

        {/* Create Manager Form */}
        <Card>
          <div className="text-[14px] font-bold text-[var(--text)] mb-4">Register Facility Manager</div>
          <form onSubmit={handleCreateManager} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">First Name</label>
                <Input value={managerData.first_name} onChange={(e) => setManagerData({...managerData, first_name: e.target.value})} required />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Last Name</label>
                <Input value={managerData.last_name} onChange={(e) => setManagerData({...managerData, last_name: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Email</label>
              <Input type="email" value={managerData.email} onChange={(e) => setManagerData({...managerData, email: e.target.value})} required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Password</label>
              <Input type="password" value={managerData.password} onChange={(e) => setManagerData({...managerData, password: e.target.value})} required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase mb-1 block">Assigned Facility ID</label>
              <Input type="number" placeholder="e.g. 1" value={managerData.facility_id} onChange={(e) => setManagerData({...managerData, facility_id: e.target.value})} required />
            </div>
            <Button type="submit" variant="full-dark" className="mt-2" disabled={managerLoading}>
              {managerLoading ? 'Registering...' : 'Register Manager'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
