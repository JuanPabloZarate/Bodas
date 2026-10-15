'use client';

import React from 'react';
import { VIPBanner } from '@/components/landing/vip-banner';
import { LandingHero } from '@/components/landing/landing-hero';
import { CoupleStory } from '@/components/landing/couple-story';
import { ChronogramTimeline } from '@/components/landing/chronogram-timeline';
import { RSVPSection } from '@/components/landing/rsvp-section';
import { GuestbookSection } from '@/components/landing/guestbook-section';
import { RegistrySection } from '@/components/landing/registry-section';
import { FloatingRsvpBadge } from '@/components/landing/floating-rsvp-badge';
import { ToastContainer } from '@/components/ui/toast';

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col bg-surface pb-24 lg:pb-0" data-testid="landing-page">
      {/* 1. VIP Personalized Welcome Header Strip */}
      <VIPBanner />

      {/* 2. Hero & Letterpress Invitation */}
      <LandingHero />

      {/* 3. Couple Journey & Love Story */}
      <CoupleStory />

      {/* 4. Wedding Chronogram / Schedule of Festivities */}
      <ChronogramTimeline />

      {/* 5. Interactive RSVP Enclosure Card */}
      <RSVPSection />

      {/* 6. Digital Guestbook & Words of Love */}
      <GuestbookSection />

      {/* 7. Mesa de Regalos / Table to Gift & Present */}
      <RegistrySection />

      {/* 8. Floating Quick RSVP Action Badge */}
      <FloatingRsvpBadge />

      {/* 9. Mobile Feedback Toast Pill */}
      <ToastContainer />
    </div>
  );
}
