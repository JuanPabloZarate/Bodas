'use client';

import React, { useState } from 'react';
import { GuestbookMessage } from '@/lib/types';
import { Play, Pause } from 'lucide-react';

export interface LoungeMessageItemProps {
  message: GuestbookMessage;
  onCheer?: (messageId: string, type: string) => void;
}

export function LoungeMessageItem({ message, onCheer }: LoungeMessageItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const initials =
    message.initials ||
    message.author
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'HG';

  const channelBadge =
    message.channel === 'table'
      ? `To ${message.table || 'Table 4 • Bellini'}`
      : message.channel === 'bridal_party'
      ? 'Bridal Party & Honor'
      : message.channel === 'villa'
      ? 'Villa Broadcast'
      : 'Celebration Broadcast';

  const isAudio = Boolean(message.audioDuration && message.audioDuration > 0);

  return (
    <div
      data-testid={`lounge-message-${message.id}`}
      className="flex items-start gap-space-sm p-space-sm rounded-2xl bg-surface-container-low border border-surface-container/60 w-full"
    >
      {/* Avatar Initials */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-uppercase text-xs font-bold ring-2 ring-secondary/30">
          {initials}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label-md text-xs font-bold text-on-surface">
              {message.author}
            </span>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-uppercase text-[9px] font-semibold uppercase">
              {channelBadge}
            </span>
          </div>
          <span className="font-label-uppercase text-[10px] text-on-surface-variant shrink-0">
            {message.timestamp?.includes('T')
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now'}
          </span>
        </div>

        {/* Audio Waveform Player if voice memo */}
        {isAudio ? (
          <div
            data-testid="audio-toast-player"
            className="mt-1.5 p-2 rounded-xl bg-surface flex items-center justify-between gap-3 border border-secondary-container/40"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="btn-play-voice-toast"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-xs cursor-pointer hover:bg-on-primary-fixed-variant transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Voice Toast: &ldquo;{message.text}&rdquo;
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  0:{message.audioDuration?.toString().padStart(2, '0') || '14'} • Audio Snippet
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 h-4">
              <span
                className={`w-1 h-3 bg-secondary rounded-full ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
              />
              <span className="w-1 h-4 bg-primary rounded-full" />
              <span className="w-1 h-2 bg-secondary rounded-full" />
              <span
                className={`w-1 h-5 bg-primary rounded-full ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
              />
              <span className="w-1 h-3 bg-secondary rounded-full" />
            </div>
          </div>
        ) : (
          <p className="font-body-md text-sm text-on-surface mt-1 leading-relaxed">
            &ldquo;{message.text}&rdquo;
          </p>
        )}

        {/* Reaction Buttons */}
        <div className="mt-2 flex items-center gap-3 text-secondary font-label-md text-xs">
          <button
            type="button"
            onClick={() => onCheer?.(message.id, 'cincin')}
            className="hover:text-primary transition-colors flex items-center gap-1 bg-surface px-2.5 py-1 rounded-full border border-surface-container shadow-xs cursor-pointer"
          >
            🥂 <span>Cin Cin (8)</span>
          </button>
          <button
            type="button"
            onClick={() => onCheer?.(message.id, 'heart')}
            className="hover:text-primary transition-colors flex items-center gap-1 bg-surface px-2.5 py-1 rounded-full border border-surface-container shadow-xs cursor-pointer"
          >
            ❤️ <span>(14)</span>
          </button>
          <button
            type="button"
            className="text-on-surface-variant hover:text-on-surface text-[11px] font-medium ml-1 cursor-pointer"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}
