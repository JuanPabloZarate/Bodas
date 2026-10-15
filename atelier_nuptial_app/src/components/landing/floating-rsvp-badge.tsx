'use client';

import React from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FloatingRsvpBadgeProps {
  className?: string;
}

export function FloatingRsvpBadge({ className }: FloatingRsvpBadgeProps) {
  const { currentGuest } = useWeddingStore();

  return (
    <aside
      className={cn(
        'fixed bottom-6 right-6 z-40 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl p-space-sm hidden sm:flex items-center gap-space-sm border border-outline-variant/40 animate-fade-in',
        className
      )}
      data-testid="floating-rsvp-badge"
      aria-label="Quick RSVP Action"
    >
      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
        <Mail className="w-5 h-5" />
      </div>
      <div className="flex flex-col pr-space-xs">
        <span className="font-label-uppercase text-[10px] text-secondary">
          {currentGuest?.name || 'Juan Pablo'} • Invitation
        </span>
        <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
          Nov 26, 2026 • Tuscany
        </span>
      </div>
      <a
        href="#rsvp"
        className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors active:scale-95 shadow-sm text-xs"
      >
        RSVP Now
      </a>
    </aside>
  );
}
