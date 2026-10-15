'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { PhotoPost, PhotoFilter, PhotoCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/components/ui/toast';
import {
  Camera,
  UploadCloud,
  Sparkles,
  Heart,
  Download,
  Image as ImageIcon,
  CheckCircle,
  X,
  Maximize2,
  Film,
  Sun,
  Flame,
} from 'lucide-react';

export interface PhotoMomentsHubProps {
  className?: string;
  photos?: PhotoPost[];
  onUploadPhoto?: (url: string, caption?: string) => void;
  onSnapLiveCamera?: (filter: string) => void;
}

const LIVE_FILTERS: { id: PhotoFilter; key: 'vintage' | 'bw' | 'golden' | 'natural'; label: string; icon: React.ReactNode }[] = [
  { id: 'golden-hour', key: 'vintage', label: 'Vintage Tuscan', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'bw-film', key: 'bw', label: 'B&W Film', icon: <Film className="w-3.5 h-3.5" /> },
  { id: 'kodachrome', key: 'golden', label: 'Golden Glow', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'natural', key: 'natural', label: 'Natural', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export function PhotoMomentsHub({
  className,
  photos: propPhotos,
  onUploadPhoto,
  onSnapLiveCamera,
}: PhotoMomentsHubProps) {
  const { state, addPhoto, toggleLikePhoto, currentGuest } = useWeddingStore();

  const activePhotos = propPhotos || state.photos || [];

  // Mobile segmented toggle
  const [mobileSegment, setMobileSegment] = useState<'pre-event' | 'wedding-cam'>('pre-event');
  const [selectedFilterKey, setSelectedFilterKey] = useState<'vintage' | 'bw' | 'golden' | 'natural'>('vintage');
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('golden-hour');
  const [isDragging, setIsDragging] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [shutterAlertVisible, setShutterAlertVisible] = useState(false);
  const [preEventUploadsCount, setPreEventUploadsCount] = useState<number>(42);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoPost | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<PhotoCategory>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter styles applied to live camera viewport
  const filterStyles: Record<PhotoFilter, string> = {
    'golden-hour': 'sepia-[0.35] contrast-[1.1] brightness-[1.05] saturate-[1.2]',
    'bw-film': 'grayscale contrast-[1.25] brightness-[0.95]',
    kodachrome: 'saturate-[1.4] contrast-[1.15] hue-rotate-[-10deg]',
    natural: 'filter-none',
  };

  // 1. Drag & Drop Upload Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const processUploadedFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      let simulatedUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
      try {
        if (typeof window !== 'undefined' && typeof window.URL?.createObjectURL === 'function') {
          simulatedUrl = URL.createObjectURL(file);
        }
      } catch {
        // Fallback in headless environment
      }

      if (onUploadPhoto) {
        onUploadPhoto(simulatedUrl, 'Memory shared on the road to Tuscany');
      } else {
        addPhoto({
          url: simulatedUrl,
          caption: `Road to Tuscany memory shared by ${currentGuest?.name || 'Guest'}`,
          author: currentGuest?.name || 'Juan Pablo',
          table: currentGuest?.tableName || 'Table Bellini',
          category: 'all',
          filter: 'natural',
          locationTag: 'Road to Tuscany',
        });
      }

      setPreEventUploadsCount((prev) => prev + 1);
      showToast(`${file.name} uploaded to Road to Tuscany stream!`);
    });
  };

  // 2. Live Celebration Camera Shutter Action
  const handleSnapLivePhoto = () => {
    setIsShutterActive(true);
    setShutterAlertVisible(true);

    if (onSnapLiveCamera) {
      onSnapLiveCamera(selectedFilterKey);
    } else {
      addPhoto({
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        caption: `Live Gala Camera snap by ${currentGuest?.name || 'Juan Pablo'} (${selectedFilter})`,
        author: currentGuest?.name || 'Juan Pablo',
        table: currentGuest?.tableName || 'Table Bellini',
        category: 'reception',
        filter: selectedFilter,
        locationTag: 'Villa Bellissima • Live Stream',
      });
    }

    showToast('Camera shutter engaged • Photo added to Nuptial Roll');

    setTimeout(() => {
      setIsShutterActive(false);
    }, 150);

    setTimeout(() => {
      setShutterAlertVisible(false);
    }, 3500);
  };

  // 3. Filtered Photos for Gallery Grid
  const displayedPhotos = activePhotos.filter((p) => {
    if (galleryFilter === 'all') return true;
    return p.category === galleryFilter;
  });

  const preEventMosaics = [
    {
      author: 'Elena R.',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80',
    },
    {
      author: 'Marco V.',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
    },
    {
      author: 'Juan Pablo',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section
      data-testid="photo-moments-hub"
      className={cn('flex flex-col gap-space-lg w-full', className)}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-uppercase text-label-uppercase uppercase text-secondary tracking-widest font-semibold">
              Interactive Guest Hub
            </span>
            <Badge variant="sage" size="sm" dot={true} pulseDot={true}>
              Live Sync Active
            </Badge>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Moments, Pre-Event &amp; Villa Games
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl font-light">
            Share your journey to Italy, capture live camera rolls during the gala, and
            participate in our villa scavenger and tasting challenges.
          </p>
        </div>
      </div>

      {/* Mobile Shell Parity: Segmented View Toggle */}
      <div className="lg:hidden grid grid-cols-2 p-1 rounded-lg bg-surface-container-high border border-outline-variant/30">
        <button
          type="button"
          id="preEventToggle"
          data-testid="mobile-toggle-pre-event"
          onClick={() => setMobileSegment('pre-event')}
          className={cn(
            'py-1.5 rounded-md text-center font-label-uppercase text-[11px] uppercase tracking-wider transition-all cursor-pointer',
            mobileSegment === 'pre-event'
              ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
              : 'text-on-surface-variant font-medium'
          )}
        >
          Pre-Event Snaps
        </button>
        <button
          type="button"
          id="liveDayToggle"
          data-testid="mobile-toggle-wedding-cam"
          onClick={() => setMobileSegment('wedding-cam')}
          className={cn(
            'py-1.5 rounded-md text-center font-label-uppercase text-[11px] uppercase tracking-wider transition-all cursor-pointer',
            mobileSegment === 'wedding-cam'
              ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
              : 'text-on-surface-variant font-medium'
          )}
        >
          Wedding Cam
        </button>
      </div>

      {/* Two Streams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Stream 01: Pre-Event Snaps & Preparations Uploader */}
        <div
          data-testid="stream-pre-event"
          className={cn(
            'lg:col-span-5 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col justify-between',
            mobileSegment !== 'pre-event' ? 'hidden lg:flex' : 'flex'
          )}
        >
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold">
                Stream 01 • Road to Tuscany
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {preEventUploadsCount} Guest Snaps
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Pre-Event Snaps &amp; Preparations
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant font-light">
              Share your journey: packing flatlays, airport espresso, Florence layovers, and
              rehearsal dinner previews before the ceremony.
            </p>

            {/* Drag & Drop Upload Zone */}
            <div
              id="dropzone-pre-event"
              data-testid="dropzone-pre-event"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'mt-2 p-space-lg rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group',
                isDragging
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant bg-surface-container-low/50 hover:bg-surface-container-low'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-primary transition-colors flex items-center justify-center mb-space-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface text-[18px]">
                Drop Pre-Event Photos Here
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 font-light">
                or click to browse from device (JPG, PNG, HEIC)
              </span>
              <input
                ref={fileInputRef}
                id="file-pre-event"
                data-testid="file-input-pre-event"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Uploaded Previews Mosaic */}
            <div className="mt-space-sm flex flex-col gap-space-xs">
              <span className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant text-[11px]">
                Recent Guest Additions
              </span>
              <div className="grid grid-cols-3 gap-2">
                {preEventMosaics.map((mosaic, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-surface-container"
                  >
                    <img
                      src={mosaic.url}
                      alt={mosaic.author}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px]">
                      {mosaic.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-space-md w-full py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors flex items-center justify-center gap-space-xs cursor-pointer border border-outline-variant/30"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span>Upload Pre-Event Memory</span>
          </button>
        </div>

        {/* Stream 02: Live Celebration Camera */}
        <div
          data-testid="stream-live-camera"
          className={cn(
            'lg:col-span-7 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col justify-between',
            mobileSegment !== 'wedding-cam' ? 'hidden lg:flex' : 'flex'
          )}
        >
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold">
                  Live Celebration Camera
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs font-label-uppercase uppercase">
                {LIVE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(f.id);
                      setSelectedFilterKey(f.key);
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1 cursor-pointer',
                      selectedFilter === f.id
                        ? 'bg-secondary text-on-secondary shadow-sm font-medium'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Viewfinder Frame */}
            <div className="relative w-full rounded-xl overflow-hidden bg-inverse-surface aspect-video flex items-center justify-center shadow-inner">
              {/* Shutter flash overlay */}
              {isShutterActive && (
                <div className="absolute inset-0 bg-white z-20 animate-in fade-in duration-75" />
              )}

              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Atmospheric live preview wedding photograph of Julia and Pedro laughing under ancient arches"
                className={cn(
                  'w-full h-full object-cover opacity-90 transition-all duration-300',
                  filterStyles[selectedFilter]
                )}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-transparent to-transparent flex flex-col justify-end p-space-md">
                <div className="flex items-center justify-between text-surface-container-lowest">
                  <div>
                    <span className="font-headline-sm text-headline-sm leading-tight block text-white">
                      Live Wedding Cam Feed
                    </span>
                    <span className="font-body-sm text-body-sm text-white/80 font-light">
                      Synced directly to Julia &amp; Pedro&apos;s Master Nuptial Album
                    </span>
                  </div>

                  <button
                    id="btn-snap-live"
                    data-testid="btn-snap-live"
                    type="button"
                    onClick={handleSnapLivePhoto}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-uppercase text-label-uppercase uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-on-primary" />
                    <span>Snap &amp; Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-space-md pt-space-xs">
              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm border border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-medium text-on-surface">
                    {184 + activePhotos.length} Live Photos
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-light">
                    Captured by 38 villa guests
                  </span>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm border border-outline-variant/20">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-on-primary-fixed" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-medium text-on-surface">
                    High-Res Gallery
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-light">
                    Archived after celebration
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shutter Engagement Toast Alert */}
          {shutterAlertVisible && (
            <div
              id="live-snap-alert"
              data-testid="live-snap-alert"
              className="mt-space-sm p-space-sm bg-primary-fixed text-on-primary-fixed rounded-lg text-center font-body-sm text-body-sm animate-in fade-in duration-200"
            >
              Camera shutter engaged • Photo uploaded to Nuptial Roll under &quot;Juan Pablo&quot;
            </div>
          )}
        </div>
      </div>

      {/* High-Res Gallery Preview Grid */}
      <div className="flex flex-col gap-space-md mt-space-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Celebration Shared Moments Gallery
          </h3>
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-full text-xs">
            {(['all', 'ceremony', 'reception', 'dancefloor'] as PhotoCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryFilter(cat)}
                className={cn(
                  'px-3 py-1 rounded-full font-label-uppercase uppercase text-[10px] tracking-wider transition-all cursor-pointer',
                  galleryFilter === cat
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {cat === 'all' ? 'All Snaps' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  aria-label="View full resolution"
                  onClick={() => setLightboxPhoto(photo)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px] uppercase">
                    {photo.author}
                  </span>
                  {photo.filter && (
                    <span className="px-1.5 py-0.5 rounded bg-surface/90 text-on-surface font-label-uppercase text-[8px] uppercase">
                      {photo.filter}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-space-sm flex flex-col justify-between flex-1 gap-space-xs">
                <p className="font-body-sm text-body-sm text-on-surface line-clamp-2">
                  {photo.caption}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                  <span className="font-label-uppercase text-[10px] text-outline uppercase">
                    {photo.relativeTime || photo.table}
                  </span>

                  <button
                    type="button"
                    aria-label={`Like photo by ${photo.author}`}
                    onClick={() => toggleLikePhoto(photo.id)}
                    className="flex items-center gap-1 text-secondary hover:text-tertiary transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-secondary" />
                    <span className="font-body-sm text-xs font-semibold">{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-3xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close photo preview"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-space-md flex items-center justify-between">
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  {lightboxPhoto.caption}
                </p>
                <p className="font-body-sm text-body-sm text-outline">
                  By {lightboxPhoto.author} • {lightboxPhoto.table}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleLikePhoto(lightboxPhoto.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{lightboxPhoto.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
