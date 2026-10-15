'use client';

import React from 'react';
import { TimelineMilestone } from '@/lib/types';
import { Clock, Sunset, Users, Camera, Music } from 'lucide-react';

export interface VibeTickerProps {
  currentMilestone?: TimelineMilestone;
  nextMilestone?: TimelineMilestone;
  photosCount?: number;
  totalPresent?: number;
  totalInvited?: number;
  temperature?: string;
}

export function VibeTicker({
  currentMilestone,
  nextMilestone,
  photosCount = 284,
  totalPresent = 98,
  totalInvited = 98,
  temperature = 'Golden Dusk 20°C',
}: VibeTickerProps) {
  const currentTitle = currentMilestone?.title || 'Sunset Aperitivo';
  const currentDesc = currentMilestone?.location
    ? `${currentMilestone.location} • Toasts in flow`
    : 'Bel Paese Terrace • Toasts in flow';

  const nextTitle = nextMilestone?.title || 'Grand Loggia Dinner';
  const nextNotice = nextMilestone?.badgeNotice
    ? `Seating Call ${nextMilestone.badgeNotice} (19:15 CET)`
    : 'Seating Call in 35 Minutes (19:15 CET)';

  const displayCount = photosCount && photosCount > 0 ? photosCount : 284;
  const displayPresent = totalPresent && totalPresent > 0 ? totalPresent : 98;
  const displayInvited = totalInvited && totalInvited > 0 ? totalInvited : 98;

  return (
    <div
      data-testid="bento-vibe-ticker"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-xs p-space-xs bg-surface-container-low rounded-xl shadow-sm border border-surface-container-high w-full"
    >
      {/* Tile 1: Cadence (Current Event) */}
      <div
        data-testid="vibe-tile-cadence"
        className="col-span-2 md:col-span-1 lg:col-span-1 p-space-md rounded-lg bg-surface-container flex flex-col justify-between border-l-4 border-primary"
      >
        <div className="flex items-center justify-between text-secondary mb-space-xs">
          <span className="font-label-uppercase text-label-uppercase font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Cadence
          </span>
          <Clock className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm text-on-surface leading-tight">
            {currentTitle}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {currentDesc}
          </p>
        </div>
      </div>

      {/* Tile 2: Tuscan Light */}
      <div
        data-testid="vibe-tile-light"
        className="p-space-md rounded-lg bg-surface-container flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-secondary mb-space-xs">
          <span className="font-label-uppercase text-label-uppercase font-medium">
            Tuscan Light
          </span>
          <Sunset className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm text-on-surface leading-tight">
            {temperature}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Cypress Breeze • Magic Hour
          </p>
        </div>
      </div>

      {/* Tile 3: Presence */}
      <div
        data-testid="vibe-tile-presence"
        className="p-space-md rounded-lg bg-surface-container flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-secondary mb-space-xs">
          <span className="font-label-uppercase text-label-uppercase font-medium">
            Presence
          </span>
          <Users className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm text-on-surface leading-tight">
            {displayPresent} / {displayInvited} Present
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            100% Guests Reunited &amp; Checked-in
          </p>
        </div>
      </div>

      {/* Tile 4: Shared Snaps */}
      <div
        data-testid="vibe-tile-snaps"
        className="p-space-md rounded-lg bg-surface-container flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-secondary mb-space-xs">
          <span className="font-label-uppercase text-label-uppercase font-semibold text-primary">
            Shared Snaps
          </span>
          <Camera className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="font-headline-sm text-headline-sm text-on-surface leading-tight">
            {displayCount} Photos
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            +36 uploaded this past 15m
          </p>
        </div>
      </div>

      {/* Tile 5: Live Soundscape / Next Key Moment */}
      <div
        data-testid="vibe-tile-soundscape"
        className="col-span-2 md:col-span-2 lg:col-span-1 p-space-md rounded-lg bg-primary-fixed-dim/40 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-on-primary-fixed-variant mb-space-xs">
          <span className="font-label-uppercase text-label-uppercase font-semibold">
            Live Soundscape
          </span>
          <Music className="w-4 h-4 text-primary animate-pulse" />
        </div>
        <div>
          <div className="font-body-md text-body-md font-semibold text-on-primary-fixed leading-snug line-clamp-1">
            “Estate” • Italian Jazz Trio
          </div>
          <p className="font-body-sm text-body-sm text-on-primary-fixed-variant mt-1">
            Acoustic Double Bass in Lemon Grove
          </p>
        </div>
      </div>
    </div>
  );
}
