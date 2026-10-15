'use client';

import React from 'react';
import { PhotoPost } from '@/lib/types';
import { MessageCircle, Download, Heart } from 'lucide-react';

export interface SpotlightPhotoProps {
  photo?: PhotoPost;
  onLike?: (photoId: string) => void;
  onKeep?: (photoId: string) => void;
}

export function SpotlightPhoto({ photo, onLike, onKeep }: SpotlightPhotoProps) {
  const currentPhoto = photo || {
    id: 'photo-spotlight',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Nuptial Kiss Beneath the Cypress Trees',
    author: 'Federico Bellini',
    table: 'Documentarian',
    likes: 142,
    locationTag: 'The Olive Terrace • 16:48 CET',
  };

  const handleLike = () => {
    if (onLike && currentPhoto.id) {
      onLike(currentPhoto.id);
    }
  };

  return (
    <div
      data-testid="photo-spotlight-card"
      className="relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest shadow-lg mb-space-lg border border-surface-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Media Frame */}
        <div className="lg:col-span-8 relative min-h-[380px] lg:min-h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Spotlight nuptial kiss photo'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent lg:hidden" />

          {/* Badge */}
          <div className="absolute top-space-md left-space-md flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface/95 backdrop-blur-md shadow-md border border-secondary-container">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="w-2 h-2 rounded-full bg-primary -ml-2" />
            <span className="font-label-uppercase text-label-uppercase font-semibold text-on-surface tracking-wider">
              Spotlight Nuptial Masterpiece
            </span>
          </div>

          {/* Live Floating Reactions Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-xs font-semibold text-on-surface shadow-xs">
              ❤️ {currentPhoto.likes || 142}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-xs font-semibold text-on-surface shadow-xs">
              🥂 89
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-xs font-semibold text-on-surface shadow-xs">
              ✨ 54
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-xs font-semibold text-on-surface shadow-xs">
              💃 36
            </span>
          </div>
        </div>

        {/* Editorial Sidebar */}
        <div className="lg:col-span-4 p-space-lg flex flex-col justify-between bg-surface-container-low">
          <div className="space-y-space-sm">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-uppercase text-label-uppercase text-secondary font-semibold tracking-widest uppercase">
                {currentPhoto.locationTag || 'The Olive Terrace • 16:48 CET'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-uppercase text-[10px] font-bold">
                Featured Cover
              </span>
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
              {currentPhoto.caption || 'The Nuptial Kiss Beneath the Cypress Trees'}
            </h3>

            <p className="font-quote-italic text-quote-italic text-secondary text-base leading-relaxed">
              &ldquo;A breathless silence across the hills, followed by spontaneous applause from every soul present.&rdquo;
            </p>

            <div className="pt-space-xs flex items-center gap-space-xs p-2 rounded-xl bg-surface/70 border border-surface-container">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-uppercase text-label-uppercase text-xs font-bold">
                FB
              </div>
              <div className="font-body-sm text-body-sm text-on-surface">
                <span className="font-medium block">
                  {currentPhoto.author || 'Federico Bellini'}
                </span>
                <span className="text-on-surface-variant text-[11px]">
                  Official Nuptial Documentarian
                </span>
              </div>
            </div>
          </div>

          <div className="pt-space-md border-t border-surface-container space-y-3">
            {/* Interactive Emoji Reactions Bar */}
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                data-testid={`btn-like-photo-${currentPhoto.id}`}
                onClick={handleLike}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-colors text-xs font-semibold cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span data-testid="photo-like-count">{currentPhoto.likes || 142}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface cursor-pointer"
              >
                <span>🥂</span> <span>89</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface cursor-pointer"
              >
                <span>✨</span> <span>54</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-semibold text-on-surface cursor-pointer"
              >
                <span>💃</span> <span>36</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 text-on-surface font-label-md text-xs hover:text-primary transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-on-surface-variant" />
                <span>18 guest remarks</span>
              </button>
              <button
                type="button"
                onClick={() => onKeep?.(currentPhoto.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-outline-variant/40 text-on-surface font-label-md text-xs hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Keepsake</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
