'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';

export interface DjSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName?: string;
  onSubmit: (title: string, artist: string, dedication?: string) => void;
}

export function DjSuggestionModal({
  isOpen,
  onClose,
  onSubmit,
}: DjSuggestionModalProps) {
  const [trackTitle, setTrackTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [dedication, setDedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;

    onSubmit(trackTitle.trim(), artist.trim() || 'Guest Choice', dedication.trim());
    showToast(`"${trackTitle}" added to DJ pool for review!`);
    setTrackTitle('');
    setArtist('');
    setDedication('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Midnight Soundscape"
      title="Midnight DJ Track Curation"
      description="Propose a romantic Italian ballad or late-night dancefloor anthem for the poolside set."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-1">
          <label className="font-label-uppercase text-xs uppercase text-on-surface-variant">
            Track Title
          </label>
          <input
            type="text"
            data-testid="dj-track-title-input"
            required
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            placeholder="e.g., L'Italiano or Via Con Me"
            className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-uppercase text-xs uppercase text-on-surface-variant">
            Artist / Band
          </label>
          <input
            type="text"
            data-testid="dj-artist-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g., Paolo Conte"
            className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-uppercase text-xs uppercase text-on-surface-variant">
            Dedication (Optional)
          </label>
          <input
            type="text"
            value={dedication}
            onChange={(e) => setDedication(e.target.value)}
            placeholder="For the newlyweds' first dance"
            className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface text-body-md border border-outline-variant/40 outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs mt-space-xs border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-uppercase text-label-uppercase uppercase text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="btn-submit-dj-song"
            className="px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary-container text-on-secondary font-label-uppercase text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Submit to DJ Queue
          </button>
        </div>
      </form>
    </Modal>
  );
}
