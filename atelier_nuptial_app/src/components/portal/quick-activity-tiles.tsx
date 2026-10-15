'use client';

import React from 'react';
import { PenTool, Music, Wine, Key, ArrowRight } from 'lucide-react';

export interface QuickActivityTilesProps {
  onOpenGuestbook: () => void;
  onOpenDjSuggestion: () => void;
  onOpenQuiz: () => void;
  onOpenHunt: () => void;
}

export function QuickActivityTiles({
  onOpenGuestbook,
  onOpenDjSuggestion,
  onOpenQuiz,
  onOpenHunt,
}: QuickActivityTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* Activity 1: Digital Tuscan Guestbook */}
      <div
        data-testid="activity-guestbook"
        className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
            <PenTool className="w-5 h-5" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-background mt-space-xs">
            Tuscan Guestbook
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-light">
            Inscribe your digital blessings and private wishes directly into our leatherbound
            printed keepsake.
          </p>
        </div>
        <button
          type="button"
          id="btn-open-guestbook"
          data-testid="btn-open-guestbook"
          onClick={onOpenGuestbook}
          className="mt-space-md text-left font-label-uppercase text-label-uppercase uppercase text-primary font-semibold hover:text-primary-container flex items-center gap-1 cursor-pointer"
        >
          <span>Write Dedication</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity 2: DJ Song Recommender */}
      <div
        data-testid="activity-dj"
        className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <Music className="w-5 h-5" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-background mt-space-xs">
            Midnight DJ Curation
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-light">
            Request an Italian disco track or timeless romantic anthem for the midnight poolside
            celebration.
          </p>
        </div>
        <button
          type="button"
          id="btn-open-music"
          data-testid="btn-open-dj"
          onClick={onOpenDjSuggestion}
          className="mt-space-md text-left font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold hover:text-tertiary flex items-center gap-1 cursor-pointer"
        >
          <span>Suggest a Track</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity 3: Tuscan Olive & Wine Game */}
      <div
        data-testid="activity-quiz"
        className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
            <Wine className="w-5 h-5" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-background mt-space-xs">
            Wine &amp; Olive Oil Quiz
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-light">
            Guess the harvest year and vintage of Villa Bellissima&apos;s cold-pressed estate olive oil
            during aperitivo.
          </p>
        </div>
        <button
          type="button"
          id="btn-open-quiz"
          data-testid="btn-open-quiz"
          onClick={onOpenQuiz}
          className="mt-space-md text-left font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold hover:text-tertiary flex items-center gap-1 cursor-pointer"
        >
          <span>Start Tasting Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity 4: Golden Key Scavenger Hunt */}
      <div
        data-testid="activity-hunt"
        className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30"
      >
        <div className="flex flex-col gap-space-xs">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-background mt-space-xs">
            Secret Key Hunt
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-light">
            Five antique brass keys hidden across the lemon grove and fountain labyrinth. Solve
            riddle 01.
          </p>
        </div>
        <button
          type="button"
          id="btn-open-hunt"
          data-testid="btn-open-hunt"
          onClick={onOpenHunt}
          className="mt-space-md text-left font-label-uppercase text-label-uppercase uppercase text-primary font-semibold hover:text-primary-container flex items-center gap-1 cursor-pointer"
        >
          <span>View First Clue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
