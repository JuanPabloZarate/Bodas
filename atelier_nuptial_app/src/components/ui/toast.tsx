'use client';

import React, { useEffect, useState } from 'react';

export const TOAST_EVENT = 'atelier-toast';

export interface ToastPayload {
  message: string;
  duration?: number;
}

export function showToast(message: string, duration: number = 2800) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ToastPayload>(TOAST_EVENT, {
        detail: { message, duration },
      })
    );
  }
}

export function ToastContainer() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;
      if (customEvent.detail?.message) {
        setToastMessage(customEvent.detail.message);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setToastMessage(null);
        }, customEvent.detail.duration || 2800);
      }
    };

    window.addEventListener(TOAST_EVENT, handleToast as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-on-background/95 text-surface font-label-md text-xs shadow-xl backdrop-blur-md flex items-center gap-2 border border-outline-variant/30 transition-all animate-fade-in"
      data-testid="toast-pill"
    >
      <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
      <span>{toastMessage}</span>
    </div>
  );
}
