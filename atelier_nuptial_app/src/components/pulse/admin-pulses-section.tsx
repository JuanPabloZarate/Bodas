'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Utensils, AlertCircle } from 'lucide-react';

export interface AdminPulsesSectionProps {
  kpis?: {
    totalAttending?: number;
    totalInvited?: number;
    dietaryNeeds?: number;
  };
}

export function AdminPulsesSection({ kpis }: AdminPulsesSectionProps) {
  const totalAttending = kpis?.totalAttending || 98;
  const totalInvited = kpis?.totalInvited || 98;
  const dietaryNeeds = kpis?.dietaryNeeds || 26;

  return (
    <div
      data-testid="admin-pulses-section"
      className="max-w-7xl mx-auto px-gutter pt-space-lg pb-space-xl w-full"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
              Official Nuptial Command
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Live Status &amp; Admin Pulses
          </h2>
          <p className="font-quote-italic text-quote-italic text-secondary">
            Verified operational updates directly from Villa Bellissima&apos;s master concierge desk.
          </p>
        </div>

        <div className="px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-uppercase text-label-uppercase font-semibold flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>Admin Dispatch Live</span>
        </div>
      </div>

      {/* Live Executive Pulses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mb-space-lg">
        {/* Pulse 1: Concierge Marco */}
        <div className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between shadow-sm relative overflow-hidden border border-surface-container-highest">
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-xs">
                17:45 CET • Villa Concierge
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-space-xs mt-1">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-uppercase text-[11px] font-bold">
                MC
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">
                  Marco Castiglione
                </h4>
                <span className="text-[11px] text-on-surface-variant">
                  Head Nuptial Concierge
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs leading-relaxed">
              &ldquo;Photographers are now conducting golden hour portraits at Terrace Bel Paese. All guests are warmly invited before the banquet bell tolls at 19:15 CET.&rdquo;
            </p>
          </div>

          <div className="pt-space-md flex items-center justify-between text-[11px] font-label-uppercase text-on-surface-variant border-t border-surface-container-high">
            <span className="font-semibold text-primary">Verified Broadcast</span>
            <span className="text-secondary font-semibold">Priority 1</span>
          </div>
        </div>

        {/* Pulse 2: Chef Lorenzo */}
        <div className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between shadow-sm relative overflow-hidden border border-surface-container-highest">
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-xs">
                17:15 CET • Dining Atelier
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-space-xs mt-1">
              <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-uppercase text-[11px] font-bold">
                CL
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">
                  Chef Lorenzo Moretti
                </h4>
                <span className="text-[11px] text-on-surface-variant">
                  Executive Culinary Master
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs leading-relaxed">
              &ldquo;Dinner seating begins at 19:15 CET in Grand Loggia. All dietary requirements (nut-free, gluten-free, and pescatarian) are meticulously customized for each table.&rdquo;
            </p>
          </div>

          <div className="pt-space-md flex items-center justify-between text-[11px] font-label-uppercase text-on-surface-variant border-t border-surface-container-high">
            <span className="font-semibold text-primary">Verified Broadcast</span>
            <span className="text-secondary font-semibold">Catering Confirmed</span>
          </div>
        </div>

        {/* Pulse 3: Logistics & Transport Alert */}
        <div className="p-space-lg rounded-2xl bg-surface-container flex flex-col justify-between shadow-sm relative overflow-hidden border border-surface-container-highest">
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-xs">
                16:00 CET • Transport Dispatch
              </span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>

            <div className="flex items-center gap-space-xs mt-1">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-uppercase text-[11px] font-bold">
                TS
              </div>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface">
                  Tuscan Chauffeur Services
                </h4>
                <span className="text-[11px] text-on-surface-variant">
                  Return Shuttle Fleet
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs leading-relaxed">
              &ldquo;Return shuttles to Florence Santa Maria Novella and local Borgo hotels are scheduled for 23:30 CET, 01:00 CET, and 02:30 CET from the main stone courtyard.&rdquo;
            </p>
          </div>

          <div className="pt-space-md flex items-center justify-between text-[11px] font-label-uppercase text-on-surface-variant border-t border-surface-container-high">
            <span className="font-semibold text-primary">Verified Broadcast</span>
            <span className="text-secondary font-semibold">3 Vehicles on Standby</span>
          </div>
        </div>
      </div>

      {/* Live Key Metrics Ticker Strip */}
      <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-center md:text-left">
          {/* Metric 1 */}
          <div className="flex items-center gap-space-md justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                {totalAttending} / {totalInvited} Checked In
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                100% Present • All Suites Occupied
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-space-md justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed/60 flex items-center justify-center text-secondary shrink-0">
              <Utensils className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                Table Allocations 100%
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                12 Tables • Starlit Loggia Locked
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-space-md justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
              <AlertCircle className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                {dietaryNeeds} Dietary Flags Active
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Gluten-Free, Nut-Free, Pescatarian Catered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
