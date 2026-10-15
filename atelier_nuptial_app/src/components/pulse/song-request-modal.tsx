'use client';

import React, { useState } from 'react';
import { Guest } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Music, Disc } from 'lucide-react';

export interface SongRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuest: Guest;
  onSubmit: (title: string, artist: string, dedication?: string) => void;
}

export function SongRequestModal({
  isOpen,
  onClose,
  currentGuest,
  onSubmit,
}: SongRequestModalProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [dedication, setDedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    onSubmit(title.trim(), artist.trim(), dedication.trim());
    setTitle('');
    setArtist('');
    setDedication('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose Song to Maestro"
      kicker="Midnight DJ Curation"
      description="Request an Italian disco track, vintage anthem, or slow romance for Julia & Pedro's dancefloor."
    >
      <div data-testid="song-request-modal" className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          {/* Song Title */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="song-title"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Song Title
            </label>
            <input
              id="song-title"
              data-testid="song-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Volare, Sara Perche Ti Amo, September..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline-variant font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Artist */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="song-artist"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Artist / Performer
            </label>
            <input
              id="song-artist"
              data-testid="song-artist-input"
              type="text"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. Domenico Modugno, Ricchi e Poveri..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline-variant font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Dedication */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="song-dedication"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Dedication &amp; Note
            </label>
            <textarea
              id="song-dedication"
              data-testid="song-dedication-input"
              rows={2}
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="e.g. For Nonna & Family, or Julia & Pedro's second slow dance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline-variant font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="p-space-xs rounded-xl bg-surface-container-low border border-surface-container flex items-center gap-2 text-xs text-on-surface-variant font-label-md">
            <Disc className="w-4 h-4 text-primary shrink-0 animate-spin" />
            <span>
              Proposing as <strong>{currentGuest.name}</strong> ({currentGuest.tableName || 'Table Bellini'}). Starts with 1 vote in DJ queue.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="btn-submit-song"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-on-primary-fixed-variant font-label-uppercase text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Music className="w-4 h-4 text-on-primary" />
              <span>Submit to DJ Queue</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
