'use client';

import React, { useState, useMemo } from 'react';
import { Guest, PhotoPost, PhotoFilter, PhotoCategory } from '@/lib/types';
import { PhotoUploadTray } from './photo-upload-tray';
import { SpotlightPhoto } from './spotlight-photo';
import { PhotoCard } from './photo-card';
import { Camera, Sparkles } from 'lucide-react';

export interface PhotoStreamSectionProps {
  photos: PhotoPost[];
  currentGuest: Guest;
  onLikePhoto: (photoId: string) => void;
  onOpenUploadModal: () => void;
  onQuickUploadPhoto: (filter: PhotoFilter) => void;
}

export function PhotoStreamSection({
  photos,
  currentGuest,
  onLikePhoto,
  onOpenUploadModal,
  onQuickUploadPhoto,
}: PhotoStreamSectionProps) {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all');

  // Spotlight photo: either flagged with isSpotlight or first photo with spotlight ID
  const spotlightPhoto = useMemo(() => {
    return photos.find((p) => p.isSpotlight || p.id === 'photo-spotlight') || photos[0];
  }, [photos]);

  // Candid photos in the masonry grid exclude the featured spotlight photo
  const masonryPhotos = useMemo(() => {
    return photos.filter((p) => p.id !== spotlightPhoto?.id);
  }, [photos, spotlightPhoto]);

  // Filtered by selected category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return masonryPhotos;
    return masonryPhotos.filter((p) => p.category === activeCategory);
  }, [masonryPhotos, activeCategory]);

  return (
    <div data-testid="photo-stream-section" className="w-full">
      {/* Section Deck */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <Camera className="w-5 h-5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
              Atelier Gallery Live Sync • {photos.length} Snaps
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Moments in Motion
          </h2>
          <p className="font-quote-italic text-quote-italic text-secondary">
            A living mosaic of spontaneous laughter, golden hour vows, and clinking crystal.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-space-xs" id="photo-filters">
          <button
            type="button"
            data-testid="photo-filter-all"
            onClick={() => setActiveCategory('all')}
            className={`px-space-sm py-1.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {activeCategory === 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-on-primary" />
            )}
            All Live Snaps ({photos.length})
          </button>

          <button
            type="button"
            data-testid="photo-filter-ceremony"
            onClick={() => setActiveCategory('ceremony')}
            className={`px-space-sm py-1.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'ceremony'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Ceremony Vows (74)
          </button>

          <button
            type="button"
            data-testid="photo-filter-reception"
            onClick={() => setActiveCategory('reception')}
            className={`px-space-sm py-1.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'reception'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Sunset Aperitivo (118)
          </button>

          <button
            type="button"
            data-testid="photo-filter-dancefloor"
            onClick={() => setActiveCategory('dancefloor')}
            className={`px-space-sm py-1.5 rounded-full font-label-uppercase text-label-uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'dancefloor'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Dancefloor &amp; Toasts
          </button>
        </div>
      </div>

      {/* Prominent Instant Camera & Upload Balustrade Bar */}
      <PhotoUploadTray
        currentGuest={currentGuest}
        onOpenModal={onOpenUploadModal}
        onQuickUpload={onQuickUploadPhoto}
      />

      {/* Live Spotlight Masterpiece Banner */}
      {spotlightPhoto && (
        <SpotlightPhoto photo={spotlightPhoto} onLike={onLikePhoto} />
      )}

      {/* Rich Live Photo Masonry Grid */}
      <div
        data-testid="photo-masonry-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"
      >
        {filteredPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onLike={onLikePhoto} />
        ))}

        {filteredPhotos.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface-container-low rounded-2xl border border-surface-container">
            <Sparkles className="w-8 h-8 text-secondary mx-auto mb-2 opacity-60" />
            <h4 className="font-headline-sm text-on-surface">No moments in this collection yet</h4>
            <p className="font-body-sm text-outline mt-1">Be the first to capture and share a snap!</p>
          </div>
        )}
      </div>
    </div>
  );
}
