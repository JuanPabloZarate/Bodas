'use client';

import React from 'react';
import { PhotoPost } from '@/lib/types';

export interface PhotoMarqueeProps {
  photos?: PhotoPost[];
  onPhotoClick?: (photo: PhotoPost) => void;
}

export function PhotoMarquee({ photos = [], onPhotoClick }: PhotoMarqueeProps) {
  // If photos list is passed, use first 6 non-spotlight photos or fallbacks
  const candidPhotos = photos.filter(
    (p) => !p.isSpotlight && p.id !== 'photo-spotlight'
  );
  const displayPhotos = candidPhotos.length > 0
    ? candidPhotos.slice(0, 6)
    : [
        {
          id: 'mock-1',
          author: 'Sofia Rossi',
          caption: 'Spritz cheers on Terrace',
          relativeTime: '18s ago',
        },
        {
          id: 'mock-2',
          author: 'Matteo R.',
          caption: 'Master Roberto crafting Gin Fizz',
          relativeTime: '1m ago',
        },
        {
          id: 'mock-3',
          author: 'Camilla S.',
          caption: 'Loggia candelabras lit up',
          relativeTime: '3m ago',
        },
        {
          id: 'mock-4',
          author: 'Luca P.',
          caption: 'Sunset panorama over cypress',
          relativeTime: '4m ago',
        },
      ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const colors = [
    'bg-secondary text-on-secondary',
    'bg-primary text-on-primary',
    'bg-tertiary text-on-tertiary',
    'bg-surface-dim text-on-surface',
  ];

  return (
    <div
      data-testid="live-photo-marquee"
      className="max-w-7xl mx-auto px-gutter mb-space-md w-full"
    >
      <div className="flex items-center gap-space-sm p-2 px-4 rounded-full bg-secondary-fixed/50 border border-secondary/20 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="font-label-uppercase text-[11px] font-bold tracking-wider text-secondary uppercase">
            Just Shared Live:
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-label-md text-on-surface overflow-x-auto whitespace-nowrap no-scrollbar">
          {displayPhotos.map((item, idx) => {
            const initials = getInitials(item.author || 'Guest');
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={item.id}
                onClick={() => onPhotoClick && 'url' in item && onPhotoClick(item as PhotoPost)}
                className="inline-flex items-center gap-1.5 bg-surface/80 px-2.5 py-1 rounded-full cursor-pointer hover:bg-surface transition-colors shrink-0"
              >
                <span
                  className={`w-4 h-4 rounded-full ${colorClass} text-[9px] flex items-center justify-center font-bold`}
                >
                  {initials}
                </span>
                <strong>{item.author}</strong> uploaded{' '}
                <em>&ldquo;{item.caption}&rdquo;</em>
                {item.relativeTime && (
                  <span className="text-on-surface-variant font-light">
                    • {item.relativeTime}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
