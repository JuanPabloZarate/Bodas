'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Countdown } from '@/components/ui/countdown';
import { Button } from '@/components/ui/button';
import { Guest } from '@/lib/types';
import { Mail, Calendar, Heart } from 'lucide-react';

export interface LandingHeroProps {
  guest?: Guest;
  targetDate?: string;
  className?: string;
}

export function LandingHero({
  guest: propGuest,
  targetDate = '2026-11-26T15:30:00',
  className,
}: LandingHeroProps) {
  const { currentGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  const guestName = guest?.name || 'Juan Pablo';

  return (
    <section
      aria-label="Wedding Invitation Hero"
      className={cn(
        'w-full relative overflow-hidden bg-surface py-space-lg md:py-space-xl',
        className
      )}
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left Column: Letterpress Invitation Styling */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 pr-0 lg:pr-space-md">
            {/* Kicker Ribbon */}
            <div className="flex items-center gap-space-xs mb-space-xs sm:mb-space-sm">
              <span className="w-8 h-[1px] bg-secondary-container" />
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest">
                Personal Invitation for
              </span>
            </div>

            {/* Main Greeting & Couple Header */}
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface mb-space-xs tracking-tight">
              Hello, {guestName}
            </h1>

            <p className="font-headline-sm text-headline-sm text-primary mb-space-sm md:mb-space-md italic">
              Welcome to the Wedding of Julia &amp; Pedro
            </p>

            <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-[520px]">
              With profound happiness and grateful hearts, we warmly invite you to join us on this
              sacred day of love, vows, and revelry under the timeless Tuscan canopy.
            </p>

            {/* When & Where Editorial Metadata Cards */}
            <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
              <div className="p-space-md bg-surface-container rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-label-uppercase text-label-uppercase text-tertiary block mb-1">
                  When
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">26 Nov 2026</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Thursday, 15:30 CET
                </p>
              </div>

              <div className="p-space-md bg-surface-container rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-label-uppercase text-label-uppercase text-tertiary block mb-1">
                  Where
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">Villa Bellissima</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Greve in Chianti, Tuscany
                </p>
              </div>
            </div>

            {/* Embedded Live Countdown Component */}
            <div className="mb-space-lg">
              <Countdown targetDate={targetDate} variant="boxed" />
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <a href="#rsvp">
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<Mail className="w-4 h-4" />}
                >
                  Respond with RSVP
                </Button>
              </a>

              <a href="#chronogram">
                <Button
                  variant="secondary"
                  size="md"
                  iconLeft={<Calendar className="w-4 h-4" />}
                >
                  Day Schedule
                </Button>
              </a>

              <Link href="/portal">
                <Button variant="outline" size="md">
                  VIP Guest Pass
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Cathedral Arch Portrait Frame & Floating Gold Seal */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center relative">
            <div className="relative w-full max-w-[480px]">
              {/* Diffused Ambient Glow Behind Arch */}
              <div
                className="absolute -top-4 -right-4 w-full h-full bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Architectural Cathedral Arch Frame */}
              <div className="relative rounded-t-[220px] rounded-b-2xl overflow-hidden shadow-2xl bg-surface-container-low p-2 border border-outline-variant/40">
                {/* Couple Portrait Image with Warm Tuscan Fine-Art Treatment */}
                <div className="relative w-full h-[480px] sm:h-[560px] md:h-[580px] rounded-t-[212px] rounded-b-xl overflow-hidden bg-surface-container-high">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                    alt="Julia and Pedro wedding portrait amidst ancient Tuscan olive groves and terracotta estate"
                    className="w-full h-full object-cover rounded-t-[212px] rounded-b-xl"
                  />
                  {/* Subtle golden vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Gold Monogram Seal Medallion */}
                <div
                  className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-surface/90 backdrop-blur-md rounded-full shadow-lg p-2 flex items-center justify-center border border-tertiary-fixed-dim/60 transition-transform hover:scale-105"
                  title="Julia & Pedro Wax Seal Crest"
                >
                  <div className="w-full h-full rounded-full border border-secondary/40 flex flex-col items-center justify-center text-secondary select-none">
                    <span className="font-headline-sm italic text-lg leading-none">J&amp;P</span>
                    <span className="font-label-uppercase text-[8px] uppercase tracking-widest mt-0.5 text-tertiary">
                      2026
                    </span>
                  </div>
                </div>

                {/* Bottom Overlaid Glassmorphism Plaque */}
                <div className="absolute bottom-4 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-space-md bg-surface/90 backdrop-blur-md rounded-xl shadow-md text-center border border-outline-variant/30">
                  <span className="font-label-uppercase text-[10px] sm:text-label-uppercase text-secondary tracking-widest uppercase block mb-1">
                    Celebration of Unity
                  </span>
                  <p className="font-headline-sm text-base sm:text-headline-sm text-on-surface">Julia &amp; Pedro</p>
                  <p className="font-quote-italic text-quote-italic text-on-surface-variant text-xs sm:text-sm mt-1">
                    &ldquo;Two souls, one destiny amid Tuscan olive boughs.&rdquo;
                  </p>
                </div>
              </div>

              {/* Handcrafted Honorary Badge */}
              <div className="absolute -bottom-3 left-2 sm:-left-4 bg-primary text-on-primary py-1.5 px-3 sm:py-2 sm:px-4 rounded-full shadow-lg flex items-center gap-1.5 sm:gap-2 border border-primary-container">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
                <span className="font-label-uppercase text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold">
                  Honorary Guest • Table Bellini
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
