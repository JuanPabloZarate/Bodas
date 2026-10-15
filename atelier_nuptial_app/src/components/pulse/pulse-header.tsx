'use client';

import React from 'react';
import { Guest } from '@/lib/types';
import { Camera, Feather, Wine, Sparkles, Music2 } from 'lucide-react';

export interface PulseHeaderProps {
  guest: Guest;
  onDropSnapClick?: () => void;
  onSendBlessingClick?: () => void;
}

export function PulseHeader({
  guest,
  onDropSnapClick,
  onSendBlessingClick,
}: PulseHeaderProps) {
  const tableName = guest?.tableName || 'Table 4 • Bellini';

  return (
    <section
      data-testid="pulse-header"
      className="relative max-w-7xl mx-auto px-gutter pt-space-md pb-space-md w-full"
    >
      {/* Live Celebration Status Ribbon & Live Music Banner */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Real-Time Sync Indicator */}
          <div className="flex items-center gap-space-xs bg-surface-container-low/95 backdrop-blur-md px-space-md py-1.5 rounded-full shadow-sm border border-secondary-container/40">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="w-2 h-2 rounded-full bg-primary -ml-2.5" />
            <span className="font-label-uppercase text-label-uppercase tracking-widest text-on-surface uppercase font-semibold">
              Real-Time Nuptial Sync Active
            </span>
            <span className="text-outline-variant font-light mx-1">•</span>
            <span className="font-label-uppercase text-label-uppercase text-secondary font-medium">
              Villa Bellissima, Siena
            </span>
          </div>

          {/* Journey Flowing Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 border border-secondary/20 text-on-secondary-container text-xs font-label-md">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="font-medium">65% of Nuptial Journey Flowing</span>
          </div>
        </div>

        {/* Live Soundscape Banner */}
        <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-primary-fixed/50 border border-primary/20 text-on-primary-fixed-variant font-label-md text-label-md shadow-xs">
          <Music2 className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-quote-italic italic text-secondary text-sm">
            Now Playing:
          </span>
          <span className="font-medium text-xs">
            “Estate” • Italian Jazz Trio (Lemon Grove)
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>

      {/* Main Editorial Header Framing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-end mb-space-md">
        <div className="lg:col-span-8 flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="h-px w-10 bg-secondary" />
            <span className="font-label-uppercase text-label-uppercase tracking-[0.25em] text-secondary uppercase font-semibold">
              Tuscan Solstice Celebration • Live Hub
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-[1.06]">
            Wedding Pulse{' '}
            <span className="font-quote-italic text-quote-italic italic font-normal text-secondary">
              &amp; Live Stream
            </span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
            Experience the living rhythm of Julia &amp; Pedro&apos;s nuptials in real-time across the cypress gardens, starlit loggia, and grand ballroom. Share snaps, toast tables, and sync with every heartfelt milestone.
          </p>
        </div>

        {/* Quick Interaction Deck */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-xs justify-end">
          <button
            type="button"
            data-testid="btn-drop-snap"
            onClick={onDropSnapClick}
            className="group flex items-center justify-between px-space-md py-3 rounded-xl bg-primary text-on-primary shadow-md hover:bg-on-primary-fixed-variant transition-all duration-300 ring-2 ring-primary/20 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-space-xs">
              <Camera className="w-5 h-5 text-on-primary" />
              <span className="font-label-uppercase text-label-uppercase tracking-wider font-semibold">
                Drop Snap to Live Feed
              </span>
            </div>
            <span className="font-headline-sm text-sm group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          <div className="flex gap-space-xs">
            <button
              type="button"
              data-testid="btn-send-blessing"
              onClick={onSendBlessingClick}
              className="flex-1 flex items-center justify-center gap-space-xs px-3 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer"
            >
              <Feather className="w-4 h-4 text-secondary" />
              <span className="font-label-uppercase text-label-uppercase font-medium">
                Send Blessing
              </span>
            </button>

            <div
              data-testid="header-table-badge"
              className="flex-1 flex items-center justify-center gap-space-xs px-3 py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed border border-secondary/20 shadow-xs"
            >
              <Wine className="w-4 h-4 text-secondary" />
              <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
                {tableName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
