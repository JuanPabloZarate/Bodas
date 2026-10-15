'use client';

import React, { useState } from 'react';
import { ReactionCount } from '@/lib/types';

export interface EmotionalCheersStripProps {
  reactions?: ReactionCount;
  onTriggerReaction: (type: keyof ReactionCount) => void;
  onCheerPhrase?: (phrase: string) => void;
}

interface FloatingParticle {
  id: number;
  emoji: string;
  left: number;
}

export function EmotionalCheersStrip({
  reactions,
  onTriggerReaction,
  onCheerPhrase,
}: EmotionalCheersStripProps) {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  const cheerItems: Array<{
    type: keyof ReactionCount;
    testId: string;
    emoji: string;
    label: string;
    count: number;
  }> = [
    {
      type: 'cinCin',
      testId: 'cheer-cin-cin',
      emoji: '🥂',
      label: '“Cin Cin!”',
      count: reactions?.cinCin ?? 189,
    },
    {
      type: 'prosecco',
      testId: 'cheer-prosecco',
      emoji: '🍾',
      label: '“Pop the Prosecco!”',
      count: reactions?.prosecco ?? 145,
    },
    {
      type: 'hearts',
      testId: 'cheer-hearts',
      emoji: '❤️',
      label: '“Pure Love!”',
      count: reactions?.hearts ?? 320,
    },
    {
      type: 'dance',
      testId: 'cheer-dance',
      emoji: '💃',
      label: '“To the Dancefloor!”',
      count: reactions?.dance ?? 98,
    },
    {
      type: 'bravo',
      testId: 'cheer-bravo',
      emoji: '🎻',
      label: '“Bravo Maestro!”',
      count: reactions?.bravo ?? 74,
    },
  ];

  const handleCheer = (
    type: keyof ReactionCount,
    emoji: string,
    label: string
  ) => {
    onTriggerReaction(type);
    onCheerPhrase?.(label);

    // Spawn animated floating emoji particle
    const newParticle: FloatingParticle = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.random() * 80 + 10,
    };

    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);
  };

  return (
    <div
      data-testid="emotional-reactions-strip"
      className="p-space-sm rounded-2xl bg-secondary-fixed/40 border border-secondary/20 mb-space-md flex flex-wrap items-center justify-between gap-2 shadow-xs relative overflow-visible w-full"
    >
      {/* Floating Particles Area */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={{ left: `${p.left}%` }}
          className="pointer-events-none absolute -top-8 text-2xl animate-bounce transition-all duration-1000 z-30"
        >
          {p.emoji}
        </span>
      ))}

      <div className="flex items-center gap-2">
        <span className="font-label-uppercase text-xs font-bold text-secondary uppercase tracking-wider">
          Tap to Cheer Instantly:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {cheerItems.map((item) => (
          <button
            key={item.type}
            type="button"
            data-testid={item.testId}
            onClick={() => handleCheer(item.type, item.emoji, item.label)}
            className="px-3 py-1.5 rounded-full bg-surface text-on-surface hover:bg-secondary-container hover:text-on-secondary-container font-label-md text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer border border-surface-container"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
            <span className="ml-1 text-[11px] text-secondary font-bold">
              ({item.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
