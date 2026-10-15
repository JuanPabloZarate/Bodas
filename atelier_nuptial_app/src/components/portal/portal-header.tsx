'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Guest } from '@/lib/types';
import {
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
} from 'lucide-react';

export interface PortalHeaderProps {
  guest?: Guest;
  villaName?: string;
  className?: string;
  onToggleSoundscape?: (isPlaying: boolean) => void;
}

export function PortalHeader({
  guest: propGuest,
  villaName = 'Villa Cetinale',
  className,
  onToggleSoundscape,
}: PortalHeaderProps) {
  const { currentGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const guestName = guest?.name || 'Juan Pablo';
  const passcode = guest?.passcode || 'JP-8421';

  // Toggle ambient Tuscan soundscape simulation via Web Audio API
  const handleToggleAudio = () => {
    const nextState = !isPlayingAudio;
    setIsPlayingAudio(nextState);

    if (nextState) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(220, ctx.currentTime); // A3
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4

          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();

          audioCtxRef.current = ctx;
          gainNodeRef.current = gain;
        }
      } catch (e) {
        // Audio synthesis fallback
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.exponentialRampToValueAtTime(
            0.0001,
            audioCtxRef.current.currentTime + 0.4
          );
          setTimeout(() => {
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
          }, 500);
        } catch (e) {
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
        }
      }
    }

    if (onToggleSoundscape) {
      onToggleSoundscape(nextState);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      role="banner"
      aria-label="VIP Portal Header"
      className={cn(
        'w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(44,37,35,0.04)] transition-all',
        className
      )}
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-3 flex flex-wrap items-center justify-between gap-space-sm">
        {/* Left: Monogram and VIP Greeting Strip */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex flex-col items-start leading-none">
            <span className="font-headline-md text-headline-sm tracking-widest text-primary font-serif">
              J &amp; P
            </span>
            <span className="font-label-uppercase text-[10px] text-secondary tracking-widest uppercase mt-0.5">
              Tuscany • 2026
            </span>
          </div>

          <div className="flex flex-col border-l border-outline-variant/60 pl-space-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider">
                Welcome, {guestName}
              </span>
            </div>
            <span className="font-label-uppercase text-label-uppercase text-primary font-medium tracking-widest uppercase mt-0.5">
              VIP Guest • {villaName}
            </span>
          </div>
        </div>

        {/* Center: Navigation Jump Chips (Desktop) */}
        <nav
          aria-label="Portal Quick Jump"
          className="hidden md:flex items-center gap-space-sm"
        >
          <a
            href="#pass"
            className="px-3 py-1 rounded-full text-xs font-label-uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors uppercase tracking-wider"
          >
            Guest Pass
          </a>
          <a
            href="#vitals"
            className="px-3 py-1 rounded-full text-xs font-label-uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors uppercase tracking-wider"
          >
            Villa Vitals
          </a>
          <a
            href="#itinerary"
            className="px-3 py-1 rounded-full text-xs font-label-uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors uppercase tracking-wider"
          >
            Schedule
          </a>
          <a
            href="#memories"
            className="px-3 py-1 rounded-full text-xs font-label-uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors uppercase tracking-wider"
          >
            Memories
          </a>
        </nav>

        {/* Right: Soundscape Indicator & Passcode Badge */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Soundscape Indicator Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? 'Mute Tuscan soundscape' : 'Play Tuscan soundscape'}
            className={cn(
              'h-9 px-3 rounded-full flex items-center gap-2 transition-all cursor-pointer border',
              isPlayingAudio
                ? 'bg-primary-fixed text-on-primary-fixed border-primary/30 shadow-sm'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-outline-variant/30'
            )}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-primary animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-on-surface-variant" />
            )}

            {/* Sound Wave Bars */}
            <div className="flex items-end gap-0.5 h-3 w-3.5">
              <span
                className={cn(
                  'w-0.5 bg-primary rounded-full transition-all duration-300',
                  isPlayingAudio ? 'h-3 animate-pulse' : 'h-1 opacity-50'
                )}
              />
              <span
                className={cn(
                  'w-0.5 bg-primary rounded-full transition-all duration-300 delay-75',
                  isPlayingAudio ? 'h-2 animate-bounce' : 'h-1.5 opacity-50'
                )}
              />
              <span
                className={cn(
                  'w-0.5 bg-primary rounded-full transition-all duration-300 delay-150',
                  isPlayingAudio ? 'h-3.5 animate-pulse' : 'h-1 opacity-50'
                )}
              />
            </div>

            <span className="hidden sm:inline font-label-uppercase text-[11px] tracking-wider uppercase text-on-surface">
              {isPlayingAudio ? 'Tuscan Strings' : 'Soundscape'}
            </span>
          </button>

          {/* Guest Passcode Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface-variant font-label-uppercase text-[11px] tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Pass #{passcode}</span>
          </div>

          {/* Guest Avatar */}
          <div
            title={`${guestName} • Verified VIP Guest`}
            className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
