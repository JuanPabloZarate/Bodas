'use client';

import React from 'react';
import { PhotoPost } from '@/lib/types';
import { MapPin, Heart, MessageCircle } from 'lucide-react';

export interface PhotoCardProps {
  photo: PhotoPost;
  onLike: (photoId: string) => void;
}

export function PhotoCard({ photo, onLike }: PhotoCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'GT';
  };

  return (
    <div
      data-testid={`photo-card-${photo.id}`}
      className="group rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-surface-container w-full"
    >
      {/* Photo Frame */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Location Badge */}
        {photo.locationTag && (
          <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-on-surface font-label-uppercase text-[10px] font-semibold flex items-center gap-1 shadow-xs">
            <MapPin className="w-3 h-3 text-secondary" />
            <span>{photo.locationTag}</span>
          </div>
        )}

        {/* Timestamp */}
        <div className="absolute top-3 right-3 bg-primary/90 text-on-primary px-2 py-0.5 rounded-full font-label-uppercase text-[10px] font-semibold">
          {photo.relativeTime || 'Live • 3m ago'}
        </div>

        {/* Floating Quick Count Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <span className="px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-sm text-[11px] font-semibold text-on-surface shadow-xs">
            🥂 28
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-sm text-[11px] font-semibold text-on-surface shadow-xs">
            ❤️ {photo.likes}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-space-md flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-space-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-uppercase text-[10px] font-bold ring-2 ring-secondary/20">
                {getInitials(photo.author)}
              </div>
              <div>
                <span className="font-label-md text-xs font-semibold text-on-surface block">
                  {photo.author}
                </span>
                <span className="text-on-surface-variant text-[11px]">
                  {photo.table || 'Table 4 • Bellini'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-on-surface-variant font-label-uppercase">
              {photo.relativeTime || '3m ago'}
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            &ldquo;{photo.caption}&rdquo;
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-space-sm mt-space-xs border-t border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid={`btn-like-photo-${photo.id}`}
              onClick={() => onLike(photo.id)}
              className="flex items-center gap-1 text-tertiary hover:scale-110 transition-transform font-label-md text-xs font-semibold cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span data-testid="photo-like-count">{photo.likes}</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1 text-secondary hover:scale-110 transition-transform font-label-md text-xs font-semibold cursor-pointer"
            >
              <span>🥂</span>
              <span>28</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>4 comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
