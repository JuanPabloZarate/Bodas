'use client';

import React, { useState, useEffect } from 'react';
import { Guest } from '@/lib/types';

export interface PortalHeroProps {
  guest?: Guest;
}

export function PortalHero({ guest }: PortalHeroProps) {
  // Wedding target: Nov 26, 2026, 15:30 CET
  const [timeLeft, setTimeLeft] = useState({
    days: 46,
    hours: 14,
    minutes: 28,
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-26T15:30:00+01:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        setTimeLeft({ days, hours, minutes });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b-0">
      <div className="flex flex-col gap-space-xs">
        {/* Top Kicker */}
        <div className="flex items-center gap-space-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-uppercase text-label-uppercase uppercase text-secondary tracking-widest">
            Villa Bellissima • Siena, Tuscany
          </span>
          <span className="text-outline-variant text-xs">•</span>
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase">
            26 November 2026
          </span>
        </div>

        {/* Personalized Welcome */}
        <h1 className="font-display-hero text-headline-lg md:text-display-hero text-on-background tracking-tight">
          Welcome to the Celebration,{' '}
          <span className="italic font-quote-italic text-primary">
            {guest?.name || 'Honored Guest'}
          </span>
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light">
          We have curated this private atelier space to accompany your journey
          through our vows, banquets, and midnight festivities across the hills
          of Siena.
        </p>
      </div>

      {/* Countdown Widget */}
      <div
        data-testid="portal-countdown-widget"
        className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded-xl shadow-sm self-start md:self-auto shrink-0 border border-outline-variant/30"
      >
        <div className="flex flex-col text-center">
          <span
            className="font-display-hero text-headline-md text-primary font-medium leading-none"
            data-testid="countdown-days"
          >
            {timeLeft.days}
          </span>
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase mt-1">
            Days
          </span>
        </div>
        <div className="text-outline-variant font-display-hero text-headline-sm leading-none">
          :
        </div>
        <div className="flex flex-col text-center">
          <span
            className="font-display-hero text-headline-md text-primary font-medium leading-none"
            data-testid="countdown-hours"
          >
            {timeLeft.hours}
          </span>
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase mt-1">
            Hours
          </span>
        </div>
        <div className="text-outline-variant font-display-hero text-headline-sm leading-none">
          :
        </div>
        <div className="flex flex-col text-center">
          <span
            className="font-display-hero text-headline-md text-primary font-medium leading-none"
            data-testid="countdown-mins"
          >
            {timeLeft.minutes}
          </span>
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase mt-1">
            Mins
          </span>
        </div>
      </div>
    </div>
  );
}
