'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { getToken } from '@/lib/auth';
import { WS_URL } from '@/lib/config';

interface SosTapAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SosTapAlert({ isOpen, onClose }: SosTapAlertProps) {
  const [tapCount, setTapCount] = useState(0);
  const [message, setMessage] = useState('');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = getToken();
    const wsUrl = \`\${WS_URL}/ws/sos/1\${token ? \`?token=\${token}\` : ''}\`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log('✅ SOS Sender Connected');
    ws.onclose = () => console.log('❌ SOS Sender Disconnected');

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTapCount(0);
      setMessage('');
      setFlashMessage(null);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      setTimeout(() => {
        msgInputRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  const triggerSosAlert = async (finalCount: number, finalMsg: string) => {
    const payload = {
      tap_count: finalCount,
      message: finalMsg || 'No message provided',
      facility_id: '1',
      timestamp: new Date().toISOString()
    };
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      console.log('🚨 SOS ALERT SENT VIA WEBSOCKET:', payload);
    } else {
      console.error('WebSocket is not connected. Alert not sent.');
    }
    
    setFlashMessage(`✓ Alert sent — ${finalCount} ping${finalCount !== 1 ? 's' : ''} reported`);
    setTapCount(0);
    
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => {
      setFlashMessage(null);
      onClose(); // Auto-close overlay after short delay
    }, 3000);
  };

  const handleTap = () => {
    setTapCount(prev => prev + 1);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setTapCount(currentCount => {
        if (currentCount > 0) {
          triggerSosAlert(currentCount, message);
        }
        return currentCount;
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex flex-col p-4 bg-black/95">
      <div className="flex justify-between items-center mb-6 shrink-0 pt-4">
        <div className="text-white font-bold text-lg">SOS Network</div>
        <button 
          onClick={onClose}
          className="bg-transparent border-none text-white text-3xl font-light cursor-pointer leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center shrink-0">
        <div 
          onClick={handleTap}
          className="w-[200px] h-[200px] rounded-full border-4 border-solid border-[var(--brand-red)] bg-[#3a0a0a] flex flex-col items-center justify-center cursor-pointer transition-transform duration-100 active:scale-110 active:text-[#ff4444] text-white select-none"
        >
          <div className="text-[64px] font-bold leading-none mb-1">{tapCount}</div>
          <div className="text-[14px] font-semibold tracking-widest text-[#ffaaaa]">TAP</div>
        </div>
        <div className="text-center text-[12px] text-[#ffaaaa] mt-6 max-w-[260px] font-medium leading-relaxed">
          Tap the circle multiple times to silently ping managers & admins. Auto-sends 1.5s after last tap.
        </div>
      </div>

      <div className="mt-auto shrink-0 pb-6 relative">
        {flashMessage && (
          <div className="absolute -top-12 left-0 right-0 text-center font-bold text-[#22c55e] animate-pulse">
            {flashMessage}
          </div>
        )}
        <div className="text-[11px] font-semibold text-[#ffaaaa] mb-2 uppercase tracking-wide">
          Optional Message / Location
        </div>
        <textarea 
          ref={msgInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Someone is outside Unit 4B"
          className="w-full bg-[#1a0505] border border-solid border-[#3a0a0a] rounded-[var(--radius-lg)] p-4 text-white text-[15px] resize-none outline-none min-h-[100px] font-sans placeholder:text-[#ffaaaa]/50 focus:border-[var(--brand-red)] transition-colors"
        />
        <Button variant="full-red" className="mt-3" onClick={() => { if(tapCount === 0) triggerSosAlert(1, message); else handleTap(); }}>
          Send Alert Now
        </Button>
      </div>
    </div>
  );
}
