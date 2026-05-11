'use client';

import React, { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';
import { WS_URL } from '@/lib/config';

interface AlertPayload {
  tap_count: number;
  message: string;
  facility_id: string;
  timestamp: string;
}

export function AlertReceiver() {
  const [activeAlert, setActiveAlert] = useState<AlertPayload | null>(null);

  useEffect(() => {
    const token = getToken();
    const wsUrl = \`\${WS_URL}/ws/sos/1\${token ? \`?token=\${token}\` : ''}\`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('✅ SOS Receiver Connected');
    
    ws.onmessage = (event) => {
      try {
        const payload: AlertPayload = JSON.parse(event.data);
        console.log('📡 WEBSOCKET RECEIVER: Received Alert Payload:', payload);
        setActiveAlert(payload);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => console.log('❌ SOS Receiver Disconnected');

    return () => {
      ws.close();
    };
  }, []);

  if (!activeAlert) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[600] flex justify-center p-4">
      <div className="bg-[var(--brand-red)] w-full max-w-[440px] rounded-[var(--radius-lg)] shadow-[0_8px_32px_rgba(239,68,68,0.4)] border border-solid border-[#ff8888] overflow-hidden transform transition-all">
        <div className="bg-[#b91c1c] px-3 py-2 flex justify-between items-center">
          <div className="text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Priority Dispatch
          </div>
          <button 
            onClick={() => setActiveAlert(null)}
            className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer text-[16px] leading-none font-sans"
          >
            ×
          </button>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="text-[16px] font-bold text-white tracking-tight">
            🚨 QR TAP-ALERT — Unit 4B
          </div>
          <div className="text-[13px] text-white/90 font-medium">
            Resident triggered {activeAlert.tap_count} tap pings.
          </div>
          {activeAlert.message && activeAlert.message !== 'No message provided' && (
            <div className="bg-black/20 p-2.5 rounded-[var(--radius-base)] text-[12px] text-white italic mt-1 border-l-2 border-solid border-white/40">
              "{activeAlert.message}"
            </div>
          )}
          <div className="text-[10px] text-white/60 mt-1 uppercase tracking-wide">
            {new Date(activeAlert.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
