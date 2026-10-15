'use client';

import React, { useState } from 'react';
import { TimelineMilestone } from '@/lib/types';
import {
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Camera,
  Music,
  Wine,
} from 'lucide-react';

export interface SplitChronogramProps {
  milestones: TimelineMilestone[];
  progressPercent?: number;
}

export function SplitChronogram({
  milestones,
  progressPercent = 65,
}: SplitChronogramProps) {
  const [isPastExpanded, setIsPastExpanded] = useState(false);

  const concluded = milestones.filter((m) => m.status === 'concluded');
  const current = milestones.find((m) => m.status === 'current') || milestones[3];
  const upcoming = milestones.filter((m) => m.status === 'upcoming');

  return (
    <div data-testid="split-chronogram-section" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
              Cadence of the Tuscan Solstice
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Celebration Chronogram
          </h2>
          <p className="font-quote-italic text-quote-italic text-secondary">
            Follow the living transition from golden hour aperitivo to midnight fireworks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-label-md text-on-surface">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="font-semibold">Synchronized with Master Chrono</span>
          </div>
          <span className="font-label-uppercase text-[11px] font-bold text-secondary bg-secondary-fixed/60 px-3 py-1 rounded-full">
            Phase 3 of 5 In Flight
          </span>
        </div>
      </div>

      {/* Wedding Journey Progress Bar */}
      <div
        data-testid="chronogram-progress-bar"
        className="p-space-md rounded-2xl bg-surface-container-low border border-surface-container mb-space-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-uppercase text-xs font-semibold text-on-surface">
            Wedding Timeline Progress ({progressPercent}% Complete)
          </span>
          <span className="font-label-uppercase text-xs font-bold text-secondary">
            Next: Grand Loggia Gala (19:30 CET)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 text-center mt-2 font-label-uppercase text-[10px] text-on-surface-variant">
          <span className="text-primary font-semibold">14:00 Transfers ✓</span>
          <span className="text-primary font-semibold">16:30 Vows Exchanged ✓</span>
          <span className="text-secondary font-bold">18:00 Aperitivo (Now)</span>
          <span className="text-outline">22:00 Cake &amp; Midnight DJ</span>
        </div>
      </div>

      {/* Mobile Collapsible Past Milestones Accordion */}
      <div className="block lg:hidden mb-space-md">
        <div className="bg-surface-container-low rounded-xl p-space-sm border border-surface-container shadow-xs">
          <button
            type="button"
            data-testid="btn-toggle-past-milestones"
            onClick={() => setIsPastExpanded(!isPastExpanded)}
            className="w-full flex items-center justify-between cursor-pointer list-none text-left"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-label-uppercase text-[11px] uppercase tracking-wider text-on-surface font-semibold">
                Past Milestones ({concluded.length} Concluded)
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${
                isPastExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isPastExpanded && (
            <div className="pt-3 pb-1 flex flex-col gap-2 pl-4 border-t border-surface-container mt-2">
              <div className="flex items-start justify-between text-on-surface-variant py-1 border-b border-surface-container/40">
                <div className="flex flex-col">
                  <span className="font-body-sm text-[12px] text-on-surface line-through font-medium">
                    Florence S.M. Novella Shuttle Transfers
                  </span>
                  <span className="font-body-sm text-[10px] text-outline">
                    14:00 CET • 3 Mercedes Sprinters Checked In
                  </span>
                </div>
                <span className="font-label-uppercase text-[9px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  Concluded
                </span>
              </div>

              <div className="flex items-start justify-between text-on-surface-variant py-1 border-b border-surface-container/40">
                <div className="flex flex-col">
                  <span className="font-body-sm text-[12px] text-on-surface line-through font-medium">
                    Welcome Aperitivo &amp; Tuscan String Quartet
                  </span>
                  <span className="font-body-sm text-[10px] text-outline">
                    15:30 CET • Lemon Grove Courtyard
                  </span>
                </div>
                <span className="font-label-uppercase text-[9px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  Concluded
                </span>
              </div>

              <div className="flex items-start justify-between text-on-surface-variant py-1">
                <div className="flex flex-col">
                  <span className="font-body-sm text-[12px] text-on-surface line-through font-medium">
                    Nuptial Vows at The Olive Terrace
                  </span>
                  <span className="font-body-sm text-[10px] text-outline">
                    16:30 CET • 100% Guests in Attendance
                  </span>
                </div>
                <span className="font-label-uppercase text-[9px] bg-primary-fixed text-primary px-2 py-0.5 rounded font-bold">
                  Concluded
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split Milestone Architecture: Completed vs In Flight vs Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left: Completed Milestones (Activities Done) */}
        <div data-testid="past-milestones-list" className="lg:col-span-5 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Activities Accomplished
            </h3>
            <span className="font-label-uppercase text-label-uppercase text-primary font-semibold px-2.5 py-0.5 rounded-full bg-primary-fixed text-xs">
              {concluded.length} of {milestones.length} Concluded
            </span>
          </div>

          {/* Desktop Completed Item 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-space-xs border border-surface-container/70 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                14:00 CET • Arrival
              </span>
              <span className="flex items-center gap-1 font-label-uppercase text-label-uppercase text-primary font-bold text-[10px] bg-primary-fixed/60 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-primary" />
                Concluded
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface text-[18px]">
              Shuttle Transfers from Florence SMN
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              All 42 arriving train passengers chauffeured smoothly through Chianti hills to Villa suites without delay.
            </p>
            <div className="pt-1 flex items-center justify-between text-on-surface-variant font-label-md text-xs">
              <span className="flex items-center gap-1">
                3 Mercedes Sprinters Checked In
              </span>
              <span className="text-secondary font-medium">Memory logged ✓</span>
            </div>
          </div>

          {/* Desktop Completed Item 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-space-xs border border-surface-container/70 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                15:30 CET • Gathering
              </span>
              <span className="flex items-center gap-1 font-label-uppercase text-label-uppercase text-primary font-bold text-[10px] bg-primary-fixed/60 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-primary" />
                Concluded
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface text-[18px]">
              Welcome Aperitivo in Lemon Grove Courtyard
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Chilled white peach Bellinis and fresh pecorino pastries served in the Lemon Grove under shade umbrellas.
            </p>
            <div className="pt-1 flex items-center justify-between text-on-surface-variant font-label-md text-xs">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5" /> Vivaldi Spring &amp; Morricone
              </span>
              <span className="text-secondary font-medium">48 Snaps logged</span>
            </div>
          </div>

          {/* Desktop Completed Item 3 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs flex flex-col gap-space-xs border border-surface-container/70 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold">
                16:30 CET • Sacred Moment
              </span>
              <span className="flex items-center gap-1 font-label-uppercase text-label-uppercase text-primary font-bold text-[10px] bg-primary-fixed/60 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-primary" />
                Concluded
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface text-[18px]">
              Nuptial Vows at The Olive Terrace
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Solemn covenant vows exchanged overlooking the Siena valley. Olive branch rings blessed by Father Matteo.
            </p>
            <div className="pt-1 flex items-center justify-between text-on-surface-variant font-label-md text-xs">
              <span className="flex items-center gap-1">
                100% Guests in Attendance
              </span>
              <span className="text-secondary font-medium">Spotlight Moment captured</span>
            </div>
          </div>
        </div>

        {/* Right: Active & Upcoming Festivities */}
        <div className="lg:col-span-7 space-y-space-md">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Present Pulse &amp; Upcoming
            </h3>
            <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold px-2.5 py-0.5 rounded-full bg-secondary-fixed text-xs">
              Live Focus
            </span>
          </div>

          {/* HAPPENING NOW (Hero Accent) */}
          <div
            data-testid="milestone-happening-now"
            className="p-space-lg rounded-2xl bg-surface-container-high shadow-md relative overflow-hidden border border-secondary/30"
          >
            <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-xs">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-on-primary shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-on-primary animate-ping" />
                <span className="font-label-uppercase text-label-uppercase font-bold tracking-widest uppercase text-xs">
                  Happening Now • {current?.time || '18:00 CET'}
                </span>
              </div>
              <span className="font-quote-italic text-quote-italic text-secondary font-medium">
                Golden Hour Light Window Active
              </span>
            </div>

            <h4 className="font-headline-md text-headline-md text-on-surface mt-2">
              {current?.title || 'Tuscan Sunset Aperitivo & Golden Hour Portraits'}
            </h4>

            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
              {current?.description ||
                'Terrace Bel Paese & Cypress Alleé. Savor chilled Limoncello Spritz, freshly sliced San Daniele prosciutto, and artisanal Tuscan fritto misto while our portrait documentarians circulate.'}
            </p>

            <div className="mt-space-md p-space-sm rounded-xl bg-surface/90 flex flex-wrap items-center justify-between gap-space-sm border border-secondary-container/40">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-secondary" />
                <span className="font-label-md text-xs text-on-surface font-semibold">
                  Portrait Stations 1 &amp; 2 active on lower stone balustrade
                </span>
              </div>
              <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-xs bg-secondary-fixed px-2.5 py-1 rounded-full">
                Ends in 35m (19:15 CET)
              </span>
            </div>
          </div>

          {/* Upcoming Timeline Cards */}
          <div data-testid="upcoming-milestones-list" className="space-y-space-xs">
            {/* Next Up: Gala Dinner */}
            <div className="p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-surface-container-highest">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-xs">
                    19:30 CET
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-uppercase text-[10px] uppercase font-bold animate-pulse">
                    In 35 Minutes
                  </span>
                </div>
                <h5 className="font-headline-sm text-headline-sm text-on-surface text-[19px]">
                  Five-Course Tuscan Gala Banquet &amp; Nuptial Toasts
                </h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Grand Starlit Loggia. Seating begins 19:15 CET with welcome glass of vintage Brunello di Montalcino.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold text-xs">
                  Loggia West
                </span>
                <span className="text-on-surface-variant font-body-sm text-[12px]">
                  Formal Nuptial • 12 Tables
                </span>
              </div>
            </div>

            {/* Later Tonight: Cake & DJ */}
            <div className="p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-surface-container-highest">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-uppercase text-label-uppercase text-outline font-bold text-xs">
                    22:00 CET
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-uppercase text-[10px] uppercase font-semibold">
                    Celebration Peak
                  </span>
                </div>
                <h5 className="font-headline-sm text-headline-sm text-on-surface text-[19px]">
                  Live Millefoglie Assembling, Fireworks &amp; Midnight DJ
                </h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Poolside Lawn &amp; Cellar Club. Monumental crispy pastry built live before midnight fireworks show.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold text-xs">
                  Poolside Lawn
                </span>
                <span className="text-on-surface-variant font-body-sm text-[12px]">
                  Fireworks at 22:45 CET
                </span>
              </div>
            </div>

            {/* Late Night: Pizza & Star Gazing */}
            <div className="p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-surface-container-highest">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-uppercase text-label-uppercase text-outline font-bold text-xs">
                    01:30 CET
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-uppercase text-[10px] uppercase font-semibold">
                    Late Night Comfort
                  </span>
                </div>
                <h5 className="font-headline-sm text-headline-sm text-on-surface text-[19px]">
                  Wood-Fired Pizza Oven &amp; Val d&apos;Orcia Star Gazing
                </h5>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Courtyard Brick Oven. Neapolitan slices, chilled espresso martinis &amp; astronomical telescope viewing.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold text-xs">
                  Courtyard Oven
                </span>
                <span className="text-on-surface-variant font-body-sm text-[12px]">
                  Until 03:00 CET
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
