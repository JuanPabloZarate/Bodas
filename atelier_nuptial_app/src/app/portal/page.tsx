'use client';

import React, { useState } from 'react';
import { useWeddingStore, FALLBACK_VIP_GUEST } from '@/context/wedding-store';
import { PortalHeader } from '@/components/portal/portal-header';
import { PortalHero } from '@/components/portal/portal-hero';
import { GuestPassCard } from '@/components/portal/guest-pass-card';
import { VillaVitals } from '@/components/portal/villa-vitals';
import { CategorizedItinerary } from '@/components/portal/categorized-itinerary';
import { PhotoMomentsHub } from '@/components/portal/photo-moments-hub';
import { QuickActivityTiles } from '@/components/portal/quick-activity-tiles';
import { PortalRegistry } from '@/components/portal/portal-registry';
import { GateQRModal } from '@/components/portal/gate-qr-modal';
import { DietaryUpdateModal } from '@/components/portal/dietary-update-modal';
import { PortalGuestbookModal } from '@/components/portal/portal-guestbook-modal';
import { DjSuggestionModal } from '@/components/portal/dj-suggestion-modal';
import { ActivityInfoModal } from '@/components/portal/activity-info-modal';
import { ToastContainer } from '@/components/ui/toast';

export default function PortalPage() {
  const {
    state,
    currentGuest,
    updateGuest,
    addPhoto,
    addGuestbookMessage,
    addSongRequest,
    contributeToRegistry,
  } = useWeddingStore();

  const activeGuest = currentGuest || FALLBACK_VIP_GUEST;

  // Modal Controllers State Machine
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDietaryModalOpen, setIsDietaryModalOpen] = useState(false);
  const [isGuestbookModalOpen, setIsGuestbookModalOpen] = useState(false);
  const [isDjModalOpen, setIsDjModalOpen] = useState(false);
  const [activityModalType, setActivityModalType] = useState<'quiz' | 'hunt' | null>(null);

  // Handlers
  const handleSaveDietary = (updates: {
    dietaryRestrictions: string[];
    dietaryNotes: string;
    shuttleTime: string;
    shuttleReserved: boolean;
  }) => {
    if (activeGuest.id) {
      updateGuest(activeGuest.id, updates);
    }
  };

  const handleUploadPhoto = (url: string, caption?: string) => {
    addPhoto({
      url,
      caption: caption || 'Memory shared on the road to Tuscany',
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table Bellini',
      category: 'all',
      filter: 'natural',
      locationTag: 'Road to Tuscany',
    });
  };

  const handleSnapLiveCamera = (filter: string) => {
    addPhoto({
      url: 'https://images.unsplash.com/photo-1519741497677-2b7374ff7e79?auto=format&fit=crop&w=800&q=80',
      caption: 'Live snapshot from the Tuscan gala',
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table Bellini',
      category: 'reception',
      filter: filter === 'vintage' ? 'golden-hour' : filter === 'bw' ? 'bw-film' : 'kodachrome',
      locationTag: 'Villa Bellissima • Live Stream',
    });
  };

  const handleGuestbookSubmit = (message: string) => {
    const hasCompanion =
      (activeGuest.partySize ?? 1) > 1 &&
      Boolean(activeGuest.companionName || activeGuest.passcode === 'JP-8421');
    const companion = activeGuest.companionName || (activeGuest.passcode === 'JP-8421' ? 'Sofia' : '');
    const authorDisplayName = hasCompanion && companion
      ? `${activeGuest.name} & ${companion}`
      : activeGuest.name;
    const authorInitials = activeGuest.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'HG';

    addGuestbookMessage({
      author: authorDisplayName,
      text: message,
      table: activeGuest.tableName || 'Table Bellini',
      initials: authorInitials,
      channel: 'villa',
      locationTag: 'Villa Bellissima West',
    });
  };

  const handleDjSubmit = (title: string, artist: string, dedication?: string) => {
    addSongRequest({
      title,
      artist,
      requester: activeGuest.name,
      dedication,
    });
  };

  return (
    <div
      data-testid="portal-page"
      className="w-full flex flex-col bg-background font-body-md text-on-surface antialiased pb-28 lg:pb-16"
    >
      {/* VIP Sub-Header Navigation Banner */}
      <PortalHeader guest={activeGuest} />

      {/* Top Subtle Texture Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-fixed/25 via-secondary-container/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Main Editorial Content Container */}
        <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg md:py-space-xl flex flex-col gap-space-xl">
          {/* Section 1: Hero & Personalized Guest Pass */}
          <section className="relative flex flex-col gap-space-lg">
            <PortalHero guest={activeGuest} />

            {/* Bento Layout: Digital Guest Pass + Quick Villa Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
              <div className="lg:col-span-8 flex flex-col">
                <GuestPassCard
                  guest={activeGuest}
                  onOpenDietaryModal={() => setIsDietaryModalOpen(true)}
                  onOpenQrModal={() => setIsQrModalOpen(true)}
                  onOpenQRModal={() => setIsQrModalOpen(true)}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col">
                <VillaVitals />
              </div>
            </div>
          </section>

          {/* Section 2: Refreshed Celebration Chronogram */}
          <CategorizedItinerary milestones={state.milestones} />

          {/* Section 3: Dedicated Activities & Live Photo Moments Hub */}
          <PhotoMomentsHub
            photos={state.photos}
            onUploadPhoto={handleUploadPhoto}
            onSnapLiveCamera={handleSnapLiveCamera}
          />

          {/* Section 3.5: Interactive Activities Quad-Grid */}
          <QuickActivityTiles
            onOpenGuestbook={() => setIsGuestbookModalOpen(true)}
            onOpenDjSuggestion={() => setIsDjModalOpen(true)}
            onOpenQuiz={() => setActivityModalType('quiz')}
            onOpenHunt={() => setActivityModalType('hunt')}
          />

          {/* Section 4: Table to Gift and Present (Nuptial Registry) */}
          <PortalRegistry
            honeymoonFund={state.registryHoneymoonFund}
            onContribute={contributeToRegistry}
          />
        </div>
      </div>

      {/* Modal Controllers */}
      <GateQRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        guest={activeGuest}
      />

      <DietaryUpdateModal
        isOpen={isDietaryModalOpen}
        onClose={() => setIsDietaryModalOpen(false)}
        guest={activeGuest}
        onSave={handleSaveDietary}
      />

      <PortalGuestbookModal
        isOpen={isGuestbookModalOpen}
        onClose={() => setIsGuestbookModalOpen(false)}
        authorName={activeGuest.name}
        onSubmit={handleGuestbookSubmit}
      />

      <DjSuggestionModal
        isOpen={isDjModalOpen}
        onClose={() => setIsDjModalOpen(false)}
        guestName={activeGuest.name}
        onSubmit={handleDjSubmit}
      />

      <ActivityInfoModal
        isOpen={activityModalType !== null}
        onClose={() => setActivityModalType(null)}
        type={activityModalType}
      />

      {/* Reactive Floating Toast Feedback */}
      <ToastContainer />
    </div>
  );
}
