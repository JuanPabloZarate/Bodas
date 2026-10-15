'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';

export interface ActivityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'quiz' | 'hunt' | null;
}

export function ActivityInfoModal({ isOpen, onClose, type }: ActivityInfoModalProps) {
  if (!type) return null;

  const isQuiz = type === 'quiz';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker={isQuiz ? 'Estate Tasting Challenge' : 'Villa Mystery Quest'}
      title={isQuiz ? 'Wine & Olive Oil Tasting Quiz' : 'Secret Key Hunt — Clue #1'}
      maxWidth="md"
    >
      <div className="flex flex-col gap-3 py-2 text-on-surface font-body-md">
        {isQuiz ? (
          <>
            <p className="font-light">
              Tasting game opens at <strong>15:30 CET</strong> during the Lemon Grove Courtyard
              Aperitivo.
            </p>
            <p className="font-light text-on-surface-variant text-sm">
              Our Head Sommelier, Roberto, has bottled five unlabelled test ampoules of 2021 through
              2024 Chianti Classico Riserva and cold-pressed Frantoio olive oil. Guess the harvest
              years to win an etched magnum of the couple&apos;s private cellar reserve!
            </p>
          </>
        ) : (
          <>
            <blockquote className="p-4 bg-surface-container-low rounded-xl border-l-4 border-l-secondary italic font-quote-italic text-secondary">
              &ldquo;Look where the stone nymph gazes upon the ancient olive roots, beneath the arch
              of rosemary.&rdquo;
            </blockquote>
            <p className="font-light text-on-surface-variant text-sm mt-1">
              Five antique brass keys are sequestered throughout the villa grounds. Find any key to
              unlock the gilded keepsake chest during the starlit gala banquet!
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
