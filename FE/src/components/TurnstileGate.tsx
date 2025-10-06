/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TurnstileGateProps {
  siteKey: string;
  onVerify: (token: string) => Promise<void> | void;
  onCancel?: () => void;
}

declare global {
  interface Window {
    turnstile?: any;
  }
}

export default function TurnstileGate({ siteKey, onVerify, onCancel }: TurnstileGateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    function renderWidget() {
      if (!window.turnstile || !containerRef.current) return;
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: async (token: string) => {
          try {
            await onVerify(token);
          } catch (e) {
            setError('Xác thực thất bại, vui lòng thử lại.');
          }
        },
        'error-callback': () => setError('Không tải được Turnstile, vui lòng thử lại.'),
        'expired-callback': () => setError('Phiên xác thực đã hết hạn. Vui lòng làm mới.'),
      });
      setIsLoading(false);
    }

    if (!window.turnstile) {
      script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.async = true;
      (window as any).onTurnstileLoad = () => renderWidget();
      document.body.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
      // Cloudflare tự cleanup widget khi element bị unmount
    };
  }, [siteKey, onVerify]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
      <div className="bg-[rgb(39,39,42)] rounded-xl p-4 w-[380px] max-w-[90%]">
        <p className="text-white text-sm mb-3">Vui lòng xác minh trước khi tiếp tục</p>
        <div ref={containerRef} className="flex items-center justify-center min-h-[80px]" />
        {isLoading && <p className="text-gray-400 text-xs mt-2">Đang tải Turnstile...</p>}
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <div className="mt-3 flex justify-end gap-2">
          {onCancel && (
            <button className="text-sm px-3 py-1 rounded bg-zinc-700 text-white" onClick={onCancel}>
              Hủy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


