'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { setToken } from '@/lib/auth';
import { API_URL } from '@/lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      setToken(data.access_token);
      
      // Redirect based on role
      if (data.user.role === 'manager') {
        router.push('/manager');
      } else if (data.user.role === 'resident') {
        router.push('/resident');
      } else if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4 bg-[var(--bg)] w-full">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="text-[24px] font-bold text-[var(--text)] tracking-tight">Instant.Utilities</div>
          <div className="text-[14px] text-[var(--text3)] mt-1">Sign in to your account</div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && (
              <div className="bg-[var(--red-bg)] text-[var(--brand-red)] p-3 rounded-[var(--radius-base)] text-[13px] border border-solid border-[var(--red-border)]">
                {error}
              </div>
            )}
            
            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-2 block">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-base)] p-3 text-[var(--text)] text-[14px] outline-none focus:border-[var(--brand-blue)] transition-colors font-sans"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[var(--text3)] uppercase tracking-wide mb-2 block">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg)] border border-solid border-[var(--border)] rounded-[var(--radius-base)] p-3 text-[var(--text)] text-[14px] outline-none focus:border-[var(--brand-blue)] transition-colors font-sans"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="full-dark" className="mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
