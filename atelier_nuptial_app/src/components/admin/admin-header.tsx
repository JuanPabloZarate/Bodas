// src/components/admin/admin-header.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  UserPlus,
  Download,
  Eye,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AdminHeaderProps {
  onOpenAddGuestModal: () => void;
  onExportCSV: () => void;
  targetDate?: string; // Default: "2026-11-26T16:30:00Z"
  className?: string;
}

export function AdminHeader({
  onOpenAddGuestModal,
  onExportCSV,
  targetDate = '2026-11-26T16:30:00Z',
  className = '',
}: AdminHeaderProps) {
  // Dynamic countdown calculation with deterministic fallback
  const daysRemaining = useMemo(() => {
    try {
      const target = new Date(targetDate).getTime();
      const now = new Date('2026-10-11T12:00:00Z').getTime(); // Deterministic baseline
      const diffTime = target - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 46;
    } catch {
      return 46;
    }
  }, [targetDate]);

  return (
    <header className={`w-full flex flex-col gap-6 ${className}`}>
      {/* Top Operational Navigation Bar */}
      <div className="w-full bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_1px_8px_rgba(44,37,35,0.04)] py-3 px-4 md:px-8 -mx-4 md:-mx-8 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary font-headline-sm text-sm italic select-none shadow-xs border border-secondary/15">
              J&amp;P
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-base tracking-tight text-on-surface font-semibold">
                Julia &amp; Pedro
              </span>
              <span className="font-label-uppercase text-[10px] text-secondary uppercase -mt-0.5 tracking-wider">
                Wedding Atelier &amp; Admin
              </span>
            </div>
          </div>

          {/* Quick Module Preview Links */}
          <nav
            aria-label="Admin quick preview navigation"
            className="hidden md:flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40"
          >
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-label-uppercase text-secondary hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
              title="Preview Public Invitation"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Invitation (/)</span>
            </Link>
            <Link
              href="/portal"
              className="px-3 py-1.5 rounded-lg text-xs font-label-uppercase text-secondary hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
              title="Preview VIP Guest Pass"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Guest Portal (/portal)</span>
            </Link>
            <Link
              href="/pulse"
              className="px-3 py-1.5 rounded-lg text-xs font-label-uppercase text-secondary hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
              title="Preview Live Wedding Pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Pulse (/pulse)</span>
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportCSV}
              className="hidden sm:inline-flex text-xs font-label-uppercase tracking-wider"
              iconLeft={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-surface-container-high">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-label-uppercase text-[11px] text-on-surface font-semibold">
                  J &amp; P Admin
                </span>
                <span className="text-[10px] text-outline -mt-0.5">Celebration Suite</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Tuscan Overview Banner */}
      <section className="relative w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 overflow-hidden">
        {/* Subtle Tuscan ambient glow */}
        <div
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gradient-to-r from-primary-fixed/25 via-secondary-fixed/20 to-tertiary-fixed/30 blur-3xl pointer-events-none -z-10 rounded-full"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Couple Headline & Tuscan Context */}
          <div className="flex flex-col max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-secondary font-label-uppercase text-xs tracking-wider mb-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Villa Bellissima • Chianti, Toscana</span>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-primary font-semibold">Private Curated Registry</span>
            </div>

            <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight font-serif">
              Julia Rossi &amp; Pedro Silva
            </h1>

            <p className="font-quote-italic text-secondary text-base md:text-lg mt-1.5 flex items-center gap-2 italic">
              <Calendar className="w-4 h-4 text-secondary/70 shrink-0" />
              <span>Solemnization &amp; Gala Reception — Thursday, 26 November 2026</span>
            </p>
          </div>

          {/* Countdown Badge & Invite CTA */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start lg:self-auto bg-surface-container-low/80 p-3 sm:p-4 rounded-xl border border-surface-container-high/70 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-headline-sm text-lg font-bold shadow-xs">
              {daysRemaining}
            </div>
            <div className="flex flex-col pr-2">
              <span className="font-label-uppercase text-[10px] text-outline uppercase tracking-widest font-semibold">
                Days Remaining
              </span>
              <span className="font-body-sm text-xs text-on-surface font-medium">
                Final RSVP Deadline: Nov 1
              </span>
            </div>

            <Button
              variant="primary"
              onClick={onOpenAddGuestModal}
              className="text-xs font-label-uppercase tracking-wider shadow-sm ml-auto sm:ml-2"
              iconLeft={<UserPlus className="w-4 h-4" />}
            >
              + Invite Guest
            </Button>
          </div>
        </div>

        {/* Mobile-only Preview Links Strip */}
        <div className="flex md:hidden items-center justify-between gap-2 mt-4 pt-4 border-t border-surface-container-low text-xs">
          <Link
            href="/"
            className="text-secondary hover:text-primary font-label-uppercase text-[11px] flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Public (/)</span>
          </Link>
          <Link
            href="/portal"
            className="text-secondary hover:text-primary font-label-uppercase text-[11px] flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>VIP (/portal)</span>
          </Link>
          <Link
            href="/pulse"
            className="text-secondary hover:text-primary font-label-uppercase text-[11px] flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Live (/pulse)</span>
          </Link>
          <button
            type="button"
            onClick={onExportCSV}
            className="text-primary hover:underline font-label-uppercase text-[11px] flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>CSV</span>
          </button>
        </div>
      </section>
    </header>
  );
}
