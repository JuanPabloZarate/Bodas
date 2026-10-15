'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Guest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Gift, User } from 'lucide-react';

export interface VIPBannerProps {
  guest?: Guest;
  className?: string;
}

export function VIPBanner({ guest: propGuest, className }: VIPBannerProps) {
  const { currentGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  if (!guest) return null;

  const companionDisplay = guest.companionName ? ` & ${guest.companionName}` : ' & Guest';
  const reservedSeatsText = `${guest.partySize || 2} Reserved ${
    guest.partySize === 1 ? 'Seat' : 'Seats'
  } for ${guest.name || 'Juan Pablo'}${companionDisplay}`;

  const statusVariant =
    guest.status === 'confirmed'
      ? 'sage'
      : guest.status === 'declined'
      ? 'neutral'
      : 'terracotta';

  const statusLabel =
    guest.status === 'confirmed'
      ? 'Confirmed'
      : guest.status === 'declined'
      ? 'Declined'
      : 'RSVP Pending';

  return (
    <section
      aria-label="VIP Guest Recognition Strip"
      className={cn(
        'w-full bg-surface-container-low border-b border-outline-variant/30 py-2.5 transition-all',
        className
      )}
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-wrap items-center justify-between gap-space-sm">
        {/* Left: Passcode & Reserved Seats */}
        <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container text-secondary font-label-uppercase text-label-uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary inline-block mr-2 animate-pulse" />
            VIP Invitation • Passcode #{guest.passcode || 'JP-8421'}
          </span>

          <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
            {reservedSeatsText}
          </span>

          <Badge variant={statusVariant} size="sm" className="hidden md:inline-flex">
            {statusLabel}
          </Badge>
        </div>

        {/* Right: Quick Action Jumps */}
        <div className="flex items-center gap-space-md">
          <a
            href="#rsvp"
            className="font-label-uppercase text-label-uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Confirm Attendance</span>
          </a>

          <a
            href="#registry"
            className="font-label-uppercase text-label-uppercase text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            <Gift className="w-4 h-4 text-secondary" />
            <span>Gift Registry</span>
          </a>

          <Link
            href="/portal"
            className="font-label-uppercase text-label-uppercase text-secondary hover:text-on-surface transition-colors hidden lg:flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            <User className="w-4 h-4 text-secondary" />
            <span>Guest Pass</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
