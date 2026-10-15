'use client';

import React, { useState, useMemo } from 'react';
import { useWeddingStore, FALLBACK_VIP_GUEST } from '@/context/wedding-store';
import {
  PulseHeader,
  VibeTicker,
  PhotoMarquee,
  PhotoStreamSection,
  SplitChronogram,
  EmotionalCheersStrip,
  GuestLoungeSection,
  DjSongQueue,
  AdminPulsesSection,
  PhotoUploadModal,
  AudioToastModal,
  SongRequestModal,
} from '@/components/pulse';
import { ToastContainer, showToast } from '@/components/ui/toast';
import { PhotoFilter, PhotoCategory } from '@/lib/types';

export default function PulsePage() {
  const {
    state,
    currentGuest,
    kpis,
    addPhoto,
    toggleLikePhoto,
    addReaction,
    addGuestbookMessage,
    addSongRequest,
    voteSongRequest,
  } = useWeddingStore();

  const activeGuest = currentGuest || FALLBACK_VIP_GUEST;

  // Modal State Machines
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  // Derived state
  const currentMilestone = useMemo(
    () => state.milestones.find((m) => m.status === 'current'),
    [state.milestones]
  );
  const nextMilestone = useMemo(
    () => state.milestones.find((m) => m.status === 'upcoming'),
    [state.milestones]
  );

  // Handlers
  const handleScrollTo = (id: string) => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUploadPhoto = (data: {
    url: string;
    caption: string;
    filter: PhotoFilter;
    category: PhotoCategory;
  }) => {
    addPhoto({
      url: data.url,
      caption: data.caption,
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table 4 • Bellini',
      category: data.category,
      filter: data.filter,
      locationTag: 'Villa Bellissima • Live Stream',
    });
    showToast('Photo posted live to Moments in Motion!');
    setIsPhotoModalOpen(false);
  };

  const handleQuickUploadPreset = (filter: PhotoFilter) => {
    const sampleUrls: Record<PhotoFilter, string> = {
      'golden-hour':
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'bw-film':
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      'kodachrome':
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      natural:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    };

    addPhoto({
      url: sampleUrls[filter] || sampleUrls['golden-hour'],
      caption: `Candid snap filtered with ${filter}`,
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table 4 • Bellini',
      category: 'reception',
      filter,
      locationTag: 'Terrace Bel Paese',
    });
    showToast(`Instant snap with ${filter} shared to stream!`);
  };

  const handleSendLoungeMessage = (data: {
    text: string;
    channel: 'table' | 'villa' | 'bridal_party' | 'all';
    audioDuration?: number;
  }) => {
    const initials =
      activeGuest.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'JP';

    addGuestbookMessage({
      author: activeGuest.name,
      text: data.text,
      table: activeGuest.tableName || 'Table 4 • Bellini',
      initials,
      channel: data.channel,
      locationTag: 'Villa Bellissima',
      audioDuration: data.audioDuration,
    });
    showToast('Message sent to celebration stream!');
  };

  const handleSendAudioToast = (duration: number, text?: string) => {
    handleSendLoungeMessage({
      text: text || `Voice toast from ${activeGuest.name}!`,
      channel: 'table',
      audioDuration: duration,
    });
    setIsAudioModalOpen(false);
  };

  const handleProposeSong = (
    title: string,
    artist: string,
    dedication?: string
  ) => {
    addSongRequest({
      title,
      artist,
      requester: activeGuest.name,
      dedication,
      votes: 1,
      status: 'queued',
    });
    showToast(`Suggested "${title}" to Maestro!`);
    setIsSongModalOpen(false);
  };

  const handleVoteSong = (songId: string) => {
    voteSongRequest(songId);
    showToast('Vote cast for DJ queue!');
  };

  return (
    <div
      data-testid="pulse-page"
      className="w-full flex flex-col bg-background font-body-md text-on-surface antialiased pb-28 lg:pb-16 selection:bg-secondary-container selection:text-on-secondary-container"
    >
      {/* 1. Atmospheric Hero Header */}
      <PulseHeader
        guest={activeGuest}
        onDropSnapClick={() => handleScrollTo('photo-stream')}
        onSendBlessingClick={() => handleScrollTo('guest-lounge')}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 w-[700px] h-[700px] rounded-full bg-secondary-container/20 blur-[130px]" />
        <div className="pointer-events-none absolute top-[480px] -left-32 w-[550px] h-[550px] rounded-full bg-primary-fixed/25 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-gutter flex flex-col gap-space-lg">
          {/* 2. Bento Live Vibe Ticker */}
          <VibeTicker
            currentMilestone={currentMilestone}
            nextMilestone={nextMilestone}
            photosCount={state.photos.length}
            totalPresent={kpis.totalAttending}
            totalInvited={kpis.totalAttending}
          />

          {/* 3. Real-Time Photo Marquee Strip */}
          <PhotoMarquee photos={state.photos} />

          {/* 4. Tap-to-Cheer Live Reactions Floater */}
          <EmotionalCheersStrip
            reactions={state.reactions}
            onTriggerReaction={addReaction}
            onCheerPhrase={(phrase) =>
              showToast(`Cheered "${phrase}" to the whole villa!`)
            }
          />

          {/* 5. Live Shared Photo Stream ("Moments in Motion") */}
          <section id="photo-stream">
            <PhotoStreamSection
              photos={state.photos}
              currentGuest={activeGuest}
              onLikePhoto={toggleLikePhoto}
              onOpenUploadModal={() => setIsPhotoModalOpen(true)}
              onQuickUploadPhoto={handleQuickUploadPreset}
            />
          </section>

          {/* 6. Split Celebration Milestones & Chronogram */}
          <section id="milestones">
            <SplitChronogram
              milestones={state.milestones}
              progressPercent={65}
            />
          </section>

          {/* 7. Guest-to-Guest Lounge & Live Table Conclave */}
          <section id="guest-lounge">
            <GuestLoungeSection
              messages={state.guestbook}
              currentGuest={activeGuest}
              onSendMessage={handleSendLoungeMessage}
              onOpenAudioModal={() => setIsAudioModalOpen(true)}
            />
          </section>

          {/* 8. Live DJ Song Request Queue & Voting */}
          <section id="dj-queue">
            <DjSongQueue
              songs={state.songRequests}
              currentGuest={activeGuest}
              onVoteSong={handleVoteSong}
              onOpenRequestModal={() => setIsSongModalOpen(true)}
            />
          </section>

          {/* 9. Official Nuptial Command & Admin Pulses */}
          <section id="admin-pulses">
            <AdminPulsesSection
              kpis={{
                totalAttending: kpis.totalAttending,
                totalInvited: kpis.totalInvited,
                dietaryNeeds: kpis.dietaryNeeds,
              }}
            />
          </section>
        </div>
      </div>

      {/* Interactive Modal Controllers */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentGuest={activeGuest}
        onUpload={handleUploadPhoto}
      />

      <AudioToastModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        currentGuest={activeGuest}
        channel="table"
        onSendAudio={handleSendAudioToast}
      />

      <SongRequestModal
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        currentGuest={activeGuest}
        onSubmit={handleProposeSong}
      />

      {/* Reactive Floating Toast Feedback */}
      <ToastContainer />
    </div>
  );
}
